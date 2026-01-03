/**
 * Email Automation Workflows Schema
 * Visual workflow builder for email automation
 */

import { mysqlTable, int, varchar, text, timestamp, json, boolean, mysqlEnum } from "drizzle-orm/mysql-core";

// Email automation workflows
export const emailWorkflows = mysqlTable("email_workflows", {
  id: int().autoincrement().primaryKey().notNull(),
  userId: int().notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  triggerType: mysqlEnum(['cohort_join', 'date_based', 'manual', 'enrollment', 'completion']).notNull(),
  triggerConfig: json(), // Configuration for the trigger (e.g., cohort ID, date/time, conditions)
  workflowData: json().notNull(), // Complete workflow graph (nodes, edges, positions)
  isActive: boolean().default(false).notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

// Workflow execution history
export const workflowExecutions = mysqlTable("workflow_executions", {
  id: int().autoincrement().primaryKey().notNull(),
  workflowId: int().notNull(),
  userId: int().notNull(), // User who triggered or is affected by the workflow
  status: mysqlEnum(['pending', 'running', 'completed', 'failed', 'cancelled']).default('pending').notNull(),
  startedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' }),
  executionLog: json(), // Detailed log of each step execution
  errorMessage: text(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

// Workflow step executions (for detailed tracking)
export const workflowStepExecutions = mysqlTable("workflow_step_executions", {
  id: int().autoincrement().primaryKey().notNull(),
  executionId: int().notNull(),
  stepId: varchar({ length: 100 }).notNull(), // Node ID from workflow graph
  stepType: mysqlEnum(['trigger', 'send_email', 'wait', 'condition', 'action']).notNull(),
  status: mysqlEnum(['pending', 'running', 'completed', 'failed', 'skipped']).default('pending').notNull(),
  startedAt: timestamp({ mode: 'string' }),
  completedAt: timestamp({ mode: 'string' }),
  result: json(), // Result data from this step
  errorMessage: text(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export type InsertEmailWorkflow = typeof emailWorkflows.$inferInsert;
export type SelectEmailWorkflow = typeof emailWorkflows.$inferSelect;
export type InsertWorkflowExecution = typeof workflowExecutions.$inferInsert;
export type SelectWorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowStepExecution = typeof workflowStepExecutions.$inferInsert;
export type SelectWorkflowStepExecution = typeof workflowStepExecutions.$inferSelect;
