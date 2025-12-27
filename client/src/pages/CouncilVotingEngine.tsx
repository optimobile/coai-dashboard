/**
 * Council Voting & Decision Engine
 * 33-Agent Council voting mechanism with weighted voting and consensus algorithms
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

interface CouncilMember {
  id: number;
  name: string;
  expertise: string;
  votingWeight: number;
  votes: number;
  accuracy: number;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: "policy" | "enforcement" | "framework" | "emergency";
  status: "voting" | "passed" | "rejected" | "appealed";
  proposedBy: string;
  createdAt: string;
  votingDeadline: string;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  weightedVotes: {
    for: number;
    against: number;
    abstain: number;
  };
  consensusLevel: number; // 0-100
  requiredConsensus: number; // 66 for normal, 75 for emergency
}

const mockCouncilMembers: CouncilMember[] = [
  { id: 1, name: "Dr. Sarah Chen", expertise: "AI Ethics", votingWeight: 1.2, votes: 156, accuracy: 94 },
  { id: 2, name: "Prof. James Wilson", expertise: "Security", votingWeight: 1.1, votes: 142, accuracy: 91 },
  { id: 3, name: "Dr. Amara Okonkwo", expertise: "Fairness", votingWeight: 1.0, votes: 138, accuracy: 89 },
  { id: 4, name: "Dr. Liu Wei", expertise: "Governance", votingWeight: 1.15, votes: 145, accuracy: 92 },
  { id: 5, name: "Prof. Elena Rossi", expertise: "Compliance", votingWeight: 1.05, votes: 140, accuracy: 88 },
];

const mockProposals: Proposal[] = [
  {
    id: "1",
    title: "Strengthen Transparency Requirements for High-Risk Systems",
    description: "Proposal to mandate detailed explainability reports for all high-risk AI systems",
    category: "policy",
    status: "voting",
    proposedBy: "Dr. Sarah Chen",
    createdAt: "2025-12-20",
    votingDeadline: "2025-12-27",
    votes: { for: 28, against: 3, abstain: 2 },
    weightedVotes: { for: 34.2, against: 3.1, abstain: 2.1 },
    consensusLevel: 91,
    requiredConsensus: 66,
  },
  {
    id: "2",
    title: "Enforce Suspension of Non-Compliant System X",
    description: "Emergency enforcement action for system that violated transparency measures",
    category: "enforcement",
    status: "passed",
    proposedBy: "Prof. James Wilson",
    createdAt: "2025-12-18",
    votingDeadline: "2025-12-20",
    votes: { for: 31, against: 1, abstain: 1 },
    weightedVotes: { for: 37.8, against: 1.0, abstain: 1.05 },
    consensusLevel: 97,
    requiredConsensus: 75,
  },
  {
    id: "3",
    title: "Adopt TC260 Framework for Chinese Market",
    description: "Proposal to align compliance framework with Chinese AI governance standards",
    category: "framework",
    status: "rejected",
    proposedBy: "Dr. Liu Wei",
    createdAt: "2025-12-15",
    votingDeadline: "2025-12-22",
    votes: { for: 18, against: 12, abstain: 3 },
    weightedVotes: { for: 21.5, against: 13.2, abstain: 3.2 },
    consensusLevel: 58,
    requiredConsensus: 66,
  },
];

const votingTrendData = [
  { month: "Jan", passed: 12, rejected: 2, appealed: 1 },
  { month: "Feb", passed: 14, rejected: 1, appealed: 2 },
  { month: "Mar", passed: 16, rejected: 2, appealed: 1 },
  { month: "Apr", passed: 18, rejected: 1, appealed: 0 },
  { month: "May", passed: 20, rejected: 2, appealed: 1 },
  { month: "Jun", passed: 22, rejected: 1, appealed: 2 },
];

const memberPerformanceData = mockCouncilMembers.map((member) => ({
  name: member.name.split(" ")[1],
  accuracy: member.accuracy,
  weight: member.votingWeight * 100,
}));

export default function CouncilVotingEngine() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(mockProposals[0]);
  const [userVote, setUserVote] = useState<"for" | "against" | "abstain" | null>(null);
  const [votingComment, setVotingComment] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "voting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "appealed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "policy":
        return "bg-purple-100 text-purple-800";
      case "enforcement":
        return "bg-red-100 text-red-800";
      case "framework":
        return "bg-blue-100 text-blue-800";
      case "emergency":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">33-Agent Council</h1>
          <p className="text-muted-foreground">
            AI-powered governance with weighted voting and consensus algorithms
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Voting in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Council Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">33</div>
              <p className="text-xs text-muted-foreground mt-1">AI + Human experts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Consensus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Decisions Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Proposals List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Proposals</CardTitle>
                <CardDescription>Current voting items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    onClick={() => setSelectedProposal(proposal)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedProposal?.id === proposal.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Proposed by {proposal.proposedBy}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposal.category}
                          </Badge>
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold">{proposal.consensusLevel}%</div>
                        <p className="text-xs text-muted-foreground">Consensus</p>
                      </div>
                    </div>

                    {/* Vote Distribution */}
                    <div className="mt-3 flex gap-2 text-sm">
                      <span className="text-green-600">For: {proposal.votes.for}</span>
                      <span className="text-red-600">Against: {proposal.votes.against}</span>
                      <span className="text-gray-600">Abstain: {proposal.votes.abstain}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Voting Panel */}
          {selectedProposal && (
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Cast Your Vote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Vote</p>
                  <RadioGroup value={userVote || ""} onValueChange={(v: any) => setUserVote(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="for" id="vote-for" />
                      <Label htmlFor="vote-for" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span>For</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="against" id="vote-against" />
                      <Label htmlFor="vote-against" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                          <span>Against</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="abstain" id="vote-abstain" />
                      <Label htmlFor="vote-abstain" className="cursor-pointer flex-1">
                        <span>Abstain</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-sm font-medium">
                    Comment (Optional)
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Add reasoning for your vote..."
                    value={votingComment}
                    onChange={(e) => setVotingComment(e.target.value)}
                    className="min-h-20"
                  />
                </div>

                <Button className="w-full" disabled={!userVote}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Vote
                </Button>

                {/* Vote Summary */}
                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm font-medium">Current Results</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>For</span>
                        <span>{selectedProposal.votes.for} votes</span>
                      </div>
                      <Progress
                        value={
                          (selectedProposal.votes.for /
                            (selectedProposal.votes.for +
                              selectedProposal.votes.against +
                              selectedProposal.votes.abstain)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Against</span>
                        <span>{selectedProposal.votes.against} votes</span>
                      </div>
                      <Progress
                        value={
                          (selectedProposal.votes.against /
                            (selectedProposal.votes.for +
                              selectedProposal.votes.against +
                              selectedProposal.votes.abstain)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Voting Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Voting Trend</CardTitle>
              <CardDescription>Decisions made over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={votingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="passed" stroke="#10b981" />
                  <Line type="monotone" dataKey="rejected" stroke="#ef4444" />
                  <Line type="monotone" dataKey="appealed" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Member Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Member Performance</CardTitle>
              <CardDescription>Accuracy and voting weight</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#10b981" />
                  <Bar dataKey="weight" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Council Members */}
        <Card>
          <CardHeader>
            <CardTitle>Council Members</CardTitle>
            <CardDescription>33-member council with AI and human experts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {mockCouncilMembers.map((member) => (
                <div key={member.id} className="p-4 border rounded-lg text-center">
                  <h3 className="font-semibold text-sm">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.expertise}</p>
                  <div className="mt-3 space-y-1">
                    <div className="text-2xl font-bold text-primary">{member.accuracy}%</div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <Badge variant="secondary" className="text-xs">
                      Weight: {member.votingWeight.toFixed(2)}x
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
