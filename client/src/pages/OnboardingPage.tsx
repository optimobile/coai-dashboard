/**
 * Enterprise Onboarding Wizard
 * 5-step guided setup for new organizations
 */

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function OnboardingPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState<string>('');

  // Step 1: Company Info
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  // Step 2: Frameworks
  const [selectedFrameworks, setSelectedFrameworks] = useState<number[]>([]);

  // Step 3: AI Systems
  const [aiSystems, setAiSystems] = useState<Array<{ name: string; type: string; riskLevel: string }>>([]);
  const [newSystem, setNewSystem] = useState({ name: '', type: '', riskLevel: '' });

  // Step 4: Baseline
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});

  // Step 5: Team
  const [teamMembers, setTeamMembers] = useState<Array<{ email: string; role: string }>>([]);
  const [newMember, setNewMember] = useState({ email: '', role: '' });

  // Start onboarding
  const startOnboardingMutation = useMutation({
    mutationFn: async () => {
      const response = await trpc.onboarding.startOnboarding.mutate({});
      return response;
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
    },
  });

  // Submit company info
  const submitCompanyInfoMutation = useMutation({
    mutationFn: async () => {
      if (!companyName || !industry || !companySize || !jurisdiction) {
        throw new Error('Please fill in all fields');
      }
      return await trpc.onboarding.submitCompanyInfo.mutate({
        sessionId,
        name: companyName,
        industry,
        size: companySize as any,
        jurisdiction,
      });
    },
    onSuccess: () => {
      toast({ title: 'Company info saved', description: 'Moving to framework selection' });
      setCurrentStep(2);
    },
  });

  // Select frameworks
  const selectFrameworksMutation = useMutation({
    mutationFn: async () => {
      if (selectedFrameworks.length === 0) {
        throw new Error('Please select at least one framework');
      }
      return await trpc.onboarding.selectFrameworks.mutate({
        sessionId,
        frameworkIds: selectedFrameworks,
      });
    },
    onSuccess: () => {
      toast({ title: 'Frameworks selected', description: 'Moving to AI systems mapping' });
      setCurrentStep(3);
    },
  });

  // Map AI systems
  const mapAISystemsMutation = useMutation({
    mutationFn: async () => {
      if (aiSystems.length === 0) {
        throw new Error('Please add at least one AI system');
      }
      return await trpc.onboarding.mapAISystems.mutate({
        sessionId,
        aiSystems: aiSystems.map((s) => ({
          name: s.name,
          type: s.type as any,
          riskLevel: s.riskLevel as any,
        })),
      });
    },
    onSuccess: () => {
      toast({ title: 'AI systems registered', description: 'Moving to baseline assessment' });
      setCurrentStep(4);
    },
  });

  // Submit baseline
  const submitBaselineMutation = useMutation({
    mutationFn: async () => {
      const answers = Object.values(assessmentAnswers);
      if (answers.length === 0) {
        throw new Error('Please answer all questions');
      }
      return await trpc.onboarding.submitBaseline.mutate({
        sessionId,
        assessmentAnswers,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Baseline Assessment Complete',
        description: `Your compliance score: ${data.baselineScore}%`,
      });
      setCurrentStep(5);
    },
  });

  // Setup team
  const setupTeamMutation = useMutation({
    mutationFn: async () => {
      return await trpc.onboarding.setupTeam.mutate({
        sessionId,
        teamMembers: teamMembers.map((m) => ({
          email: m.email,
          role: m.role as any,
        })),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Onboarding Complete!',
        description: 'Your organization is ready to go',
      });
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    },
  });

  // Fetch frameworks
  const { data: frameworks } = useQuery({
    queryKey: ['availableFrameworks'],
    queryFn: async () => {
      return await trpc.onboarding.getAvailableFrameworks.query({});
    },
  });

  // Fetch baseline questions
  const { data: baselineQuestions } = useQuery({
    queryKey: ['baselineQuestions'],
    queryFn: async () => {
      return await trpc.onboarding.getBaselineQuestions.query({});
    },
  });

  // Initialize onboarding
  useEffect(() => {
    if (!sessionId) {
      startOnboardingMutation.mutate();
    }
  }, []);

  const handleAddAiSystem = () => {
    if (newSystem.name && newSystem.type && newSystem.riskLevel) {
      setAiSystems([...aiSystems, newSystem]);
      setNewSystem({ name: '', type: '', riskLevel: '' });
    }
  };

  const handleAddTeamMember = () => {
    if (newMember.email && newMember.role) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember({ email: '', role: '' });
    }
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Enterprise Onboarding</h1>
          <p className="text-gray-600 mt-2">Set up your organization in 5 easy steps</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 5</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Company Information'}
              {currentStep === 2 && 'Select Compliance Frameworks'}
              {currentStep === 3 && 'Map Your AI Systems'}
              {currentStep === 4 && 'Compliance Baseline Assessment'}
              {currentStep === 5 && 'Setup Your Team'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your organization'}
              {currentStep === 2 && 'Choose which compliance frameworks apply to you'}
              {currentStep === 3 && 'Register your AI systems'}
              {currentStep === 4 && 'Answer questions to establish your baseline'}
              {currentStep === 5 && 'Invite team members to collaborate'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Company Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme AI Corp"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger id="company-size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup (1-50)</SelectItem>
                      <SelectItem value="small">Small (51-250)</SelectItem>
                      <SelectItem value="medium">Medium (251-1000)</SelectItem>
                      <SelectItem value="large">Large (1001-5000)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (5000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger id="jurisdiction">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CN">China</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Frameworks */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {frameworks?.frameworks?.map((framework: any) => (
                  <div key={framework.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={`framework-${framework.id}`}
                      checked={selectedFrameworks.includes(framework.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFrameworks([...selectedFrameworks, framework.id]);
                        } else {
                          setSelectedFrameworks(selectedFrameworks.filter((id) => id !== framework.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`framework-${framework.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {framework.name}
                      </label>
                      <p className="text-sm text-gray-600">{framework.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: AI Systems */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {aiSystems.length > 0 && (
                  <div className="space-y-2">
                    {aiSystems.map((system, idx) => (
                      <div key={idx} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{system.name}</p>
                          <p className="text-sm text-gray-600">{system.type} • {system.riskLevel} risk</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiSystems(aiSystems.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium">Add AI System</h4>
                  <Input
                    placeholder="System name"
                    value={newSystem.name}
                    onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                  />
                  <Select value={newSystem.type} onValueChange={(v) => setNewSystem({ ...newSystem, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatbot">Chatbot</SelectItem>
                      <SelectItem value="recommendation">Recommendation Engine</SelectItem>
                      <SelectItem value="classification">Classification</SelectItem>
                      <SelectItem value="generation">Content Generation</SelectItem>
                      <SelectItem value="analysis">Data Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newSystem.riskLevel} onValueChange={(v) => setNewSystem({ ...newSystem, riskLevel: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal Risk</SelectItem>
                      <SelectItem value="limited">Limited Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddAiSystem} className="w-full">
                    Add System
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Baseline Assessment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {baselineQuestions?.questions?.map((question: any) => (
                  <div key={question.id} className="space-y-2">
                    <Label>{question.question}</Label>
                    <Select
                      value={assessmentAnswers[question.id] || ''}
                      onValueChange={(v) =>
                        setAssessmentAnswers({ ...assessmentAnswers, [question.id]: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="partial">Partially</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Team Setup */}
            {currentStep === 5 && (
              <div className="space-y-4">
                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium">Add Team Member</h4>
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                  <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddTeamMember} className="w-full">
                    Add Member
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={() => {
                  if (currentStep === 1) submitCompanyInfoMutation.mutate();
                  else if (currentStep === 2) selectFrameworksMutation.mutate();
                  else if (currentStep === 3) mapAISystemsMutation.mutate();
                  else if (currentStep === 4) submitBaselineMutation.mutate();
                  else if (currentStep === 5) setupTeamMutation.mutate();
                }}
                disabled={
                  submitCompanyInfoMutation.isPending ||
                  selectFrameworksMutation.isPending ||
                  mapAISystemsMutation.isPending ||
                  submitBaselineMutation.isPending ||
                  setupTeamMutation.isPending
                }
                className="flex-1"
              >
                {currentStep === 5 ? 'Complete Onboarding' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
