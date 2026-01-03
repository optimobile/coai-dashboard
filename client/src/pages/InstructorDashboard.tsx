import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Search,
  MessageSquare,
  Plus,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function InstructorDashboard() {
  const { data: cohorts, isLoading, refetch } = trpc.instructorDashboard.getCohorts.useQuery();
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [message, setMessage] = useState("");

  const { data: students } = trpc.instructorDashboard.getCohortStudents.useQuery(
    { cohortId: selectedCohortId! },
    { enabled: selectedCohortId !== null }
  );

  const { data: metrics } = trpc.instructorDashboard.getCohortMetrics.useQuery(
    { cohortId: selectedCohortId! },
    { enabled: selectedCohortId !== null }
  );

  const sendMessageMutation = trpc.instructorDashboard.sendInterventionMessage.useMutation();

  const handleSendMessage = async () => {
    if (!selectedStudent || !selectedCohortId) return;

    try {
      await sendMessageMutation.mutateAsync({
        studentId: selectedStudent.id,
        message,
        cohortId: selectedCohortId,
      });
      toast.success("Message sent successfully");
      setShowMessageDialog(false);
      setMessage("");
      setSelectedStudent(null);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  const getRiskBadge = (riskLevel: string | null) => {
    if (!riskLevel) return null;
    
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={colors[riskLevel] || "bg-gray-100 text-gray-800"}>
        {riskLevel.toUpperCase()}
      </Badge>
    );
  };

  const filteredStudents = students?.filter((student) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const atRiskStudents = filteredStudents?.filter((s) => 
    s.riskLevel === "high" || s.riskLevel === "critical"
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-32 bg-muted rounded animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your cohorts, review student predictions, and take action on at-risk students
        </p>
      </div>

      {/* Cohort Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Cohorts</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cohorts?.map((cohort) => (
            <Card
              key={cohort.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedCohortId === cohort.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedCohortId(cohort.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{cohort.cohortName}</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              {cohort.description && (
                <p className="text-sm text-muted-foreground mb-3">{cohort.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{cohort.studentCount} students</span>
              </div>
            </Card>
          ))}
          <Card className="p-4 border-dashed border-2 flex items-center justify-center cursor-pointer hover:bg-muted/50">
            <div className="text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Create New Cohort</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Cohort Details */}
      {selectedCohortId && metrics && (
        <>
          {/* Metrics */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{metrics.totalStudents}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">At-Risk Students</p>
                  <p className="text-2xl font-bold">{metrics.atRiskStudents}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">{metrics.averageProgress}%</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Score</p>
                  <p className="text-2xl font-bold">{metrics.averagePredictionScore}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Student List */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Students</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>

            {/* At-Risk Students Section */}
            {atRiskStudents && atRiskStudents.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900 dark:text-red-100">
                    At-Risk Students ({atRiskStudents.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {atRiskStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded border"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getRiskBadge(student.riskLevel)}
                        <div className="text-right">
                          <p className="text-sm font-medium">{student.progressPercentage}% complete</p>
                          <p className="text-xs text-muted-foreground">
                            {student.predictionScore}% success rate
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowMessageDialog(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="text-left py-3 px-4">Progress</th>
                    <th className="text-left py-3 px-4">Success Prediction</th>
                    <th className="text-left py-3 px-4">Risk Level</th>
                    <th className="text-left py-3 px-4">Last Active</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents?.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{student.progressPercentage}%</p>
                          <p className="text-xs text-muted-foreground">
                            {student.completedModules}/{student.totalModules} modules
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium">
                          {student.predictionScore ? `${student.predictionScore}%` : "N/A"}
                        </p>
                      </td>
                      <td className="py-3 px-4">{getRiskBadge(student.riskLevel)}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">
                          {student.lastActive
                            ? new Date(student.lastActive).toLocaleDateString()
                            : "Never"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowMessageDialog(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Send an intervention message or feedback to this student
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
