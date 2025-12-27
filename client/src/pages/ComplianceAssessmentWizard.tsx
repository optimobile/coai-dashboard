/**
 * Compliance Assessment Wizard
 * Multi-framework compliance assessment with EU AI Act, NIST, and TC260 alignment
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";

interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  framework: "eu_ai_act" | "nist" | "tc260" | "general";
  questions: AssessmentQuestion[];
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: "radio" | "checkbox" | "textarea";
  options?: { value: string; label: string; riskLevel?: "low" | "medium" | "high" }[];
  required: boolean;
}

interface AssessmentResponse {
  stepId: string;
  questionId: string;
  answer: string | string[];
}

const ASSESSMENT_STEPS: AssessmentStep[] = [
  {
    id: "system_info",
    title: "AI System Information",
    description: "Tell us about your AI system",
    framework: "general",
    questions: [
      {
        id: "system_name",
        question: "What is the name of your AI system?",
        type: "textarea",
        required: true,
      },
      {
        id: "system_purpose",
        question: "What is the primary purpose of this AI system?",
        type: "textarea",
        required: true,
      },
      {
        id: "deployment_regions",
        question: "Where is this system deployed? (Select all that apply)",
        type: "checkbox",
        options: [
          { value: "eu", label: "European Union" },
          { value: "us", label: "United States" },
          { value: "china", label: "China" },
          { value: "other", label: "Other regions" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "eu_ai_act",
    title: "EU AI Act Compliance",
    description: "Assess compliance with EU AI Act requirements",
    framework: "eu_ai_act",
    questions: [
      {
        id: "risk_classification",
        question: "What is the risk classification of your system?",
        type: "radio",
        options: [
          { value: "prohibited", label: "Prohibited Risk", riskLevel: "high" },
          { value: "high", label: "High Risk", riskLevel: "high" },
          { value: "limited", label: "Limited Risk", riskLevel: "medium" },
          { value: "minimal", label: "Minimal Risk", riskLevel: "low" },
        ],
        required: true,
      },
      {
        id: "transparency_measures",
        question: "What transparency measures have you implemented?",
        type: "checkbox",
        options: [
          { value: "disclosure", label: "AI system disclosure to users" },
          { value: "documentation", label: "Technical documentation" },
          { value: "logging", label: "Decision logging" },
          { value: "explainability", label: "Explainability features" },
        ],
        required: true,
      },
      {
        id: "human_oversight",
        question: "Do you have human oversight mechanisms in place?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes, fully implemented" },
          { value: "partial", label: "Partially implemented" },
          { value: "planned", label: "Planned for future" },
          { value: "no", label: "Not applicable" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "nist_framework",
    title: "NIST AI Risk Management",
    description: "Assess alignment with NIST AI Risk Management Framework",
    framework: "nist",
    questions: [
      {
        id: "risk_assessment",
        question: "Have you conducted an AI risk assessment?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes, comprehensive" },
          { value: "partial", label: "Yes, partial" },
          { value: "planned", label: "Planned" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
      {
        id: "impact_assessment",
        question: "Have you performed impact assessments?",
        type: "checkbox",
        options: [
          { value: "fairness", label: "Fairness and bias" },
          { value: "security", label: "Security and robustness" },
          { value: "privacy", label: "Privacy and data protection" },
          { value: "accountability", label: "Accountability and transparency" },
        ],
        required: true,
      },
      {
        id: "monitoring_plan",
        question: "Do you have a monitoring and evaluation plan?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes, implemented" },
          { value: "planned", label: "Planned" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
    ],
  },
  {
    id: "tc260_alignment",
    title: "TC260 Alignment (China)",
    description: "Assess alignment with Chinese AI governance standards",
    framework: "tc260",
    questions: [
      {
        id: "content_security",
        question: "Have you implemented content security measures?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes, comprehensive" },
          { value: "partial", label: "Yes, partial" },
          { value: "planned", label: "Planned" },
          { value: "no", label: "No" },
        ],
        required: true,
      },
      {
        id: "algorithm_governance",
        question: "Do you have algorithm governance controls?",
        type: "checkbox",
        options: [
          { value: "audit", label: "Regular algorithm audits" },
          { value: "documentation", label: "Algorithm documentation" },
          { value: "traceability", label: "Decision traceability" },
          { value: "user_control", label: "User control mechanisms" },
        ],
        required: true,
      },
    ],
  },
];

export default function ComplianceAssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [completed, setCompleted] = useState(false);

  const step = ASSESSMENT_STEPS[currentStep];
  const progress = ((currentStep + 1) / ASSESSMENT_STEPS.length) * 100;

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    const newResponses = responses.filter(
      (r) => !(r.stepId === step.id && r.questionId === questionId)
    );
    newResponses.push({
      stepId: step.id,
      questionId,
      answer,
    });
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentStep < ASSESSMENT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
              <CardDescription>
                Your compliance assessment has been submitted
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Questions</span>
                  <span className="font-medium">
                    {ASSESSMENT_STEPS.reduce((sum, s) => sum + s.questions.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frameworks Assessed</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Submitted
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Next Steps:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Your assessment is being reviewed by our compliance team</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>You'll receive a detailed compliance report within 48 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>Recommendations will be provided for any gaps</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full" size="lg">
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-0 shadow-lg">
          {/* Header */}
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {currentStep + 1}/{ASSESSMENT_STEPS.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Steps</div>
                </div>
              </div>

              {/* Progress Bar */}
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-6">
            {/* Questions */}
            <div className="space-y-6">
              {step.questions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  {question.type === "radio" && (
                    <RadioGroup
                      value={
                        responses.find(
                          (r) => r.stepId === step.id && r.questionId === question.id
                        )?.answer as string
                      }
                      onValueChange={(value) => handleAnswer(question.id, value)}
                    >
                      <div className="space-y-2">
                        {question.options?.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer font-normal">
                              {option.label}
                              {option.riskLevel && (
                                <span
                                  className={`ml-2 text-xs px-2 py-1 rounded ${
                                    option.riskLevel === "high"
                                      ? "bg-red-100 text-red-700"
                                      : option.riskLevel === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {option.riskLevel}
                                </span>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={
                              (
                                responses.find(
                                  (r) => r.stepId === step.id && r.questionId === question.id
                                )?.answer as string[]
                              )?.includes(option.value) || false
                            }
                            onCheckedChange={(checked) => {
                              const current =
                                (responses.find(
                                  (r) => r.stepId === step.id && r.questionId === question.id
                                )?.answer as string[]) || [];
                              const updated = checked
                                ? [...current, option.value]
                                : current.filter((v) => v !== option.value);
                              handleAnswer(question.id, updated);
                            }}
                          />
                          <Label htmlFor={option.value} className="cursor-pointer font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "textarea" && (
                    <Textarea
                      placeholder="Enter your response..."
                      value={
                        responses.find(
                          (r) => r.stepId === step.id && r.questionId === question.id
                        )?.answer as string
                      }
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      className="min-h-24"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {currentStep === ASSESSMENT_STEPS.length - 1 ? "Submit" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
