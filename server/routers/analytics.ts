/**
 * Analytics Router
 * Handles real-time metrics for signup conversion rates, payment success rates, and course completion tracking
 */

import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  analyticsEvents,
  conversionFunnels,
  paymentAnalytics,
  courseCompletionTracking,
  recommendationAnalytics,
} from "../../drizzle/schema";
import { eq, and, gte, lte, desc, sql, count, avg } from "drizzle-orm";

export const analyticsRouter = router({
  // Track an analytics event
  trackEvent: publicProcedure
    .input(
      z.object({
        eventType: z.enum([
          "signup_started",
          "signup_completed",
          "payment_initiated",
          "payment_completed",
          "payment_failed",
          "course_started",
          "course_completed",
          "exam_passed",
          "exam_failed",
        ]),
        userId: z.number().optional(),
        metadata: z.record(z.any()).optional(),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(analyticsEvents).values({
        eventType: input.eventType,
        userId: input.userId || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        sessionId: input.sessionId || null,
        ipAddress: ctx.req?.ip || null,
        userAgent: ctx.req?.get("user-agent") || null,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  // Get signup conversion funnel
  getSignupConversionFunnel: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate || new Date();

      const funnelData = await db
        .select()
        .from(conversionFunnels)
        .where(
          and(
            gte(conversionFunnels.recordedAt, startDate.toISOString()),
            lte(conversionFunnels.recordedAt, endDate.toISOString())
          )
        )
        .orderBy(desc(conversionFunnels.recordedAt));

      if (!funnelData.length) return null;

      const latest = funnelData[0];
      return {
        signupStarts: latest.signupStarts,
        signupCompletes: latest.signupCompletes,
        conversionRate: latest.conversionRate,
        dropoffRate: 100 - (latest.conversionRate || 0),
        recordedAt: latest.recordedAt,
      };
    }),

  // Get payment success metrics
  getPaymentMetrics: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate || new Date();

      const metrics = await db
        .select()
        .from(paymentAnalytics)
        .where(
          and(
            gte(paymentAnalytics.recordedAt, startDate.toISOString()),
            lte(paymentAnalytics.recordedAt, endDate.toISOString())
          )
        )
        .orderBy(desc(paymentAnalytics.recordedAt));

      if (!metrics.length) return null;

      const latest = metrics[0];
      return {
        totalTransactions: latest.totalTransactions,
        successfulTransactions: latest.successfulTransactions,
        failedTransactions: latest.failedTransactions,
        successRate: latest.successRate,
        totalRevenue: latest.totalRevenue,
        averageTransactionValue: latest.averageTransactionValue,
        recordedAt: latest.recordedAt,
      };
    }),

  // Get course completion stats
  getCourseCompletionStats: publicProcedure
    .input(
      z.object({
        courseId: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate || new Date();

      let query = db
        .select()
        .from(courseCompletionTracking)
        .where(
          and(
            gte(courseCompletionTracking.recordedAt, startDate.toISOString()),
            lte(courseCompletionTracking.recordedAt, endDate.toISOString())
          )
        );

      if (input.courseId) {
        query = query.where(eq(courseCompletionTracking.courseId, input.courseId));
      }

      const stats = await query.orderBy(desc(courseCompletionTracking.recordedAt));

      if (!stats.length) return null;

      const latest = stats[0];
      return {
        courseId: latest.courseId,
        enrolledCount: latest.enrolledCount,
        completedCount: latest.completedCount,
        completionRate: latest.completionRate,
        averageTimeToCompletion: latest.averageTimeToCompletion,
        recordedAt: latest.recordedAt,
      };
    }),

  // Get user behavior analytics
  getUserBehaviorAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = input.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate || new Date();

      const analytics = await db
        .select()
        .from(recommendationAnalytics)
        .where(
          and(
            eq(recommendationAnalytics.userId, ctx.user.id),
            gte(recommendationAnalytics.recordedAt, startDate.toISOString()),
            lte(recommendationAnalytics.recordedAt, endDate.toISOString())
          )
        )
        .orderBy(desc(recommendationAnalytics.recordedAt));

      return analytics.map((a) => ({
        userId: a.userId,
        sessionCount: a.sessionCount,
        totalTimeSpent: a.totalTimeSpent,
        coursesEnrolled: a.coursesEnrolled,
        coursesCompleted: a.coursesCompleted,
        certificationsEarned: a.certificationsEarned,
        lastActivityAt: a.lastActivityAt,
        recordedAt: a.recordedAt,
      }));
    }),

  // Get real-time dashboard metrics
  getDashboardMetrics: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get signup events
    const signupEvents = await db
      .select({ count: count() })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, "signup_completed"),
          gte(analyticsEvents.createdAt, last24Hours.toISOString())
        )
      );

    // Get payment events
    const paymentSuccessEvents = await db
      .select({ count: count() })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, "payment_completed"),
          gte(analyticsEvents.createdAt, last24Hours.toISOString())
        )
      );

    const paymentFailedEvents = await db
      .select({ count: count() })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, "payment_failed"),
          gte(analyticsEvents.createdAt, last24Hours.toISOString())
        )
      );

    // Get course completion events
    const courseCompletionEvents = await db
      .select({ count: count() })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, "course_completed"),
          gte(analyticsEvents.createdAt, last24Hours.toISOString())
        )
      );

    return {
      signupsLast24h: signupEvents[0]?.count || 0,
      paymentsSuccessLast24h: paymentSuccessEvents[0]?.count || 0,
      paymentsFailedLast24h: paymentFailedEvents[0]?.count || 0,
      courseCompletionsLast24h: courseCompletionEvents[0]?.count || 0,
      paymentSuccessRate:
        paymentSuccessEvents[0] && paymentFailedEvents[0]
          ? (
              (paymentSuccessEvents[0].count /
                (paymentSuccessEvents[0].count + paymentFailedEvents[0].count)) *
              100
            ).toFixed(2)
          : 0,
      timestamp: new Date(),
    };
  }),
});
