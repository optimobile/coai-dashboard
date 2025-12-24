/*
 * COAI 33-Agent Council Page
 * Visualize the Byzantine fault-tolerant voting system
 */

import { motion } from "framer-motion";
import { Users, Shield, Scale, FileText, CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";

const agentGroups = [
  {
    name: "Guardian Agents",
    description: "Safety, Security, Privacy",
    icon: Shield,
    count: 11,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Arbiter Agents",
    description: "Fairness, Transparency, Accountability",
    icon: Scale,
    count: 11,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Scribe Agents",
    description: "Documentation, Compliance, Reporting",
    icon: FileText,
    count: 11,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

const recentVotes = [
  {
    id: 1,
    subject: "Gender bias in job recommendations",
    system: "Hiring Algorithm",
    result: "Escalated",
    votes: { approve: 11, reject: 7, escalate: 15 },
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    subject: "Privacy compliance for user data processing",
    system: "Customer Service Bot",
    result: "Approved",
    votes: { approve: 28, reject: 3, escalate: 2 },
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    subject: "Transparency requirements for content moderation",
    system: "Content Moderation AI",
    result: "Approved",
    votes: { approve: 25, reject: 5, escalate: 3 },
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    subject: "Risk classification for financial predictions",
    system: "Fraud Detection System",
    result: "Rejected",
    votes: { approve: 8, reject: 23, escalate: 2 },
    timestamp: "8 hours ago",
  },
];

const getResultBadge = (result: string) => {
  switch (result) {
    case "Approved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "Rejected":
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/30">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case "Escalated":
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Escalated
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/30">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export default function AgentCouncil() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold font-primary">33-Agent Council</h1>
          <p className="text-muted-foreground text-sm">
            Byzantine fault-tolerant voting system (22/33 consensus required)
          </p>
        </div>

        {/* Agent Groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agentGroups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${group.bgColor}`}>
                        <Icon className={`h-5 w-5 ${group.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      </div>
                      <div className="text-2xl font-semibold">{group.count}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Votes */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recent Council Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVotes.map((vote, idx) => (
                <motion.div
                  key={vote.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                  className="p-4 rounded-lg bg-secondary/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{vote.subject}</h4>
                      <p className="text-sm text-muted-foreground">{vote.system}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getResultBadge(vote.result)}
                      <span className="text-xs text-muted-foreground">{vote.timestamp}</span>
                    </div>
                  </div>
                  
                  {/* Vote Distribution */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-muted-foreground">Approve</span>
                      <Progress value={(vote.votes.approve / 33) * 100} className="h-2 flex-1" />
                      <span className="w-8 text-right">{vote.votes.approve}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-muted-foreground">Reject</span>
                      <Progress value={(vote.votes.reject / 33) * 100} className="h-2 flex-1" />
                      <span className="w-8 text-right">{vote.votes.reject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-muted-foreground">Escalate</span>
                      <Progress value={(vote.votes.escalate / 33) * 100} className="h-2 flex-1" />
                      <span className="w-8 text-right">{vote.votes.escalate}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
