/**
 * My Courses Page
 * Track enrolled courses, progress, and download certificates
 */

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Award, Download, Calendar, Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { TrainingSkeleton } from "@/components/skeletons/TrainingSkeleton";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

export default function MyCourses() {
  const { data: rawEnrollments = [], isLoading } = trpc.courses.getMyEnrollments.useQuery();
  
  // Filter out enrollments with missing courses and deduplicate by courseId
  // Keep only the most recent enrollment per course
  const enrollments = useMemo(() => {
    // First filter out null courses
    const validEnrollments = rawEnrollments.filter((e: any) => e.course && e.course.title);
    
    // Deduplicate by courseId - keep the most recent enrollment
    const courseMap = new Map<number, any>();
    validEnrollments.forEach((enrollment: any) => {
      const courseId = enrollment.courseId;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, enrollment);
      } else {
        // Keep the more recent enrollment
        const existing = courseMap.get(courseId);
        if (new Date(enrollment.enrolledAt) > new Date(existing.enrolledAt)) {
          courseMap.set(courseId, enrollment);
        }
      }
    });
    
    return Array.from(courseMap.values());
  }, [rawEnrollments]);
  const cancelMutation = trpc.courses.cancelEnrollment.useMutation({
    onSuccess: () => {
      toast.success("Enrollment cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel enrollment");
    },
  });

  const handleCancelEnrollment = async (enrollmentId: number) => {
    if (!confirm("Are you sure you want to cancel this enrollment? This action cannot be undone.")) {
      return;
    }
    await cancelMutation.mutateAsync({ enrollmentId });
  };

  const formatPrice = (cents: number | null | undefined) => {
    if (!cents) return "N/A";
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "past_due":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <TrainingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Track your enrolled courses and download certificates
            </p>
          </div>
          <Button onClick={() => window.location.href = "/courses"}>
            Browse More Courses
          </Button>
        </div>

        {/* Enrollments */}
        {enrollments.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <Button onClick={() => window.location.href = "/courses"}>
              Browse Courses
            </Button>
          </Card>
        ) : (
          <div className="grid gap-8">
            {enrollments.map((enrollment: any) => (
              <Card key={enrollment.id} className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {enrollment.course.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Enrolled {formatDistanceToNow(new Date(enrollment.enrolledAt), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{enrollment.course.durationHours}h total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{enrollment.course.modules?.length || 0} modules</span>
                      </div>
                    </div>

                    {/* Progress Bar with Time */}
                    <div className="mb-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Progress</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                          {enrollment.progress || 0}%
                        </span>
                      </div>
                      <Progress value={enrollment.progress || 0} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {Math.floor((enrollment.timeSpentMinutes || 0) / 60)}h {(enrollment.timeSpentMinutes || 0) % 60}m spent
                          </span>
                        </div>
                        {enrollment.progress < 100 && (
                          <span>
                            {100 - (enrollment.progress || 0)}% remaining
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-muted rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Payment Type:</span>
                          <span className="ml-2 font-medium">
                            {enrollment.paymentType === "one_time" ? "One-Time" : 
                             enrollment.paymentType === "3_month" ? "3-Month Plan" :
                             enrollment.paymentType === "6_month" ? "6-Month Plan" :
                             enrollment.paymentType === "12_month" ? "12-Month Plan" : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount Paid:</span>
                          <span className="ml-2 font-medium">
                            {formatPrice(enrollment.paidAmount)}
                          </span>
                        </div>
                        {enrollment.subscriptionStatus !== "none" && (
                          <>
                            <div>
                              <span className="text-muted-foreground">Subscription:</span>
                              <Badge className={`ml-2 ${getSubscriptionStatusColor(enrollment.subscriptionStatus)}`}>
                                {enrollment.subscriptionStatus.toUpperCase()}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button className="w-full" onClick={() => window.location.href = `/courses/${enrollment.courseId}/learn`}>
                      Continue Learning
                    </Button>
                    
                    {enrollment.status === "completed" && (
                      <Button variant="outline" className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Download Certificate
                      </Button>
                    )}

                    {enrollment.subscriptionStatus === "active" && (
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => handleCancelEnrollment(enrollment.id)}
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {enrollments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {enrollments.filter((e: any) => e.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {enrollments.filter((e: any) => e.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Certificates Earned</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
