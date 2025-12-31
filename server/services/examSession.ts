/**
 * Exam Session Service
 * Manages integrated exam + proctoring lifecycle
 * Handles session initialization, monitoring, submission, and certificate flagging
 */

import { db } from '../db';
import { userTestAttempts, userCertificates, proctoringSessions } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { ExamProctoringService } from '../services/examProctoring';

export interface ExamSessionConfig {
  userId: string;
  examId: string;
  certificationType: 'fundamentals' | 'professional' | 'expert';
  requireProctoring: boolean;
  durationMinutes: number;
}

export interface ExamSessionResult {
  attemptId: number;
  score: number;
  passed: boolean;
  proctoringStatus: 'full' | 'flagged' | 'invalid' | 'not_required';
  integrityScore: number;
  certificateId?: number;
  certificateNumber?: string;
}

/**
 * Exam Session Service
 * Manages exam sessions with integrated proctoring
 */
export class ExamSessionService {
  /**
   * Start a new exam session with optional proctoring
   */
  static async startExamSession(config: ExamSessionConfig) {
    try {
      // Create exam attempt record
      const attempt = await db.insert(userTestAttempts).values({
        userId: config.userId,
        testId: parseInt(config.examId),
        startedAt: new Date().toISOString(),
        status: 'in_progress',
        score: 0,
        passed: false,
      });

      const attemptId = attempt[0];

      // Initialize proctoring session if required
      let proctoringSessionId: string | null = null;
      if (config.requireProctoring) {
        proctoringSessionId = await ExamProctoringService.startSession({
          examId: config.examId,
          userId: config.userId,
          certificationType: config.certificationType,
          requireProctoring: true,
          recordSession: true,
          allowScreenSharing: false,
          allowExternalApps: false,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + config.durationMinutes * 60 * 1000),
        });
      }

      return {
        attemptId,
        proctoringSessionId,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + config.durationMinutes * 60 * 1000),
        requiresProctoring: config.requireProctoring,
      };
    } catch (error) {
      console.error('Failed to start exam session:', error);
      throw new Error('Failed to start exam session');
    }
  }

  /**
   * Submit exam and process proctoring results
   */
  static async submitExam(
    attemptId: number,
    proctoringSessionId: string | null,
    score: number,
    answers: Record<string, string>,
  ): Promise<ExamSessionResult> {
    try {
      // Get attempt details
      const attempt = await db.query.userTestAttempts.findFirst({
        where: eq(userTestAttempts.id, attemptId),
      });

      if (!attempt) {
        throw new Error('Exam attempt not found');
      }

      // Determine pass/fail (70% threshold)
      const passed = score >= 70;

      // Analyze proctoring if applicable
      let proctoringStatus: 'full' | 'flagged' | 'invalid' | 'not_required' = 'not_required';
      let integrityScore = 100;

      if (proctoringSessionId) {
        const proctoringResult = await ExamProctoringService.analyzeSession(proctoringSessionId);

        integrityScore = proctoringResult.integrityScore;

        if (proctoringResult.certificateValidity === 'full') {
          proctoringStatus = 'full';
        } else if (proctoringResult.certificateValidity === 'flagged') {
          proctoringStatus = 'flagged';
        } else {
          proctoringStatus = 'invalid';
        }

        // Prevent certificate issuance if proctoring failed
        if (proctoringStatus === 'invalid' && passed) {
          // Mark as passed but flag for manual review
          proctoringStatus = 'flagged';
        }
      }

      // Update attempt with results
      await db
        .update(userTestAttempts)
        .set({
          completedAt: new Date().toISOString(),
          status: passed && proctoringStatus !== 'invalid' ? 'completed' : 'flagged',
          score,
          passed: passed && proctoringStatus !== 'invalid',
          proctoringSessionId,
          proctoringStatus,
          integrityScore,
        })
        .where(eq(userTestAttempts.id, attemptId));

      // Issue certificate if passed and proctoring approved
      let certificateId: number | undefined;
      let certificateNumber: string | undefined;

      if (passed && proctoringStatus !== 'invalid') {
        const certificateResult = await this.issueCertificate(
          attempt.userId,
          attempt.testId,
          proctoringStatus,
          integrityScore,
        );

        certificateId = certificateResult.id;
        certificateNumber = certificateResult.certificateNumber;
      }

      return {
        attemptId,
        score,
        passed: passed && proctoringStatus !== 'invalid',
        proctoringStatus,
        integrityScore,
        certificateId,
        certificateNumber,
      };
    } catch (error) {
      console.error('Failed to submit exam:', error);
      throw new Error('Failed to submit exam');
    }
  }

  /**
   * Issue certificate with proctoring metadata
   */
  static async issueCertificate(
    userId: string,
    testId: number,
    proctoringStatus: string,
    integrityScore: number,
  ) {
    try {
      // Generate unique certificate number
      const certificateNumber = `CEASA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Determine certificate type based on test
      let certificationType: 'fundamentals' | 'professional' | 'expert' = 'fundamentals';
      if (testId === 2) certificationType = 'professional';
      if (testId === 3) certificationType = 'expert';

      // Calculate expiration (3 years)
      const expiresAt = new Date().toISOString();
      expiresAt.setFullYear(expiresAt.getFullYear() + 3);

      // Create certificate with proctoring metadata
      const certificate = await db.insert(userCertificates).values({
        userId,
        certificateNumber,
        certificationType,
        status: proctoringStatus === 'flagged' ? 'pending_review' : 'active',
        issuedAt: new Date().toISOString(),
        expiresAt,
        proctoringStatus,
        integrityScore,
        metadata: JSON.stringify({
          proctoringStatus,
          integrityScore,
          issuedAt: new Date().toISOString(),
          verificationUrl: `https://csoai.org/verify/${certificateNumber}`,
        }),
      });

      return {
        id: certificate[0],
        certificateNumber,
        proctoringStatus,
        integrityScore,
      };
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      throw new Error('Failed to issue certificate');
    }
  }

  /**
   * Get exam session details with proctoring data
   */
  static async getSessionDetails(attemptId: number) {
    try {
      const attempt = await db.query.userTestAttempts.findFirst({
        where: eq(userTestAttempts.id, attemptId),
      });

      if (!attempt) {
        throw new Error('Exam attempt not found');
      }

      // Get proctoring data if available
      let proctoringData = null;
      if (attempt.proctoringSessionId) {
        proctoringData = await ExamProctoringService.getSession(attempt.proctoringSessionId);
      }

      // Get certificate if issued
      let certificate = null;
      if (attempt.passed) {
        certificate = await db.query.userCertificates.findFirst({
          where: and(
            eq(userCertificates.userId, attempt.userId),
            eq(userCertificates.status, 'active'),
          ),
        });
      }

      return {
        attempt,
        proctoringData,
        certificate,
      };
    } catch (error) {
      console.error('Failed to get session details:', error);
      throw new Error('Failed to get session details');
    }
  }

  /**
   * Get certificate verification details
   */
  static async verifyCertificate(certificateNumber: string) {
    try {
      const certificate = await db.query.userCertificates.findFirst({
        where: eq(userCertificates.certificateNumber, certificateNumber),
      });

      if (!certificate) {
        return {
          valid: false,
          message: 'Certificate not found',
        };
      }

      // Check expiration
      if (certificate.expiresAt && new Date().toISOString() > certificate.expiresAt) {
        return {
          valid: false,
          message: 'Certificate has expired',
          certificate,
        };
      }

      // Check status
      if (certificate.status !== 'active') {
        return {
          valid: false,
          message: `Certificate status: ${certificate.status}`,
          certificate,
        };
      }

      // Parse metadata
      const metadata = certificate.metadata ? JSON.parse(certificate.metadata as string) : {};

      return {
        valid: true,
        message: 'Certificate is valid',
        certificate: {
          number: certificate.certificateNumber,
          type: certificate.certificationType,
          issuedAt: certificate.issuedAt,
          expiresAt: certificate.expiresAt,
          proctoringStatus: certificate.proctoringStatus,
          integrityScore: certificate.integrityScore,
          metadata,
        },
      };
    } catch (error) {
      console.error('Failed to verify certificate:', error);
      throw new Error('Failed to verify certificate');
    }
  }

  /**
   * Get exam integrity report for administrators
   */
  static async getIntegrityReport(startDate: Date, endDate: Date) {
    try {
      const attempts = await db.query.userTestAttempts.findMany();

      const filtered = attempts.filter(
        (a) =>
          a.completedAt &&
          new Date(a.completedAt) >= startDate &&
          new Date(a.completedAt) <= endDate,
      );

      const proctoredAttempts = filtered.filter((a: any) => a.proctoringSessionId);
      const flaggedAttempts = filtered.filter((a: any) => a.proctoringStatus === 'flagged');
      const invalidAttempts = filtered.filter((a: any) => a.proctoringStatus === 'invalid');

      const avgIntegrityScore =
        proctoredAttempts.length > 0
          ? proctoredAttempts.reduce((sum: number, a: any) => sum + (a.integrityScore || 0), 0) /
            proctoredAttempts.length
          : 0;

      return {
        period: { startDate, endDate },
        totalAttempts: filtered.length,
        proctoredAttempts: proctoredAttempts.length,
        proctoringRate: filtered.length > 0 ? (proctoredAttempts.length / filtered.length) * 100 : 0,
        flaggedAttempts: flaggedAttempts.length,
        invalidAttempts: invalidAttempts.length,
        avgIntegrityScore: Math.round(avgIntegrityScore),
        passRate: filtered.length > 0 ? (filtered.filter((a: any) => a.passed).length / filtered.length) * 100 : 0,
      };
    } catch (error) {
      console.error('Failed to get integrity report:', error);
      throw new Error('Failed to get integrity report');
    }
  }
}
