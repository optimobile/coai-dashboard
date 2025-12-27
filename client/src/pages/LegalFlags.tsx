import { useState } from 'react';
import { AlertTriangle, Filter, Download, Share2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LegalFlagDetails } from '@/components/LegalFlagDetails';

// Mock data for demonstration
const mockFlags = [
  {
    id: 1,
    reportId: 101,
    riskScore: 85,
    summary: 'Critical violations detected: Prohibited AI practices and GDPR breaches',
    violations: [
      {
        categoryId: 'prohibited_practices',
        categoryName: 'Prohibited AI Practices',
        articleReference: 'Article 5',
        severity: 'critical' as const,
        description: 'Use of AI system with unacceptable risk (social scoring)',
        evidence: ['social scoring', 'mass surveillance', 'High-severity incident reported'],
        enforcementAuthority: 'European Commission / National Authorities',
        recommendedActions: [
          'Immediate cease of prohibited AI practice',
          'Notify relevant national authority',
          'Prepare legal defense documentation',
        ],
      },
      {
        categoryId: 'data_protection_violations',
        categoryName: 'Data Protection (GDPR) Violations',
        articleReference: 'GDPR Articles 5-6',
        severity: 'high' as const,
        description: 'AI use violating data protection principles or rights',
        evidence: ['no legal basis', 'inadequate consent', 'unauthorized processing'],
        enforcementAuthority: 'National Data Protection Authorities',
        recommendedActions: [
          'Conduct Data Protection Impact Assessment (DPIA)',
          'Notify Data Protection Authority',
          'Implement privacy safeguards',
        ],
      },
    ],
    legalActions: [
      'Immediate cease of prohibited AI practice',
      'Notify relevant national authority',
      'Conduct Data Protection Impact Assessment (DPIA)',
      'Notify Data Protection Authority',
      'Prepare legal defense documentation',
    ],
    flaggedAt: new Date().toISOString(),
    status: 'flagged' as const,
  },
  {
    id: 2,
    reportId: 102,
    riskScore: 65,
    summary: 'High-risk system requirements not met',
    violations: [
      {
        categoryId: 'high_risk_requirements',
        categoryName: 'High-Risk System Requirements Violation',
        articleReference: 'Article 8',
        severity: 'high' as const,
        description: 'Failure to meet requirements for high-risk AI systems',
        evidence: ['no risk assessment', 'inadequate testing', 'missing documentation'],
        enforcementAuthority: 'National Authorities / Notified Bodies',
        recommendedActions: [
          'Conduct comprehensive risk assessment',
          'Implement missing safeguards',
          'Document compliance measures',
        ],
      },
    ],
    legalActions: [
      'Conduct comprehensive risk assessment',
      'Implement missing safeguards',
      'Document compliance measures',
    ],
    flaggedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'assigned' as const,
  },
  {
    id: 3,
    reportId: 103,
    riskScore: 45,
    summary: 'Transparency requirements not fully met',
    violations: [
      {
        categoryId: 'transparency_violations',
        categoryName: 'Transparency Requirement Violations',
        articleReference: 'Article 13',
        severity: 'high' as const,
        description: 'Failure to disclose that an AI system is being used',
        evidence: ['no disclosure of AI use', 'inadequate user information'],
        enforcementAuthority: 'National Authorities / Consumer Protection',
        recommendedActions: [
          'Implement immediate disclosure mechanism',
          'Provide required user information',
          'Document transparency measures',
        ],
      },
    ],
    legalActions: [
      'Implement immediate disclosure mechanism',
      'Provide required user information',
    ],
    flaggedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'under_review' as const,
  },
];

export function LegalFlagsPage() {
  const [selectedFlag, setSelectedFlag] = useState(mockFlags[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlags = mockFlags.filter(flag => {
    if (filterStatus !== 'all' && flag.status !== filterStatus) return false;
    if (filterSeverity !== 'all') {
      const maxSeverity = Math.max(...flag.violations.map(v => {
        const severityMap = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityMap[v.severity] || 0;
      }));
      const severityMap = { critical: 4, high: 3, medium: 2, low: 1 };
      if (maxSeverity !== (severityMap[filterSeverity as keyof typeof severityMap] || 0)) return false;
    }
    if (searchQuery && !flag.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskBadgeVariant = (score: number): 'destructive' | 'default' | 'secondary' | 'outline' => {
    if (score >= 70) return 'destructive';
    if (score >= 50) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          Legal Compliance Flags
        </h1>
        <p className="text-gray-600 mt-2">
          EU AI Act violations detected in Watchdog reports requiring legal review
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{mockFlags.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Flags</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {mockFlags.filter(f => f.riskScore >= 70).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Critical Risk</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {mockFlags.filter(f => f.status === 'flagged').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending Review</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {mockFlags.filter(f => f.status === 'resolved').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Resolved</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flags List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
                <Input
                  placeholder="Search by report ID or summary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Severity</label>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                    <SelectItem value="high">High & Above</SelectItem>
                    <SelectItem value="medium">Medium & Above</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Flags List */}
          <div className="space-y-2">
            {filteredFlags.map((flag) => (
              <button
                key={flag.id}
                onClick={() => setSelectedFlag(flag)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedFlag.id === flag.id
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm">Report #{flag.reportId}</span>
                  <Badge variant={getRiskBadgeVariant(flag.riskScore)} className="text-xs">
                    {flag.riskScore}%
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{flag.summary}</p>
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(flag.status)}`}>
                  {flag.status.replace('_', ' ').toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2">
          {selectedFlag && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Case File
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share with Legal Team
                </Button>
              </div>
              <LegalFlagDetails {...selectedFlag} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
