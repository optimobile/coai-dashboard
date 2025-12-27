/*
 * CSOAI Training Page - Professional Redesign with Real Course Data
 * Clear course benefits, learning outcomes, and compelling content
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { BookOpen, Clock, CheckCircle, Award, TrendingUp, Shield, Users, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function TrainingV2() {
  const [selectedLevel, setSelectedLevel] = useState<"fundamentals" | "advanced" | "specialist" | undefined>();

  // Fetch courses
  const { data: courses = [], isLoading: coursesLoading } = trpc.courses.getCatalog.useQuery({
    level: selectedLevel,
  });

  // Filter for unique courses
  const uniqueCourses = Array.from(
    new Map(
      courses
        .filter((c: any) => c.modules && Array.isArray(c.modules) && c.modules.length > 0)
        .map((c: any) => [c.title, c])
    ).values()
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "fundamentals":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      case "advanced":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "specialist":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "fundamentals":
        return "🎯";
      case "advanced":
        return "⚡";
      case "specialist":
        return "👑";
      default:
        return "📚";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">100% Free Training</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Become an AI Safety Analyst
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master the three major global AI safety frameworks—EU AI Act, NIST AI RMF, and ISO 42001. Get certified and start earning $45-150/hour monitoring AI systems for compliance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold">
                Start Training Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/certification">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
                  View Certification
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">5 Modules</div>
                <div className="text-gray-300">Comprehensive Curriculum</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">~4 Hours</div>
                <div className="text-gray-300">Self-Paced Learning</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">Free</div>
                <div className="text-gray-300">Forever Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Training Matters */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Why This Training Matters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-l-4 border-l-emerald-600">
              <TrendingUp className="h-8 w-8 text-emerald-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Demand</h3>
              <p className="text-gray-600">
                AI Safety Analyst is projected to be a top 10 job by 2045. Demand far exceeds supply.
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-blue-600">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Industry Standards</h3>
              <p className="text-gray-600">
                Learn frameworks used by regulators worldwide: EU AI Act, NIST AI RMF, TC260.
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-600">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Immediate Earnings</h3>
              <p className="text-gray-600">
                Earn $45-150/hour reviewing AI systems. Work remote, set your own hours.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Available Training Programs</h2>

          {/* Level Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button
              variant={selectedLevel === undefined ? "default" : "outline"}
              onClick={() => setSelectedLevel(undefined)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              All Levels
            </Button>
            <Button
              variant={selectedLevel === "fundamentals" ? "default" : "outline"}
              onClick={() => setSelectedLevel("fundamentals")}
              className={selectedLevel === "fundamentals" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              Fundamentals
            </Button>
            <Button
              variant={selectedLevel === "advanced" ? "default" : "outline"}
              onClick={() => setSelectedLevel("advanced")}
              className={selectedLevel === "advanced" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              Advanced
            </Button>
            <Button
              variant={selectedLevel === "specialist" ? "default" : "outline"}
              onClick={() => setSelectedLevel("specialist")}
              className={selectedLevel === "specialist" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            >
              Specialist
            </Button>
          </div>

          {/* Loading State */}
          {coursesLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          )}

          {/* Courses Grid */}
          {!coursesLoading && uniqueCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueCourses.map((course: any) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    <div className="p-6 flex flex-col h-full">
                      {/* Header */}
                      <div className="mb-4">
                        <Badge className={`${getLevelColor(course.level)} mb-2`}>
                          {getLevelIcon(course.level)} {course.level}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 flex-grow">
                        {course.description || "Professional AI safety training"}
                      </p>

                      {/* Course Info */}
                      <div className="space-y-2 mb-6 text-sm text-gray-600">
                        {course.modules && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.modules.length} modules</span>
                          </div>
                        )}
                        {course.duration && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration} hours</span>
                          </div>
                        )}
                        {course.framework && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>{course.framework}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Start Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!coursesLoading && uniqueCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No courses available for this filter</p>
              <Button
                variant="outline"
                onClick={() => setSelectedLevel(undefined)}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What You'll Learn</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                EU AI Act Compliance
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Risk classification system (4 tiers)</li>
                <li>✓ Prohibited AI practices</li>
                <li>✓ High-risk AI system requirements</li>
                <li>✓ Transparency and documentation</li>
                <li>✓ Enforcement and penalties</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                NIST AI Risk Management
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 7 trustworthy AI characteristics</li>
                <li>✓ GOVERN, MAP, MEASURE, MANAGE functions</li>
                <li>✓ AI lifecycle management</li>
                <li>✓ Risk assessment and mitigation</li>
                <li>✓ Continuous monitoring</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                ISO 42001 Management Systems
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ AI Management System (AIMS) design</li>
                <li>✓ Governance and leadership</li>
                <li>✓ Risk and opportunity management</li>
                <li>✓ Performance evaluation</li>
                <li>✓ Certification process</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                Practical Skills
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Incident analysis and reporting</li>
                <li>✓ Risk scoring and assessment</li>
                <li>✓ Compliance documentation</li>
                <li>✓ Stakeholder communication</li>
                <li>✓ Real-world case studies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 text-emerald-100">
            Join thousands of AI safety analysts earning $45-150/hour while protecting humanity from AI risks.
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
            Enroll in Free Training
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
