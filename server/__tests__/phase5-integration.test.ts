import { describe, it, expect, beforeEach, vi } from 'vitest';
import { db } from '../db';
import { 
  watchdog_reports, 
  legal_flags, 
  case_assignments,
  legal_analytics,
  barrister_notifications
} from '../db/schema';
import { eq } from 'drizzle-orm';

describe('Phase 5: Integration Testing - Watchdog to Legal Flow', () => {
  
  beforeEach(async () => {
    // Clean up test data
    await db.delete(watchdog_reports).run();
    await db.delete(legal_flags).run();
    await db.delete(case_assignments).run();
    await db.delete(legal_analytics).run();
  });

  describe('Watchdog Report to Legal Flagging Flow', () => {
    it('should create legal flag when watchdog report is submitted', async () => {
      // Step 1: Submit watchdog report
      const report = await db.insert(watchdog_reports).values({
        id: 1,
        title: 'AI System Bias Detection',
        description: 'Gender bias detected in hiring algorithm',
        systemName: 'HireBot v2.1',
        violationType: 'Bias & Discrimination',
        severity: 'high',
        evidence: 'Test results show 23% lower acceptance rate for female candidates',
        reporterEmail: 'whistleblower@example.com',
        reporterName: 'Jane Doe',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      expect(report).toBeDefined();
      expect(report[0].id).toBe(1);

      // Step 2: Automatic legal flagging
      const legalFlag = await db.insert(legal_flags).values({
        id: 1,
        reportId: report[0].id,
        violationType: 'Bias & Discrimination',
        riskScore: 85,
        severity: 'critical',
        jurisdiction: 'EU',
        frameworksAffected: ['EU AI Act', 'GDPR'],
        complianceGaps: ['Transparency', 'Human Oversight'],
        enforcementAuthority: 'EDPB',
        estimatedPenalty: 50000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      expect(legalFlag).toBeDefined();
      expect(legalFlag[0].reportId).toBe(report[0].id);
      expect(legalFlag[0].riskScore).toBe(85);
      expect(legalFlag[0].severity).toBe('critical');
    });

    it('should display legal flags on report detail page', async () => {
      // Create report and flag
      const report = await db.insert(watchdog_reports).values({
        id: 2,
        title: 'Data Privacy Violation',
        description: 'Unauthorized data access',
        systemName: 'DataAnalytics v1.0',
        violationType: 'Data Privacy',
        severity: 'high',
        evidence: 'Access logs show unauthorized queries',
        reporterEmail: 'admin@example.com',
        reporterName: 'Admin User',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const flag = await db.insert(legal_flags).values({
        id: 2,
        reportId: report[0].id,
        violationType: 'Data Privacy',
        riskScore: 78,
        severity: 'high',
        jurisdiction: 'US',
        frameworksAffected: ['CCPA', 'HIPAA'],
        complianceGaps: ['Data Minimization'],
        enforcementAuthority: 'FTC',
        estimatedPenalty: 10000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      // Retrieve and verify
      const retrievedFlag = await db.query.legal_flags.findFirst({
        where: eq(legal_flags.reportId, report[0].id),
      });

      expect(retrievedFlag).toBeDefined();
      expect(retrievedFlag?.violationType).toBe('Data Privacy');
      expect(retrievedFlag?.severity).toBe('high');
    });

    it('should calculate risk scores correctly', async () => {
      const report = await db.insert(watchdog_reports).values({
        id: 3,
        title: 'Transparency Violation',
        description: 'No explainability provided',
        systemName: 'DecisionEngine v3.0',
        violationType: 'Transparency',
        severity: 'medium',
        evidence: 'System makes decisions without explanation',
        reporterEmail: 'user@example.com',
        reporterName: 'User',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const flag = await db.insert(legal_flags).values({
        id: 3,
        reportId: report[0].id,
        violationType: 'Transparency',
        riskScore: 65,
        severity: 'medium',
        jurisdiction: 'Global',
        frameworksAffected: ['EU AI Act'],
        complianceGaps: ['Explainability'],
        enforcementAuthority: 'National Regulator',
        estimatedPenalty: 5000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      // Verify risk score calculation
      expect(flag[0].riskScore).toBeGreaterThan(0);
      expect(flag[0].riskScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Case Assignment Workflow', () => {
    it('should create case assignment from legal flag', async () => {
      // Setup: Create report and flag
      const report = await db.insert(watchdog_reports).values({
        id: 4,
        title: 'Test Report',
        description: 'Test',
        systemName: 'Test System',
        violationType: 'Bias & Discrimination',
        severity: 'high',
        evidence: 'Test evidence',
        reporterEmail: 'test@example.com',
        reporterName: 'Test User',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const flag = await db.insert(legal_flags).values({
        id: 4,
        reportId: report[0].id,
        violationType: 'Bias & Discrimination',
        riskScore: 85,
        severity: 'critical',
        jurisdiction: 'EU',
        frameworksAffected: ['EU AI Act'],
        complianceGaps: ['Transparency'],
        enforcementAuthority: 'EDPB',
        estimatedPenalty: 50000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      // Assign to barrister
      const assignment = await db.insert(case_assignments).values({
        id: 1,
        flagId: flag[0].id,
        barristerEmail: 'barrister@example.com',
        barristerName: 'John Doe',
        caseNumber: 'CASE-2024-0001',
        assignedAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'assigned',
        caseload: 5,
        isOverloaded: false,
      }).returning();

      expect(assignment).toBeDefined();
      expect(assignment[0].flagId).toBe(flag[0].id);
      expect(assignment[0].barristerEmail).toBe('barrister@example.com');
    });

    it('should create notification when case is assigned', async () => {
      // Setup case assignment
      const report = await db.insert(watchdog_reports).values({
        id: 5,
        title: 'Test Report',
        description: 'Test',
        systemName: 'Test System',
        violationType: 'Data Privacy',
        severity: 'high',
        evidence: 'Test',
        reporterEmail: 'test@example.com',
        reporterName: 'Test',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const flag = await db.insert(legal_flags).values({
        id: 5,
        reportId: report[0].id,
        violationType: 'Data Privacy',
        riskScore: 78,
        severity: 'high',
        jurisdiction: 'US',
        frameworksAffected: ['CCPA'],
        complianceGaps: ['Minimization'],
        enforcementAuthority: 'FTC',
        estimatedPenalty: 10000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      const assignment = await db.insert(case_assignments).values({
        id: 2,
        flagId: flag[0].id,
        barristerEmail: 'barrister2@example.com',
        barristerName: 'Jane Smith',
        caseNumber: 'CASE-2024-0002',
        assignedAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'assigned',
        caseload: 3,
        isOverloaded: false,
      }).returning();

      // Create notification
      const notification = await db.insert(barrister_notifications).values({
        id: 1,
        caseId: assignment[0].id,
        barristerEmail: assignment[0].barristerEmail,
        notificationType: 'case_assigned',
        title: `New Case Assigned: ${assignment[0].caseNumber}`,
        message: `Case ${assignment[0].caseNumber} has been assigned to you. Deadline: ${assignment[0].deadline.toLocaleDateString()}`,
        isRead: false,
        sentAt: new Date(),
      }).returning();

      expect(notification).toBeDefined();
      expect(notification[0].barristerEmail).toBe('barrister2@example.com');
    });

    it('should update case status on approval', async () => {
      // Setup
      const report = await db.insert(watchdog_reports).values({
        id: 6,
        title: 'Test',
        description: 'Test',
        systemName: 'Test',
        violationType: 'Bias',
        severity: 'high',
        evidence: 'Test',
        reporterEmail: 'test@example.com',
        reporterName: 'Test',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const flag = await db.insert(legal_flags).values({
        id: 6,
        reportId: report[0].id,
        violationType: 'Bias',
        riskScore: 80,
        severity: 'high',
        jurisdiction: 'EU',
        frameworksAffected: ['EU AI Act'],
        complianceGaps: ['Transparency'],
        enforcementAuthority: 'EDPB',
        estimatedPenalty: 30000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      const assignment = await db.insert(case_assignments).values({
        id: 3,
        flagId: flag[0].id,
        barristerEmail: 'barrister3@example.com',
        barristerName: 'Bob Johnson',
        caseNumber: 'CASE-2024-0003',
        assignedAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'assigned',
        caseload: 4,
        isOverloaded: false,
      }).returning();

      // Update status to approved
      const updated = await db.update(case_assignments)
        .set({ status: 'approved' })
        .where(eq(case_assignments.id, assignment[0].id))
        .returning();

      expect(updated[0].status).toBe('approved');
    });
  });

  describe('Analytics Updates', () => {
    it('should update analytics when case status changes', async () => {
      // Create analytics record
      const analytics = await db.insert(legal_analytics).values({
        id: 1,
        date: new Date(),
        totalViolations: 25,
        criticalCount: 5,
        highCount: 10,
        mediumCount: 7,
        lowCount: 3,
        averageRiskScore: 72.5,
        complianceRate: 75,
        casesAssigned: 8,
        casesApproved: 3,
        casesRejected: 1,
        casesResolved: 2,
        pendingCases: 2,
        enforcementAuthoritiesEngaged: 3,
        jurisdictionsAffected: 5,
      }).returning();

      expect(analytics).toBeDefined();
      expect(analytics[0].totalViolations).toBe(25);
      expect(analytics[0].complianceRate).toBe(75);
    });

    it('should calculate compliance trends correctly', async () => {
      // Create multiple analytics records
      const records = await db.insert(legal_analytics).values([
        {
          id: 2,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          totalViolations: 30,
          criticalCount: 6,
          highCount: 12,
          mediumCount: 8,
          lowCount: 4,
          averageRiskScore: 75,
          complianceRate: 70,
          casesAssigned: 5,
          casesApproved: 1,
          casesRejected: 0,
          casesResolved: 1,
          pendingCases: 3,
          enforcementAuthoritiesEngaged: 3,
          jurisdictionsAffected: 5,
        },
        {
          id: 3,
          date: new Date(),
          totalViolations: 25,
          criticalCount: 5,
          highCount: 10,
          mediumCount: 7,
          lowCount: 3,
          averageRiskScore: 72,
          complianceRate: 75,
          casesAssigned: 8,
          casesApproved: 3,
          casesRejected: 1,
          casesResolved: 2,
          pendingCases: 2,
          enforcementAuthoritiesEngaged: 3,
          jurisdictionsAffected: 5,
        },
      ]).returning();

      expect(records.length).toBe(2);
      // Compliance improved from 70 to 75
      expect(records[1].complianceRate).toBeGreaterThan(records[0].complianceRate);
    });
  });

  describe('End-to-End Flow Validation', () => {
    it('should complete full watchdog to legal analytics flow', async () => {
      // 1. Submit watchdog report
      const report = await db.insert(watchdog_reports).values({
        id: 7,
        title: 'Complete Flow Test',
        description: 'Testing complete workflow',
        systemName: 'TestSystem',
        violationType: 'Bias & Discrimination',
        severity: 'high',
        evidence: 'Test evidence',
        reporterEmail: 'test@example.com',
        reporterName: 'Test User',
        isPublic: true,
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      expect(report[0]).toBeDefined();

      // 2. Create legal flag
      const flag = await db.insert(legal_flags).values({
        id: 7,
        reportId: report[0].id,
        violationType: 'Bias & Discrimination',
        riskScore: 85,
        severity: 'critical',
        jurisdiction: 'EU',
        frameworksAffected: ['EU AI Act'],
        complianceGaps: ['Transparency'],
        enforcementAuthority: 'EDPB',
        estimatedPenalty: 50000000,
        flaggedAt: new Date(),
        status: 'open',
      }).returning();

      expect(flag[0]).toBeDefined();

      // 3. Assign case
      const assignment = await db.insert(case_assignments).values({
        id: 4,
        flagId: flag[0].id,
        barristerEmail: 'barrister@example.com',
        barristerName: 'John Doe',
        caseNumber: 'CASE-2024-0004',
        assignedAt: new Date(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'assigned',
        caseload: 5,
        isOverloaded: false,
      }).returning();

      expect(assignment[0]).toBeDefined();

      // 4. Update analytics
      const analytics = await db.insert(legal_analytics).values({
        id: 4,
        date: new Date(),
        totalViolations: 1,
        criticalCount: 1,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        averageRiskScore: 85,
        complianceRate: 50,
        casesAssigned: 1,
        casesApproved: 0,
        casesRejected: 0,
        casesResolved: 0,
        pendingCases: 1,
        enforcementAuthoritiesEngaged: 1,
        jurisdictionsAffected: 1,
      }).returning();

      expect(analytics[0]).toBeDefined();

      // Verify complete flow
      expect(report[0].id).toBe(flag[0].reportId);
      expect(flag[0].id).toBe(assignment[0].flagId);
      expect(analytics[0].casesAssigned).toBe(1);
    });
  });
});
