import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Download, Filter, Search } from "lucide-react";

interface ComplianceRecord {
  id: string;
  date: string;
  framework: string;
  aiSystem: string;
  score: number;
  status: "compliant" | "partial" | "non-compliant";
  assessor: string;
  notes: string;
}

const mockData: ComplianceRecord[] = [
  {
    id: "1",
    date: "2025-12-20",
    framework: "EU AI Act",
    aiSystem: "Vision System v2.1",
    score: 92,
    status: "compliant",
    assessor: "Sarah Chen",
    notes: "Full compliance achieved with minor documentation updates",
  },
  {
    id: "2",
    date: "2025-12-15",
    framework: "NIST RMF",
    aiSystem: "NLP Pipeline v1.5",
    score: 78,
    status: "partial",
    assessor: "James Wilson",
    notes: "Partial compliance - Risk management framework needs enhancement",
  },
  {
    id: "3",
    date: "2025-12-10",
    framework: "TC260",
    aiSystem: "Recommendation Engine v3.0",
    score: 85,
    status: "compliant",
    assessor: "Li Wei",
    notes: "Compliant with TC260 requirements",
  },
  {
    id: "4",
    date: "2025-12-05",
    framework: "ISO 42001",
    aiSystem: "Data Processing v2.0",
    score: 65,
    status: "non-compliant",
    assessor: "Maria Garcia",
    notes: "Non-compliant - Requires significant updates to governance structure",
  },
  {
    id: "5",
    date: "2025-11-28",
    framework: "EU AI Act",
    aiSystem: "Vision System v2.0",
    score: 88,
    status: "compliant",
    assessor: "Sarah Chen",
    notes: "Compliant with action items for next quarter",
  },
];

export default function ComplianceHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredData = mockData.filter((record) => {
    const matchesSearch =
      record.aiSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.assessor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework =
      selectedFramework === "all" || record.framework === selectedFramework;
    const matchesStatus =
      selectedStatus === "all" || record.status === selectedStatus;
    return matchesSearch && matchesFramework && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "non-compliant":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Compliance History
          </h1>
          <p className="text-slate-600">
            Track all compliance assessments and historical records across your AI systems
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by system or assessor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-slate-200"
                />
              </div>

              {/* Framework Filter */}
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="EU AI Act">EU AI Act</SelectItem>
                  <SelectItem value="NIST RMF">NIST RMF</SelectItem>
                  <SelectItem value="TC260">TC260</SelectItem>
                  <SelectItem value="ISO 42001">ISO 42001</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white border-slate-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle>Assessment Records</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-300"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      AI System
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Framework
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Assessor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {record.aiSystem}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {record.framework}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                style={{ width: `${record.score}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-900">
                              {record.score}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusLabel(record.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {record.assessor}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center">
                        <p className="text-slate-500">
                          No records found matching your filters
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">
                {mockData.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {mockData.filter((r) => r.status === "compliant").length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Partial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {mockData.filter((r) => r.status === "partial").length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Non-Compliant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {mockData.filter((r) => r.status === "non-compliant").length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
