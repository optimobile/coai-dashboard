import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { 
  watchdogReports, 
  watchdogApplications, 
  councilSessions, 
  agentVotes,
  frameworks,
  aiSystems,
  assessments,
  trainingModules,
  userTrainingProgress,
  certificationTests,
  testQuestions,
  userTestAttempts,
  userCertificates,
  caseAssignments,
  analystDecisions,
  analystPerformance,
  users
} from "../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

// ============================================
// WATCHDOG ROUTER - Public incident reporting
// ============================================
const watchdogRouter = router({
  // Get all public watchdog reports
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    
    const reports = await db
      .select()
      .from(watchdogReports)
      .where(eq(watchdogReports.isPublic, true))
      .orderBy(desc(watchdogReports.createdAt))
      .limit(50);
    
    return reports;
  }),

  // Submit a new watchdog report
  submit: publicProcedure
    .input(z.object({
      title: z.string().min(10).max(255),
      description: z.string().min(50).max(5000),
      aiSystemName: z.string().optional(),
      companyName: z.string().optional(),
      incidentType: z.enum(["bias", "privacy", "safety", "misinformation", "manipulation", "other"]),
      severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
      reporterEmail: z.string().email().optional(),
      reporterName: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [report] = await db.insert(watchdogReports).values({
        ...input,
        reporterId: ctx.user?.id,
        status: "submitted",
      }).$returningId();

      // Automatically create a council session for this report
      await db.insert(councilSessions).values({
        subjectType: "watchdog_report",
        subjectId: report.id,
        subjectTitle: input.title,
        subjectDescription: input.description,
        status: "voting",
      });

      return { success: true, reportId: report.id };
    }),

  // Upvote a report
  upvote: publicProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(watchdogReports)
        .set({ upvotes: sql`${watchdogReports.upvotes} + 1` })
        .where(eq(watchdogReports.id, input.reportId));

      return { success: true };
    }),

  // Get report details
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [report] = await db
        .select()
        .from(watchdogReports)
        .where(eq(watchdogReports.id, input.id))
        .limit(1);

      return report || null;
    }),
});

// ============================================
// WATCHDOG APPLICATIONS - LOI Collection
// ============================================
const applicationsRouter = router({
  // Submit application to become a Watchdog Analyst
  submit: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(2).max(255),
      country: z.string().optional(),
      timezone: z.string().optional(),
      experience: z.string().optional(),
      motivation: z.string().min(50).max(2000),
      availableHoursPerWeek: z.number().min(1).max(40).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [application] = await db.insert(watchdogApplications).values({
        ...input,
        status: "pending",
      }).$returningId();

      // Send notification to owner about new LOI signup
      try {
        await notifyOwner({
          title: `🎯 New Watchdog Analyst Application: ${input.name}`,
          content: `A new Letter of Intent has been submitted!

**Applicant:** ${input.name}
**Email:** ${input.email}
**Country:** ${input.country || "Not specified"}
**Motivation:** ${input.motivation.substring(0, 200)}${input.motivation.length > 200 ? "..." : ""}
**Available Hours/Week:** ${input.availableHoursPerWeek || "Not specified"}

This LOI adds to your market validation. Total applications can be viewed in the COAI Dashboard.`,
        });
      } catch (e) {
        console.warn("Failed to send notification:", e);
      }

      return { success: true, applicationId: application.id };
    }),

  // Get application count (for LOI display)
  getCount: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { count: 0 };

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(watchdogApplications);

    return { count: result[0]?.count || 0 };
  }),

  // Admin: List all applications
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(watchdogApplications)
      .orderBy(desc(watchdogApplications.createdAt));
  }),
});

// ============================================
// 33-AGENT COUNCIL ROUTER
// ============================================
const councilRouter = router({
  // Get all council sessions
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(councilSessions)
      .orderBy(desc(councilSessions.createdAt))
      .limit(20);
  }),

  // Get session with votes
  getSession: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [session] = await db
        .select()
        .from(councilSessions)
        .where(eq(councilSessions.id, input.id))
        .limit(1);

      if (!session) return null;

      const votes = await db
        .select()
        .from(agentVotes)
        .where(eq(agentVotes.sessionId, input.id));

      return { session, votes };
    }),

  // Trigger 33-agent voting on a session (uses LLM)
  triggerVoting: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the session
      const [session] = await db
        .select()
        .from(councilSessions)
        .where(eq(councilSessions.id, input.sessionId))
        .limit(1);

      if (!session) throw new Error("Session not found");

      // Define the 33 agents
      const agents = generateAgentCouncil();
      const votes: { agentId: string; agentType: "guardian" | "arbiter" | "scribe"; agentProvider: "openai" | "anthropic" | "google"; vote: "approve" | "reject" | "escalate"; confidence: number; reasoning: string }[] = [];

      // Simulate voting (in production, each would call different LLM endpoints)
      for (const agent of agents) {
        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: `You are ${agent.name}, a ${agent.type} agent in the COAI 33-Agent Council. Your role is to evaluate AI safety incidents and vote on appropriate actions. You must respond with a JSON object containing: vote ("approve", "reject", or "escalate"), confidence (0-1), and reasoning (brief explanation).`
              },
              {
                role: "user",
                content: `Please evaluate this incident and cast your vote:

Title: ${session.subjectTitle}
Description: ${session.subjectDescription}
Type: ${session.subjectType}

Respond with JSON only: {"vote": "approve|reject|escalate", "confidence": 0.0-1.0, "reasoning": "your brief reasoning"}`
              }
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "agent_vote",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    vote: { type: "string", enum: ["approve", "reject", "escalate"] },
                    confidence: { type: "number" },
                    reasoning: { type: "string" }
                  },
                  required: ["vote", "confidence", "reasoning"],
                  additionalProperties: false
                }
              }
            }
          });

          const content = response.choices[0]?.message?.content as string | undefined;
          if (content) {
            const parsed = JSON.parse(content);
            votes.push({
              agentId: agent.id,
              agentType: agent.type as "guardian" | "arbiter" | "scribe",
              agentProvider: agent.provider as "openai" | "anthropic" | "google",
              vote: parsed.vote,
              confidence: parsed.confidence,
              reasoning: parsed.reasoning
            });
          }
        } catch (error) {
          // Fallback vote if LLM fails
          votes.push({
            agentId: agent.id,
            agentType: agent.type as "guardian" | "arbiter" | "scribe",
            agentProvider: agent.provider as "openai" | "anthropic" | "google",
            vote: "escalate",
            confidence: 0.5,
            reasoning: "Unable to evaluate - escalating to human review"
          });
        }
      }

      // Save votes to database
      for (const vote of votes) {
        await db.insert(agentVotes).values({
          sessionId: input.sessionId,
          ...vote,
          confidence: vote.confidence.toString(),
        });
      }

      // Calculate results
      const approveCount = votes.filter(v => v.vote === "approve").length;
      const rejectCount = votes.filter(v => v.vote === "reject").length;
      const escalateCount = votes.filter(v => v.vote === "escalate").length;

      // Determine consensus (2/3 majority = 22/33)
      const consensusThreshold = 22;
      let finalDecision: "approved" | "rejected" | "escalated" = "escalated";
      let status: "consensus_reached" | "escalated_to_human" = "escalated_to_human";

      if (approveCount >= consensusThreshold) {
        finalDecision = "approved";
        status = "consensus_reached";
      } else if (rejectCount >= consensusThreshold) {
        finalDecision = "rejected";
        status = "consensus_reached";
      }

      // Update session
      await db
        .update(councilSessions)
        .set({
          status,
          totalVotes: 33,
          approveVotes: approveCount,
          rejectVotes: rejectCount,
          escalateVotes: escalateCount,
          finalDecision,
          completedAt: new Date(),
        })
        .where(eq(councilSessions.id, input.sessionId));

      return {
        success: true,
        totalVotes: 33,
        approveVotes: approveCount,
        rejectVotes: rejectCount,
        escalateVotes: escalateCount,
        finalDecision,
        consensusReached: status === "consensus_reached"
      };
    }),

  // Get council statistics
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {
      totalSessions: 0,
      consensusReached: 0,
      escalatedToHuman: 0,
      pendingReview: 0
    };

    const sessions = await db.select().from(councilSessions);
    
    return {
      totalSessions: sessions.length,
      consensusReached: sessions.filter(s => s.status === "consensus_reached").length,
      escalatedToHuman: sessions.filter(s => s.status === "escalated_to_human").length,
      pendingReview: sessions.filter(s => s.status === "voting").length
    };
  }),
});

// ============================================
// COMPLIANCE ROUTER
// ============================================
const complianceRouter = router({
  // Get all frameworks
  getFrameworks: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      // Return default frameworks if DB not available
      return [
        { id: 1, code: "EU_AI_ACT", name: "EU AI Act", version: "2024/1689", jurisdiction: "European Union", isActive: true },
        { id: 2, code: "NIST_AI_RMF", name: "NIST AI RMF", version: "1.0", jurisdiction: "United States", isActive: true },
        { id: 3, code: "TC260", name: "TC260 AI Safety Framework", version: "2.0", jurisdiction: "China", isActive: true },
      ];
    }

    return db.select().from(frameworks).where(eq(frameworks.isActive, true));
  }),

  // Get compliance summary for dashboard
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalSystems: 0,
        compliantSystems: 0,
        pendingAssessments: 0,
        overallScore: 0
      };
    }

    const systems = await db
      .select()
      .from(aiSystems)
      .where(eq(aiSystems.userId, ctx.user.id));

    const assessmentList = await db.select().from(assessments);

    return {
      totalSystems: systems.length,
      compliantSystems: systems.filter(s => s.status === "compliant").length,
      pendingAssessments: assessmentList.filter(a => a.status === "pending").length,
      overallScore: 75 // Placeholder - would calculate from actual assessments
    };
  }),
});

// ============================================
// AI SYSTEMS ROUTER
// ============================================
const aiSystemsRouter = router({
  // List user's AI systems
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(aiSystems)
      .where(eq(aiSystems.userId, ctx.user.id))
      .orderBy(desc(aiSystems.createdAt));
  }),

  // Register a new AI system
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(3).max(255),
      description: z.string().optional(),
      systemType: z.enum(["chatbot", "recommendation", "classification", "generation", "analysis", "other"]),
      riskLevel: z.enum(["minimal", "limited", "high", "unacceptable"]).default("minimal"),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [system] = await db.insert(aiSystems).values({
        ...input,
        userId: ctx.user.id,
        status: "draft",
      }).$returningId();

      return { success: true, systemId: system.id };
    }),

  // Get system by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const [system] = await db
        .select()
        .from(aiSystems)
        .where(eq(aiSystems.id, input.id))
        .limit(1);

      if (!system || system.userId !== ctx.user.id) return null;
      return system;
    }),
});

// ============================================
// DASHBOARD STATS ROUTER
// ============================================
const dashboardRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    
    // Return mock data if DB not available
    if (!db) {
      return {
        totalSystems: 12,
        complianceScore: 78,
        pendingReviews: 5,
        watchdogReports: 23,
        councilSessions: 8,
        loiCount: 156
      };
    }

    const systems = await db.select().from(aiSystems).where(eq(aiSystems.userId, ctx.user.id));
    const reports = await db.select().from(watchdogReports);
    const sessions = await db.select().from(councilSessions);
    const applications = await db.select().from(watchdogApplications);

    return {
      totalSystems: systems.length,
      complianceScore: 78, // Would calculate from assessments
      pendingReviews: sessions.filter(s => s.status === "voting").length,
      watchdogReports: reports.length,
      councilSessions: sessions.length,
      loiCount: applications.length
    };
  }),
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateAgentCouncil() {
  const agents: { id: string; name: string; type: string; provider: string }[] = [];
  
  const types = ["guardian", "arbiter", "scribe"];
  const providers = ["openai", "anthropic", "google"];
  
  let agentNum = 1;
  for (const type of types) {
    for (let i = 0; i < 11; i++) {
      const provider = providers[i % 3];
      agents.push({
        id: `agent_${agentNum}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Agent ${i + 1}`,
        type,
        provider: provider!
      });
      agentNum++;
    }
  }
  
  return agents;
}

// ============================================
// TRAINING ROUTER - Analyst training modules
// ============================================
const trainingRouter = router({
  // Get all training modules
  getModules: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(trainingModules)
      .where(eq(trainingModules.isActive, true))
      .orderBy(trainingModules.orderIndex);
  }),

  // Get module by ID
  getModule: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [module] = await db
        .select()
        .from(trainingModules)
        .where(eq(trainingModules.id, input.id))
        .limit(1);

      return module || null;
    }),

  // Get user's training progress
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(userTrainingProgress)
      .where(eq(userTrainingProgress.userId, ctx.user.id));
  }),

  // Start a training module
  startModule: protectedProcedure
    .input(z.object({ moduleId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if progress exists
      const [existing] = await db
        .select()
        .from(userTrainingProgress)
        .where(and(
          eq(userTrainingProgress.userId, ctx.user.id),
          eq(userTrainingProgress.moduleId, input.moduleId)
        ))
        .limit(1);

      if (existing) {
        await db
          .update(userTrainingProgress)
          .set({ status: "in_progress", startedAt: new Date() })
          .where(eq(userTrainingProgress.id, existing.id));
      } else {
        await db.insert(userTrainingProgress).values({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          status: "in_progress",
          startedAt: new Date(),
        });
      }

      return { success: true };
    }),

  // Complete a training module
  completeModule: protectedProcedure
    .input(z.object({ moduleId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(userTrainingProgress)
        .set({ 
          status: "completed", 
          progressPercent: 100,
          completedAt: new Date() 
        })
        .where(and(
          eq(userTrainingProgress.userId, ctx.user.id),
          eq(userTrainingProgress.moduleId, input.moduleId)
        ));

      return { success: true };
    }),
});

// ============================================
// CERTIFICATION ROUTER - Tests and certificates
// ============================================
const certificationRouter = router({
  // Get available tests
  getTests: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(certificationTests)
      .where(eq(certificationTests.isActive, true));
  }),

  // Get test with questions (for taking the test)
  getTestQuestions: protectedProcedure
    .input(z.object({ testId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [test] = await db
        .select()
        .from(certificationTests)
        .where(eq(certificationTests.id, input.testId))
        .limit(1);

      if (!test) return null;

      const questions = await db
        .select({
          id: testQuestions.id,
          questionText: testQuestions.questionText,
          questionType: testQuestions.questionType,
          options: testQuestions.options,
          points: testQuestions.points,
          difficulty: testQuestions.difficulty,
        })
        .from(testQuestions)
        .where(and(
          eq(testQuestions.testId, input.testId),
          eq(testQuestions.isActive, true)
        ));

      return { test, questions };
    }),

  // Start a test attempt
  startTest: protectedProcedure
    .input(z.object({ testId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [attempt] = await db.insert(userTestAttempts).values({
        userId: ctx.user.id,
        testId: input.testId,
        startedAt: new Date(),
      }).$returningId();

      return { attemptId: attempt.id };
    }),

  // Submit test answers
  submitTest: protectedProcedure
    .input(z.object({
      attemptId: z.number(),
      answers: z.record(z.string(), z.string()), // questionId -> answer
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the attempt
      const [attempt] = await db
        .select()
        .from(userTestAttempts)
        .where(eq(userTestAttempts.id, input.attemptId))
        .limit(1);

      if (!attempt || attempt.userId !== ctx.user.id) {
        throw new Error("Test attempt not found");
      }

      // Get test and questions
      const [test] = await db
        .select()
        .from(certificationTests)
        .where(eq(certificationTests.id, attempt.testId))
        .limit(1);

      const questions = await db
        .select()
        .from(testQuestions)
        .where(eq(testQuestions.testId, attempt.testId));

      // Calculate score
      let totalPoints = 0;
      let earnedPoints = 0;

      for (const question of questions) {
        totalPoints += question.points;
        const userAnswer = input.answers[question.id.toString()];
        if (userAnswer === question.correctAnswer) {
          earnedPoints += question.points;
        }
      }

      const percentScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
      const passed = percentScore >= (test?.passingScore || 70);

      // Update attempt
      await db
        .update(userTestAttempts)
        .set({
          score: earnedPoints,
          totalPoints,
          percentScore: percentScore.toFixed(2),
          passed,
          answers: input.answers,
          completedAt: new Date(),
        })
        .where(eq(userTestAttempts.id, input.attemptId));

      // If passed, issue certificate
      if (passed) {
        const certificateNumber = `COAI-WA-${Date.now()}-${ctx.user.id}`;
        
        await db.insert(userCertificates).values({
          userId: ctx.user.id,
          testId: attempt.testId,
          attemptId: input.attemptId,
          certificateNumber,
          certificateType: "basic",
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        });

        // Update user role to watchdog_analyst
        await db
          .update(users)
          .set({ role: "watchdog_analyst" })
          .where(eq(users.id, ctx.user.id));

        // Send notification about new certified analyst
        try {
          await notifyOwner({
            title: `🎉 New Certified Watchdog Analyst!`,
            content: `A user has passed the certification exam and is now a certified COAI Watchdog Analyst!

**User ID:** ${ctx.user.id}
**Certificate Number:** ${certificateNumber}
**Score:** ${Math.round(percentScore)}%
**Passing Score:** ${test?.passingScore || 70}%

This analyst can now review AI safety cases in the Workbench. Your certified analyst pool is growing!`,
          });
        } catch (e) {
          console.warn("Failed to send certification notification:", e);
        }
      }

      return { 
        passed, 
        score: earnedPoints, 
        totalPoints, 
        percentScore: Math.round(percentScore),
        certificateNumber: passed ? `COAI-WA-${Date.now()}-${ctx.user.id}` : null
      };
    }),

  // Get user's certificates
  getMyCertificates: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(userCertificates)
      .where(eq(userCertificates.userId, ctx.user.id));
  }),

  // Get user's test attempts
  getMyAttempts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(userTestAttempts)
      .where(eq(userTestAttempts.userId, ctx.user.id))
      .orderBy(desc(userTestAttempts.createdAt));
  }),
});

// ============================================
// ANALYST WORKBENCH ROUTER - Case review
// ============================================
const workbenchRouter = router({
  // Get assigned cases for the analyst
  getMyCases: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Verify user is a watchdog analyst
    if (ctx.user.role !== "watchdog_analyst" && ctx.user.role !== "admin") {
      return [];
    }

    const assignments = await db
      .select()
      .from(caseAssignments)
      .where(eq(caseAssignments.analystId, ctx.user.id))
      .orderBy(desc(caseAssignments.assignedAt));

    // Get report details for each assignment
    const casesWithDetails = await Promise.all(
      assignments.map(async (assignment) => {
        const [report] = await db
          .select()
          .from(watchdogReports)
          .where(eq(watchdogReports.id, assignment.reportId))
          .limit(1);

        return { assignment, report };
      })
    );

    return casesWithDetails;
  }),

  // Get case details
  getCaseDetails: protectedProcedure
    .input(z.object({ assignmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const [assignment] = await db
        .select()
        .from(caseAssignments)
        .where(eq(caseAssignments.id, input.assignmentId))
        .limit(1);

      if (!assignment || (assignment.analystId !== ctx.user.id && ctx.user.role !== "admin")) {
        return null;
      }

      const [report] = await db
        .select()
        .from(watchdogReports)
        .where(eq(watchdogReports.id, assignment.reportId))
        .limit(1);

      // Get council session if exists
      let councilSession = null;
      let councilVotes: any[] = [];
      if (assignment.councilSessionId) {
        const [session] = await db
          .select()
          .from(councilSessions)
          .where(eq(councilSessions.id, assignment.councilSessionId))
          .limit(1);
        councilSession = session;

        councilVotes = await db
          .select()
          .from(agentVotes)
          .where(eq(agentVotes.sessionId, assignment.councilSessionId));
      }

      return { assignment, report, councilSession, councilVotes };
    }),

  // Submit decision on a case
  submitDecision: protectedProcedure
    .input(z.object({
      assignmentId: z.number(),
      decision: z.enum(["approve", "reject", "escalate", "needs_more_info"]),
      confidence: z.enum(["low", "medium", "high"]),
      reasoning: z.string().min(50).max(2000),
      timeSpentMinutes: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify assignment belongs to user
      const [assignment] = await db
        .select()
        .from(caseAssignments)
        .where(eq(caseAssignments.id, input.assignmentId))
        .limit(1);

      if (!assignment || assignment.analystId !== ctx.user.id) {
        throw new Error("Assignment not found");
      }

      // Create decision record
      await db.insert(analystDecisions).values({
        assignmentId: input.assignmentId,
        analystId: ctx.user.id,
        decision: input.decision,
        confidence: input.confidence,
        reasoning: input.reasoning,
        timeSpentMinutes: input.timeSpentMinutes,
      });

      // Update assignment status
      await db
        .update(caseAssignments)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(caseAssignments.id, input.assignmentId));

      // Update report status based on decision
      const reportStatus = input.decision === "approve" ? "resolved" : 
                          input.decision === "reject" ? "dismissed" : "investigating";
      
      await db
        .update(watchdogReports)
        .set({ status: reportStatus })
        .where(eq(watchdogReports.id, assignment.reportId));

      // Update analyst performance
      await updateAnalystPerformance(ctx.user.id);

      return { success: true };
    }),

  // Get analyst performance stats
  getMyPerformance: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const [performance] = await db
      .select()
      .from(analystPerformance)
      .where(eq(analystPerformance.analystId, ctx.user.id))
      .limit(1);

    return performance || null;
  }),

  // Get leaderboard
  getLeaderboard: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const leaderboard = await db
      .select({
        rank: analystPerformance.rank,
        totalCasesCompleted: analystPerformance.totalCasesCompleted,
        accuracyRate: analystPerformance.accuracyRate,
        qualityScore: analystPerformance.qualityScore,
      })
      .from(analystPerformance)
      .orderBy(desc(analystPerformance.qualityScore))
      .limit(50);

    return leaderboard;
  }),
});

// Helper function to update analyst performance
async function updateAnalystPerformance(analystId: number) {
  const db = await getDb();
  if (!db) return;

  // Get all assignments for this analyst
  const assignments = await db
    .select()
    .from(caseAssignments)
    .where(eq(caseAssignments.analystId, analystId));

  const totalAssigned = assignments.length;
  const completed = assignments.filter(a => a.status === "completed").length;
  const expired = assignments.filter(a => a.status === "expired").length;

  // Check if performance record exists
  const [existing] = await db
    .select()
    .from(analystPerformance)
    .where(eq(analystPerformance.analystId, analystId))
    .limit(1);

  const data = {
    totalCasesAssigned: totalAssigned,
    totalCasesCompleted: completed,
    totalCasesExpired: expired,
    lastActiveAt: new Date(),
  };

  if (existing) {
    await db
      .update(analystPerformance)
      .set(data)
      .where(eq(analystPerformance.analystId, analystId));
  } else {
    await db.insert(analystPerformance).values({
      analystId,
      ...data,
    });
  }
}

// ============================================
// CHAT ROUTER - LLM-powered compliance assistant
// ============================================
const chatRouter = router({
  // Send a message and get AI response
  sendMessage: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      context: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are COAI, the Council of AIs - a Western equivalent to China's TC260 AI Safety Governance Framework. You are an expert in AI safety, compliance, and governance across multiple frameworks:

1. **EU AI Act** (Regulation 2024/1689) - 113 articles covering risk classification, prohibited practices, high-risk requirements, transparency obligations
2. **NIST AI RMF** - GOVERN, MAP, MEASURE, MANAGE functions for AI risk management
3. **TC260** - China's AI Safety Governance Framework with 14 governance measures

You help organizations:
- Understand compliance requirements
- Assess AI system risks
- Navigate multi-framework compliance
- Report and investigate AI safety incidents
- Implement the SOAI-PDCA continuous improvement loop

Be helpful, accurate, and cite specific articles/requirements when relevant. If you're unsure, recommend consulting with legal experts or using the 33-Agent Council for formal assessments.`
            },
            {
              role: "user",
              content: input.message
            }
          ],
          response_format: { type: "text" }
        });

        const content = response.choices[0]?.message?.content as string || "I apologize, but I couldn't generate a response. Please try again.";

        return {
          response: content,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Chat error:", error);
        return {
          response: "I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.",
          timestamp: new Date().toISOString(),
        };
      }
    }),
});

// ============================================
// MAIN APP ROUTER
// ============================================
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  
  // Feature routers
  watchdog: watchdogRouter,
  applications: applicationsRouter,
  council: councilRouter,
  compliance: complianceRouter,
  aiSystems: aiSystemsRouter,
  dashboard: dashboardRouter,
  training: trainingRouter,
  certification: certificationRouter,
  workbench: workbenchRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
