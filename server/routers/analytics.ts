import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { ComplianceTrendAnalysisService } from "../services/complianceTrendAnalysis";
import { CustomReportBuilderService } from "../services/customReportBuilder";
import { DataExportService } from "../services/dataExport";

export const analyticsRouter = router({
  /**
   * Get compliance trends over a date range
   */
  getComplianceTrends: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        framework: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await ComplianceTrendAnalysisService.getComplianceTrends(
        input.startDate,
        input.endDate,
        input.framework
      );
    }),

  /**
   * Get current compliance metrics snapshot
   */
  getMetricsSnapshot: protectedProcedure.query(async () => {
    return await ComplianceTrendAnalysisService.getMetricsSnapshot();
  }),

  /**
   * Get framework comparison
   */
  getFrameworkComparison: protectedProcedure.query(async () => {
    return await ComplianceTrendAnalysisService.getFrameworkComparison();
  }),

  /**
   * Get incident patterns
   */
  getIncidentPatterns: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      return await ComplianceTrendAnalysisService.getIncidentPatterns(
        input.startDate,
        input.endDate
      );
    }),

  /**
   * Get compliance gaps for a framework
   */
  getComplianceGaps: protectedProcedure
    .input(
      z.object({
        framework: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await ComplianceTrendAnalysisService.getComplianceGaps(
        input.framework
      );
    }),

  /**
   * Get predictive compliance score
   */
  getPredictiveScore: protectedProcedure
    .input(
      z.object({
        systemId: z.string(),
        daysAhead: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await ComplianceTrendAnalysisService.getPredictiveScore(
        input.systemId,
        input.daysAhead
      );
    }),

  /**
   * Get available report templates
   */
  getReportTemplates: protectedProcedure.query(async () => {
    return CustomReportBuilderService.getAvailableTemplates();
  }),

  /**
   * Generate custom report
   */
  generateCustomReport: protectedProcedure
    .input(
      z.object({
        template: z.string(),
        framework: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        filters: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await CustomReportBuilderService.buildReport(
        input.template,
        input.framework,
        input.startDate,
        input.endDate,
        input.filters
      );
    }),

  /**
   * Export report as PDF
   */
  exportReportAsPDF: protectedProcedure
    .input(
      z.object({
        reportId: z.string(),
        template: z.string(),
        framework: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        filters: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const report = await CustomReportBuilderService.buildReport(
        input.template,
        input.framework,
        input.startDate,
        input.endDate,
        input.filters
      );

      const pdfBuffer = await DataExportService.exportAsPDF(report);
      const filename = DataExportService.getExportFilename(
        input.framework,
        "pdf"
      );

      return {
        filename,
        size: pdfBuffer.length,
        mimeType: DataExportService.getMimeType("pdf"),
      };
    }),

  /**
   * Export report as CSV
   */
  exportReportAsCSV: protectedProcedure
    .input(
      z.object({
        reportId: z.string(),
        template: z.string(),
        framework: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        filters: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const report = await CustomReportBuilderService.buildReport(
        input.template,
        input.framework,
        input.startDate,
        input.endDate,
        input.filters
      );

      const csvContent = await DataExportService.exportAsCSV(report);
      const filename = DataExportService.getExportFilename(
        input.framework,
        "csv"
      );

      return {
        filename,
        size: csvContent.length,
        mimeType: DataExportService.getMimeType("csv"),
      };
    }),

  /**
   * Export report as JSON
   */
  exportReportAsJSON: protectedProcedure
    .input(
      z.object({
        reportId: z.string(),
        template: z.string(),
        framework: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        filters: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const report = await CustomReportBuilderService.buildReport(
        input.template,
        input.framework,
        input.startDate,
        input.endDate,
        input.filters
      );

      const jsonContent = await DataExportService.exportAsJSON(report);
      const filename = DataExportService.getExportFilename(
        input.framework,
        "json"
      );

      return {
        filename,
        size: jsonContent.length,
        mimeType: DataExportService.getMimeType("json"),
      };
    }),

  /**
   * Get analytics dashboard data
   */
  getDashboardData: protectedProcedure.query(async () => {
    const metrics = await ComplianceTrendAnalysisService.getMetricsSnapshot();
    const frameworks = await ComplianceTrendAnalysisService.getFrameworkComparison();
    const trends = await ComplianceTrendAnalysisService.getComplianceTrends(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      new Date()
    );

    return {
      metrics,
      frameworks,
      trends,
    };
  }),

  /**
   * Get compliance report for export
   */
  getComplianceReport: protectedProcedure
    .input(
      z.object({
        framework: z.string(),
        format: z.enum(["pdf", "csv", "json"]),
      })
    )
    .query(async ({ input }) => {
      const report = await CustomReportBuilderService.buildReport(
        "detailed-compliance",
        input.framework,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      );

      if (input.format === "pdf") {
        const pdfBuffer = await DataExportService.exportAsPDF(report);
        return {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf",
        };
      } else if (input.format === "csv") {
        const csvContent = await DataExportService.exportAsCSV(report);
        return {
          data: csvContent,
          mimeType: "text/csv",
        };
      } else {
        const jsonContent = await DataExportService.exportAsJSON(report);
        return {
          data: jsonContent,
          mimeType: "application/json",
        };
      }
    }),
});
