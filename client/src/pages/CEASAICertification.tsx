import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle, Users, TrendingUp, BookOpen } from "lucide-react";

export default function CEASAICertification() {
  const certLevels = [
    {
      id: 1,
      name: "CEASAI Associate",
      level: "Level 1",
      description: "Entry-level certification for AI safety fundamentals",
      requirements: [
        "Complete AI Safety Fundamentals module",
        "Score 80%+ on associate exam",
        "2+ hours of practical case studies",
      ],
      benefits: [
        "Access to analyst job board",
        "Earn $45-60/hour on entry-level cases",
        "Join community network",
      ],
      duration: "2-3 weeks",
      examQuestions: 50,
      passScore: 80,
      cost: "Free",
      icon: BookOpen,
    },
    {
      id: 2,
      name: "CEASAI Professional",
      level: "Level 2",
      description: "Advanced certification for compliance professionals",
      requirements: [
        "CEASAI Associate certification",
        "Complete EU AI Act & NIST modules",
        "Score 85%+ on professional exam",
        "5+ hours of complex case analysis",
      ],
      benefits: [
        "Earn $75-120/hour on complex cases",
        "Access to enterprise compliance projects",
        "Priority for high-value assignments",
        "Mentorship opportunities",
      ],
      duration: "4-6 weeks",
      examQuestions: 100,
      passScore: 85,
      cost: "$99",
      icon: Award,
    },
    {
      id: 3,
      name: "CEASAI Expert",
      level: "Level 3",
      description: "Elite certification for governance and advisory roles",
      requirements: [
        "CEASAI Professional certification",
        "Complete all compliance frameworks",
        "Score 90%+ on expert exam",
        "10+ hours of governance case studies",
        "Demonstrated track record (50+ verified cases)",
      ],
      benefits: [
        "Earn $120-150/hour on advisory work",
        "Eligible for advisory board positions",
        "Lead analyst teams",
        "Exclusive research opportunities",
        "Conference speaking invitations",
      ],
      duration: "8-12 weeks",
      examQuestions: 150,
      passScore: 90,
      cost: "$299",
      icon: TrendingUp,
    },
  ];

  const stats = [
    { label: "Certified Analysts", value: "2,847", icon: Users },
    { label: "Avg. Hourly Rate", value: "$87/hr", icon: TrendingUp },
    { label: "Certification Success Rate", value: "94%", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">CEASAI Certification</h1>
          <p className="text-lg text-muted-foreground">
            Become a Certified Enterprise AI Safety Analyst. Three levels of expertise, unlimited earning potential.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-primary opacity-20" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Certification Levels */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Certification Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certLevels.map((cert) => {
              const Icon = cert.icon;
              return (
                <Card key={cert.id} className="p-6 flex flex-col hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {cert.level}
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground">{cert.name}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>

                  <div className="space-y-4 mb-6 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">REQUIREMENTS:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {cert.requirements.map((req, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">BENEFITS:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {cert.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4 border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium text-foreground">{cert.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exam Questions:</span>
                      <span className="font-medium text-foreground">{cert.examQuestions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pass Score:</span>
                      <span className="font-medium text-foreground">{cert.passScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-bold text-primary">{cert.cost}</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    {cert.id === 1 ? "Start Free" : "Upgrade"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Career Path */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Career Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Get Certified</h4>
              <p className="text-sm text-muted-foreground">Complete training & pass exam</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">Join Network</h4>
              <p className="text-sm text-muted-foreground">Access job board & cases</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Earn & Advance</h4>
              <p className="text-sm text-muted-foreground">$45-150/hour, get promoted</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto mb-3">
                4
              </div>
              <h4 className="font-semibold text-foreground mb-2">Lead & Mentor</h4>
              <p className="text-sm text-muted-foreground">Advisory board, team leads</p>
            </div>
          </div>
        </Card>

        {/* Exam Details */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Exam Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Question Types</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Multiple choice (40%)</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Case study analysis (40%)</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Short answer (20%)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Exam Details</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Proctored online exam</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>2-3 hours duration</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Results within 24 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I retake the exam if I fail?",
                a: "Yes, you can retake the exam after 7 days. You get 3 attempts within 90 days.",
              },
              {
                q: "Is the certification recognized globally?",
                a: "Yes, CEASAI is recognized by EU regulators, enterprises, and governments as the standard for AI safety analysts.",
              },
              {
                q: "How long is the certification valid?",
                a: "Certifications are valid for 3 years. You can renew by completing a 4-hour refresher course.",
              },
              {
                q: "Do I need prior experience?",
                a: "No, the Associate level is designed for beginners. We provide all training materials.",
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
