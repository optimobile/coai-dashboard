import { getDb } from "../db";
import { adminMetrics, websocketConnections, realtimeEvents } from "../../drizzle/schema";
import { eq, gte, desc, sql, count } from "drizzle-orm";

export interface DashboardMetrics {
  activeConnections: number;
  eventThroughput: number;
  systemHealth: number;
  averageLatency: number;
  errorRate: number;
  timestamp: Date;
}

export interface DashboardStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  topJurisdictions: Array<{ jurisdiction: string; count: number }>;
  recentEvents: any[];
  systemHealth: {
    uptime: number;
    activeConnections: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export class AdminDashboard {
  /**
   * Record metrics
   */
  static async recordMetric(
    metricType: string,
    value: number,
    metadata?: Record<string, any>
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    return await db.insert(adminMetrics).values({
      metricType: metricType as any,
      value,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  }

  /**
   * Get current metrics
   */
  static async getCurrentMetrics(): Promise<DashboardMetrics> {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get active connections
    const connectionsResult = await db
      .select({ count: count() })
      .from(websocketConnections)
      .where(eq(websocketConnections.isActive, 1));

    const activeConnections = connectionsResult[0]?.count || 0;

    // Get recent metrics
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const metricsResult = await db
      .select()
      .from(adminMetrics)
      .where(gte(adminMetrics.recordedAt, fiveMinutesAgo.toISOString() as any))
      .orderBy(desc(adminMetrics.recordedAt))
      .limit(100);

    // Calculate averages
    const throughputMetrics = metricsResult.filter(
      (m) => m.metricType === "event_throughput"
    );
    const latencyMetrics = metricsResult.filter(
      (m) => m.metricType === "latency"
    );
    const errorMetrics = metricsResult.filter(
      (m) => m.metricType === "error_rate"
    );
    const healthMetrics = metricsResult.filter(
      (m) => m.metricType === "system_health"
    );

    const avgThroughput =
      throughputMetrics.length > 0
        ? throughputMetrics.reduce((sum, m) => sum + m.value, 0) /
          throughputMetrics.length
        : 0;

    const avgLatency =
      latencyMetrics.length > 0
        ? latencyMetrics.reduce((sum, m) => sum + m.value, 0) /
          latencyMetrics.length
        : 0;

    const avgErrorRate =
      errorMetrics.length > 0
        ? errorMetrics.reduce((sum, m) => sum + m.value, 0) / errorMetrics.length
        : 0;

    const avgHealth =
      healthMetrics.length > 0
        ? healthMetrics.reduce((sum, m) => sum + m.value, 0) / healthMetrics.length
        : 100;

    return {
      activeConnections,
      eventThroughput: avgThroughput,
      systemHealth: avgHealth,
      averageLatency: avgLatency,
      errorRate: avgErrorRate,
      timestamp: new Date(),
    };
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get total events
    const totalEventsResult = await db
      .select({ count: count() })
      .from(realtimeEvents);

    const totalEvents = totalEventsResult[0]?.count || 0;

    // Get events by type
    const eventsByTypeResult = await db
      .select({
        type: realtimeEvents.eventType,
        count: count(),
      })
      .from(realtimeEvents)
      .groupBy(realtimeEvents.eventType);

    const eventsByType = eventsByTypeResult.reduce(
      (acc, row) => {
        acc[row.type || "unknown"] = row.count;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get events by severity
    const eventsBySeverityResult = await db
      .select({
        severity: realtimeEvents.severity,
        count: count(),
      })
      .from(realtimeEvents)
      .groupBy(realtimeEvents.severity);

    const eventsBySeverity = eventsBySeverityResult.reduce(
      (acc, row) => {
        acc[row.severity || "unknown"] = row.count;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get recent events
    const recentEvents = await db
      .select()
      .from(realtimeEvents)
      .orderBy(desc(realtimeEvents.createdAt))
      .limit(20);

    // Get current metrics
    const metrics = await this.getCurrentMetrics();

    return {
      totalEvents,
      eventsByType,
      eventsBySeverity,
      topJurisdictions: [], // To be populated from compliance data
      recentEvents,
      systemHealth: {
        uptime: Date.now() / 1000, // Simplified
        activeConnections: metrics.activeConnections,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        cpuUsage: 0, // Would need OS-level metrics
      },
    };
  }

  /**
   * Get metrics history for charting
   */
  static async getMetricsHistory(
    metricType: string,
    hoursBack: number = 24
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    return await db
      .select()
      .from(adminMetrics)
      .where(gte(adminMetrics.recordedAt, cutoffTime))
      .orderBy(adminMetrics.recordedAt);
  }

  /**
   * Get connection timeline
   */
  static async getConnectionTimeline(hoursBack: number = 24) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    const connections = await db
      .select()
      .from(websocketConnections)
      .where(gte(websocketConnections.createdAt, cutoffTime))
      .orderBy(websocketConnections.createdAt);

    // Group by hour
    const timeline = connections.reduce(
      (acc, conn) => {
        const hour = new Date(conn.createdAt).toISOString().slice(0, 13);
        if (!acc[hour]) acc[hour] = 0;
        acc[hour]++;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(timeline).map(([time, count]) => ({
      time,
      connections: count,
    }));
  }

  /**
   * Get system alerts
   */
  static async getSystemAlerts() {
    const metrics = await this.getCurrentMetrics();
    const alerts = [];

    if (metrics.errorRate > 5) {
      alerts.push({
        severity: "critical",
        message: `High error rate detected: ${metrics.errorRate.toFixed(2)}%`,
        timestamp: new Date(),
      });
    }

    if (metrics.averageLatency > 1000) {
      alerts.push({
        severity: "warning",
        message: `High latency detected: ${metrics.averageLatency.toFixed(0)}ms`,
        timestamp: new Date(),
      });
    }

    if (metrics.activeConnections > 10000) {
      alerts.push({
        severity: "info",
        message: `High connection count: ${metrics.activeConnections}`,
        timestamp: new Date(),
      });
    }

    if (metrics.systemHealth < 50) {
      alerts.push({
        severity: "critical",
        message: `System health critical: ${metrics.systemHealth.toFixed(0)}%`,
        timestamp: new Date(),
      });
    }

    return alerts;
  }
}
