import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Users, TrendingUp } from "lucide-react";

export default function WatchdogTraining() {
  // Mock data for training modules
  const modules = [
    {
      id: 1,
      title: "AI Safety Fundamentals",
      description: "Learn the basics of AI safety, risk assessment, and governance principles.",
      duration: "4 hours",
      lessons: 12,
      completed: 8,
      difficulty: "Beginner",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "EU AI Act Compliance",
      description: "Deep dive into Article 14 requirements and human oversight obligations.",
      duration: "6 hours",
      lessons: 18,
      completed: 0,
      difficulty: "Intermediate",
      icon: Award,
    },
    {
      id: 3,
      title: "NIST AI Risk Management",
      description: "Master the NIST framework for AI governance and risk assessment.",
      duration: "5 hours",
      lessons: 15,
      completed: 0,
      difficulty: "Intermediate",
      icon: TrendingUp,
    },
    {
      id: 4,
      title: "Incident Analysis & Reporting",
      description: "Learn how to identify, document, and report AI safety incidents.",
      duration: "3 hours",
      lessons: 10,
      completed: 0,
      difficulty: "Advanced",
      icon: Users,
    },
  ];

  const stats = [
    { label: "Total Hours", value: "18/24" },
    { label: "Modules Completed", value: "1/4" },
    { label: "Certification Progress", value: "45%" },
    { label: "Estimated Completion", value: "8 days" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Watchdog Training Program</h1>
          <p className="text-lg text-muted-foreground">
            Become a certified AI Safety Analyst and join our global oversight network
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <Card className="p-6 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Overall Progress</h2>
          <Progress value={45} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">45% complete • Keep going!</p>
        </Card>

        {/* Training Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Training Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              const progressPercent = (module.completed / module.lessons) * 100;

              return (
                <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {module.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {module.completed}/{module.lessons} lessons
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>⏱ {module.duration}</span>
                    <span>{Math.round(progressPercent)}% complete</span>
                  </div>

                  <Button
                    className="w-full"
                    variant={module.completed > 0 ? "default" : "outline"}
                  >
                    {module.completed > 0 ? "Continue Learning" : "Start Module"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certification Path */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Certification Path</h2>
          <p className="text-muted-foreground mb-6">
            Complete all modules and pass the final exam to earn your CEASAI (Certified Enterprise AI Safety Analyst) certification.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground">Complete Modules</p>
                <p className="text-sm text-muted-foreground">Finish all 4 training modules</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground">Pass Exam</p>
                <p className="text-sm text-muted-foreground">Score 80%+ on final assessment</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground">Earn Certificate</p>
                <p className="text-sm text-muted-foreground">Get CEASAI certification</p>
              </div>
            </div>
          </div>

          <Button className="mt-6" size="lg">
            View Certification Details
          </Button>
        </Card>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How long does the training take?",
                a: "Most analysts complete the program in 2-4 weeks, depending on their pace. You can study at your own speed.",
              },
              {
                q: "Is there a cost?",
                a: "The training is free for all participants. Certification is included upon completion.",
              },
              {
                q: "What happens after certification?",
                a: "You'll be eligible to join our analyst network and start earning $45-$150/hour reviewing AI systems.",
              },
              {
                q: "Can I get a refund?",
                a: "Since training is free, there are no refunds. However, you can pause and resume at any time.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
