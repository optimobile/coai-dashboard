import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportDialog } from "@/components/ExportDialog";
import { toast } from "sonner";
import {
  Users,
  Search,
  Download,
  Mail,
  UserPlus,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Filter,
  X,
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  enrolledCourses: number;
  completedCourses: number;
  progress: number;
  certificates: number;
  lastActive: string;
  enrolledAt: string;
}

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      status: "active",
      enrolledCourses: 5,
      completedCourses: 3,
      progress: 75,
      certificates: 3,
      lastActive: "2026-01-02T14:30:00",
      enrolledAt: "2025-09-15T10:00:00",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      status: "active",
      enrolledCourses: 3,
      completedCourses: 2,
      progress: 60,
      certificates: 2,
      lastActive: "2026-01-01T09:15:00",
      enrolledAt: "2025-10-20T14:30:00",
    },
    {
      id: 3,
      name: "Carol Williams",
      email: "carol.williams@example.com",
      status: "inactive",
      enrolledCourses: 4,
      completedCourses: 1,
      progress: 25,
      certificates: 1,
      lastActive: "2025-12-10T16:45:00",
      enrolledAt: "2025-08-05T11:00:00",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@example.com",
      status: "active",
      enrolledCourses: 7,
      completedCourses: 5,
      progress: 85,
      certificates: 5,
      lastActive: "2026-01-02T18:20:00",
      enrolledAt: "2025-07-12T09:30:00",
    },
    {
      id: 5,
      name: "Emma Davis",
      email: "emma.davis@example.com",
      status: "suspended",
      enrolledCourses: 2,
      completedCourses: 0,
      progress: 15,
      certificates: 0,
      lastActive: "2025-11-28T13:00:00",
      enrolledAt: "2025-11-01T15:45:00",
    },
    {
      id: 6,
      name: "Frank Miller",
      email: "frank.miller@example.com",
      status: "active",
      enrolledCourses: 6,
      completedCourses: 4,
      progress: 70,
      certificates: 4,
      lastActive: "2026-01-02T12:10:00",
      enrolledAt: "2025-06-18T08:00:00",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleSelectOne = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkEmail = () => {
    toast.success(`Sending email to ${selectedIds.size} students`);
  };

  const handleBulkAssignCohort = () => {
    toast.success(`Assigned ${selectedIds.size} students to cohort`);
  };

  const handleBulkUpdateStatus = (status: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        selectedIds.has(student.id) ? { ...student, status: status as any } : student
      )
    );
    toast.success(`Updated status for ${selectedIds.size} students`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setStudents((prev) => prev.filter((student) => !selectedIds.has(student.id)));
    toast.success(`Deleted ${selectedIds.size} students`);
    setSelectedIds(new Set());
  };

  const handleExportSelected = () => {
    setExportDialogOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      case "suspended":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4" />;
      case "inactive":
        return <Clock className="h-4 w-4" />;
      case "suspended":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allSelected = selectedIds.size === filteredStudents.length && filteredStudents.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < filteredStudents.length;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8 animate-fade-in-scale">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Students Management</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage student enrollments, progress, and bulk operations
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setExportDialogOpen(true)} variant="outline" className="gap-2">
              <Download className="h-5 w-5" />
              Export
            </Button>
            <Button className="gap-2">
              <UserPlus className="h-5 w-5" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Students</p>
                <p className="text-3xl font-display font-bold mt-1">{students.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active</p>
                <p className="text-3xl font-display font-bold mt-1">
                  {students.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Certificates Issued</p>
                <p className="text-3xl font-display font-bold mt-1">
                  {students.reduce((sum, s) => sum + s.certificates, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-elevated hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg. Progress</p>
                <p className="text-3xl font-display font-bold mt-1">
                  {Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedIds.size > 0 && (
          <Card className="p-4 border-primary/50 bg-primary/5 animate-slide-in">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox checked={true} onCheckedChange={handleClearSelection} />
                  <span className="font-semibold">
                    {selectedIds.size} student{selectedIds.size !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="gap-1 h-8"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkEmail}
                  className="gap-2 h-9"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkAssignCohort}
                  className="gap-2 h-9"
                >
                  <UserPlus className="h-4 w-4" />
                  Assign Cohort
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9">
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkUpdateStatus("active")}>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkUpdateStatus("inactive")}>
                      <Clock className="h-4 w-4 mr-2 text-gray-600" />
                      Set Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkUpdateStatus("suspended")}>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Suspend
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSelected}
                  className="gap-2 h-9"
                >
                  <Download className="h-4 w-4" />
                  Export Selected
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 h-9"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="suspended">Suspended Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="overflow-hidden card-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold">Student</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Courses</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold">Certificates</TableHead>
                <TableHead className="font-semibold">Last Active</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    selectedIds.has(student.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(student.id)}
                      onCheckedChange={() => handleSelectOne(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(student.status)}>
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(student.status)}
                        <span className="capitalize">{student.status}</span>
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-semibold">{student.completedCourses}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        / {student.enrolledCourses}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[80px]">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="font-semibold">{student.certificates}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(student.lastActive).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Email</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Export Dialog */}
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          title="Export Students Data"
          description="Configure export options for student records"
          dataType="students"
          totalRecords={selectedIds.size > 0 ? selectedIds.size : filteredStudents.length}
        />
      </div>
    </DashboardLayout>
  );
}
