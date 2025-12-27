/**
 * Watchdog Report Submission Form
 * Structured form for reporting AI safety incidents
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Upload, ArrowRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

// Form validation schema
const reportSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(255),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  aiSystemName: z.string().optional(),
  companyName: z.string().optional(),
  incidentType: z.enum(["bias", "privacy", "safety", "misinformation", "manipulation", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email().optional(),
  agreeToPublish: z.boolean().default(true),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function WatchdogSubmit() {
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const submitMutation = trpc.watchdog.submit.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      severity: "medium",
      incidentType: "safety",
      agreeToPublish: true,
    },
  });

  const severity = watch("severity");
  const incidentType = watch("incidentType");

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      const result = await submitMutation.mutateAsync({
        ...data,
        reporterEmail: data.reporterEmail || undefined,
        reporterName: data.reporterName || undefined,
      });

      setReportId(result.reportId);
      setSubmitted(true);
      toast.success("Report submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map((f) => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
      toast.success(`${files.length} file(s) uploaded`);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-12 text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-2">Your AI safety report has been submitted successfully.</p>
          <p className="text-gray-600 mb-8">
            Report ID: <span className="font-mono font-bold text-blue-600">#{reportId}</span>
          </p>

          <div className="bg-blue-50 p-8 rounded-lg mb-8 text-left">
            <h3 className="font-bold text-lg mb-4">What happens next?</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                <span className="text-gray-700">Our team reviews your report for completeness and accuracy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                <span className="text-gray-700">The report is verified and published to our public database</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                <span className="text-gray-700">Community members and analysts review and provide insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                <span className="text-gray-700">You receive updates as the report gains traction</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/watchdog">
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Public Reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/watchdog/submit">
              <Button variant="outline">Submit Another Report</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 py-12 px-6">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-base px-4 py-1 mx-auto">
            <AlertTriangle className="w-4 h-4 mr-2 inline" />
            Report AI Safety Issues
          </Badge>
          <h1 className="text-5xl font-bold text-white mb-4">Submit a Report</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Help us identify and address AI safety risks. Your report will be reviewed by our community of experts.
          </p>
        </div>

        {/* Form */}
        <Card className="p-12 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Report Details
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Report Title <span className="text-red-600">*</span>
                </label>
                <Input
                  {...register("title")}
                  placeholder="e.g., ChatGPT providing dangerous medical advice"
                  className="h-12 text-base"
                />
                {errors.title && <p className="text-red-600 text-sm mt-2">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Detailed Description <span className="text-red-600">*</span>
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Describe what happened, when it happened, and why you believe it's a safety concern..."
                  className="min-h-32 text-base"
                />
                {errors.description && <p className="text-red-600 text-sm mt-2">{errors.description.message}</p>}
              </div>
            </div>

            {/* Section 2: Incident Classification */}
            <div className="space-y-6 pt-8 border-t">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Classify the Issue
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Incident Type <span className="text-red-600">*</span>
                  </label>
                  <Select
                    value={incidentType}
                    onValueChange={(value: any) => setValue("incidentType", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bias">Bias & Discrimination</SelectItem>
                      <SelectItem value="privacy">Privacy Violation</SelectItem>
                      <SelectItem value="safety">Safety Risk</SelectItem>
                      <SelectItem value="misinformation">Misinformation</SelectItem>
                      <SelectItem value="manipulation">Manipulation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.incidentType && (
                    <p className="text-red-600 text-sm mt-2">{errors.incidentType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Severity Level <span className="text-red-600">*</span>
                  </label>
                  <Select value={severity} onValueChange={(value: any) => setValue("severity", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor issue</SelectItem>
                      <SelectItem value="medium">Medium - Moderate concern</SelectItem>
                      <SelectItem value="high">High - Serious risk</SelectItem>
                      <SelectItem value="critical">Critical - Immediate danger</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.severity && <p className="text-red-600 text-sm mt-2">{errors.severity.message}</p>}
                </div>
              </div>

              {/* Severity Badge */}
              <div className={`p-4 rounded-lg border-2 ${getSeverityColor(severity)}`}>
                <p className="font-semibold">Severity: {severity.toUpperCase()}</p>
              </div>
            </div>

            {/* Section 3: AI System Information */}
            <div className="space-y-6 pt-8 border-t">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  3
                </span>
                AI System Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">AI System Name (optional)</label>
                  <Input
                    {...register("aiSystemName")}
                    placeholder="e.g., ChatGPT-4, Claude, Gemini"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Company/Organization (optional)</label>
                  <Input
                    {...register("companyName")}
                    placeholder="e.g., OpenAI, Anthropic, Google"
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Evidence & Files */}
            <div className="space-y-6 pt-8 border-t">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Evidence & Documentation
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-3">Upload Evidence (optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
                  <p className="text-sm text-gray-500 mb-4">Supported: Screenshots, logs, videos, documents (Max 50MB)</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold">Uploaded files:</p>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Reporter Information */}
            <div className="space-y-6 pt-8 border-t">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  5
                </span>
                Your Information (optional)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">Name</label>
                  <Input {...register("reporterName")} placeholder="Your name" className="h-12" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Email</label>
                  <Input
                    {...register("reporterEmail")}
                    type="email"
                    placeholder="your@email.com"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("agreeToPublish")}
                    className="w-5 h-5 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to have this report published publicly so the community can learn from it and help address the issue.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-semibold"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Report"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-600 text-center mt-4">
                Thank you for helping make AI safer for everyone.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
