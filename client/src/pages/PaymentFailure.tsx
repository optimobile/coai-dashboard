/**
 * PaymentFailure Page
 * Displayed after failed course enrollment payment
 */

import { useEffect, useState } from "react";
import { useLocation, useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function PaymentFailure() {
  const [location] = useLocation();
  const router = useRouter();
  const [reason, setReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get failure reason from URL params
    const params = new URLSearchParams(location.split("?")[1]);
    const failureReason = params.get("reason") || "payment_declined";
    setReason(failureReason);
    setIsLoading(false);
  }, [location]);

  const getErrorMessage = (reason: string | null) => {
    switch (reason) {
      case "card_declined":
        return "Your card was declined. Please check your card details and try again.";
      case "insufficient_funds":
        return "Your card has insufficient funds. Please try another payment method.";
      case "expired_card":
        return "Your card has expired. Please update your card information.";
      case "incorrect_cvc":
        return "The CVC code you entered is incorrect. Please try again.";
      case "network_error":
        return "A network error occurred. Please check your connection and try again.";
      case "cancelled":
        return "You cancelled the payment. Your course enrollment was not completed.";
      default:
        return "Your payment could not be processed. Please try again or contact support.";
    }
  };

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
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-900 dark:text-red-100">
              {getErrorMessage(reason)}
            </p>
          </div>

          {/* Troubleshooting Tips */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Try These Steps:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">1.</span>
                <span>Check your card details are correct</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">2.</span>
                <span>Ensure your card has sufficient funds</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">3.</span>
                <span>Try a different payment method</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">4.</span>
                <span>Contact your bank if the issue persists</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={() => router.push("/training")}
              className="w-full"
              size="lg"
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Support Info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Still having issues?</p>
                <p>
                  Contact our support team at{" "}
                  <a href="mailto:support@csoai.org" className="underline font-medium">
                    support@csoai.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Link */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted-foreground">
        <p>
          <a href="/faq#payment" className="text-primary hover:underline">
            Payment FAQ
          </a>
          {" "} •{" "}
          <a href="/support" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
