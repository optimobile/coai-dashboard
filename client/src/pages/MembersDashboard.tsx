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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import WatchdogIncidentsPanel from '@/components/WatchdogIncidentsPanel';

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

        {/* Tabs Navigation */}
        <div className="border-b border-border bg-background/50">
          <div className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid gap-2 bg-transparent border-b border-border rounded-none p-0 h-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium transition-all"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="h-full">
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              </div>
            </TabsContent>

            {/* Watchdog Tab - Enhanced with sub-tabs */}
            <TabsContent value="watchdog" className="h-full">
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
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="h-full">
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Training />
                </motion.div>
              </div>
            </TabsContent>

            {/* Certification Tab */}
            <TabsContent value="certification" className="h-full">
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Certification />
                </motion.div>
              </div>
            </TabsContent>

            {/* Regulatory Tab */}
            <TabsContent value="regulatory" className="h-full">
              <div className="p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegulatoryAuthority />
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
