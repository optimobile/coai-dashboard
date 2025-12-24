/*
 * COAI Analyst Workbench
 * Case review interface for certified Watchdog Analysts
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  MessageSquare,
  Eye,
  Trophy,
  TrendingUp,
  Target,
  Timer,
  ChevronRight,
  Send,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Sample cases for demo (will be loaded from database)
const sampleCases = [
  {
    id: 1,
    title: "Gender bias detected in job recommendation AI",
    description: "A user reported that a job recommendation system consistently shows higher-paying tech jobs to male users while showing administrative roles to female users with similar qualifications.",
    incidentType: "bias",
    severity: "high",
    company: "TechRecruit AI",
    reportedAt: "2024-12-23T10:30:00Z",
    dueAt: "2024-12-25T10:30:00Z",
    councilVotes: { approve: 8, reject: 15, escalate: 10 },
    status: "assigned",
    priority: "high",
  },
  {
    id: 2,
    title: "AI chatbot providing medical advice without disclaimer",
    description: "A health-focused chatbot is providing specific medical diagnoses and treatment recommendations without proper disclaimers or suggestions to consult healthcare professionals.",
    incidentType: "safety",
    severity: "critical",
    company: "HealthBot Inc",
    reportedAt: "2024-12-22T14:00:00Z",
    dueAt: "2024-12-24T14:00:00Z",
    councilVotes: { approve: 5, reject: 20, escalate: 8 },
    status: "assigned",
    priority: "urgent",
  },
  {
    id: 3,
    title: "Privacy concern: AI assistant storing conversation history",
    description: "Users discovered that an AI assistant is storing full conversation histories including sensitive personal information without clear consent or data retention policies.",
    incidentType: "privacy",
    severity: "medium",
    company: "AssistAI Corp",
    reportedAt: "2024-12-21T09:15:00Z",
    dueAt: "2024-12-26T09:15:00Z",
    councilVotes: { approve: 12, reject: 10, escalate: 11 },
    status: "assigned",
    priority: "medium",
  },
];

const severityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const priorityColors: Record<string, string> = {
  low: "border-blue-500",
  medium: "border-yellow-500",
  high: "border-orange-500",
  urgent: "border-red-500",
};

export default function Workbench() {
  const [, setLocation] = useLocation();
  const [selectedCase, setSelectedCase] = useState<typeof sampleCases[0] | null>(null);
  const [decision, setDecision] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [activeTab, setActiveTab] = useState("queue");

  const { data: performance } = trpc.workbench.getMyPerformance.useQuery();
  const { data: certificates } = trpc.certification.getMyCertificates.useQuery();
  
  const isCertified = certificates && certificates.length > 0;

  // If not certified, show prompt to get certified
  if (!isCertified) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Certification Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to complete the Watchdog Analyst certification before accessing the workbench.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setLocation("/training")}>
                Start Training
              </Button>
              <Button onClick={() => setLocation("/certification")}>
                Take Certification Test
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmitDecision = () => {
    if (!decision || !reasoning || reasoning.length < 50) {
      toast.error("Please provide a decision and detailed reasoning (at least 50 characters)");
      return;
    }

    toast.success("Decision submitted successfully!", {
      description: "Your review has been recorded and will contribute to the final outcome.",
    });

    // Reset form
    setSelectedCase(null);
    setDecision(null);
    setReasoning("");
  };

  const formatTimeRemaining = (dueAt: string) => {
    const due = new Date(dueAt);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    
    if (diff < 0) return "Overdue";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h remaining`;
    
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Analyst Workbench</h1>
            <p className="text-muted-foreground text-sm">
              Review AI safety cases and contribute to the COAI ecosystem
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3 w-3" />
            Certified Analyst
          </Badge>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{performance?.totalCasesCompleted || 0}</p>
                  <p className="text-xs text-muted-foreground">Cases Reviewed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{performance?.accuracyRate || "N/A"}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{performance?.avgResponseTimeMinutes || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Avg Response (min)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">#{performance?.rank || "—"}</p>
                  <p className="text-xs text-muted-foreground">Leaderboard Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Case Queue */}
          <div className="col-span-1 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="queue" className="flex-1">Queue ({sampleCases.length})</TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="queue" className="space-y-3 mt-4">
                {sampleCases.map((caseItem) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                        priorityColors[caseItem.priority]
                      } ${selectedCase?.id === caseItem.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {caseItem.title}
                          </h3>
                          <Badge className={severityColors[caseItem.severity]} variant="secondary">
                            {caseItem.severity}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeRemaining(caseItem.dueAt)}
                          </span>
                          <span>{caseItem.company}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No completed cases yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Case Detail & Review */}
          <div className="col-span-2">
            {selectedCase ? (
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={severityColors[selectedCase.severity]} variant="secondary">
                        {selectedCase.severity} severity
                      </Badge>
                      <CardTitle className="mt-2">{selectedCase.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reported by user • {selectedCase.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeRemaining(selectedCase.dueAt)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Incident Description */}
                  <div>
                    <h4 className="font-medium mb-2">Incident Description</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      {selectedCase.description}
                    </p>
                  </div>

                  {/* Council Votes */}
                  <div>
                    <h4 className="font-medium mb-3">33-Agent Council Votes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Approve</span>
                        <Progress 
                          value={(selectedCase.councilVotes.approve / 33) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {selectedCase.councilVotes.approve}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Reject</span>
                        <Progress 
                          value={(selectedCase.councilVotes.reject / 33) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {selectedCase.councilVotes.reject}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Escalate</span>
                        <Progress 
                          value={(selectedCase.councilVotes.escalate / 33) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {selectedCase.councilVotes.escalate}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      No consensus reached (22/33 required). Human review needed.
                    </p>
                  </div>

                  {/* Your Decision */}
                  <div>
                    <h4 className="font-medium mb-3">Your Decision</h4>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <Button
                        variant={decision === "approve" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "approve" ? "bg-green-600 hover:bg-green-700" : ""
                        }`}
                        onClick={() => setDecision("approve")}
                      >
                        <ThumbsUp className="h-5 w-5 mb-1" />
                        <span className="text-xs">Approve</span>
                      </Button>
                      <Button
                        variant={decision === "reject" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "reject" ? "bg-red-600 hover:bg-red-700" : ""
                        }`}
                        onClick={() => setDecision("reject")}
                      >
                        <ThumbsDown className="h-5 w-5 mb-1" />
                        <span className="text-xs">Reject</span>
                      </Button>
                      <Button
                        variant={decision === "escalate" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "escalate" ? "bg-orange-600 hover:bg-orange-700" : ""
                        }`}
                        onClick={() => setDecision("escalate")}
                      >
                        <ArrowUpRight className="h-5 w-5 mb-1" />
                        <span className="text-xs">Escalate</span>
                      </Button>
                      <Button
                        variant={decision === "needs_more_info" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "needs_more_info" ? "bg-blue-600 hover:bg-blue-700" : ""
                        }`}
                        onClick={() => setDecision("needs_more_info")}
                      >
                        <HelpCircle className="h-5 w-5 mb-1" />
                        <span className="text-xs">Need Info</span>
                      </Button>
                    </div>

                    <Textarea
                      placeholder="Provide your reasoning for this decision (minimum 50 characters)..."
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {reasoning.length}/50 characters minimum
                    </p>
                  </div>

                  {/* Submit */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleSubmitDecision}
                    disabled={!decision || reasoning.length < 50}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Decision
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Select a Case to Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a case from the queue to view details and submit your decision
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
