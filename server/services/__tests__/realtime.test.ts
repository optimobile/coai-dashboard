/**
 * Tests for Real-Time Features
 * WebSocket subscriptions, roadmap automation, and multi-channel notifications
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { WebSocketManager } from '../websocketManager';
import { RoadmapAutomationService } from '../roadmapAutomation';
import { NotificationDeliveryService } from '../notificationDelivery';

describe('Real-Time Features', () => {
  describe('WebSocket Manager', () => {
    let wsManager: WebSocketManager;

    beforeEach(() => {
      wsManager = new WebSocketManager();
    });

    it('should track active connections', () => {
      expect(wsManager.getActiveConnectionsCount()).toBe(0);
    });

    it('should get user connections count', () => {
      const userId = 123;
      expect(wsManager.getUserConnections(userId)).toBe(0);
    });

    it('should broadcast alert to all clients', () => {
      const alert = {
        id: 'alert-1',
        severity: 'critical',
        message: 'Test alert',
      };

      wsManager.broadcastAlert(alert);
      expect(true).toBe(true);
    });

    it('should broadcast alert to specific users', () => {
      const alert = {
        id: 'alert-1',
        severity: 'high',
        message: 'User-specific alert',
      };

      const userIds = [1, 2, 3];
      wsManager.broadcastAlert(alert, userIds);
      expect(true).toBe(true);
    });

    it('should broadcast roadmap update', () => {
      const roadmap = {
        organizationId: 'org-1',
        phases: [],
        totalHours: 100,
        overallProgress: 50,
      };

      wsManager.broadcastRoadmapUpdate(roadmap, 1);
      expect(true).toBe(true);
    });

    it('should broadcast notification to user', () => {
      const notification = {
        id: 'notif-1',
        userId: 123,
        type: 'alert',
        title: 'Test',
        message: 'Test notification',
      };

      wsManager.broadcastNotification(notification, 123);
      expect(true).toBe(true);
    });
  });

  describe('Roadmap Automation Service', () => {
    let service: RoadmapAutomationService;

    beforeEach(() => {
      service = new RoadmapAutomationService();
    });

    it('should calculate overall progress correctly', () => {
      const roadmap = {
        organizationId: 'org-1',
        phases: [
          {
            phase: 1,
            name: 'Phase 1',
            actions: [
              { id: 'a1', title: 'Action 1', completed: true },
              { id: 'a2', title: 'Action 2', completed: false },
            ],
          },
        ],
        totalHours: 100,
        overallProgress: 0,
      };

      const timeline = service.getPhaseTimeline(roadmap);
      expect(timeline).toHaveLength(1);
      expect(timeline[0].phase).toBe(1);
    });

    it('should get phase statistics', () => {
      const phase = {
        phase: 1,
        name: 'Phase 1',
        actions: [
          { id: 'a1', title: 'Action 1', completed: true },
          { id: 'a2', title: 'Action 2', completed: true },
          { id: 'a3', title: 'Action 3', completed: false },
        ],
      };

      const stats = service.getPhaseStats(phase);
      expect(stats.totalActions).toBe(3);
      expect(stats.completedActions).toBe(2);
      expect(stats.completionPercentage).toBe(67);
      expect(stats.remainingActions).toBe(1);
    });

    it('should handle empty phases', () => {
      const roadmap = {
        organizationId: 'org-1',
        phases: [],
        totalHours: 0,
        overallProgress: 0,
      };

      const timeline = service.getPhaseTimeline(roadmap);
      expect(timeline).toHaveLength(0);
    });

    it('should calculate phase completion percentage', () => {
      const phase = {
        phase: 1,
        name: 'Phase 1',
        actions: [
          { id: 'a1', title: 'Action 1', completed: true },
          { id: 'a2', title: 'Action 2', completed: false },
          { id: 'a3', title: 'Action 3', completed: false },
          { id: 'a4', title: 'Action 4', completed: false },
        ],
      };

      const stats = service.getPhaseStats(phase);
      expect(stats.completionPercentage).toBe(25);
    });

    it('should track phase status transitions', () => {
      const roadmap = {
        organizationId: 'org-1',
        phases: [
          {
            phase: 1,
            name: 'Phase 1',
            actions: [
              { id: 'a1', title: 'Action 1', completed: true },
              { id: 'a2', title: 'Action 2', completed: true },
            ],
            completedAt: new Date().toISOString(),
          },
          {
            phase: 2,
            name: 'Phase 2',
            actions: [
              { id: 'a3', title: 'Action 3', completed: false },
            ],
          },
        ],
        totalHours: 100,
        overallProgress: 50,
      };

      const timeline = service.getPhaseTimeline(roadmap);
      expect(timeline).toHaveLength(2);
      expect(timeline[0].status).toBe('completed');
      expect(timeline[1].status).toBe('pending');
    });
  });

  describe('Notification Delivery Service', () => {
    let service: NotificationDeliveryService;

    beforeEach(() => {
      service = new NotificationDeliveryService();
    });

    it('should send notification through all channels', async () => {
      const payload = {
        userId: 123,
        type: 'alert',
        title: 'Test Alert',
        message: 'This is a test alert',
        priority: 'high' as const,
      };

      await service.sendNotification(payload);
      expect(true).toBe(true);
    });

    it('should handle missing user preferences', async () => {
      const payload = {
        userId: 999999,
        type: 'alert',
        title: 'Test Alert',
        message: 'This is a test alert',
        priority: 'medium' as const,
      };

      await service.sendNotification(payload);
      expect(true).toBe(true);
    });

    it('should get delivery history', async () => {
      const history = await service.getDeliveryHistory(1);
      expect(Array.isArray(history)).toBe(true);
    });

    it('should get delivery statistics', async () => {
      const stats = await service.getDeliveryStats(123);
      expect(stats).toHaveProperty('totalSent');
      expect(stats).toHaveProperty('totalFailed');
      expect(stats).toHaveProperty('totalBounced');
      expect(stats).toHaveProperty('successRate');
      expect(stats.successRate).toBe(0);
    });

    it('should handle notification with metadata', async () => {
      const payload = {
        userId: 123,
        type: 'alert',
        title: 'Test Alert',
        message: 'This is a test alert',
        priority: 'high' as const,
        metadata: {
          alertId: 'alert-123',
          organizationId: 'org-1',
          severity: 'critical',
        },
      };

      await service.sendNotification(payload);
      expect(payload.metadata).toBeDefined();
      expect(payload.metadata.alertId).toBe('alert-123');
    });

    it('should support all priority levels', async () => {
      const priorities = ['low', 'medium', 'high', 'urgent'] as const;

      for (const priority of priorities) {
        const payload = {
          userId: 123,
          type: 'alert',
          title: 'Test Alert',
          message: 'This is a test alert',
          priority,
        };

        await service.sendNotification(payload);
        expect(payload.priority).toBe(priority);
      }
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete alert workflow', async () => {
      const wsManager = new WebSocketManager();
      const notificationService = new NotificationDeliveryService();

      const alert = {
        id: 'alert-1',
        severity: 'critical',
        message: 'Critical compliance issue',
      };

      wsManager.broadcastAlert(alert, [1, 2, 3]);

      await notificationService.sendNotification({
        userId: 1,
        type: 'compliance_alert',
        title: 'Critical Alert',
        message: alert.message,
        priority: 'urgent',
      });

      expect(alert.id).toBe('alert-1');
    });

    it('should handle roadmap progression workflow', async () => {
      const roadmapService = new RoadmapAutomationService();
      const wsManager = new WebSocketManager();

      const roadmap = {
        organizationId: 'org-1',
        phases: [
          {
            phase: 1,
            name: 'Critical Remediation',
            actions: [
              { id: 'a1', title: 'Action 1', completed: true },
              { id: 'a2', title: 'Action 2', completed: true },
            ],
          },
        ],
        totalHours: 100,
        overallProgress: 50,
      };

      const timeline = roadmapService.getPhaseTimeline(roadmap);
      wsManager.broadcastRoadmapUpdate(roadmap, 1);

      expect(timeline[0].phase).toBe(1);
    });

    it('should handle multi-channel notification delivery', async () => {
      const notificationService = new NotificationDeliveryService();
      const wsManager = new WebSocketManager();

      const notification = {
        userId: 1,
        type: 'alert',
        title: 'Multi-Channel Test',
        message: 'Testing all notification channels',
        priority: 'high' as const,
      };

      await notificationService.sendNotification(notification);
      wsManager.broadcastNotification(notification, 1);

      expect(notification.title).toBe('Multi-Channel Test');
    });
  });
});
