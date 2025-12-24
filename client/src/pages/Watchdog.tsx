/*
 * COAI Watchdog Page
 * PUBLIC incident reporting - Full transparency for AI safety
 * "The Watchdog" - Creating jobs for AI Safety Analysts
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, AlertTriangle, User, Clock, CheckCircle2, MessageSquare, Plus, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "resolved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Resolved
        </Badge>
      );
    case "escalated":
    case "investigating":
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {status === "escalated" ? "Escalated" : "Investigating"}
        </Badge>
      );
    case "dismissed":
      return (
        <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/30">
          Dismissed
        </Badge>
      );
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">
          <Clock className="h-3 w-3 mr-1" />
          Under Review
        </Badge>
      );
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "text-red-500";
    case "high":
      return "text-amber-500";
    case "medium":
      return "text-blue-500";
    default:
      return "text-muted-foreground";
  }
};

const formatTimeAgo = (date: Date | string) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export default function Watchdog() {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    aiSystemName: "",
    companyName: "",
    incidentType: "other" as "bias" | "privacy" | "safety" | "misinformation" | "manipulation" | "other",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    reporterName: "",
    reporterEmail: "",
  });

  // Fetch real reports from API
  const { data: reports, isLoading, refetch } = trpc.watchdog.list.useQuery();
  
  // Submit mutation
  const submitReport = trpc.watchdog.submit.useMutation({
    onSuccess: () => {
      toast.success("Report submitted!", {
        description: "Your report is now PUBLIC and visible to everyone. The 33-agent council will review it.",
      });
      setIsSubmitOpen(false);
      setFormData({
        title: "",
        description: "",
        aiSystemName: "",
        companyName: "",
        incidentType: "other",
        severity: "medium",
        reporterName: "",
        reporterEmail: "",
      });
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to submit report", { description: error.message });
    },
  });

  // Upvote mutation
  const upvoteReport = trpc.watchdog.upvote.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Vote recorded!");
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }
    if (formData.description.length < 50) {
      toast.error("Description must be at least 50 characters");
      return;
    }
    submitReport.mutate(formData);
  };

  // Calculate stats from real data
  const stats = {
    openReports: reports?.filter(r => r.status === "submitted" || r.status === "under_review").length || 0,
    underReview: reports?.filter(r => r.status === "under_review" || r.status === "investigating").length || 0,
    resolved: reports?.filter(r => r.status === "resolved").length || 0,
    total: reports?.length || 0,
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-primary">The Watchdog</h1>
            <p className="text-muted-foreground text-sm">
              PUBLIC AI safety incident reporting - Full transparency for humanity
            </p>
          </div>
          <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Submit Public AI Safety Report
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm">
                  <strong>⚠️ Public Report:</strong> This report will be visible to everyone. 
                  The 33-agent council will analyze it, and human Watchdog Analysts will review if needed.
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="Brief title describing the AI safety issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description * (min 50 characters)</label>
                  <Textarea
                    placeholder="Detailed description of the AI safety incident. Include what happened, when, and any evidence you have."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{formData.description.length}/50 characters minimum</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">AI System Name</label>
                    <Input
                      placeholder="e.g., ChatGPT, Gemini, etc."
                      value={formData.aiSystemName}
                      onChange={(e) => setFormData({ ...formData, aiSystemName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input
                      placeholder="e.g., OpenAI, Google, etc."
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Incident Type</label>
                    <Select
                      value={formData.incidentType}
                      onValueChange={(v) => setFormData({ ...formData, incidentType: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bias">Bias / Discrimination</SelectItem>
                        <SelectItem value="privacy">Privacy Violation</SelectItem>
                        <SelectItem value="safety">Safety Concern</SelectItem>
                        <SelectItem value="misinformation">Misinformation</SelectItem>
                        <SelectItem value="manipulation">Manipulation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select
                      value={formData.severity}
                      onValueChange={(v) => setFormData({ ...formData, severity: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Name (optional)</label>
                    <Input
                      placeholder="Anonymous if left blank"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Email (optional)</label>
                    <Input
                      type="email"
                      placeholder="For follow-up only"
                      value={formData.reporterEmail}
                      onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  className="w-full gap-2"
                  disabled={submitReport.isPending}
                >
                  {submitReport.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Submit Public Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Open Reports", value: stats.openReports.toString(), change: "Awaiting review" },
            { label: "Under Review", value: stats.underReview.toString(), change: "By human analysts" },
            { label: "Resolved", value: stats.resolved.toString(), change: "Issues addressed" },
            { label: "Total Reports", value: stats.total.toString(), change: "Public database" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Reports List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Public Reports Database
              <Badge variant="outline" className="ml-2">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report, idx) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.03 }}
                    className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{report.title}</h4>
                          <span className={`text-xs font-medium uppercase ${getSeverityColor(report.severity)}`}>
                            {report.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {report.reporterName || "Anonymous"}
                          </span>
                          {report.companyName && (
                            <>
                              <span>•</span>
                              <span>{report.companyName}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatTimeAgo(report.createdAt)}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {report.incidentType}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {getStatusBadge(report.status)}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <button
                            onClick={() => upvoteReport.mutate({ reportId: report.id })}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {report.upvotes}
                          </button>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            0
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No reports yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to report an AI safety concern. All reports are public.
                </p>
                <Button onClick={() => setIsSubmitOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
