/**
 * Public Watchdog Incidents Database
 * Searchable, filterable incident database with real-time stats and severity trends
 */

import { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, AlertTriangle, Clock, User, Tag, Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  category: string;
  reportedDate: string;
  resolvedDate?: string;
  reporter: string;
  affectedSystems: string[];
  impact: string;
  assignedAnalyst?: string;
  views: number;
  comments: number;
}

// Sample incident data
const sampleIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Bias detected in hiring recommendation system',
    description: 'Gender bias identified in AI-powered recruitment tool affecting 500+ candidates',
    severity: 'critical',
    status: 'investigating',
    category: 'Bias & Fairness',
    reportedDate: '2025-12-20',
    reporter: 'Jane Smith',
    affectedSystems: ['HireAI Pro', 'Talent Matcher'],
    impact: 'Potential discrimination in hiring decisions',
    assignedAnalyst: 'Alice Johnson',
    views: 1250,
    comments: 45,
  },
  {
    id: 'INC-002',
    title: 'Data privacy violation in chatbot',
    description: 'Chatbot inadvertently exposed user personal information in responses',
    severity: 'critical',
    status: 'resolved',
    category: 'Privacy',
    reportedDate: '2025-12-15',
    resolvedDate: '2025-12-18',
    reporter: 'Security Team',
    affectedSystems: ['ChatBot Pro'],
    impact: 'Exposure of sensitive user data',
    assignedAnalyst: 'Bob Wilson',
    views: 2100,
    comments: 78,
  },
  {
    id: 'INC-003',
    title: 'Model accuracy degradation',
    description: 'Significant drop in prediction accuracy for fraud detection model',
    severity: 'high',
    status: 'investigating',
    category: 'Performance',
    reportedDate: '2025-12-18',
    reporter: 'ML Ops Team',
    affectedSystems: ['Fraud Detector v2'],
    impact: 'Reduced fraud detection effectiveness',
    assignedAnalyst: 'Carol Davis',
    views: 890,
    comments: 32,
  },
  {
    id: 'INC-004',
    title: 'Adversarial attack vulnerability',
    description: 'Image recognition system susceptible to adversarial perturbations',
    severity: 'high',
    status: 'open',
    category: 'Security',
    reportedDate: '2025-12-19',
    reporter: 'Security Researcher',
    affectedSystems: ['ImageNet Classifier'],
    impact: 'System can be fooled with crafted inputs',
    views: 650,
    comments: 28,
  },
  {
    id: 'INC-005',
    title: 'Hallucination in medical diagnosis AI',
    description: 'AI system generating false medical diagnoses not supported by data',
    severity: 'critical',
    status: 'investigating',
    category: 'Safety',
    reportedDate: '2025-12-17',
    reporter: 'Medical Director',
    affectedSystems: ['MediDiagnose AI'],
    impact: 'Potential patient harm from incorrect diagnoses',
    assignedAnalyst: 'Dr. Emily Chen',
    views: 3200,
    comments: 156,
  },
  {
    id: 'INC-006',
    title: 'Model training data contamination',
    description: 'Training data found to contain duplicates and mislabeled samples',
    severity: 'medium',
    status: 'resolved',
    category: 'Data Quality',
    reportedDate: '2025-12-10',
    resolvedDate: '2025-12-16',
    reporter: 'Data Team',
    affectedSystems: ['Recommendation Engine'],
    impact: 'Reduced model reliability',
    assignedAnalyst: 'Frank Martinez',
    views: 420,
    comments: 15,
  },
  {
    id: 'INC-007',
    title: 'Transparency issue in decision-making',
    description: 'Loan approval AI unable to explain decisions to applicants',
    severity: 'medium',
    status: 'open',
    category: 'Transparency',
    reportedDate: '2025-12-19',
    reporter: 'Compliance Officer',
    affectedSystems: ['LoanDecide AI'],
    impact: 'Regulatory compliance concerns',
    views: 340,
    comments: 12,
  },
  {
    id: 'INC-008',
    title: 'Model drift in demand forecasting',
    description: 'Demand prediction accuracy declining over time',
    severity: 'low',
    status: 'closed',
    category: 'Performance',
    reportedDate: '2025-12-05',
    resolvedDate: '2025-12-12',
    reporter: 'Analytics Team',
    affectedSystems: ['Demand Predictor'],
    impact: 'Minor impact on inventory management',
    assignedAnalyst: 'Grace Lee',
    views: 210,
    comments: 8,
  },
];

const severityColors = {
  critical: 'text-red-700 bg-red-50 border-red-200',
  high: 'text-orange-700 bg-orange-50 border-orange-200',
  medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  low: 'text-blue-700 bg-blue-50 border-blue-200',
};

const statusColors = {
  open: 'bg-slate-100 text-slate-800',
  investigating: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

export function WatchdogIncidents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(new Set());

  // Filter and search incidents
  const filteredIncidents = useMemo(() => {
    return sampleIncidents.filter((incident) => {
      const matchesSearch =
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || incident.category === categoryFilter;

      return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
    });
  }, [searchQuery, severityFilter, statusFilter, categoryFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = sampleIncidents.length;
    const critical = sampleIncidents.filter((i) => i.severity === 'critical').length;
    const open = sampleIncidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;
    const resolved = sampleIncidents.filter((i) => i.status === 'resolved').length;
    const totalViews = sampleIncidents.reduce((sum, i) => sum + i.views, 0);

    return { total, critical, open, resolved, totalViews };
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(sampleIncidents.map((i) => i.category)));

  const toggleIncident = (id: string) => {
    setExpandedIncidents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Watchdog Incidents Database</h1>
              <p className="text-lg text-slate-600 mt-2">Public AI safety incident tracking and analysis</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
                  <div className="text-sm text-slate-600 mt-1">Total Incidents</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
                  <div className="text-sm text-slate-600 mt-1">Critical</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.open}</div>
                  <div className="text-sm text-slate-600 mt-1">Open/Investigating</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.resolved}</div>
                  <div className="text-sm text-slate-600 mt-1">Resolved</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">{stats.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-slate-600 mt-1">Total Views</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search incidents by title, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''} found
            </h2>
          </div>

          {filteredIncidents.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No incidents match your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredIncidents.map((incident) => {
              const isExpanded = expandedIncidents.has(incident.id);
              return (
                <Card
                  key={incident.id}
                  className={cn(
                    'cursor-pointer hover:shadow-md transition-all',
                    severityColors[incident.severity],
                    'border-2'
                  )}
                  onClick={() => toggleIncident(incident.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-semibold">{incident.id}</span>
                          <Badge className={statusColors[incident.status]}>
                            {incident.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {incident.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <CardDescription className="mt-2">{incident.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Affected Systems</h4>
                          <div className="flex flex-wrap gap-2">
                            {incident.affectedSystems.map((system) => (
                              <Badge key={system} variant="secondary">
                                {system}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">Impact</h4>
                          <p className="text-sm text-slate-700">{incident.impact}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Reporter
                          </h4>
                          <p className="text-sm text-slate-700">{incident.reporter}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Timeline
                          </h4>
                          <p className="text-sm text-slate-700">
                            Reported: {new Date(incident.reportedDate).toLocaleDateString()}
                            {incident.resolvedDate && (
                              <>
                                <br />
                                Resolved: {new Date(incident.resolvedDate).toLocaleDateString()}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {incident.assignedAnalyst && (
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-emerald-900">
                            <strong>Assigned Analyst:</strong> {incident.assignedAnalyst}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {incident.views.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {incident.comments} comments
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchdogIncidents;
