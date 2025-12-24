/**
 * RLMAI Recommendations Page
 * 
 * Displays AI-powered compliance recommendations based on:
 * - Council decision patterns
 * - Incident analysis
 * - Compliance gaps
 * - Industry best practices
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { 
  Brain, 
  ShieldAlert, 
  AlertTriangle, 
  Building, 
  Shield, 
  Star, 
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  TrendingUp,
  RefreshCw,
  Loader2,
  ArrowRight,
  Lightbulb,
  X
} from 'lucide-react';
import { toast } from 'sonner';

// Priority colors and icons
const priorityConfig = {
  critical: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Zap, label: 'Critical' },
  high: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertTriangle, label: 'High' },
  medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock, label: 'Medium' },
  low: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2, label: 'Low' },
};

// Category icons
const categoryIcons: Record<string, typeof Shield> = {
  compliance_gap: ShieldAlert,
  incident_prevention: AlertTriangle,
  governance_improvement: Building,
  risk_mitigation: Shield,
  best_practice: Star,
  regulatory_update: FileText,
};

// Effort and impact colors
const effortColors = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
};

const impactColors = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-purple-400',
};

export default function Recommendations() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const { data: recommendations, isLoading, refetch } = trpc.recommendations.getRecommendations.useQuery({
    category: selectedCategory as any,
    priority: selectedPriority as any,
    limit: 20,
  });

  const { data: categories } = trpc.recommendations.getCategories.useQuery();
  const { data: aiSystems } = trpc.aiSystems.list.useQuery();

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(Array.from(prev).concat(id)));
    toast.success('Recommendation dismissed');
  };

  const handleImplement = (id: string, title: string) => {
    toast.success(`Started implementing: ${title}`, {
      description: 'Track progress in your PDCA cycles',
    });
  };

  const filteredRecommendations = recommendations?.recommendations.filter(
    r => !dismissedIds.has(r.id)
  ) || [];

  const summary = recommendations?.summary || { critical: 0, high: 0, medium: 0, low: 0 };
  const totalActive = summary.critical + summary.high + summary.medium + summary.low - dismissedIds.size;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              RLMAI Recommendations
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered compliance recommendations based on council decisions and incident patterns
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-3xl font-bold text-red-400">{summary.critical}</p>
                </div>
                <Zap className="h-8 w-8 text-red-400/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-3xl font-bold text-orange-400">{summary.high}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medium Priority</p>
                  <p className="text-3xl font-bold text-yellow-400">{summary.medium}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Priority</p>
                  <p className="text-3xl font-bold text-green-400">{summary.low}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                <Select 
                  value={selectedCategory || "all"} 
                  onValueChange={(v) => setSelectedCategory(v === "all" ? undefined : v)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <Select 
                  value={selectedPriority || "all"} 
                  onValueChange={(v) => setSelectedPriority(v === "all" ? undefined : v)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto text-sm text-muted-foreground">
                {totalActive} active recommendations
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
                <p className="text-muted-foreground">
                  {dismissedIds.size > 0 
                    ? "You've addressed all recommendations. Great work!"
                    : "Register AI systems and run assessments to receive personalized recommendations."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredRecommendations.map((rec, index) => {
                const PriorityIcon = priorityConfig[rec.priority].icon;
                const CategoryIcon = categoryIcons[rec.category] || Shield;
                const isExpanded = expandedId === rec.id;

                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className={`border-l-4 ${
                      rec.priority === 'critical' ? 'border-l-red-500' :
                      rec.priority === 'high' ? 'border-l-orange-500' :
                      rec.priority === 'medium' ? 'border-l-yellow-500' :
                      'border-l-green-500'
                    }`}>
                      <CardContent className="p-0">
                        {/* Main Row */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${priorityConfig[rec.priority].color.split(' ')[0]}`}>
                              <PriorityIcon className={`h-5 w-5 ${priorityConfig[rec.priority].color.split(' ')[1]}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{rec.title}</h3>
                                <Badge className={priorityConfig[rec.priority].color}>
                                  {priorityConfig[rec.priority].label}
                                </Badge>
                                {rec.framework && (
                                  <Badge variant="outline">{rec.framework}</Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {rec.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CategoryIcon className="h-3 w-3" />
                                  {rec.category.replace(/_/g, ' ')}
                                </span>
                                {rec.aiSystemName && (
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {rec.aiSystemName}
                                  </span>
                                )}
                                <span className={`flex items-center gap-1 ${effortColors[rec.estimatedEffort]}`}>
                                  <Clock className="h-3 w-3" />
                                  {rec.estimatedEffort} effort
                                </span>
                                <span className={`flex items-center gap-1 ${impactColors[rec.potentialImpact]}`}>
                                  <TrendingUp className="h-3 w-3" />
                                  {rec.potentialImpact} impact
                                </span>
                              </div>
                            </div>
                            
                            <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>
                        
                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-2 border-t border-border">
                                {/* Based On */}
                                <div className="mb-4 p-3 rounded-lg bg-muted/50">
                                  <p className="text-xs text-muted-foreground mb-1">Based on:</p>
                                  <p className="text-sm">
                                    <span className="font-medium">{rec.basedOn.type.replace(/_/g, ' ')}</span>
                                    {' — '}
                                    {rec.basedOn.details}
                                  </p>
                                </div>
                                
                                {/* Action Items */}
                                <div className="mb-4">
                                  <p className="text-sm font-medium mb-2">Action Items:</p>
                                  <ul className="space-y-2">
                                    {rec.actionItems.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleImplement(rec.id, rec.title);
                                    }}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Start Implementation
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDismiss(rec.id);
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Dismiss
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              How RLMAI Recommendations Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold mb-2">Incident Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyzes patterns from Watchdog incident reports to identify emerging risks and prevention strategies.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Building className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="font-semibold mb-2">Council Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Learns from 33-Agent Council voting patterns to understand compliance decision factors.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="font-semibold mb-2">Personalized Actions</h4>
                <p className="text-sm text-muted-foreground">
                  Generates tailored recommendations based on your AI systems, assessments, and compliance gaps.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
