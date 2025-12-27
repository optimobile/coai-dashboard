import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { AuditLoggingService } from "../services/auditLogging";

export const auditRouter = router({
  /**
   * Get audit logs with filtering
   */
  getAuditLogs: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await AuditLoggingService.getAuditLogs({
        userId: input.userId,
        action: input.action,
        resource: input.resource,
        startDate: input.startDate,
        endDate: input.endDate,
        limit: input.limit,
        offset: input.offset,
      });
    }),

  /**
   * Get single audit log
   */
  getAuditLog: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await AuditLoggingService.getAuditLog(input.id);
    }),

  /**
   * Search audit logs
   */
  searchAuditLogs: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await AuditLoggingService.searchAuditLogs(input.query);
    }),

  /**
   * Get audit statistics
   */
  getAuditStats: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      return await AuditLoggingService.getAuditStats(
        input.startDate,
        input.endDate
      );
    }),

  /**
   * Generate audit report
   */
  generateAuditReport: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        resourceType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const report = await AuditLoggingService.generateAuditReport(
        input.startDate,
        input.endDate,
        input.resourceType
      );

      return {
        content: report,
        generatedAt: new Date(),
        startDate: input.startDate,
        endDate: input.endDate,
      };
    }),

  /**
   * Export audit logs as CSV
   */
  exportAuditLogsAsCSV: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const csv = await AuditLoggingService.exportAuditLogs("csv", {
        userId: input.userId,
        action: input.action,
        resource: input.resource,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      return {
        data: csv,
        filename: `audit-logs-${new Date().toISOString().split("T")[0]}.csv`,
        mimeType: "text/csv",
      };
    }),

  /**
   * Export audit logs as JSON
   */
  exportAuditLogsAsJSON: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        action: z.string().optional(),
        resource: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const json = await AuditLoggingService.exportAuditLogs("json", {
        userId: input.userId,
        action: input.action,
        resource: input.resource,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      return {
        data: json,
        filename: `audit-logs-${new Date().toISOString().split("T")[0]}.json`,
        mimeType: "application/json",
      };
    }),

  /**
   * Archive old audit logs
   */
  archiveOldLogs: protectedProcedure
    .input(
      z.object({
        daysToKeep: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const archivedCount = await AuditLoggingService.archiveOldLogs(
        input.daysToKeep || 90
      );

      return {
        archivedCount,
        message: `Successfully archived ${archivedCount} audit logs`,
      };
    }),

  /**
   * Get audit log count
   */
  getLogCount: protectedProcedure.query(async () => {
    return {
      count: AuditLoggingService.getLogCount(),
    };
  }),

  /**
   * Get audit trail for a specific resource
   */
  getResourceAuditTrail: protectedProcedure
    .input(
      z.object({
        resource: z.string(),
        resourceId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const logs = await AuditLoggingService.getAuditLogs({
        resource: input.resource,
        limit: 100,
      });

      return logs.filter((log) => log.resourceId === input.resourceId);
    }),

  /**
   * Get user activity
   */
  getUserActivity: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      return await AuditLoggingService.getAuditLogs({
        userId: input.userId,
        startDate: input.startDate,
        endDate: input.endDate,
        limit: 100,
      });
    }),
});
