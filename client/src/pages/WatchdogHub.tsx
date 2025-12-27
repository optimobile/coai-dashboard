import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, ThumbsUp, Search, Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  reportedAt: string;
  upvotes: number;
  views: number;
  status: "open" | "investigating" | "resolved" | "duplicate";
  anonymous: boolean;
  aiSystem?: string;
}

const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: "INC-001",
    title: "Facial Recognition System Fails for Dark Skin Tones",
    description: "Multiple reports of facial recognition system failing to identify individuals with darker skin tones in security applications.",
    severity: "critical",
    category: "Bias & Discrimination",
    reportedAt: "2024-12-20",
    upvotes: 342,
    views: 1205,
    status: "investigating",
    anonymous: true,
    aiSystem: "FaceID Pro v2.1"
  },
  {
    id: "INC-002",
    title: "Hiring Chatbot Discriminates Against Non-Native English Speakers",
    description: "AI resume screening tool systematically rejects qualified candidates who have English as a second language.",
    severity: "high",
    category: "Employment Discrimination",
    reportedAt: "2024-12-19",
    upvotes: 287,
    views: 892,
    status: "investigating",
    anonymous: true,
    aiSystem: "TalentMatch AI"
  },
  {
    id: "INC-003",
    title: "Medical Diagnosis AI Shows Gender Bias in Pain Assessment",
    description: "Healthcare AI system underestimates pain severity for female patients compared to male patients with identical symptoms.",
    severity: "high",
    category: "Healthcare Bias",
    reportedAt: "2024-12-18",
    upvotes: 156,
    views: 645,
    status: "investigating",
    anonymous: true,
    aiSystem: "MediDiagnose v3.0"
  },
  {
    id: "INC-004",
    title: "Content Moderation AI Inconsistently Enforces Policies",
    description: "Social media moderation AI applies community guidelines inconsistently across different user demographics.",
    severity: "medium",
    category: "Content Moderation",
    reportedAt: "2024-12-17",
    upvotes: 124,
    views: 523,
    status: "open",
    anonymous: true,
    aiSystem: "ModerateAI"
  },
  {
    id: "INC-005",
    title: "Recommendation Algorithm Creates Echo Chambers",
    description: "Video recommendation system increasingly suggests extreme content to certain user groups.",
    severity: "medium",
    category: "Misinformation",
    reportedAt: "2024-12-16",
    upvotes: 98,
    views: 412,
    status: "open",
    anonymous: true,
    aiSystem: "RecommendEngine v4"
  },
  {
    id: "INC-006",
    title: "Loan Approval AI Denies Credit to Minority Applicants",
    description: "Financial AI system approves loans at significantly lower rates for minority applicants with identical credit profiles.",
    severity: "critical",
    category: "Financial Discrimination",
    reportedAt: "2024-12-15",
    upvotes: 201,
    views: 756,
    status: "resolved",
    anonymous: true,
    aiSystem: "LoanDecide Pro"
  }
];

const SEVERITY_COLORS = {
  critical: "bg-red-100 text-red-800 border-red-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-green-100 text-green-800 border-green-300"
};

const STATUS_COLORS = {
  open: "bg-blue-100 text-blue-800",
  investigating: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  duplicate: "bg-gray-100 text-gray-800"
};

export default function WatchdogHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const filteredIncidents = SAMPLE_INCIDENTS.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !selectedSeverity || incident.severity === selectedSeverity;
    const matchesStatus = !selectedStatus || incident.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: SAMPLE_INCIDENTS.length,
    critical: SAMPLE_INCIDENTS.filter(i => i.severity === "critical").length,
    investigating: SAMPLE_INCIDENTS.filter(i => i.status === "investigating").length,
    resolved: SAMPLE_INCIDENTS.filter(i => i.status === "resolved").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h1 className="text-4xl font-bold text-gray-900">Watchdog Hub</h1>
            </div>
            <Button
              onClick={() => setShowReportForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </div>
          <p className="text-lg text-gray-600">
            Transparent, community-driven database of AI safety incidents. Help improve AI systems globally.
          </p>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Reports", value: stats.total, color: "bg-blue-50 text-blue-600" },
            { label: "Critical Issues", value: stats.critical, color: "bg-red-50 text-red-600" },
            { label: "Investigating", value: stats.investigating, color: "bg-purple-50 text-purple-600" },
            { label: "Resolved", value: stats.resolved, color: "bg-green-50 text-green-600" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`${stat.color} border-0`}>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm mt-2">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search incidents by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Severity:</p>
                  <div className="flex gap-2">
                    {["critical", "high", "medium", "low"].map(severity => (
                      <Button
                        key={severity}
                        variant={selectedSeverity === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSeverity(selectedSeverity === severity ? null : severity)}
                        className={selectedSeverity === severity ? "bg-red-600" : ""}
                      >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="ml-auto">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Status:</p>
                  <div className="flex gap-2">
                    {["open", "investigating", "resolved"].map(status => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List or Detail View */}
        {!selectedIncident ? (
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-gray-600">No incidents match your filters.</p>
                </CardContent>
              </Card>
            ) : (
              filteredIncidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={SEVERITY_COLORS[incident.severity]}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <Badge className={STATUS_COLORS[incident.status as keyof typeof STATUS_COLORS]}>
                              {incident.status}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {incident.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {incident.description.substring(0, 150)}...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>{incident.category}</span>
                          {incident.aiSystem && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {incident.aiSystem}
                            </span>
                          )}
                          <span>{incident.reportedAt}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {incident.upvotes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {incident.views}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* Incident Detail View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              onClick={() => setSelectedIncident(null)}
              className="mb-6"
            >
              ← Back to List
            </Button>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={SEVERITY_COLORS[selectedIncident.severity]}>
                        {selectedIncident.severity.toUpperCase()}
                      </Badge>
                      <Badge className={STATUS_COLORS[selectedIncident.status as keyof typeof STATUS_COLORS]}>
                        {selectedIncident.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl">{selectedIncident.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedIncident.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reported</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.reportedAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Upvotes</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.upvotes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.views}</p>
                  </div>
                </div>

                {selectedIncident.aiSystem && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">AI System</p>
                    <p className="font-semibold text-gray-900">{selectedIncident.aiSystem}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Support This Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
