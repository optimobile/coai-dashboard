/*
 * CSOAI Dashboard Layout - Open WebUI Inspired Design
 * Clean sidebar with navigation, user menu at bottom
 * Light theme default with CSOAI branding
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  LayoutGrid,
  FileText,
  Search,
  Settings,
  Shield,
  Users,
  Eye,
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  PenSquare,
  ExternalLink,
  Sun,
  Moon,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Globe,
  Key,
  Code,
  RefreshCw,
  CreditCard,
  Brain,
  Building2,
  Trophy,
  Lightbulb,
  BookOpen,
  FolderOpen,
  Info,
  Award,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Organized navigation with sections
const navSections = [
  {
    title: "Core",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { path: "/ai-systems", label: "AI Systems", icon: Shield },
      { path: "/compliance", label: "Compliance", icon: FileCheck },
      { path: "/agent-council", label: "33-Agent Council", icon: Users },
      { path: "/workbench", label: "Analyst Workbench", icon: Briefcase },
    ],
  },
  {
    title: "Learning",
    items: [
      { path: "/training", label: "Training Modules", icon: BookMarked },
      { path: "/training-courses", label: "Training Courses", icon: BookOpen },
      { path: "/my-training-courses", label: "My Courses", icon: GraduationCap },
      { path: "/certificates", label: "Certificates", icon: Award },
    ],
  },
  {
    title: "Tools",
    items: [
      { path: "/pdca", label: "PDCA Cycles", icon: RefreshCw },
      { path: "/reports", label: "Reports", icon: FileText },
      { path: "/api-keys", label: "API Keys", icon: Key },
    ],
  },
  {
    title: "Resources",
    items: [
      { path: "/knowledge-base", label: "Knowledge Base", icon: Brain },
      { path: "/standards", label: "Standards", icon: BookOpen },
      { path: "/api-docs", label: "API Docs", icon: Code },
    ],
  },
];

// Note: Watchdog, Training, Certification, and Regulatory are now integrated into the Members Dashboard
// Access them via /dashboard with tab navigation

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 0 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden",
          sidebarCollapsed && "border-r-0"
        )}
      >
        {/* CSOAI Logo + New Chat Button */}
        <div className="flex items-center justify-between p-2 pt-3">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <img
                src="/csoai-icon.svg.png"
                alt="CSOAI"
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-semibold">New Chat</span>
            </Button>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Open in new tab</TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation Items - Organized by Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.path;
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path}>
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Search */}
          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
        </nav>

        {/* User Menu at Bottom */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 text-sm hover:bg-accent"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white font-medium text-xs">
              AD
            </div>
            <span className="truncate">Admin User</span>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-12 items-center justify-between border-b border-border px-4">
          {/* Left: Sidebar Toggle + Title */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  sidebarCollapsed && "rotate-180"
                )}
              />
            </Button>
            <span className="text-sm font-medium">
              {navSections.flatMap(s => s.items).find((item) => item.path === location)?.label || "CSOAI"}
            </span>
          </div>

          {/* Right: Theme Toggle + Settings */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
