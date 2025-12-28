import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Users, BookOpen, Award, Briefcase, Shield, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function HowItWorks() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 py-24">
          <div className="container max-w-4xl space-y-4">
            <Skeleton className="h-8 w-32 bg-white/10" />
            <Skeleton className="h-16 w-full bg-white/10" />
            <Skeleton className="h-16 w-3/4 bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your free CSOAI account in 2 minutes. No credit card required.",
      icon: Users,
      details: [
        "Email or OAuth signup",
        "Instant account activation",
        "Access to free training"
      ]
    },
    {
      number: 2,
      title: "Learn & Train",
      description: "Complete our comprehensive AI safety training covering EU AI Act, NIST AI RMF, and ISO 42001.",
      icon: BookOpen,
      details: [
        "Self-paced learning (4-6 hours)",
        "Real-world case studies",
        "Interactive quizzes"
      ]
    },
    {
      number: 3,
      title: "Get Certified",
      description: "Pass our industry-recognized certification exam to become an official CSOAI Watchdog Analyst.",
      icon: Award,
      details: [
        "50 multiple-choice questions",
        "90-minute exam",
        "70% passing threshold"
      ]
    },
    {
      number: 4,
      title: "Start Earning",
      description: "Browse available AI safety monitoring jobs and start earning $45-150/hour remotely.",
      icon: Briefcase,
      details: [
        "Flexible work schedule",
        "100% remote positions",
        "Competitive compensation"
      ]
    }
  ];

  const features = [
    {
      title: "Byzantine Consensus",
      description: "Our 33-Agent Council uses 12 different AI providers. No single vendor can manipulate outcomes.",
      icon: Shield
    },
    {
      title: "Complete Transparency",
      description: "Every decision is public. Real-time compliance scores, voting records, and analyst reviews.",
      icon: Zap
    },
    {
      title: "Global Frameworks",
      description: "Aligned with EU AI Act, NIST AI RMF, and ISO 42001—the three major global standards.",
      icon: Award
    }
  ];

  return (
    <>
      <Helmet>
        <title>How It Works - CSOAI | AI Safety Certification Platform</title>
        <meta name="description" content="Learn how CSOAI works: sign up, train, get certified, and start earning as an AI Safety Analyst." />
        <meta name="og:title" content="How It Works - CSOAI" />
        <meta name="og:description" content="The complete process to become a certified AI Safety Analyst and start earning." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 py-24">
          <div className="container max-w-4xl">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Simple 4-Step Process
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How CSOAI Works
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From zero to certified AI Safety Analyst in just a few hours. Start your career protecting humanity from AI risks.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-4xl py-20">
          {/* 4-Step Process */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Your Path to Certification
            </h2>
            
            <div className="space-y-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex gap-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600 text-white font-bold text-xl">
                        {step.number}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-6 w-6 text-emerald-600" />
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Arrow */}
                    {idx < steps.length - 1 && (
                      <div className="hidden md:flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-gray-300 rotate-90 md:rotate-0" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why Choose CSOAI?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card key={idx} className="p-6 border border-gray-200 hover:border-emerald-600 transition-colors">
                    <Icon className="h-8 w-8 text-emerald-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-20 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Timeline</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-emerald-600 font-bold min-w-fit">2 minutes</div>
                <div>
                  <p className="font-semibold text-gray-900">Create Account</p>
                  <p className="text-gray-600">Sign up and verify your email</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-emerald-600 font-bold min-w-fit">4-6 hours</div>
                <div>
                  <p className="font-semibold text-gray-900">Complete Training</p>
                  <p className="text-gray-600">Learn at your own pace, take breaks anytime</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-emerald-600 font-bold min-w-fit">90 minutes</div>
                <div>
                  <p className="font-semibold text-gray-900">Take Exam</p>
                  <p className="text-gray-600">50 questions, 70% to pass, unlimited retakes</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-emerald-600 font-bold min-w-fit">Same day</div>
                <div>
                  <p className="font-semibold text-gray-900">Start Earning</p>
                  <p className="text-gray-600">Browse jobs and apply immediately after certification</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <Card className="p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Do I need any prior experience?</h3>
                <p className="text-gray-600">No. Our training teaches you everything from scratch. We only require critical thinking skills and attention to detail.</p>
              </Card>
              
              <Card className="p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Can I retake the exam if I fail?</h3>
                <p className="text-gray-600">Yes, unlimited retakes. Most students pass on their first attempt. We provide detailed feedback to help you improve.</p>
              </Card>
              
              <Card className="p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Is the training really free?</h3>
                <p className="text-gray-600">Yes, 100% free. We make money when you get certified and start earning as an analyst. Your success is our success.</p>
              </Card>
              
              <Card className="p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">How do I get paid?</h3>
                <p className="text-gray-600">We match you with AI safety monitoring jobs. You work directly with enterprises, get paid per hour, and manage your own schedule.</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your AI Safety Career?</h2>
            <p className="text-lg mb-8 text-emerald-50">
              Join thousands of analysts protecting humanity from AI risks. Start free training today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
