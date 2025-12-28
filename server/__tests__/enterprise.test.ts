/**
 * Enterprise Features Tests
 * Dashboard metrics, audit trail, and compliance marketplace
 */

import { describe, it, expect } from 'vitest';
import { DashboardMetricsService } from '../services/dashboardMetrics';
import { AuditTrailService, ComplianceExportService } from '../services/auditTrail';
import { ComplianceMarketplaceService } from '../services/complianceMarketplace';

describe('Enterprise Features', () => {
  // ============================================
  // Dashboard Metrics Tests
  // ============================================
  describe('Dashboard Metrics Service', () => {
    it('should calculate compliance score card', () => {
      const card = DashboardMetricsService.calculateComplianceScoreCard(
        1,
        'Test System',
        85,
        80,
        'gold'
      );

      expect(card.systemId).toBe(1);
      expect(card.systemName).toBe('Test System');
      expect(card.overallScore).toBe(85);
      expect(card.trend).toBe('up');
      expect(card.certificationLevel).toBe('gold');
      expect(card.riskLevel).toBe('limited'); // Score 85 is >= 70 and < 90
    });

    it('should track compliance trend correctly', () => {
      const card1 = DashboardMetricsService.calculateComplianceScoreCard(1, 'System', 80, 75, 'silver');
      const card2 = DashboardMetricsService.calculateComplianceScoreCard(1, 'System', 75, 80, 'silver');
      const card3 = DashboardMetricsService.calculateComplianceScoreCard(1, 'System', 80, 80, 'silver');

      expect(card1.trend).toBe('up');
      expect(card2.trend).toBe('down');
      expect(card3.trend).toBe('stable');
    });

    it('should calculate webhook metrics correctly', () => {
      const deliveries = [
        { status: 'delivered' as const, deliveryTime: 100, createdAt: new Date() },
        { status: 'delivered' as const, deliveryTime: 200, createdAt: new Date() },
        { status: 'failed' as const, createdAt: new Date() },
      ];

      const metrics = DashboardMetricsService.calculateWebhookMetrics(5, 4, deliveries);

      expect(metrics.totalSubscriptions).toBe(5);
      expect(metrics.activeSubscriptions).toBe(4);
      expect(metrics.totalDeliveries).toBe(3);
      expect(metrics.successfulDeliveries).toBe(2);
      expect(metrics.failedDeliveries).toBe(1);
      expect(metrics.successRate).toBe((2 / 3) * 100);
      expect(metrics.averageDeliveryTime).toBe(150);
    });

    it('should calculate onboarding funnel analytics', () => {
      const sessions = [
        {
          id: 'sess-1',
          currentStep: 5,
          completedSteps: [1, 2, 3, 4, 5],
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(),
        },
        {
          id: 'sess-2',
          currentStep: 3,
          completedSteps: [1, 2, 3],
          createdAt: new Date(Date.now() - 7200000),
          updatedAt: new Date(),
        },
        {
          id: 'sess-3',
          currentStep: 1,
          completedSteps: [1],
          createdAt: new Date(Date.now() - 10800000),
          updatedAt: new Date(),
        },
      ];

      const analytics = DashboardMetricsService.calculateOnboardingAnalytics(sessions);

      expect(analytics.totalStarted).toBe(3);
      expect(analytics.completedStep1).toBe(3);
      expect(analytics.completedStep2).toBe(2);
      expect(analytics.completedStep3).toBe(2);
      expect(analytics.completedStep4).toBe(1);
      expect(analytics.completedStep5).toBe(1);
      expect(analytics.conversionRates.overall).toBe((1 / 3) * 100);
    });

    it('should calculate risk summary', () => {
      const systems = [
        { id: 1, complianceScore: 95 },
        { id: 2, complianceScore: 85 },
        { id: 3, complianceScore: 65 },
        { id: 4, complianceScore: 55 },
      ];

      const summary = DashboardMetricsService.calculateRiskSummary(systems);

      expect(summary.minimalRiskSystems).toBe(1);
      expect(summary.limitedRiskSystems).toBe(1);
      expect(summary.highRiskSystems).toBe(2);
    });

    it('should generate action items based on compliance status', () => {
      const systems = [
        {
          id: 1,
          name: 'High Risk System',
          complianceScore: 65,
          lastAssessmentDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        },
      ];

      const webhookMetrics = {
        totalSubscriptions: 5,
        activeSubscriptions: 4,
        totalDeliveries: 100,
        successfulDeliveries: 94,
        failedDeliveries: 6,
        averageDeliveryTime: 250,
        successRate: 94,
        lastDeliveryTime: new Date(),
      };

      const onboardingAnalytics = {
        totalStarted: 100,
        completedStep1: 100,
        completedStep2: 80,
        completedStep3: 60,
        completedStep4: 40,
        completedStep5: 30,
        conversionRates: {
          step1to2: 80,
          step2to3: 75,
          step3to4: 67,
          step4to5: 75,
          overall: 30,
        },
        averageTimePerStep: { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25 },
        dropoffPoints: [],
      };

      const actionItems = DashboardMetricsService.generateActionItems(
        systems,
        webhookMetrics,
        onboardingAnalytics
      );

      expect(actionItems.length).toBeGreaterThan(0);
      expect(actionItems.some((a) => a.priority === 'critical')).toBe(true);
    });
  });

  // ============================================
  // Audit Trail Tests
  // ============================================
  describe('Audit Trail Service', () => {
    it('should create audit log entry', () => {
      const entry = AuditTrailService.createAuditLogEntry(
        'user-1',
        'TEST_ACTION',
        'system',
        'sys-1',
        { field: { before: 'old', after: 'new' } },
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(entry.userId).toBe('user-1');
      expect(entry.action).toBe('TEST_ACTION');
      expect(entry.entityType).toBe('system');
      expect(entry.status).toBe('success');
      expect(entry.timestamp).toBeInstanceOf(Date);
    });

    it('should log compliance decision', () => {
      const entry = AuditTrailService.logComplianceDecision(
        'user-1',
        'sys-1',
        'APPROVED',
        85,
        80,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(entry.action).toBe('COMPLIANCE_DECISION');
      expect(entry.entityType).toBe('compliance_decision');
      expect(entry.metadata.decisionType).toBe('APPROVED');
    });

    it('should log assessment completion', () => {
      const entry = AuditTrailService.logAssessmentCompletion(
        'user-1',
        'sys-1',
        'EU AI Act',
        85,
        45,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(entry.action).toBe('ASSESSMENT_COMPLETED');
      expect(entry.entityType).toBe('assessment');
      expect(entry.metadata.framework).toBe('EU AI Act');
    });

    it('should log certification issuance', () => {
      const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const entry = AuditTrailService.logCertificationIssuance(
        'user-1',
        'sys-1',
        'gold',
        expiryDate,
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(entry.action).toBe('CERTIFICATION_ISSUED');
      expect(entry.entityType).toBe('certification');
      expect(entry.metadata.certificationLevel).toBe('gold');
    });

    it('should filter audit logs', () => {
      const logs = [
        AuditTrailService.logComplianceDecision('user-1', 'sys-1', 'APPROVED', 85, 80, '192.168.1.1', 'Mozilla/5.0'),
        AuditTrailService.logAssessmentCompletion('user-2', 'sys-2', 'EU AI Act', 72, 45, '192.168.1.2', 'Chrome/120'),
      ];

      const filtered = AuditTrailService.filterAuditLogs(logs, { userId: 'user-1' });

      expect(filtered.length).toBe(1);
      expect(filtered[0].userId).toBe('user-1');
    });

    it('should generate audit report', () => {
      const logs = [
        AuditTrailService.logComplianceDecision('user-1', 'sys-1', 'APPROVED', 85, 80, '192.168.1.1', 'Mozilla/5.0'),
        AuditTrailService.logAssessmentCompletion('user-2', 'sys-2', 'EU AI Act', 72, 45, '192.168.1.2', 'Chrome/120'),
      ];

      const report = AuditTrailService.generateAuditReport(logs, new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());

      expect(report.totalEntries).toBeGreaterThan(0);
      expect(report.successfulActions).toBeGreaterThan(0);
      expect(report.actionBreakdown).toBeDefined();
      expect(report.entityTypeBreakdown).toBeDefined();
    });
  });

  // ============================================
  // Compliance Export Tests
  // ============================================
  describe('Compliance Export Service', () => {
    it('should generate XML export', () => {
      const exportData = {
        organizationName: 'Test Corp',
        exportDate: new Date(),
        exportedBy: 'admin@test.com',
        systems: [
          {
            id: 'sys-1',
            name: 'Test System',
            type: 'LLM',
            riskLevel: 'limited',
            complianceScore: 85,
            certificationLevel: 'gold',
            lastAssessment: new Date(),
            controls: [
              { id: 'ctrl-1', name: 'Data Protection', status: 'compliant' as const, evidence: ['policy.pdf'] },
            ],
          },
        ],
        auditLog: [],
        certifications: [],
        assessments: [],
      };

      const xml = ComplianceExportService.generateXMLExport(exportData);

      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<ComplianceReport>');
      expect(xml).toContain('Test Corp');
      expect(xml).toContain('Test System');
    });

    it('should generate CSV export', () => {
      const exportData = {
        organizationName: 'Test Corp',
        exportDate: new Date(),
        exportedBy: 'admin@test.com',
        systems: [
          {
            id: 'sys-1',
            name: 'Test System',
            type: 'LLM',
            riskLevel: 'limited',
            complianceScore: 85,
            certificationLevel: 'gold',
            lastAssessment: new Date(),
            controls: [],
          },
        ],
        auditLog: [],
        certifications: [],
        assessments: [],
      };

      const csv = ComplianceExportService.generateCSVExport(exportData);

      expect(csv).toContain('System ID,System Name');
      expect(csv).toContain('sys-1');
      expect(csv).toContain('Test System');
    });

    it('should generate JSON export', () => {
      const exportData = {
        organizationName: 'Test Corp',
        exportDate: new Date(),
        exportedBy: 'admin@test.com',
        systems: [],
        auditLog: [],
        certifications: [],
        assessments: [],
      };

      const json = ComplianceExportService.generateJSONExport(exportData);
      const parsed = JSON.parse(json);

      expect(parsed.organizationName).toBe('Test Corp');
      expect(parsed.exportedBy).toBe('admin@test.com');
    });
  });

  // ============================================
  // Compliance Marketplace Tests
  // ============================================
  describe('Compliance Marketplace Service', () => {
    it('should get all marketplace addons', () => {
      const addons = ComplianceMarketplaceService.getMarketplaceAddons();

      expect(addons.length).toBeGreaterThan(0);
      expect(addons[0]).toHaveProperty('id');
      expect(addons[0]).toHaveProperty('name');
      expect(addons[0]).toHaveProperty('rating');
    });

    it('should filter addons by category', () => {
      const monitoring = ComplianceMarketplaceService.getMarketplaceAddons('monitoring');

      expect(monitoring.length).toBeGreaterThan(0);
      monitoring.forEach((addon) => {
        expect(addon.category).toBe('monitoring');
      });
    });

    it('should sort addons by rating', () => {
      const sorted = ComplianceMarketplaceService.getMarketplaceAddons(undefined, 'rating');

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].rating).toBeGreaterThanOrEqual(sorted[i].rating);
      }
    });

    it('should get addon details', () => {
      const addons = ComplianceMarketplaceService.getMarketplaceAddons();
      const addon = ComplianceMarketplaceService.getAddonDetails(addons[0].id);

      expect(addon).toBeDefined();
      expect(addon?.id).toBe(addons[0].id);
    });

    it('should create integration connection', () => {
      const connection = ComplianceMarketplaceService.createIntegrationConnection(
        'user-1',
        'addon-splunk',
        'test-key',
        'test-secret',
        { host: 'splunk.example.com' }
      );

      expect(connection.userId).toBe('user-1');
      expect(connection.addonId).toBe('addon-splunk');
      expect(connection.status).toBe('pending');
      expect(connection.webhookUrl).toContain('webhooks');
    });

    it('should test integration connection', () => {
      const connection = ComplianceMarketplaceService.createIntegrationConnection(
        'user-1',
        'addon-splunk',
        'valid-key-12345',
        'test-secret'
      );

      const result = ComplianceMarketplaceService.testIntegrationConnection(connection);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Successfully connected');
      expect(result.latency).toBeGreaterThan(0);
    });

    it('should create remediation workflow', () => {
      const workflow = ComplianceMarketplaceService.createRemediationWorkflow(
        'Test Workflow',
        'Test workflow description',
        {
          addonId: 'addon-splunk',
          eventType: 'violation.detected',
          condition: 'severity >= high',
        },
        [
          {
            order: 1,
            type: 'notification',
            target: 'addon-slack',
            payload: { channel: '#compliance' },
          },
        ]
      );

      expect(workflow.name).toBe('Test Workflow');
      expect(workflow.isActive).toBe(true);
      expect(workflow.actions.length).toBe(1);
    });

    it('should get SIEM integration template', () => {
      const template = ComplianceMarketplaceService.getSIEMIntegrationTemplate('splunk');

      expect(template.platform).toBe('splunk');
      expect(template.logFormat).toBe('json');
      expect(template.eventTypes).toBeDefined();
    });

    it('should get SOAR integration template', () => {
      const template = ComplianceMarketplaceService.getSOARIntegrationTemplate('paloalto');

      expect(template.platform).toBe('paloalto');
      expect(template.playbooks).toBeDefined();
      expect(template.playbooks!.length).toBeGreaterThan(0);
    });

    it('should get integration health status', () => {
      const connection = ComplianceMarketplaceService.createIntegrationConnection(
        'user-1',
        'addon-splunk',
        'test-key',
        'test-secret'
      );

      const health = ComplianceMarketplaceService.getIntegrationHealth(connection);

      expect(health.status).toBeDefined();
      expect(health.uptime).toBeGreaterThan(0);
      expect(health.lastCheck).toBeInstanceOf(Date);
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  describe('Enterprise Features Integration', () => {
    it('should build complete executive dashboard', () => {
      const scoreCards = [
        DashboardMetricsService.calculateComplianceScoreCard(1, 'System 1', 85, 80, 'gold'),
      ];

      const webhookMetrics = {
        totalSubscriptions: 5,
        activeSubscriptions: 4,
        totalDeliveries: 100,
        successfulDeliveries: 99,
        failedDeliveries: 1,
        averageDeliveryTime: 250,
        successRate: 99,
        lastDeliveryTime: new Date(),
      };

      const onboardingAnalytics = {
        totalStarted: 100,
        completedStep1: 100,
        completedStep2: 80,
        completedStep3: 60,
        completedStep4: 40,
        completedStep5: 30,
        conversionRates: { step1to2: 80, step2to3: 75, step3to4: 67, step4to5: 75, overall: 30 },
        averageTimePerStep: { 1: 5, 2: 10, 3: 15, 4: 20, 5: 25 },
        dropoffPoints: [],
      };

      const trends = [
        { date: new Date(), score: 85, systemId: 1 },
      ];

      const systems = [{ id: 1, name: 'System 1', complianceScore: 85, lastAssessmentDate: new Date() }];

      const dashboard = DashboardMetricsService.buildExecutiveDashboard(
        scoreCards,
        webhookMetrics,
        onboardingAnalytics,
        trends,
        systems
      );

      expect(dashboard.complianceScoreCards.length).toBe(1);
      expect(dashboard.webhookMetrics).toBeDefined();
      expect(dashboard.onboardingAnalytics).toBeDefined();
      expect(dashboard.riskSummary).toBeDefined();
      expect(dashboard.actionItems).toBeDefined();
    });

    it('should integrate audit trail with compliance exports', () => {
      const logs = [
        AuditTrailService.logComplianceDecision('user-1', 'sys-1', 'APPROVED', 85, 80, '192.168.1.1', 'Mozilla/5.0'),
      ];

      const exportData = {
        organizationName: 'Test Corp',
        exportDate: new Date(),
        exportedBy: 'admin@test.com',
        systems: [],
        auditLog: logs,
        certifications: [],
        assessments: [],
      };

      const xml = ComplianceExportService.generateXMLExport(exportData);
      expect(xml).toContain('AuditLog');
    });
  });
});
