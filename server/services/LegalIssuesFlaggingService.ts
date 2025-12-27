/**
 * Legal Issues Flagging Service
 * 
 * Analyzes Watchdog reports for legal violations under the EU AI Act
 * and other applicable regulations. Automatically flags reports with
 * legal implications for barrister/legal team review.
 */

export interface LegalViolation {
  categoryId: string;
  categoryName: string;
  articleReference: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  evidence: string[];
  enforcementAuthority: string;
  recommendedActions: string[];
}

export interface LegalFlag {
  reportId: string;
  violations: LegalViolation[];
  riskScore: number; // 0-100
  summary: string;
  legalActions: string[];
  flaggedAt: Date;
}

export interface EnforcementAuthority {
  id: string;
  name: string;
  jurisdiction: string;
  authority_type: 'eu_body' | 'national_authority' | 'sector_regulator';
  contact_info: string;
  website: string;
}

// EU AI Act Legal Violation Categories
const LEGAL_VIOLATION_CATEGORIES = {
  PROHIBITED_AI_PRACTICES: {
    id: 'prohibited_practices',
    name: 'Prohibited AI Practices',
    articleReference: 'Article 5',
    description: 'Use of AI systems with unacceptable risk (social scoring, subliminal manipulation, etc.)',
    severity: 'critical' as const,
    indicators: [
      'social scoring',
      'subliminal manipulation',
      'exploitation of vulnerabilities',
      'mass surveillance',
      'biometric categorization',
      'real-time biometric identification'
    ],
    enforcementAuthority: 'European Commission / National Authorities'
  },
  
  HIGH_RISK_REQUIREMENTS: {
    id: 'high_risk_requirements',
    name: 'High-Risk System Requirements Violation',
    articleReference: 'Article 8',
    description: 'Failure to meet requirements for high-risk AI systems (risk assessment, testing, documentation)',
    severity: 'high' as const,
    indicators: [
      'no risk assessment',
      'inadequate testing',
      'missing documentation',
      'no quality management',
      'insufficient data governance',
      'no human oversight'
    ],
    enforcementAuthority: 'National Authorities / Notified Bodies'
  },

  TRANSPARENCY_VIOLATIONS: {
    id: 'transparency_violations',
    name: 'Transparency Requirement Violations',
    articleReference: 'Article 13',
    description: 'Failure to disclose that an AI system is being used or provide required information',
    severity: 'high' as const,
    indicators: [
      'no disclosure of AI use',
      'hidden AI system',
      'inadequate user information',
      'no explainability provided',
      'insufficient documentation'
    ],
    enforcementAuthority: 'National Authorities / Consumer Protection'
  },

  GPAI_VIOLATIONS: {
    id: 'gpai_violations',
    name: 'General Purpose AI (GPAI) Regulation Violations',
    articleReference: 'Article 53',
    description: 'Failure to comply with GPAI requirements (model cards, usage policies, risk mitigation)',
    severity: 'high' as const,
    indicators: [
      'no model card',
      'no usage policies',
      'no risk mitigation',
      'inadequate monitoring',
      'no incident reporting'
    ],
    enforcementAuthority: 'European Commission / National Authorities'
  },

  PROVIDER_OBLIGATIONS: {
    id: 'provider_obligations',
    name: 'Provider Obligation Violations',
    articleReference: 'Article 15',
    description: 'AI provider failures in risk management, quality assurance, or documentation',
    severity: 'high' as const,
    indicators: [
      'inadequate risk management',
      'poor quality assurance',
      'missing technical documentation',
      'no incident reporting',
      'inadequate training'
    ],
    enforcementAuthority: 'National Authorities'
  },

  DEPLOYER_OBLIGATIONS: {
    id: 'deployer_obligations',
    name: 'Deployer Obligation Violations',
    articleReference: 'Article 26',
    description: 'AI deployer failures in monitoring, incident reporting, or human oversight',
    severity: 'high' as const,
    indicators: [
      'inadequate monitoring',
      'no incident reporting',
      'insufficient human oversight',
      'poor documentation',
      'no user notification'
    ],
    enforcementAuthority: 'National Authorities'
  },

  BIOMETRIC_VIOLATIONS: {
    id: 'biometric_violations',
    name: 'Biometric System Violations',
    articleReference: 'Article 10',
    description: 'Improper use of real-time or remote biometric identification systems',
    severity: 'critical' as const,
    indicators: [
      'real-time biometric identification',
      'remote biometric identification',
      'inadequate consent',
      'no legal basis',
      'mass surveillance'
    ],
    enforcementAuthority: 'National Data Protection Authorities / Law Enforcement'
  },

  CRITICAL_INFRASTRUCTURE: {
    id: 'critical_infrastructure',
    name: 'Critical Infrastructure Violations',
    articleReference: 'Article 52',
    description: 'Improper AI use in critical infrastructure without adequate safeguards',
    severity: 'high' as const,
    indicators: [
      'inadequate safety measures',
      'no redundancy',
      'insufficient testing',
      'poor incident response',
      'inadequate monitoring'
    ],
    enforcementAuthority: 'National Authorities / Infrastructure Regulators'
  },

  EMPLOYMENT_DISCRIMINATION: {
    id: 'employment_discrimination',
    name: 'Employment Discrimination Violations',
    articleReference: 'EU Employment Law / Article 22 GDPR',
    description: 'AI use in employment causing discrimination or unfair treatment',
    severity: 'high' as const,
    indicators: [
      'discriminatory hiring',
      'biased performance evaluation',
      'unfair termination',
      'wage discrimination',
      'protected characteristic bias'
    ],
    enforcementAuthority: 'National Labor Authorities / Data Protection Authorities'
  },

  HEALTHCARE_VIOLATIONS: {
    id: 'healthcare_violations',
    name: 'Healthcare System Violations',
    articleReference: 'Medical Device Regulation / Healthcare Law',
    description: 'AI use in healthcare without proper validation or regulatory approval',
    severity: 'critical' as const,
    indicators: [
      'unapproved medical device',
      'inadequate clinical validation',
      'patient safety risk',
      'no informed consent',
      'inadequate monitoring'
    ],
    enforcementAuthority: 'National Health Authorities / Medical Device Regulators'
  },

  LAW_ENFORCEMENT_VIOLATIONS: {
    id: 'law_enforcement_violations',
    name: 'Law Enforcement Violations',
    articleReference: 'EU Law Enforcement Directive',
    description: 'Improper AI use by law enforcement without adequate safeguards',
    severity: 'high' as const,
    indicators: [
      'inadequate accuracy',
      'no human review',
      'insufficient safeguards',
      'bias in criminal justice',
      'inadequate transparency'
    ],
    enforcementAuthority: 'National Data Protection Authorities / Law Enforcement'
  },

  FINANCIAL_SERVICES_VIOLATIONS: {
    id: 'financial_services_violations',
    name: 'Financial Services Violations',
    articleReference: 'MiFID II / Banking Regulation',
    description: 'AI use in financial services causing unfair treatment or systemic risk',
    severity: 'high' as const,
    indicators: [
      'unfair credit decisions',
      'discriminatory pricing',
      'inadequate risk management',
      'systemic risk',
      'inadequate transparency'
    ],
    enforcementAuthority: 'National Financial Regulators'
  },

  CONSUMER_PROTECTION_VIOLATIONS: {
    id: 'consumer_protection_violations',
    name: 'Consumer Protection Violations',
    articleReference: 'Consumer Rights Directive',
    description: 'AI use causing unfair consumer treatment or misleading information',
    severity: 'medium' as const,
    indicators: [
      'unfair contract terms',
      'misleading information',
      'inadequate disclosure',
      'manipulation',
      'price discrimination'
    ],
    enforcementAuthority: 'National Consumer Protection Authorities'
  },

  DATA_PROTECTION_VIOLATIONS: {
    id: 'data_protection_violations',
    name: 'Data Protection (GDPR) Violations',
    articleReference: 'GDPR Articles 5-6',
    description: 'AI use violating data protection principles or rights',
    severity: 'high' as const,
    indicators: [
      'no legal basis',
      'inadequate consent',
      'data minimization violation',
      'unauthorized processing',
      'inadequate security'
    ],
    enforcementAuthority: 'National Data Protection Authorities'
  },

  GOVERNANCE_VIOLATIONS: {
    id: 'governance_violations',
    name: 'Governance Structure Violations',
    articleReference: 'Article 55',
    description: 'Failure to establish proper AI governance structures and processes',
    severity: 'medium' as const,
    indicators: [
      'no AI governance',
      'no risk management',
      'no compliance monitoring',
      'inadequate documentation',
      'no incident response'
    ],
    enforcementAuthority: 'National Authorities'
  }
};

export class LegalIssuesFlaggingService {
  /**
   * Analyze a Watchdog report for legal violations
   */
  static analyzeReportForLegalIssues(report: any): LegalFlag {
    const violations: LegalViolation[] = [];

    // Analyze report content for each violation category
    for (const [key, category] of Object.entries(LEGAL_VIOLATION_CATEGORIES)) {
      const categoryKey = key as keyof typeof LEGAL_VIOLATION_CATEGORIES;
      const categoryData = LEGAL_VIOLATION_CATEGORIES[categoryKey];
      
      const evidence = this.findEvidenceInReport(report, categoryData.indicators);
      
      if (evidence.length > 0) {
        violations.push({
          categoryId: categoryData.id,
          categoryName: categoryData.name,
          articleReference: categoryData.articleReference,
          severity: categoryData.severity,
          description: categoryData.description,
          evidence,
          enforcementAuthority: categoryData.enforcementAuthority,
          recommendedActions: this.generateRecommendedActions(categoryData.id, report)
        });
      }
    }

    const riskScore = this.calculateLegalRiskScore(violations);
    const summary = this.generateLegalSummary(violations);
    const legalActions = this.suggestLegalActions(violations);

    return {
      reportId: report.id,
      violations,
      riskScore,
      summary,
      legalActions,
      flaggedAt: new Date()
    };
  }

  /**
   * Find evidence of violations in report content
   */
  private static findEvidenceInReport(report: any, indicators: string[]): string[] {
    const evidence: string[] = [];
    const reportText = `${report.title || ''} ${report.description || ''} ${report.details || ''}`.toLowerCase();

    for (const indicator of indicators) {
      if (reportText.includes(indicator.toLowerCase())) {
        evidence.push(indicator);
      }
    }

    // Check report metadata for additional evidence
    if (report.severity === 'critical' || report.severity === 'high') {
      evidence.push('High-severity incident reported');
    }

    if (report.affectedSystems && report.affectedSystems.length > 0) {
      evidence.push(`Affects ${report.affectedSystems.length} AI system(s)`);
    }

    if (report.hasBeenEscalated) {
      evidence.push('Incident escalated for investigation');
    }

    return [...new Set(evidence)]; // Remove duplicates
  }

  /**
   * Calculate legal risk score (0-100)
   */
  private static calculateLegalRiskScore(violations: LegalViolation[]): number {
    if (violations.length === 0) return 0;

    const severityScores = {
      critical: 30,
      high: 20,
      medium: 10,
      low: 5
    };

    let score = 0;
    for (const violation of violations) {
      score += severityScores[violation.severity];
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Generate human-readable legal summary
   */
  private static generateLegalSummary(violations: LegalViolation[]): string {
    if (violations.length === 0) {
      return 'No legal violations detected in this report.';
    }

    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const highCount = violations.filter(v => v.severity === 'high').length;
    const mediumCount = violations.filter(v => v.severity === 'medium').length;

    let summary = `This report contains ${violations.length} potential legal violation(s): `;
    
    const counts = [];
    if (criticalCount > 0) counts.push(`${criticalCount} critical`);
    if (highCount > 0) counts.push(`${highCount} high-severity`);
    if (mediumCount > 0) counts.push(`${mediumCount} medium-severity`);
    
    summary += counts.join(', ') + '.';
    
    if (criticalCount > 0) {
      summary += ' URGENT: Critical violations require immediate legal review.';
    }

    return summary;
  }

  /**
   * Suggest legal actions for violations
   */
  private static suggestLegalActions(violations: LegalViolation[]): string[] {
    const actions = new Set<string>();

    for (const violation of violations) {
      switch (violation.categoryId) {
        case 'prohibited_practices':
          actions.add('Immediate cease of prohibited AI practice');
          actions.add('Notify relevant national authority');
          actions.add('Prepare legal defense documentation');
          break;
        case 'high_risk_requirements':
          actions.add('Conduct comprehensive risk assessment');
          actions.add('Implement missing safeguards');
          actions.add('Document compliance measures');
          break;
        case 'transparency_violations':
          actions.add('Implement immediate disclosure mechanism');
          actions.add('Provide required user information');
          actions.add('Document transparency measures');
          break;
        case 'biometric_violations':
          actions.add('Cease biometric identification immediately');
          actions.add('Notify affected individuals');
          actions.add('Consult with data protection authority');
          break;
        case 'healthcare_violations':
          actions.add('Cease use pending regulatory approval');
          actions.add('Conduct clinical validation');
          actions.add('Notify healthcare regulator');
          break;
        case 'data_protection_violations':
          actions.add('Conduct Data Protection Impact Assessment (DPIA)');
          actions.add('Notify Data Protection Authority');
          actions.add('Implement privacy safeguards');
          break;
        default:
          actions.add('Conduct legal review');
          actions.add('Implement recommended safeguards');
          actions.add('Document compliance measures');
      }
    }

    return Array.from(actions);
  }

  /**
   * Generate recommended actions based on violation category
   */
  private static generateRecommendedActions(categoryId: string, report: any): string[] {
    const actions: string[] = [];

    actions.push('Assign to legal team for review');
    actions.push('Notify relevant enforcement authority');
    actions.push('Document incident and response');

    if (report.severity === 'critical') {
      actions.push('Escalate to senior management');
      actions.push('Prepare public statement if necessary');
    }

    return actions;
  }

  /**
   * Map violation to enforcement authority
   */
  static mapToEnforcementAuthority(violation: LegalViolation): EnforcementAuthority {
    const authorities: Record<string, EnforcementAuthority> = {
      'European Commission / National Authorities': {
        id: 'ec_national',
        name: 'European Commission & National Authorities',
        jurisdiction: 'EU-wide',
        authority_type: 'eu_body',
        contact_info: 'https://ec.europa.eu/info/departments_en',
        website: 'https://ec.europa.eu'
      },
      'National Authorities / Notified Bodies': {
        id: 'national_notified',
        name: 'National Authorities & Notified Bodies',
        jurisdiction: 'Member State',
        authority_type: 'national_authority',
        contact_info: 'Contact national AI authority',
        website: 'https://ec.europa.eu/growth/tools-databases/nando/'
      },
      'National Authorities / Consumer Protection': {
        id: 'consumer_protection',
        name: 'National Consumer Protection Authorities',
        jurisdiction: 'Member State',
        authority_type: 'sector_regulator',
        contact_info: 'Contact national consumer authority',
        website: 'https://ec.europa.eu/consumers/odr/'
      },
      'National Data Protection Authorities': {
        id: 'dpa',
        name: 'National Data Protection Authorities',
        jurisdiction: 'Member State',
        authority_type: 'sector_regulator',
        contact_info: 'Contact national DPA',
        website: 'https://edpb.ec.europa.eu/about-edpb/members_en'
      },
      'National Health Authorities / Medical Device Regulators': {
        id: 'health_regulators',
        name: 'National Health Authorities',
        jurisdiction: 'Member State',
        authority_type: 'sector_regulator',
        contact_info: 'Contact national health authority',
        website: 'https://ec.europa.eu/health/md_newregulations/overview_en'
      },
      'National Financial Regulators': {
        id: 'financial_regulators',
        name: 'National Financial Regulators',
        jurisdiction: 'Member State',
        authority_type: 'sector_regulator',
        contact_info: 'Contact national financial authority',
        website: 'https://www.esma.europa.eu/'
      }
    };

    return authorities[violation.enforcementAuthority] || {
      id: 'default',
      name: 'National Competent Authority',
      jurisdiction: 'Member State',
      authority_type: 'national_authority',
      contact_info: 'Contact national authority',
      website: 'https://ec.europa.eu'
    };
  }

  /**
   * Generate legal case file for barrister review
   */
  static generateLegalCaseFile(report: any, violations: LegalViolation[]): string {
    const timestamp = new Date().toISOString();
    
    let caseFile = `LEGAL CASE FILE - CONFIDENTIAL
Generated: ${timestamp}
Report ID: ${report.id}

INCIDENT SUMMARY
================
Title: ${report.title}
Description: ${report.description}
Severity: ${report.severity}
Date Reported: ${report.createdAt}

LEGAL VIOLATIONS IDENTIFIED
===========================
Total Violations: ${violations.length}

`;

    for (const violation of violations) {
      caseFile += `
VIOLATION: ${violation.categoryName}
Severity: ${violation.severity.toUpperCase()}
Article Reference: ${violation.articleReference}
Description: ${violation.description}

Evidence Found:
${violation.evidence.map(e => `- ${e}`).join('\n')}

Enforcement Authority: ${violation.enforcementAuthority}

Recommended Actions:
${violation.recommendedActions.map(a => `- ${a}`).join('\n')}

`;
    }

    caseFile += `
LEGAL ASSESSMENT
================
This case requires immediate legal review and action. The identified violations
may result in enforcement action by relevant authorities.

NEXT STEPS
==========
1. Assign to qualified legal counsel
2. Notify relevant enforcement authorities
3. Prepare legal defense strategy
4. Document all compliance measures
5. Implement recommended safeguards
`;

    return caseFile;
  }
}
