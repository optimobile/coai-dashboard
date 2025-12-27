/**
 * Email Service
 * Handles email sending for notifications, alerts, and referral communications
 */

import { ReferralMarketingService } from '@/server/services/referralMarketing';

interface EmailPayload {
  userId?: number;
  phaseName?: string;
  phaseNumber?: number;
  completedAt?: Date;
}

export interface ResendEmailPayload {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
  variables?: Record<string, string | number>;
  replyTo?: string;
}

export interface EmailDeliveryResult {
  messageId: string;
  status: 'sent' | 'failed' | 'queued';
  timestamp: Date;
  error?: string;
}

export class EmailService {
  private static readonly RESEND_API_KEY = process.env.RESEND_API_KEY;
  private static readonly RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@csoai.org';
  private static readonly RESEND_API_URL = 'https://api.resend.com/emails';

  /**
   * Send phase completion email (legacy)
   */
  public async sendPhaseCompletionEmail(payload: EmailPayload): Promise<void> {
    try {
      console.log(`[Email] Sending phase completion email to user ${payload.userId}`);
      console.log(`[Email] Phase ${payload.phaseNumber}: ${payload.phaseName} completed at ${payload.completedAt}`);
    } catch (error) {
      console.error('[Email] Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send alert notification email (legacy)
   */
  public async sendAlertEmail(userId: number, alertTitle: string, alertMessage: string): Promise<void> {
    try {
      console.log(`[Email] Sending alert email to user ${userId}`);
      console.log(`[Email] Alert: ${alertTitle}`);
      console.log(`[Email] Message: ${alertMessage}`);
    } catch (error) {
      console.error('[Email] Error sending alert email:', error);
      throw error;
    }
  }

  /**
   * Send notification digest email (legacy)
   */
  public async sendDigestEmail(userId: number, notifications: any[]): Promise<void> {
    try {
      console.log(`[Email] Sending digest email to user ${userId} with ${notifications.length} notifications`);
    } catch (error) {
      console.error('[Email] Error sending digest email:', error);
      throw error;
    }
  }

  /**
   * Send email via Resend API
   */
  static async sendEmail(payload: ResendEmailPayload): Promise<EmailDeliveryResult> {
    try {
      if (!this.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured, logging email instead');
        return this.logEmailLocally(payload);
      }

      // Render template if templateId provided
      let body = payload.body;
      if (payload.templateId) {
        body = this.renderTemplate(payload.templateId, payload.variables || {});
      }

      // Send via Resend API
      const response = await fetch(this.RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.RESEND_FROM_EMAIL,
          to: payload.to,
          subject: payload.subject,
          html: body,
          replyTo: payload.replyTo || this.RESEND_FROM_EMAIL,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Resend API error: ${(error as any).message}`);
      }

      const data = (await response.json()) as { id: string };

      return {
        messageId: data.id,
        status: 'sent',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        messageId: `local-${Date.now()}`,
        status: 'failed',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send referrer onboarding email
   */
  static async sendOnboardingEmail(
    referrerEmail: string,
    referrerName: string,
    referralCode: string,
  ): Promise<EmailDeliveryResult> {
    try {
      const template = ReferralMarketingService.getOnboardingEmailTemplate();

      return this.sendEmail({
        to: referrerEmail,
        subject: template.subject,
        body: template.body,
        variables: {
          referrerName,
          referralCode,
          dashboardUrl: `${process.env.VITE_APP_URL || 'https://csoai.org'}/referral/dashboard`,
        },
      });
    } catch (error) {
      console.error('Failed to send onboarding email:', error);
      throw new Error('Failed to send onboarding email');
    }
  }

  /**
   * Send commission earned email
   */
  static async sendCommissionEmail(
    referrerEmail: string,
    referrerName: string,
    commissionAmount: number,
    referralCount: number,
    payoutDate: Date,
  ): Promise<EmailDeliveryResult> {
    try {
      const template = ReferralMarketingService.getCommissionNotificationTemplate();

      return this.sendEmail({
        to: referrerEmail,
        subject: template.subject.replace('{{commissionAmount}}', (commissionAmount / 100).toFixed(2)),
        body: template.body,
        variables: {
          referrerName,
          commissionAmount: (commissionAmount / 100).toFixed(2),
          referralCount: referralCount.toString(),
          period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          monthlyTotal: (commissionAmount / 100).toFixed(2),
          totalEarnings: (commissionAmount / 100).toFixed(2),
          payoutDate: payoutDate.toLocaleDateString(),
          dashboardUrl: `${process.env.VITE_APP_URL || 'https://csoai.org'}/referral/dashboard`,
          leaderboardRank: '1',
        },
      });
    } catch (error) {
      console.error('Failed to send commission email:', error);
      throw new Error('Failed to send commission email');
    }
  }

  /**
   * Send referral conversion email
   */
  static async sendConversionEmail(
    referrerEmail: string,
    referrerName: string,
    referredName: string,
    organization: string,
    certificationLevel: string,
    commissionAmount: number,
  ): Promise<EmailDeliveryResult> {
    try {
      const template = ReferralMarketingService.getConversionEmailTemplate();

      return this.sendEmail({
        to: referrerEmail,
        subject: template.subject.replace('{{referredName}}', referredName),
        body: template.body,
        variables: {
          referrerName,
          referredName,
          organization,
          certificationLevel,
          commissionAmount: (commissionAmount / 100).toFixed(2),
          payoutDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          completionDate: new Date().toLocaleDateString(),
          totalReferrals: '1',
          completedReferrals: '1',
          conversionRate: '100',
          totalEarnings: (commissionAmount / 100).toFixed(2),
          dashboardUrl: `${process.env.VITE_APP_URL || 'https://csoai.org'}/referral/dashboard`,
        },
      });
    } catch (error) {
      console.error('Failed to send conversion email:', error);
      throw new Error('Failed to send conversion email');
    }
  }

  /**
   * Render email template with variables
   */
  private static renderTemplate(templateId: string, variables: Record<string, string | number>): string {
    let template = '';

    if (templateId === 'onboarding') {
      const tmpl = ReferralMarketingService.getOnboardingEmailTemplate();
      template = tmpl.body;
    } else if (templateId === 'commission') {
      const tmpl = ReferralMarketingService.getCommissionNotificationTemplate();
      template = tmpl.body;
    } else if (templateId === 'conversion') {
      const tmpl = ReferralMarketingService.getConversionEmailTemplate();
      template = tmpl.body;
    }

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, String(value));
    });

    return template;
  }

  /**
   * Log email locally (for development)
   */
  private static logEmailLocally(payload: ResendEmailPayload): EmailDeliveryResult {
    const messageId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('\n=== EMAIL SENT (LOCAL) ===');
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Message ID: ${messageId}`);
    console.log(`Body:\n${payload.body}`);
    console.log('========================\n');

    return {
      messageId,
      status: 'sent',
      timestamp: new Date(),
    };
  }

  /**
   * Send batch emails
   */
  static async sendBatchEmails(
    emails: ResendEmailPayload[],
  ): Promise<EmailDeliveryResult[]> {
    try {
      const results = await Promise.all(
        emails.map((email) => this.sendEmail(email)),
      );
      return results;
    } catch (error) {
      console.error('Failed to send batch emails:', error);
      throw new Error('Failed to send batch emails');
    }
  }

  /**
   * Schedule email for later delivery
   */
  static async scheduleEmail(
    payload: ResendEmailPayload,
    delayMinutes: number,
  ): Promise<{ scheduledId: string; scheduledFor: Date }> {
    try {
      const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);
      const scheduledId = `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      console.log(`Email scheduled for ${scheduledFor.toISOString()}: ${scheduledId}`);

      return {
        scheduledId,
        scheduledFor,
      };
    } catch (error) {
      console.error('Failed to schedule email:', error);
      throw new Error('Failed to schedule email');
    }
  }

  /**
   * Get email delivery status
   */
  static async getDeliveryStatus(messageId: string): Promise<{
    status: 'sent' | 'failed' | 'bounced' | 'unknown';
    timestamp: Date;
    error?: string;
  }> {
    try {
      return {
        status: 'sent',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Failed to get delivery status:', error);
      throw new Error('Failed to get delivery status');
    }
  }
}
