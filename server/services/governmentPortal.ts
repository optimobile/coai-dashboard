/**
 * Government Portal Service
 * Provides analytics and compliance oversight for government agencies
 * EU Commission, EDPB, and national authorities
 */

import { db } from '@/server/db';
import { users, userCertificates, watchdogReports, complianceAssessments } from '@/drizzle/schema';
import { eq, gte, lte, and, count } from 'drizzle-orm';

export interface GovernmentAnalytics {
  totalCertifiedAnalysts: number;
  certificationsByLevel: {
    fundamentals: number;
    professional: number;
    expert: number;
  };
  complianceReports: {
    total: number;
    byFramework: Record<string, number>;
    byStatus: Record<string, number>;
  };
  incidentMetrics: {
    totalReports: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    resolutionRate: number;
  };
  trends: {
    certifications: Array<{ date: string; count: number }>;
    incidents: Array<{ date: string; count: number }>;
    compliance: Array<{ date: string; score: number }>;
  };
}

export interface GovernmentUser {
  id: string;
  email: string;
  agencyName: string;
  jurisdiction: string;
  role: 'admin' | 'analyst' | 'viewer';
  permissions: string[];
  lastAccessedAt: Date;
  createdAt: Date;
}

/**
 * Government Portal Service
 * Manages government agency access and analytics
 */
export class GovernmentPortalService {
  /**
   * Get comprehensive analytics for government oversight
   */
  static async getAnalytics(jurisdiction?: string): Promise<GovernmentAnalytics> {
    try {
      // Get total certified analysts
      const certifiedAnalysts = await db.query.userCertificates.findMany();
      const totalCertifiedAnalysts = certifiedAnalysts.length;

      // Count by certification level
      const certificationsByLevel = {
        fundamentals: certifiedAnalysts.filter((c) => c.certificationType === 'fundamentals').length,
        professional: certifiedAnalysts.filter((c) => c.certificationType === 'professional').length,
        expert: certifiedAnalysts.filter((c) => c.certificationType === 'expert').length,
      };

      // Get compliance reports
      const assessments = await db.query.complianceAssessments.findMany();
      const complianceReports = {
        total: assessments.length,
        byFramework: {
          eu_ai_act: assessments.filter((a) => a.framework === 'eu_ai_act').length,
          nist_rmf: assessments.filter((a) => a.framework === 'nist_rmf').length,
          tc260: assessments.filter((a) => a.framework === 'tc260').length,
          iso_42001: assessments.filter((a) => a.framework === 'iso_42001').length,
        },
        byStatus: {
          compliant: assessments.filter((a) => a.status === 'compliant').length,
          under_review: assessments.filter((a) => a.status === 'under_review').length,
          flagged: assessments.filter((a) => a.status === 'flagged').length,
          non_compliant: assessments.filter((a) => a.status === 'non_compliant').length,
        },
      };

      // Get incident metrics
      const reports = await db.query.watchdogReports.findMany();
      const totalReports = reports.length;

      const byCategory: Record<string, number> = {};
      const bySeverity: Record<string, number> = {};

      reports.forEach((r) => {
        byCategory[r.category] = (byCategory[r.category] || 0) + 1;
        bySeverity[r.severity] = (bySeverity[r.severity] || 0) + 1;
      });

      const resolvedReports = reports.filter((r) => r.status === 'resolved').length;
      const resolutionRate = totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;

      const incidentMetrics = {
        totalReports,
        byCategory,
        bySeverity,
        resolutionRate: Math.round(resolutionRate),
      };

      // Generate trends (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const certificationTrends: Array<{ date: string; count: number }> = [];
      const incidentTrends: Array<{ date: string; count: number }> = [];
      const complianceTrends: Array<{ date: string; score: number }> = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];

        const certCount = certifiedAnalysts.filter(
          (c) =>
            c.createdAt &&
            new Date(c.createdAt).toISOString().split('T')[0] === dateStr,
        ).length;
        certificationTrends.push({ date: dateStr, count: certCount });

        const incidentCount = reports.filter(
          (r) =>
            r.createdAt &&
            new Date(r.createdAt).toISOString().split('T')[0] === dateStr,
        ).length;
        incidentTrends.push({ date: dateStr, count: incidentCount });

        const avgScore =
          assessments.length > 0
            ? assessments
                .filter(
                  (a) =>
                    a.createdAt &&
                    new Date(a.createdAt).toISOString().split('T')[0] === dateStr,
                )
                .reduce((sum, a) => sum + (a.complianceScore || 0), 0) / assessments.length
            : 0;
        complianceTrends.push({ date: dateStr, score: Math.round(avgScore) });
      }

      return {
        totalCertifiedAnalysts,
        certificationsByLevel,
        complianceReports,
        incidentMetrics,
        trends: {
          certifications: certificationTrends,
          incidents: incidentTrends,
          compliance: complianceTrends,
        },
      };
    } catch (error) {
      console.error('Failed to get government analytics:', error);
      throw new Error('Failed to get government analytics');
    }
  }

  /**
   * Get certified analysts list for government oversight
   */
  static async getCertifiedAnalysts(jurisdiction?: string, limit = 100, offset = 0) {
    try {
      const analysts = await db.query.userCertificates.findMany({
        limit,
        offset,
      });

      return analysts.map((cert) => ({
        certificateId: cert.id,
        certificateNumber: cert.certificateNumber,
        certificationType: cert.certificationType,
        issuedAt: cert.createdAt,
        expiresAt: cert.expiresAt,
        status: cert.status,
      }));
    } catch (error) {
      console.error('Failed to get certified analysts:', error);
      throw new Error('Failed to get certified analysts');
    }
  }

  /**
   * Get compliance status by framework
   */
  static async getComplianceStatus(framework: string) {
    try {
      const assessments = await db.query.complianceAssessments.findMany();

      const filtered = assessments.filter((a) => a.framework === framework);

      const statusBreakdown = {
        compliant: filtered.filter((a) => a.status === 'compliant').length,
        under_review: filtered.filter((a) => a.status === 'under_review').length,
        flagged: filtered.filter((a) => a.status === 'flagged').length,
        non_compliant: filtered.filter((a) => a.status === 'non_compliant').length,
      };

      const avgScore =
        filtered.length > 0
          ? filtered.reduce((sum, a) => sum + (a.complianceScore || 0), 0) / filtered.length
          : 0;

      return {
        framework,
        totalAssessments: filtered.length,
        statusBreakdown,
        averageComplianceScore: Math.round(avgScore),
        assessments: filtered,
      };
    } catch (error) {
      console.error('Failed to get compliance status:', error);
      throw new Error('Failed to get compliance status');
    }
  }

  /**
   * Get incident analysis for regulatory reporting
   */
  static async getIncidentAnalysis(startDate: Date, endDate: Date) {
    try {
      const reports = await db.query.watchdogReports.findMany();

      const filtered = reports.filter(
        (r) =>
          r.createdAt &&
          new Date(r.createdAt) >= startDate &&
          new Date(r.createdAt) <= endDate,
      );

      const categoryBreakdown: Record<string, number> = {};
      const severityBreakdown: Record<string, number> = {};
      const statusBreakdown: Record<string, number> = {};

      filtered.forEach((r) => {
        categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
        severityBreakdown[r.severity] = (severityBreakdown[r.severity] || 0) + 1;
        statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;
      });

      const resolvedCount = filtered.filter((r) => r.status === 'resolved').length;
      const resolutionRate = filtered.length > 0 ? (resolvedCount / filtered.length) * 100 : 0;

      return {
        period: { startDate, endDate },
        totalIncidents: filtered.length,
        categoryBreakdown,
        severityBreakdown,
        statusBreakdown,
        resolutionRate: Math.round(resolutionRate),
        incidents: filtered,
      };
    } catch (error) {
      console.error('Failed to get incident analysis:', error);
      throw new Error('Failed to get incident analysis');
    }
  }

  /**
   * Export compliance report for regulatory submission
   */
  static async generateComplianceReport(framework: string, format: 'pdf' | 'json' | 'csv') {
    try {
      const complianceStatus = await this.getComplianceStatus(framework);

      if (format === 'json') {
        return JSON.stringify(complianceStatus, null, 2);
      }

      if (format === 'csv') {
        const headers = ['Framework', 'Status', 'Count', 'Percentage'];
        const rows = [headers];

        const total = Object.values(complianceStatus.statusBreakdown).reduce((a, b) => a + b, 0);
        Object.entries(complianceStatus.statusBreakdown).forEach(([status, count]) => {
          const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : '0';
          rows.push([framework, status, count.toString(), percentage]);
        });

        return rows.map((r) => r.join(',')).join('\n');
      }

      // PDF format would require additional library
      return JSON.stringify(complianceStatus, null, 2);
    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  /**
   * Get enforcement actions and penalties
   */
  static async getEnforcementActions(jurisdiction?: string) {
    try {
      // This would query enforcement_actions table when available
      // For now, return structure for future implementation
      return {
        jurisdiction: jurisdiction || 'EU',
        totalActions: 0,
        byType: {
          warning: 0,
          fine: 0,
          suspension: 0,
          revocation: 0,
        },
        actions: [],
      };
    } catch (error) {
      console.error('Failed to get enforcement actions:', error);
      throw new Error('Failed to get enforcement actions');
    }
  }
}
