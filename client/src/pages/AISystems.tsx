/*
 * COAI AI Systems Page
 * List and manage registered AI systems
 * Risk classification and compliance status
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const aiSystems = [
  {
    id: 1,
    name: "Customer Service Chatbot",
    description: "AI-powered customer support assistant",
    riskLevel: "Limited",
    complianceScore: 85,
    status: "Active",
    lastAssessment: "2 days ago",
    frameworks: ["EU AI Act", "NIST"],
  },
  {
    id: 2,
    name: "Hiring Algorithm",
    description: "Resume screening and candidate ranking",
    riskLevel: "High",
    complianceScore: 62,
    status: "Under Review",
    lastAssessment: "1 week ago",
    frameworks: ["EU AI Act", "TC260"],
  },
  {
    id: 3,
    name: "Fraud Detection System",
    description: "Real-time transaction monitoring",
    riskLevel: "High",
    complianceScore: 78,
    status: "Active",
    lastAssessment: "3 days ago",
    frameworks: ["EU AI Act", "NIST", "TC260"],
  },
  {
    id: 4,
    name: "Content Moderation AI",
    description: "Automated content filtering and flagging",
    riskLevel: "Limited",
    complianceScore: 91,
    status: "Active",
    lastAssessment: "1 day ago",
    frameworks: ["EU AI Act"],
  },
  {
    id: 5,
    name: "Predictive Maintenance",
    description: "Equipment failure prediction system",
    riskLevel: "Minimal",
    complianceScore: 95,
    status: "Active",
    lastAssessment: "5 days ago",
    frameworks: ["NIST"],
  },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Unacceptable":
      return "bg-red-500/10 text-red-500 border-red-500/30";
    case "High":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "Limited":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    case "Minimal":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/30";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "Under Review":
      return <Clock className="h-4 w-4 text-amber-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
};

export default function AISystems() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSystems = aiSystems.filter(
    (system) =>
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold font-primary">AI Systems</h1>
            <p className="text-muted-foreground text-sm">
              Manage and monitor your registered AI systems
            </p>
          </div>
          <Button
            onClick={() => toast.info("Feature coming soon", { description: "AI system registration wizard" })}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Register System
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search AI systems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Systems List */}
        <div className="space-y-3">
          {filteredSystems.map((system, idx) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
            >
              <Card className="bg-card border-border hover:bg-accent/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">{system.name}</h3>
                        {getStatusIcon(system.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {system.description}
                      </p>
                    </div>

                    {/* Risk Badge */}
                    <Badge
                      variant="outline"
                      className={`${getRiskColor(system.riskLevel)} shrink-0`}
                    >
                      {system.riskLevel} Risk
                    </Badge>

                    {/* Compliance Score */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-lg font-semibold">
                        {system.complianceScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">Compliance</p>
                    </div>

                    {/* Frameworks */}
                    <div className="hidden md:flex items-center gap-1 shrink-0">
                      {system.frameworks.slice(0, 2).map((fw) => (
                        <Badge
                          key={fw}
                          variant="secondary"
                          className="text-xs"
                        >
                          {fw}
                        </Badge>
                      ))}
                      {system.frameworks.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{system.frameworks.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Run Assessment</DropdownMenuItem>
                        <DropdownMenuItem>Edit System</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredSystems.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium">No AI systems found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or register a new system
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
