import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { LegalIssuesFlaggingService, type LegalViolation } from "../services/LegalIssuesFlaggingService";

export const legalRouter = router({
  /**
   * Analyze a Watchdog report for legal violations
   * Returns flagged violations and risk score
   */
  flagReportForLegalIssues: publicProcedure
    .input(z.object({
      reportId: z.number(),
      title: z.string(),
      description: z.string(),
      details: z.string().optional(),
      severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      affectedSystems: z.array(z.number()).optional(),
      hasBeenEscalated: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const legalFlag = LegalIssuesFlaggingService.analyzeReportForLegalIssues(input);
        
        // TODO: Save to database when schema is ready
        // const saved = await db.insert(legalFlags).values({
        //   reportId: input.reportId,
        //   violationTypes: legalFlag.violations.map(v => v.categoryId),
        //   riskScore: legalFlag.riskScore,
        //   summary: legalFlag.summary,
        //   legalActions: legalFlag.legalActions,
        // });

        return {
          success: true,
          flag: legalFlag,
          message: `Report analyzed: ${legalFlag.violations.length} legal violation(s) detected`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to analyze report',
        };
      }
    }),

  /**
   * Get all legal flags with optional filtering
   */
  getLegalFlags: publicProcedure
    .input(z.object({
      status: z.enum(['flagged', 'assigned', 'under_review', 'resolved', 'dismissed']).optional(),
      minRiskScore: z.number().min(0).max(100).optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      try {
        // TODO: Query from database when schema is ready
        // const flags = await db.select().from(legalFlags)
        //   .where(and(
        //     input.status ? eq(legalFlags.status, input.status) : undefined,
        //     input.minRiskScore ? gte(legalFlags.riskScore, input.minRiskScore) : undefined
        //   ))
        //   .limit(input.limit)
        //   .offset(input.offset);

        return {
          success: true,
          flags: [],
          total: 0,
          message: 'Legal flags retrieved (database integration pending)'
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve flags',
        };
      }
    }),

  /**
   * Get detailed information about a specific legal flag
   */
  getLegalFlagDetails: publicProcedure
    .input(z.object({
      flagId: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        // TODO: Query from database when schema is ready
        // const flag = await db.select().from(legalFlags)
        //   .where(eq(legalFlags.id, input.flagId))
        //   .leftJoin(legalFlagDetails, eq(legalFlags.id, legalFlagDetails.flagId));

        return {
          success: true,
          flag: null,
          details: [],
          message: 'Flag details retrieved (database integration pending)'
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve flag details',
        };
      }
    }),

  /**
   * Update the status of a legal flag
   */
  updateLegalFlagStatus: publicProcedure
    .input(z.object({
      flagId: z.number(),
      status: z.enum(['flagged', 'assigned', 'under_review', 'resolved', 'dismissed']),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // TODO: Update in database when schema is ready
        // await db.update(legalFlags)
        //   .set({ status: input.status, updatedAt: new Date() })
        //   .where(eq(legalFlags.id, input.flagId));

        return {
          success: true,
          message: `Flag ${input.flagId} status updated to ${input.status}`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update flag status',
        };
      }
    }),

  /**
   * Get the legal case queue (pending cases for barristers)
   */
  getLegalCaseQueue: publicProcedure
    .input(z.object({
      status: z.enum(['pending', 'assigned', 'in_progress', 'under_review', 'resolved', 'closed']).optional(),
      assignedTo: z.number().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      try {
        // TODO: Query from database when schema is ready
        // const cases = await db.select().from(legalCaseQueue)
        //   .where(and(
        //     input.status ? eq(legalCaseQueue.status, input.status) : undefined,
        //     input.assignedTo ? eq(legalCaseQueue.assignedTo, input.assignedTo) : undefined
        //   ))
        //   .limit(input.limit)
        //   .offset(input.offset);

        return {
          success: true,
          cases: [],
          total: 0,
          message: 'Legal case queue retrieved (database integration pending)'
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve case queue',
        };
      }
    }),

  /**
   * Assign a legal case to a barrister/legal team member
   */
  assignLegalCase: publicProcedure
    .input(z.object({
      flagId: z.number(),
      assignedTo: z.number(), // User ID of barrister
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // TODO: Update in database when schema is ready
        // const caseItem = await db.select().from(legalCaseQueue)
        //   .where(eq(legalCaseQueue.flagId, input.flagId));
        
        // if (caseItem.length === 0) {
        //   // Create new case queue item
        //   await db.insert(legalCaseQueue).values({
        //     flagId: input.flagId,
        //     assignedTo: input.assignedTo,
        //     status: 'assigned',
        //     notes: input.notes,
        //   });
        // } else {
        //   // Update existing
        //   await db.update(legalCaseQueue)
        //     .set({ assignedTo: input.assignedTo, status: 'assigned', notes: input.notes })
        //     .where(eq(legalCaseQueue.flagId, input.flagId));
        // }

        return {
          success: true,
          message: `Case assigned to user ${input.assignedTo}`
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to assign case',
        };
      }
    }),

  /**
   * Get all legal violation categories
   */
  getLegalViolationCategories: publicProcedure
    .query(async () => {
      try {
        // TODO: Query from database when schema is ready
        // const categories = await db.select().from(legalViolationCategories);

        // For now, return the categories from the service
        const categories = [
          {
            id: 'prohibited_practices',
            name: 'Prohibited AI Practices',
            articleReference: 'Article 5',
            severity: 'critical'
          },
          {
            id: 'high_risk_requirements',
            name: 'High-Risk System Requirements Violation',
            articleReference: 'Article 8',
            severity: 'high'
          },
          {
            id: 'transparency_violations',
            name: 'Transparency Requirement Violations',
            articleReference: 'Article 13',
            severity: 'high'
          },
          {
            id: 'gpai_violations',
            name: 'General Purpose AI (GPAI) Regulation Violations',
            articleReference: 'Article 53',
            severity: 'high'
          },
          {
            id: 'provider_obligations',
            name: 'Provider Obligation Violations',
            articleReference: 'Article 15',
            severity: 'high'
          },
          {
            id: 'deployer_obligations',
            name: 'Deployer Obligation Violations',
            articleReference: 'Article 26',
            severity: 'high'
          },
          {
            id: 'biometric_violations',
            name: 'Biometric System Violations',
            articleReference: 'Article 10',
            severity: 'critical'
          },
          {
            id: 'critical_infrastructure',
            name: 'Critical Infrastructure Violations',
            articleReference: 'Article 52',
            severity: 'high'
          },
          {
            id: 'employment_discrimination',
            name: 'Employment Discrimination Violations',
            articleReference: 'EU Employment Law / Article 22 GDPR',
            severity: 'high'
          },
          {
            id: 'healthcare_violations',
            name: 'Healthcare System Violations',
            articleReference: 'Medical Device Regulation / Healthcare Law',
            severity: 'critical'
          },
          {
            id: 'law_enforcement_violations',
            name: 'Law Enforcement Violations',
            articleReference: 'EU Law Enforcement Directive',
            severity: 'high'
          },
          {
            id: 'financial_services_violations',
            name: 'Financial Services Violations',
            articleReference: 'MiFID II / Banking Regulation',
            severity: 'high'
          },
          {
            id: 'consumer_protection_violations',
            name: 'Consumer Protection Violations',
            articleReference: 'Consumer Rights Directive',
            severity: 'medium'
          },
          {
            id: 'data_protection_violations',
            name: 'Data Protection (GDPR) Violations',
            articleReference: 'GDPR Articles 5-6',
            severity: 'high'
          },
          {
            id: 'governance_violations',
            name: 'Governance Structure Violations',
            articleReference: 'Article 55',
            severity: 'medium'
          }
        ];

        return {
          success: true,
          categories,
          total: categories.length
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve categories',
        };
      }
    }),

  /**
   * Get enforcement authorities for a specific jurisdiction
   */
  getEnforcementAuthorities: publicProcedure
    .input(z.object({
      jurisdiction: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        // TODO: Query from database when schema is ready
        // const authorities = await db.select().from(legalEnforcementAuthorities)
        //   .where(input.jurisdiction ? eq(legalEnforcementAuthorities.jurisdiction, input.jurisdiction) : undefined);

        const authorities = [
          {
            id: 'ec_national',
            name: 'European Commission & National Authorities',
            jurisdiction: 'EU-wide',
            authority_type: 'eu_body',
            website: 'https://ec.europa.eu'
          },
          {
            id: 'dpa',
            name: 'National Data Protection Authorities',
            jurisdiction: 'Member State',
            authority_type: 'sector_regulator',
            website: 'https://edpb.ec.europa.eu/about-edpb/members_en'
          },
          {
            id: 'health_regulators',
            name: 'National Health Authorities',
            jurisdiction: 'Member State',
            authority_type: 'sector_regulator',
            website: 'https://ec.europa.eu/health/md_newregulations/overview_en'
          },
          {
            id: 'financial_regulators',
            name: 'National Financial Regulators',
            jurisdiction: 'Member State',
            authority_type: 'sector_regulator',
            website: 'https://www.esma.europa.eu/'
          }
        ];

        return {
          success: true,
          authorities,
          total: authorities.length
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve authorities',
        };
      }
    }),

  /**
   * Generate legal case file for a flagged report
   */
  generateLegalCaseFile: publicProcedure
    .input(z.object({
      flagId: z.number(),
      reportId: z.number(),
      violations: z.array(z.object({
        categoryId: z.string(),
        categoryName: z.string(),
        articleReference: z.string(),
        severity: z.enum(['critical', 'high', 'medium', 'low']),
        description: z.string(),
        evidence: z.array(z.string()),
        enforcementAuthority: z.string(),
        recommendedActions: z.array(z.string()),
      })),
    }))
    .mutation(async ({ input }) => {
      try {
        const caseFile = LegalIssuesFlaggingService.generateLegalCaseFile(
          { id: input.reportId },
          input.violations
        );

        // TODO: Save case file to S3 and store URL in database
        // const { url } = await storagePut(`legal-cases/${input.flagId}.txt`, caseFile, 'text/plain');

        return {
          success: true,
          caseFile,
          // url,
          message: 'Legal case file generated successfully'
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to generate case file',
        };
      }
    }),

  /**
   * Get legal risk statistics
   */
  getLegalRiskStatistics: publicProcedure
    .query(async () => {
      try {
        // TODO: Query from database when schema is ready
        // const stats = {
        //   totalFlags: await db.select().from(legalFlags).count(),
        //   criticalViolations: await db.select().from(legalFlagDetails)
        //     .where(eq(legalFlagDetails.severity, 'critical')).count(),
        //   averageRiskScore: await db.select({ avg: avg(legalFlags.riskScore) }).from(legalFlags),
        //   violationsByCategory: await db.select({ 
        //     category: legalFlagDetails.categoryName,
        //     count: count() 
        //   }).from(legalFlagDetails).groupBy(legalFlagDetails.categoryName),
        // };

        return {
          success: true,
          stats: {
            totalFlags: 0,
            criticalViolations: 0,
            averageRiskScore: 0,
            violationsByCategory: []
          },
          message: 'Legal risk statistics (database integration pending)'
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to retrieve statistics',
        };
      }
    }),
});
