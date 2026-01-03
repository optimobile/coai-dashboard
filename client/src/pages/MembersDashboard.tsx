/**
 * Members Dashboard - Unified authenticated dashboard
 * Consolidates Watchdog, Training, Certification, and Regulatory features
 * All features accessible from one place with tab-based navigation
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Eye,
  GraduationCap,
  Award,
  Building2,
  LayoutGrid,
  FileText,
  AlertTriangle,
  History,
  Trophy,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Custom tabs implementation - Radix UI Tabs has issues with state updates
// Using plain React state and conditional rendering instead
import DashboardLayout from '@/components/DashboardLayout';
import WatchdogIncidentsPanel from '@/components/WatchdogIncidentsPanel';
import { OnboardingTour } from '@/components/OnboardingTour';

// Import feature components
import Dashboard from './Dashboard';
import Watchdog from './Watchdog';
import WatchdogLeaderboard from './WatchdogLeaderboard';
import Training from './Training-v2';
import Certification from './Certification-v2';
import CertificationExam from './CertificationExam';
import RegulatoryAuthority from './RegulatoryAuthority';
import Reports from './Reports';
import AISystems from './AISystems';
import Compliance from './Compliance';

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutGrid,
    description: 'Dashboard overview and quick actions',
  },
  {
    id: 'watchdog',
    label: 'Watchdog',
    icon: Eye,
    description: 'AI incident reporting and analysis',
  },
  {
    id: 'training',
    label: 'Training',
    icon: GraduationCap,
    description: 'AI safety training courses',
  },
  {
    id: 'certification',
    label: 'Certification',
    icon: Award,
    description: 'AI safety certification exams',
  },
  {
    id: 'regulatory',
    label: 'Regulatory',
    icon: Building2,
    description: 'Government and regulatory compliance',
  },
];

export default function MembersDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [watchdogSubTab, setWatchdogSubTab] = useState('incidents');
  const [, setLocation] = useLocation();

  // Onboarding tour steps
  const tourSteps = [
    {
      element: '.px-6',
      popover: {
        title: 'Welcome to CSOAI Dashboard!',
        description: 'This is your central hub for AI safety governance. Let\'s take a quick tour of the key features.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[role="tablist"]',
      popover: {
        title: 'Navigation Tabs',
        description: 'Switch between Overview, Watchdog reports, Training courses, Certifications, and Regulatory tools. Each section provides specialized AI safety features.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[href="/ai-systems"]',
      popover: {
        title: 'Register AI Systems',
        description: 'Start by registering your AI systems. Click here to add new systems, specify their type (ML, NLP, Computer Vision, etc.), and assign risk levels according to regulatory frameworks.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/compliance"]',
      popover: {
        title: 'Run Compliance Assessments',
        description: 'Evaluate your AI systems against multiple frameworks (EU AI Act, NIST RMF, TC260). Run assessments to identify gaps and track your compliance progress over time.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/watchdog"]',
      popover: {
        title: 'Submit Watchdog Reports',
        description: 'Report AI safety incidents to the public Watchdog database. Your submissions help build transparency and improve AI safety across the industry. Reports are reviewed by the 33-Agent Council.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/pdca-cycles"]',
      popover: {
        title: 'PDCA Cycle Management',
        description: 'Implement continuous improvement with Plan-Do-Check-Act cycles. Track your AI governance workflows from planning through execution and review.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/agent-council"]',
      popover: {
        title: '33-Agent Council',
        description: 'View real-time voting sessions where 33 AI agents evaluate Watchdog reports and provide safety recommendations. This democratic system ensures balanced AI governance.',
        side: 'right' as const,
      },
    },
  ];

  const handleViewIncident = (id: number) => {
    // Navigate to incident detail page
    setLocation(`/watchdog-hub?incident=${id}`);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold tracking-tight">Members Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your AI safety training, certification, watchdog reports, and regulatory compliance
            </p>
          </div>
        </div>

        {/* Tabs Navigation and Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border bg-background/50 flex-shrink-0">
            <div className="px-6">
              <div className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid gap-2 bg-transparent border-b border-border rounded-none p-0 h-auto" role="tablist">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      role="tab"
                      aria-selected={isActive}
                      className={`flex items-center gap-2 rounded-none border-b-2 transition-all px-4 py-3 text-sm font-medium ${
                        isActive
                          ? 'border-primary bg-transparent text-foreground'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overflow-y-auto flex-1">
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              </div>
            </div>
          )}

          {/* Watchdog Tab - Enhanced with sub-tabs */}
          {activeTab === 'watchdog' && (
            <div className="overflow-y-auto flex-1">
              <div className="p-8 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Watchdog Header with Quick Actions */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-emerald-600" />
                        The Watchdog - AI Incident Reporting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <Link href="/watchdog-hub">
                          <Button
                            variant="outline"
                            className="h-auto flex-col items-start p-4 w-full hover:border-emerald-500 hover:bg-emerald-50"
                          >
                            <Plus className="h-5 w-5 mb-2 text-emerald-600" />
                            <span className="font-semibold">Submit Report</span>
                            <span className="text-xs text-muted-foreground">Report AI incidents</span>
                          </Button>
                        </Link>
                        <Button
                          variant={watchdogSubTab === 'incidents' ? 'default' : 'outline'}
                          className="h-auto flex-col items-start p-4"
                          onClick={() => setWatchdogSubTab('incidents')}
                        >
                          <History className="h-5 w-5 mb-2" />
                          <span className="font-semibold">Previous Incidents</span>
                          <span className="text-xs text-muted-foreground">Browse all reports</span>
                        </Button>
                        <Button
                          variant={watchdogSubTab === 'leaderboard' ? 'default' : 'outline'}
                          className="h-auto flex-col items-start p-4"
                          onClick={() => setWatchdogSubTab('leaderboard')}
                        >
                          <Trophy className="h-5 w-5 mb-2" />
                          <span className="font-semibold">Leaderboard</span>
                          <span className="text-xs text-muted-foreground">Top analysts</span>
                        </Button>
                        <Button
                          variant={watchdogSubTab === 'about' ? 'default' : 'outline'}
                          className="h-auto flex-col items-start p-4"
                          onClick={() => setWatchdogSubTab('about')}
                        >
                          <Eye className="h-5 w-5 mb-2" />
                          <span className="font-semibold">About Watchdog</span>
                          <span className="text-xs text-muted-foreground">Learn more</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Watchdog Sub-content */}
                  {watchdogSubTab === 'incidents' && (
                    <WatchdogIncidentsPanel onViewIncident={handleViewIncident} />
                  )}

                  {watchdogSubTab === 'leaderboard' && (
                    <WatchdogLeaderboard />
                  )}

                  {watchdogSubTab === 'about' && (
                    <Watchdog />
                  )}
                </motion.div>
              </div>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Training />
                </motion.div>
              </div>
            </div>
          )}

          {/* Certification Tab */}
          {activeTab === 'certification' && (
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Certification />
                </motion.div>
              </div>
            </div>
          )}

          {/* Regulatory Tab */}
          {activeTab === 'regulatory' && (
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegulatoryAuthority />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Onboarding Tour */}
      <OnboardingTour
        tourId="members-dashboard"
        steps={tourSteps}
        onComplete={() => console.log('Tour completed!')}
      />
    </DashboardLayout>
  );
}
