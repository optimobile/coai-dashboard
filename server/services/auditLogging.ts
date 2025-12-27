export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure";
  errorMessage?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, { before: unknown; after: unknown }>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface AuditFilter {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class AuditLoggingService {
  private static logs: AuditLog[] = [];

  /**
   * Log an audit event
   */
  static async logEvent(event: AuditEvent): Promise<void> {
    try {
      const log: AuditLog = {
        id: event.id,
        userId: event.userId,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId,
        changes: event.changes || {},
        timestamp: event.timestamp,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
      };

      // In production, this would be saved to database
      this.logs.push(log);

      // Keep only last 10000 logs in memory
      if (this.logs.length > 10000) {
        this.logs = this.logs.slice(-10000);
      }

      console.log(
        `[AUDIT] ${event.action} on ${event.resource}/${event.resourceId} by ${event.userId}`
      );
    } catch (error) {
      console.error("Error logging audit event:", error);
    }
  }

  /**
   * Get audit logs with filtering
   */
  static async getAuditLogs(filter: AuditFilter): Promise<AuditLog[]> {
    try {
      let filtered = [...this.logs];

      if (filter.userId) {
        filtered = filtered.filter((log) => log.userId === filter.userId);
      }

      if (filter.action) {
        filtered = filtered.filter((log) =>
          log.action.toLowerCase().includes(filter.action!.toLowerCase())
        );
      }

      if (filter.resource) {
        filtered = filtered.filter((log) =>
          log.resource.toLowerCase().includes(filter.resource!.toLowerCase())
        );
      }

      if (filter.startDate) {
        filtered = filtered.filter((log) => log.timestamp >= filter.startDate!);
      }

      if (filter.endDate) {
        filtered = filtered.filter((log) => log.timestamp <= filter.endDate!);
      }

      // Sort by timestamp descending
      filtered.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      // Apply pagination
      const offset = filter.offset || 0;
      const limit = filter.limit || 50;

      return filtered.slice(offset, offset + limit);
    } catch (error) {
      console.error("Error retrieving audit logs:", error);
      return [];
    }
  }

  /**
   * Get audit log by ID
   */
  static async getAuditLog(id: string): Promise<AuditLog | null> {
    try {
      return this.logs.find((log) => log.id === id) || null;
    } catch (error) {
      console.error("Error retrieving audit log:", error);
      return null;
    }
  }

  /**
   * Search audit logs
   */
  static async searchAuditLogs(query: string): Promise<AuditLog[]> {
    try {
      const lowerQuery = query.toLowerCase();
      return this.logs.filter(
        (log) =>
          log.userId.toLowerCase().includes(lowerQuery) ||
          log.action.toLowerCase().includes(lowerQuery) ||
          log.resource.toLowerCase().includes(lowerQuery) ||
          log.resourceId.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error("Error searching audit logs:", error);
      return [];
    }
  }

  /**
   * Get audit statistics
   */
  static async getAuditStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, unknown>> {
    try {
      let filtered = [...this.logs];

      if (startDate) {
        filtered = filtered.filter((log) => log.timestamp >= startDate);
      }

      if (endDate) {
        filtered = filtered.filter((log) => log.timestamp <= endDate);
      }

      // Count by action
      const actionCounts = new Map<string, number>();
      filtered.forEach((log) => {
        actionCounts.set(
          log.action,
          (actionCounts.get(log.action) || 0) + 1
        );
      });

      // Count by resource
      const resourceCounts = new Map<string, number>();
      filtered.forEach((log) => {
        resourceCounts.set(
          log.resource,
          (resourceCounts.get(log.resource) || 0) + 1
        );
      });

      // Count by user
      const userCounts = new Map<string, number>();
      filtered.forEach((log) => {
        userCounts.set(log.userId, (userCounts.get(log.userId) || 0) + 1);
      });

      return {
        totalEvents: filtered.length,
        uniqueUsers: userCounts.size,
        actionBreakdown: Object.fromEntries(actionCounts),
        resourceBreakdown: Object.fromEntries(resourceCounts),
        userBreakdown: Object.fromEntries(userCounts),
        dateRange: {
          start: startDate?.toISOString(),
          end: endDate?.toISOString(),
        },
      };
    } catch (error) {
      console.error("Error calculating audit statistics:", error);
      return {};
    }
  }

  /**
   * Generate audit report
   */
  static async generateAuditReport(
    startDate: Date,
    endDate: Date,
    resourceType?: string
  ): Promise<string> {
    try {
      let filtered = this.logs.filter(
        (log) => log.timestamp >= startDate && log.timestamp <= endDate
      );

      if (resourceType) {
        filtered = filtered.filter((log) => log.resource === resourceType);
      }

      const report: string[] = [];

      report.push("=== AUDIT REPORT ===");
      report.push(`Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
      report.push(`Total Events: ${filtered.length}`);
      report.push("");

      // Group by resource
      const byResource = new Map<string, AuditLog[]>();
      filtered.forEach((log) => {
        if (!byResource.has(log.resource)) {
          byResource.set(log.resource, []);
        }
        byResource.get(log.resource)!.push(log);
      });

      byResource.forEach((logs, resource) => {
        report.push(`\n${resource} (${logs.length} events)`);
        report.push("-".repeat(40));

        logs.forEach((log) => {
          report.push(
            `${log.timestamp.toISOString()} | ${log.action} | ${log.userId}`
          );
        });
      });

      return report.join("\n");
    } catch (error) {
      console.error("Error generating audit report:", error);
      return "";
    }
  }

  /**
   * Export audit logs
   */
  static async exportAuditLogs(
    format: "csv" | "json",
    filter?: AuditFilter
  ): Promise<string> {
    try {
      const logs = await this.getAuditLogs(filter || {});

      if (format === "csv") {
        const headers = [
          "ID",
          "User ID",
          "Action",
          "Resource",
          "Resource ID",
          "Timestamp",
          "IP Address",
        ];
        const rows = logs.map((log) => [
          log.id,
          log.userId,
          log.action,
          log.resource,
          log.resourceId,
          log.timestamp.toISOString(),
          log.ipAddress,
        ]);

        const csv = [
          headers.join(","),
          ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        return csv;
      } else {
        return JSON.stringify(logs, null, 2);
      }
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      return "";
    }
  }

  /**
   * Archive old logs
   */
  static async archiveOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const initialCount = this.logs.length;
      this.logs = this.logs.filter((log) => log.timestamp > cutoffDate);
      const archivedCount = initialCount - this.logs.length;

      console.log(`Archived ${archivedCount} audit logs older than ${daysToKeep} days`);

      return archivedCount;
    } catch (error) {
      console.error("Error archiving audit logs:", error);
      return 0;
    }
  }

  /**
   * Clear all logs (for testing only)
   */
  static clearAllLogs(): void {
    this.logs = [];
  }

  /**
   * Get log count
   */
  static getLogCount(): number {
    return this.logs.length;
  }
}
