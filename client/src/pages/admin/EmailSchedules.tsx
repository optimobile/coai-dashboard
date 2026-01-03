import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Mail,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Eye,
} from "lucide-react";

interface EmailSchedule {
  id: number;
  name: string;
  description: string;
  templateKey: string;
  triggerType: "user_activity" | "time_based" | "manual";
  isActive: boolean;
  priority: "low" | "normal" | "high" | "urgent";
  sendCount: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
}

interface ScheduleRun {
  id: number;
  scheduleId: number;
  runType: "scheduled" | "manual" | "test";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  targetUserCount: number;
  emailsSent: number;
  emailsFailed: number;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
}

export default function EmailSchedules() {
  const [schedules, setSchedules] = useState<EmailSchedule[]>([
    {
      id: 1,
      name: "Welcome Email Series",
      description: "Send welcome email 1 hour after user signup",
      templateKey: "welcome_email",
      triggerType: "user_activity",
      isActive: true,
      priority: "high",
      sendCount: 1247,
      lastRunAt: "2026-01-02T14:30:00",
      nextRunAt: null,
      createdAt: "2025-12-01T10:00:00",
    },
    {
      id: 2,
      name: "Weekly Compliance Digest",
      description: "Send compliance updates every Monday at 9 AM",
      templateKey: "compliance_digest",
      triggerType: "time_based",
      isActive: true,
      priority: "normal",
      sendCount: 428,
      lastRunAt: "2025-12-30T09:00:00",
      nextRunAt: "2026-01-06T09:00:00",
      createdAt: "2025-11-15T08:00:00",
    },
    {
      id: 3,
      name: "Course Completion Certificate",
      description: "Send certificate immediately after course completion",
      templateKey: "certificate_email",
      triggerType: "user_activity",
      isActive: true,
      priority: "high",
      sendCount: 892,
      lastRunAt: "2026-01-02T16:45:00",
      nextRunAt: null,
      createdAt: "2025-10-20T12:00:00",
    },
    {
      id: 4,
      name: "Inactivity Re-engagement",
      description: "Send reminder to users inactive for 14 days",
      templateKey: "reengagement_email",
      triggerType: "user_activity",
      isActive: false,
      priority: "low",
      sendCount: 156,
      lastRunAt: "2025-12-28T10:00:00",
      nextRunAt: null,
      createdAt: "2025-11-01T14:00:00",
    },
  ]);

  const [runs, setRuns] = useState<ScheduleRun[]>([
    {
      id: 1,
      scheduleId: 1,
      runType: "scheduled",
      status: "completed",
      targetUserCount: 45,
      emailsSent: 45,
      emailsFailed: 0,
      startedAt: "2026-01-02T14:30:00",
      completedAt: "2026-01-02T14:32:15",
      errorMessage: null,
    },
    {
      id: 2,
      scheduleId: 2,
      runType: "scheduled",
      status: "completed",
      targetUserCount: 1834,
      emailsSent: 1828,
      emailsFailed: 6,
      startedAt: "2025-12-30T09:00:00",
      completedAt: "2025-12-30T09:15:42",
      errorMessage: "6 emails failed due to invalid addresses",
    },
    {
      id: 3,
      scheduleId: 3,
      runType: "scheduled",
      status: "running",
      targetUserCount: 12,
      emailsSent: 8,
      emailsFailed: 0,
      startedAt: "2026-01-02T16:45:00",
      completedAt: null,
      errorMessage: null,
    },
  ]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewRunsDialogOpen, setViewRunsDialogOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleToggleActive = (id: number) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id ? { ...schedule, isActive: !schedule.isActive } : schedule
      )
    );
    toast.success("Schedule status updated");
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id));
    toast.success("Schedule deleted successfully");
  };

  const handleViewRuns = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
    setViewRunsDialogOpen(true);
  };

  const handleRunNow = (id: number) => {
    const schedule = schedules.find((s) => s.id === id);
    toast.success(`Manually triggered: ${schedule?.name}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "high":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      case "normal":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "low":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "running":
        return <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const filteredSchedules =
    filterStatus === "all"
      ? schedules
      : schedules.filter((s) => (filterStatus === "active" ? s.isActive : !s.isActive));

  const selectedScheduleRuns = runs.filter((run) => run.scheduleId === selectedScheduleId);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8 animate-fade-in-scale">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Email Schedules</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage automated email campaigns and triggers
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Schedule
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Schedules</p>
                <p className="text-3xl font-display font-bold mt-1">{schedules.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active</p>
                <p className="text-3xl font-display font-bold mt-1">
                  {schedules.filter((s) => s.isActive).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Emails Sent</p>
                <p className="text-3xl font-display font-bold mt-1">
                  {schedules.reduce((sum, s) => sum + s.sendCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Scheduled Next</p>
                <p className="text-3xl font-display font-bold mt-1">
                  {schedules.filter((s) => s.nextRunAt).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schedules</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Schedules Table */}
        <Card className="overflow-hidden card-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Schedule Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Sent</TableHead>
                <TableHead className="font-semibold">Last Run</TableHead>
                <TableHead className="font-semibold">Next Run</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-semibold">{schedule.name}</p>
                      <p className="text-sm text-muted-foreground">{schedule.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {schedule.triggerType.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getPriorityColor(schedule.priority)}>
                      {schedule.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={schedule.isActive}
                        onCheckedChange={() => handleToggleActive(schedule.id)}
                      />
                      <span className="text-sm">
                        {schedule.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {schedule.sendCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {schedule.lastRunAt
                      ? new Date(schedule.lastRunAt).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {schedule.nextRunAt
                      ? new Date(schedule.nextRunAt).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRuns(schedule.id)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Runs
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRunNow(schedule.id)}
                        className="gap-1"
                      >
                        <Play className="h-4 w-4" />
                        Run
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Edit feature coming soon")}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Create Schedule Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Create Email Schedule</DialogTitle>
              <DialogDescription>
                Set up a new automated email campaign with triggers and conditions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name</Label>
                <Input id="name" placeholder="e.g., Welcome Email Series" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe when and why this email is sent"
                  rows={3}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="triggerType">Trigger Type</Label>
                  <Select defaultValue="user_activity">
                    <SelectTrigger id="triggerType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user_activity">User Activity</SelectItem>
                      <SelectItem value="time_based">Time-Based (Cron)</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Email Template</Label>
                <Select defaultValue="welcome_email">
                  <SelectTrigger id="template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome_email">Welcome Email</SelectItem>
                    <SelectItem value="compliance_digest">Compliance Digest</SelectItem>
                    <SelectItem value="certificate_email">Certificate Email</SelectItem>
                    <SelectItem value="reengagement_email">Re-engagement Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select defaultValue="all_users">
                  <SelectTrigger id="targetAudience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">All Users</SelectItem>
                    <SelectItem value="cohort">Specific Cohort</SelectItem>
                    <SelectItem value="course_enrollees">Course Enrollees</SelectItem>
                    <SelectItem value="inactive_users">Inactive Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cronExpression">Cron Expression (for time-based)</Label>
                <Input
                  id="cronExpression"
                  placeholder="e.g., 0 9 * * 1 (Every Monday at 9 AM)"
                />
                <p className="text-xs text-muted-foreground">
                  Use cron syntax for time-based schedules
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Schedule created successfully");
                  setCreateDialogOpen(false);
                }}
              >
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Runs Dialog */}
        <Dialog open={viewRunsDialogOpen} onOpenChange={setViewRunsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Schedule Run History</DialogTitle>
              <DialogDescription>
                View execution history and performance metrics for this schedule
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedScheduleRuns.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No runs recorded yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Failed</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedScheduleRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(run.status)}
                            <span className="capitalize">{run.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {run.runType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {run.targetUserCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-green-600 dark:text-green-400 font-semibold">
                          {run.emailsSent.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-red-600 dark:text-red-400 font-semibold">
                          {run.emailsFailed.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {run.startedAt
                            ? new Date(run.startedAt).toLocaleString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {run.startedAt && run.completedAt
                            ? `${Math.round(
                                (new Date(run.completedAt).getTime() -
                                  new Date(run.startedAt).getTime()) /
                                  1000
                              )}s`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setViewRunsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
