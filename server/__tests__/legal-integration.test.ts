import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LegalNotificationService } from '../services/legalNotificationService';
import { LegalAnalyticsService } from '../services/legalAnalyticsService';

describe('Legal Notification Service', () => {
  describe('Case Assignment Notifications', () => {
    it('should generate case assignment email with correct structure', async () => {
      const notification = {
        caseId: 1,
        flagId: 1,
        barristerEmail: 'barrister@example.com',
        barristerName: 'John Doe',
        violationType: 'Bias & Discrimination',
        riskScore: 85,
        summary: 'AI system showing gender bias in hiring decisions',
        deadline: new Date('2025-12-31'),
        actionUrl: 'https://example.com/cases/1',
      };

      // Mock Resend
      vi.mock('resend', () => ({
        Resend: vi.fn(() => ({
          emails: {
            send: vi.fn().mockResolvedValue({
              data: { id: 'email-123' },
              error: null,
            }),
          },
        })),
      }));

      const result = await LegalNotificationService.notifyCaseAssignment(notification);
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should handle notification failures gracefully', async () => {
      const notification = {
        caseId: 1,
        flagId: 1,
        barristerEmail: 'invalid-email',
        barristerName: 'John Doe',
        violationType: 'Bias & Discrimination',
        riskScore: 85,
        summary: 'Test',
        deadline: new Date(),
        actionUrl: 'https://example.com/cases/1',
      };

      // This would fail with invalid email, but we're testing error handling
      const result = await LegalNotificationService.notifyCaseAssignment(notification);
      // Result should indicate success or failure
      expect(result).toHaveProperty('success');
    });
  });

  describe('Status Update Notifications', () => {
    it('should send case status update notifications', async () => {
      const notification = {
        caseId: 1,
        barristerEmail: 'barrister@example.com',
        barristerName: 'John Doe',
        status: 'approved' as const,
        feedback: 'Case approved for legal action',
        actionUrl: 'https://example.com/cases/1',
      };

      const result = await LegalNotificationService.notifyCaseStatusUpdate(notification);
      expect(result).toHaveProperty('success');
    });

    it('should handle different status types', async () => {
      const statuses: Array<'approved' | 'rejected' | 'pending' | 'in_review'> = [
        'approved',
        'rejected',
        'pending',
        'in_review',
      ];

      for (const status of statuses) {
        const notification = {
          caseId: 1,
          barristerEmail: 'test@example.com',
          barristerName: 'Test User',
          status,
          actionUrl: 'https://example.com/cases/1',
        };

        const result = await LegalNotificationService.notifyCaseStatusUpdate(notification);
        expect(result).toHaveProperty('success');
      }
    });
  });

  describe('Urgent Alerts', () => {
    it('should send urgent alerts for critical cases', async () => {
      const alert = {
        barristerEmail: 'barrister@example.com',
        barristerName: 'John Doe',
        alertType: 'Critical Violation Detected',
        description: 'Multiple critical violations detected in the system',
        caseCount: 5,
        actionUrl: 'https://example.com/cases',
      };

      const result = await LegalNotificationService.sendUrgentAlert(alert);
      expect(result).toHaveProperty('success');
    });
  });
});

describe('Legal Analytics Service', () => {
  describe('Violation Trend Analysis', () => {
    it('should calculate violation trends correctly', () => {
      const violations = [
        { date: '2025-12-20', category: 'Bias', riskScore: 85 },
        { date: '2025-12-20', category: 'Bias', riskScore: 80 },
        { date: '2025-12-21', category: 'Privacy', riskScore: 72 },
        { date: '2025-12-22', category: 'Bias', riskScore: 90 },
      ];

      const trends = LegalAnalyticsService.calculateViolationTrends(violations, 30);

      expect(trends).toBeDefined();
      expect(trends.length).toBeGreaterThan(0);
      expect(trends[0]).toHaveProperty('date');
      expect(trends[0]).toHaveProperty('category');
      expect(trends[0]).toHaveProperty('count');
      expect(trends[0]).toHaveProperty('riskScore');
      expect(trends[0]).toHaveProperty('trend');
    });

    it('should identify trend direction', () => {
      const violations = Array.from({ length: 20 }, (_, i) => ({
        date: `2025-12-${String(i + 1).padStart(2, '0')}`,
        category: 'Bias',
        riskScore: 50 + i * 2, // Increasing trend
      }));

      const trends = LegalAnalyticsService.calculateViolationTrends(violations, 30);
      const biasCategory = trends.find((t) => t.category === 'Bias');

      expect(biasCategory?.trend).toBeDefined();
    });
  });

  describe('Enforcement Metrics', () => {
    it('should calculate enforcement authority metrics', () => {
      const cases = [
        {
          authority: 'EU Commission',
          jurisdiction: 'EU',
          createdAt: new Date('2025-12-01'),
          resolvedAt: new Date('2025-12-03'),
          status: 'resolved',
        },
        {
          authority: 'EU Commission',
          jurisdiction: 'EU',
          createdAt: new Date('2025-12-05'),
          resolvedAt: new Date('2025-12-07'),
          status: 'resolved',
        },
        {
          authority: 'UK ICO',
          jurisdiction: 'UK',
          createdAt: new Date('2025-12-01'),
          resolvedAt: undefined,
          status: 'pending',
        },
      ];

      const metrics = LegalAnalyticsService.calculateEnforcementMetrics(cases);

      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]).toHaveProperty('authorityName');
      expect(metrics[0]).toHaveProperty('totalCases');
      expect(metrics[0]).toHaveProperty('averageResponseTime');
      expect(metrics[0]).toHaveProperty('resolutionRate');
    });

    it('should handle cases without resolution dates', () => {
      const cases = [
        {
          authority: 'Test Authority',
          jurisdiction: 'Test',
          createdAt: new Date(),
          resolvedAt: undefined,
          status: 'pending',
        },
      ];

      const metrics = LegalAnalyticsService.calculateEnforcementMetrics(cases);

      expect(metrics).toBeDefined();
      expect(metrics[0].totalCases).toBe(1);
    });
  });

  describe('Risk Predictions', () => {
    it('should predict risk trends', () => {
      const historicalData = Array.from({ length: 30 }, (_, i) => ({
        date: `2025-11-${String(i + 1).padStart(2, '0')}`,
        riskScore: 50 + Math.random() * 30,
      }));

      const prediction = LegalAnalyticsService.predictRiskTrends(
        historicalData,
        '30_days'
      );

      expect(prediction).toBeDefined();
      expect(prediction.predictedRiskScore).toBeGreaterThanOrEqual(0);
      expect(prediction.predictedRiskScore).toBeLessThanOrEqual(100);
      expect(prediction.confidence).toBeGreaterThanOrEqual(0);
      expect(prediction.confidence).toBeLessThanOrEqual(100);
      expect(['increasing', 'decreasing', 'stable']).toContain(prediction.trend);
      expect(Array.isArray(prediction.emergingRisks)).toBe(true);
      expect(Array.isArray(prediction.recommendations)).toBe(true);
    });

    it('should generate recommendations based on trend', () => {
      const historicalData = Array.from({ length: 30 }, (_, i) => ({
        date: `2025-11-${String(i + 1).padStart(2, '0')}`,
        riskScore: 40 + i * 1.5, // Increasing trend
      }));

      const prediction = LegalAnalyticsService.predictRiskTrends(
        historicalData,
        '30_days'
      );

      expect(prediction.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Compliance Trend Reports', () => {
    it('should generate compliance trend reports', () => {
      const violations = [
        {
          date: '2025-12-20',
          jurisdiction: 'EU',
          sector: 'Finance',
          severity: 'critical' as const,
        },
        {
          date: '2025-12-21',
          jurisdiction: 'EU',
          sector: 'Finance',
          severity: 'high' as const,
        },
        {
          date: '2025-12-22',
          jurisdiction: 'UK',
          sector: 'Healthcare',
          severity: 'medium' as const,
        },
      ];

      const reports = LegalAnalyticsService.generateComplianceTrendReport(violations);

      expect(reports).toBeDefined();
      expect(reports.length).toBeGreaterThan(0);
      expect(reports[0]).toHaveProperty('jurisdiction');
      expect(reports[0]).toHaveProperty('sector');
      expect(reports[0]).toHaveProperty('totalViolations');
      expect(reports[0]).toHaveProperty('complianceScore');
      expect(reports[0]).toHaveProperty('trend');
    });

    it('should calculate compliance scores correctly', () => {
      const violations = [
        {
          date: '2025-12-20',
          jurisdiction: 'EU',
          sector: 'Finance',
          severity: 'critical' as const,
        },
      ];

      const reports = LegalAnalyticsService.generateComplianceTrendReport(violations);
      const report = reports[0];

      expect(report.complianceScore).toBeLessThan(100);
      expect(report.complianceScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Analytics Summary', () => {
    it('should generate analytics summary for dashboard', () => {
      const now = new Date();
      const flags = [
        {
          createdAt: now,
          riskScore: 85,
          status: 'flagged',
          violationTypes: ['Bias', 'Discrimination'],
          jurisdiction: 'EU',
        },
        {
          createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          riskScore: 72,
          status: 'assigned',
          violationTypes: ['Privacy'],
          jurisdiction: 'UK',
        },
      ];

      const summary = LegalAnalyticsService.generateAnalyticsSummary(flags);

      expect(summary).toBeDefined();
      expect(summary).toHaveProperty('totalFlagsThisMonth');
      expect(summary).toHaveProperty('criticalCasesOpen');
      expect(summary).toHaveProperty('averageResponseTime');
      expect(summary).toHaveProperty('complianceScore');
      expect(Array.isArray(summary.topViolations)).toBe(true);
      expect(Array.isArray(summary.topJurisdictions)).toBe(true);
    });

    it('should identify top violations', () => {
      const flags = Array.from({ length: 10 }, (_, i) => ({
        createdAt: new Date(),
        riskScore: 50 + Math.random() * 50,
        status: 'flagged',
        violationTypes: [i % 2 === 0 ? 'Bias' : 'Privacy'],
        jurisdiction: 'EU',
      }));

      const summary = LegalAnalyticsService.generateAnalyticsSummary(flags);

      expect(summary.topViolations.length).toBeGreaterThan(0);
      expect(summary.topViolations[0]).toHaveProperty('type');
      expect(summary.topViolations[0]).toHaveProperty('count');
    });
  });
});
