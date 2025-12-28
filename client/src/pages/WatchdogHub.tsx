import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, TrendingUp, Users, Filter, Search } from "lucide-react";

export default function WatchdogHub() {
  // Mock incident data
  const incidents = [
    {
      id: 1,
      title: "Facial Recognition Bias in EU Border Control",
      severity: "Critical",
      category: "Bias & Discrimination",
      system: "EU Border Control AI",
      date: "2025-12-20",
      upvotes: 234,
      comments: 45,
      status: "Under Investigation",
      description: "Facial recognition system shows 15% higher error rate for non-European faces",
    },
    {
      id: 2,
      title: "Loan Approval Algorithm Discriminates Against Women",
      severity: "High",
      category: "Financial Impact",
      system: "FinTech Lending Platform",
      date: "2025-12-18",
      upvotes: 156,
      comments: 32,
      status: "Verified",
      description: "AI lending system approves 22% fewer loans for female applicants with identical profiles",
    },
    {
      id: 3,
      title: "Healthcare Triage System Deprioritizes Elderly Patients",
      severity: "High",
      category: "Healthcare",
      system: "Hospital Triage AI",
      date: "2025-12-15",
      upvotes: 198,
      comments: 67,
      status: "Verified",
      description: "AI triage system systematically deprioritizes patients over 75 years old",
    },
    {
      id: 4,
      title: "Recruitment AI Filters Out Qualified Candidates",
      severity: "Medium",
      category: "Employment",
      system: "HR Recruitment Platform",
      date: "2025-12-10",
      upvotes: 89,
      comments: 21,
      status: "Under Investigation",
      description: "Resume screening AI filters out qualified candidates based on name analysis",
    },
    {
      id: 5,
      title: "Predictive Policing Algorithm Over-targets Minorities",
      severity: "Critical",
      category: "Law Enforcement",
      system: "Police Predictive Policing",
      date: "2025-12-05",
      upvotes: 312,
      comments: 89,
      status: "Verified",
      description: "Predictive policing system recommends patrols in minority neighborhoods 3x more often",
    },
  ];

  const stats = [
    { label: "Total Incidents", value: "1,247", icon: AlertCircle },
    { label: "Verified Issues", value: "892", icon: TrendingUp },
    { label: "Community Members", value: "15.3K", icon: Users },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-50 border-green-200";
      case "Under Investigation":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Watchdog Hub</h1>
          <p className="text-lg text-muted-foreground">
            Community-powered AI safety incident database. Report, verify, and track AI system issues.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-primary opacity-20" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button>Report Incident</Button>
          </div>
        </Card>

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.map((incident) => (
            <Card
              key={incident.id}
              className={`p-6 hover:shadow-md transition-shadow border ${getStatusColor(incident.status)}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{incident.title}</h3>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{incident.category}</Badge>
                    <Badge variant="outline">{incident.system}</Badge>
                    <Badge variant="outline">{incident.status}</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Reported on {new Date(incident.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{incident.upvotes}</p>
                    <p className="text-xs text-muted-foreground">upvotes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{incident.comments}</p>
                    <p className="text-xs text-muted-foreground">comments</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Incidents
          </Button>
        </div>

        {/* Info Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">How Watchdog Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Report</h3>
              <p className="text-sm text-muted-foreground">
                Submit AI safety incidents you've discovered or experienced
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Verify</h3>
              <p className="text-sm text-muted-foreground">
                Our analyst network verifies and investigates reported incidents
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Track</h3>
              <p className="text-sm text-muted-foreground">
                Monitor resolution and follow-up actions by system operators
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
