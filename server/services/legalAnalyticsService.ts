/**
 * Legal Analytics Service
 * Tracks violation trends, enforcement response times, and predictive analytics
 */

export interface ViolationTrend {
  date: string;
  category: string;
  count: number;
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface EnforcementMetrics {
  authorityName: string;
  jurisdiction: string;
  totalCases: number;
  averageResponseTime: number; // in hours
  resolutionRate: number; // percentage
  avgTimeToResolution: number; // in days
}

export interface RiskPrediction {
  period: string; // '30_days', '60_days', '90_days'
  predictedRiskScore: number;
  confidence: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  emergingRisks: string[];
  recommendations: string[];
}

export interface ComplianceTrendReport {
  period: string;
  jurisdiction: string;
  sector: string;
  totalViolations: number;
  criticalViolations: number;
  highViolations: number;
  mediumViolations: number;
  lowViolations: number;
  complianceScore: number; // 0-100
  trend: 'improving' | 'declining' | 'stable';
}

export interface AnalyticsSummary {
  totalFlagsThisMonth: number;
  criticalCasesOpen: number;
  averageResponseTime: number;
  complianceScore: number;
  topViolations: Array<{ type: string; count: number }>;
  topJurisdictions: Array<{ name: string; count: number }>;
}

export class LegalAnalyticsService {
  /**
   * Calculate violation trends by category
   */
  static calculateViolationTrends(
    violations: Array<{
      date: string;
      category: string;
      riskScore: number;
    }>,
    days: number = 30
  ): ViolationTrend[] {
    const trends = new Map<string, ViolationTrend>();
    const categoryTotals = new Map<string, number[]>();

    // Group violations by date and category
    violations.forEach((v) => {
      const key = `${v.date}-${v.category}`;
      if (!trends.has(key)) {
        trends.set(key, {
          date: v.date,
          category: v.category,
          count: 0,
          riskScore: 0,
          trend: 'stable',
        });
      }

      const trend = trends.get(key)!;
      trend.count++;
      trend.riskScore = Math.max(trend.riskScore, v.riskScore);

      // Track for trend calculation
      if (!categoryTotals.has(v.category)) {
        categoryTotals.set(v.category, []);
      }
      categoryTotals.get(v.category)!.push(trend.count);
    });

    // Calculate trends
    const result = Array.from(trends.values());
    result.forEach((trend) => {
      const totals = categoryTotals.get(trend.category) || [];
      if (totals.length > 1) {
        const recent = totals.slice(-7).reduce((a, b) => a + b, 0) / 7;
        const previous = totals.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;

        if (recent > previous * 1.1) {
          trend.trend = 'up';
        } else if (recent < previous * 0.9) {
          trend.trend = 'down';
        } else {
          trend.trend = 'stable';
        }
      }
    });

    return result;
  }

  /**
   * Calculate enforcement authority metrics
   */
  static calculateEnforcementMetrics(
    cases: Array<{
      authority: string;
      jurisdiction: string;
      createdAt: Date;
      resolvedAt?: Date;
      status: string;
    }>
  ): EnforcementMetrics[] {
    const authorityMap = new Map<string, EnforcementMetrics>();

    cases.forEach((c) => {
      const key = c.authority;
      if (!authorityMap.has(key)) {
        authorityMap.set(key, {
          authorityName: c.authority,
          jurisdiction: c.jurisdiction,
          totalCases: 0,
          averageResponseTime: 0,
          resolutionRate: 0,
          avgTimeToResolution: 0,
        });
      }

      const metrics = authorityMap.get(key)!;
      metrics.totalCases++;

      if (c.resolvedAt) {
        const responseTime =
          (c.resolvedAt.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60); // in hours
        metrics.averageResponseTime =
          (metrics.averageResponseTime * (metrics.totalCases - 1) + responseTime) /
          metrics.totalCases;

        const daysToResolution =
          (c.resolvedAt.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        metrics.avgTimeToResolution =
          (metrics.avgTimeToResolution * (metrics.totalCases - 1) + daysToResolution) /
          metrics.totalCases;

        if (c.status === 'resolved' || c.status === 'closed') {
          metrics.resolutionRate =
            (metrics.resolutionRate * (metrics.totalCases - 1) + 100) /
            metrics.totalCases;
        }
      }
    });

    return Array.from(authorityMap.values());
  }

  /**
   * Predict future risk trends
   */
  static predictRiskTrends(
    historicalData: Array<{
      date: string;
      riskScore: number;
    }>,
    period: '30_days' | '60_days' | '90_days' = '30_days'
  ): RiskPrediction {
    // Simple trend extrapolation
    const scores = historicalData.map((d) => d.riskScore);
    const recentAvg = scores.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const previousAvg = scores.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;

    const trend =
      recentAvg > previousAvg * 1.1
        ? 'increasing'
        : recentAvg < previousAvg * 0.9
          ? 'decreasing'
          : 'stable';

    // Calculate confidence based on data consistency
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - recentAvg, 2), 0) /
      scores.length;
    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0, Math.min(100, 100 - stdDev));

    // Predict future score
    const predictedRiskScore =
      recentAvg +
      (recentAvg - previousAvg) * (period === '30_days' ? 1 : period === '60_days' ? 2 : 3);

    // Identify emerging risks
    const emergingRisks = this.identifyEmergingRisks(historicalData);

    // Generate recommendations
    const recommendations = this.generateRecommendations(trend, predictedRiskScore);

    return {
      period,
      predictedRiskScore: Math.max(0, Math.min(100, predictedRiskScore)),
      confidence,
      trend,
      emergingRisks,
      recommendations,
    };
  }

  /**
   * Generate compliance trend report
   */
  static generateComplianceTrendReport(
    violations: Array<{
      date: string;
      jurisdiction: string;
      sector: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
    }>,
    period: string = 'monthly'
  ): ComplianceTrendReport[] {
    const reports = new Map<string, ComplianceTrendReport>();

    violations.forEach((v) => {
      const key = `${v.jurisdiction}-${v.sector}`;
      if (!reports.has(key)) {
        reports.set(key, {
          period,
          jurisdiction: v.jurisdiction,
          sector: v.sector,
          totalViolations: 0,
          criticalViolations: 0,
          highViolations: 0,
          mediumViolations: 0,
          lowViolations: 0,
          complianceScore: 100,
          trend: 'stable',
        });
      }

      const report = reports.get(key)!;
      report.totalViolations++;

      switch (v.severity) {
        case 'critical':
          report.criticalViolations++;
          break;
        case 'high':
          report.highViolations++;
          break;
        case 'medium':
          report.mediumViolations++;
          break;
        case 'low':
          report.lowViolations++;
          break;
      }
    });

    // Calculate compliance scores
    reports.forEach((report) => {
      const violationScore =
        report.criticalViolations * 10 +
        report.highViolations * 5 +
        report.mediumViolations * 2 +
        report.lowViolations * 0.5;

      report.complianceScore = Math.max(0, 100 - violationScore);

      // Determine trend (simplified)
      if (report.totalViolations > 10) {
        report.trend = 'declining';
      } else if (report.totalViolations < 3) {
        report.trend = 'improving';
      } else {
        report.trend = 'stable';
      }
    });

    return Array.from(reports.values());
  }

  /**
   * Generate analytics summary for dashboard
   */
  static generateAnalyticsSummary(
    flags: Array<{
      createdAt: Date;
      riskScore: number;
      status: string;
      violationTypes: string[];
      jurisdiction?: string;
    }>
  ): AnalyticsSummary {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisMonth = flags.filter((f) => f.createdAt >= monthAgo);
    const criticalOpen = flags.filter(
      (f) => f.riskScore >= 90 && f.status !== 'resolved'
    ).length;

    // Calculate average response time
    const avgResponseTime = thisMonth.length > 0 ? 24 : 0; // placeholder

    // Calculate compliance score
    const avgRiskScore =
      flags.length > 0
        ? flags.reduce((sum, f) => sum + f.riskScore, 0) / flags.length
        : 0;
    const complianceScore = Math.max(0, 100 - avgRiskScore);

    // Top violations
    const violationCounts = new Map<string, number>();
    flags.forEach((f) => {
      f.violationTypes.forEach((vt) => {
        violationCounts.set(vt, (violationCounts.get(vt) || 0) + 1);
      });
    });
    const topViolations = Array.from(violationCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top jurisdictions
    const jurisdictionCounts = new Map<string, number>();
    flags.forEach((f) => {
      if (f.jurisdiction) {
        jurisdictionCounts.set(
          f.jurisdiction,
          (jurisdictionCounts.get(f.jurisdiction) || 0) + 1
        );
      }
    });
    const topJurisdictions = Array.from(jurisdictionCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalFlagsThisMonth: thisMonth.length,
      criticalCasesOpen,
      averageResponseTime: avgResponseTime,
      complianceScore: Math.round(complianceScore),
      topViolations,
      topJurisdictions,
    };
  }

  /**
   * Identify emerging risk patterns
   */
  private static identifyEmergingRisks(
    historicalData: Array<{
      date: string;
      riskScore: number;
    }>
  ): string[] {
    const risks: string[] = [];

    if (historicalData.length < 7) {
      return risks;
    }

    const recent = historicalData.slice(-7);
    const previous = historicalData.slice(-14, -7);

    const recentAvg = recent.reduce((a, b) => a + b.riskScore, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b.riskScore, 0) / previous.length;

    if (recentAvg > previousAvg * 1.2) {
      risks.push('Rapid increase in risk scores');
    }

    if (recentAvg > 70) {
      risks.push('High average risk level detected');
    }

    const volatility =
      recent.reduce((sum, d) => sum + Math.abs(d.riskScore - recentAvg), 0) /
      recent.length;
    if (volatility > 20) {
      risks.push('High volatility in risk patterns');
    }

    return risks;
  }

  /**
   * Generate recommendations based on trends
   */
  private static generateRecommendations(
    trend: 'increasing' | 'decreasing' | 'stable',
    riskScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (trend === 'increasing') {
      recommendations.push('Increase monitoring frequency');
      recommendations.push('Allocate additional resources to case review');
    }

    if (riskScore > 80) {
      recommendations.push('Escalate to senior legal team');
      recommendations.push('Consider regulatory notification');
    }

    if (riskScore > 60) {
      recommendations.push('Implement enhanced compliance measures');
      recommendations.push('Schedule stakeholder meetings');
    }

    if (trend === 'decreasing') {
      recommendations.push('Continue current enforcement approach');
      recommendations.push('Document successful strategies');
    }

    return recommendations;
  }
}
