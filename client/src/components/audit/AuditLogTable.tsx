import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

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

interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading?: boolean;
  onRowClick?: (log: AuditLog) => void;
  onExport?: () => void;
}

type SortField = "timestamp" | "action" | "resource" | "status";
type SortOrder = "asc" | "desc";

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  isLoading = false,
  onRowClick,
  onExport,
}) => {
  const { language } = useLanguage();
  const t = (key: string) => translations[language][key] || key;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Filter and sort logs
  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = !filterAction || log.action === filterAction;
      const matchesStatus = !filterStatus || log.status === filterStatus;

      return matchesSearch && matchesAction && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "timestamp") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === "success"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("auditTrail")}</CardTitle>
          <CardDescription>{t("loading")}</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">{t("loading")}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("auditTrail")}</CardTitle>
            <CardDescription>{filteredLogs.length} records</CardDescription>
          </div>
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              {t("export")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchLogs")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("action")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="success">{t("success")}</SelectItem>
              <SelectItem value="failure">{t("failure")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("timestamp")}
                >
                  <div className="flex items-center">
                    {t("timestamp")}
                    <SortIcon field="timestamp" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("action")}
                >
                  <div className="flex items-center">
                    {t("action")}
                    <SortIcon field="action" />
                  </div>
                </TableHead>
                <TableHead>{t("user")}</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("resource")}
                >
                  <div className="flex items-center">
                    {t("resource")}
                    <SortIcon field="resource" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    {t("status")}
                    <SortIcon field="status" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {t("noData")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    onClick={() => onRowClick?.(log)}
                    className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  >
                    <TableCell className="text-sm">
                      {new Date(log.timestamp).toLocaleString(language)}
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell className="text-sm">{log.userId}</TableCell>
                    <TableCell className="text-sm">
                      {log.resource}/{log.resourceId}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                        {log.status === "success" ? t("success") : t("failure")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
