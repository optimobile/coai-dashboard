/**
 * Email Automation Router
 * Handles email sequence triggers and management via tRPC
 */

import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  triggerEmailSequence,
  processScheduledEmails,
  cancelEmailSequence,
  getSequenceStatus,
} from "../services/emailAutomation";

export const emailAutomationRouter = router({
  // Trigger email sequence for a user
  triggerSequence: protectedProcedure
    .input(
      z.object({
        sequenceType: z.enum([
          "welcome",
          "course_recommendation",
          "exam_prep",
          "success_stories",
          "certification_path",
        ]),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await triggerEmailSequence(ctx.user.id, input.sequenceType, input.metadata);
    }),

  // Process all scheduled emails (admin only)
  processScheduled: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can process scheduled emails");
    }

    return await processScheduledEmails();
  }),

  // Cancel email sequence
  cancelSequence: protectedProcedure
    .input(z.object({ sequenceId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify user owns this sequence
      const status = await getSequenceStatus(input.sequenceId);
      if (!status.success || status.sequence?.userId !== ctx.user.id) {
        throw new Error("Unauthorized: You can only cancel your own sequences");
      }

      return await cancelEmailSequence(input.sequenceId);
    }),

  // Get sequence status
  getStatus: protectedProcedure
    .input(z.object({ sequenceId: z.number() }))
    .query(async ({ input, ctx }) => {
      // Verify user owns this sequence
      const status = await getSequenceStatus(input.sequenceId);
      if (!status.success || status.sequence?.userId !== ctx.user.id) {
        throw new Error("Unauthorized: You can only view your own sequences");
      }

      return status;
    }),

  // Health check for email automation
  healthCheck: publicProcedure.query(async () => {
    return {
      status: "operational",
      service: "email-automation",
      timestamp: new Date().toISOString(),
      features: [
        "welcome_sequence",
        "course_recommendations",
        "exam_prep_guides",
        "success_stories",
        "certification_paths",
      ],
    };
  }),
});
