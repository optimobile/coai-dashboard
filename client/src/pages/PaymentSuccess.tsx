/**
 * PaymentSuccess Page
 * Displayed after successful course enrollment payment
 */

import { useEffect, useState } from "react";
import { useLocation, useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Download } from "lucide-react";

export default function PaymentSuccess() {
  const [location] = useLocation();
  const router = useRouter();
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get enrollment ID from URL params
    const params = new URLSearchParams(location.split("?")[1]);
    const id = params.get("enrollment_id");
    setEnrollmentId(id);
    setIsLoading(false);
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your course enrollment has been confirmed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Confirmation Details */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Enrollment ID</span>
              <span className="font-mono font-medium">{enrollmentId || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-green-600 dark:text-green-400">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Access</span>
              <span className="font-medium">Immediate</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Access your course materials immediately</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Check your email for course details</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Track your progress on the dashboard</span>
              </li>
            </ul>
          </div>

          {/* Confirmation Email */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={() => router.push("/my-courses")}
              className="w-full"
              size="lg"
            >
              Go to My Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push("/training")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Browse More Courses
            </Button>
          </div>

          {/* Download Receipt */}
          <div className="text-center">
            <button className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <Download className="h-3 w-3" />
              Download Receipt
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Support Info */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted-foreground">
        <p>
          Need help?{" "}
          <a href="/support" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
