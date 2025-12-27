import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  status: "success" | "failure";
  ipAddress?: string;
  userAgent?: string;
}

interface AuditStats {
  totalEvents: number;
  successCount: number;
  failureCount: number;
  uniqueUsers: number;
}

export const AuditTrail: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => translations[language][key] || key;

  const [isLoading, setIsLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalEvents: 0,
    successCount: 0,
    failureCount: 0,
    uniqueUsers: 0,
  });
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dateRange, setDateRange] = useState("7days");

  // Mock data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const mockLogs: AuditLog[] = [
        {
          id: "1",
          userId: "user@example.com",
          action: "create",
          resource: "ai_system",
          resourceId: "system-001",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: "success",
          ipAddress: "192.168.1.100",
        },
        {
          id: "2",
          userId: "admin@example.com",
          action: "update",
          resource: "compliance_assessment",
          resourceId: "assessment-042",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: "success",
          ipAddress: "192.168.1.101",
        },
        {
          id: "3",
          userId: "user@example.com",
          action: "delete",
          resource: "report",
          resourceId: "report-123",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          status: "failure",
          ipAddress: "192.168.1.100",
        },
        {
          id: "4",
          userId: "auditor@example.com",
          action: "view",
          resource: "audit_log",
          resourceId: "log-all",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: "success",
          ipAddress: "192.168.1.102",
        },
        {
          id: "5",
          userId: "admin@example.com",
          action: "export",
          resource: "compliance_data",
          resourceId: "export-001",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: "success",
          ipAddress: "192.168.1.101",
        },
      ];

      setAuditLogs(mockLogs);
      setStats({
        totalEvents: mockLogs.length,
        successCount: mockLogs.filter((l) => l.status === "success").length,
        failureCount: mockLogs.filter((l) => l.status === "failure").length,
        uniqueUsers: new Set(mockLogs.map((l) => l.userId)).size,
      });

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExport = () => {
    const csv = [
      ["ID", "User", "Action", "Resource", "Timestamp", "Status"],
      ...auditLogs.map((log) => [
        log.id,
        log.userId,
        log.action,
        `${log.resource}/${log.resourceId}`,
        new Date(log.timestamp).toISOString(),
        log.status,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const actionCounts = auditLogs.reduce(
    (acc, log) => {
      const existing = acc.find((item) => item.action === log.action);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ action: log.action, count: 1 });
      }
      return acc;
    },
    [] as { action: string; count: number }[]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("auditTrail")}</h1>
          <p className="text-muted-foreground mt-1">Security event tracking and compliance</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          {t("export")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("success")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("failure")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failureCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hours">Last 24 Hours</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Action Distribution</CardTitle>
          <CardDescription>Events by action type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={actionCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="action" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <AuditLogTable
        logs={auditLogs}
        isLoading={isLoading}
        onRowClick={setSelectedLog}
        onExport={handleExport}
      />

      {/* Detailed View */}
      {selectedLog && (
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Detailed information for selected event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Event ID</div>
                <div className="font-mono text-sm">{selectedLog.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">User</div>
                <div className="font-mono text-sm">{selectedLog.userId}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Action</div>
                <div className="font-mono text-sm">{selectedLog.action}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Resource</div>
                <div className="font-mono text-sm">
                  {selectedLog.resource}/{selectedLog.resourceId}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Timestamp</div>
                <div className="font-mono text-sm">
                  {new Date(selectedLog.timestamp).toISOString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div
                  className={`font-mono text-sm font-medium ${
                    selectedLog.status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedLog.status}
                </div>
              </div>
              {selectedLog.ipAddress && (
                <div>
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-mono text-sm">{selectedLog.ipAddress}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
