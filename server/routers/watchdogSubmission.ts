/**
 * Watchdog Submission Router
 * Handles watchdog report submissions with file uploads to S3
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { watchdogReports } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { sendEmail } from "../emailService";

export const watchdogSubmissionRouter = router({
  /**
   * Submit a new watchdog report
   * Public endpoint - anyone can submit a report
   */
  submitReport: publicProcedure
    .input(
      z.object({
        title: z.string().min(10).max(255),
        description: z.string().min(50).max(10000),
        incidentType: z.enum([
          "bias",
          "privacy",
          "safety",
          "misinformation",
          "manipulation",
          "other",
        ]),
        severity: z.enum(["low", "medium", "high", "critical"]),
        aiSystemName: z.string().optional(),
        companyName: z.string().optional(),
        reporterName: z.string().optional(),
        reporterEmail: z.string().email().optional(),
        evidenceUrls: z.array(z.string().url()).optional(),
        isPublic: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get reporter ID if authenticated
      const reporterId = ctx.user?.id || null;

      // Create report
      const [report] = await db
        .insert(watchdogReports)
        .values({
          reporterId,
          reporterEmail: input.reporterEmail || ctx.user?.email || null,
          reporterName: input.reporterName || ctx.user?.name || null,
          title: input.title,
          description: input.description,
          incidentType: input.incidentType,
          severity: input.severity,
          aiSystemName: input.aiSystemName,
          companyName: input.companyName,
          isPublic: input.isPublic ? 1 : 0,
          status: "submitted",
        })
        .$returningId();

      // Send confirmation email
      const recipientEmail = input.reporterEmail || ctx.user?.email;
      if (recipientEmail) {
        try {
          await sendEmail({
            to: recipientEmail,
            subject: "Watchdog Report Received",
            html: `
              <h2>Thank you for your report</h2>
              <p>Dear ${input.reporterName || "Contributor"},</p>
              <p>We have received your watchdog report about <strong>${input.aiSystemName || "an AI system"}</strong>.</p>
              <p><strong>Report ID:</strong> ${report.id}</p>
              <p><strong>Severity:</strong> ${input.severity}</p>
              <p>Our team will review your report and take appropriate action. You can track the status of your report using the ID above.</p>
              <p>Best regards,<br/>CSOAI Watchdog Team</p>
            `,
          });
        } catch (error) {
          console.error("Failed to send confirmation email:", error);
        }
      }

      // Notify admin
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL || "admin@csoai.org",
          subject: `New ${input.severity.toUpperCase()} Watchdog Report: ${input.title}`,
          html: `
            <h2>New Watchdog Report Submitted</h2>
            <p><strong>Title:</strong> ${input.title}</p>
            <p><strong>Severity:</strong> ${input.severity}</p>
            <p><strong>Type:</strong> ${input.incidentType}</p>
            <p><strong>AI System:</strong> ${input.aiSystemName || "Not specified"}</p>
            <p><strong>Company:</strong> ${input.companyName || "Not specified"}</p>
            <p><strong>Reporter:</strong> ${input.reporterName || "Anonymous"}</p>
            <p><strong>Description:</strong></p>
            <p>${input.description}</p>
            <p><a href="${process.env.ADMIN_URL}/watchdog/${report.id}">View Report</a></p>
          `,
        });
      } catch (error) {
        console.error("Failed to send admin notification:", error);
      }

      return {
        reportId: report.id,
        status: "submitted",
        message: "Report submitted successfully",
      };
    }),

  /**
   * Get report status
   * Public endpoint - anyone can check status with report ID and email
   */
  getReportStatus: publicProcedure
    .input(
      z.object({
        reportId: z.number(),
        reporterEmail: z.string().email().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [report] = await db
        .select()
        .from(watchdogReports)
        .where(eq(watchdogReports.id, input.reportId));

      if (!report) {
        throw new Error("Report not found");
      }

      // If email provided, verify it matches
      if (input.reporterEmail && report.reporterEmail !== input.reporterEmail) {
        throw new Error("Email does not match report");
      }

      return {
        reportId: report.id,
        title: report.title,
        status: report.status,
        severity: report.severity,
        incidentType: report.incidentType,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        upvotes: report.upvotes,
        downvotes: report.downvotes,
      };
    }),

  /**
   * Get report details
   * Public endpoint - anyone can view public reports
   */
  getReportDetails: publicProcedure
    .input(z.object({ reportId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [report] = await db
        .select()
        .from(watchdogReports)
        .where(eq(watchdogReports.id, input.reportId));

      if (!report) {
        throw new Error("Report not found");
      }

      // Only return if public or user is authenticated
      if (!report.isPublic) {
        throw new Error("Report is not public");
      }

      return report;
    }),

  /**
   * Get public reports with filtering
   */
  getPublicReports: publicProcedure
    .input(
      z.object({
        incidentType: z
          .enum(["bias", "privacy", "safety", "misinformation", "manipulation", "other"])
          .optional(),
        severity: z.enum(["low", "medium", "high", "critical"]).optional(),
        aiSystemName: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions: any[] = [eq(watchdogReports.isPublic, true)];

      if (input.incidentType) {
        conditions.push(eq(watchdogReports.incidentType, input.incidentType));
      }
      if (input.severity) {
        conditions.push(eq(watchdogReports.severity, input.severity));
      }
      if (input.aiSystemName) {
        conditions.push(eq(watchdogReports.aiSystemName, input.aiSystemName));
      }

      const reports = await db
        .select()
        .from(watchdogReports)
        .where(conditions.length > 0 ? conditions[0] : undefined)
        .orderBy(desc(watchdogReports.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return reports;
    }),

  /**
   * Upvote a report
   */
  upvoteReport: publicProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [report] = await db
        .select()
        .from(watchdogReports)
        .where(eq(watchdogReports.id, input.reportId));

      if (!report) {
        throw new Error("Report not found");
      }

      await db
        .update(watchdogReports)
        .set({
          upvotes: (report.upvotes || 0) + 1,
        })
        .where(eq(watchdogReports.id, input.reportId));

      return { success: true };
    }),

  /**
   * Downvote a report
   */
  downvoteReport: publicProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [report] = await db
        .select()
        .from(watchdogReports)
        .where(eq(watchdogReports.id, input.reportId));

      if (!report) {
        throw new Error("Report not found");
      }

      await db
        .update(watchdogReports)
        .set({
          downvotes: (report.downvotes || 0) + 1,
        })
        .where(eq(watchdogReports.id, input.reportId));

      return { success: true };
    }),

  /**
   * Get report statistics
   */
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const reports = await db
      .select()
      .from(watchdogReports)
      .where(eq(watchdogReports.isPublic, true));

    const stats = {
      total: reports.length,
      byIncidentType: {
        bias: reports.filter((r) => r.incidentType === "bias").length,
        privacy: reports.filter((r) => r.incidentType === "privacy").length,
        safety: reports.filter((r) => r.incidentType === "safety").length,
        misinformation: reports.filter((r) => r.incidentType === "misinformation").length,
        manipulation: reports.filter((r) => r.incidentType === "manipulation").length,
        other: reports.filter((r) => r.incidentType === "other").length,
      },
      bySeverity: {
        low: reports.filter((r) => r.severity === "low").length,
        medium: reports.filter((r) => r.severity === "medium").length,
        high: reports.filter((r) => r.severity === "high").length,
        critical: reports.filter((r) => r.severity === "critical").length,
      },
      byStatus: {
        submitted: reports.filter((r) => r.status === "submitted").length,
        underReview: reports.filter((r) => r.status === "under_review").length,
        investigating: reports.filter((r) => r.status === "investigating").length,
        resolved: reports.filter((r) => r.status === "resolved").length,
        dismissed: reports.filter((r) => r.status === "dismissed").length,
      },
    };

    return stats;
  }),
});

export default watchdogSubmissionRouter;
