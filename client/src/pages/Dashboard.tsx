/*
 * COAI Dashboard Overview Page
 * Key metrics, compliance status, recent activity
 * Clean card-based layout with enhanced visuals
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
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

const metrics = [
  {
    title: "Compliance Score",
    value: "78%",
    change: "+5%",
    changeType: "positive",
    icon: Shield,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    description: "Overall compliance across frameworks",
  },
  {
    title: "Active AI Systems",
    value: "12",
    change: "3 pending review",
    changeType: "neutral",
    icon: Activity,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Registered systems in your organization",
  },
  {
    title: "Open Issues",
    value: "7",
    change: "-2 from last week",
    changeType: "positive",
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    description: "Compliance gaps requiring attention",
  },
  {
    title: "Agent Votes Today",
    value: "156",
    change: "+23 from yesterday",
    changeType: "positive",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "33-Agent Council decisions",
  },
];

const frameworkCompliance = [
  { name: "EU AI Act", score: 72, status: "In Progress", deadline: "Aug 2026", articles: 113 },
  { name: "NIST AI RMF", score: 85, status: "Compliant", deadline: "Voluntary", articles: 72 },
  { name: "TC260", score: 68, status: "In Progress", deadline: "Q2 2025", articles: 56 },
];

const recentActivity = [
  {
    action: "Risk assessment completed",
    system: "Customer Service Bot",
    time: "2 hours ago",
    status: "success",
    icon: CheckCircle2,
  },
  {
    action: "Watchdog report submitted",
    system: "Hiring Algorithm",
    time: "4 hours ago",
    status: "warning",
    icon: Eye,
  },
  {
    action: "Council vote completed",
    system: "Content Moderation AI",
    time: "6 hours ago",
    status: "success",
    icon: Users,
  },
  {
    action: "Compliance gap identified",
    system: "Fraud Detection System",
    time: "8 hours ago",
    status: "error",
    icon: AlertTriangle,
  },
];

const quickActions = [
  { label: "Register AI System", href: "/ai-systems", icon: Shield },
  { label: "Run Assessment", href: "/risk-assessment", icon: FileCheck },
  { label: "View Council", href: "/agent-council", icon: Users },
  { label: "Check Watchdog", href: "/watchdog", icon: Eye },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-primary">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Overview of your AI safety governance status
            </p>
          </div>
          <div className="flex items-center gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation(action.href)}
                  className="hidden md:flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
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
                <Card className="bg-card border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground font-medium">
                          {metric.title}
                        </p>
                        <p className="text-3xl font-bold mt-1 tracking-tight">
                          {metric.value}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          {metric.changeType === "positive" ? (
                            <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                          ) : metric.changeType === "negative" ? (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          ) : null}
                          <p
                            className={`text-xs ${
                              metric.changeType === "positive"
                                ? "text-emerald-600"
                                : metric.changeType === "negative"
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {metric.change}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-xl ${metric.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${metric.color}`} />
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
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Framework Compliance
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setLocation("/compliance")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {frameworkCompliance.map((framework) => (
                  <div key={framework.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{framework.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({framework.articles} requirements)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            framework.status === "Compliant"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {framework.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={framework.score} className="h-2 flex-1" />
                      <span className="text-sm font-semibold w-12 text-right">
                        {framework.score}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Deadline: {framework.deadline}
                    </p>
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
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setLocation("/reports")}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {recentActivity.map((activity, idx) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div
                          className={`mt-0.5 p-1.5 rounded-full ${
                            activity.status === "success"
                              ? "bg-emerald-100 text-emerald-600"
                              : activity.status === "warning"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{activity.action}</p>
                          <p className="text-muted-foreground text-xs">
                            {activity.system}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {activity.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* PDCA Loop Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                SOAI-PDCA Continuous Improvement Loop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { phase: "PLAN", status: "Complete", items: "9 action items", color: "bg-blue-500" },
                  { phase: "DO", status: "In Progress", items: "5 implementing", color: "bg-emerald-500" },
                  { phase: "CHECK", status: "Pending", items: "3 assessments", color: "bg-amber-500" },
                  { phase: "ACT", status: "Queued", items: "2 improvements", color: "bg-purple-500" },
                ].map((item, idx) => (
                  <div
                    key={item.phase}
                    className="relative p-4 rounded-lg bg-secondary/50 text-center"
                  >
                    <div className={`w-2 h-2 rounded-full ${item.color} absolute top-3 right-3`} />
                    <p className="font-bold text-lg">{item.phase}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.status}</p>
                    <p className="text-xs font-medium mt-2">{item.items}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
