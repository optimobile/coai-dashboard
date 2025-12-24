/*
 * COAI Compliance Page
 * Multi-framework compliance status and gap analysis
 */

import { motion } from "framer-motion";
import { FileCheck, AlertCircle, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

const frameworks = [
  {
    name: "EU AI Act",
    fullName: "Regulation 2024/1689",
    score: 72,
    status: "In Progress",
    deadline: "August 2026",
    requirements: { total: 113, completed: 81, inProgress: 20, notStarted: 12 },
    gaps: ["Human oversight documentation", "Technical documentation", "Risk management system"],
  },
  {
    name: "NIST AI RMF",
    fullName: "AI 100-1",
    score: 85,
    status: "Compliant",
    deadline: "Voluntary",
    requirements: { total: 72, completed: 61, inProgress: 8, notStarted: 3 },
    gaps: ["Continuous monitoring metrics", "Stakeholder engagement records"],
  },
  {
    name: "TC260",
    fullName: "AI Safety Framework 2.0",
    score: 68,
    status: "In Progress",
    deadline: "Q2 2025",
    requirements: { total: 56, completed: 38, inProgress: 12, notStarted: 6 },
    gaps: ["Content traceability", "Algorithm registration", "Security assessment"],
  },
];

export default function Compliance() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold font-primary">Compliance</h1>
          <p className="text-muted-foreground text-sm">
            Track compliance across multiple AI safety frameworks
          </p>
        </div>

        <div className="space-y-4">
          {frameworks.map((fw, idx) => (
            <motion.div
              key={fw.name}
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
                  {fw.gaps.length > 0 && (
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
    </DashboardLayout>
  );
}
