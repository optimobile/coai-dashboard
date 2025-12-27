/**
 * CEASAI Landing Page
 * Professional AI Safety Analyst Certification Pathway
 * Specialization tracks, prerequisites, ROI metrics for enterprises
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Clock,
  Target,
  BookOpen,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

export default function CEASAI() {
  const [selectedTrack, setSelectedTrack] = useState<"fundamentals" | "advanced" | "specialist">("fundamentals");

  const tracks = {
    fundamentals: {
      title: "Fundamentals Track",
      duration: "3 months",
      price: "$1,499",
      description: "Perfect for beginners. Master AI safety basics and compliance frameworks.",
      modules: 12,
      hours: 40,
      prerequisites: "None - start here",
      outcomes: [
        "Understand EU AI Act requirements",
        "Learn NIST AI RMF framework",
        "Identify common AI risks",
        "Write basic compliance reports",
      ],
      nextTrack: "Advanced",
      jobTitles: ["Junior AI Safety Analyst", "Compliance Specialist"],
      avgSalary: "$45-65/hour",
    },
    advanced: {
      title: "Advanced Track",
      duration: "4 months",
      price: "$2,499",
      description: "Build on fundamentals. Specialize in risk assessment and enterprise compliance.",
      modules: 16,
      hours: 60,
      prerequisites: "Fundamentals Track completion",
      outcomes: [
        "Advanced risk assessment techniques",
        "Enterprise compliance strategies",
        "Bias detection and mitigation",
        "Lead compliance projects",
      ],
      nextTrack: "Specialist",
      jobTitles: ["Senior AI Safety Analyst", "Compliance Manager"],
      avgSalary: "$75-120/hour",
    },
    specialist: {
      title: "Specialist Track",
      duration: "3 months",
      price: "$3,499",
      description: "Expert level. Lead enterprise AI safety programs and regulatory strategy.",
      modules: 14,
      hours: 50,
      prerequisites: "Advanced Track completion",
      outcomes: [
        "Enterprise AI governance",
        "Regulatory strategy development",
        "Board-level reporting",
        "Industry thought leadership",
      ],
      nextTrack: "Advisory Board",
      jobTitles: ["Chief AI Safety Officer", "Regulatory Director"],
      avgSalary: "$120-150/hour",
    },
  };

  const track = tracks[selectedTrack];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="mx-auto bg-white/20 text-white border-white/30 text-base px-4 py-1">
              <Award className="w-4 h-4 mr-2 inline" />
              Professional Certification Program
            </Badge>
            <h1 className="text-6xl font-bold leading-tight">
              Become a Certified AI Safety Analyst
            </h1>
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join the fastest-growing profession. Get certified. Earn $45-150/hour. Make AI safer.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-300" />
                <span>ISO 17024 Aligned</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-300" />
                <span>Industry Recognized</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-300" />
                <span>Lifetime Credential</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container max-w-6xl py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-8 text-center border-2 border-blue-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-gray-700 font-medium">Certified Analysts</p>
            <p className="text-sm text-gray-500 mt-2">Active worldwide</p>
          </Card>
          <Card className="p-8 text-center border-2 border-blue-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">$67/hr</div>
            <p className="text-gray-700 font-medium">Average Rate</p>
            <p className="text-sm text-gray-500 mt-2">Range: $45-150/hr</p>
          </Card>
          <Card className="p-8 text-center border-2 border-blue-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <p className="text-gray-700 font-medium">Satisfaction</p>
            <p className="text-sm text-gray-500 mt-2">Student rated</p>
          </Card>
          <Card className="p-8 text-center border-2 border-blue-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
            <p className="text-gray-700 font-medium">Job Openings</p>
            <p className="text-sm text-gray-500 mt-2">Available now</p>
          </Card>
        </div>
      </div>

      {/* Certification Pathway */}
      <div className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Certification Pathway</h2>

          {/* Track Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(tracks).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedTrack(key as any)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  selectedTrack === key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400"
                }`}
              >
                {value.title}
              </button>
            ))}
          </div>

          {/* Track Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Track Card */}
            <div className="lg:col-span-2">
              <Card className="p-12 border-2 border-blue-200 shadow-xl">
                <div className="mb-8">
                  <h3 className="text-4xl font-bold mb-4">{track.title}</h3>
                  <p className="text-xl text-gray-600 mb-6">{track.description}</p>
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{track.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{track.modules} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">{track.hours} hours</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-gray-200">
                  <div>
                    <h4 className="font-bold text-lg mb-4">Learning Outcomes</h4>
                    <ul className="space-y-3">
                      {track.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4">Career Opportunities</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Job Titles</p>
                        <div className="space-y-2">
                          {track.jobTitles.map((title, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-700">
                              {title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Average Rate</p>
                        <p className="text-2xl font-bold text-blue-600">{track.avgSalary}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Prerequisites</p>
                  <p className="text-lg font-semibold text-gray-900">{track.prerequisites}</p>
                </div>
              </Card>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="p-8 sticky top-24 shadow-xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{track.price}</h3>
                <p className="text-sm text-gray-600 mb-6">One-time investment</p>

                <Link href="/courses">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold mb-4">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Official certificate</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Job placement help</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>30-day guarantee</span>
                  </div>
                </div>

                {selectedTrack !== "specialist" && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-xs text-gray-600 mb-3">Next step:</p>
                    <p className="font-semibold text-gray-900">{track.nextTrack} Track</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Visualization */}
      <div className="container max-w-6xl py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Your Learning Journey</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {[
            { title: "Fundamentals", duration: "3 mo", icon: "🎯" },
            { title: "Advanced", duration: "4 mo", icon: "⚡" },
            { title: "Specialist", duration: "3 mo", icon: "👑" },
            { title: "Advisory Board", duration: "Ongoing", icon: "🌟" },
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-4 flex-1">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl mb-3 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="font-bold text-center">{step.title}</h3>
                <p className="text-sm text-gray-600 text-center">{step.duration}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block flex-1 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise ROI Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 py-20 border-t border-gray-200">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Enterprise ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-indigo-200">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Cost Savings</h3>
              <p className="text-gray-700 mb-4">
                Reduce compliance costs by 40% with certified analysts managing your AI safety program.
              </p>
              <p className="text-3xl font-bold text-indigo-600">$500K+</p>
              <p className="text-sm text-gray-600">Annual savings for enterprises</p>
            </Card>

            <Card className="p-8 border-2 border-indigo-200">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-3">Risk Mitigation</h3>
              <p className="text-gray-700 mb-4">
                Identify and address AI risks before they become regulatory violations.
              </p>
              <p className="text-3xl font-bold text-indigo-600">99%</p>
              <p className="text-sm text-gray-600">Risk detection rate</p>
            </Card>

            <Card className="p-8 border-2 border-indigo-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Time to Market</h3>
              <p className="text-gray-700 mb-4">
                Accelerate product launches with faster compliance assessments.
              </p>
              <p className="text-3xl font-bold text-indigo-600">60%</p>
              <p className="text-sm text-gray-600">Faster compliance review</p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 500+ certified AI Safety Analysts. Get certified. Build your career. Make AI safer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
