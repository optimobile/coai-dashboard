/**
 * RLMAI Recommendations Engine
 * 
 * Analyzes council decisions, incident patterns, and compliance data
 * to generate personalized compliance recommendations for users.
 */

import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { 
  watchdogReports, 
  councilSessions, 
  agentVotes,
  aiSystems,
  assessments,
  assessmentItems,
  frameworks,
  pdcaCycles,
} from "../drizzle/schema";
import { eq, desc, sql, and, inArray, isNull, or } from "drizzle-orm";

// Recommendation types and priorities
type RecommendationPriority = "critical" | "high" | "medium" | "low";
type RecommendationCategory = 
  | "compliance_gap" 
  | "incident_prevention" 
  | "governance_improvement" 
  | "risk_mitigation"
  | "best_practice"
  | "regulatory_update";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  framework?: string;
  aiSystemId?: number;
  aiSystemName?: string;
  actionItems: string[];
  basedOn: {
    type: "incident_pattern" | "council_decision" | "compliance_gap" | "industry_trend";
    details: string;
  };
  estimatedEffort: "low" | "medium" | "high";
  potentialImpact: "low" | "medium" | "high";
  createdAt: string;
}

// Framework-specific recommendation templates
const FRAMEWORK_RECOMMENDATIONS: Record<string, { title: string; description: string; actionItems: string[] }[]> = {
  "EU AI Act": [
    {
      title: "Implement Human Oversight Mechanisms",
      description: "EU AI Act Article 14 requires human oversight for high-risk AI systems. Ensure your system has appropriate human-in-the-loop controls.",
      actionItems: [
        "Designate human operators responsible for AI system oversight",
        "Implement pause/override controls for automated decisions",
        "Create escalation procedures for edge cases",
        "Document human oversight processes"
      ]
    },
    {
      title: "Establish Transparency Documentation",
      description: "Article 13 requires clear documentation of AI system capabilities and limitations for users.",
      actionItems: [
        "Create user-facing documentation explaining AI capabilities",
        "Document known limitations and failure modes",
        "Implement clear AI disclosure notices",
        "Maintain technical documentation for regulators"
      ]
    },
    {
      title: "Conduct Bias and Fairness Audit",
      description: "Article 10 requires training data to be representative and free from bias.",
      actionItems: [
        "Audit training data for demographic representation",
        "Test model outputs across different user groups",
        "Document bias mitigation measures",
        "Establish ongoing monitoring for discriminatory outcomes"
      ]
    }
  ],
  "NIST AI RMF": [
    {
      title: "Implement Risk Assessment Framework",
      description: "NIST AI RMF MAP function requires systematic identification and assessment of AI risks.",
      actionItems: [
        "Conduct comprehensive AI risk assessment",
        "Document risk tolerance levels for each use case",
        "Create risk mitigation strategies",
        "Establish risk monitoring dashboards"
      ]
    },
    {
      title: "Establish AI Governance Structure",
      description: "GOVERN function requires clear organizational accountability for AI systems.",
      actionItems: [
        "Define AI governance roles and responsibilities",
        "Create AI ethics committee or review board",
        "Establish AI policy documentation",
        "Implement regular governance reviews"
      ]
    },
    {
      title: "Deploy Continuous Monitoring",
      description: "MEASURE function requires ongoing measurement of AI system performance and impacts.",
      actionItems: [
        "Implement performance monitoring dashboards",
        "Track key safety and fairness metrics",
        "Set up automated alerting for anomalies",
        "Schedule regular model performance reviews"
      ]
    }
  ],
  "TC260": [
    {
      title: "Implement Content Safety Controls",
      description: "TC260 requires robust content safety measures for generative AI systems.",
      actionItems: [
        "Deploy content filtering for harmful outputs",
        "Implement prompt injection protections",
        "Create content moderation workflows",
        "Document safety testing procedures"
      ]
    },
    {
      title: "Establish Data Security Measures",
      description: "TC260 requires comprehensive data protection for AI training and inference.",
      actionItems: [
        "Implement data encryption at rest and in transit",
        "Establish data access controls and audit logs",
        "Create data retention and deletion policies",
        "Document data handling procedures"
      ]
    }
  ]
};

// Incident type to recommendation mapping
const INCIDENT_RECOMMENDATIONS: Record<string, { title: string; description: string; actionItems: string[] }> = {
  bias: {
    title: "Address Algorithmic Bias Risks",
    description: "Based on industry incident patterns, bias-related issues are a significant risk. Implement proactive bias detection and mitigation.",
    actionItems: [
      "Conduct bias audit across all AI decision points",
      "Implement fairness metrics monitoring",
      "Diversify training data sources",
      "Establish bias incident response procedures"
    ]
  },
  privacy: {
    title: "Strengthen Privacy Protections",
    description: "Privacy violations are a common incident type. Enhance data protection measures to prevent unauthorized data exposure.",
    actionItems: [
      "Review data minimization practices",
      "Implement differential privacy techniques",
      "Audit data access patterns",
      "Strengthen consent management"
    ]
  },
  safety: {
    title: "Enhance Safety Controls",
    description: "Safety failures can have severe consequences. Implement robust safety measures and fail-safes.",
    actionItems: [
      "Conduct safety-critical scenario testing",
      "Implement redundant safety systems",
      "Create emergency shutdown procedures",
      "Document operational design domain"
    ]
  },
  misinformation: {
    title: "Implement Misinformation Safeguards",
    description: "AI-generated misinformation is a growing concern. Deploy content verification and provenance measures.",
    actionItems: [
      "Implement content provenance tracking",
      "Deploy fact-checking integration",
      "Add AI-generated content watermarking",
      "Create misinformation response protocols"
    ]
  },
  manipulation: {
    title: "Prevent Manipulative AI Behaviors",
    description: "AI systems can inadvertently enable manipulation. Implement safeguards against dark patterns and deceptive practices.",
    actionItems: [
      "Audit recommendation algorithms for manipulation risks",
      "Implement user agency protections",
      "Review engagement optimization practices",
      "Create ethical design guidelines"
    ]
  },
  other: {
    title: "General AI Safety Review",
    description: "Conduct a comprehensive review of AI safety practices based on emerging incident patterns.",
    actionItems: [
      "Review all AI system documentation",
      "Conduct stakeholder impact assessment",
      "Update incident response procedures",
      "Schedule regular safety audits"
    ]
  }
};

export const recommendationsRouter = router({
  // Get personalized recommendations for the user
  getRecommendations: protectedProcedure
    .input(z.object({
      aiSystemId: z.number().optional(),
      limit: z.number().min(1).max(50).default(10),
      category: z.enum([
        "compliance_gap",
        "incident_prevention", 
        "governance_improvement",
        "risk_mitigation",
        "best_practice",
        "regulatory_update"
      ]).optional(),
      priority: z.enum(["critical", "high", "medium", "low"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const recommendations: Recommendation[] = [];
      
      // Get user's AI systems
      const userSystems = db ? await db
        .select()
        .from(aiSystems)
        .where(eq(aiSystems.userId, ctx.user.id)) : [];

      // Get incident patterns from public data
      const incidentPatterns = db ? await db
        .select({
          incidentType: watchdogReports.incidentType,
          count: sql<number>`count(*)`,
          avgSeverity: sql<number>`AVG(CASE 
            WHEN severity = 'critical' THEN 4 
            WHEN severity = 'high' THEN 3 
            WHEN severity = 'medium' THEN 2 
            ELSE 1 END)`,
        })
        .from(watchdogReports)
        .where(eq(watchdogReports.isPublic, true))
        .groupBy(watchdogReports.incidentType) : [];

      // Get council decision patterns
      const councilPatterns = db ? await db
        .select({
          finalDecision: councilSessions.finalDecision,
          count: sql<number>`count(*)`,
        })
        .from(councilSessions)
        .where(sql`${councilSessions.finalDecision} IS NOT NULL`)
        .groupBy(councilSessions.finalDecision) : [];

      // Get user's assessment gaps
      const systemIds = userSystems.map(s => s.id);
      const assessmentGaps = systemIds.length > 0 && db ? await db
        .select({
          aiSystemId: assessments.aiSystemId,
          frameworkId: assessments.frameworkId,
          overallScore: assessments.overallScore,
          status: assessments.status,
        })
        .from(assessments)
        .where(sql`${assessments.aiSystemId} IN (${sql.join(systemIds, sql`, `)})`) : [];

      // Get frameworks for reference
      const frameworkList = db ? await db.select().from(frameworks) : [];
      const frameworkMap = new Map(frameworkList.map(f => [f.id, f]));

      // Generate recommendations based on incident patterns
      const sortedIncidents = [...incidentPatterns].sort((a, b) => 
        (Number(b.avgSeverity) * Number(b.count)) - (Number(a.avgSeverity) * Number(a.count))
      );

      for (const incident of sortedIncidents.slice(0, 3)) {
        const template = INCIDENT_RECOMMENDATIONS[incident.incidentType] || INCIDENT_RECOMMENDATIONS.other;
        const priority = Number(incident.avgSeverity) >= 3 ? "high" : Number(incident.avgSeverity) >= 2 ? "medium" : "low";
        
        recommendations.push({
          id: `incident-${incident.incidentType}-${Date.now()}`,
          title: template.title,
          description: template.description,
          priority: priority as RecommendationPriority,
          category: "incident_prevention",
          actionItems: template.actionItems,
          basedOn: {
            type: "incident_pattern",
            details: `${incident.count} ${incident.incidentType} incidents reported with average severity ${Number(incident.avgSeverity).toFixed(1)}/4`
          },
          estimatedEffort: "medium",
          potentialImpact: priority === "high" ? "high" : "medium",
          createdAt: new Date().toISOString(),
        });
      }

      // Generate recommendations based on compliance gaps
      for (const system of userSystems) {
        const systemAssessments = assessmentGaps.filter(a => a.aiSystemId === system.id);
        
        // Check for missing framework assessments
        for (const framework of frameworkList) {
          const hasAssessment = systemAssessments.some(a => a.frameworkId === framework.id);
          if (!hasAssessment) {
            const frameworkRecs = FRAMEWORK_RECOMMENDATIONS[framework.name] || [];
            if (frameworkRecs.length > 0) {
              const template = frameworkRecs[0];
              recommendations.push({
                id: `compliance-${system.id}-${framework.id}-${Date.now()}`,
                title: `${framework.name} Compliance Assessment Required`,
                description: `Your AI system "${system.name}" has not been assessed against ${framework.name}. ${template.description}`,
                priority: system.riskLevel === "high" ? "critical" : system.riskLevel === "limited" ? "high" : "medium",
                category: "compliance_gap",
                framework: framework.name,
                aiSystemId: system.id,
                aiSystemName: system.name,
                actionItems: [
                  `Schedule ${framework.name} compliance assessment`,
                  ...template.actionItems.slice(0, 2)
                ],
                basedOn: {
                  type: "compliance_gap",
                  details: `No ${framework.name} assessment found for ${system.name}`
                },
                estimatedEffort: "high",
                potentialImpact: "high",
                createdAt: new Date().toISOString(),
              });
            }
          }
        }

        // Check for low-scoring assessments
        for (const assessment of systemAssessments) {
          const score = Number(assessment.overallScore) || 0;
          if (score < 70 && assessment.status === "completed") {
            const framework = frameworkMap.get(assessment.frameworkId);
            if (framework) {
              const frameworkRecs = FRAMEWORK_RECOMMENDATIONS[framework.name] || [];
              const template = frameworkRecs[Math.floor(Math.random() * frameworkRecs.length)];
              
              recommendations.push({
                id: `improvement-${system.id}-${framework.id}-${Date.now()}`,
                title: `Improve ${framework.name} Compliance Score`,
                description: `Your AI system "${system.name}" scored ${score}% on ${framework.name} assessment. ${template?.description || "Improvement actions are recommended."}`,
                priority: score < 50 ? "critical" : score < 60 ? "high" : "medium",
                category: "compliance_gap",
                framework: framework.name,
                aiSystemId: system.id,
                aiSystemName: system.name,
                actionItems: template?.actionItems || [
                  "Review assessment findings",
                  "Address non-compliant items",
                  "Schedule reassessment"
                ],
                basedOn: {
                  type: "compliance_gap",
                  details: `${framework.name} compliance score: ${score}%`
                },
                estimatedEffort: score < 50 ? "high" : "medium",
                potentialImpact: "high",
                createdAt: new Date().toISOString(),
              });
            }
          }
        }

        // Risk-based recommendations for high-risk systems
        if (system.riskLevel === "high" || system.riskLevel === "unacceptable") {
          recommendations.push({
            id: `risk-${system.id}-${Date.now()}`,
            title: "High-Risk AI System Review Required",
            description: `Your AI system "${system.name}" is classified as ${system.riskLevel} risk. Enhanced governance and oversight measures are required.`,
            priority: "critical",
            category: "risk_mitigation",
            aiSystemId: system.id,
            aiSystemName: system.name,
            actionItems: [
              "Conduct comprehensive risk assessment",
              "Implement enhanced human oversight",
              "Establish incident response procedures",
              "Schedule regular compliance audits",
              "Document risk mitigation measures"
            ],
            basedOn: {
              type: "industry_trend",
              details: `${system.riskLevel} risk classification requires enhanced governance`
            },
            estimatedEffort: "high",
            potentialImpact: "high",
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Generate governance recommendations based on council patterns
      const rejectionRate = councilPatterns.length > 0
        ? (councilPatterns.find(p => p.finalDecision === "rejected")?.count || 0) / 
          councilPatterns.reduce((sum, p) => sum + Number(p.count), 0)
        : 0;

      if (rejectionRate > 0.3) {
        recommendations.push({
          id: `governance-council-${Date.now()}`,
          title: "Strengthen Pre-Submission Review Process",
          description: "Council rejection rates indicate opportunities to improve submission quality through better pre-review processes.",
          priority: "medium",
          category: "governance_improvement",
          actionItems: [
            "Implement internal review checklist before council submission",
            "Create peer review process for compliance documentation",
            "Establish quality gates for assessment submissions",
            "Train team on common rejection reasons"
          ],
          basedOn: {
            type: "council_decision",
            details: `${Math.round(rejectionRate * 100)}% council rejection rate observed`
          },
          estimatedEffort: "medium",
          potentialImpact: "medium",
          createdAt: new Date().toISOString(),
        });
      }

      // Add best practice recommendations
      if (userSystems.length > 0) {
        recommendations.push({
          id: `best-practice-pdca-${Date.now()}`,
          title: "Implement PDCA Continuous Improvement",
          description: "Establish Plan-Do-Check-Act cycles for ongoing AI safety and compliance improvement.",
          priority: "low",
          category: "best_practice",
          actionItems: [
            "Create PDCA cycle for each AI system",
            "Define measurable improvement goals",
            "Schedule regular check phases",
            "Document lessons learned in act phase"
          ],
          basedOn: {
            type: "industry_trend",
            details: "PDCA methodology is industry best practice for continuous improvement"
          },
          estimatedEffort: "medium",
          potentialImpact: "high",
          createdAt: new Date().toISOString(),
        });
      }

      // Filter and sort recommendations
      let filteredRecs = recommendations;
      
      if (input?.aiSystemId) {
        filteredRecs = filteredRecs.filter(r => !r.aiSystemId || r.aiSystemId === input.aiSystemId);
      }
      
      if (input?.category) {
        filteredRecs = filteredRecs.filter(r => r.category === input.category);
      }
      
      if (input?.priority) {
        filteredRecs = filteredRecs.filter(r => r.priority === input.priority);
      }

      // Sort by priority
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      filteredRecs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      return {
        recommendations: filteredRecs.slice(0, input?.limit || 10),
        totalCount: filteredRecs.length,
        summary: {
          critical: filteredRecs.filter(r => r.priority === "critical").length,
          high: filteredRecs.filter(r => r.priority === "high").length,
          medium: filteredRecs.filter(r => r.priority === "medium").length,
          low: filteredRecs.filter(r => r.priority === "low").length,
        },
        generatedAt: new Date().toISOString(),
      };
    }),

  // Get recommendation categories and counts
  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    
    // Get user's systems to determine applicable categories
    const userSystems = db ? await db
      .select()
      .from(aiSystems)
      .where(eq(aiSystems.userId, ctx.user.id)) : [];

    return {
      categories: [
        { 
          id: "compliance_gap", 
          name: "Compliance Gaps", 
          description: "Address missing or incomplete compliance requirements",
          icon: "shield-alert"
        },
        { 
          id: "incident_prevention", 
          name: "Incident Prevention", 
          description: "Proactive measures based on industry incident patterns",
          icon: "alert-triangle"
        },
        { 
          id: "governance_improvement", 
          name: "Governance Improvement", 
          description: "Enhance organizational AI governance practices",
          icon: "building"
        },
        { 
          id: "risk_mitigation", 
          name: "Risk Mitigation", 
          description: "Address identified risks in AI systems",
          icon: "shield"
        },
        { 
          id: "best_practice", 
          name: "Best Practices", 
          description: "Industry-recommended practices for AI safety",
          icon: "star"
        },
        { 
          id: "regulatory_update", 
          name: "Regulatory Updates", 
          description: "New or updated regulatory requirements",
          icon: "file-text"
        },
      ],
      systemCount: userSystems.length,
    };
  }),

  // Get public recommendations (industry-wide, no auth required)
  getPublicRecommendations: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(5),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      const recommendations: Recommendation[] = [];

      // Get incident patterns
      const incidentPatterns = db ? await db
        .select({
          incidentType: watchdogReports.incidentType,
          count: sql<number>`count(*)`,
          avgSeverity: sql<number>`AVG(CASE 
            WHEN severity = 'critical' THEN 4 
            WHEN severity = 'high' THEN 3 
            WHEN severity = 'medium' THEN 2 
            ELSE 1 END)`,
        })
        .from(watchdogReports)
        .where(eq(watchdogReports.isPublic, true))
        .groupBy(watchdogReports.incidentType) : [];

      // Generate public recommendations based on top incident types
      const sortedIncidents = [...incidentPatterns].sort((a, b) => 
        (Number(b.avgSeverity) * Number(b.count)) - (Number(a.avgSeverity) * Number(a.count))
      );

      for (const incident of sortedIncidents.slice(0, input?.limit || 5)) {
        const template = INCIDENT_RECOMMENDATIONS[incident.incidentType] || INCIDENT_RECOMMENDATIONS.other;
        const priority = Number(incident.avgSeverity) >= 3 ? "high" : Number(incident.avgSeverity) >= 2 ? "medium" : "low";
        
        recommendations.push({
          id: `public-${incident.incidentType}-${Date.now()}`,
          title: template.title,
          description: template.description,
          priority: priority as RecommendationPriority,
          category: "incident_prevention",
          actionItems: template.actionItems,
          basedOn: {
            type: "incident_pattern",
            details: `Based on ${incident.count} reported ${incident.incidentType} incidents`
          },
          estimatedEffort: "medium",
          potentialImpact: priority === "high" ? "high" : "medium",
          createdAt: new Date().toISOString(),
        });
      }

      return {
        recommendations,
        generatedAt: new Date().toISOString(),
      };
    }),
});
