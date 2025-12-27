/**
 * Individual Course Detail Page
 * Comprehensive course information with enrollment and payment options
 */

import { useParams } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Award,
  BookOpen,
  Users,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "wouter";

export default function CourseDetail() {
  const { id } = useParams();
  const courseId = parseInt(id || "0");
  const [selectedPlan, setSelectedPlan] = useState<"oneTime" | "threeMonth" | "sixMonth" | "twelveMonth">("oneTime");

  // Fetch course details
  const { data: course, isLoading } = trpc.courses.getCatalog.useQuery({
    // We'll need to add a getCourseById endpoint
  });

  const enrollMutation = trpc.courses.enrollInCourse.useMutation();

  const handleEnroll = async () => {
    try {
      const paymentTypeMap = {
        oneTime: "one_time",
        threeMonth: "3_month",
        sixMonth: "6_month",
        twelveMonth: "12_month",
      };

      const result = await enrollMutation.mutateAsync({
        courseId,
        paymentType: paymentTypeMap[selectedPlan] as any,
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in course");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
            <Link href="/courses">
              <Button className="w-full">Back to Courses</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return "N/A";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const calculateMonthlyPayment = (totalCents: number, months: number) => {
    return `$${((totalCents / months) / 100).toFixed(2)}/mo`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl p-12">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Award className="w-4 h-4 mr-2" />
              Professional Certification
            </Badge>
            <h1 className="text-5xl font-bold mb-6">{course.title}</h1>
            <p className="text-xl text-blue-100 mb-8">{course.description}</p>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6" />
                <div>
                  <div className="font-semibold">{course.durationHours} Hours</div>
                  <div className="text-sm text-blue-200">Course Duration</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <div className="font-semibold">{course.modules?.length || 0} Modules</div>
                  <div className="text-sm text-blue-200">Learning Units</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div>
                  <div className="font-semibold">1,200+ Students</div>
                  <div className="text-sm text-blue-200">Already Enrolled</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6" />
                <div>
                  <div className="font-semibold">4.9/5.0</div>
                  <div className="text-sm text-blue-200">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Course Overview</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">What You'll Learn</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <span>Master compliance frameworks and regulatory requirements</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <span>Identify and assess AI system risks and vulnerabilities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <span>Conduct thorough bias and fairness evaluations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <span>Write professional compliance reports</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <span>Earn official CEASAI certification</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="space-y-6 mt-6">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Course Curriculum</h3>
                  <div className="space-y-4">
                    {course.modules && Array.isArray(course.modules) && course.modules.map((module: any, idx: number) => (
                      <Card key={idx} className="p-6 border-l-4 border-blue-600">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-lg mb-2">Module {idx + 1}: {module.title || `Module ${idx + 1}`}</h4>
                            <p className="text-gray-600">{module.description || "Module content"}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">{module.duration || "2h"}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Learning Outcomes Tab */}
              <TabsContent value="outcomes" className="space-y-6 mt-6">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Learning Outcomes</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Regulatory Expertise</h4>
                        <p className="text-gray-600">Deep understanding of EU AI Act, NIST RMF, and ISO 42001</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Risk Assessment Skills</h4>
                        <p className="text-gray-600">Ability to identify, evaluate, and mitigate AI system risks</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Professional Certification</h4>
                        <p className="text-gray-600">Official CEASAI credential recognized by enterprises</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6 mt-6">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="pb-6 border-b last:border-b-0">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Student {i}</h4>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">2 weeks ago</span>
                        </div>
                        <p className="text-gray-700">
                          Excellent course! The instructors are knowledgeable and the content is well-structured. Highly recommend for anyone interested in AI safety.
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-24 shadow-xl">
              {/* Pricing */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {formatPrice(course.price)}
                </h3>
                <p className="text-sm text-gray-600 mb-6">One-time payment</p>

                {/* Payment Plan Selector */}
                <div className="space-y-3 mb-6">
                  <label className="text-sm font-semibold block">Choose Payment Plan</label>
                  
                  <button
                    onClick={() => setSelectedPlan("oneTime")}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan === "oneTime"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="text-xs text-gray-600 mb-1">One-Time</div>
                    <div className="font-bold text-lg">{formatPrice(course.price)}</div>
                  </button>

                  {course.price3Month && (
                    <button
                      onClick={() => setSelectedPlan("threeMonth")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPlan === "threeMonth"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">3 Months</div>
                      <div className="font-bold text-lg">
                        {calculateMonthlyPayment(course.price3Month, 3)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPrice(course.price3Month)} total
                      </div>
                    </button>
                  )}

                  {course.price6Month && (
                    <button
                      onClick={() => setSelectedPlan("sixMonth")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPlan === "sixMonth"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">6 Months</div>
                      <div className="font-bold text-lg">
                        {calculateMonthlyPayment(course.price6Month, 6)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPrice(course.price6Month)} total
                      </div>
                    </button>
                  )}

                  {course.price12Month && (
                    <button
                      onClick={() => setSelectedPlan("twelveMonth")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPlan === "twelveMonth"
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="text-xs text-gray-600 mb-1">12 Months</div>
                      <div className="font-bold text-lg">
                        {calculateMonthlyPayment(course.price12Month, 12)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPrice(course.price12Month)} total
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Enroll Button */}
              <Button
                onClick={handleEnroll}
                disabled={enrollMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold mb-4"
              >
                {enrollMutation.isPending ? "Processing..." : "Enroll Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Features */}
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
                  <span>24/7 support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
