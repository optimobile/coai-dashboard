/**
 * Stripe Referral Payout Service
 * Manages commission calculations, payout processing, and webhook handling
 */

import Stripe from 'stripe';
import { db } from '../db';
import { commissions } from '../../drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface PayoutConfig {
  referrerId: string;
  referralId: number;
  courseId?: number;
  commissionRate: number; // percentage
  commissionAmount: number; // in cents
}

export interface PayoutResult {
  payoutId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledDate: Date;
  completedDate?: Date;
}

/**
 * Stripe Payout Service
 * Manages monthly commission payouts via Stripe Connect
 */
export class StripePayoutService {
  private static readonly PAYOUT_THRESHOLD_CENTS = 5000; // $50 minimum
  private static readonly PAYOUT_DAY_OF_MONTH = 1; // First day of month

  /**
   * Create a commission record for a referral
   */
  static async createCommission(config: PayoutConfig): Promise<number> {
    try {
      const result = await db.insert(commissions).values({
        referrerId: config.referrerId,
        referralId: config.referralId,
        courseId: config.courseId,
        commissionRate: config.commissionRate,
        commissionAmount: config.commissionAmount,
        status: 'earned',
        createdAt: new Date().toISOString(),
      });

      return result[0];
    } catch (error) {
      console.error('Failed to create commission:', error);
      throw new Error('Failed to create commission');
    }
  }

  /**
   * Calculate total pending commissions for a referrer
   */
  static async calculatePendingCommissions(referrerId: string): Promise<number> {
    try {
      const pendingCommissions = await db.query.commissions.findMany({
        where: and(
          eq(commissions.referrerId, referrerId),
          eq(commissions.status, 'earned'),
        ),
      });

      return pendingCommissions.reduce((sum: number, c: any) => sum + (c.commissionAmount || 0), 0);
    } catch (error) {
      console.error('Failed to calculate pending commissions:', error);
      throw new Error('Failed to calculate pending commissions');
    }
  }

  /**
   * Process monthly payouts for all eligible referrers
   */
  static async processMonthlyPayouts(): Promise<PayoutResult[]> {
    try {
      const results: PayoutResult[] = [];

      // Get all unique referrers with pending commissions
      const allCommissions = await db.query.commissions.findMany({
        where: eq(commissions.status, 'earned'),
      });

      const referrerMap = new Map<string, number>();
      allCommissions.forEach((c: any) => {
        const current = referrerMap.get(c.referrerId) || 0;
        referrerMap.set(c.referrerId, current + (c.commissionAmount || 0));
      });

      // Process payouts for referrers meeting threshold
      for (const [referrerId, totalAmount] of referrerMap.entries()) {
        if (totalAmount >= this.PAYOUT_THRESHOLD_CENTS) {
          const result = await this.processPayout(referrerId, totalAmount);
          results.push(result);
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to process monthly payouts:', error);
      throw new Error('Failed to process monthly payouts');
    }
  }

  /**
   * Process a single payout for a referrer
   */
  static async processPayout(referrerId: string, amount: number): Promise<PayoutResult> {
    try {
      // Create Stripe payout
      const payout = await stripe.payouts.create({
        amount,
        currency: 'usd',
        method: 'instant', // Instant payout for referrers
        description: `CSOAI Referral Commission - ${referrerId}`,
      });

      const payoutId = payout.id;

      // Update all earned commissions for this referrer to pending
      await db
        .update(commissions)
        .set({
          status: 'pending',
          payoutId,
        })
        .where(and(
          eq(commissions.referrerId, referrerId),
          eq(commissions.status, 'earned'),
        ));

      return {
        payoutId,
        amount,
        status: 'processing',
        scheduledDate: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to process payout:', error);

      // Update commissions to failed status
      await db
        .update(commissions)
        .set({
          status: 'failed',
        })
        .where(and(
          eq(commissions.referrerId, referrerId),
          eq(commissions.status, 'pending'),
        ));

      throw new Error('Failed to process payout');
    }
  }

  /**
   * Handle Stripe payout webhook events
   */
  static async handlePayoutWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'payout.paid':
          await this.handlePayoutPaid(event.data.object as Stripe.Payout);
          break;
        case 'payout.failed':
          await this.handlePayoutFailed(event.data.object as Stripe.Payout);
          break;
        case 'payout.canceled':
          await this.handlePayoutCanceled(event.data.object as Stripe.Payout);
          break;
        default:
          console.log(`Unhandled payout event: ${event.type}`);
      }
    } catch (error) {
      console.error('Failed to handle payout webhook:', error);
      throw new Error('Failed to handle payout webhook');
    }
  }

  /**
   * Handle successful payout
   */
  private static async handlePayoutPaid(payout: Stripe.Payout): Promise<void> {
    try {
      // Update all commissions for this payout to processed
      await db
        .update(commissions)
        .set({
          status: 'processed',
          processedAt: new Date().toISOString(),
        })
        .where(eq(commissions.payoutId, payout.id));

      console.log(`Payout ${payout.id} completed successfully`);
    } catch (error) {
      console.error('Failed to handle payout paid:', error);
    }
  }

  /**
   * Handle failed payout
   */
  private static async handlePayoutFailed(payout: Stripe.Payout): Promise<void> {
    try {
      // Update all commissions for this payout to failed
      await db
        .update(commissions)
        .set({
          status: 'failed',
        })
        .where(eq(commissions.payoutId, payout.id));

      console.log(`Payout ${payout.id} failed`);
    } catch (error) {
      console.error('Failed to handle payout failed:', error);
    }
  }

  /**
   * Handle canceled payout
   */
  private static async handlePayoutCanceled(payout: Stripe.Payout): Promise<void> {
    try {
      // Reset commissions back to earned status
      await db
        .update(commissions)
        .set({
          status: 'earned',
          payoutId: null,
        })
        .where(eq(commissions.payoutId, payout.id));

      console.log(`Payout ${payout.id} canceled`);
    } catch (error) {
      console.error('Failed to handle payout canceled:', error);
    }
  }

  /**
   * Get payout history for a referrer
   */
  static async getPayoutHistory(referrerId: string) {
    try {
      const commissionRecords = await db.query.commissions.findMany({
        where: eq(commissions.referrerId, referrerId),
      });

      // Group by payout ID
      const payoutMap = new Map<string | null, typeof commissionRecords>();
      commissionRecords.forEach((c: any) => {
        const payoutId = c.payoutId || 'unpaid';
        if (!payoutMap.has(payoutId)) {
          payoutMap.set(payoutId, []);
        }
        payoutMap.get(payoutId)!.push(c);
      });

      const history = Array.from(payoutMap.entries()).map(([payoutId, records]) => {
        const totalAmount = records.reduce((sum: number, r: any) => sum + (r.commissionAmount || 0), 0);
        const status = records[0]?.status || 'unknown';

        return {
          payoutId: payoutId === 'unpaid' ? null : payoutId,
          amount: totalAmount,
          status,
          count: records.length,
          createdAt: records[0]?.createdAt,
          processedAt: records[0]?.processedAt,
        };
      });

      return history;
    } catch (error) {
      console.error('Failed to get payout history:', error);
      throw new Error('Failed to get payout history');
    }
  }

  /**
   * Schedule next monthly payout
   */
  static getNextPayoutDate(): Date {
    const today = new Date().toISOString();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, this.PAYOUT_DAY_OF_MONTH);

    // If today is already past the payout day, schedule for next month
    if (today.getDate() > this.PAYOUT_DAY_OF_MONTH) {
      nextMonth.setMonth(nextMonth.getMonth() + 1);
    }

    return nextMonth;
  }

  /**
   * Verify Stripe webhook signature
   */
  static verifyWebhookSignature(body: string, signature: string): Stripe.Event {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
      return stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Failed to verify webhook signature:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}
