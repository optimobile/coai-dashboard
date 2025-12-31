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
import { eq, and, gte, lte, desc, sql, count } from "drizzle-orm";

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
        metadata: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(analyticsEvents).values({
        eventType: input.eventType,
        userId: input.userId || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
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

      // Get funnel data aggregated from conversionFunnels table
      const startDateStr = startDate instanceof Date ? startDate.toISOString() : startDate;
      const endDateStr = endDate instanceof Date ? endDate.toISOString() : endDate;
      const funnelData = await db
        .select()
        .from(conversionFunnels)
        .where(
          and(
            gte(conversionFunnels.timestamp, startDateStr),
            lte(conversionFunnels.timestamp, endDateStr)
          )
        )
        .orderBy(desc(conversionFunnels.timestamp));

      if (!funnelData.length) return null;

      // Aggregate funnel steps
      const signupStarts = funnelData.filter(f => f.step === 'signup' && f.completed === 0).length;
      const signupCompletes = funnelData.filter(f => f.step === 'signup' && f.completed === 1).length;
      const conversionRate = signupStarts > 0 ? (signupCompletes / signupStarts) * 100 : 0;

      return {
        signupStarts,
        signupCompletes,
        conversionRate,
        dropoffRate: 100 - conversionRate,
        recordedAt: funnelData[0].timestamp,
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
      const startDateStr2 = startDate instanceof Date ? startDate.toISOString() : startDate;
      const endDateStr2 = endDate instanceof Date ? endDate.toISOString() : endDate;

      const metrics = await db
        .select()
        .from(paymentAnalytics)
        .where(
          and(
            gte(paymentAnalytics.createdAt, startDateStr2),
            lte(paymentAnalytics.createdAt, endDateStr2)
          )
        )
        .orderBy(desc(paymentAnalytics.createdAt));

      if (!metrics.length) return null;

      // Aggregate payment metrics
      const totalTransactions = metrics.length;
      const successfulTransactions = metrics.filter(m => m.status === 'completed').length;
      const failedTransactions = metrics.filter(m => m.status === 'failed').length;
      const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
      const totalRevenue = metrics
        .filter(m => m.status === 'completed')
        .reduce((sum, m) => sum + parseFloat(m.amount), 0);
      const averageTransactionValue = successfulTransactions > 0 ? totalRevenue / successfulTransactions : 0;

      return {
        totalTransactions,
        successfulTransactions,
        failedTransactions,
        successRate,
        totalRevenue,
        averageTransactionValue,
        recordedAt: metrics[0].createdAt,
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
      const startDateStr3 = startDate instanceof Date ? startDate.toISOString() : startDate;
      const endDateStr3 = endDate instanceof Date ? endDate.toISOString() : endDate;

      let whereConditions = and(
        gte(courseCompletionTracking.createdAt, startDateStr3),
        lte(courseCompletionTracking.createdAt, endDateStr3)
      );

      if (input.courseId) {
        whereConditions = and(
          whereConditions,
          eq(courseCompletionTracking.courseId, input.courseId)
        );
      }

      const stats = await db
        .select()
        .from(courseCompletionTracking)
        .where(whereConditions)
        .orderBy(desc(courseCompletionTracking.createdAt));

      if (!stats.length) return null;

      // Aggregate completion stats
      const enrolledCount = stats.length;
      const completedCount = stats.filter(s => s.certificateIssued === 1).length;
      const completionRate = enrolledCount > 0 ? (completedCount / enrolledCount) * 100 : 0;

      return {
        courseId: input.courseId || null,
        enrolledCount,
        completedCount,
        completionRate,
        averageTimeToCompletion: null, // Not tracked in current schema
        recordedAt: stats[0].createdAt,
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
      const startDateStr4 = startDate instanceof Date ? startDate.toISOString() : startDate;
      const endDateStr4 = endDate instanceof Date ? endDate.toISOString() : endDate;

      // Get recommendation analytics for the user
      const analytics = await db
        .select()
        .from(recommendationAnalytics)
        .where(
          and(
            gte(recommendationAnalytics.createdAt, startDateStr4),
            lte(recommendationAnalytics.createdAt, endDateStr4)
          )
        )
        .orderBy(desc(recommendationAnalytics.createdAt));

      return analytics.map((a: any) => ({
        period: a.period,
        periodType: a.periodType,
        totalGenerated: a.totalGenerated,
        totalViewed: a.totalViewed,
        totalImplemented: a.totalImplemented,
        totalDismissed: a.totalDismissed,
        helpfulCount: a.helpfulCount,
        notHelpfulCount: a.notHelpfulCount,
        recordedAt: a.createdAt,
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

    const successCount = paymentSuccessEvents[0]?.count || 0;
    const failedCount = paymentFailedEvents[0]?.count || 0;
    const totalPayments = successCount + failedCount;

    return {
      signupsLast24h: signupEvents[0]?.count || 0,
      paymentsSuccessLast24h: successCount,
      paymentsFailedLast24h: failedCount,
      courseCompletionsLast24h: courseCompletionEvents[0]?.count || 0,
      paymentSuccessRate: totalPayments > 0 ? ((successCount / totalPayments) * 100).toFixed(2) : "0",
      timestamp: new Date().toISOString(),
    };
  }),
});
