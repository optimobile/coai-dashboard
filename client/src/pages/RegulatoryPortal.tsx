/**
 * Regulatory Authority Portal
 * Real-time compliance monitoring and enforcement tracking for regulators
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Download,
  Eye,
} from "lucide-react";

interface ComplianceStatus {
  id: string;
  systemName: string;
  organization: string;
  status: "compliant" | "at-risk" | "non-compliant" | "under-review";
  lastAudit: string;
  complianceScore: number;
  frameworks: string[];
}

interface EnforcementAction {
  id: string;
  systemName: string;
  organization: string;
  action: "warning" | "suspension" | "remediation" | "closure";
  date: string;
  reason: string;
  status: "open" | "in-progress" | "resolved";
}

const mockComplianceData: ComplianceStatus[] = [
  {
    id: "1",
    systemName: "SafetyAnalyzer Pro",
    organization: "TechCorp Inc",
    status: "compliant",
    lastAudit: "2025-12-15",
    complianceScore: 92,
    frameworks: ["EU AI Act", "NIST", "TC260"],
  },
  {
    id: "2",
    systemName: "RiskAssess AI",
    organization: "FinanceGlobal",
    status: "at-risk",
    lastAudit: "2025-11-20",
    complianceScore: 68,
    frameworks: ["EU AI Act", "NIST"],
  },
  {
    id: "3",
    systemName: "ContentFilter X",
    organization: "MediaCorp",
    status: "non-compliant",
    lastAudit: "2025-10-10",
    complianceScore: 35,
    frameworks: ["EU AI Act"],
  },
];

const mockEnforcementActions: EnforcementAction[] = [
  {
    id: "1",
    systemName: "DataMiner 3000",
    organization: "DataSystems Ltd",
    action: "warning",
    date: "2025-12-20",
    reason: "Inadequate transparency measures",
    status: "open",
  },
  {
    id: "2",
    systemName: "AutoDecide AI",
    organization: "GovernanceAI",
    action: "remediation",
    date: "2025-12-10",
    reason: "Missing human oversight mechanisms",
    status: "in-progress",
  },
  {
    id: "3",
    systemName: "LegacySystem",
    organization: "OldTech Corp",
    action: "suspension",
    date: "2025-11-30",
    reason: "Repeated non-compliance",
    status: "resolved",
  },
];

const complianceTrendData = [
  { month: "Jan", compliant: 85, "at-risk": 10, "non-compliant": 5 },
  { month: "Feb", compliant: 87, "at-risk": 9, "non-compliant": 4 },
  { month: "Mar", compliant: 89, "at-risk": 8, "non-compliant": 3 },
  { month: "Apr", compliant: 91, "at-risk": 7, "non-compliant": 2 },
  { month: "May", compliant: 92, "at-risk": 6, "non-compliant": 2 },
  { month: "Jun", compliant: 93, "at-risk": 5, "non-compliant": 2 },
];

const frameworkDistribution = [
  { name: "EU AI Act", value: 156 },
  { name: "NIST", value: 142 },
  { name: "TC260", value: 98 },
  { name: "Other", value: 54 },
];

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function RegulatoryPortal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredCompliance = mockComplianceData.filter((item) => {
    const matchesSearch =
      item.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "at-risk":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "non-compliant":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "under-review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "suspension":
        return "bg-red-100 text-red-800";
      case "remediation":
        return "bg-blue-100 text-blue-800";
      case "closure":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Regulatory Authority Portal</h1>
          <p className="text-muted-foreground">
            Real-time compliance monitoring and enforcement tracking
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Systems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">450</div>
              <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">418</div>
              <p className="text-xs text-muted-foreground mt-1">92.9% compliance rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                At Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">22</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Enforcement Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">10</div>
              <p className="text-xs text-muted-foreground mt-1">Active cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Compliance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Trend</CardTitle>
              <CardDescription>6-month compliance status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={complianceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="compliant" stackId="a" fill="#10b981" />
                  <Bar dataKey="at-risk" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="non-compliant" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Framework Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Framework Distribution</CardTitle>
              <CardDescription>Systems by compliance framework</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={frameworkDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {frameworkDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="compliance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
            <TabsTrigger value="enforcement">Enforcement Actions</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          {/* Compliance Status Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>AI Systems Compliance Status</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Search systems or organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Filters */}
                <div className="flex gap-2 flex-wrap">
                  {["compliant", "at-risk", "non-compliant", "under-review"].map((status) => (
                    <Badge
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        setStatusFilter(statusFilter === status ? null : status)
                      }
                    >
                      {status.replace("-", " ").toUpperCase()}
                    </Badge>
                  ))}
                </div>

                {/* Systems List */}
                <div className="space-y-2">
                  {filteredCompliance.map((system) => (
                    <div
                      key={system.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{system.systemName}</h3>
                        <p className="text-sm text-muted-foreground">{system.organization}</p>
                        <div className="flex gap-2 mt-2">
                          {system.frameworks.map((fw) => (
                            <Badge key={fw} variant="secondary" className="text-xs">
                              {fw}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{system.complianceScore}%</div>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>

                        <Badge className={getStatusColor(system.status)}>
                          {system.status.replace("-", " ").toUpperCase()}
                        </Badge>

                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enforcement Actions Tab */}
          <TabsContent value="enforcement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enforcement Actions</CardTitle>
                <CardDescription>Active and resolved enforcement cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockEnforcementActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{action.systemName}</h3>
                        <p className="text-sm text-muted-foreground">{action.organization}</p>
                        <p className="text-sm mt-1">{action.reason}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getActionColor(action.action)}>
                            {action.action.toUpperCase()}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{action.date}</p>
                        </div>

                        <Badge
                          variant={
                            action.status === "resolved"
                              ? "secondary"
                              : action.status === "in-progress"
                                ? "default"
                                : "outline"
                          }
                        >
                          {action.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete history of regulatory actions and decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Audit trail data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
