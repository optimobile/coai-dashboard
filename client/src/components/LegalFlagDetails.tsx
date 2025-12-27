import { AlertTriangle, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Violation {
  categoryId: string;
  categoryName: string;
  articleReference: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  evidence: string[];
  enforcementAuthority: string;
  recommendedActions: string[];
}

interface LegalFlagDetailsProps {
  reportId: number;
  riskScore: number;
  summary: string;
  violations: Violation[];
  legalActions: string[];
  flaggedAt: string;
}

export function LegalFlagDetails({
  reportId,
  riskScore,
  summary,
  violations,
  legalActions,
  flaggedAt,
}: LegalFlagDetailsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-100 text-red-900 border-red-300';
    if (score >= 50) return 'bg-orange-100 text-orange-900 border-orange-300';
    return 'bg-yellow-100 text-yellow-900 border-yellow-300';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Legal Compliance Analysis</CardTitle>
              <CardDescription>Report #{reportId} - {new Date(flaggedAt).toLocaleDateString()}</CardDescription>
            </div>
            <div className={`rounded-lg p-4 border ${getRiskColor(riskScore)}`}>
              <div className="text-xs font-semibold opacity-75">Risk Score</div>
              <div className="text-3xl font-bold">{riskScore}%</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{summary}</p>
        </CardContent>
      </Card>

      {/* Violations Tabs */}
      <Tabs defaultValue="violations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="violations">
            Violations ({violations.length})
          </TabsTrigger>
          <TabsTrigger value="actions">
            Recommended Actions
          </TabsTrigger>
          <TabsTrigger value="authorities">
            Authorities
          </TabsTrigger>
        </TabsList>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-3">
          {violations.map((violation, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(violation.severity)}
                    <div className="flex-1">
                      <CardTitle className="text-base">{violation.categoryName}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {violation.articleReference}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getSeverityBadge(violation.severity)}>
                    {violation.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                  <p className="text-sm text-gray-600">{violation.description}</p>
                </div>

                {violation.evidence.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Evidence Found</h4>
                    <ul className="space-y-1">
                      {violation.evidence.map((e, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Enforcement Authority</h4>
                  <p className="text-sm text-gray-600">{violation.enforcementAuthority}</p>
                </div>

                {violation.recommendedActions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Actions</h4>
                    <ul className="space-y-1">
                      {violation.recommendedActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legal Actions Required</CardTitle>
              <CardDescription>
                Priority actions to address identified violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {legalActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authorities Tab */}
        <TabsContent value="authorities" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Relevant Enforcement Authorities</CardTitle>
              <CardDescription>
                Organizations responsible for enforcement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(violations.map(v => v.enforcementAuthority))).map((authority, index) => (
                  <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-semibold text-sm text-blue-900 mb-1">{authority}</h4>
                    <p className="text-xs text-blue-800 mb-2">
                      Responsible for enforcement of related regulations
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Contact Information
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legal Notice */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-900">
              <p className="font-semibold mb-1">Legal Review Required</p>
              <p>
                This report has been flagged for legal review. Please assign to a qualified legal professional
                for detailed analysis and recommended response strategy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
