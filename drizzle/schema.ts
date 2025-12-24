import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "watchdog_analyst"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Organizations table for B2B customers
 */
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }),
  size: mysqlEnum("size", ["startup", "small", "medium", "large", "enterprise"]),
  country: varchar("country", { length: 100 }),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "professional", "enterprise"]).default("free").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;

/**
 * AI Systems registered for compliance tracking
 */
export const aiSystems = mysqlTable("ai_systems", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId"),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  systemType: mysqlEnum("systemType", ["chatbot", "recommendation", "classification", "generation", "analysis", "other"]).notNull(),
  riskLevel: mysqlEnum("riskLevel", ["minimal", "limited", "high", "unacceptable"]).default("minimal").notNull(),
  status: mysqlEnum("status", ["draft", "active", "under_review", "compliant", "non_compliant", "archived"]).default("draft").notNull(),
  deploymentDate: timestamp("deploymentDate"),
  lastAssessmentDate: timestamp("lastAssessmentDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AISystem = typeof aiSystems.$inferSelect;

/**
 * Compliance frameworks supported by COAI
 */
export const frameworks = mysqlTable("frameworks", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  version: varchar("version", { length: 50 }),
  jurisdiction: varchar("jurisdiction", { length: 100 }),
  description: text("description"),
  effectiveDate: timestamp("effectiveDate"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Framework = typeof frameworks.$inferSelect;

/**
 * Compliance requirements from each framework
 */
export const requirements = mysqlTable("requirements", {
  id: int("id").autoincrement().primaryKey(),
  frameworkId: int("frameworkId").notNull(),
  articleNumber: varchar("articleNumber", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  riskLevelApplicable: mysqlEnum("riskLevelApplicable", ["all", "minimal", "limited", "high", "unacceptable"]).default("all"),
  isMandatory: boolean("isMandatory").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Requirement = typeof requirements.$inferSelect;

/**
 * Compliance assessments for AI systems
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  aiSystemId: int("aiSystemId").notNull(),
  frameworkId: int("frameworkId").notNull(),
  assessorId: int("assessorId").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "approved", "rejected"]).default("pending").notNull(),
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }),
  findings: text("findings"),
  recommendations: text("recommendations"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;

/**
 * Individual requirement compliance status within an assessment
 */
export const assessmentItems = mysqlTable("assessment_items", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  requirementId: int("requirementId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "compliant", "non_compliant", "not_applicable"]).default("not_started").notNull(),
  evidence: text("evidence"),
  notes: text("notes"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentItem = typeof assessmentItems.$inferSelect;

/**
 * Watchdog incident reports from the public
 */
export const watchdogReports = mysqlTable("watchdog_reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId"),
  reporterEmail: varchar("reporterEmail", { length: 320 }),
  reporterName: varchar("reporterName", { length: 255 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  aiSystemName: varchar("aiSystemName", { length: 255 }),
  companyName: varchar("companyName", { length: 255 }),
  incidentType: mysqlEnum("incidentType", ["bias", "privacy", "safety", "misinformation", "manipulation", "other"]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  status: mysqlEnum("status", ["submitted", "under_review", "investigating", "resolved", "dismissed"]).default("submitted").notNull(),
  upvotes: int("upvotes").default(0).notNull(),
  downvotes: int("downvotes").default(0).notNull(),
  isPublic: boolean("isPublic").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WatchdogReport = typeof watchdogReports.$inferSelect;

/**
 * Comments on watchdog reports
 */
export const watchdogComments = mysqlTable("watchdog_comments", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull(),
  userId: int("userId"),
  authorName: varchar("authorName", { length: 255 }),
  content: text("content").notNull(),
  isOfficial: boolean("isOfficial").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WatchdogComment = typeof watchdogComments.$inferSelect;

/**
 * 33-Agent Council voting sessions
 */
export const councilSessions = mysqlTable("council_sessions", {
  id: int("id").autoincrement().primaryKey(),
  subjectType: mysqlEnum("subjectType", ["watchdog_report", "assessment", "policy_proposal", "system_review"]).notNull(),
  subjectId: int("subjectId").notNull(),
  subjectTitle: varchar("subjectTitle", { length: 255 }).notNull(),
  subjectDescription: text("subjectDescription"),
  status: mysqlEnum("status", ["voting", "consensus_reached", "escalated_to_human", "completed"]).default("voting").notNull(),
  consensusThreshold: decimal("consensusThreshold", { precision: 5, scale: 2 }).default("0.67").notNull(),
  totalVotes: int("totalVotes").default(0).notNull(),
  approveVotes: int("approveVotes").default(0).notNull(),
  rejectVotes: int("rejectVotes").default(0).notNull(),
  escalateVotes: int("escalateVotes").default(0).notNull(),
  finalDecision: mysqlEnum("finalDecision", ["approved", "rejected", "escalated"]),
  humanReviewerId: int("humanReviewerId"),
  humanDecision: text("humanDecision"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type CouncilSession = typeof councilSessions.$inferSelect;

/**
 * Individual agent votes in a council session
 */
export const agentVotes = mysqlTable("agent_votes", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  agentId: varchar("agentId", { length: 50 }).notNull(),
  agentType: mysqlEnum("agentType", ["guardian", "arbiter", "scribe"]).notNull(),
  agentProvider: mysqlEnum("agentProvider", ["openai", "anthropic", "google"]).notNull(),
  vote: mysqlEnum("vote", ["approve", "reject", "escalate"]).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  reasoning: text("reasoning"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentVote = typeof agentVotes.$inferSelect;

/**
 * Watchdog analyst job applications (LOI collection)
 */
export const watchdogApplications = mysqlTable("watchdog_applications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  timezone: varchar("timezone", { length: 100 }),
  experience: text("experience"),
  motivation: text("motivation"),
  availableHoursPerWeek: int("availableHoursPerWeek"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "waitlisted"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WatchdogApplication = typeof watchdogApplications.$inferSelect;

/**
 * PDCA Loop cycles for continuous improvement
 */
export const pdcaCycles = mysqlTable("pdca_cycles", {
  id: int("id").autoincrement().primaryKey(),
  aiSystemId: int("aiSystemId"),
  organizationId: int("organizationId"),
  cycleNumber: int("cycleNumber").default(1).notNull(),
  phase: mysqlEnum("phase", ["plan", "do", "check", "act"]).default("plan").notNull(),
  planSummary: text("planSummary"),
  doSummary: text("doSummary"),
  checkSummary: text("checkSummary"),
  actSummary: text("actSummary"),
  status: mysqlEnum("status", ["active", "completed", "paused"]).default("active").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type PDCACycle = typeof pdcaCycles.$inferSelect;

/**
 * Audit log for compliance tracking
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: int("entityId"),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
