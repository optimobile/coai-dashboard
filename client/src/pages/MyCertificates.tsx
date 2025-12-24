/**
 * My Certificates Page
 * Displays all certificates earned by the user
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import Certificate from "@/components/Certificate";
import { cn } from "@/lib/utils";

export default function MyCertificates() {
  const [, navigate] = useLocation();
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  const { data: certificates, isLoading } = trpc.certification.getMyCertificates.useQuery();
  // User name would come from auth context in production
  const userName = "Certified Analyst";

  const isExpired = (expiryDate: string | Date) => {
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate: string | Date) => {
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry < thirtyDaysFromNow && expiry > new Date();
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/training")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">My Certificates</h1>
            <p className="text-muted-foreground text-sm">
              View and manage your earned certifications
            </p>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates && certificates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {certificates.map((cert, idx) => {
              const expired = isExpired(cert.expiresAt!);
              const expiringSoon = isExpiringSoon(cert.expiresAt!);

              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    expired && "opacity-60 border-red-200 dark:border-red-800",
                    expiringSoon && "border-amber-200 dark:border-amber-800"
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            expired 
                              ? "bg-red-100 dark:bg-red-900" 
                              : "bg-amber-100 dark:bg-amber-900"
                          )}>
                            <Award className={cn(
                              "h-6 w-6",
                              expired 
                                ? "text-red-600 dark:text-red-400" 
                                : "text-amber-600 dark:text-amber-400"
                            )} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              Watchdog Analyst
                            </CardTitle>
                            <CardDescription className="font-mono text-xs">
                              {cert.certificateNumber}
                            </CardDescription>
                          </div>
                        </div>
                        {expired ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : expiringSoon ? (
                          <Badge variant="outline" className="border-amber-500 text-amber-600">
                            Expiring Soon
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Issued: {formatDate(cert.issuedAt!)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Expires: {formatDate(cert.expiresAt!)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedCertificate(cert)}
                          >
                            View Certificate
                          </Button>
                          {expired && (
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => navigate("/certification/exam")}
                            >
                              Renew
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete the training modules and pass the certification exam to earn your first certificate.
              </p>
              <Button onClick={() => navigate("/training")}>
                Start Training
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Certificate Dialog */}
        <Dialog open={!!selectedCertificate} onOpenChange={() => setSelectedCertificate(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Certificate Details</DialogTitle>
            </DialogHeader>
            {selectedCertificate && (
              <Certificate
                certificateNumber={selectedCertificate.certificateNumber}
                userName={userName}
                testName="Watchdog Analyst Certification Exam"
                score={85} // Would come from the attempt
                issuedDate={new Date(selectedCertificate.issuedAt)}
                expiryDate={new Date(selectedCertificate.expiresAt)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
