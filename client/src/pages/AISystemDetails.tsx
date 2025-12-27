import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AISystemDetails() {
  const [, navigate] = useLocation();
  const [systemId, setSystemId] = useState<string | null>(null);

  // Extract system ID from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setSystemId(id);
  }, []);

  // Fetch AI system details
  const { data: system, isLoading, error } = trpc.aiSystems.getById.useQuery(
    { id: systemId || "" },
    { enabled: !!systemId }
  );

  if (!systemId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/ai-systems")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Systems
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">No system ID provided. Please select a system from the AI Systems page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-muted-foreground">Loading system details...</p>
        </div>
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/ai-systems")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Systems
          </Button>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">System Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">The AI system you're looking for doesn't exist or has been deleted.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Clock className="w-4 h-4" />;
      case "low":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/ai-systems")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AI Systems
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{system.name}</h1>
              <p className="text-muted-foreground">{system.description}</p>
            </div>
            <Badge className={`${getRiskColor(system.riskLevel)} flex items-center gap-2`}>
              {getRiskIcon(system.riskLevel)}
              {system.riskLevel || "Unknown"} Risk
            </Badge>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">System Type</p>
                <p className="font-medium text-foreground">{system.type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Organization</p>
                <p className="font-medium text-foreground">{system.organization || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="outline">{system.status || "Active"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="font-medium text-foreground">
                  {system.createdAt ? new Date(system.createdAt).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">EU AI Act</p>
                <Badge variant="outline">Pending Assessment</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">NIST AI RMF</p>
                <Badge variant="outline">Not Started</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">TC260</p>
                <Badge variant="outline">Not Started</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">ISO 42001</p>
                <Badge variant="outline">Not Started</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {system.description && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{system.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Run Compliance Assessment
          </Button>
          <Button variant="outline">
            View PDCA Cycles
          </Button>
          <Button variant="outline">
            Edit System
          </Button>
        </div>
      </div>
    </div>
  );
}
