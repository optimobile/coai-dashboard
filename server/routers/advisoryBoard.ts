/**
 * Advisory Board Router
 * Handles advisory board applications, approvals, and member management
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { advisoryBoardApplications } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { sendEmail } from "../emailService";

export const advisoryBoardRouter = router({
  /**
   * Submit a new advisory board application
   * Public endpoint - anyone can apply
   */
  submitApplication: publicProcedure
    .input(
      z.object({
        applicantName: z.string().min(2).max(255),
        email: z.string().email(),
        position: z.enum(["chair", "regulatory_expert", "academic_expert"]),
        yearsOfExperience: z.number().min(0).max(100),
        currentRole: z.string().min(2).max(255),
        organization: z.string().min(2).max(255),
        motivation: z.string().min(50).max(5000),
        resumeUrl: z.string().url().optional(),
        linkedinUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if applicant already has a pending application
      const [existing] = await db
        .select()
        .from(advisoryBoardApplications)
        .where(
          and(
            eq(advisoryBoardApplications.email, input.email),
            eq(advisoryBoardApplications.status, "submitted")
          )
        );

      if (existing) {
        throw new Error("You already have a pending application");
      }

      // Create application
      const [application] = await db
        .insert(advisoryBoardApplications)
        .values({
          applicantName: input.applicantName,
          email: input.email,
          position: input.position,
          yearsOfExperience: input.yearsOfExperience,
          currentRole: input.currentRole,
          organization: input.organization,
          motivation: input.motivation,
          resumeUrl: input.resumeUrl,
          linkedinUrl: input.linkedinUrl,
          status: "submitted",
        })
        .$returningId();

      // Send confirmation email
      try {
        await sendEmail({
          to: input.email,
          subject: "Advisory Board Application Received",
          html: `
            <h2>Thank you for applying to the CSOAI Advisory Board</h2>
            <p>Dear ${input.applicantName},</p>
            <p>We have received your application for the <strong>${input.position}</strong> position.</p>
            <p>Our team will review your application and get back to you within 2-3 weeks.</p>
            <p>Best regards,<br/>CSOAI Team</p>
          `,
        });
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }

      return {
        applicationId: application.id,
        status: "submitted",
        message: "Application submitted successfully",
      };
    }),

  /**
   * Get application status
   * Public endpoint - applicants can check their status with email
   */
  getApplicationStatus: publicProcedure
    .input(
      z.object({
        applicationId: z.number(),
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [application] = await db
        .select()
        .from(advisoryBoardApplications)
        .where(
          and(
            eq(advisoryBoardApplications.id, input.applicationId),
            eq(advisoryBoardApplications.email, input.email)
          )
        );

      if (!application) {
        throw new Error("Application not found");
      }

      return {
        applicationId: application.id,
        status: application.status,
        position: application.position,
        appliedAt: application.appliedAt,
        reviewedAt: application.reviewedAt,
        reviewNotes: application.reviewNotes,
      };
    }),

  /**
   * Get all applications (admin only)
   */
  getApplications: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["submitted", "under_review", "shortlisted", "accepted", "rejected"])
          .optional(),
        position: z.enum(["chair", "regulatory_expert", "academic_expert"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // TODO: Add admin role check
      // if (ctx.user.role !== 'admin') throw new Error('Unauthorized');

      const conditions: any[] = [];
      if (input.status) {
        conditions.push(eq(advisoryBoardApplications.status, input.status));
      }
      if (input.position) {
        conditions.push(eq(advisoryBoardApplications.position, input.position));
      }

      const applications = await db
        .select()
        .from(advisoryBoardApplications)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(advisoryBoardApplications.appliedAt))
        .limit(input.limit)
        .offset(input.offset);

      return applications;
    }),

  /**
   * Update application status (admin only)
   */
  updateApplicationStatus: protectedProcedure
    .input(
      z.object({
        applicationId: z.number(),
        status: z.enum(["submitted", "under_review", "shortlisted", "accepted", "rejected"]),
        reviewNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // TODO: Add admin role check
      // if (ctx.user.role !== 'admin') throw new Error('Unauthorized');

      const [application] = await db
        .select()
        .from(advisoryBoardApplications)
        .where(eq(advisoryBoardApplications.id, input.applicationId));

      if (!application) {
        throw new Error("Application not found");
      }

      // Update application
      await db
        .update(advisoryBoardApplications)
        .set({
          status: input.status,
          reviewNotes: input.reviewNotes,
          reviewedAt: new Date().toISOString(),
        })
        .where(eq(advisoryBoardApplications.id, input.applicationId));

      // Send notification email
      try {
        let subject = "Advisory Board Application Update";
        let message = "";

        switch (input.status) {
          case "under_review":
            message = "Your application is now under review.";
            break;
          case "shortlisted":
            message =
              "Congratulations! Your application has been shortlisted. We will contact you soon for an interview.";
            break;
          case "accepted":
            message =
              "Congratulations! Your application has been accepted. Welcome to the CSOAI Advisory Board!";
            break;
          case "rejected":
            message =
              "Thank you for your interest. Unfortunately, your application was not selected at this time.";
            break;
        }

        await sendEmail({
          to: application.email,
          subject,
          html: `
            <h2>Advisory Board Application Update</h2>
            <p>Dear ${application.applicantName},</p>
            <p>${message}</p>
            ${input.reviewNotes ? `<p><strong>Notes:</strong> ${input.reviewNotes}</p>` : ""}
            <p>Best regards,<br/>CSOAI Team</p>
          `,
        });
      } catch (error) {
        console.error("Failed to send status update email:", error);
      }

      return { success: true };
    }),

  /**
   * Get application details
   */
  getApplicationDetails: protectedProcedure
    .input(z.object({ applicationId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [application] = await db
        .select()
        .from(advisoryBoardApplications)
        .where(eq(advisoryBoardApplications.id, input.applicationId));

      if (!application) {
        throw new Error("Application not found");
      }

      return application;
    }),

  /**
   * Get statistics on applications
   */
  getStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const applications = await db
      .select()
      .from(advisoryBoardApplications);

    const stats = {
      total: applications.length,
      submitted: applications.filter((a) => a.status === "submitted").length,
      underReview: applications.filter((a) => a.status === "under_review").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      accepted: applications.filter((a) => a.status === "accepted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      byPosition: {
        chair: applications.filter((a) => a.position === "chair").length,
        regulatoryExpert: applications.filter((a) => a.position === "regulatory_expert").length,
        academicExpert: applications.filter((a) => a.position === "academic_expert").length,
      },
    };

    return stats;
  }),
});

export default advisoryBoardRouter;
