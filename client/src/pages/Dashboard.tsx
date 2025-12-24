/*
 * COAI Dashboard Overview Page
 * Key metrics, compliance status, recent activity
 * Clean card-based layout following Open WebUI aesthetic
 */

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  FileCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";

const metrics = [
  {
    title: "Compliance Score",
    value: "78%",
    change: "+5%",
    changeType: "positive",
    icon: Shield,
    color: "text-emerald-500",
  },
  {
    title: "Active AI Systems",
    value: "12",
    change: "3 pending",
    changeType: "neutral",
    icon: Activity,
    color: "text-blue-500",
  },
  {
    title: "Open Issues",
    value: "7",
    change: "-2",
    changeType: "positive",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  {
    title: "Agent Votes Today",
    value: "156",
    change: "+23",
    changeType: "positive",
    icon: Users,
    color: "text-purple-500",
  },
];

const frameworkCompliance = [
  { name: "EU AI Act", score: 72, status: "In Progress" },
  { name: "NIST AI RMF", score: 85, status: "Compliant" },
  { name: "TC260", score: 68, status: "In Progress" },
];

const recentActivity = [
  {
    action: "Risk assessment completed",
    system: "Customer Service Bot",
    time: "2 hours ago",
    status: "success",
  },
  {
    action: "Watchdog report submitted",
    system: "Hiring Algorithm",
    time: "4 hours ago",
    status: "warning",
  },
  {
    action: "Council vote completed",
    system: "Content Moderation AI",
    time: "6 hours ago",
    status: "success",
  },
  {
    action: "Compliance gap identified",
    system: "Fraud Detection System",
    time: "8 hours ago",
    status: "error",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold font-primary">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Overview of your AI safety governance status
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <Card className="bg-card border-border hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-semibold mt-1">
                          {metric.value}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            metric.changeType === "positive"
                              ? "text-emerald-500"
                              : metric.changeType === "negative"
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {metric.change}
                        </p>
                      </div>
                      <div
                        className={`p-2 rounded-lg bg-secondary ${metric.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Framework Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Framework Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {frameworkCompliance.map((framework) => (
                  <div key={framework.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{framework.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          framework.status === "Compliant"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {framework.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={framework.score} className="h-2" />
                      <span className="text-sm font-medium w-10">
                        {framework.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-sm py-2 border-b border-border last:border-0"
                    >
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-emerald-500"
                            : activity.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{activity.action}</p>
                        <p className="text-muted-foreground text-xs">
                          {activity.system}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
