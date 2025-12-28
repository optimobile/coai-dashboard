import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function WatchdogIncidentReport() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "",
    category: "",
    systemName: "",
    affectedGroups: "",
    evidence: "",
    location: "",
  });

  const categories = [
    "Bias & Discrimination",
    "Privacy Violation",
    "Safety Risk",
    "Financial Impact",
    "Healthcare",
    "Employment",
    "Law Enforcement",
    "Other",
  ];

  const severities = ["Low", "Medium", "High", "Critical"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (formStep < 3) {
      setFormStep(formStep + 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting incident:", formData);
    setFormStep(4); // Success step
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Report AI Safety Incident</h1>
          <p className="text-lg text-muted-foreground">
            Help us identify and track AI system issues. Your report helps protect others.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 mx-1 rounded-full ${
                    step <= formStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step 1: Basics</span>
              <span>Step 2: Details</span>
              <span>Step 3: Evidence</span>
            </div>
          </div>

          {/* Step 1: Basics */}
          {formStep === 1 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Incident Basics</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Incident Title *
                  </label>
                  <Input
                    name="title"
                    placeholder="Brief description of the incident"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Be specific and concise (e.g., "Facial recognition bias in EU border control")
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    AI System Name *
                  </label>
                  <Input
                    name="systemName"
                    placeholder="Name of the AI system affected"
                    value={formData.systemName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Severity Level *
                    </label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">Select severity</option>
                      {severities.map((sev) => (
                        <option key={sev} value={sev}>
                          {sev}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleNext}
                    disabled={!formData.title || !formData.systemName || !formData.severity || !formData.category}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Details */}
          {formStep === 2 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Incident Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Provide detailed information about the incident. What happened? When? How did you discover it?"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Affected Groups or Individuals
                  </label>
                  <Input
                    name="affectedGroups"
                    placeholder="e.g., Women, minorities, elderly people, etc."
                    value={formData.affectedGroups}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Geographic Location
                  </label>
                  <Input
                    name="location"
                    placeholder="Where is this system deployed?"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setFormStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!formData.description}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Evidence */}
          {formStep === 3 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Evidence & Documentation</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Supporting Evidence
                  </label>
                  <textarea
                    name="evidence"
                    placeholder="Share any evidence: screenshots, data analysis, research papers, news articles, etc."
                    value={formData.evidence}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can include links to documents, research, or media
                  </p>
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Privacy Notice</h4>
                      <p className="text-sm text-blue-800">
                        Please do not include personal data or sensitive information that could identify individuals.
                        Our team will review your report and may contact you for clarification.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setFormStep(2)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Success */}
          {formStep === 4 && (
            <Card className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for reporting this incident. Our analyst network will review your report and
                investigate further. You'll receive updates via email.
              </p>

              <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-medium text-foreground mb-2">Your Report ID:</p>
                <p className="text-lg font-mono text-primary">WD-2025-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>

              <div className="space-y-3">
                <Button className="w-full">View Your Report</Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFormStep(1);
                    setFormData({
                      title: "",
                      description: "",
                      severity: "",
                      category: "",
                      systemName: "",
                      affectedGroups: "",
                      evidence: "",
                      location: "",
                    });
                  }}
                >
                  Submit Another Report
                </Button>
              </div>
            </Card>
          )}

          {/* Info Section */}
          <Card className="mt-12 p-6 bg-muted">
            <div className="flex gap-4">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">What Happens Next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Your report is reviewed by our analyst team within 48 hours</li>
                  <li>✓ Verified incidents are added to the public Watchdog database</li>
                  <li>✓ System operators are notified and given 30 days to respond</li>
                  <li>✓ You receive updates on investigation progress</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
