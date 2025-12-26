/**
 * Advanced Features Tests
 * Dashboard components, compliance roadmap, and alerting system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AlertingSystem } from '../services/alertingSystem';
import { ComplianceRoadmapGenerator, ComplianceGap } from '../services/complianceRoadmapGenerator';

describe('Advanced Features', () => {
  // ============================================
  // Alerting System Tests
  // ============================================
  describe('Alerting System', () => {
    let alertingSystem: AlertingSystem;

    beforeEach(() => {
      alertingSystem = new AlertingSystem();
    });

    it('should create compliance violation alert', async () => {
      const alert = await alertingSystem.alertComplianceViolation(
        'org-1',
        'sys-1',
        'Data Protection',
        'high',
        ['policy.pdf', 'audit.log']
      );

      expect(alert.type).toBe('compliance_violation');
      expect(alert.severity).toBe('high');
      expect(alert.organizationId).toBe('org-1');
      expect(alert.systemId).toBe('sys-1');
      expect(alert.metadata.requirement).toBe('Data Protection');
    });

    it('should create webhook failure alert with escalating severity', async () => {
      const alert1 = await alertingSystem.alertWebhookFailure('org-1', 'webhook-1', 'Connection timeout', 2);
      const alert2 = await alertingSystem.alertWebhookFailure('org-1', 'webhook-1', 'Connection timeout', 4);
      const alert3 = await alertingSystem.alertWebhookFailure('org-1', 'webhook-1', 'Connection timeout', 6);

      expect(alert1.severity).toBe('medium');
      expect(alert2.severity).toBe('high');
      expect(alert3.severity).toBe('critical');
    });

    it('should create onboarding dropoff alert', async () => {
      const alert = await alertingSystem.alertOnboardingDropoff(
        'org-1',
        'session-1',
        3,
        'User abandoned process'
      );

      expect(alert.type).toBe('onboarding_dropoff');
      expect(alert.severity).toBe('medium');
      expect(alert.metadata.currentStep).toBe(3);
    });

    it('should create assessment overdue alert', async () => {
      const alert = await alertingSystem.alertAssessmentOverdue('org-1', 'sys-1', 'EU AI Act', 45);

      expect(alert.type).toBe('assessment_overdue');
      expect(alert.severity).toBe('high');
      expect(alert.metadata.daysOverdue).toBe(45);
    });

    it('should create certification expiring alert', async () => {
      const alert1 = await alertingSystem.alertCertificationExpiring('org-1', 'sys-1', 'gold', 20);
      const alert2 = await alertingSystem.alertCertificationExpiring('org-1', 'sys-1', 'gold', 60);

      expect(alert1.severity).toBe('high');
      expect(alert2.severity).toBe('medium');
    });

    it('should create control failure alert', async () => {
      const alert = await alertingSystem.alertControlFailure(
        'org-1',
        'sys-1',
        'Data Encryption',
        'Encryption key rotation failed'
      );

      expect(alert.type).toBe('control_failure');
      expect(alert.severity).toBe('high');
      expect(alert.metadata.controlName).toBe('Data Encryption');
    });

    it('should retrieve alerts by organization', async () => {
      await alertingSystem.alertComplianceViolation('org-1', 'sys-1', 'Data Protection', 'high', []);
      await alertingSystem.alertComplianceViolation('org-2', 'sys-2', 'Transparency', 'medium', []);

      const org1Alerts = alertingSystem.getAlerts('org-1');
      const org2Alerts = alertingSystem.getAlerts('org-2');

      expect(org1Alerts.length).toBe(1);
      expect(org2Alerts.length).toBe(1);
      expect(org1Alerts[0].organizationId).toBe('org-1');
    });

    it('should resolve alerts', async () => {
      const alert = await alertingSystem.alertComplianceViolation('org-1', 'sys-1', 'Data Protection', 'high', []);

      expect(alert.resolvedAt).toBeUndefined();

      const resolved = alertingSystem.resolveAlert(alert.id);
      expect(resolved?.resolvedAt).toBeDefined();
    });

    it('should calculate alert statistics', async () => {
      await alertingSystem.alertComplianceViolation('org-1', 'sys-1', 'Data Protection', 'critical', []);
      await alertingSystem.alertComplianceViolation('org-1', 'sys-2', 'Transparency', 'high', []);
      await alertingSystem.alertWebhookFailure('org-1', 'webhook-1', 'Timeout', 2);

      const stats = alertingSystem.getAlertStatistics('org-1');

      expect(stats.total).toBe(3);
      expect(stats.critical).toBe(1);
      expect(stats.high).toBe(1);
      expect(stats.unresolved).toBe(3);
      expect(stats.byType.compliance_violation).toBe(2);
      expect(stats.byType.webhook_failure).toBe(1);
    });

    it('should check quiet hours correctly', async () => {
      const alert = await alertingSystem.alertComplianceViolation('org-1', 'sys-1', 'Data Protection', 'high', []);

      expect(alert).toBeDefined();
      expect(alert.createdAt).toBeInstanceOf(Date);
    });
  });

  // ============================================
  // Compliance Roadmap Generator Tests
  // ============================================
  describe('Compliance Roadmap Generator', () => {
    let roadmapGenerator: ComplianceRoadmapGenerator;

    beforeEach(() => {
      roadmapGenerator = new ComplianceRoadmapGenerator();
    });

    it('should generate compliance roadmap', async () => {
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Data Protection',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Data protection controls not implemented',
          evidence: [],
        },
        {
          requirementId: 'req-2',
          requirementName: 'Transparency',
          framework: 'EU AI Act',
          currentStatus: 'partial',
          severity: 'high',
          description: 'Transparency requirements partially met',
          evidence: [],
        },
      ];

      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);

      expect(roadmap.organizationId).toBe('org-1');
      expect(roadmap.totalGaps).toBe(2);
      expect(roadmap.criticalGaps).toBe(1);
      expect(roadmap.phases.length).toBeGreaterThan(0);
      expect(roadmap.estimatedTotalHours).toBeGreaterThan(0);
      expect(roadmap.recommendations.length).toBeGreaterThan(0);
    });

    it('should organize gaps into phases by severity', async () => {
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Critical Control',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Critical gap',
          evidence: [],
        },
        {
          requirementId: 'req-2',
          requirementName: 'High Control',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'high',
          description: 'High gap',
          evidence: [],
        },
        {
          requirementId: 'req-3',
          requirementName: 'Medium Control',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'medium',
          description: 'Medium gap',
          evidence: [],
        },
      ];

      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);

      // Phase 1 should have critical gaps
      expect(roadmap.phases[0].actions.length).toBeGreaterThan(0);
      // Phase 2 should have high gaps
      expect(roadmap.phases[1].actions.length).toBeGreaterThan(0);
      // Phase 3 should have medium gaps
      expect(roadmap.phases[2].actions.length).toBeGreaterThan(0);
    });

    it('should estimate effort correctly', async () => {
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Critical Control',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Critical gap',
          evidence: [],
        },
      ];

      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);

      // Critical gaps should have high effort (120 hours)
      const phase1Actions = roadmap.phases[0].actions;
      expect(phase1Actions.length).toBeGreaterThan(0);
      expect(phase1Actions[0].estimatedHours).toBeGreaterThanOrEqual(100);
    });

    it('should generate recommendations', async () => {
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Data Protection',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Data protection controls not implemented',
          evidence: [],
        },
      ];

      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);

      expect(roadmap.recommendations.length).toBeGreaterThan(0);
      expect(roadmap.recommendations.some((r) => r.includes('critical'))).toBe(true);
    });

    it('should generate roadmap summary', async () => {
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Data Protection',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Data protection controls not implemented',
          evidence: [],
        },
      ];

      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);
      const summary = roadmapGenerator.getRoadmapSummary(roadmap);

      expect(summary).toContain('org-1');
      expect(summary).toContain('Total Compliance Gaps');
      expect(summary).toContain('Critical Gaps');
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  describe('Advanced Features Integration', () => {
    let alertingSystem: AlertingSystem;
    let roadmapGenerator: ComplianceRoadmapGenerator;

    beforeEach(() => {
      alertingSystem = new AlertingSystem();
      roadmapGenerator = new ComplianceRoadmapGenerator();
    });

    it('should trigger alerts when compliance gaps are detected', async () => {
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Data Protection',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Data protection controls not implemented',
          evidence: [],
        },
      ];

      // Generate roadmap which identifies gaps
      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);

      // Create alert for critical gap
      const alert = await alertingSystem.alertComplianceViolation(
        'org-1',
        'sys-1',
        gaps[0].requirementName,
        'critical',
        gaps[0].evidence
      );

      expect(roadmap.criticalGaps).toBe(1);
      expect(alert.severity).toBe('critical');
      expect(alert.metadata.requirement).toBe('Data Protection');
    });

    it('should coordinate alerts with roadmap remediation', async () => {
      // Create multiple alerts
      const alert1 = await alertingSystem.alertComplianceViolation('org-1', 'sys-1', 'Data Protection', 'critical', []);
      const alert2 = await alertingSystem.alertComplianceViolation('org-1', 'sys-1', 'Transparency', 'high', []);

      // Get statistics
      const stats = alertingSystem.getAlertStatistics('org-1');

      // Create roadmap to address alerts
      const gaps: ComplianceGap[] = [
        {
          requirementId: 'req-1',
          requirementName: 'Data Protection',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'critical',
          description: 'Data protection controls not implemented',
          evidence: [],
        },
        {
          requirementId: 'req-2',
          requirementName: 'Transparency',
          framework: 'EU AI Act',
          currentStatus: 'non-compliant',
          severity: 'high',
          description: 'Transparency requirements not met',
          evidence: [],
        },
      ];

      const roadmap = await roadmapGenerator.generateRoadmap('org-1', gaps, ['Compliance Officer'], 6);

      // Verify alignment
      expect(stats.critical).toBe(1);
      expect(stats.high).toBe(1);
      expect(roadmap.totalGaps).toBe(2);
      expect(roadmap.phases[0].actions.length).toBeGreaterThan(0);
    });
  });
});
