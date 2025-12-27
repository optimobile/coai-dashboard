/**
 * Admin Oversight Router
 * tRPC endpoints for exam analytics, certificate review, and cheating detection
 */

import { router, protectedProcedure } from '@/server/_core/trpc';
import { z } from 'zod';
import { AdminExamOversightService } from '@/server/services/adminExamOversight';
import { TRPCError } from '@trpc/server';

export const adminOversightRouter = router({
  /**
   * Get comprehensive exam analytics
   */
  getExamAnalytics: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const analytics = await AdminExamOversightService.getExamAnalytics(
          input.startDate,
          input.endDate,
        );
        return analytics;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get exam analytics',
        });
      }
    }),

  /**
   * Get flagged certificates requiring review
   */
  getFlaggedCertificates: protectedProcedure
    .input(
      z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const certificates = await AdminExamOversightService.getFlaggedCertificates(
          input.status,
        );
        return certificates;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get flagged certificates',
        });
      }
    }),

  /**
   * Review flagged certificate
   */
  reviewCertificate: protectedProcedure
    .input(
      z.object({
        certificateId: z.number(),
        decision: z.enum(['approve', 'reject']),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await AdminExamOversightService.reviewFlaggedCertificate(
          input.certificateId,
          input.decision,
          input.notes || '',
        );
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to review certificate',
        });
      }
    }),

  /**
   * Get exam attempt details
   */
  getExamAttemptDetails: protectedProcedure
    .input(z.object({ attemptId: z.number() }))
    .query(async ({ input }) => {
      try {
        const details = await AdminExamOversightService.getExamAttemptDetails(
          input.attemptId,
        );
        return details;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get exam attempt details',
        });
      }
    }),

  /**
   * Get statistics by certification level
   */
  getStatsByLevel: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const stats = await AdminExamOversightService.getStatsByLevel(
          input.startDate,
          input.endDate,
        );
        return stats;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get statistics by level',
        });
      }
    }),

  /**
   * Detect cheating patterns
   */
  detectCheatingPatterns: protectedProcedure.query(async () => {
    try {
      const patterns = await AdminExamOversightService.detectCheatingPatterns();
      return patterns;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to detect cheating patterns',
      });
    }
  }),
});
