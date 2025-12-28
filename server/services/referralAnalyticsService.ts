/**
 * Referral Analytics Service
 * Provides comprehensive analytics for referral program performance
 */

import { getDb } from '../db.js';
import { referralCodes, referralConversions, referralClicks, referralPayouts } from '../../drizzle/schema-referral.js';
import { eq, and, gte, lte } from 'drizzle-orm';

export interface ReferralAnalytics {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number;
  averageCommissionPerConversion: number;
  topReferralCodes: Array<{
    code: string;
    clicks: number;
    conversions: number;
    earnings: number;
  }>;
  clicksTrend: Array<{
    date: string;
    clicks: number;
  }>;
  conversionsTrend: Array<{
    date: string;
    conversions: number;
  }>;
  earningsTrend: Array<{
    date: string;
    earnings: number;
  }>;
}

export class ReferralAnalyticsService {
  /**
   * Get comprehensive referral analytics for a user
   */
  static async getReferralAnalytics(
    userId: number,
    dateRange: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<ReferralAnalytics> {
    const db = getDb();
    const now = new Date();
    let startDate = new Date();

    // Calculate start date based on range
    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (dateRange === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    }

    try {
      // Get user's referral codes
      const codes = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.userId, userId));

      const codeIds = codes.map((c) => c.id);

      if (codeIds.length === 0) {
        return {
          totalClicks: 0,
          totalConversions: 0,
          totalEarnings: 0,
          conversionRate: 0,
          averageCommissionPerConversion: 0,
          topReferralCodes: [],
          clicksTrend: [],
          conversionsTrend: [],
          earningsTrend: [],
        };
      }

      // Get clicks data
      const clicks = await db
        .select()
        .from(referralClicks)
        .where(
          and(
            eq(referralClicks.referrerId, userId),
            gte(referralClicks.clickedAt, startDate.toISOString())
          )
        );

      // Get conversions data
      const conversions = await db
        .select()
        .from(referralConversions)
        .where(
          and(
            eq(referralConversions.referrerId, userId),
            gte(referralConversions.createdAt, startDate.toISOString())
          )
        );

      // Calculate metrics
      const totalClicks = clicks.length;
      const totalConversions = conversions.filter((c) => c.status === 'earned' || c.status === 'processed').length;
      const totalEarnings = conversions.reduce((sum, c) => sum + parseFloat(c.commissionAmount as any), 0);
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
      const averageCommissionPerConversion = totalConversions > 0 ? totalEarnings / totalConversions : 0;

      // Get top referral codes
      const topReferralCodes = await this.getTopReferralCodes(userId, 5);

      // Get trends
      const clicksTrend = await this.getClicksTrend(userId, dateRange);
      const conversionsTrend = await this.getConversionsTrend(userId, dateRange);
      const earningsTrend = await this.getEarningsTrend(userId, dateRange);

      return {
        totalClicks,
        totalConversions,
        totalEarnings,
        conversionRate,
        averageCommissionPerConversion,
        topReferralCodes,
        clicksTrend,
        conversionsTrend,
        earningsTrend,
      };
    } catch (error) {
      console.error('Error getting referral analytics:', error);
      throw error;
    }
  }

  /**
   * Get top performing referral codes for a user
   */
  private static async getTopReferralCodes(
    userId: number,
    limit: number = 5
  ): Promise<
    Array<{
      code: string;
      clicks: number;
      conversions: number;
      earnings: number;
    }>
  > {
    const db = getDb();

    try {
      const codes = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.userId, userId));

      const topCodes = [];

      for (const code of codes) {
        const codeClicks = await db
          .select()
          .from(referralClicks)
          .where(eq(referralClicks.referralCodeId, code.id));

        const codeConversions = await db
          .select()
          .from(referralConversions)
          .where(
            and(
              eq(referralConversions.referralCodeId, code.id),
              eq(referralConversions.status, 'earned')
            )
          );

        const earnings = codeConversions.reduce((sum, c) => sum + parseFloat(c.commissionAmount as any), 0);

        topCodes.push({
          code: code.code,
          clicks: codeClicks.length,
          conversions: codeConversions.length,
          earnings,
        });
      }

      // Sort by earnings and return top N
      return topCodes.sort((a, b) => b.earnings - a.earnings).slice(0, limit);
    } catch (error) {
      console.error('Error getting top referral codes:', error);
      return [];
    }
  }

  /**
   * Get clicks trend data
   */
  private static async getClicksTrend(
    userId: number,
    dateRange: 'week' | 'month' | 'quarter'
  ): Promise<Array<{ date: string; clicks: number }>> {
    const db = getDb();
    const now = new Date();
    let startDate = new Date();
    let days = 7;

    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
      days = 7;
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      days = 30;
    } else if (dateRange === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      days = 90;
    }

    try {
      const clicks = await db
        .select()
        .from(referralClicks)
        .where(
          and(
            eq(referralClicks.referrerId, userId),
            gte(referralClicks.clickedAt, startDate.toISOString())
          )
        );

      // Group clicks by date
      const clicksByDate: { [key: string]: number } = {};

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        clicksByDate[dateStr] = 0;
      }

      clicks.forEach((click) => {
        const dateStr = click.clickedAt.split('T')[0];
        if (clicksByDate[dateStr] !== undefined) {
          clicksByDate[dateStr]++;
        }
      });

      return Object.entries(clicksByDate)
        .map(([date, clicks]) => ({
          date,
          clicks,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error getting clicks trend:', error);
      return [];
    }
  }

  /**
   * Get conversions trend data
   */
  private static async getConversionsTrend(
    userId: number,
    dateRange: 'week' | 'month' | 'quarter'
  ): Promise<Array<{ date: string; conversions: number }>> {
    const db = getDb();
    const now = new Date();
    let startDate = new Date();
    let days = 7;

    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
      days = 7;
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      days = 30;
    } else if (dateRange === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      days = 90;
    }

    try {
      const conversions = await db
        .select()
        .from(referralConversions)
        .where(
          and(
            eq(referralConversions.referrerId, userId),
            gte(referralConversions.convertedAt, startDate.toISOString())
          )
        );

      // Group conversions by date
      const conversionsByDate: { [key: string]: number } = {};

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        conversionsByDate[dateStr] = 0;
      }

      conversions.forEach((conversion) => {
        if (conversion.convertedAt) {
          const dateStr = conversion.convertedAt.split('T')[0];
          if (conversionsByDate[dateStr] !== undefined) {
            conversionsByDate[dateStr]++;
          }
        }
      });

      return Object.entries(conversionsByDate)
        .map(([date, conversions]) => ({
          date,
          conversions,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error getting conversions trend:', error);
      return [];
    }
  }

  /**
   * Get earnings trend data
   */
  private static async getEarningsTrend(
    userId: number,
    dateRange: 'week' | 'month' | 'quarter'
  ): Promise<Array<{ date: string; earnings: number }>> {
    const db = getDb();
    const now = new Date();
    let startDate = new Date();
    let days = 7;

    if (dateRange === 'week') {
      startDate.setDate(now.getDate() - 7);
      days = 7;
    } else if (dateRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      days = 30;
    } else if (dateRange === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      days = 90;
    }

    try {
      const conversions = await db
        .select()
        .from(referralConversions)
        .where(
          and(
            eq(referralConversions.referrerId, userId),
            gte(referralConversions.convertedAt, startDate.toISOString())
          )
        );

      // Group earnings by date
      const earningsByDate: { [key: string]: number } = {};

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        earningsByDate[dateStr] = 0;
      }

      conversions.forEach((conversion) => {
        if (conversion.convertedAt) {
          const dateStr = conversion.convertedAt.split('T')[0];
          if (earningsByDate[dateStr] !== undefined) {
            earningsByDate[dateStr] += parseFloat(conversion.commissionAmount as any);
          }
        }
      });

      return Object.entries(earningsByDate)
        .map(([date, earnings]) => ({
          date,
          earnings,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error getting earnings trend:', error);
      return [];
    }
  }

  /**
   * Get referral performance summary
   */
  static async getReferralSummary(userId: number): Promise<{
    totalReferralCodes: number;
    activeReferralCodes: number;
    totalClicks: number;
    totalConversions: number;
    totalEarnings: number;
    pendingEarnings: number;
    processedEarnings: number;
    conversionRate: number;
  }> {
    const db = getDb();

    try {
      // Get referral codes
      const codes = await db
        .select()
        .from(referralCodes)
        .where(eq(referralCodes.userId, userId));

      const activeCodes = codes.filter((c) => c.status === 'active').length;

      // Get all clicks
      const clicks = await db
        .select()
        .from(referralClicks)
        .where(eq(referralClicks.referrerId, userId));

      // Get all conversions
      const conversions = await db
        .select()
        .from(referralConversions)
        .where(eq(referralConversions.referrerId, userId));

      const totalConversions = conversions.filter((c) => c.status === 'earned' || c.status === 'processed').length;
      const pendingConversions = conversions.filter((c) => c.status === 'pending').length;
      const processedConversions = conversions.filter((c) => c.status === 'processed').length;

      const totalEarnings = conversions
        .filter((c) => c.status === 'earned' || c.status === 'processed')
        .reduce((sum, c) => sum + parseFloat(c.commissionAmount as any), 0);

      const pendingEarnings = conversions
        .filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + parseFloat(c.commissionAmount as any), 0);

      const processedEarnings = conversions
        .filter((c) => c.status === 'processed')
        .reduce((sum, c) => sum + parseFloat(c.commissionAmount as any), 0);

      const conversionRate = clicks.length > 0 ? (totalConversions / clicks.length) * 100 : 0;

      return {
        totalReferralCodes: codes.length,
        activeReferralCodes: activeCodes,
        totalClicks: clicks.length,
        totalConversions,
        totalEarnings,
        pendingEarnings,
        processedEarnings,
        conversionRate,
      };
    } catch (error) {
      console.error('Error getting referral summary:', error);
      throw error;
    }
  }
}
