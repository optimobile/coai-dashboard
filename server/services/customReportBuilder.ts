import { getDb } from "../db";
import { assessments } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  defaultFormat: "pdf" | "csv" | "json";
}

export interface CustomReport {
  id: string;
  title: string;
  template: string;
  framework: string;
  startDate: Date;
  endDate: Date;
  filters: Record<string, unknown>;
  content: Record<string, unknown>;
  generatedAt: Date;
  format: "pdf" | "csv" | "json";
}

export interface ReportSection {
  title: string;
  content: string;
  data?: Record<string, unknown>;
}

export class CustomReportBuilderService {
  /**
   * Get available report templates
   */
  static getAvailableTemplates(): ReportTemplate[] {
    return [
      {
        id: "executive-summary",
        name: "Executive Summary",
        description: "High-level compliance overview for executives",
        sections: [
          "overview",
          "key-metrics",
          "risk-summary",
          "recommendations",
        ],
        defaultFormat: "pdf",
      },
      {
        id: "detailed-compliance",
        name: "Detailed Compliance Report",
        description: "Comprehensive compliance assessment with all details",
        sections: [
          "overview",
          "framework-details",
          "control-assessment",
          "gap-analysis",
          "remediation-plan",
        ],
        defaultFormat: "pdf",
      },
      {
        id: "trend-analysis",
        name: "Trend Analysis Report",
        description: "Historical compliance trends and predictions",
        sections: [
          "trend-overview",
          "historical-data",
          "trend-analysis",
          "predictions",
          "insights",
        ],
        defaultFormat: "pdf",
      },
      {
        id: "regulatory-submission",
        name: "Regulatory Submission",
        description: "Formatted for regulatory authority submission",
        sections: [
          "organization-info",
          "compliance-status",
          "incidents",
          "remediation",
          "certification",
        ],
        defaultFormat: "pdf",
      },
      {
        id: "data-export",
        name: "Data Export",
        description: "Raw data export for further analysis",
        sections: ["assessments", "systems", "incidents", "metrics"],
        defaultFormat: "csv",
      },
    ];
  }

  /**
   * Build a custom report based on template and filters
   */
  static async buildReport(
    template: string,
    framework: string,
    startDate: Date,
    endDate: Date,
    filters?: Record<string, unknown>
  ): Promise<CustomReport> {
    try {
      const templateDef = this.getAvailableTemplates().find(
        (t) => t.id === template
      );
      if (!templateDef) {
        throw new Error(`Template ${template} not found`);
      }

      const content: Record<string, unknown> = {};

      // Build each section
      for (const section of templateDef.sections) {
        content[section] = await this.buildSection(
          section,
          framework,
          startDate,
          endDate,
          filters
        );
      }

      return {
        id: `report-${Date.now()}`,
        title: templateDef.name,
        template,
        framework,
        startDate,
        endDate,
        filters: filters || {},
        content,
        generatedAt: new Date(),
        format: templateDef.defaultFormat,
      };
    } catch (error) {
      console.error("Error building report:", error);
      throw error;
    }
  }

  /**
   * Build individual report section
   */
  private static async buildSection(
    section: string,
    framework: string,
    startDate: Date,
    endDate: Date,
    filters?: Record<string, unknown>
  ): Promise<ReportSection> {
    switch (section) {
      case "overview":
        return this.buildOverviewSection(framework, startDate, endDate);

      case "key-metrics":
        return this.buildKeyMetricsSection(framework, startDate, endDate);

      case "risk-summary":
        return this.buildRiskSummarySection(framework, startDate, endDate);

      case "recommendations":
        return this.buildRecommendationsSection(framework);

      case "framework-details":
        return this.buildFrameworkDetailsSection(framework);

      case "control-assessment":
        return this.buildControlAssessmentSection(framework, startDate, endDate);

      case "gap-analysis":
        return this.buildGapAnalysisSection(framework);

      case "remediation-plan":
        return this.buildRemediationPlanSection(framework);

      case "trend-overview":
        return this.buildTrendOverviewSection(framework, startDate, endDate);

      case "historical-data":
        return this.buildHistoricalDataSection(framework, startDate, endDate);

      case "trend-analysis":
        return this.buildTrendAnalysisSection(framework, startDate, endDate);

      case "predictions":
        return this.buildPredictionsSection(framework);

      case "insights":
        return this.buildInsightsSection(framework);

      default:
        return {
          title: section,
          content: "Section not implemented",
        };
    }
  }

  private static async buildOverviewSection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    const database = await getDb();
    let assessmentList: any[] = [];

    if (database) {
      try {
        assessmentList = await database
          .select()
          .from(assessments)
          .where(
            and(
              eq(assessments.framework, framework),
              gte(assessments.createdAt, startDate),
              lte(assessments.createdAt, endDate)
            )
          );
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    }

    const avgScore =
      assessmentList.length > 0
        ? Math.round(
            assessmentList.reduce((sum, a) => sum + (a.overallScore || 0), 0) /
              assessmentList.length
          )
        : 0;

    return {
      title: "Overview",
      content: `This report provides a comprehensive compliance assessment for the ${framework} framework during the period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. The average compliance score across all assessed systems is ${avgScore}%.`,
      data: {
        assessmentCount: assessmentList.length,
        averageScore: avgScore,
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      },
    };
  }

  private static async buildKeyMetricsSection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    const database = await getDb();
    let assessmentList: any[] = [];

    if (database) {
      try {
        assessmentList = await database
          .select()
          .from(assessments)
          .where(
            and(
              eq(assessments.framework, framework),
              gte(assessments.createdAt, startDate),
              lte(assessments.createdAt, endDate)
            )
          );
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    }

    const scores = assessmentList.map((a) => a.overallScore || 0);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    const maxScore = Math.max(...scores, 0);
    const minScore = Math.min(...scores, 100);

    return {
      title: "Key Metrics",
      content: `Key performance indicators for the reporting period.`,
      data: {
        averageScore: avgScore,
        maxScore,
        minScore,
        assessmentCount: assessmentList.length,
        compliantCount: assessmentList.filter(
          (a) => a.status === "completed"
        ).length,
        nonCompliantCount: assessmentList.filter(
          (a) => a.status !== "completed"
        ).length,
      },
    };
  }

  private static async buildRiskSummarySection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    const database = await getDb();
    let assessmentList: any[] = [];

    if (database) {
      try {
        assessmentList = await database
          .select()
          .from(assessments)
          .where(
            and(
              eq(assessments.framework, framework),
              gte(assessments.createdAt, startDate),
              lte(assessments.createdAt, endDate)
            )
          );
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    }

    const scores = assessmentList.map((a) => a.overallScore || 0);
    const highRisk = scores.filter((s) => s < 40).length;
    const mediumRisk = scores.filter((s) => s >= 40 && s < 70).length;
    const lowRisk = scores.filter((s) => s >= 70).length;

    return {
      title: "Risk Summary",
      content: `Risk distribution across assessed systems.`,
      data: {
        highRisk,
        mediumRisk,
        lowRisk,
        highRiskPercentage:
          scores.length > 0 ? Math.round((highRisk / scores.length) * 100) : 0,
        mediumRiskPercentage:
          scores.length > 0 ? Math.round((mediumRisk / scores.length) * 100) : 0,
        lowRiskPercentage:
          scores.length > 0 ? Math.round((lowRisk / scores.length) * 100) : 0,
      },
    };
  }

  private static async buildRecommendationsSection(
    framework: string
  ): Promise<ReportSection> {
    const recommendations = {
      "EU AI Act": [
        "Implement comprehensive risk assessment procedures",
        "Establish human oversight mechanisms",
        "Create transparency documentation",
        "Develop incident response procedures",
      ],
      "NIST AI RMF": [
        "Enhance governance structure",
        "Improve measurement and monitoring",
        "Strengthen risk management processes",
        "Document AI system lifecycle",
      ],
      TC260: [
        "Strengthen data security controls",
        "Improve algorithm governance",
        "Enhance user rights protection",
        "Develop incident response capabilities",
      ],
    };

    return {
      title: "Recommendations",
      content: `Key recommendations for improving compliance with ${framework}.`,
      data: {
        recommendations:
          recommendations[framework as keyof typeof recommendations] || [],
      },
    };
  }

  private static async buildFrameworkDetailsSection(
    framework: string
  ): Promise<ReportSection> {
    return {
      title: "Framework Details",
      content: `Detailed information about the ${framework} framework and its requirements.`,
      data: { framework },
    };
  }

  private static async buildControlAssessmentSection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    return {
      title: "Control Assessment",
      content: `Assessment of individual controls within the ${framework} framework.`,
      data: { framework, period: `${startDate} to ${endDate}` },
    };
  }

  private static async buildGapAnalysisSection(
    framework: string
  ): Promise<ReportSection> {
    return {
      title: "Gap Analysis",
      content: `Identified gaps between current state and compliance requirements.`,
      data: { framework },
    };
  }

  private static async buildRemediationPlanSection(
    framework: string
  ): Promise<ReportSection> {
    return {
      title: "Remediation Plan",
      content: `Action plan to address identified compliance gaps.`,
      data: { framework },
    };
  }

  private static async buildTrendOverviewSection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    return {
      title: "Trend Overview",
      content: `Overview of compliance trends during the reporting period.`,
      data: { framework, period: `${startDate} to ${endDate}` },
    };
  }

  private static async buildHistoricalDataSection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    return {
      title: "Historical Data",
      content: `Historical compliance data for analysis.`,
      data: { framework, period: `${startDate} to ${endDate}` },
    };
  }

  private static async buildTrendAnalysisSection(
    framework: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportSection> {
    return {
      title: "Trend Analysis",
      content: `Analysis of compliance trends and patterns.`,
      data: { framework, period: `${startDate} to ${endDate}` },
    };
  }

  private static async buildPredictionsSection(
    framework: string
  ): Promise<ReportSection> {
    return {
      title: "Predictions",
      content: `Predictive analysis of future compliance status.`,
      data: { framework },
    };
  }

  private static async buildInsightsSection(
    framework: string
  ): Promise<ReportSection> {
    return {
      title: "Insights",
      content: `Key insights and observations from the analysis.`,
      data: { framework },
    };
  }
}
