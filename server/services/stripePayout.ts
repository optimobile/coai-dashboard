/**
 * Stripe Referral Payout Service
 * Manages commission calculations, payout processing, and webhook handling
 */

import Stripe from 'stripe';
import { getDb } from '../db';
import { commissions } from '../../drizzle/schema';
import { eq, and, gte } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
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
  status: 'processing' | 'completed' | 'failed';
  scheduledDate: Date;
}

/**
 * Stripe Referral Payout Service
 * Handles commission tracking and monthly payouts to referrers
 */
export class StripePayoutService {
  private static readonly PAYOUT_THRESHOLD_CENTS = 5000; // $50 minimum
  private static readonly PAYOUT_DAY_OF_MONTH = 1; // First day of month

  /**
   * Create a commission record for a referral
   */
  static async createCommission(config: PayoutConfig): Promise<number> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const result = await db.insert(commissions).values({
        referrerId: config.referrerId,
        referralId: config.referralId,
        courseId: config.courseId,
        commissionRate: config.commissionRate,
        commissionAmount: config.commissionAmount,
        status: 'earned',
        createdAt: new Date(),
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const pendingCommissions = await db.query.commissions.findMany({
        where: and(
          eq(commissions.referrerId, referrerId),
          eq(commissions.status, 'earned'),
        ),
      });

      return pendingCommissions.reduce((sum: number, c: typeof pendingCommissions[0]) => sum + (c.commissionAmount || 0), 0);
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const results: PayoutResult[] = [];

      // Get all unique referrers with pending commissions
      const allCommissions = await db.query.commissions.findMany({
        where: eq(commissions.status, 'earned'),
      });

      const referrerMap = new Map<string, number>();
      allCommissions.forEach((c: typeof allCommissions[0]) => {
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');
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
        scheduledDate: new Date(),
      };
    } catch (error) {
      console.error('Failed to process payout:', error);
      const db = await getDb();
      if (!db) throw new Error('Database not available');
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
   * Handle Stripe payout webhook
   */
  static async handlePayoutWebhook(event: Stripe.Event): Promise<void> {
    const payout = event.data.object as Stripe.Payout;

    switch (event.type) {
      case 'payout.paid':
        await this.handlePayoutPaid(payout);
        break;
      case 'payout.failed':
        await this.handlePayoutFailed(payout);
        break;
      case 'payout.canceled':
        await this.handlePayoutCanceled(payout);
        break;
    }
  }

  /**
   * Handle successful payout
   */
  private static async handlePayoutPaid(payout: Stripe.Payout): Promise<void> {
    try {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      // Update all commissions for this payout to processed
      await db
        .update(commissions)
        .set({
          status: 'processed',
          processedAt: new Date(),
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');
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
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const commissionRecords = await db.query.commissions.findMany({
        where: eq(commissions.referrerId, referrerId),
      });

      // Group by payout ID
      const payoutMap = new Map<string | null, typeof commissionRecords>();
      commissionRecords.forEach((c: typeof commissionRecords[0]) => {
        const payoutId = c.payoutId || 'unpaid';
        if (!payoutMap.has(payoutId)) {
          payoutMap.set(payoutId, []);
        }
        payoutMap.get(payoutId)!.push(c);
      });

      const history = Array.from(payoutMap.entries()).map(([payoutId, records]) => {
        const totalAmount = records.reduce((sum: number, r: typeof records[0]) => sum + (r.commissionAmount || 0), 0);
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
}
