import { AlertTriangle, Scale, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface LegalFlag {
  id: number;
  reportId: number;
  riskScore: number;
  summary: string;
  violations: string[];
  flaggedAt: string;
  status: 'flagged' | 'assigned' | 'under_review' | 'resolved' | 'dismissed';
}

interface LegalFlagsWidgetProps {
  flags?: LegalFlag[];
  loading?: boolean;
  onViewAll?: () => void;
}

export function LegalFlagsWidget({ flags = [], loading = false, onViewAll }: LegalFlagsWidgetProps) {
  const criticalFlags = flags.filter(f => f.riskScore >= 70);
  const highFlags = flags.filter(f => f.riskScore >= 50 && f.riskScore < 70);
  const pendingFlags = flags.filter(f => f.status === 'flagged' || f.status === 'assigned');

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50';
    if (score >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getRiskBadgeVariant = (score: number): 'destructive' | 'default' | 'secondary' | 'outline' => {
    if (score >= 70) return 'destructive';
    if (score >= 50) return 'default';
    return 'secondary';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Flagged</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Assigned</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Under Review</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg">Legal Compliance Flags</CardTitle>
          </div>
          <Badge variant="destructive" className="rounded-full">
            {flags.length} Flags
          </Badge>
        </div>
        <CardDescription>EU AI Act violations detected in reports</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-white p-3 border border-red-100">
            <div className="text-xs text-gray-600 font-medium">Critical</div>
            <div className="text-2xl font-bold text-red-600">{criticalFlags.length}</div>
          </div>
          <div className="rounded-lg bg-white p-3 border border-orange-100">
            <div className="text-xs text-gray-600 font-medium">High Risk</div>
            <div className="text-2xl font-bold text-orange-600">{highFlags.length}</div>
          </div>
          <div className="rounded-lg bg-white p-3 border border-blue-100">
            <div className="text-xs text-gray-600 font-medium">Pending</div>
            <div className="text-2xl font-bold text-blue-600">{pendingFlags.length}</div>
          </div>
        </div>

        {/* Recent Flags List */}
        {flags.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {flags.slice(0, 5).map((flag) => (
              <div
                key={flag.id}
                className={`rounded-lg p-3 border ${getRiskColor(flag.riskScore)} border-opacity-30`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span className="font-semibold text-sm truncate">
                        Report #{flag.reportId}
                      </span>
                      <Badge variant={getRiskBadgeVariant(flag.riskScore)} className="text-xs">
                        {flag.riskScore}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2 mb-2">{flag.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {flag.violations.slice(0, 2).map((v, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {v}
                        </Badge>
                      ))}
                      {flag.violations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{flag.violations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {getStatusBadge(flag.status)}
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(flag.flaggedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center border border-dashed border-gray-300">
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-600">No legal flags detected</p>
            <p className="text-xs text-gray-500 mt-1">Reports are monitored for compliance violations</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href="/legal/flags" className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              View All Flags
            </Button>
          </Link>
          <Link href="/legal/case-queue" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Case Queue
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
