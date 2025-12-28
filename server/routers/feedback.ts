import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '../db';
import { userFeedback } from '../db/schema';
import { eq, desc, and, isNotNull, sql } from 'drizzle-orm';

export const feedbackRouter = router({
  // Submit feedback (public)
  submit: publicProcedure
    .input(
      z.object({
        category: z.enum(['training', 'ui', 'features', 'other']),
        feedback: z.string().min(10).max(5000),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(userFeedback).values({
        category: input.category,
        content: input.feedback,
        email: input.email,
        userId: ctx.user?.id,
        createdAt: new Date(),
      });

      return {
        success: true,
        id: result[0],
      };
    }),

  // Get feedback statistics (admin only)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const allFeedback = await db
      .select()
      .from(userFeedback);

    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    const monthlyFeedback = await db
      .select()
      .from(userFeedback)
      .where(sql`${userFeedback.createdAt} > ${thisMonth}`);

    // Category breakdown
    const byCategory = {
      training: allFeedback.filter(f => f.category === 'training').length,
      ui: allFeedback.filter(f => f.category === 'ui').length,
      features: allFeedback.filter(f => f.category === 'features').length,
      other: allFeedback.filter(f => f.category === 'other').length,
    };

    const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0]?.[0];
    const responseRate = allFeedback.length > 0
      ? Math.round((allFeedback.filter(f => f.email).length / allFeedback.length) * 100)
      : 0;

    // Trend data (last 30 days)
    const trendData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = allFeedback.filter(
        f => new Date(f.createdAt).toDateString() === date.toDateString()
      ).length;

      trendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      });
    }

    return {
      total: allFeedback.length,
      thisMonth: monthlyFeedback.length,
      byCategory,
      topCategory,
      responseRate,
      trend: trendData,
    };
  }),

  // List feedback (admin only)
  list: protectedProcedure
    .input(
      z.object({
        category: z.enum(['training', 'ui', 'features', 'other']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const query = db
        .select()
        .from(userFeedback)
        .orderBy(desc(userFeedback.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.category) {
        query.where(eq(userFeedback.category, input.category));
      }

      return query;
    }),

  // Get feedback by ID (admin only)
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const result = await db
        .select()
        .from(userFeedback)
        .where(eq(userFeedback.id, input.id));

      return result[0];
    }),

  // Update feedback status (admin only)
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(['new', 'reviewed', 'actioned', 'archived']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      await db
        .update(userFeedback)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(userFeedback.id, input.id));

      return { success: true };
    }),

  // Add response to feedback (admin only)
  addResponse: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        response: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      await db
        .update(userFeedback)
        .set({
          adminResponse: input.response,
          respondedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userFeedback.id, input.id));

      return { success: true };
    }),

  // Export feedback (admin only)
  export: protectedProcedure
    .input(
      z.object({
        format: z.enum(['csv', 'json']).default('csv'),
        category: z.enum(['training', 'ui', 'features', 'other']).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      let query = db.select().from(userFeedback);

      if (input.category) {
        query = query.where(eq(userFeedback.category, input.category));
      }

      const feedback = await query;

      if (input.format === 'json') {
        return {
          format: 'json',
          data: feedback,
        };
      }

      // CSV format
      const headers = ['ID', 'Category', 'Feedback', 'Email', 'Status', 'Created At'];
      const rows = feedback.map(f => [
        f.id,
        f.category,
        `"${f.content.replace(/"/g, '""')}"`,
        f.email || '',
        f.status,
        new Date(f.createdAt).toISOString(),
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

      return {
        format: 'csv',
        data: csv,
      };
    }),
});
