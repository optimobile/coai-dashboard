/**
 * Compliance Framework Pages
 * Individual pages for each compliance framework with detailed guidance and checklists
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Download, Share2, AlertCircle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplianceControl {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline?: string;
  guidance: string;
  resources: Array<{ title: string; url: string }>;
}

interface FrameworkData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  jurisdiction: string;
  deadline?: string;
  overview: string;
  keyPrinciples: string[];
  controls: ComplianceControl[];
  categories: string[];
}

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const frameworks: Record<string, FrameworkData> = {
  'eu-ai-act': {
    id: 'eu-ai-act',
    name: 'EU AI Act',
    shortName: 'EU AI Act',
    description: 'European Union Artificial Intelligence Act',
    jurisdiction: 'European Union',
    deadline: '2026-02-02',
    overview: 'The EU AI Act is a comprehensive regulatory framework that establishes rules for the development, deployment, and use of artificial intelligence systems in the EU. It introduces a risk-based approach with different requirements based on the level of risk posed by the AI system.',
    keyPrinciples: [
      'Risk-based regulation',
      'Transparency and explainability',
      'Human oversight and control',
      'Data quality and governance',
      'Accountability and responsibility',
      'Fundamental rights protection',
    ],
    categories: [
      'Prohibited Practices',
      'High-Risk Systems',
      'Transparency Requirements',
      'General Purpose AI',
      'Governance & Compliance',
    ],
    controls: [
      {
        id: 'eu-001',
        title: 'Prohibited AI Practices Assessment',
        description: 'Identify and eliminate AI systems that pose unacceptable risks',
        category: 'Prohibited Practices',
        status: 'compliant',
        priority: 'critical',
        guidance: 'Conduct a comprehensive audit of all AI systems to identify those that fall under prohibited categories (e.g., real-time biometric identification in public spaces, social scoring systems). Document findings and implement remediation plans.',
        resources: [
          { title: 'EU AI Act Article 5', url: '#' },
          { title: 'Prohibited Practices Guidance', url: '#' },
        ],
      },
      {
        id: 'eu-002',
        title: 'High-Risk AI System Classification',
        description: 'Classify AI systems according to risk levels',
        category: 'High-Risk Systems',
        status: 'partial',
        priority: 'critical',
        deadline: '2025-12-31',
        guidance: 'Use the risk assessment framework to classify each AI system. High-risk systems require extensive documentation, testing, and monitoring. Create a register of all high-risk systems with their risk scores.',
        resources: [
          { title: 'Risk Classification Framework', url: '#' },
          { title: 'High-Risk System Requirements', url: '#' },
        ],
      },
      {
        id: 'eu-003',
        title: 'Transparency and Documentation',
        description: 'Maintain comprehensive AI system documentation',
        category: 'Transparency Requirements',
        status: 'non-compliant',
        priority: 'critical',
        deadline: '2025-06-30',
        guidance: 'Document all AI systems with technical specifications, training data sources, performance metrics, and known limitations. Provide clear information to users about AI system capabilities and limitations.',
        resources: [
          { title: 'Documentation Requirements', url: '#' },
          { title: 'Transparency Guidelines', url: '#' },
        ],
      },
    ],
  },
  'nist': {
    id: 'nist',
    name: 'NIST AI Risk Management Framework',
    shortName: 'NIST RMF',
    description: 'National Institute of Standards and Technology AI Risk Management Framework',
    jurisdiction: 'United States',
    overview: 'The NIST AI RMF provides a flexible framework for managing risks associated with AI systems. It emphasizes a continuous, organization-wide approach to AI risk management and is designed to be adaptable to different organizational contexts and AI system types.',
    keyPrinciples: [
      'Continuous risk management',
      'Organizational accountability',
      'Risk-informed decision making',
      'Transparency and explainability',
      'Human-centered design',
      'Stakeholder engagement',
    ],
    categories: [
      'Governance',
      'Map',
      'Measure',
      'Manage',
    ],
    controls: [
      {
        id: 'nist-001',
        title: 'Establish AI Risk Governance',
        description: 'Create organizational structures for AI risk management',
        category: 'Governance',
        status: 'partial',
        priority: 'critical',
        guidance: 'Establish an AI risk management committee with representatives from technical, legal, and business teams. Define roles, responsibilities, and escalation procedures.',
        resources: [
          { title: 'NIST AI RMF Governance', url: '#' },
          { title: 'Organizational Structures', url: '#' },
        ],
      },
    ],
  },
  'iso-42001': {
    id: 'iso-42001',
    name: 'ISO/IEC 42001',
    shortName: 'ISO 42001',
    description: 'Information technology - Artificial intelligence - Management system',
    jurisdiction: 'International',
    overview: 'ISO/IEC 42001 is an international standard that provides requirements for establishing, implementing, maintaining, and continually improving an AI management system. It is based on the Plan-Do-Check-Act (PDCA) cycle.',
    keyPrinciples: [
      'Systematic management',
      'Continuous improvement',
      'Risk-based approach',
      'Stakeholder engagement',
      'Documented procedures',
      'Performance evaluation',
    ],
    categories: [
      'Context & Scope',
      'Leadership & Commitment',
      'Planning',
    ],
    controls: [
      {
        id: 'iso-001',
        title: 'Define AI Management System Scope',
        description: 'Establish the scope and boundaries of the AI management system',
        category: 'Context & Scope',
        status: 'compliant',
        priority: 'high',
        guidance: 'Document the scope of your AI management system, including which AI systems and organizational units are covered. Consider external and internal context.',
        resources: [
          { title: 'ISO 42001 Section 4', url: '#' },
          { title: 'Scope Definition Guide', url: '#' },
        ],
      },
    ],
  },
  'tc260': {
    id: 'tc260',
    name: 'TC260 AI Safety Standards',
    shortName: 'TC260',
    description: 'China Standardization Administration AI Safety Standards',
    jurisdiction: 'China',
    overview: 'TC260 develops AI safety standards for China, focusing on algorithm governance, data security, and AI system safety. These standards are increasingly important for organizations operating in or serving the Chinese market.',
    keyPrinciples: [
      'Algorithm governance',
      'Data security',
      'Content safety',
      'User rights protection',
      'Transparency requirements',
      'Audit and accountability',
    ],
    categories: [
      'Algorithm Governance',
      'Data Security',
      'Content Safety',
    ],
    controls: [
      {
        id: 'tc260-001',
        title: 'Algorithm Governance Framework',
        description: 'Establish algorithm governance and oversight',
        category: 'Algorithm Governance',
        status: 'partial',
        priority: 'critical',
        guidance: 'Implement algorithm governance procedures including design review, testing, deployment approval, and ongoing monitoring. Document all algorithms and their purposes.',
        resources: [
          { title: 'Algorithm Governance Guide', url: '#' },
          { title: 'TC260 Standards', url: '#' },
        ],
      },
    ],
  },
};

export function ComplianceFrameworkPage() {
  const [location, setLocation] = useLocation();
  
  // Extract framework from URL path
  const pathParts = location.split('/');
  const frameworkId = pathParts[2]; // /compliance/eu-ai-act -> eu-ai-act
  const framework = frameworks[frameworkId as string];
  
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set());
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    framework
      ? framework.controls.map((c) => ({
          id: c.id,
          title: c.title,
          completed: c.status === 'compliant',
          priority: c.priority,
        }))
      : []
  );

  if (!framework) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Framework Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">The requested compliance framework could not be found. Available: eu-ai-act, nist, iso-42001, tc260</p>
            <Button onClick={() => setLocation('/compliance')}>Back to Compliance</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleControl = (id: string) => {
    setExpandedControls((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completePercentage = checklist.length > 0
    ? Math.round(
        (checklist.filter((item) => item.completed).length / checklist.length) * 100
      )
    : 0;

  const criticalItems = checklist.filter((item) => item.priority === 'critical' && !item.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{framework.name}</h1>
              <p className="text-lg text-slate-600 mt-2">{framework.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">{completePercentage}%</div>
                  <div className="text-sm text-slate-600 mt-1">Complete</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{framework.controls.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Controls</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{criticalItems.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Critical Items</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-900">{framework.jurisdiction}</div>
                  <div className="text-sm text-slate-600 mt-1">Jurisdiction</div>
                  {framework.deadline && (
                    <div className="text-xs text-red-600 font-semibold mt-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(framework.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Framework Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-slate-700 leading-relaxed">{framework.overview}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Principles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {framework.keyPrinciples.map((principle) => (
                      <div key={principle} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
                        <Target className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{principle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            {framework.categories.map((category) => {
              const categoryControls = framework.controls.filter((c) => c.category === category);
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{category}</h3>
                  <div className="space-y-3">
                    {categoryControls.map((control) => (
                      <Card
                        key={control.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => toggleControl(control.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-base">{control.title}</CardTitle>
                                <Badge
                                  variant={
                                    control.status === 'compliant'
                                      ? 'default'
                                      : control.status === 'partial'
                                        ? 'secondary'
                                        : 'destructive'
                                  }
                                >
                                  {control.status}
                                </Badge>
                              </div>
                              <CardDescription>{control.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {control.deadline && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(control.deadline).toLocaleDateString()}
                                </Badge>
                              )}
                              {expandedControls.has(control.id) ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        {expandedControls.has(control.id) && (
                          <CardContent className="space-y-4 border-t pt-4">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">Guidance</h4>
                              <p className="text-slate-700 text-sm">{control.guidance}</p>
                            </div>

                            {control.resources.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Resources</h4>
                                <ul className="space-y-2">
                                  {control.resources.map((resource) => (
                                    <li key={resource.title}>
                                      <a
                                        href={resource.url}
                                        className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                                      >
                                        {resource.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline">
                                Start Assessment
                              </Button>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
                <CardDescription>Track your progress towards full compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {criticalItems.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">
                        {criticalItems.length} critical items need attention
                      </p>
                      <p className="text-sm text-red-800 mt-1">
                        Complete these items to ensure compliance with {framework.shortName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                      onClick={() => toggleChecklistItem(item.id)}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-sm',
                            item.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                          )}
                        >
                          {item.title}
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.priority === 'critical'
                            ? 'destructive'
                            : item.priority === 'high'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ComplianceFrameworkPage;
