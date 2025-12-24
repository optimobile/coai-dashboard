/*
 * COAI Training Page
 * Training modules for Watchdog Analyst certification
 */

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Lock,
  Award,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Training modules content (will be moved to database)
const trainingModulesData = [
  {
    id: 1,
    code: "MOD-001",
    title: "Introduction to AI Safety",
    description: "Learn the fundamentals of AI safety, why it matters, and the role of human oversight in AI systems.",
    duration: 30,
    topics: ["What is AI Safety?", "Historical AI incidents", "The human-in-the-loop approach", "COAI's mission"],
  },
  {
    id: 2,
    code: "MOD-002",
    title: "Understanding Bias and Fairness",
    description: "Explore how bias manifests in AI systems and learn to identify unfair outcomes.",
    duration: 45,
    topics: ["Types of AI bias", "Protected characteristics", "Fairness metrics", "Case studies"],
  },
  {
    id: 3,
    code: "MOD-003",
    title: "Privacy and Data Protection",
    description: "Understand privacy risks in AI and how to evaluate data handling practices.",
    duration: 40,
    topics: ["GDPR fundamentals", "Data minimization", "Consent and transparency", "Privacy impact assessment"],
  },
  {
    id: 4,
    code: "MOD-004",
    title: "EU AI Act Fundamentals",
    description: "Learn the key requirements of the EU AI Act and how to assess compliance.",
    duration: 60,
    topics: ["Risk classification", "High-risk AI requirements", "Prohibited practices", "Compliance deadlines"],
  },
  {
    id: 5,
    code: "MOD-005",
    title: "Case Review Methodology",
    description: "Master the process of reviewing AI safety incidents and making informed decisions.",
    duration: 45,
    topics: ["Evidence evaluation", "Decision frameworks", "Writing clear reasoning", "When to escalate"],
  },
];

export default function Training() {
  const [, setLocation] = useLocation();
  const { data: progress } = trpc.training.getProgress.useQuery();
  
  // Calculate overall progress
  const completedModules = progress?.filter(p => p.status === "completed").length || 0;
  const totalModules = trainingModulesData.length;
  const overallProgress = (completedModules / totalModules) * 100;
  const allCompleted = completedModules === totalModules;

  const getModuleStatus = (moduleId: number) => {
    const moduleProgress = progress?.find(p => p.moduleId === moduleId);
    return moduleProgress?.status || "not_started";
  };

  const handleStartModule = (moduleId: number) => {
    // In a real app, this would navigate to the module content
    toast.info("Module content coming soon!", {
      description: "Training modules are being developed.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Watchdog Analyst Training</h1>
            <p className="text-muted-foreground text-sm">
              Complete all modules to unlock the certification test
            </p>
          </div>
          <Button 
            onClick={() => setLocation("/certification")}
            disabled={!allCompleted}
            className="gap-2"
          >
            <Award className="h-4 w-4" />
            Take Certification Test
            {!allCompleted && <Lock className="h-3 w-3 ml-1" />}
          </Button>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Your Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {completedModules} of {totalModules} modules completed
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {allCompleted 
                      ? "🎉 Congratulations! You're ready to take the certification test."
                      : `Complete ${totalModules - completedModules} more module${totalModules - completedModules > 1 ? 's' : ''} to unlock certification.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Training Modules */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Training Modules</h2>
          
          <div className="grid gap-4">
            {trainingModulesData.map((module, idx) => {
              const status = getModuleStatus(module.id);
              const isCompleted = status === "completed";
              const isInProgress = status === "in_progress";
              const isLocked = idx > 0 && getModuleStatus(trainingModulesData[idx - 1].id) !== "completed";

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                >
                  <Card className={`transition-all ${
                    isCompleted 
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" 
                      : isLocked 
                        ? "opacity-60" 
                        : "hover:shadow-md"
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Module Number */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : isInProgress
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : isLocked ? (
                            <Lock className="h-5 w-5" />
                          ) : (
                            <span className="font-bold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Module Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {module.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {module.description}
                              </p>
                            </div>
                            
                            <Button
                              variant={isCompleted ? "outline" : "default"}
                              size="sm"
                              disabled={isLocked}
                              onClick={() => handleStartModule(module.id)}
                              className="flex-shrink-0"
                            >
                              {isCompleted ? (
                                <>Review</>
                              ) : isInProgress ? (
                                <>Continue <ArrowRight className="ml-1 h-4 w-4" /></>
                              ) : (
                                <>Start <Play className="ml-1 h-4 w-4" /></>
                              )}
                            </Button>
                          </div>

                          {/* Module Meta */}
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.duration} min
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {module.topics.length} topics
                            </span>
                            {isCompleted && (
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                ✓ Completed
                              </span>
                            )}
                          </div>

                          {/* Topics Preview */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {module.topics.map((topic, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Certification CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                COAI Watchdog Analyst Certification
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                After completing all training modules, you'll take a 50-question certification test.
                Score 70% or higher to earn your certificate and start reviewing cases.
              </p>
              <Button 
                onClick={() => setLocation("/certification")}
                disabled={!allCompleted}
                variant={allCompleted ? "default" : "outline"}
              >
                {allCompleted ? "Take Certification Test" : "Complete Training First"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
