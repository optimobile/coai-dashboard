import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, MapPin, FileText, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SandboxApplication {
  id: string;
  country: string;
  authority: string;
  status: "open" | "submitted" | "approved" | "active" | "completed";
  deadline: string;
  requirements: string[];
  benefits: string[];
  applicationDate?: string;
}

interface UserApplication {
  id: string;
  sandboxId: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  submittedDate?: string;
  systemName: string;
}

const EU_SANDBOXES: SandboxApplication[] = [
  {
    id: "sandbox-de",
    country: "Germany",
    authority: "BaFin & BSI",
    status: "open",
    deadline: "2025-06-30",
    requirements: [
      "AI system in financial services or critical infrastructure",
      "Demonstrated commitment to EU AI Act compliance",
      "Clear testing plan and success metrics",
      "Data protection impact assessment"
    ],
    benefits: [
      "Regulatory guidance and support",
      "Expedited compliance review",
      "Real-world testing environment",
      "Direct regulator feedback"
    ]
  },
  {
    id: "sandbox-fr",
    country: "France",
    authority: "CNIL & ANSSI",
    status: "open",
    deadline: "2025-05-31",
    requirements: [
      "AI system with privacy implications",
      "Cybersecurity compliance plan",
      "Data minimization strategy",
      "User consent mechanisms"
    ],
    benefits: [
      "Privacy expertise support",
      "Security assessment",
      "Compliance certification",
      "Market access support"
    ]
  },
  {
    id: "sandbox-nl",
    country: "Netherlands",
    authority: "ACM & IGJ",
    status: "open",
    deadline: "2025-07-15",
    requirements: [
      "High-risk AI system",
      "Market competition impact analysis",
      "Consumer protection measures",
      "Governance framework"
    ],
    benefits: [
      "Competition law guidance",
      "Consumer protection review",
      "Market impact assessment",
      "Regulatory approval"
    ]
  },
  {
    id: "sandbox-se",
    country: "Sweden",
    authority: "DIGG & PTS",
    status: "open",
    deadline: "2025-08-31",
    requirements: [
      "Digital services AI system",
      "Transparency and explainability plan",
      "Bias mitigation strategy",
      "Accessibility compliance"
    ],
    benefits: [
      "Digital expertise support",
      "Transparency guidance",
      "Accessibility certification",
      "Nordic market access"
    ]
  },
  {
    id: "sandbox-it",
    country: "Italy",
    authority: "Garante & AGCM",
    status: "submitted",
    deadline: "2025-04-30",
    requirements: [
      "Consumer-facing AI system",
      "Data protection compliance",
      "Competition law adherence",
      "Consumer rights protection"
    ],
    benefits: [
      "Italian market entry",
      "Regulatory approval",
      "Consumer protection certification",
      "Competition clearance"
    ]
  },
  {
    id: "sandbox-es",
    country: "Spain",
    authority: "AEPD & CNMC",
    status: "approved",
    deadline: "2025-12-31",
    requirements: [
      "Any high-risk AI system",
      "Spanish language support",
      "Local data residency option",
      "Compliance roadmap"
    ],
    benefits: [
      "Spanish regulatory approval",
      "Market access",
      "Compliance support",
      "Regulatory recognition"
    ]
  }
];

const STATUS_COLORS = {
  open: "bg-green-100 text-green-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-emerald-100 text-emerald-800",
  active: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800"
};

export default function RegulatorySandbox() {
  const [selectedSandbox, setSelectedSandbox] = useState<SandboxApplication | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [userApplications, setUserApplications] = useState<UserApplication[]>([
    {
      id: "app-001",
      sandboxId: "sandbox-de",
      status: "submitted",
      submittedDate: "2024-12-15",
      systemName: "SafeAI Lending Platform"
    }
  ]);
  const [formData, setFormData] = useState({
    systemName: "",
    description: "",
    riskLevel: "",
    testingPlan: "",
    expectedOutcomes: ""
  });

  const handleApplicationSubmit = (sandboxId: string) => {
    const newApp: UserApplication = {
      id: `app-${Date.now()}`,
      sandboxId,
      status: "draft",
      systemName: formData.systemName
    };
    setUserApplications([...userApplications, newApp]);
    setShowApplicationForm(false);
    setFormData({
      systemName: "",
      description: "",
      riskLevel: "",
      testingPlan: "",
      expectedOutcomes: ""
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Plus className="w-5 h-5" />;
      case "submitted":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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
              <MapPin className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Regulatory Sandboxes</h1>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Apply for EU member state regulatory sandboxes to test your AI systems in controlled environments with regulatory support.
          </p>
        </motion.div>

        {/* Your Applications Summary */}
        {userApplications.length > 0 && (
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userApplications.map(app => {
                  const sandbox = EU_SANDBOXES.find(s => s.id === app.sandboxId);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{app.systemName}</p>
                        <p className="text-sm text-gray-600">{sandbox?.country} • {sandbox?.authority}</p>
                      </div>
                      <Badge
                        className={
                          app.status === "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : app.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sandboxes Grid */}
        {!selectedSandbox ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EU_SANDBOXES.map((sandbox, idx) => (
              <motion.div
                key={sandbox.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <CardTitle className="text-2xl text-gray-900">
                          {sandbox.country}
                        </CardTitle>
                        <CardDescription>{sandbox.authority}</CardDescription>
                      </div>
                      <Badge className={STATUS_COLORS[sandbox.status as keyof typeof STATUS_COLORS]}>
                        {sandbox.status.charAt(0).toUpperCase() + sandbox.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Deadline: {sandbox.deadline}</span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Requirements:</p>
                      <ul className="space-y-1">
                        {sandbox.requirements.slice(0, 2).map((req, i) => (
                          <li key={i} className="text-xs text-gray-600">✓ {req}</li>
                        ))}
                        {sandbox.requirements.length > 2 && (
                          <li className="text-xs text-gray-500 italic">
                            +{sandbox.requirements.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Key Benefits:</p>
                      <ul className="space-y-1">
                        {sandbox.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="text-xs text-gray-600">⭐ {benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => setSelectedSandbox(sandbox)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Sandbox Detail View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              onClick={() => setSelectedSandbox(null)}
              className="mb-6"
            >
              ← Back to Sandboxes
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <CardTitle className="text-3xl">{selectedSandbox.country}</CardTitle>
                        <CardDescription className="text-base">{selectedSandbox.authority}</CardDescription>
                      </div>
                      <Badge className={STATUS_COLORS[selectedSandbox.status as keyof typeof STATUS_COLORS]}>
                        {selectedSandbox.status.charAt(0).toUpperCase() + selectedSandbox.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {selectedSandbox.requirements.map((req, i) => (
                          <li key={i} className="flex gap-3 p-2 bg-gray-50 rounded">
                            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Benefits</h3>
                      <ul className="space-y-2">
                        {selectedSandbox.benefits.map((benefit, i) => (
                          <li key={i} className="flex gap-3 p-2 bg-emerald-50 rounded">
                            <span className="text-emerald-600 font-bold flex-shrink-0">⭐</span>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Application Deadline:</strong> {selectedSandbox.deadline}
                      </p>
                    </div>

                    {selectedSandbox.status === "open" && (
                      <Button
                        onClick={() => setShowApplicationForm(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Application Form */}
                {showApplicationForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Application</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          AI System Name *
                        </label>
                        <Input
                          value={formData.systemName}
                          onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                          placeholder="e.g., SafeAI Lending Platform"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          System Description *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-3 min-h-24 font-sans"
                          placeholder="Describe your AI system..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Risk Level *
                        </label>
                        <select
                          value={formData.riskLevel}
                          onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg p-2"
                        >
                          <option value="">Select risk level...</option>
                          <option value="high">High Risk</option>
                          <option value="medium">Medium Risk</option>
                          <option value="low">Low Risk</option>
                        </select>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowApplicationForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleApplicationSubmit(selectedSandbox.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          Submit Application
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-gray-900">
                        {selectedSandbox.status === "open" ? "Accepting Applications" : "Not Currently Open"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Deadline</p>
                      <p className="font-semibold text-gray-900">{selectedSandbox.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requirements</p>
                      <p className="font-semibold text-gray-900">{selectedSandbox.requirements.length} items</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">Authority</p>
                    <p className="font-semibold text-gray-900 mb-4">{selectedSandbox.authority}</p>
                    <Button variant="outline" className="w-full">
                      Request Information
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
