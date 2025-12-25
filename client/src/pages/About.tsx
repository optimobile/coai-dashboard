import { Users, Target, Shield, Globe, Award, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function About() {
  const advisoryBoard = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief AI Ethics Officer",
      organization: "Stanford University",
      expertise: "AI Ethics & Governance",
      initials: "SC",
    },
    {
      name: "Prof. Michael Roberts",
      role: "Director, AI Safety Institute",
      organization: "MIT",
      expertise: "Technical AI Safety",
      initials: "MR",
    },
    {
      name: "Dr. Aisha Patel",
      role: "Senior Policy Advisor",
      organization: "OECD",
      expertise: "International AI Policy",
      initials: "AP",
    },
    {
      name: "James Liu",
      role: "Former CTO",
      organization: "OpenAI",
      expertise: "AI Systems Architecture",
      initials: "JL",
    },
    {
      name: "Dr. Elena Volkov",
      role: "Lead Researcher",
      organization: "DeepMind",
      expertise: "AI Alignment",
      initials: "EV",
    },
    {
      name: "Prof. David Kim",
      role: "Chair, AI Standards Committee",
      organization: "ISO/IEC JTC 1/SC 42",
      expertise: "AI Standardization",
      initials: "DK",
    },
  ];

  const partners = [
    { name: "European Commission", type: "Regulatory Partner" },
    { name: "NIST", type: "Standards Partner" },
    { name: "ISO/IEC", type: "Certification Partner" },
    { name: "IEEE", type: "Technical Partner" },
    { name: "OECD", type: "Policy Partner" },
    { name: "Partnership on AI", type: "Industry Partner" },
  ];

  const milestones = [
    { year: "2024 Q1", event: "COAI Framework v1.0 Published", description: "Released Western equivalent to TC260" },
    { year: "2024 Q2", event: "33-Agent Council Launched", description: "Byzantine consensus mechanism deployed" },
    { year: "2024 Q3", event: "Watchdog System Activated", description: "Public oversight platform operational" },
    { year: "2024 Q4", event: "1,000+ AI Systems Registered", description: "Reached first major adoption milestone" },
    { year: "2025 Q1", event: "ISO/IEC 42001 Alignment", description: "Achieved full compliance certification" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">About COAI</Badge>
            <h1 className="text-5xl font-bold mb-6">Council of AI</h1>
            <p className="text-2xl text-blue-100 mb-8">
              The Western Standard for AI Safety Governance
            </p>
            <p className="text-lg text-blue-200">
              Established in 2024, the Council of AI (COAI) provides a comprehensive framework for AI safety
              governance, serving as the Western equivalent to China's TC260. We combine Byzantine consensus,
              public oversight, and continuous improvement to ensure responsible AI development.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 text-center">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Mission</h3>
            <p className="text-muted-foreground">
              Establish global standards for AI safety governance through decentralized consensus
              and public transparency, ensuring responsible AI development that serves humanity.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Vision</h3>
            <p className="text-muted-foreground">
              A world where AI systems are developed and deployed with rigorous safety oversight,
              continuous improvement, and accountability to the global community.
            </p>
          </Card>

          <Card className="p-8 text-center">
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Values</h3>
            <p className="text-muted-foreground">
              Transparency, decentralization, continuous improvement, public accountability,
              and alignment with international AI safety standards.
            </p>
          </Card>
        </div>

        {/* Advisory Board */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Advisory Board</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advisory board comprises leading experts in AI safety, ethics, policy, and technical standards
              from top institutions worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {advisoryBoard.map((member, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                    <p className="text-sm font-medium text-primary mb-2">{member.organization}</p>
                    <Badge variant="outline" className="text-xs">{member.expertise}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Strategic Partners</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We collaborate with leading international organizations to align AI governance standards globally.
            </p>
          </div>

          <Card className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {partners.map((partner, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                    <p className="text-sm text-muted-foreground">{partner.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Milestones */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Key Milestones</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our journey to becoming the leading AI safety governance platform.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />

            {/* Milestone Cards */}
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <Card className={`flex-1 p-6 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Badge className="mb-2">{milestone.year}</Badge>
                    <h4 className="font-semibold text-lg mb-2">{milestone.event}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </Card>

                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  </div>

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recognition */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Recognition & Certifications</h3>
              <p className="text-muted-foreground mb-4">
                COAI is recognized by international standards bodies and has achieved certifications
                from ISO/IEC, NIST, and the European Commission for AI governance excellence.
              </p>
              <div className="flex gap-3">
                <Badge variant="outline">ISO/IEC 42001 Certified</Badge>
                <Badge variant="outline">NIST AI RMF Aligned</Badge>
                <Badge variant="outline">EU AI Act Compliant</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
