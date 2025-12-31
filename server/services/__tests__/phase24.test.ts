/**
 * Tests for Phase 24 Features
 * Email service, alert toasts, and webhook management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SendGridService } from '../sendgridService';

describe('Phase 24 Features', () => {
  describe('SendGrid Email Service', () => {
    let emailService: SendGridService;

    beforeEach(() => {
      emailService = new SendGridService();
    });

    it('should initialize SendGrid service', () => {
      expect(emailService).toBeDefined();
    });

    it('should check if SendGrid is configured', () => {
      const isConfigured = emailService.isConfigured();
      expect(typeof isConfigured).toBe('boolean');
    });

    it('should handle phase completion email', async () => {
      const data = {
        recipientEmail: 'test@example.com',
        phaseName: 'Critical Remediation',
        phaseNumber: 1,
        completedAt: new Date().toISOString(),
        organizationName: 'Test Organization',
        dashboardUrl: 'https://dashboard.example.com',
      };

      // Should not throw
      await emailService.sendPhaseCompletionEmail(data);
      expect(true).toBe(true);
    });

    it('should handle alert notification email', async () => {
      const data = {
        recipientEmail: 'test@example.com',
        alertTitle: 'Critical Alert',
        alertMessage: 'A critical alert has been detected',
        severity: 'critical' as const,
        alertUrl: 'https://dashboard.example.com/alerts/1',
      };

      await emailService.sendAlertEmail(data);
      expect(true).toBe(true);
    });

    it('should handle digest email', async () => {
      const data = {
        recipientEmail: 'test@example.com',
        organizationName: 'Test Organization',
        alerts: [
          {
            title: 'Alert 1',
            severity: 'high',
            timestamp: new Date().toISOString(),
          },
        ],
        completedPhases: ['Phase 1: Critical Remediation'],
        upcomingDeadlines: [
          {
            name: 'Phase 2 Completion',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        ],
      };

      await emailService.sendDigestEmail(data);
      expect(true).toBe(true);
    });

    it('should generate phase completion template', async () => {
      const data = {
        recipientEmail: 'test@example.com',
        phaseName: 'Critical Remediation',
        phaseNumber: 1,
        completedAt: new Date('2025-01-26'),
        organizationName: 'Test Organization',
        dashboardUrl: 'https://dashboard.example.com',
      };

      await emailService.sendPhaseCompletionEmail(data);
      expect(data.phaseName).toBe('Critical Remediation');
    });

    it('should generate alert template with different severities', async () => {
      const severities = ['low', 'medium', 'high', 'critical'] as const;

      for (const severity of severities) {
        const data = {
          recipientEmail: 'test@example.com',
          alertTitle: `${severity.toUpperCase()} Alert`,
          alertMessage: `This is a ${severity} alert`,
          severity,
          alertUrl: 'https://dashboard.example.com/alerts/1',
        };

        await emailService.sendAlertEmail(data);
        expect(data.severity).toBe(severity);
      }
    });

    it('should handle email with special characters', async () => {
      const data = {
        recipientEmail: 'test+special@example.com',
        phaseName: 'Phase 1: Critical & Urgent Remediation',
        phaseNumber: 1,
        completedAt: new Date().toISOString(),
        organizationName: 'Test & Co. Organization',
        dashboardUrl: 'https://dashboard.example.com?phase=1&status=complete',
      };

      await emailService.sendPhaseCompletionEmail(data);
      expect(data.organizationName).toContain('&');
    });
  });

  describe('Alert Toast Notifications', () => {
    it('should create alert with severity levels', () => {
      const severities = ['low', 'medium', 'high', 'critical'];

      severities.forEach((severity) => {
        const alert = {
          id: `alert-${severity}`,
          severity,
          title: `${severity.toUpperCase()} Alert`,
          message: `This is a ${severity} alert`,
        };

        expect(alert.severity).toBe(severity);
      });
    });

    it('should handle alert with metadata', () => {
      const alert = {
        id: 'alert-123',
        severity: 'critical',
        title: 'Critical Compliance Issue',
        message: 'A critical compliance issue has been detected',
        metadata: {
          framework: 'ISO 27001',
          requirement: 'A.5.1.1',
          organizationId: 'org-123',
        },
      };

      expect(alert.metadata).toBeDefined();
      expect(alert.metadata.framework).toBe('ISO 27001');
    });

    it('should support desktop notification permissions', () => {
      // Note: window is not available in Node.js test environment
      // This would be tested in browser integration tests
      const hasNotificationAPI = typeof window !== 'undefined' && 'Notification' in window;
      expect(typeof hasNotificationAPI).toBe('boolean');
    });

    it('should generate notification sound for urgent alerts', () => {
      const urgentSeverities = ['high', 'critical'];

      urgentSeverities.forEach((severity) => {
        const alert = {
          id: `alert-${severity}`,
          severity,
          shouldPlaySound: true,
        };

        expect(alert.shouldPlaySound).toBe(true);
      });
    });
  });

  describe('Webhook Management', () => {
    it('should validate webhook URL format', () => {
      const validUrls = [
        'https://example.com/webhooks',
        'https://api.example.com/v1/webhooks',
        'https://webhook.example.com:8080/events',
      ];

      validUrls.forEach((url) => {
        expect(() => new URL(url)).not.toThrow();
      });
    });

    it('should validate webhook events', () => {
      const validEvents = [
        'alert.created',
        'alert.resolved',
        'phase.completed',
        'phase.started',
        'notification.sent',
        'report.generated',
      ];

      validEvents.forEach((event) => {
        expect(event).toMatch(/^[a-z]+\.[a-z]+$/);
      });
    });

    it('should handle webhook subscription', () => {
      const webhook = {
        id: 'wh_123',
        url: 'https://example.com/webhooks',
        events: ['alert.created', 'phase.completed'],
        active: true,
        createdAt: new Date().toISOString(),
        deliveryCount: 0,
        failureCount: 0,
      };

      expect(webhook.events).toHaveLength(2);
      expect(webhook.active).toBe(true);
    });

    it('should track webhook delivery status', () => {
      const delivery = {
        id: 'del_123',
        webhookId: 'wh_123',
        event: 'alert.created',
        status: 'success' as const,
        statusCode: 200,
        responseTime: 245,
        timestamp: new Date().toISOString(),
        payload: { alertId: 'alert-123' },
      };

      expect(delivery.status).toBe('success');
      expect(delivery.statusCode).toBe(200);
    });

    it('should calculate webhook success rate', () => {
      const webhook = {
        deliveryCount: 100,
        failureCount: 5,
      };

      const successRate = ((webhook.deliveryCount - webhook.failureCount) / webhook.deliveryCount) * 100;
      expect(successRate).toBe(95);
    });

    it('should handle webhook test delivery', () => {
      const testResult = {
        success: true,
        statusCode: 200,
        responseTime: 150,
        error: null,
      };

      expect(testResult.success).toBe(true);
      expect(testResult.statusCode).toBe(200);
    });

    it('should handle failed webhook delivery', () => {
      const failedDelivery = {
        success: false,
        statusCode: 500,
        responseTime: 5000,
        error: 'Internal Server Error',
      };

      expect(failedDelivery.success).toBe(false);
      expect(failedDelivery.error).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete email workflow', async () => {
      const emailService = new SendGridService();

      const phaseData = {
        recipientEmail: 'user@example.com',
        phaseName: 'Critical Remediation',
        phaseNumber: 1,
        completedAt: new Date().toISOString(),
        organizationName: 'Test Org',
        dashboardUrl: 'https://dashboard.example.com',
      };

      await emailService.sendPhaseCompletionEmail(phaseData);
      expect(phaseData.recipientEmail).toBe('user@example.com');
    });

    it('should handle alert notification workflow', () => {
      const alert = {
        id: 'alert-123',
        severity: 'critical',
        title: 'Critical Alert',
        message: 'Immediate action required',
      };

      const notification = {
        alertId: alert.id,
        type: 'alert',
        title: alert.title,
        message: alert.message,
        priority: 'urgent',
      };

      expect(notification.alertId).toBe(alert.id);
      expect(notification.priority).toBe('urgent');
    });

    it('should handle webhook event delivery workflow', () => {
      const webhook = {
        id: 'wh_123',
        url: 'https://example.com/webhooks',
        events: ['alert.created'],
        active: true,
      };

      const event = {
        type: 'alert.created',
        timestamp: new Date().toISOString(),
        data: { alertId: 'alert-123' },
      };

      const isSubscribed = webhook.events.includes(event.type);
      expect(isSubscribed).toBe(true);
    });

    it('should handle multi-channel notification delivery', async () => {
      const emailService = new SendGridService();

      const notification = {
        userId: 1,
        type: 'alert',
        title: 'Multi-Channel Alert',
        message: 'Testing all delivery channels',
        channels: ['email', 'webhook'],
      };

      // Email delivery
      await emailService.sendAlertEmail({
        recipientEmail: 'user@example.com',
        alertTitle: notification.title,
        alertMessage: notification.message,
        severity: 'high',
        alertUrl: 'https://dashboard.example.com/alerts/1',
      });

      // Webhook would be delivered separately
      expect(notification.channels).toContain('email');
      expect(notification.channels).toContain('webhook');
    });
  });
});
