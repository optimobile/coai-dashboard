import { getDb } from "../db";
import { complianceRules, ruleUpdates } from "../../drizzle/schema";
import { eq, and, or, desc } from "drizzle-orm";

export interface ComplianceRule {
  jurisdiction: string;
  framework: string;
  ruleCode: string;
  title: string;
  description?: string;
  requirement: string;
  severity: "info" | "warning" | "critical";
  category: string;
  applicableToRiskLevel: "minimal" | "low" | "medium" | "high" | "prohibited";
  implementationGuidance?: string;
  evidenceRequired?: Record<string, any>;
}

export class RulesEngine {
  /**
   * Create or update a compliance rule
   */
  static async upsertRule(rule: ComplianceRule) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const existing = await db
      .select()
      .from(complianceRules)
      .where(
        and(
          eq(complianceRules.jurisdiction, rule.jurisdiction),
          eq(complianceRules.framework, rule.framework),
          eq(complianceRules.ruleCode, rule.ruleCode)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing rule
      const result = await db
        .update(complianceRules)
        .set({
          ...rule,
          version: (existing[0].version || 0) + 1,
        })
        .where(eq(complianceRules.id, existing[0].id));

      // Log the update
      await db.insert(ruleUpdates).values({
        ruleId: existing[0].id,
        changeType: "updated",
        previousValue: existing[0],
        newValue: rule,
        changeReason: "Rule updated",
        notificationSent: false,
      });

      return result;
    } else {
      // Create new rule
      const result = await db.insert(complianceRules).values({
        ...rule,
        version: 1,
        isActive: true,
      });

      // Log the creation
      const insertedId = (result as any).insertId;
      if (insertedId) {
        await db.insert(ruleUpdates).values({
          ruleId: insertedId,
          changeType: "created",
          newValue: rule,
          changeReason: "New rule created",
          notificationSent: false,
        });
      }

      return result;
    }
  }

  /**
   * Get rules for a specific jurisdiction and framework
   */
  static async getRulesByJurisdiction(
    jurisdiction: string,
    framework?: string,
    riskLevel?: string
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    let query = db
      .select()
      .from(complianceRules)
      .where(
        and(
          eq(complianceRules.jurisdiction, jurisdiction),
          eq(complianceRules.isActive, 1 as any)
        )
      );

    if (framework) {
      query = query.where(eq(complianceRules.framework, framework));
    }

    if (riskLevel) {
      query = query.where(eq(complianceRules.applicableToRiskLevel, riskLevel));
    }

    return await query;
  }

  /**
   * Get all active rules
   */
  static async getAllActiveRules() {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return await db
      .select()
      .from(complianceRules)
      .where(eq(complianceRules.isActive, 1 as any))
      .orderBy(complianceRules.jurisdiction, complianceRules.framework);
  }

  /**
   * Deprecate a rule
   */
  static async deprecateRule(ruleId: number, reason: string) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const rule = await db
      .select()
      .from(complianceRules)
      .where(eq(complianceRules.id, ruleId))
      .limit(1);

    if (!rule[0]) throw new Error("Rule not found");

    const result = await db
      .update(complianceRules)
      .set({
        isActive: false,
        deprecatedDate: new Date(),
      })
      .where(eq(complianceRules.id, ruleId));

    // Log the deprecation
    await db.insert(ruleUpdates).values({
      ruleId,
      changeType: "deprecated",
      previousValue: rule[0],
      changeReason: reason,
      notificationSent: false,
    });

    return result;
  }

  /**
   * Get rule update history
   */
  static async getRuleUpdateHistory(ruleId: number, limit = 50) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return await db
      .select()
      .from(ruleUpdates)
      .where(eq(ruleUpdates.ruleId, ruleId))
      .orderBy(desc(ruleUpdates.createdAt))
      .limit(limit);
  }

  /**
   * Get recent rule updates across all rules
   */
  static async getRecentUpdates(limit = 100) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return await db
      .select()
      .from(ruleUpdates)
      .orderBy(desc(ruleUpdates.createdAt))
      .limit(limit);
  }

  /**
   * Seed initial compliance rules for major frameworks
   */
  static async seedInitialRules() {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const euAiActRules: ComplianceRule[] = [
      {
        jurisdiction: "EU",
        framework: "EU AI Act",
        ruleCode: "EUAI-001",
        title: "Prohibited AI Practices",
        description: "Prohibition of certain AI practices that violate fundamental rights",
        requirement: "Organizations must not deploy AI systems that use subliminal techniques or exploit vulnerabilities to manipulate behavior",
        severity: "critical",
        category: "Fundamental Rights",
        applicableToRiskLevel: "prohibited",
        implementationGuidance: "Implement technical and organizational measures to prevent prohibited AI practices",
        evidenceRequired: {
          technicalMeasures: "Documentation of safeguards",
          auditTrail: "Evidence of compliance checks",
        },
      },
      {
        jurisdiction: "EU",
        framework: "EU AI Act",
        ruleCode: "EUAI-002",
        title: "High-Risk AI Systems",
        description: "Requirements for high-risk AI systems",
        requirement: "High-risk AI systems must undergo conformity assessment before deployment",
        severity: "critical",
        category: "Risk Assessment",
        applicableToRiskLevel: "high",
        implementationGuidance: "Conduct risk assessment and implement mitigation measures",
        evidenceRequired: {
          riskAssessment: "Documented risk analysis",
          mitigationPlan: "Risk mitigation strategy",
        },
      },
      {
        jurisdiction: "EU",
        framework: "EU AI Act",
        ruleCode: "EUAI-003",
        title: "Transparency Requirements",
        description: "Transparency obligations for AI systems",
        requirement: "Organizations must provide clear information about AI system capabilities and limitations",
        severity: "warning",
        category: "Transparency",
        applicableToRiskLevel: "medium",
        implementationGuidance: "Create clear documentation of AI system behavior",
      },
    ];

    const nistRmfRules: ComplianceRule[] = [
      {
        jurisdiction: "US",
        framework: "NIST RMF",
        ruleCode: "NIST-001",
        title: "Risk Assessment",
        description: "Conduct comprehensive AI risk assessment",
        requirement: "Organizations must conduct risk assessments for AI systems before deployment",
        severity: "critical",
        category: "Risk Management",
        applicableToRiskLevel: "high",
        implementationGuidance: "Use NIST AI RMF categories for assessment",
      },
      {
        jurisdiction: "US",
        framework: "NIST RMF",
        ruleCode: "NIST-002",
        title: "Governance Structure",
        description: "Establish AI governance framework",
        requirement: "Organizations must establish clear governance structures for AI system oversight",
        severity: "warning",
        category: "Governance",
        applicableToRiskLevel: "medium",
        implementationGuidance: "Document governance roles and responsibilities",
      },
    ];

    const chinaRules: ComplianceRule[] = [
      {
        jurisdiction: "China",
        framework: "CAC AI Regulations",
        ruleCode: "CHINA-001",
        title: "Content Security",
        description: "AI content security requirements",
        requirement: "AI systems must not generate content that violates Chinese regulations",
        severity: "critical",
        category: "Content Control",
        applicableToRiskLevel: "high",
        implementationGuidance: "Implement content filtering and monitoring",
      },
      {
        jurisdiction: "China",
        framework: "CAC AI Regulations",
        ruleCode: "CHINA-002",
        title: "Data Localization",
        description: "Data must be stored within China",
        requirement: "Personal data collected by AI systems must be stored in China",
        severity: "critical",
        category: "Data Protection",
        applicableToRiskLevel: "high",
        implementationGuidance: "Implement data localization infrastructure",
      },
    ];

    const ukRules: ComplianceRule[] = [
      {
        jurisdiction: "UK",
        framework: "UK AI Principles",
        ruleCode: "UK-001",
        title: "Transparency and Accountability",
        description: "AI systems must be transparent and accountable",
        requirement: "Organizations must be able to explain AI system decisions",
        severity: "warning",
        category: "Accountability",
        applicableToRiskLevel: "medium",
        implementationGuidance: "Document AI decision-making processes",
      },
    ];

    const allRules = [...euAiActRules, ...nistRmfRules, ...chinaRules, ...ukRules];

    for (const rule of allRules) {
      try {
        await this.upsertRule(rule);
      } catch (error) {
        console.error(`Failed to seed rule ${rule.ruleCode}:`, error);
      }
    }

    console.log(`✅ Seeded ${allRules.length} compliance rules`);
  }
}
