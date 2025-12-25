/**
 * Real-time 33-Agent Council Voting Visualization
 * Animated display of Byzantine consensus in action
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Scale, FileText } from "lucide-react";

type AgentType = "guardian" | "arbiter" | "scribe";
type VoteStatus = "pending" | "approve" | "reject" | "escalate";

interface Agent {
  id: number;
  type: AgentType;
  vote: VoteStatus;
  confidence: number;
}

interface CouncilVisualizationProps {
  autoAnimate?: boolean;
  showLabels?: boolean;
}

export default function CouncilVisualization({ 
  autoAnimate = true, 
  showLabels = true 
}: CouncilVisualizationProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [voteCounts, setVoteCounts] = useState({ approve: 0, reject: 0, escalate: 0, pending: 33 });

  // Initialize 33 agents
  useEffect(() => {
    const initialAgents: Agent[] = Array.from({ length: 33 }, (_, i) => ({
      id: i + 1,
      type: i < 11 ? "guardian" : i < 22 ? "arbiter" : "scribe",
      vote: "pending",
      confidence: 0,
    }));
    setAgents(initialAgents);
  }, []);

  // Simulate real-time voting animation
  useEffect(() => {
    if (!autoAnimate || agents.length === 0) return;

    const interval = setInterval(() => {
      setAgents((prev) => {
        const pendingAgents = prev.filter((a) => a.vote === "pending");
        if (pendingAgents.length === 0) {
          // Reset after all voted
          return prev.map((a) => ({ ...a, vote: "pending", confidence: 0 }));
        }

        // Pick a random pending agent to vote
        const randomIndex = Math.floor(Math.random() * pendingAgents.length);
        const agentToVote = pendingAgents[randomIndex];
        
        // Weighted random vote (70% approve, 20% reject, 10% escalate)
        const rand = Math.random();
        const newVote: VoteStatus = rand < 0.7 ? "approve" : rand < 0.9 ? "reject" : "escalate";
        const confidence = 0.7 + Math.random() * 0.3; // 0.7-1.0

        return prev.map((a) =>
          a.id === agentToVote.id ? { ...a, vote: newVote, confidence } : a
        );
      });
    }, 800); // Vote every 800ms

    return () => clearInterval(interval);
  }, [autoAnimate, agents.length]);

  // Update vote counts
  useEffect(() => {
    const counts = agents.reduce(
      (acc, agent) => {
        acc[agent.vote]++;
        return acc;
      },
      { approve: 0, reject: 0, escalate: 0, pending: 0 }
    );
    setVoteCounts(counts);
  }, [agents]);

  // Calculate positions in a circle
  const getAgentPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 45; // percentage
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  const getAgentColor = (agent: Agent) => {
    if (agent.vote === "pending") return "hsl(var(--muted))";
    if (agent.vote === "approve") return "hsl(142, 76%, 36%)"; // green
    if (agent.vote === "reject") return "hsl(0, 84%, 60%)"; // red
    return "hsl(48, 96%, 53%)"; // yellow for escalate
  };

  const getAgentIcon = (type: AgentType) => {
    if (type === "guardian") return Shield;
    if (type === "arbiter") return Scale;
    return FileText;
  };

  const consensus = voteCounts.approve >= 22 ? "approved" : voteCounts.reject >= 22 ? "rejected" : null;

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* SVG Container for agents */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Connection lines */}
        <g opacity="0.15">
          {agents.map((agent, i) => {
            const pos1 = getAgentPosition(i, agents.length);
            return agents.slice(i + 1).map((_, j) => {
              const pos2 = getAgentPosition(i + j + 1, agents.length);
              return (
                <line
                  key={`${i}-${j}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke="currentColor"
                  strokeWidth="0.1"
                />
              );
            });
          })}
        </g>

        {/* Agent nodes */}
        {agents.map((agent, index) => {
          const { x, y } = getAgentPosition(index, agents.length);
          const Icon = getAgentIcon(agent.type);

          return (
            <g key={agent.id}>
              {/* Pulsing ring for active voting */}
              <AnimatePresence>
                {agent.vote !== "pending" && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="none"
                    stroke={getAgentColor(agent)}
                    strokeWidth="0.3"
                    initial={{ r: 1.5, opacity: 0.8 }}
                    animate={{ r: 3, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </AnimatePresence>

              {/* Agent circle */}
              <motion.circle
                cx={x}
                cy={y}
                r="1.5"
                initial={{ fill: "hsl(var(--muted))" }}
                animate={{ fill: getAgentColor(agent) }}
                transition={{ duration: 0.5 }}
                className="cursor-pointer"
              />

              {/* Agent icon (simplified as text) */}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="1"
                fill="white"
                className="pointer-events-none"
              >
                {agent.type === "guardian" ? "G" : agent.type === "arbiter" ? "A" : "S"}
              </text>
            </g>
          );
        })}

        {/* Center status */}
        <g>
          <circle cx="50" cy="50" r="8" fill="hsl(var(--background))" opacity="0.9" />
          <text
            x="50"
            y="48"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="3"
            fontWeight="bold"
            fill="hsl(var(--foreground))"
          >
            {voteCounts.approve + voteCounts.reject + voteCounts.escalate}/33
          </text>
          <text
            x="50"
            y="52"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="1.5"
            fill="hsl(var(--muted-foreground))"
          >
            {consensus || "voting"}
          </text>
        </g>
      </svg>

      {/* Vote counts overlay */}
      {showLabels && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-sm font-medium">Approve: {voteCounts.approve}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span className="text-sm font-medium">Reject: {voteCounts.reject}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium">Escalate: {voteCounts.escalate}</span>
          </div>
        </div>
      )}

      {/* Consensus notification */}
      <AnimatePresence>
        {consensus && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-sm shadow-lg"
          >
            ✓ Consensus Reached: {consensus.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
