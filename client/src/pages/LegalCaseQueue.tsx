import { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, User, Calendar } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data
const mockCases = [
  {
    id: 1,
    flagId: 1,
    reportId: 101,
    status: 'pending' as const,
    riskScore: 85,
    summary: 'Critical violations: Prohibited AI practices and GDPR breaches',
    assignedTo: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    violationCount: 2,
    priority: 'critical' as const,
  },
  {
    id: 2,
    flagId: 2,
    reportId: 102,
    status: 'assigned' as const,
    riskScore: 65,
    summary: 'High-risk system requirements not met',
    assignedTo: { id: 1, name: 'Sarah Johnson', email: 'sarah@legal.com' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    violationCount: 1,
    priority: 'high' as const,
  },
  {
    id: 3,
    flagId: 3,
    reportId: 103,
    status: 'in_progress' as const,
    riskScore: 45,
    summary: 'Transparency requirements not fully met',
    assignedTo: { id: 2, name: 'Michael Chen', email: 'michael@legal.com' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    violationCount: 1,
    priority: 'high' as const,
  },
  {
    id: 4,
    flagId: 4,
    reportId: 104,
    status: 'under_review' as const,
    riskScore: 55,
    summary: 'Employment discrimination violations detected',
    assignedTo: { id: 1, name: 'Sarah Johnson', email: 'sarah@legal.com' },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    violationCount: 1,
    priority: 'high' as const,
  },
];

const barristers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@legal.com', specialty: 'EU AI Act' },
  { id: 2, name: 'Michael Chen', email: 'michael@legal.com', specialty: 'Data Protection' },
  { id: 3, name: 'Emma Williams', email: 'emma@legal.com', specialty: 'Employment Law' },
];

export function LegalCaseQueuePage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(mockCases[0]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const filteredCases = mockCases.filter(caseItem => {
    if (filterStatus !== 'all' && caseItem.status !== filterStatus) return false;
    if (filterPriority !== 'all' && caseItem.priority !== filterPriority) return false;
    if (searchQuery && !caseItem.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'assigned':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'under_review':
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">In Progress</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Under Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  const pendingCount = mockCases.filter(c => c.status === 'pending').length;
  const assignedCount = mockCases.filter(c => c.status === 'assigned').length;
  const inProgressCount = mockCases.filter(c => c.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckCircle className="h-8 w-8 text-blue-600" />
          Legal Case Queue
        </h1>
        <p className="text-gray-600 mt-2">
          Manage legal cases and assign to barristers for review and action
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-gray-600 mt-1">Pending Assignment</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{assignedCount}</div>
              <div className="text-sm text-gray-600 mt-1">Assigned</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{inProgressCount}</div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{mockCases.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Cases</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
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
                  placeholder="Search cases..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cases List */}
          <div className="space-y-2">
            {filteredCases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedCase.id === caseItem.id
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(caseItem.status)}
                    <span className="font-semibold text-sm">Case #{caseItem.id}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs border ${getPriorityColor(caseItem.priority)}`}>
                    {caseItem.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{caseItem.summary}</p>
                <div className="flex items-center justify-between">
                  {getStatusBadge(caseItem.status)}
                  {caseItem.assignedTo && (
                    <span className="text-xs text-gray-600">{caseItem.assignedTo.name}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Case Details */}
        <div className="lg:col-span-2">
          {selectedCase && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Case #{selectedCase.id} - Report #{selectedCase.reportId}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(selectedCase.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className={`rounded-lg p-3 border ${getPriorityColor(selectedCase.priority)}`}>
                      <div className="text-xs font-semibold opacity-75">Risk Score</div>
                      <div className="text-2xl font-bold">{selectedCase.riskScore}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Summary</h4>
                    <p className="text-sm text-gray-600">{selectedCase.summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Status</h4>
                      {getStatusBadge(selectedCase.status)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Violations</h4>
                      <Badge variant="outline">{selectedCase.violationCount} violation(s)</Badge>
                    </div>
                  </div>

                  {selectedCase.assignedTo ? (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Assigned To</h4>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-blue-900">{selectedCase.assignedTo.name}</p>
                          <p className="text-xs text-blue-700">{selectedCase.assignedTo.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-sm text-yellow-900 font-medium mb-3">
                        This case is not yet assigned. Assign to a barrister for review.
                      </p>
                      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="default" className="w-full">
                            Assign to Barrister
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Case to Barrister</DialogTitle>
                            <DialogDescription>
                              Select a legal professional to review this case
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            {barristers.map((barrister) => (
                              <button
                                key={barrister.id}
                                onClick={() => {
                                  // Handle assignment
                                  setAssignDialogOpen(false);
                                }}
                                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{barrister.name}</p>
                                    <p className="text-xs text-gray-600">{barrister.specialty}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Full Case File
                    </Button>
                    <Button size="sm" className="flex-1">
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
