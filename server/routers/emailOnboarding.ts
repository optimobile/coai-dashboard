/**
 * Email Onboarding Router
 * Handles automated email sequences for new signups with personalized recommendations
 */

import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import {
  emailSequences,
  emailTemplates,
  userEmailPreferences,
  emailTemplates,
} from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const emailOnboardingRouter = router({
  // Get available email templates
  getTemplates: publicProcedure
    .input(
      z.object({
        sequenceType: z.enum([
          "welcome",
          "course_recommendation",
          "exam_prep",
          "success_stories",
          "certification_path",
        ]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(emailTemplates);

      if (input.sequenceType) {
        query = query.where(eq(emailTemplates.sequenceType, input.sequenceType));
      }

      return await query;
    }),

  // Start onboarding sequence for a user
  startOnboardingSequence: protectedProcedure
    .input(
      z.object({
        sequenceType: z.enum([
          "welcome",
          "course_recommendation",
          "exam_prep",
          "success_stories",
          "certification_path",
        ]),
        courseInterests: z.array(z.string()).optional(),
        experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const sequence = await db.insert(emailSequences).values({
        userId: ctx.user.id,
        sequenceType: input.sequenceType,
        status: "active",
        currentStep: 1,
        metadata: JSON.stringify({
          courseInterests: input.courseInterests || [],
          experienceLevel: input.experienceLevel || "beginner",
          startedAt: new Date(),
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        success: true,
        sequenceId: sequence.insertId,
        message: `${input.sequenceType} onboarding sequence started`,
      };
    }),

  // Get user's active sequences
  getActiveSequences: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return await db
      .select()
      .from(emailSequences)
      .where(
        and(
          eq(emailSequences.userId, ctx.user.id),
          eq(emailSequences.status, "active")
        )
      )
      .orderBy(desc(emailSequences.createdAt));
  }),

  // Update user email preferences
  updateEmailPreferences: protectedProcedure
    .input(
      z.object({
        welcomeEmails: z.boolean().optional(),
        courseRecommendations: z.boolean().optional(),
        examPrepGuides: z.boolean().optional(),
        successStories: z.boolean().optional(),
        certificationUpdates: z.boolean().optional(),
        frequency: z.enum(["daily", "weekly", "biweekly", "monthly"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(userEmailPreferences)
        .where(eq(userEmailPreferences.userId, ctx.user.id));

      if (existing.length > 0) {
        await db
          .update(userEmailPreferences)
          .set({
            welcomeEmails: input.welcomeEmails ?? existing[0].welcomeEmails,
            courseRecommendations: input.courseRecommendations ?? existing[0].courseRecommendations,
            examPrepGuides: input.examPrepGuides ?? existing[0].examPrepGuides,
            successStories: input.successStories ?? existing[0].successStories,
            certificationUpdates: input.certificationUpdates ?? existing[0].certificationUpdates,
            frequency: input.frequency ?? existing[0].frequency,
            updatedAt: new Date(),
          })
          .where(eq(userEmailPreferences.userId, ctx.user.id));
      } else {
        await db.insert(userEmailPreferences).values({
          userId: ctx.user.id,
          welcomeEmails: input.welcomeEmails ?? true,
          courseRecommendations: input.courseRecommendations ?? true,
          examPrepGuides: input.examPrepGuides ?? true,
          successStories: input.successStories ?? true,
          certificationUpdates: input.certificationUpdates ?? true,
          frequency: input.frequency ?? "weekly",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return { success: true, message: "Email preferences updated" };
    }),

  // Get email campaign metrics
  getCampaignMetrics: publicProcedure
    .input(
      z.object({
        sequenceType: z.enum([
          "welcome",
          "course_recommendation",
          "exam_prep",
          "success_stories",
          "certification_path",
        ]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(emailTemplates);

      if (input.sequenceType) {
        query = query.where(eq(emailTemplates.sequenceType, input.sequenceType));
      }

      return await query.orderBy(desc(emailTemplates.recordedAt));
    }),

  // Get user email preferences
  getUserPreferences: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const preferences = await db
      .select()
      .from(userEmailPreferences)
      .where(eq(userEmailPreferences.userId, ctx.user.id));

    return preferences.length > 0 ? preferences[0] : null;
  }),
});
