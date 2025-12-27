import { getDb } from "../db";
import { assessments, aiSystems } from "../../drizzle/schema";
import { eq, gte, lte, and } from "drizzle-orm";

export interface ComplianceTrend {
  date: string;
  score: number;
  framework: string;
  systemCount: number;
}

export interface ComplianceMetrics {
  averageScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  compliantCount: number;
  nonCompliantCount: number;
  trendDirection: "improving" | "declining" | "stable";
}

export interface FrameworkComparison {
  framework: string;
  averageScore: number;
  systemsAssessed: number;
  compliantPercentage: number;
}

export class ComplianceTrendAnalysisService {
  /**
   * Get compliance trends over a date range
   */
  static async getComplianceTrends(
    startDate: Date,
    endDate: Date,
    framework?: string,
    userId?: string
  ): Promise<ComplianceTrend[]> {
    try {
      const database = await getDb();
      if (!database) return [];

      let query = database
        .select({
          date: assessments.createdAt,
          score: assessments.overallScore,
          framework: assessments.framework,
          systemId: assessments.aiSystemId,
        })
        .from(assessments);

      // Add date range filter
      query = query.where(
        and(
          gte(assessments.createdAt, startDate),
          lte(assessments.createdAt, endDate)
        )
      ) as any;

      // Add framework filter if provided
      if (framework) {
        query = query.where(eq(assessments.framework, framework)) as any;
      }

      const results = await query;

      // Group by date and calculate averages
      const trends = new Map<string, ComplianceTrend>();

      results.forEach((result) => {
        const dateStr = result.date
          ? new Date(result.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        if (!trends.has(dateStr)) {
          trends.set(dateStr, {
            date: dateStr,
            score: 0,
            framework: result.framework || "all",
            systemCount: 0,
          });
        }

        const trend = trends.get(dateStr)!;
        trend.score = (trend.score * trend.systemCount + (result.score || 0)) / (trend.systemCount + 1);
        trend.systemCount += 1;
      });

      return Array.from(trends.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error("Error fetching compliance trends:", error);
      return [];
    }
  }

  /**
   * Get current compliance metrics snapshot
   */
  static async getMetricsSnapshot(userId?: string): Promise<ComplianceMetrics> {
    try {
      const database = await getDb();
      if (!database) {
        return {
          averageScore: 0,
          highRiskCount: 0,
          mediumRiskCount: 0,
          lowRiskCount: 0,
          compliantCount: 0,
          nonCompliantCount: 0,
          trendDirection: "stable",
        };
      }

      const assessmentList = await database
        .select({
          score: assessments.overallScore,
          status: assessments.status,
        })
        .from(assessments);

      if (assessmentList.length === 0) {
        return {
          averageScore: 0,
          highRiskCount: 0,
          mediumRiskCount: 0,
          lowRiskCount: 0,
          compliantCount: 0,
          nonCompliantCount: 0,
          trendDirection: "stable",
        };
      }

      const scores = assessmentList.map((a) => a.score || 0);
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Categorize by risk level
      const highRiskCount = assessmentList.filter((a) => (a.score || 0) < 40).length;
      const mediumRiskCount = assessmentList.filter(
        (a) => (a.score || 0) >= 40 && (a.score || 0) < 70
      ).length;
      const lowRiskCount = assessmentList.filter((a) => (a.score || 0) >= 70).length;

      // Categorize by compliance status
      const compliantCount = assessmentList.filter(
        (a) => a.status === "completed"
      ).length;
      const nonCompliantCount = assessmentList.filter(
        (a) => a.status !== "completed"
      ).length;

      // Determine trend direction
      const recentScores = scores.slice(-10);
      const olderScores = scores.slice(-20, -10);
      const recentAvg =
        recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const olderAvg =
        olderScores.length > 0
          ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
          : recentAvg;

      let trendDirection: "improving" | "declining" | "stable" = "stable";
      if (recentAvg > olderAvg + 5) {
        trendDirection = "improving";
      } else if (recentAvg < olderAvg - 5) {
        trendDirection = "declining";
      }

      return {
        averageScore: Math.round(averageScore),
        highRiskCount,
        mediumRiskCount,
        lowRiskCount,
        compliantCount,
        nonCompliantCount,
        trendDirection,
      };
    } catch (error) {
      console.error("Error fetching metrics snapshot:", error);
      return {
        averageScore: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
        compliantCount: 0,
        nonCompliantCount: 0,
        trendDirection: "stable",
      };
    }
  }

  /**
   * Compare compliance scores across frameworks
   */
  static async getFrameworkComparison(): Promise<FrameworkComparison[]> {
    try {
      const database = await getDb();
      if (!database) return [];

      const assessmentList = await database
        .select({
          framework: assessments.framework,
          score: assessments.overallScore,
          status: assessments.status,
        })
        .from(assessments);

      const frameworkMap = new Map<string, FrameworkComparison>();

      assessmentList.forEach((assessment) => {
        const framework = assessment.framework || "unknown";

        if (!frameworkMap.has(framework)) {
          frameworkMap.set(framework, {
            framework,
            averageScore: 0,
            systemsAssessed: 0,
            compliantPercentage: 0,
          });
        }

        const comparison = frameworkMap.get(framework)!;
        const score = assessment.score || 0;
        comparison.averageScore =
          (comparison.averageScore * comparison.systemsAssessed + score) /
          (comparison.systemsAssessed + 1);
        comparison.systemsAssessed += 1;

        if (assessment.status === "completed") {
          comparison.compliantPercentage =
            (comparison.compliantPercentage * (comparison.systemsAssessed - 1) +
              100) /
            comparison.systemsAssessed;
        }
      });

      return Array.from(frameworkMap.values()).sort(
        (a, b) => b.averageScore - a.averageScore
      );
    } catch (error) {
      console.error("Error fetching framework comparison:", error);
      return [];
    }
  }

  /**
   * Get incident pattern analysis
   */
  static async getIncidentPatterns(
    startDate: Date,
    endDate: Date
  ): Promise<{ pattern: string; count: number; severity: string }[]> {
    try {
      // This would integrate with watchdog reports in production
      // For now, return mock data structure
      return [
        { pattern: "Bias in AI systems", count: 24, severity: "high" },
        { pattern: "Privacy violations", count: 18, severity: "high" },
        { pattern: "Lack of transparency", count: 15, severity: "medium" },
        { pattern: "Inadequate human oversight", count: 12, severity: "medium" },
        { pattern: "Insufficient testing", count: 8, severity: "low" },
      ];
    } catch (error) {
      console.error("Error fetching incident patterns:", error);
      return [];
    }
  }

  /**
   * Get compliance gap analysis
   */
  static async getComplianceGaps(
    framework: string
  ): Promise<{ control: string; gapCount: number; severity: string }[]> {
    try {
      // This would analyze compliance gaps from assessments
      // For now, return framework-specific gaps
      const gaps: Record<
        string,
        { control: string; gapCount: number; severity: string }[]
      > = {
        "EU AI Act": [
          { control: "Risk Assessment", gapCount: 12, severity: "high" },
          { control: "Documentation", gapCount: 8, severity: "medium" },
          { control: "Human Oversight", gapCount: 6, severity: "high" },
          { control: "Transparency", gapCount: 5, severity: "medium" },
        ],
        "NIST AI RMF": [
          { control: "GOVERN Function", gapCount: 10, severity: "high" },
          { control: "MAP Function", gapCount: 7, severity: "medium" },
          { control: "MEASURE Function", gapCount: 5, severity: "medium" },
          { control: "MANAGE Function", gapCount: 4, severity: "low" },
        ],
        TC260: [
          { control: "Data Security", gapCount: 9, severity: "high" },
          { control: "Algorithm Governance", gapCount: 6, severity: "high" },
          { control: "User Rights", gapCount: 4, severity: "medium" },
          { control: "Incident Response", gapCount: 3, severity: "low" },
        ],
      };

      return gaps[framework] || [];
    } catch (error) {
      console.error("Error fetching compliance gaps:", error);
      return [];
    }
  }

  /**
   * Get predictive compliance scoring
   */
  static async getPredictiveScore(
    systemId: string,
    daysAhead: number = 30
  ): Promise<{ date: string; predictedScore: number; confidence: number }[]> {
    try {
      const database = await getDb();
      if (!database) return [];

      // Get historical scores for the system
      const assessmentList = await database
        .select({
          date: assessments.createdAt,
          score: assessments.overallScore,
        })
        .from(assessments)
        .where(eq(assessments.aiSystemId, systemId));

      if (assessmentList.length < 3) {
        return [];
      }

      // Simple linear regression for prediction
      const scores = assessmentList.map((a) => a.score || 0);
      const n = scores.length;
      const avgScore = scores.reduce((a, b) => a + b, 0) / n;
      const trend = (scores[n - 1] - scores[0]) / n;

      const predictions = [];
      for (let i = 1; i <= daysAhead; i += 7) {
        const predictedScore = Math.min(
          100,
          Math.max(0, avgScore + trend * i)
        );
        const confidence = Math.max(0.5, 1 - i / (daysAhead * 2));

        predictions.push({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          predictedScore: Math.round(predictedScore),
          confidence: Math.round(confidence * 100) / 100,
        });
      }

      return predictions;
    } catch (error) {
      console.error("Error calculating predictive score:", error);
      return [];
    }
  }
}
