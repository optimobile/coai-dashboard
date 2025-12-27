import { mysqlTable, mysqlSchema, AnyMySqlColumn, int, varchar, mysqlEnum, decimal, text, timestamp, json, index, tinyint, bigint } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm"

export const agentVotes = mysqlTable("agent_votes", {
	id: int().autoincrement().notNull(),
	sessionId: int().notNull(),
	agentId: varchar({ length: 50 }).notNull(),
	agentType: mysqlEnum(['guardian','arbiter','scribe']).notNull(),
	agentProvider: mysqlEnum(['openai','anthropic','google','kimi','deepseek']).notNull(),
	vote: mysqlEnum(['approve','reject','escalate']).notNull(),
	confidence: decimal({ precision: 5, scale: 2 }),
	reasoning: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const aiSystems = mysqlTable("ai_systems", {
	id: int().autoincrement().notNull(),
	organizationId: int(),
	userId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	systemType: mysqlEnum(['chatbot','recommendation','classification','generation','analysis','other']).notNull(),
	riskLevel: mysqlEnum(['minimal','limited','high','unacceptable']).default('minimal').notNull(),
	status: mysqlEnum(['draft','active','under_review','compliant','non_compliant','archived']).default('draft').notNull(),
	deploymentDate: timestamp({ mode: 'string' }),
	lastAssessmentDate: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const analystAssignments = mysqlTable("analyst_assignments", {
	id: int().autoincrement().notNull(),
	analystId: int().notNull(),
	specialistId: int().notNull(),
	regionId: int().notNull(),
	industry: varchar({ length: 100 }),
	assignedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	status: mysqlEnum(['active','suspended','terminated']).default('active').notNull(),
	qualityScore: int().default(0),
	reportsCompleted: int().default(0).notNull(),
	averageTurnaroundHours: int().default(0),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const analystDecisions = mysqlTable("analyst_decisions", {
	id: int().autoincrement().notNull(),
	assignmentId: int().notNull(),
	analystId: int().notNull(),
	decision: mysqlEnum(['approve','reject','escalate','needs_more_info']).notNull(),
	confidence: mysqlEnum(['low','medium','high']).default('medium').notNull(),
	reasoning: text().notNull(),
	evidenceReviewed: json(),
	timeSpentMinutes: int(),
	submittedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const analystPerformance = mysqlTable("analyst_performance", {
	id: int().autoincrement().notNull(),
	analystId: int().notNull(),
	totalCasesAssigned: int().default(0).notNull(),
	totalCasesCompleted: int().default(0).notNull(),
	totalCasesExpired: int().default(0).notNull(),
	accuracyRate: decimal({ precision: 5, scale: 2 }),
	avgResponseTimeMinutes: decimal({ precision: 10, scale: 2 }),
	qualityScore: decimal({ precision: 5, scale: 2 }),
	rank: int(),
	totalEarnings: decimal({ precision: 10, scale: 2 }).default('0.00').notNull(),
	lastActiveAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("analyst_performance_analystId_unique").on(table.analystId),
]);

export const apiKeys = mysqlTable("api_keys", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	keyPrefix: varchar({ length: 10 }).notNull(),
	keyHash: varchar({ length: 64 }).notNull(),
	tier: mysqlEnum(['free','pro','enterprise']).default('free').notNull(),
	permissions: json(),
	rateLimit: int().default(100).notNull(),
	lastUsedAt: timestamp({ mode: 'string' }),
	expiresAt: timestamp({ mode: 'string' }),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const assessmentItems = mysqlTable("assessment_items", {
	id: int().autoincrement().notNull(),
	assessmentId: int().notNull(),
	requirementId: int().notNull(),
	status: mysqlEnum(['not_started','in_progress','compliant','non_compliant','not_applicable']).default('not_started').notNull(),
	evidence: text(),
	notes: text(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const assessments = mysqlTable("assessments", {
	id: int().autoincrement().notNull(),
	aiSystemId: int().notNull(),
	frameworkId: int().notNull(),
	assessorId: int().notNull(),
	status: mysqlEnum(['pending','in_progress','completed','approved','rejected']).default('pending').notNull(),
	overallScore: decimal({ precision: 5, scale: 2 }),
	findings: text(),
	recommendations: text(),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const auditLogs = mysqlTable("audit_logs", {
	id: int().autoincrement().notNull(),
	userId: int(),
	action: varchar({ length: 100 }).notNull(),
	entityType: varchar({ length: 100 }).notNull(),
	entityId: int(),
	details: text(),
	ipAddress: varchar({ length: 45 }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const caseAssignments = mysqlTable("case_assignments", {
	id: int().autoincrement().notNull(),
	analystId: int().notNull(),
	reportId: int().notNull(),
	councilSessionId: int(),
	priority: mysqlEnum(['low','medium','high','urgent']).default('medium').notNull(),
	status: mysqlEnum(['assigned','in_progress','completed','expired','reassigned']).default('assigned').notNull(),
	assignedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	dueAt: timestamp({ mode: 'string' }),
	completedAt: timestamp({ mode: 'string' }),
});

export const certificationTests = mysqlTable("certification_tests", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	passingScore: int().default(70).notNull(),
	timeLimitMinutes: int().default(60).notNull(),
	totalQuestions: int().default(50).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("certification_tests_code_unique").on(table.code),
]);

export const councilSessions = mysqlTable("council_sessions", {
	id: int().autoincrement().notNull(),
	subjectType: mysqlEnum(['watchdog_report','assessment','policy_proposal','system_review']).notNull(),
	subjectId: int().notNull(),
	subjectTitle: varchar({ length: 255 }).notNull(),
	subjectDescription: text(),
	status: mysqlEnum(['voting','consensus_reached','escalated_to_human','completed']).default('voting').notNull(),
	consensusThreshold: decimal({ precision: 5, scale: 2 }).default('0.67').notNull(),
	totalVotes: int().default(0).notNull(),
	approveVotes: int().default(0).notNull(),
	rejectVotes: int().default(0).notNull(),
	escalateVotes: int().default(0).notNull(),
	finalDecision: mysqlEnum(['approved','rejected','escalated']),
	humanReviewerId: int(),
	humanDecision: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
});

export const courseBundles = mysqlTable("course_bundles", {
	id: int().autoincrement().notNull(),
	regionId: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	courseIds: json().notNull(),
	regularPrice: int().notNull(),
	bundlePrice: int().notNull(),
	savings: int().notNull(),
	stripePriceId: varchar({ length: 255 }),
	active: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	bundlePrice3Month: int(),
	bundlePrice6Month: int(),
	bundlePrice12Month: int(),
	stripePriceId3Month: varchar({ length: 255 }),
	stripePriceId6Month: varchar({ length: 255 }),
	stripePriceId12Month: varchar({ length: 255 }),
});

export const courseCertificates = mysqlTable("course_certificates", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	certificateId: varchar({ length: 100 }).notNull(),
	issuedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("certificateId").on(table.certificateId),
]);

export const courseEnrollments = mysqlTable("course_enrollments", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	courseId: int().notNull(),
	status: mysqlEnum(['enrolled','in_progress','completed','failed']).default('enrolled').notNull(),
	progress: int().default(0).notNull(),
	enrolledAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
	score: int(),
	certificateIssued: tinyint().default(0).notNull(),
	paidAmount: int().default(0).notNull(),
	stripePaymentIntentId: varchar({ length: 255 }),
	referredBySpecialistId: int(),
	commissionPaid: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	paymentType: mysqlEnum(['one_time','3_month','6_month','12_month']).default('one_time').notNull(),
	stripeSubscriptionId: varchar({ length: 255 }),
	subscriptionStatus: mysqlEnum(['active','cancelled','past_due','none']).default('none').notNull(),
});

export const courses = mysqlTable("courses", {
	id: int().autoincrement().notNull(),
	regionId: int().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	framework: varchar({ length: 100 }),
	level: mysqlEnum(['fundamentals','advanced','specialist']).notNull(),
	durationHours: int().notNull(),
	price: int().notNull(),
	stripePriceId: varchar({ length: 255 }),
	modules: json(),
	prerequisites: json(),
	certificationRequired: tinyint().default(0).notNull(),
	active: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	price3Month: int(),
	price6Month: int(),
	price12Month: int(),
	stripePriceId3Month: varchar({ length: 255 }),
	stripePriceId6Month: varchar({ length: 255 }),
	stripePriceId12Month: varchar({ length: 255 }),
});

export const foundingMembers = mysqlTable("founding_members", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	userId: int("user_id"),
	membershipNumber: varchar("membership_number", { length: 50 }).notNull(),
	purchasedAt: timestamp("purchased_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	lifetimeAccess: tinyint("lifetime_access").default(1),
	equityAllocation: decimal("equity_allocation", { precision: 5, scale: 4 }),
	referralCode: varchar("referral_code", { length: 50 }).notNull(),
},
(table) => [
	index("id").on(table.id),
	index("membership_number").on(table.membershipNumber),
	index("referral_code").on(table.referralCode),
]);

export const frameworks = mysqlTable("frameworks", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	version: varchar({ length: 50 }),
	jurisdiction: varchar({ length: 100 }),
	description: text(),
	effectiveDate: timestamp({ mode: 'string' }),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("frameworks_code_unique").on(table.code),
]);

export const jobApplications = mysqlTable("job_applications", {
	id: int().autoincrement().notNull(),
	jobId: int().notNull(),
	userId: int().notNull(),
	applicantName: varchar({ length: 255 }).notNull(),
	applicantEmail: varchar({ length: 320 }).notNull(),
	resumeUrl: varchar({ length: 500 }),
	coverLetter: text(),
	certifications: text(),
	yearsExperience: int(),
	status: mysqlEnum(['submitted','reviewing','shortlisted','rejected','accepted']).default('submitted').notNull(),
	employerResponse: text("employer_response"),
	statusUpdatedAt: timestamp("status_updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const jobPostings = mysqlTable("job_postings", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 255 }).notNull(),
	company: varchar({ length: 255 }).notNull(),
	location: varchar({ length: 255 }).notNull(),
	locationType: mysqlEnum(['remote','hybrid','onsite']).default('remote').notNull(),
	country: varchar({ length: 100 }),
	payRate: int().notNull(),
	payRateMax: int(),
	payCurrency: varchar({ length: 3 }).default('USD').notNull(),
	experienceLevel: mysqlEnum(['entry','mid','senior','lead']).default('entry').notNull(),
	employmentType: mysqlEnum(['full_time','part_time','contract','freelance']).default('full_time').notNull(),
	description: text().notNull(),
	responsibilities: text(),
	requirements: text(),
	requiredCertifications: text(),
	preferredCertifications: text(),
	benefits: text(),
	applicationUrl: varchar({ length: 500 }),
	contactEmail: varchar({ length: 320 }),
	status: mysqlEnum(['active','closed','draft']).default('active').notNull(),
	postedBy: int(),
	viewCount: int().default(0).notNull(),
	applicationCount: int().default(0).notNull(),
	expiresAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const loiSignups = mysqlTable("loi_signups", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	email: varchar({ length: 255 }).notNull(),
	ecosystem: varchar({ length: 50 }).notNull(),
	source: varchar({ length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	converted: tinyint().default(0),
	convertedAt: timestamp("converted_at", { mode: 'string' }),
	conversionValue: decimal("conversion_value", { precision: 10, scale: 2 }),
},
(table) => [
	index("id").on(table.id),
	index("email").on(table.email),
]);

export const notificationPreferences = mysqlTable("notification_preferences", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	emailEnabled: tinyint().default(1).notNull(),
	slackEnabled: tinyint().default(0).notNull(),
	slackWebhookUrl: varchar({ length: 500 }),
	complianceAlerts: tinyint().default(1).notNull(),
	systemUpdates: tinyint().default(1).notNull(),
	jobApplications: tinyint().default(1).notNull(),
	certificateIssued: tinyint().default(1).notNull(),
	councilDecisions: tinyint().default(1).notNull(),
	reportUpdates: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	digestEnabled: tinyint("digest_enabled").default(0),
	digestFrequency: mysqlEnum("digest_frequency", ['daily','weekly']).default('daily'),
	lastDigestSentAt: timestamp("last_digest_sent_at", { mode: 'string' }),
},
(table) => [
	index("userId").on(table.userId),
]);

export const notifications = mysqlTable("notifications", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	type: mysqlEnum(['compliance_alert','system_update','job_application','certificate_issued','council_decision','report_update']).notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	link: varchar({ length: 500 }),
	priority: mysqlEnum(['low','medium','high','urgent']).default('medium').notNull(),
	isRead: tinyint().default(0).notNull(),
	readAt: timestamp({ mode: 'string' }),
	metadata: json(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("idx_userId_isRead").on(table.userId, table.isRead),
	index("idx_createdAt").on(table.createdAt),
]);

export const organizations = mysqlTable("organizations", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	industry: varchar({ length: 100 }),
	size: mysqlEnum(['startup','small','medium','large','enterprise']),
	country: varchar({ length: 100 }),
	subscriptionTier: mysqlEnum(['free','professional','enterprise']).default('free').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const pdcaCycles = mysqlTable("pdca_cycles", {
	id: int().autoincrement().notNull(),
	aiSystemId: int(),
	organizationId: int(),
	cycleNumber: int().default(1).notNull(),
	phase: mysqlEnum(['plan','do','check','act']).default('plan').notNull(),
	planSummary: text(),
	doSummary: text(),
	checkSummary: text(),
	actSummary: text(),
	status: mysqlEnum(['active','completed','paused']).default('active').notNull(),
	startedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
});

export const recommendationAnalytics = mysqlTable("recommendation_analytics", {
	id: int().autoincrement().notNull(),
	period: varchar({ length: 20 }).notNull(),
	periodType: mysqlEnum(['daily','weekly','monthly']).notNull(),
	totalGenerated: int().default(0).notNull(),
	totalViewed: int().default(0).notNull(),
	totalImplemented: int().default(0).notNull(),
	totalDismissed: int().default(0).notNull(),
	totalSnoozed: int().default(0).notNull(),
	helpfulCount: int().default(0).notNull(),
	notHelpfulCount: int().default(0).notNull(),
	byCategory: json(),
	byPriority: json(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("idx_period").on(table.period, table.periodType),
]);

export const recommendationInteractions = mysqlTable("recommendation_interactions", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	recommendationId: varchar({ length: 100 }).notNull(),
	recommendationType: varchar({ length: 50 }).notNull(),
	action: mysqlEnum(['viewed','implemented','dismissed','snoozed']).notNull(),
	feedback: mysqlEnum(['helpful','not_helpful','irrelevant']),
	feedbackNote: text(),
	snoozeUntil: timestamp({ mode: 'string' }),
	aiSystemId: int(),
	frameworkId: int(),
	metadata: json(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
},
(table) => [
	index("idx_user_rec").on(table.userId, table.recommendationId),
	index("idx_user_action").on(table.userId, table.action),
]);

export const recommendationPreferences = mysqlTable("recommendation_preferences", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	complianceGapWeight: int().default(100).notNull(),
	incidentPreventionWeight: int().default(80).notNull(),
	governanceWeight: int().default(70).notNull(),
	riskMitigationWeight: int().default(90).notNull(),
	bestPracticeWeight: int().default(50).notNull(),
	regulatoryUpdateWeight: int().default(85).notNull(),
	emailDigestEnabled: tinyint().default(0).notNull(),
	emailDigestFrequency: mysqlEnum(['daily','weekly','monthly']).default('weekly').notNull(),
	minPriorityForEmail: mysqlEnum(['critical','high','medium','low']).default('high').notNull(),
	defaultLimit: int().default(10).notNull(),
	showDismissedAfterDays: int().default(30).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("userId").on(table.userId),
]);

export const referralProgram = mysqlTable("referral_program", {
	id: bigint({ mode: "number" }).autoincrement().notNull(),
	referrerUserId: int("referrer_user_id"),
	referredUserId: int("referred_user_id"),
	referralCode: varchar("referral_code", { length: 50 }).notNull(),
	commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default('0.10'),
	commissionEarned: decimal("commission_earned", { precision: 10, scale: 2 }).default('0'),
	status: varchar({ length: 50 }).default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
},
(table) => [
	index("id").on(table.id),
]);

export const regions = mysqlTable("regions", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	primaryFramework: varchar({ length: 100 }),
	regulatoryBody: varchar({ length: 255 }),
	active: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("code").on(table.code),
]);

export const reportAssignments = mysqlTable("report_assignments", {
	id: int().autoincrement().notNull(),
	reportId: int().notNull(),
	analystId: int().notNull(),
	specialistId: int().notNull(),
	assignedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	dueAt: timestamp({ mode: 'string' }).notNull(),
	completedAt: timestamp({ mode: 'string' }),
	status: mysqlEnum(['assigned','in_progress','completed','escalated']).default('assigned').notNull(),
	reviewedAt: timestamp({ mode: 'string' }),
	qualityScore: int(),
	specialistFeedback: text(),
	escalated: tinyint().default(0).notNull(),
	escalationReason: text(),
	escalatedTo: mysqlEnum(['regional_specialist','council']),
	paymentAmount: int(),
	paymentStatus: mysqlEnum(['pending','paid']).default('pending').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const requirements = mysqlTable("requirements", {
	id: int().autoincrement().notNull(),
	frameworkId: int().notNull(),
	articleNumber: varchar({ length: 50 }),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	category: varchar({ length: 100 }),
	riskLevelApplicable: mysqlEnum(['all','minimal','limited','high','unacceptable']).default('all'),
	isMandatory: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const specialistEarnings = mysqlTable("specialist_earnings", {
	id: int().autoincrement().notNull(),
	specialistId: int().notNull(),
	period: varchar({ length: 20 }).notNull(),
	baseSalary: int().notNull(),
	analystCommissions: int().default(0).notNull(),
	courseCommissions: int().default(0).notNull(),
	performanceBonus: int().default(0).notNull(),
	totalEarnings: int().notNull(),
	paidAt: timestamp({ mode: 'string' }),
	paymentStatus: mysqlEnum(['pending','processing','paid']).default('pending').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const specialists = mysqlTable("specialists", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	regionId: int().notNull(),
	specialistType: mysqlEnum(['regional','industry']).notNull(),
	industry: varchar({ length: 100 }),
	supervisorId: int(),
	certifications: json(),
	yearsExperience: int(),
	bio: text(),
	baseSalary: int().default(5000).notNull(),
	commissionRate: int().default(10).notNull(),
	courseCommissionRate: int().default(20).notNull(),
	status: mysqlEnum(['active','probation','suspended','inactive']).default('probation').notNull(),
	probationStartDate: timestamp({ mode: 'string' }),
	probationEndDate: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const testQuestions = mysqlTable("test_questions", {
	id: int().autoincrement().notNull(),
	testId: int().notNull(),
	moduleId: int(),
	questionText: text().notNull(),
	questionType: mysqlEnum(['multiple_choice','true_false','scenario']).default('multiple_choice').notNull(),
	options: json().notNull(),
	correctAnswer: varchar({ length: 255 }).notNull(),
	explanation: text(),
	points: int().default(1).notNull(),
	difficulty: mysqlEnum(['easy','medium','hard']).default('medium').notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const trainingModules = mysqlTable("training_modules", {
	id: int().autoincrement().notNull(),
	code: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	content: text().notNull(),
	orderIndex: int().default(0).notNull(),
	durationMinutes: int().default(30).notNull(),
	isRequired: tinyint().default(1).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
},
(table) => [
	index("training_modules_code_unique").on(table.code),
]);

export const userCertificates = mysqlTable("user_certificates", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	testId: int().notNull(),
	attemptId: int().notNull(),
	certificateNumber: varchar({ length: 100 }).notNull(),
	certificateType: mysqlEnum(['basic','advanced','expert']).default('basic').notNull(),
	issuedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	expiresAt: timestamp({ mode: 'string' }),
	isRevoked: tinyint().default(0).notNull(),
	revokedReason: text(),
},
(table) => [
	index("user_certificates_certificateNumber_unique").on(table.certificateNumber),
]);

export const userTestAttempts = mysqlTable("user_test_attempts", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	testId: int().notNull(),
	score: int().default(0).notNull(),
	totalPoints: int().default(0).notNull(),
	percentScore: decimal({ precision: 5, scale: 2 }),
	passed: tinyint().default(0).notNull(),
	answers: json(),
	startedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const userTrainingProgress = mysqlTable("user_training_progress", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	moduleId: int().notNull(),
	status: mysqlEnum(['not_started','in_progress','completed']).default('not_started').notNull(),
	progressPercent: int().default(0).notNull(),
	startedAt: timestamp({ mode: 'string' }),
	completedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	openId: varchar({ length: 64 }).notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar({ length: 64 }),
	role: mysqlEnum(['user','admin','watchdog_analyst','regulator','enterprise_admin','compliance_officer']).default('user').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
	lastSignedIn: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	stripeCustomerId: varchar({ length: 255 }),
	stripeSubscriptionId: varchar({ length: 255 }),
	subscriptionTier: mysqlEnum(['free','pro','enterprise']).default('free').notNull(),
	subscriptionStatus: mysqlEnum(['active','canceled','past_due','trialing','none']).default('none').notNull(),
	brand: varchar({ length: 50 }).default('councilof.ai'),
	foundingMember: tinyint("founding_member").default(0),
	referralCode: varchar("referral_code", { length: 50 }),
},
(table) => [
	index("users_openId_unique").on(table.openId),
]);

export const watchdogApplications = mysqlTable("watchdog_applications", {
	id: int().autoincrement().notNull(),
	email: varchar({ length: 320 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 100 }),
	timezone: varchar({ length: 100 }),
	experience: text(),
	motivation: text(),
	availableHoursPerWeek: int(),
	status: mysqlEnum(['pending','approved','rejected','waitlisted']).default('pending').notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});

export const watchdogComments = mysqlTable("watchdog_comments", {
	id: int().autoincrement().notNull(),
	reportId: int().notNull(),
	userId: int(),
	authorName: varchar({ length: 255 }),
	content: text().notNull(),
	isOfficial: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
});

export const watchdogReports = mysqlTable("watchdog_reports", {
	id: int().autoincrement().notNull(),
	reporterId: int(),
	reporterEmail: varchar({ length: 320 }),
	reporterName: varchar({ length: 255 }),
	title: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	aiSystemName: varchar({ length: 255 }),
	companyName: varchar({ length: 255 }),
	incidentType: mysqlEnum(['bias','privacy','safety','misinformation','manipulation','other']).notNull(),
	severity: mysqlEnum(['low','medium','high','critical']).default('medium').notNull(),
	status: mysqlEnum(['submitted','under_review','investigating','resolved','dismissed']).default('submitted').notNull(),
	upvotes: int().default(0).notNull(),
	downvotes: int().default(0).notNull(),
	isPublic: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
});


// ============================================
// TRANSLATION TABLES
// ============================================

export const courseTranslations = mysqlTable("course_translations", {
	id: int().autoincrement().notNull(),
	courseId: int().notNull(),
	language: varchar({ length: 10 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	content: text(),
	learningObjectives: json().$type<string[]>(),
	duration: int(),
	difficulty: mysqlEnum(['beginner','intermediate','advanced']),
	isPublished: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => ({
	courseIdLanguageIdx: index("idx_courseId_language").on(table.courseId, table.language),
	languageIdx: index("idx_language").on(table.language),
}));

export type CourseTranslation = typeof courseTranslations.$inferSelect;
export type InsertCourseTranslation = typeof courseTranslations.$inferInsert;

export const moduleTranslations = mysqlTable("module_translations", {
	id: int().autoincrement().notNull(),
	moduleId: int().notNull(),
	language: varchar({ length: 10 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	content: text(),
	learningObjectives: json().$type<string[]>(),
	keyTakeaways: json().$type<string[]>(),
	duration: int(),
	isPublished: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => ({
	moduleIdLanguageIdx: index("idx_moduleId_language").on(table.moduleId, table.language),
	moduleLanguageIdx: index("idx_module_language").on(table.language),
}));

export type ModuleTranslation = typeof moduleTranslations.$inferSelect;
export type InsertModuleTranslation = typeof moduleTranslations.$inferInsert;

export const lessonTranslations = mysqlTable("lesson_translations", {
	id: int().autoincrement().notNull(),
	lessonId: int().notNull(),
	language: varchar({ length: 10 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	content: text(),
	videoUrl: varchar({ length: 500 }),
	videoCaptions: text(),
	resources: json().$type<Array<{ title: string; url: string; type: string }>>(),
	isPublished: tinyint().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => ({
	lessonIdLanguageIdx: index("idx_lessonId_language").on(table.lessonId, table.language),
	lessonLanguageIdx: index("idx_lesson_language").on(table.language),
}));

export type LessonTranslation = typeof lessonTranslations.$inferSelect;
export type InsertLessonTranslation = typeof lessonTranslations.$inferInsert;

// ============================================
// REALTIME EVENTS TABLES
// ============================================

export const realtimeEvents = mysqlTable("realtime_events", {
	id: int().autoincrement().notNull(),
	userId: int(),
	organizationId: int(),
	aiSystemId: int(),
	eventType: mysqlEnum(['compliance_update','enforcement_action','audit_result','risk_alert','certification_issued','framework_update','council_decision','watchdog_report']).notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	severity: mysqlEnum(['info','warning','critical']).default('info').notNull(),
	data: json(),
	isRead: tinyint().default(0).notNull(),
	readAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
}, (table) => ({
	userIdIdx: index("idx_userId_realtime").on(table.userId),
	organizationIdIdx: index("idx_organizationId_realtime").on(table.organizationId),
	aiSystemIdIdx: index("idx_aiSystemId_realtime").on(table.aiSystemId),
	eventTypeIdx: index("idx_eventType").on(table.eventType),
	createdAtIdx: index("idx_createdAt_realtime").on(table.createdAt),
}));

export type RealtimeEvent = typeof realtimeEvents.$inferSelect;
export type InsertRealtimeEvent = typeof realtimeEvents.$inferInsert;

export const websocketConnections = mysqlTable("websocket_connections", {
	id: int().autoincrement().notNull(),
	userId: int().notNull(),
	connectionId: varchar({ length: 255 }).notNull(),
	isActive: tinyint().default(1).notNull(),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	lastHeartbeat: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => ({
	userIdIdx: index("idx_userId_ws").on(table.userId),
	connectionIdIdx: index("idx_connectionId_ws").on(table.connectionId),
}));

export type WebsocketConnection = typeof websocketConnections.$inferSelect;
export type InsertWebsocketConnection = typeof websocketConnections.$inferInsert;


// ============================================
// ADVISORY BOARD APPLICATIONS
// ============================================

export const advisoryBoardApplications = mysqlTable("advisory_board_applications", {
	id: int().autoincrement().notNull(),
	applicantName: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 320 }).notNull(),
	position: mysqlEnum(['chair','regulatory_expert','academic_expert']).notNull(),
	yearsOfExperience: int().notNull(),
	currentRole: varchar({ length: 255 }).notNull(),
	organization: varchar({ length: 255 }).notNull(),
	motivation: text().notNull(),
	resumeUrl: varchar({ length: 500 }),
	linkedinUrl: varchar({ length: 500 }),
	status: mysqlEnum(['submitted','under_review','shortlisted','accepted','rejected']).default('submitted').notNull(),
	reviewNotes: text(),
	appliedAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	reviewedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().onUpdateNow().notNull(),
}, (table) => ({
	emailIdx: index("idx_advisory_email").on(table.email),
	statusIdx: index("idx_advisory_status").on(table.status),
	positionIdx: index("idx_advisory_position").on(table.position),
}));

export type AdvisoryBoardApplication = typeof advisoryBoardApplications.$inferSelect;
export type InsertAdvisoryBoardApplication = typeof advisoryBoardApplications.$inferInsert;
