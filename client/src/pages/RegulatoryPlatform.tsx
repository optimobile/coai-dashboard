import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Users } from "lucide-react";

export default function RegulatoryPlatform() {
  const stats = [
    { label: "Enterprises Monitored", value: "4,892", icon: Users, change: "+12% this month" },
    { label: "AI Systems Tracked", value: "18,456", icon: BarChart3, change: "+8% this month" },
    { label: "Compliance Rate", value: "87%", icon: CheckCircle, change: "+3% this month" },
    { label: "Incidents Reported", value: "1,247", icon: AlertCircle, change: "+5% this month" },
  ];

  const complianceByFramework = [
    { framework: "EU AI Act", compliance: 92, enterprises: 3200 },
    { framework: "NIST AI RMF", compliance: 85, enterprises: 2100 },
    { framework: "ISO 42001", compliance: 78, enterprises: 1800 },
    { framework: "TC260 (China)", compliance: 88, enterprises: 1400 },
  ];

  const recentIncidents = [
    {
      id: 1,
      title: "Facial Recognition Bias",
      enterprise: "EU Border Control",
      severity: "Critical",
      status: "Under Investigation",
      date: "2025-12-20",
    },
    {
      id: 2,
      title: "Loan Approval Discrimination",
      enterprise: "FinTech Lending",
      severity: "High",
      status: "Verified",
      date: "2025-12-18",
    },
    {
      id: 3,
      title: "Healthcare Triage Bias",
      enterprise: "Hospital Network",
      severity: "High",
      status: "Verified",
      date: "2025-12-15",
    },
    {
      id: 4,
      title: "Recruitment Filtering",
      enterprise: "HR Platform",
      severity: "Medium",
      status: "Under Investigation",
      date: "2025-12-10",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Regulatory Platform</h1>
          <p className="text-lg text-muted-foreground">
            Government oversight dashboard for AI system compliance monitoring and enforcement
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className="w-6 h-6 text-primary opacity-20" />
                </div>
                <p className="text-xs text-green-600">{stat.change}</p>
              </Card>
            );
          })}
        </div>

        {/* Compliance by Framework */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Compliance by Framework</h2>
          <div className="space-y-6">
            {complianceByFramework.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.framework}</h3>
                    <p className="text-sm text-muted-foreground">{item.enterprises} enterprises</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{item.compliance}%</span>
                </div>
                <Progress value={item.compliance} className="h-3" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Incidents */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Incidents</h2>
          <div className="space-y-4">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground">{incident.enterprise}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge variant="outline">{incident.status}</Badge>
                  <span className="text-sm text-muted-foreground">{incident.date}</span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Enforcement Actions */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Enforcement Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-bold text-foreground mb-2">Warnings Issued</h3>
              <p className="text-3xl font-bold text-orange-600">23</p>
              <p className="text-sm text-muted-foreground mt-2">Enterprises with 30-day compliance deadline</p>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-bold text-foreground mb-2">Fines Levied</h3>
              <p className="text-3xl font-bold text-red-600">€12.5M</p>
              <p className="text-sm text-muted-foreground mt-2">Total penalties for non-compliance</p>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-bold text-foreground mb-2">Systems Suspended</h3>
              <p className="text-3xl font-bold text-red-700">7</p>
              <p className="text-sm text-muted-foreground mt-2">High-risk systems taken offline</p>
            </div>
          </div>
        </Card>

        {/* Framework Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">EU AI Act (Article 14)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              High-risk AI systems must have human oversight. CSOAI provides the infrastructure for
              mandatory human review and approval of AI decisions.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Real-time monitoring</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Audit trail generation</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Compliance reporting</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              View EU AI Act Requirements
            </Button>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-foreground mb-4">NIST AI Risk Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              NIST framework (GOVERN, MAP, MEASURE, MANAGE) provides structured approach to AI risk.
              CSOAI implements all four phases with automated assessment and reporting.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Governance framework</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Risk mapping</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Impact measurement</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full">
              View NIST Framework
            </Button>
          </Card>
        </div>

        {/* Reporting Tools */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Regulatory Reporting Tools</h2>
          <p className="text-muted-foreground mb-6">
            Generate compliance reports, enforcement data, and incident summaries for regulatory filings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Generate Compliance Report
            </Button>
            <Button className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Export Enforcement Data
            </Button>
            <Button className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Incident Summary
            </Button>
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Enterprise Directory
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

