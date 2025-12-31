/**
 * Exam Proctoring Service
 * Integrates with Proctorio/Examity for remote exam monitoring
 * Includes AI-based cheating detection and compliance tracking
 */

import { db } from '../db';
import { proctoringSessions, proctoringEvents } from '../../drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { invokeLLM } from '@/server/_core/llm';

export interface ProctoringSessionConfig {
  examId: string;
  userId: string;
  certificationType: 'fundamentals' | 'professional' | 'expert';
  requireProctoring: boolean;
  recordSession: boolean;
  allowScreenSharing: boolean;
  allowExternalApps: boolean;
  startTime: Date;
  endTime: Date;
}

export interface ProctoringEvent {
  type: 'eye_movement' | 'face_detection' | 'screen_change' | 'audio_detection' | 'suspicious_behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ProctoringResult {
  sessionId: string;
  status: 'passed' | 'flagged' | 'failed';
  integrityScore: number; // 0-100
  suspiciousEvents: ProctoringEvent[];
  recommendation: string;
  certificateValidity: 'full' | 'flagged' | 'invalid';
}

/**
 * Exam Proctoring Service
 * Manages remote exam monitoring and integrity verification
 */
export class ExamProctoringService {
  /**
   * Start a proctored exam session
   */
  static async startSession(config: ProctoringSessionConfig): Promise<string> {
    const sessionId = `PROC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Insert proctoring session into database
      await db.insert(proctoringSessions).values({
        sessionId,
        examId: config.examId,
        userId: config.userId,
        certificationType: config.certificationType,
        status: 'active',
        startTime: config.startTime,
        endTime: config.endTime,
        recordingUrl: null,
        integrityScore: 100,
        suspiciousEventCount: 0,
        createdAt: new Date().toISOString(),
      });

      return sessionId;
    } catch (error) {
      console.error('Failed to start proctoring session:', error);
      throw new Error('Failed to start proctoring session');
    }
  }

  /**
   * Record a proctoring event (eye movement, face detection, etc.)
   */
  static async recordEvent(
    sessionId: string,
    event: ProctoringEvent,
  ): Promise<void> {
    try {
      // Insert event into database
      await db.insert(proctoringEvents).values({
        sessionId,
        eventType: event.type,
        severity: event.severity,
        description: event.description,
        metadata: JSON.stringify(event.metadata || {}),
        timestamp: event.timestamp,
        createdAt: new Date().toISOString(),
      });

      // Update session suspicious event count
      const session = await db.query.proctoringSessions.findFirst({
        where: eq(proctoringSessions.sessionId, sessionId),
      });

      if (session) {
        const eventCount = session.suspiciousEventCount + (event.severity !== 'low' ? 1 : 0);
        const newScore = Math.max(0, 100 - eventCount * 5);

        await db
          .update(proctoringSessions)
          .set({
            suspiciousEventCount: eventCount,
            integrityScore: newScore,
          })
          .where(eq(proctoringSessions.sessionId, sessionId));
      }
    } catch (error) {
      console.error('Failed to record proctoring event:', error);
      throw new Error('Failed to record proctoring event');
    }
  }

  /**
   * Analyze proctoring session for cheating indicators
   */
  static async analyzeSession(sessionId: string): Promise<ProctoringResult> {
    try {
      // Fetch session and events
      const session = await db.query.proctoringSessions.findFirst({
        where: eq(proctoringSessions.sessionId, sessionId),
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Fetch all events for this session
      const events = await db.query.proctoringEvents.findMany({
        where: eq(proctoringEvents.sessionId, sessionId),
      });

      // Parse metadata
      const parsedEvents = events.map((e: any) => ({
        ...e,
        metadata: e.metadata ? JSON.parse(e.metadata as string) : {},
      }));

      // AI-based analysis using Gemini
      const analysisPrompt = `
Analyze the following exam proctoring events for potential cheating indicators.
Return a JSON object with:
- integrityScore (0-100)
- suspiciousPatterns (array of identified patterns)
- recommendation (pass/flag/fail)
- reasoning (brief explanation)

Events:
${JSON.stringify(parsedEvents, null, 2)}

Consider:
1. Multiple face detections (possible impersonation)
2. Frequent eye movement away from screen (looking at materials)
3. Screen changes during exam (accessing external apps)
4. Audio detection during silent exam (communication)
5. Timing patterns (too fast/slow completion)
6. Behavioral anomalies (sudden changes in pattern)
`;

      const aiResponse = await invokeLLM({
        messages: [
          {
            role: 'system',
            content:
              'You are an expert exam proctoring AI. Analyze proctoring events and identify cheating patterns. Return valid JSON only.',
          },
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'proctoring_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                integrityScore: {
                  type: 'number',
                  description: 'Integrity score 0-100',
                },
                suspiciousPatterns: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Identified suspicious patterns',
                },
                recommendation: {
                  type: 'string',
                  enum: ['pass', 'flag', 'fail'],
                  description: 'Recommendation based on analysis',
                },
                reasoning: {
                  type: 'string',
                  description: 'Brief explanation of analysis',
                },
              },
              required: ['integrityScore', 'suspiciousPatterns', 'recommendation', 'reasoning'],
              additionalProperties: false,
            },
          },
        },
      });

      // Parse AI response
      const analysisResult = JSON.parse(
        aiResponse.choices[0].message.content || '{}',
      );

      // Determine certificate validity
      let certificateValidity: 'full' | 'flagged' | 'invalid' = 'full';
      if (analysisResult.recommendation === 'flag') {
        certificateValidity = 'flagged';
      } else if (analysisResult.recommendation === 'fail') {
        certificateValidity = 'invalid';
      }

      // Update session with analysis results
      await db
        .update(proctoringSessions)
        .set({
          status: 'completed',
          integrityScore: analysisResult.integrityScore,
          certificateValidity,
        })
        .where(eq(proctoringSessions.sessionId, sessionId));

      // Filter suspicious events
      const suspiciousEvents = parsedEvents.filter((e: any) => e.severity !== 'low');

      return {
        sessionId,
        status: analysisResult.recommendation === 'pass' ? 'passed' : 'flagged',
        integrityScore: analysisResult.integrityScore,
        suspiciousEvents,
        recommendation: analysisResult.reasoning,
        certificateValidity,
      };
    } catch (error) {
      console.error('Failed to analyze proctoring session:', error);
      throw new Error('Failed to analyze proctoring session');
    }
  }

  /**
   * Get proctoring session details
   */
  static async getSession(sessionId: string) {
    try {
      const session = await db.query.proctoringSessions.findFirst({
        where: eq(proctoringSessions.sessionId, sessionId),
      });

      if (!session) {
        throw new Error('Session not found');
      }

      const events = await db.query.proctoringEvents.findMany({
        where: eq(proctoringEvents.sessionId, sessionId),
      });

      return {
        ...session,
        events: events.map((e: any) => ({
          ...e,
          metadata: e.metadata ? JSON.parse(e.metadata as string) : {},
        })),
      };
    } catch (error) {
      console.error('Failed to get proctoring session:', error);
      throw new Error('Failed to get proctoring session');
    }
  }

  /**
   * Get user's proctoring history
   */
  static async getUserSessions(userId: string) {
    try {
      const sessions = await db.query.proctoringSessions.findMany({
        where: eq(proctoringSessions.userId, userId),
      });

      return sessions;
    } catch (error) {
      console.error('Failed to get user proctoring sessions:', error);
      throw new Error('Failed to get user proctoring sessions');
    }
  }

  /**
   * Calculate proctoring statistics for analytics
   */
  static async getStatistics(startDate: Date, endDate: Date) {
    try {
      const sessions = await db.query.proctoringSessions.findMany({
        where: and(
          gte(proctoringSessions.createdAt, startDate),
          lte(proctoringSessions.createdAt, endDate),
        ),
      });

      const totalSessions = sessions.length;
      const passedSessions = sessions.filter((s: any) => s.certificateValidity === 'full').length;
      const flaggedSessions = sessions.filter((s: any) => s.certificateValidity === 'flagged').length;
      const failedSessions = sessions.filter((s: any) => s.certificateValidity === 'invalid').length;

      const avgIntegrityScore =
        sessions.length > 0
          ? sessions.reduce((sum: number, s: any) => sum + (s.integrityScore || 0), 0) / sessions.length
          : 0;

      const avgSuspiciousEvents =
        sessions.length > 0
          ? sessions.reduce((sum: number, s: any) => sum + (s.suspiciousEventCount || 0), 0) / sessions.length
          : 0;

      return {
        totalSessions,
        passedSessions,
        flaggedSessions,
        failedSessions,
        passRate: totalSessions > 0 ? (passedSessions / totalSessions) * 100 : 0,
        avgIntegrityScore: Math.round(avgIntegrityScore),
        avgSuspiciousEvents: Math.round(avgSuspiciousEvents * 100) / 100,
      };
    } catch (error) {
      console.error('Failed to calculate proctoring statistics:', error);
      throw new Error('Failed to calculate proctoring statistics');
    }
  }
}
