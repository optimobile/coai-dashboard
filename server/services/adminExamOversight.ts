/**
 * Admin Exam Oversight Service
 * Analytics and monitoring for exam integrity, proctoring, and cheating detection
 */

import { db } from '@/server/db';
import { userTestAttempts, proctoringSessions, userCertificates } from '@/drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export interface ExamAnalytics {
  totalExams: number;
  passRate: number;
  avgScore: number;
  proctoringStats: {
    totalProctored: number;
    flaggedCount: number;
    invalidCount: number;
    flagRate: number;
  };
  integrityTrends: Array<{
    date: string;
    avgScore: number;
    flagCount: number;
    passRate: number;
  }>;
  certificationBreakdown: {
    fundamentals: { total: number; passed: number; flagged: number };
    professional: { total: number; passed: number; flagged: number };
    expert: { total: number; passed: number; flagged: number };
  };
  suspiciousPatterns: Array<{
    pattern: string;
    frequency: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    examples: string[];
  }>;
}

export interface FlaggedCertificate {
  id: number;
  certificateNumber: string;
  userId: string;
  certificationType: string;
  proctoringStatus: string;
  integrityScore: number;
  flagReason: string;
  flaggedAt: Date;
  reviewStatus: 'pending' | 'approved' | 'rejected';
}

export interface ExamAttemptDetail {
  attemptId: number;
  userId: string;
  score: number;
  passed: boolean;
  proctoringStatus: string;
  integrityScore: number;
  suspiciousEvents: number;
  completedAt: Date;
  certificateId?: number;
}

/**
 * Admin Exam Oversight Service
 * Provides analytics and monitoring capabilities for exam administrators
 */
export class AdminExamOversightService {
  /**
   * Get comprehensive exam analytics
   */
  static async getExamAnalytics(startDate: Date, endDate: Date): Promise<ExamAnalytics> {
    try {
      // Get all exam attempts in date range
      const attempts = await db.query.userTestAttempts.findMany();

      const filtered = attempts.filter(
        (a) =>
          a.completedAt &&
          new Date(a.completedAt) >= startDate &&
          new Date(a.completedAt) <= endDate,
      );

      // Calculate basic stats
      const totalExams = filtered.length;
      const passedExams = filtered.filter((a) => a.passed).length;
      const passRate = totalExams > 0 ? (passedExams / totalExams) * 100 : 0;
      const avgScore = totalExams > 0 ? filtered.reduce((sum, a) => sum + (a.score || 0), 0) / totalExams : 0;

      // Proctoring stats
      const proctoredAttempts = filtered.filter((a) => a.proctoringSessionId);
      const flaggedAttempts = filtered.filter((a) => a.proctoringStatus === 'flagged');
      const invalidAttempts = filtered.filter((a) => a.proctoringStatus === 'invalid');

      const proctoringStats = {
        totalProctored: proctoredAttempts.length,
        flaggedCount: flaggedAttempts.length,
        invalidCount: invalidAttempts.length,
        flagRate:
          proctoredAttempts.length > 0
            ? ((flaggedAttempts.length + invalidAttempts.length) / proctoredAttempts.length) * 100
            : 0,
      };

      // Generate integrity trends
      const integrityTrends: Array<{
        date: string;
        avgScore: number;
        flagCount: number;
        passRate: number;
      }> = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];

        const dayAttempts = filtered.filter(
          (a) =>
            a.completedAt &&
            new Date(a.completedAt).toISOString().split('T')[0] === dateStr,
        );

        const dayScore = dayAttempts.length > 0 ? dayAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / dayAttempts.length : 0;
        const dayFlagCount = dayAttempts.filter((a) => a.proctoringStatus === 'flagged').length;
        const dayPassRate = dayAttempts.length > 0 ? (dayAttempts.filter((a) => a.passed).length / dayAttempts.length) * 100 : 0;

        integrityTrends.push({
          date: dateStr,
          avgScore: Math.round(dayScore),
          flagCount: dayFlagCount,
          passRate: Math.round(dayPassRate),
        });
      }

      // Certification breakdown
      const certificationBreakdown = {
        fundamentals: { total: 0, passed: 0, flagged: 0 },
        professional: { total: 0, passed: 0, flagged: 0 },
        expert: { total: 0, passed: 0, flagged: 0 },
      };

      filtered.forEach((a) => {
        const certType = a.testId === 1 ? 'fundamentals' : a.testId === 2 ? 'professional' : 'expert';
        certificationBreakdown[certType as keyof typeof certificationBreakdown].total++;
        if (a.passed) certificationBreakdown[certType as keyof typeof certificationBreakdown].passed++;
        if (a.proctoringStatus === 'flagged') certificationBreakdown[certType as keyof typeof certificationBreakdown].flagged++;
      });

      // Detect suspicious patterns
      const suspiciousPatterns = [
        {
          pattern: 'Perfect scores in short time',
          frequency: filtered.filter((a) => a.score === 100 && a.completedAt).length,
          severity: 'high' as const,
          examples: [],
        },
        {
          pattern: 'Multiple failed attempts',
          frequency: filtered.filter((a) => !a.passed).length,
          severity: 'medium' as const,
          examples: [],
        },
        {
          pattern: 'Flagged by proctoring',
          frequency: flaggedAttempts.length,
          severity: 'high' as const,
          examples: [],
        },
      ];

      return {
        totalExams,
        passRate: Math.round(passRate),
        avgScore: Math.round(avgScore),
        proctoringStats,
        integrityTrends,
        certificationBreakdown,
        suspiciousPatterns,
      };
    } catch (error) {
      console.error('Failed to get exam analytics:', error);
      throw new Error('Failed to get exam analytics');
    }
  }

  /**
   * Get flagged certificates requiring manual review
   */
  static async getFlaggedCertificates(status?: 'pending' | 'approved' | 'rejected'): Promise<FlaggedCertificate[]> {
    try {
      const certificates = await db.query.userCertificates.findMany();

      const flagged = certificates
        .filter((c) => c.proctoringStatus === 'flagged' || c.status === 'pending_review')
        .map((c) => ({
          id: c.id,
          certificateNumber: c.certificateNumber,
          userId: c.userId,
          certificationType: c.certificationType,
          proctoringStatus: c.proctoringStatus || 'unknown',
          integrityScore: c.integrityScore || 0,
          flagReason: `Integrity score: ${c.integrityScore}%`,
          flaggedAt: c.createdAt || new Date(),
          reviewStatus: (c.status === 'pending_review' ? 'pending' : 'approved') as any,
        }));

      if (status) {
        return flagged.filter((c) => c.reviewStatus === status);
      }

      return flagged;
    } catch (error) {
      console.error('Failed to get flagged certificates:', error);
      throw new Error('Failed to get flagged certificates');
    }
  }

  /**
   * Review flagged certificate
   */
  static async reviewFlaggedCertificate(
    certificateId: number,
    decision: 'approve' | 'reject',
    notes: string,
  ): Promise<void> {
    try {
      const newStatus = decision === 'approve' ? 'active' : 'revoked';

      await db
        .update(userCertificates)
        .set({
          status: newStatus,
          metadata: JSON.stringify({
            reviewDecision: decision,
            reviewNotes: notes,
            reviewedAt: new Date().toISOString(),
          }),
        })
        .where(eq(userCertificates.id, certificateId));
    } catch (error) {
      console.error('Failed to review certificate:', error);
      throw new Error('Failed to review certificate');
    }
  }

  /**
   * Get exam attempt details with proctoring data
   */
  static async getExamAttemptDetails(attemptId: number): Promise<ExamAttemptDetail | null> {
    try {
      const attempt = await db.query.userTestAttempts.findFirst({
        where: eq(userTestAttempts.id, attemptId),
      });

      if (!attempt) {
        return null;
      }

      // Get proctoring data if available
      let integrityScore = 100;
      let suspiciousEvents = 0;

      if (attempt.proctoringSessionId) {
        const proctoringSession = await db.query.proctoringSessions.findFirst({
          where: eq(proctoringSessions.sessionId, attempt.proctoringSessionId),
        });

        if (proctoringSession) {
          integrityScore = proctoringSession.integrityScore || 100;
          suspiciousEvents = proctoringSession.suspiciousEventCount || 0;
        }
      }

      return {
        attemptId: attempt.id,
        userId: attempt.userId,
        score: attempt.score || 0,
        passed: attempt.passed || false,
        proctoringStatus: attempt.proctoringStatus || 'not_required',
        integrityScore,
        suspiciousEvents,
        completedAt: attempt.completedAt || new Date(),
      };
    } catch (error) {
      console.error('Failed to get exam attempt details:', error);
      throw new Error('Failed to get exam attempt details');
    }
  }

  /**
   * Get exam statistics by certification level
   */
  static async getStatsByLevel(startDate: Date, endDate: Date) {
    try {
      const attempts = await db.query.userTestAttempts.findMany();

      const filtered = attempts.filter(
        (a) =>
          a.completedAt &&
          new Date(a.completedAt) >= startDate &&
          new Date(a.completedAt) <= endDate,
      );

      const stats = {
        fundamentals: {
          total: 0,
          passed: 0,
          avgScore: 0,
          avgIntegrity: 0,
          flagRate: 0,
        },
        professional: {
          total: 0,
          passed: 0,
          avgScore: 0,
          avgIntegrity: 0,
          flagRate: 0,
        },
        expert: {
          total: 0,
          passed: 0,
          avgScore: 0,
          avgIntegrity: 0,
          flagRate: 0,
        },
      };

      const levels = [
        { testId: 1, key: 'fundamentals' },
        { testId: 2, key: 'professional' },
        { testId: 3, key: 'expert' },
      ];

      levels.forEach(({ testId, key }) => {
        const levelAttempts = filtered.filter((a) => a.testId === testId);
        const passedCount = levelAttempts.filter((a) => a.passed).length;
        const avgScore = levelAttempts.length > 0 ? levelAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / levelAttempts.length : 0;
        const avgIntegrity = levelAttempts.length > 0 ? levelAttempts.reduce((sum, a) => sum + (a.integrityScore || 100), 0) / levelAttempts.length : 100;
        const flaggedCount = levelAttempts.filter((a) => a.proctoringStatus === 'flagged').length;
        const flagRate = levelAttempts.length > 0 ? (flaggedCount / levelAttempts.length) * 100 : 0;

        stats[key as keyof typeof stats] = {
          total: levelAttempts.length,
          passed: passedCount,
          avgScore: Math.round(avgScore),
          avgIntegrity: Math.round(avgIntegrity),
          flagRate: Math.round(flagRate),
        };
      });

      return stats;
    } catch (error) {
      console.error('Failed to get stats by level:', error);
      throw new Error('Failed to get stats by level');
    }
  }

  /**
   * Detect cheating patterns
   */
  static async detectCheatingPatterns(): Promise<
    Array<{
      pattern: string;
      count: number;
      severity: string;
      affectedUsers: number;
    }>
  > {
    try {
      const attempts = await db.query.userTestAttempts.findMany();

      const patterns = [];

      // Pattern 1: Perfect scores in short time
      const perfectScores = attempts.filter((a) => a.score === 100);
      if (perfectScores.length > 0) {
        patterns.push({
          pattern: 'Perfect scores (100%)',
          count: perfectScores.length,
          severity: 'medium',
          affectedUsers: new Set(perfectScores.map((a) => a.userId)).size,
        });
      }

      // Pattern 2: Multiple flagged attempts
      const flaggedAttempts = attempts.filter((a) => a.proctoringStatus === 'flagged');
      if (flaggedAttempts.length > 0) {
        patterns.push({
          pattern: 'Flagged by proctoring',
          count: flaggedAttempts.length,
          severity: 'high',
          affectedUsers: new Set(flaggedAttempts.map((a) => a.userId)).size,
        });
      }

      // Pattern 3: Low integrity scores
      const lowIntegrity = attempts.filter((a) => (a.integrityScore || 100) < 50);
      if (lowIntegrity.length > 0) {
        patterns.push({
          pattern: 'Low integrity score (<50%)',
          count: lowIntegrity.length,
          severity: 'critical',
          affectedUsers: new Set(lowIntegrity.map((a) => a.userId)).size,
        });
      }

      // Pattern 4: Rapid retakes
      const userAttempts = new Map<string, any[]>();
      attempts.forEach((a) => {
        if (!userAttempts.has(a.userId)) {
          userAttempts.set(a.userId, []);
        }
        userAttempts.get(a.userId)!.push(a);
      });

      let rapidRetakes = 0;
      userAttempts.forEach((userAttempts) => {
        const sorted = userAttempts.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
        for (let i = 1; i < sorted.length; i++) {
          const timeDiff = (sorted[i].createdAt?.getTime() || 0) - (sorted[i - 1].createdAt?.getTime() || 0);
          if (timeDiff < 24 * 60 * 60 * 1000) {
            // Less than 24 hours
            rapidRetakes++;
          }
        }
      });

      if (rapidRetakes > 0) {
        patterns.push({
          pattern: 'Rapid retakes (<24 hours)',
          count: rapidRetakes,
          severity: 'low',
          affectedUsers: 0,
        });
      }

      return patterns;
    } catch (error) {
      console.error('Failed to detect cheating patterns:', error);
      throw new Error('Failed to detect cheating patterns');
    }
  }
}
