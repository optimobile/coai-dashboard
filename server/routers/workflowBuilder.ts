/**
 * Workflow Builder Router
 * Handles visual email automation workflows
 */

import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { emailWorkflows, workflowExecutions, workflowStepExecutions } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const workflowBuilderRouter = router({
  // Get all workflows for current user
  getWorkflows: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const workflows = await db
      .select()
      .from(emailWorkflows)
      .where(eq(emailWorkflows.userId, ctx.user.id))
      .orderBy(desc(emailWorkflows.updatedAt));

    return workflows;
  }),

  // Get single workflow by ID
  getWorkflow: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const workflow = await db
        .select()
        .from(emailWorkflows)
        .where(
          and(
            eq(emailWorkflows.id, input.id),
            eq(emailWorkflows.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!workflow.length) {
        throw new Error("Workflow not found");
      }

      return workflow[0];
    }),

  // Create new workflow
  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        triggerType: z.enum(['cohort_join', 'date_based', 'manual', 'enrollment', 'completion']),
        triggerConfig: z.any().optional(),
        workflowData: z.any(),
        isActive: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(emailWorkflows).values({
        userId: ctx.user.id,
        name: input.name,
        description: input.description || null,
        triggerType: input.triggerType,
        triggerConfig: input.triggerConfig || null,
        workflowData: input.workflowData,
        isActive: input.isActive,
      });

      const id = typeof result.insertId === 'bigint' ? Number(result.insertId) : Number(result.insertId);
      return { id, success: true };
    }),

  // Update workflow
  updateWorkflow: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        triggerType: z.enum(['cohort_join', 'date_based', 'manual', 'enrollment', 'completion']).optional(),
        triggerConfig: z.any().optional(),
        workflowData: z.any().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;

      await db
        .update(emailWorkflows)
        .set(updates)
        .where(
          and(
            eq(emailWorkflows.id, id),
            eq(emailWorkflows.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Delete workflow
  deleteWorkflow: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(emailWorkflows)
        .where(
          and(
            eq(emailWorkflows.id, input.id),
            eq(emailWorkflows.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Toggle workflow active status
  toggleWorkflow: protectedProcedure
    .input(z.object({ id: z.number(), isActive: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(emailWorkflows)
        .set({ isActive: input.isActive })
        .where(
          and(
            eq(emailWorkflows.id, input.id),
            eq(emailWorkflows.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Get workflow execution history
  getExecutionHistory: protectedProcedure
    .input(z.object({ workflowId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // First verify the workflow belongs to the user
      const workflow = await db
        .select()
        .from(emailWorkflows)
        .where(
          and(
            eq(emailWorkflows.id, input.workflowId),
            eq(emailWorkflows.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!workflow.length) {
        throw new Error("Workflow not found");
      }

      const executions = await db
        .select()
        .from(workflowExecutions)
        .where(eq(workflowExecutions.workflowId, input.workflowId))
        .orderBy(desc(workflowExecutions.createdAt))
        .limit(50);

      return executions;
    }),

  // Get execution details with step-by-step breakdown
  getExecutionDetails: protectedProcedure
    .input(z.object({ executionId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const execution = await db
        .select()
        .from(workflowExecutions)
        .where(eq(workflowExecutions.id, input.executionId))
        .limit(1);

      if (!execution.length) {
        throw new Error("Execution not found");
      }

      const steps = await db
        .select()
        .from(workflowStepExecutions)
        .where(eq(workflowStepExecutions.executionId, input.executionId))
        .orderBy(workflowStepExecutions.createdAt);

      return {
        execution: execution[0],
        steps,
      };
    }),

  // Manually trigger a workflow
  triggerWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        targetUserId: z.number().optional(), // For testing or manual triggers
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify workflow belongs to user
      const workflow = await db
        .select()
        .from(emailWorkflows)
        .where(
          and(
            eq(emailWorkflows.id, input.workflowId),
            eq(emailWorkflows.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!workflow.length) {
        throw new Error("Workflow not found");
      }

      // Create execution record
      const result = await db.insert(workflowExecutions).values({
        workflowId: input.workflowId,
        userId: input.targetUserId || ctx.user.id,
        status: "pending",
      });

      // TODO: Trigger actual workflow execution in background
      // For now, just create the execution record

      const executionId = typeof result.insertId === 'bigint' ? Number(result.insertId) : Number(result.insertId);
      return { executionId, success: true };
    }),
});
