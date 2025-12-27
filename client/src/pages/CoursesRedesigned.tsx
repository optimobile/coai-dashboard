/**
 * Redesigned Courses Page - 3-Column Grid Layout
 * Enhanced UX with better spacing, course cards, and navigation
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Award, TrendingUp, CheckCircle2, Loader2, Star, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function CoursesRedesigned() {
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<"fundamentals" | "advanced" | "specialist" | undefined>();
  const [selectedFramework, setSelectedFramework] = useState<string | undefined>();

  // Fetch regions
  const { data: regions = [] } = trpc.courses.getRegions.useQuery();

  // Fetch courses with filters
  const { data: courses = [], isLoading: coursesLoading } = trpc.courses.getCatalog.useQuery({
    regionId: selectedRegion,
    level: selectedLevel,
    framework: selectedFramework,
  });

  // Fetch bundles
  const { data: bundles = [] } = trpc.courses.getCourseBundles.useQuery({
    regionId: selectedRegion,
  });

  // Remove duplicates and courses without modules
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
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
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-12 shadow-2xl">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-base px-4 py-1">
              <Award className="w-4 h-4 mr-2" />
              CEASAI Professional Certification
            </Badge>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Master AI Safety & Compliance
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Get certified as an AI Safety Analyst. Learn from industry experts. Earn $45-150/hour reviewing AI systems.
            </p>
            <div className="flex flex-wrap gap-8 text-base">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-300" />
                <span>Expert-Led Courses</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-300" />
                <span>Flexible Payment Plans</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-300" />
                <span>Official Certificates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Bundles Section */}
        {bundles.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Special Bundles & Deals</h2>
              <p className="text-gray-600">Save up to 40% with our curated course bundles</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundles.map((bundle: any) => (
                <Card key={bundle.id} className="p-8 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{bundle.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{bundle.description}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-lg px-3 py-1">
                      Save {bundle.discountPercent}%
                    </Badge>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Regular Price:</span>
                      <span className="line-through text-gray-500">${(bundle.regularPrice / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Bundle Price:</span>
                      <span className="text-3xl font-bold text-emerald-600">${(bundle.bundlePrice / 100).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link href={`/bundle/${bundle.id}`}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      View Bundle
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">All Courses</h2>
            <p className="text-gray-600">Browse our complete catalog of AI safety and compliance courses</p>
          </div>
          <Card className="p-8 shadow-lg border-2 border-gray-100">
            <h3 className="text-lg font-semibold mb-6">Filter Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-semibold mb-3 block text-gray-700">Region</label>
                <Select
                  value={selectedRegion?.toString()}
                  onValueChange={(value) => setSelectedRegion(value === "all" ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region: any) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block text-gray-700">Level</label>
                <Select
                  value={selectedLevel || "all"}
                  onValueChange={(value: any) => setSelectedLevel(value === "all" ? undefined : value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="fundamentals">Fundamentals</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="specialist">Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold mb-3 block text-gray-700">Framework</label>
                <Select
                  value={selectedFramework || "all"}
                  onValueChange={(value) => setSelectedFramework(value === "all" ? undefined : value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Frameworks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    <SelectItem value="EU AI Act">EU AI Act</SelectItem>
                    <SelectItem value="NIST AI RMF">NIST AI RMF</SelectItem>
                    <SelectItem value="ISO/IEC 42001">ISO/IEC 42001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Courses Grid */}
        <div>
          {coursesLoading ? (
            <div className="text-center py-16">
              <Loader2 className="inline-block h-10 w-10 animate-spin text-blue-600" />
              <p className="mt-4 text-gray-600 text-lg">Loading courses...</p>
            </div>
          ) : uniqueCourses.length === 0 ? (
            <Card className="p-16 text-center border-2 border-gray-100">
              <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No courses found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uniqueCourses.map((course: any) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="h-full p-8 border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    {/* Course Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl group-hover:scale-110 transition-transform">
                          {getLevelIcon(course.level)}
                        </div>
                        <Badge className={getLevelColor(course.level)}>
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {course.framework}
                      </Badge>
                    </div>

                    {/* Course Description */}
                    <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Metadata */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-gray-200">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{course.durationHours} hours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{course.modules?.length || 0} modules</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">1,200+ students</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${(course.price / 100).toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500">One-time payment</p>
                      {course.price3Month && (
                        <p className="text-xs text-blue-600 mt-2">
                          Or ${((course.price3Month / 3) / 100).toFixed(2)}/month for 3 months
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold group-hover:shadow-lg transition-shadow">
                      View Course Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 border-2 border-blue-200">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose CEASAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-700 font-medium">Certified Analysts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$67/hr</div>
              <p className="text-gray-700 font-medium">Average Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <p className="text-gray-700 font-medium">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-700 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
