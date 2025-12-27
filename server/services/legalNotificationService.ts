/**
 * Legal Notification Service
 * Handles email alerts, case assignments, and status updates for legal team
 */

import { Resend } from 'resend';

export interface CaseAssignmentNotification {
  caseId: number;
  flagId: number;
  barristerEmail: string;
  barristerName: string;
  violationType: string;
  riskScore: number;
  summary: string;
  deadline: Date;
  actionUrl: string;
}

export interface CaseStatusNotification {
  caseId: number;
  barristerEmail: string;
  barristerName: string;
  status: 'approved' | 'rejected' | 'pending' | 'in_review';
  feedback?: string;
  actionUrl: string;
}

export interface UrgentAlertNotification {
  barristerEmail: string;
  barristerName: string;
  alertType: string;
  description: string;
  caseCount: number;
  actionUrl: string;
}

export class LegalNotificationService {
  private static resend = new Resend(process.env.RESEND_API_KEY);
  private static readonly FROM_EMAIL = 'legal@csoai.org';
  private static readonly SUPPORT_EMAIL = 'support@csoai.org';

  /**
   * Send case assignment notification to barrister
   */
  static async notifyCaseAssignment(
    notification: CaseAssignmentNotification
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const riskLevel = this.getRiskLevel(notification.riskScore);
      const html = this.generateCaseAssignmentEmail(notification, riskLevel);

      const result = await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: notification.barristerEmail,
        subject: `[${riskLevel}] New Legal Case Assigned: ${notification.violationType}`,
        html,
        replyTo: this.SUPPORT_EMAIL,
      });

      if (result.error) {
        console.error('Failed to send case assignment email:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Error sending case assignment notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send case status update notification
   */
  static async notifyCaseStatusUpdate(
    notification: CaseStatusNotification
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const statusLabel = this.getStatusLabel(notification.status);
      const html = this.generateStatusUpdateEmail(notification, statusLabel);

      const result = await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: notification.barristerEmail,
        subject: `Case Status Update: ${statusLabel}`,
        html,
        replyTo: this.SUPPORT_EMAIL,
      });

      if (result.error) {
        console.error('Failed to send status update email:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Error sending status update notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send urgent alert for critical cases
   */
  static async sendUrgentAlert(
    notification: UrgentAlertNotification
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = this.generateUrgentAlertEmail(notification);

      const result = await this.resend.emails.send({
        from: this.FROM_EMAIL,
        to: notification.barristerEmail,
        subject: `🚨 URGENT: ${notification.alertType} - Immediate Action Required`,
        html,
        replyTo: this.SUPPORT_EMAIL,
      });

      if (result.error) {
        console.error('Failed to send urgent alert email:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error('Error sending urgent alert:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send bulk notification to multiple barristers
   */
  static async sendBulkNotification(
    emails: string[],
    subject: string,
    html: string
  ): Promise<{ success: boolean; sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        const result = await this.resend.emails.send({
          from: this.FROM_EMAIL,
          to: email,
          subject,
          html,
          replyTo: this.SUPPORT_EMAIL,
        });

        if (result.error) {
          failed++;
        } else {
          sent++;
        }
      } catch (error) {
        failed++;
      }
    }

    return { success: failed === 0, sent, failed };
  }

  /**
   * Generate HTML email for case assignment
   */
  private static generateCaseAssignmentEmail(
    notification: CaseAssignmentNotification,
    riskLevel: string
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Legal Case Assigned</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Case ID: #${notification.caseId}</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0;">
          <p style="margin-top: 0;">Dear ${notification.barristerName},</p>
          
          <p>A new legal case has been assigned to you for review and action.</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Violation Type:</strong> ${notification.violationType}</p>
            <p style="margin: 0 0 10px 0;"><strong>Risk Score:</strong> <span style="background: ${this.getRiskColor(notification.riskScore)}; color: white; padding: 2px 8px; border-radius: 4px;">${notification.riskScore}/100</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Risk Level:</strong> ${riskLevel}</p>
            <p style="margin: 0;"><strong>Summary:</strong> ${notification.summary}</p>
          </div>
          
          <p><strong>Action Required By:</strong> ${notification.deadline.toLocaleDateString()}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${notification.actionUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Review Case</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; margin: 0;">
            This is an automated notification from CSOAI Legal System. 
            For questions, contact ${this.SUPPORT_EMAIL}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML email for status updates
   */
  private static generateStatusUpdateEmail(
    notification: CaseStatusNotification,
    statusLabel: string
  ): string {
    const statusColor = this.getStatusColor(notification.status);
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Case Status Update</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Case ID: #${notification.caseId}</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0;">
          <p style="margin-top: 0;">Dear ${notification.barristerName},</p>
          
          <p>Your case has been updated with a new status.</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid ${statusColor}; margin: 20px 0;">
            <p style="margin: 0;"><strong>New Status:</strong> <span style="background: ${statusColor}; color: white; padding: 4px 10px; border-radius: 4px;">${statusLabel}</span></p>
            ${notification.feedback ? `<p style="margin: 10px 0 0 0;"><strong>Feedback:</strong> ${notification.feedback}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${notification.actionUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Case Details</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; margin: 0;">
            This is an automated notification from CSOAI Legal System. 
            For questions, contact ${this.SUPPORT_EMAIL}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML email for urgent alerts
   */
  private static generateUrgentAlertEmail(
    notification: UrgentAlertNotification
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚨 URGENT ALERT</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">${notification.alertType}</p>
        </div>
        
        <div style="padding: 30px; background: #fff3e0; border: 1px solid #ffb74d;">
          <p style="margin-top: 0; color: #d32f2f; font-weight: bold;">Immediate Action Required</p>
          
          <p>Dear ${notification.barristerName},</p>
          
          <p>${notification.description}</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #d32f2f; margin: 20px 0;">
            <p style="margin: 0;"><strong>Cases Requiring Attention:</strong> ${notification.caseCount}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${notification.actionUrl}" style="background: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 16px;">TAKE ACTION NOW</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ffb74d; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666; margin: 0;">
            This is an urgent automated notification from CSOAI Legal System. 
            For immediate assistance, contact ${this.SUPPORT_EMAIL}
          </p>
        </div>
      </div>
    `;
  }

  /**
   * Helper: Get risk level label
   */
  private static getRiskLevel(score: number): string {
    if (score >= 90) return 'CRITICAL';
    if (score >= 70) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Helper: Get risk color
   */
  private static getRiskColor(score: number): string {
    if (score >= 90) return '#d32f2f'; // red
    if (score >= 70) return '#f57c00'; // orange
    if (score >= 50) return '#fbc02d'; // yellow
    return '#388e3c'; // green
  }

  /**
   * Helper: Get status label
   */
  private static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending Review',
      in_review: 'In Review',
    };
    return labels[status] || status;
  }

  /**
   * Helper: Get status color
   */
  private static getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      approved: '#388e3c', // green
      rejected: '#d32f2f', // red
      pending: '#fbc02d', // yellow
      in_review: '#1976d2', // blue
    };
    return colors[status] || '#666';
  }
}
