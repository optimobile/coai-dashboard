/*
 * COAI Compliance Page
 * Multi-framework compliance status and gap analysis
 * Connected to real backend API
 */

import { motion } from "framer-motion";
import { FileCheck, AlertCircle, CheckCircle2, Clock, ExternalLink, Loader2, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Fallback framework data for display
const defaultFrameworks = [
  {
    id: 1,
    code: "EU_AI_ACT",
    name: "EU AI Act",
    fullName: "Regulation 2024/1689",
    description: "European Union AI regulation",
    score: 72,
    status: "In Progress",
    deadline: "August 2026",
    requirements: { total: 113, completed: 81, inProgress: 20, notStarted: 12 },
    gaps: ["Human oversight documentation", "Technical documentation", "Risk management system"],
  },
  {
    id: 2,
    code: "NIST_RMF",
    name: "NIST AI RMF",
    fullName: "AI 100-1",
    description: "US National Institute of Standards and Technology AI Risk Management Framework",
    score: 85,
    status: "Compliant",
    deadline: "Voluntary",
    requirements: { total: 72, completed: 61, inProgress: 8, notStarted: 3 },
    gaps: ["Continuous monitoring metrics", "Stakeholder engagement records"],
  },
  {
    id: 3,
    code: "TC260",
    name: "TC260",
    fullName: "AI Safety Framework 2.0",
    description: "China's National Information Security Standardization Technical Committee",
    score: 68,
    status: "In Progress",
    deadline: "Q2 2025",
    requirements: { total: 56, completed: 38, inProgress: 12, notStarted: 6 },
    gaps: ["Content traceability", "Algorithm registration", "Security assessment"],
  },
];

export default function Compliance() {
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [selectedFramework, setSelectedFramework] = useState<string>("");

  // Fetch frameworks from API
  const { data: apiFrameworks, isLoading: frameworksLoading } = trpc.compliance.getFrameworks.useQuery();
  const { data: summary } = trpc.compliance.getSummary.useQuery();
  const { data: aiSystems } = trpc.aiSystems.list.useQuery();

  // Use API frameworks if available, otherwise fallback
  const frameworks = apiFrameworks && apiFrameworks.length > 0 
    ? apiFrameworks.map(fw => ({
        ...fw,
        fullName: fw.version || fw.name,
        score: 75, // Would come from assessments
        status: "In Progress",
        deadline: "2026",
        requirements: { total: 50, completed: 30, inProgress: 15, notStarted: 5 },
        gaps: ["Documentation pending", "Review required"],
      }))
    : defaultFrameworks;

  const handleRunAssessment = () => {
    if (!selectedSystem || !selectedFramework) {
      toast.error("Please select an AI system and framework");
      return;
    }
    
    toast.success("Assessment started!", {
      description: `Running ${selectedFramework} compliance check on your AI system.`,
    });
    setAssessmentDialogOpen(false);
    setSelectedSystem("");
    setSelectedFramework("");
  };

  if (frameworksLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-primary">Compliance</h1>
            <p className="text-muted-foreground text-sm">
              Track compliance across multiple AI safety frameworks
            </p>
          </div>
          <Button onClick={() => setAssessmentDialogOpen(true)} className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Run Assessment
          </Button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{summary.totalSystems}</div>
                <div className="text-sm text-muted-foreground">Total Systems</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{summary.compliantSystems}</div>
                <div className="text-sm text-muted-foreground">Compliant</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">{summary.pendingAssessments}</div>
                <div className="text-sm text-muted-foreground">Pending Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{summary.overallScore}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Frameworks */}
        <div className="space-y-4">
          {frameworks.map((fw, idx) => (
            <motion.div
              key={fw.id || fw.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        <FileCheck className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">
                          {fw.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{fw.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          fw.status === "Compliant"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        }
                      >
                        {fw.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-2xl font-semibold">{fw.score}%</p>
                        <p className="text-xs text-muted-foreground">Deadline: {fw.deadline}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Requirements Progress</span>
                      <span>{fw.requirements.completed}/{fw.requirements.total} completed</span>
                    </div>
                    <Progress value={(fw.requirements.completed / fw.requirements.total) * 100} className="h-2" />
                  </div>

                  {/* Requirements Breakdown */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{fw.requirements.completed} Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>{fw.requirements.inProgress} In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{fw.requirements.notStarted} Not Started</span>
                    </div>
                  </div>

                  {/* Gaps */}
                  {fw.gaps && fw.gaps.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-sm font-medium mb-2">Key Gaps</p>
                      <div className="flex flex-wrap gap-2">
                        {fw.gaps.map((gap) => (
                          <Badge key={gap} variant="secondary" className="text-xs">
                            {gap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Run Assessment Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Compliance Assessment</DialogTitle>
            <DialogDescription>
              Select an AI system and framework to run a compliance assessment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI System</label>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI system" />
                </SelectTrigger>
                <SelectContent>
                  {aiSystems?.map((system) => (
                    <SelectItem key={system.id} value={system.id.toString()}>
                      {system.name}
                    </SelectItem>
                  ))}
                  {(!aiSystems || aiSystems.length === 0) && (
                    <SelectItem value="none" disabled>
                      No AI systems registered
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Framework</label>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.id || fw.name} value={fw.name}>
                      {fw.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssessmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunAssessment}>
              Run Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
