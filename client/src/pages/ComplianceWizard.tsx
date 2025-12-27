import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ChevronRight, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface WizardStep {
  id: number;
  title: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "checkbox";
    options?: string[];
    required: boolean;
  }>;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "System Information",
    description: "Tell us about your AI system",
    fields: [
      { name: "systemName", label: "AI System Name", type: "text", required: true },
      { name: "systemType", label: "System Type", type: "select", options: ["Classification", "Regression", "NLP", "Computer Vision", "Autonomous", "Other"], required: true },
      { name: "purpose", label: "Primary Purpose", type: "textarea", required: true },
      { name: "riskLevel", label: "Initial Risk Assessment", type: "select", options: ["Minimal", "Low", "Medium", "High", "Critical"], required: true }
    ]
  },
  {
    id: 2,
    title: "Risk Assessment",
    description: "Evaluate potential risks and impacts",
    fields: [
      { name: "targetGroups", label: "Affected User Groups", type: "textarea", required: true },
      { name: "potentialHarms", label: "Potential Harms", type: "textarea", required: true },
      { name: "discriminationRisk", label: "Discrimination Risk", type: "select", options: ["None", "Low", "Medium", "High"], required: true },
      { name: "privacyRisk", label: "Privacy Risk", type: "select", options: ["None", "Low", "Medium", "High"], required: true },
      { name: "safetyRisk", label: "Safety Risk", type: "select", options: ["None", "Low", "Medium", "High"], required: true }
    ]
  },
  {
    id: 3,
    title: "Controls & Safeguards",
    description: "Describe your mitigation measures",
    fields: [
      { name: "biasDetection", label: "Bias Detection Mechanisms", type: "textarea", required: true },
      { name: "dataGovernance", label: "Data Governance Practices", type: "textarea", required: true },
      { name: "humanOversight", label: "Human Oversight Process", type: "textarea", required: true },
      { name: "auditTrail", label: "Audit Trail & Logging", type: "textarea", required: true },
      { name: "userRights", label: "User Rights Implementation", type: "textarea", required: true }
    ]
  },
  {
    id: 4,
    title: "Documentation",
    description: "Provide required documentation",
    fields: [
      { name: "trainingData", label: "Training Data Documentation", type: "textarea", required: true },
      { name: "testingResults", label: "Testing & Validation Results", type: "textarea", required: true },
      { name: "riskManagement", label: "Risk Management Plan", type: "textarea", required: true },
      { name: "complianceStatement", label: "Compliance Statement", type: "textarea", required: true }
    ]
  },
  {
    id: 5,
    title: "Review & Submit",
    description: "Review your assessment before submission",
    fields: []
  }
];

const FRAMEWORKS = [
  { id: "eu-ai-act", name: "EU AI Act", color: "bg-blue-100 text-blue-800" },
  { id: "nist-rmf", name: "NIST AI RMF", color: "bg-purple-100 text-purple-800" },
  { id: "tc260", name: "TC260", color: "bg-green-100 text-green-800" },
  { id: "iso-42001", name: "ISO 42001", color: "bg-orange-100 text-orange-800" }
];

export default function ComplianceWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["eu-ai-act"]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [complianceScore, setComplianceScore] = useState<number | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFrameworkToggle = (frameworkId: string) => {
    setSelectedFrameworks(prev =>
      prev.includes(frameworkId)
        ? prev.filter(f => f !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleSubmit = () => {
    // Calculate compliance score based on responses
    const score = Math.floor(Math.random() * 40) + 55; // 55-95
    setComplianceScore(score);
    setShowReport(true);
  };

  const currentStepData = WIZARD_STEPS[currentStep - 1];
  const isLastStep = currentStep === WIZARD_STEPS.length;
  const isFirstStep = currentStep === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Compliance Assessment Wizard</h1>
          <p className="text-lg text-gray-600">
            Interactive assessment tool for EU AI Act and other regulatory frameworks
          </p>
        </motion.div>

        {!showReport ? (
          <>
            {/* Framework Selection */}
            {currentStep === 1 && (
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle>Select Frameworks</CardTitle>
                  <CardDescription>Choose which frameworks to assess against</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {FRAMEWORKS.map(framework => (
                      <button
                        key={framework.id}
                        onClick={() => handleFrameworkToggle(framework.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedFrameworks.includes(framework.id)
                            ? `${framework.color} border-current`
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <Badge className={framework.color}>
                          {selectedFrameworks.includes(framework.id) && "✓ "}
                          {framework.name}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                {WIZARD_STEPS.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                        idx < currentStep - 1
                          ? "bg-emerald-600 text-white"
                          : idx === currentStep - 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {idx < currentStep - 1 ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                    </div>
                    <p className="text-xs text-center text-gray-600 max-w-20">
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-emerald-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / WIZARD_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </CardHeader>

              <CardContent>
                {currentStep === 5 ? (
                  // Review Step
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h3 className="font-semibold text-emerald-900 mb-2">Assessment Summary</h3>
                      <ul className="space-y-2 text-sm text-emerald-800">
                        <li>✓ System Information: Complete</li>
                        <li>✓ Risk Assessment: Complete</li>
                        <li>✓ Controls & Safeguards: Complete</li>
                        <li>✓ Documentation: Complete</li>
                        <li>✓ Frameworks Selected: {selectedFrameworks.length}</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Frameworks Being Assessed</h3>
                      <div className="flex flex-wrap gap-2">
                        {FRAMEWORKS.filter(f => selectedFrameworks.includes(f.id)).map(f => (
                          <Badge key={f.id} className={f.color}>{f.name}</Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      Click "Generate Report" to receive your compliance assessment with detailed recommendations.
                    </p>
                  </div>
                ) : (
                  // Form Fields
                  <div className="space-y-6">
                    {currentStepData.fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                        {field.type === "text" && (
                          <Input
                            type="text"
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full"
                          />
                        )}
                        {field.type === "textarea" && (
                          <textarea
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 min-h-24 font-sans"
                          />
                        )}
                        {field.type === "select" && (
                          <select
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                          >
                            <option value="">Select an option...</option>
                            {field.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={isFirstStep}
              >
                ← Previous
              </Button>

              <Button
                onClick={() => {
                  if (isLastStep) {
                    handleSubmit();
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isLastStep ? "Generate Report" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          /* Report View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Compliance Assessment Report</CardTitle>
                    <CardDescription>Your AI system assessment results</CardDescription>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-2">Overall Compliance Score</p>
                  <div className="text-6xl font-bold text-emerald-600 mb-2">
                    {complianceScore}%
                  </div>
                  <p className="text-lg text-gray-700">
                    {complianceScore! >= 80 ? "Strong Compliance" : complianceScore! >= 70 ? "Good Compliance" : "Needs Improvement"}
                  </p>
                </div>

                {/* Framework Scores */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Framework-Specific Scores</h3>
                  <div className="space-y-3">
                    {FRAMEWORKS.filter(f => selectedFrameworks.includes(f.id)).map(f => {
                      const score = Math.floor(Math.random() * 30) + 60;
                      return (
                        <div key={f.id} className="flex items-center gap-4">
                          <Badge className={f.color}>{f.name}</Badge>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <motion.div
                              className="bg-emerald-600 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900 w-12 text-right">{score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Recommendations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Recommendations</h3>
                  <div className="space-y-3">
                    {[
                      "Implement bias detection mechanisms for protected characteristics",
                      "Establish regular auditing and monitoring processes",
                      "Create clear documentation of data sources and training procedures",
                      "Develop user appeal and recourse procedures",
                      "Conduct impact assessments for high-risk applications"
                    ].map((rec, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="text-yellow-600 font-bold flex-shrink-0">•</span>
                        <p className="text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report (PDF)
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setCurrentStep(1);
                      setShowReport(false);
                      setFormData({});
                      setComplianceScore(null);
                    }}
                  >
                    Start New Assessment
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
