/**
 * Legal Router
 * tRPC endpoints for legal case management, assignments, and notifications
 */

import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { LegalNotificationService } from '../services/legalNotificationService';
import { LegalAnalyticsService } from '../services/legalAnalyticsService';
import { TRPCError } from '@trpc/server';

export const legalRouter = router({
  /**
   * Assign a legal case to a barrister
   */
  assignCaseToBarrister: protectedProcedure
    .input(
      z.object({
        caseId: z.number(),
        flagId: z.number(),
        barristerEmail: z.string().email(),
        barristerName: z.string(),
        violationType: z.string(),
        riskScore: z.number().min(0).max(100),
        summary: z.string(),
        deadline: z.date(),
        actionUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Send assignment notification
        const result = await LegalNotificationService.notifyCaseAssignment({
          caseId: input.caseId,
          flagId: input.flagId,
          barristerEmail: input.barristerEmail,
          barristerName: input.barristerName,
          violationType: input.violationType,
          riskScore: input.riskScore,
          summary: input.summary,
          deadline: input.deadline,
          actionUrl: input.actionUrl,
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to send notification: ${result.error}`,
          });
        }

        return {
          success: true,
          messageId: result.messageId,
          message: 'Case assigned and notification sent',
        };
      } catch (error) {
        console.error('Error assigning case:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to assign case',
        });
      }
    }),

  /**
   * Update case status and notify barrister
   */
  updateCaseStatus: protectedProcedure
    .input(
      z.object({
        caseId: z.number(),
        status: z.enum(['approved', 'rejected', 'pending', 'in_review']),
        barristerEmail: z.string().email(),
        barristerName: z.string(),
        feedback: z.string().optional(),
        actionUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await LegalNotificationService.notifyCaseStatusUpdate({
          caseId: input.caseId,
          barristerEmail: input.barristerEmail,
          barristerName: input.barristerName,
          status: input.status,
          feedback: input.feedback,
          actionUrl: input.actionUrl,
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to send notification: ${result.error}`,
          });
        }

        return {
          success: true,
          messageId: result.messageId,
          message: 'Case status updated and notification sent',
        };
      } catch (error) {
        console.error('Error updating case status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update case status',
        });
      }
    }),

  /**
   * Send urgent alert for critical cases
   */
  sendUrgentAlert: protectedProcedure
    .input(
      z.object({
        barristerEmail: z.string().email(),
        barristerName: z.string(),
        alertType: z.string(),
        description: z.string(),
        caseCount: z.number(),
        actionUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await LegalNotificationService.sendUrgentAlert({
          barristerEmail: input.barristerEmail,
          barristerName: input.barristerName,
          alertType: input.alertType,
          description: input.description,
          caseCount: input.caseCount,
          actionUrl: input.actionUrl,
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to send alert: ${result.error}`,
          });
        }

        return {
          success: true,
          messageId: result.messageId,
          message: 'Urgent alert sent',
        };
      } catch (error) {
        console.error('Error sending urgent alert:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send urgent alert',
        });
      }
    }),

  /**
   * Get violation trends
   */
  getViolationTrends: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
        violations: z.array(
          z.object({
            date: z.string(),
            category: z.string(),
            riskScore: z.number(),
          })
        ),
      })
    )
    .query(({ input }) => {
      try {
        const trends = LegalAnalyticsService.calculateViolationTrends(
          input.violations,
          input.days
        );
        return { success: true, trends };
      } catch (error) {
        console.error('Error calculating violation trends:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to calculate violation trends',
        });
      }
    }),

  /**
   * Get enforcement authority metrics
   */
  getEnforcementMetrics: protectedProcedure
    .input(
      z.object({
        cases: z.array(
          z.object({
            authority: z.string(),
            jurisdiction: z.string(),
            createdAt: z.date(),
            resolvedAt: z.date().optional(),
            status: z.string(),
          })
        ),
      })
    )
    .query(({ input }) => {
      try {
        const metrics = LegalAnalyticsService.calculateEnforcementMetrics(
          input.cases
        );
        return { success: true, metrics };
      } catch (error) {
        console.error('Error calculating enforcement metrics:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to calculate enforcement metrics',
        });
      }
    }),

  /**
   * Get risk predictions
   */
  getRiskPredictions: protectedProcedure
    .input(
      z.object({
        period: z.enum(['30_days', '60_days', '90_days']).default('30_days'),
        historicalData: z.array(
          z.object({
            date: z.string(),
            riskScore: z.number(),
          })
        ),
      })
    )
    .query(({ input }) => {
      try {
        const prediction = LegalAnalyticsService.predictRiskTrends(
          input.historicalData,
          input.period
        );
        return { success: true, prediction };
      } catch (error) {
        console.error('Error predicting risk trends:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to predict risk trends',
        });
      }
    }),

  /**
   * Get compliance trend report
   */
  getComplianceTrends: protectedProcedure
    .input(
      z.object({
        violations: z.array(
          z.object({
            date: z.string(),
            jurisdiction: z.string(),
            sector: z.string(),
            severity: z.enum(['critical', 'high', 'medium', 'low']),
          })
        ),
      })
    )
    .query(({ input }) => {
      try {
        const trends = LegalAnalyticsService.generateComplianceTrendReport(
          input.violations
        );
        return { success: true, trends };
      } catch (error) {
        console.error('Error generating compliance trends:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate compliance trends',
        });
      }
    }),

  /**
   * Get analytics summary for dashboard
   */
  getAnalyticsSummary: protectedProcedure
    .input(
      z.object({
        flags: z.array(
          z.object({
            createdAt: z.date(),
            riskScore: z.number(),
            status: z.string(),
            violationTypes: z.array(z.string()),
            jurisdiction: z.string().optional(),
          })
        ),
      })
    )
    .query(({ input }) => {
      try {
        const summary = LegalAnalyticsService.generateAnalyticsSummary(
          input.flags
        );
        return { success: true, summary };
      } catch (error) {
        console.error('Error generating analytics summary:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate analytics summary',
        });
      }
    }),
});
