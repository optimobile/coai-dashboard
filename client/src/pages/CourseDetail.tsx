/**
 * Course Detail Page
 * Display individual course information and enrollment options
 */

import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Award, Users, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<"one_time" | "3_month" | "6_month" | "12_month">("one_time");

  // Fetch course details
  const { data: course, isLoading, error } = trpc.courses.getCourseDetails.useQuery(
    { courseId: parseInt(id || "0") },
    { enabled: !!id }
  );

  // Enroll mutation
  const enrollMutation = trpc.courses.enrollInCourse.useMutation({
    onSuccess: (result) => {
      if (result.isFree) {
        toast.success("Successfully enrolled in course!");
        setLocation(`/courses/${id}/learn`);
      } else {
        // For paid courses, redirect to Stripe checkout
        toast.success("Redirecting to payment...");
        // The mutation should handle the redirect
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enroll in course");
    },
  });

  const handleEnroll = async () => {
    if (!course) return;
    setIsEnrolling(true);
    try {
      await enrollMutation.mutateAsync({ 
        courseId: course.id,
        paymentType: course.isFree ? undefined : selectedPaymentType
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/courses")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h1>
            <p className="text-gray-600 mb-6">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation("/courses")}>
              Browse All Courses
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/courses")}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1">
              <Badge className="mb-3 bg-white/20 text-white border-white/30">
                <Award className="w-4 h-4 mr-2" />
                {course.level}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-white/90 text-lg mb-4">{course.description}</p>
              <div className="flex gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.durationHours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrollmentCount || 0} enrolled</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              {!course.isFree && (
                <div className="text-4xl font-bold mb-2">£{course.pricing.oneTime}</div>
              )}
              {course.isFree && (
                <div className="text-2xl font-bold mb-2 text-white/90">FREE</div>
              )}
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90"
                onClick={handleEnroll}
                disabled={isEnrolling || enrollMutation.isPending}
              >
                {isEnrolling || enrollMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  "Enroll Now"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-700 mb-4">{course.description}</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Course Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Framework</p>
                  <p className="font-semibold capitalize">{course.framework}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Level</p>
                  <p className="font-semibold capitalize">{course.level}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Course Details & Pricing</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="font-semibold text-lg">{course.durationHours} hours</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Type</p>
                  <p className="font-semibold text-lg">
                    {course.isFree ? "Free" : "Paid"}
                  </p>
                </div>
              </div>

              {!course.isFree && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Payment Plans</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="one_time"
                        checked={selectedPaymentType === "one_time"}
                        onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold">One-Time Payment</p>
                        <p className="text-gray-600 text-sm">£{course.pricing.oneTime}</p>
                      </div>
                    </label>
                    
                    {course.pricing.threeMonth && (
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="3_month"
                          checked={selectedPaymentType === "3_month"}
                          onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">3-Month Plan</p>
                          <p className="text-gray-600 text-sm">£{course.pricing.threeMonth}/month</p>
                        </div>
                      </label>
                    )}
                    
                    {course.pricing.sixMonth && (
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="6_month"
                          checked={selectedPaymentType === "6_month"}
                          onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">6-Month Plan</p>
                          <p className="text-gray-600 text-sm">£{course.pricing.sixMonth}/month</p>
                        </div>
                      </label>
                    )}
                    
                    {course.pricing.twelveMonth && (
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="12_month"
                          checked={selectedPaymentType === "12_month"}
                          onChange={(e) => setSelectedPaymentType(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold">12-Month Plan</p>
                          <p className="text-gray-600 text-sm">£{course.pricing.twelveMonth}/month</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
