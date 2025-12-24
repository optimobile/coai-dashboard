/*
 * COAI Home Page - Open WebUI Inspired Design
 * Welcome screen with suggestion cards for AI Safety tasks
 * "Hello, [Name] - How can I help you today?"
 * Light theme default with COAI branding
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Plus, 
  Mic, 
  ArrowUp,
  FileCheck,
  AlertTriangle,
  Users,
  Eye,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";

const suggestionPrompts = [
  {
    title: "Run compliance check",
    subtitle: "for EU AI Act requirements",
    icon: FileCheck,
    action: "/compliance"
  },
  {
    title: "Assess AI system risk",
    subtitle: "using multi-framework analysis",
    icon: AlertTriangle,
    action: "/ai-systems"
  },
  {
    title: "View agent council",
    subtitle: "33-agent voting status",
    icon: Users,
    action: "/agent-council"
  },
  {
    title: "Check Watchdog reports",
    subtitle: "public incident submissions",
    icon: Eye,
    action: "/watchdog"
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [inputValue, setInputValue] = useState("");
  const userName = user?.name || "Admin";

  const handleSuggestionClick = (action: string) => {
    setLocation(action);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      toast.info("AI chat feature coming soon", {
        description: "Natural language compliance queries will be available in the next update."
      });
      setInputValue("");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Main Content - Centered like Open WebUI */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20">
          <div className="w-full max-w-3xl">
            {/* COAI Logo/Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex justify-start mb-2"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-sm">
                COAI
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mb-4"
            >
              <h1 className="text-3xl font-primary font-semibold text-foreground">
                Hello, {userName}
              </h1>
              <p className="text-xl text-muted-foreground">
                How can I help you today?
              </p>
            </motion.div>

            {/* Suggested Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2"
            >
              <Zap className="h-3 w-3" />
              <span>Suggested</span>
            </motion.div>

            {/* Suggestion Cards - Open WebUI Grid Style */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {suggestionPrompts.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <motion.button
                    key={prompt.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 + idx * 0.06 }}
                    onClick={() => handleSuggestionClick(prompt.action)}
                    className="suggestion-card text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground group-hover:text-foreground transition line-clamp-1">
                        {prompt.title}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {prompt.subtitle}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Input Bar - Open WebUI Style */}
        <div className="p-4 pb-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Send a Message"
                  className="pl-12 pr-20 py-6 rounded-2xl bg-secondary border-0 text-base placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                />
                
                <div className="absolute right-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim()}
                    className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
            
            {/* Disclaimer */}
            <p className="text-center text-xs text-muted-foreground mt-2">
              COAI can make mistakes. Verify compliance information.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
