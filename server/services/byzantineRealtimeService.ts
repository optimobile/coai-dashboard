/**
 * Byzantine Council Real-Time Voting Service
 * 
 * Implements low-latency, real-time voting for the 33-Agent Council
 * with streaming updates and live AI inference integration.
 * 
 * Architecture:
 * - WebSocket connections for live updates
 * - Event streaming for voting progress
 * - Low-latency alert system for critical decisions
 * - Live AI inference integration via Forge API
 */

import { broadcastToUsers, broadcastToAll, RealtimeMessage } from '../websocket/server.js';
import { getDb } from '../db.js';
import { councilSessions, councilVotes, realtimeEvents } from '../../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

export interface VotingEvent {
  sessionId: number;
  agentId: number;
  agentName: string;
  decision: 'approve' | 'reject' | 'abstain';
  confidence: number;
  reasoning: string;
  timestamp: number;
  latency: number; // milliseconds
}

export interface CouncilVotingSession {
  sessionId: number;
  reportId: number;
  totalAgents: number;
  votesReceived: number;
  votesRequired: number;
  currentConsensus: 'pending' | 'approved' | 'rejected' | 'deadlocked';
  consensusThreshold: number;
  startTime: number;
  estimatedCompletionTime: number;
  liveMetrics: {
    approvalRate: number;
    rejectionRate: number;
    abstentionRate: number;
    averageLatency: number;
    maxLatency: number;
  };
}

// In-memory store for active voting sessions
const activeSessions = new Map<number, CouncilVotingSession>();

// Store for vote history with timestamps
const voteHistory = new Map<number, VotingEvent[]>();

/**
 * Start a new Byzantine Council voting session
 * Broadcasts initial session state to all connected users
 */
export async function startVotingSession(
  sessionId: number,
  reportId: number,
  userIds: number[]
): Promise<CouncilVotingSession> {
  const totalAgents = 33;
  const votesRequired = Math.ceil(totalAgents * 0.67); // 2/3 majority (Byzantine consensus)
  const startTime = Date.now();
  const estimatedCompletionTime = startTime + 30000; // 30 seconds for voting

  const session: CouncilVotingSession = {
    sessionId,
    reportId,
    totalAgents,
    votesReceived: 0,
    votesRequired,
    currentConsensus: 'pending',
    consensusThreshold: votesRequired,
    startTime,
    estimatedCompletionTime,
    liveMetrics: {
      approvalRate: 0,
      rejectionRate: 0,
      abstentionRate: 0,
      averageLatency: 0,
      maxLatency: 0,
    },
  };

  activeSessions.set(sessionId, session);
  voteHistory.set(sessionId, []);

  // Broadcast session start to all users
  const message: RealtimeMessage = {
    type: 'compliance_update',
    data: {
      event: 'voting_session_started',
      session,
    },
    timestamp: Date.now(),
  };

  broadcastToUsers(userIds, message);

  // Log to database
  const db = await getDb();
  if (db) {
    try {
      await db.insert(realtimeEvents).values({
        eventType: 'voting_session_started',
        eventData: JSON.stringify(session),
        severity: 'info',
      });
    } catch (error) {
      console.error('Failed to log voting session start:', error);
    }
  }

  return session;
}

/**
 * Record a vote from an AI agent
 * Updates session metrics and broadcasts real-time updates
 */
export async function recordAgentVote(
  sessionId: number,
  votingEvent: VotingEvent,
  userIds: number[]
): Promise<void> {
  const session = activeSessions.get(sessionId);
  if (!session) {
    console.error(`Session ${sessionId} not found`);
    return;
  }

  // Record vote in history
  const history = voteHistory.get(sessionId) || [];
  history.push(votingEvent);
  voteHistory.set(sessionId, history);

  // Update session metrics
  session.votesReceived++;

  // Calculate consensus metrics
  const approvals = history.filter((v) => v.decision === 'approve').length;
  const rejections = history.filter((v) => v.decision === 'reject').length;
  const abstentions = history.filter((v) => v.decision === 'abstain').length;

  session.liveMetrics.approvalRate = (approvals / session.votesReceived) * 100;
  session.liveMetrics.rejectionRate = (rejections / session.votesReceived) * 100;
  session.liveMetrics.abstentionRate = (abstentions / session.votesReceived) * 100;

  // Update latency metrics
  const latencies = history.map((v) => v.latency);
  session.liveMetrics.averageLatency =
    latencies.reduce((a, b) => a + b, 0) / latencies.length;
  session.liveMetrics.maxLatency = Math.max(...latencies);

  // Check for consensus
  if (approvals >= session.votesRequired) {
    session.currentConsensus = 'approved';
    await finalizeVotingSession(sessionId, 'approved', userIds);
  } else if (rejections >= session.votesRequired) {
    session.currentConsensus = 'rejected';
    await finalizeVotingSession(sessionId, 'rejected', userIds);
  } else if (session.votesReceived === session.totalAgents) {
    // All votes received
    if (approvals > rejections) {
      session.currentConsensus = 'approved';
      await finalizeVotingSession(sessionId, 'approved', userIds);
    } else if (rejections > approvals) {
      session.currentConsensus = 'rejected';
      await finalizeVotingSession(sessionId, 'rejected', userIds);
    } else {
      session.currentConsensus = 'deadlocked';
      await finalizeVotingSession(sessionId, 'deadlocked', userIds);
    }
  }

  // Broadcast real-time vote update
  const message: RealtimeMessage = {
    type: 'compliance_update',
    data: {
      event: 'agent_voted',
      votingEvent,
      sessionMetrics: {
        votesReceived: session.votesReceived,
        votesRequired: session.votesRequired,
        approvalRate: session.liveMetrics.approvalRate.toFixed(1),
        rejectionRate: session.liveMetrics.rejectionRate.toFixed(1),
        averageLatency: session.liveMetrics.averageLatency.toFixed(0),
        consensus: session.currentConsensus,
      },
    },
    timestamp: Date.now(),
  };

  broadcastToUsers(userIds, message);

  // Store vote in database
  const db = await getDb();
  if (db) {
    try {
      await db.insert(councilVotes).values({
        sessionId,
        agentId: votingEvent.agentId,
        decision: votingEvent.decision,
        confidence: votingEvent.confidence,
        reasoning: votingEvent.reasoning,
      });
    } catch (error) {
      console.error('Failed to store council vote:', error);
    }
  }
}

/**
 * Finalize voting session and trigger alerts if needed
 */
async function finalizeVotingSession(
  sessionId: number,
  result: 'approved' | 'rejected' | 'deadlocked',
  userIds: number[]
): Promise<void> {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  const completionTime = Date.now();
  const totalDuration = completionTime - session.startTime;

  // Determine alert severity based on result
  let severity: 'info' | 'warning' | 'critical' = 'info';
  let alertMessage = '';

  if (result === 'rejected') {
    severity = 'critical';
    alertMessage = `⚠️ CRITICAL: Byzantine Council REJECTED report ${session.reportId}`;
  } else if (result === 'deadlocked') {
    severity = 'warning';
    alertMessage = `⚠️ WARNING: Byzantine Council DEADLOCKED on report ${session.reportId}`;
  } else {
    alertMessage = `✅ Byzantine Council APPROVED report ${session.reportId}`;
  }

  // Broadcast final result with LOW-LATENCY alert
  const message: RealtimeMessage = {
    type: 'risk_alert',
    data: {
      event: 'voting_session_completed',
      result,
      sessionId,
      reportId: session.reportId,
      totalVotes: session.votesReceived,
      votesRequired: session.votesRequired,
      completionTime: totalDuration,
      metrics: session.liveMetrics,
      alertMessage,
      severity,
    },
    timestamp: completionTime,
  };

  broadcastToUsers(userIds, message);

  // Log to database
  const db = await getDb();
  if (db) {
    try {
      await db
        .update(councilSessions)
        .set({
          status: result,
          completedAt: new Date(completionTime),
        })
        .where(eq(councilSessions.id, sessionId));

      await db.insert(realtimeEvents).values({
        eventType: 'voting_session_completed',
        eventData: JSON.stringify({
          result,
          sessionId,
          reportId: session.reportId,
          totalDuration,
          metrics: session.liveMetrics,
        }),
        severity,
      });
    } catch (error) {
      console.error('Failed to finalize voting session:', error);
    }
  }

  // Clean up session after 5 minutes
  setTimeout(() => {
    activeSessions.delete(sessionId);
    voteHistory.delete(sessionId);
  }, 5 * 60 * 1000);
}

/**
 * Get current session metrics for real-time dashboard
 */
export function getSessionMetrics(sessionId: number): CouncilVotingSession | null {
  return activeSessions.get(sessionId) || null;
}

/**
 * Get vote history for a session
 */
export function getVoteHistory(sessionId: number): VotingEvent[] {
  return voteHistory.get(sessionId) || [];
}

/**
 * Get all active sessions
 */
export function getActiveSessions(): CouncilVotingSession[] {
  return Array.from(activeSessions.values());
}

/**
 * Stream real-time compliance alerts
 * Used for low-latency alert system
 */
export async function streamComplianceAlert(
  alert: {
    type: 'violation' | 'risk' | 'approval' | 'rejection';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    reportId: number;
    timestamp: number;
  },
  userIds: number[]
): Promise<void> {
  const message: RealtimeMessage = {
    type: 'risk_alert',
    data: alert,
    timestamp: Date.now(),
  };

  broadcastToUsers(userIds, message);

  // Log to database
  const db = await getDb();
  if (db) {
    try {
      await db.insert(realtimeEvents).values({
        eventType: alert.type,
        eventData: JSON.stringify(alert),
        severity: alert.severity,
      });
    } catch (error) {
      console.error('Failed to log compliance alert:', error);
    }
  }
}

/**
 * Get real-time system health metrics
 */
export function getSystemHealthMetrics() {
  const activeSessions_ = getActiveSessions();
  const totalVotes = Array.from(voteHistory.values()).reduce(
    (sum, votes) => sum + votes.length,
    0
  );

  const avgLatency =
    totalVotes > 0
      ? Array.from(voteHistory.values())
          .flat()
          .reduce((sum, vote) => sum + vote.latency, 0) / totalVotes
      : 0;

  return {
    activeSessions: activeSessions_.length,
    totalVotes,
    averageLatency: avgLatency.toFixed(0),
    maxLatency: Math.max(
      ...Array.from(voteHistory.values())
        .flat()
        .map((v) => v.latency),
      0
    ),
    timestamp: Date.now(),
  };
}
