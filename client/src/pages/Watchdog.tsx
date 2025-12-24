/*
 * COAI Watchdog Page
 * Public incident reporting and human review queue
 * "The Watchdog" - Creating jobs for AI Safety Analysts
 */

import { motion } from "framer-motion";
import { Eye, AlertTriangle, User, Clock, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const watchdogReports = [
  {
    id: 1,
    title: "Discriminatory loan decisions",
    description: "AI system appears to deny loans based on zip code, correlating with racial demographics",
    reporter: "Anonymous",
    company: "FinanceAI Corp",
    status: "Under Review",
    priority: "High",
    votes: 156,
    comments: 23,
    submitted: "2 days ago",
  },
  {
    id: 2,
    title: "Misleading health recommendations",
    description: "Chatbot providing medical advice without proper disclaimers or professional oversight",
    reporter: "Dr. Sarah Chen",
    company: "HealthBot Inc",
    status: "Escalated",
    priority: "Critical",
    votes: 342,
    comments: 67,
    submitted: "5 days ago",
  },
  {
    id: 3,
    title: "Privacy violation in facial recognition",
    description: "System storing biometric data without explicit user consent",
    reporter: "Privacy Watch Group",
    company: "SecureScan Ltd",
    status: "Resolved",
    priority: "High",
    votes: 89,
    comments: 12,
    submitted: "1 week ago",
  },
  {
    id: 4,
    title: "Bias in content moderation",
    description: "Disproportionate removal of content from certain language groups",
    reporter: "Digital Rights Org",
    company: "SocialPlatform",
    status: "Under Review",
    priority: "Medium",
    votes: 234,
    comments: 45,
    submitted: "3 days ago",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Resolved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Resolved
        </Badge>
      );
    case "Escalated":
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Escalated
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "text-red-500";
    case "High":
      return "text-amber-500";
    case "Medium":
      return "text-blue-500";
    default:
      return "text-muted-foreground";
  }
};

export default function Watchdog() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-primary">The Watchdog</h1>
            <p className="text-muted-foreground text-sm">
              Public AI safety incident reporting and human review queue
            </p>
          </div>
          <Button
            onClick={() => toast.info("Feature coming soon", { description: "Submit a new Watchdog report" })}
            className="gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Submit Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Open Reports", value: "47", change: "+12 this week" },
            { label: "Under Review", value: "23", change: "By human analysts" },
            { label: "Resolved", value: "156", change: "This month" },
            { label: "Avg Resolution", value: "4.2 days", change: "-0.8 days" },
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
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {watchdogReports.map((report, idx) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                  className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{report.title}</h4>
                        <span className={`text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {report.reporter}
                        </span>
                        <span>•</span>
                        <span>{report.company}</span>
                        <span>•</span>
                        <span>{report.submitted}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {getStatusBadge(report.status)}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {report.votes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {report.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
