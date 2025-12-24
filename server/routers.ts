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
  assessments
} from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";

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
});

export type AppRouter = typeof appRouter;
