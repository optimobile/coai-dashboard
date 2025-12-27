/**
 * Advisory Board Recruitment Portal
 * Tier 1 recruitment for Chair, Regulatory Expert, and Academic Expert positions
 * Q1 2026 launch preparation
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Briefcase,
  Award,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdvisoryBoard() {
  const [selectedRole, setSelectedRole] = useState<"chair" | "regulatory" | "academic">("chair");

  const roles = {
    chair: {
      title: "Board Chair",
      icon: "👑",
      description: "Lead the CEASAI Advisory Board and shape AI safety policy globally",
      commitment: "4-6 hours/month",
      term: "2-year term",
      responsibilities: [
        "Chair quarterly board meetings",
        "Represent CEASAI at industry conferences",
        "Advise on strategic direction and policy",
        "Lead board committees and initiatives",
        "Mentor other board members",
        "Represent CEASAI in media and regulatory forums",
      ],
      qualifications: [
        "15+ years in AI, regulatory, or academic leadership",
        "Proven track record in policy influence",
        "Strong network in AI safety and compliance",
        "Executive-level experience",
        "Commitment to AI safety mission",
      ],
      benefits: [
        "Equity allocation in CEASAI",
        "Board honorarium",
        "Speaking opportunities at major conferences",
        "Influence on global AI safety standards",
        "Access to CEASAI network and resources",
      ],
      timeline: "Application → Interview (2 weeks) → Board Vote (1 week) → Onboarding (2 weeks)",
    },
    regulatory: {
      title: "Regulatory Expert",
      icon: "⚖️",
      description: "Shape AI compliance frameworks and regulatory strategy",
      commitment: "3-5 hours/month",
      term: "2-year term",
      responsibilities: [
        "Advise on EU AI Act compliance",
        "Review and update certification standards",
        "Contribute to regulatory strategy",
        "Mentor junior analysts",
        "Participate in policy working groups",
        "Review case studies and incident reports",
      ],
      qualifications: [
        "10+ years in regulatory compliance or legal",
        "Deep expertise in EU AI Act or similar frameworks",
        "Experience with AI systems regulation",
        "Strong analytical and writing skills",
        "Commitment to evidence-based policy",
      ],
      benefits: [
        "Equity allocation in CEASAI",
        "Board honorarium",
        "Co-authorship on published research",
        "Access to confidential incident reports",
        "Professional development opportunities",
      ],
      timeline: "Application → Technical Interview (1 week) → Board Review (1 week) → Onboarding (2 weeks)",
    },
    academic: {
      title: "Academic Expert",
      icon: "🎓",
      description: "Drive research and curriculum development in AI safety",
      commitment: "2-4 hours/month",
      term: "2-year term",
      responsibilities: [
        "Develop and review course curriculum",
        "Conduct AI safety research",
        "Publish peer-reviewed papers",
        "Mentor certification candidates",
        "Contribute to learning outcomes design",
        "Present at academic conferences",
      ],
      qualifications: [
        "PhD in Computer Science, AI, Ethics, or related field",
        "5+ years of academic research in AI safety",
        "Published research in top-tier venues",
        "Teaching experience",
        "Passion for AI safety education",
      ],
      benefits: [
        "Equity allocation in CEASAI",
        "Research funding opportunities",
        "Access to CEASAI data for research",
        "Co-authorship on publications",
        "Speaking platform at industry events",
      ],
      timeline: "Application → Research Interview (1 week) → Board Review (1 week) → Onboarding (2 weeks)",
    },
  };

  const role = roles[selectedRole];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white py-24">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="mx-auto bg-white/20 text-white border-white/30 text-base px-4 py-1">
              <Award className="w-4 h-4 mr-2 inline" />
              Join Our Leadership
            </Badge>
            <h1 className="text-6xl font-bold leading-tight">
              CEASAI Advisory Board
            </h1>
            <p className="text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Shape the future of AI safety. Join leading experts in regulatory policy, academic research, and industry leadership.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-purple-300" />
                <span>Tier 1 Recruitment - Q1 2026</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-purple-300" />
                <span>Global Impact</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-purple-300" />
                <span>Equity Opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16 border-b border-purple-200">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Recruitment Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { month: "Jan 2026", title: "Outreach", desc: "Identify & contact candidates" },
              { month: "Feb 2026", title: "Interviews", desc: "Technical & strategic interviews" },
              { month: "Mar 2026", title: "Board Vote", desc: "Final approval & selection" },
              { month: "Apr 2026", title: "Launch", desc: "Board officially convenes" },
            ].map((phase, idx) => (
              <div key={idx} className="relative">
                <Card className="p-6 text-center border-2 border-purple-200">
                  <div className="text-sm font-semibold text-purple-600 mb-2">{phase.month}</div>
                  <h3 className="font-bold text-lg mb-2">{phase.title}</h3>
                  <p className="text-sm text-gray-600">{phase.desc}</p>
                </Card>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-purple-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div className="container max-w-6xl py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Available Positions</h2>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(roles).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedRole(key as any)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                selectedRole === key
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-400"
              }`}
            >
              <span className="mr-2">{value.icon}</span>
              {value.title}
            </button>
          ))}
        </div>

        {/* Role Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <Card className="p-12 border-2 border-purple-200 shadow-xl">
              <div className="mb-8">
                <div className="text-6xl mb-4">{role.icon}</div>
                <h3 className="text-4xl font-bold mb-4">{role.title}</h3>
                <p className="text-xl text-gray-600 mb-6">{role.description}</p>

                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{role.commitment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">{role.term}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="responsibilities" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                  <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>

                <TabsContent value="responsibilities" className="mt-6 space-y-4">
                  {role.responsibilities.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="qualifications" className="mt-6 space-y-4">
                  {role.qualifications.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="benefits" className="mt-6 space-y-4">
                  {role.benefits.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-gray-600 mb-2">Application Timeline</p>
                <p className="text-gray-900 font-semibold">{role.timeline}</p>
              </div>
            </Card>
          </div>

          {/* Sidebar - Application Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-24 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Ready to Apply?</h3>

              <div className="space-y-4 mb-8">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Position</p>
                  <p className="text-lg font-bold text-purple-600">{role.title}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Application Status</p>
                  <Badge className="bg-green-100 text-green-700">Open - Apply Now</Badge>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base font-semibold mb-4">
                Start Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="space-y-3 pt-6 border-t text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>~15 min application</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Technical interview</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Board decision</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="commitment" className="border-2 border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How much time does this require?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-4">
                Board members typically commit 2-6 hours per month, depending on the role. This includes quarterly meetings, committee work, and strategic initiatives. We're flexible with scheduling to accommodate your other commitments.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="equity" className="border-2 border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What equity allocation is offered?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-4">
                Equity allocations vary by role and are determined during the offer process. Chair positions typically receive 0.5-1%, Regulatory Experts 0.25-0.5%, and Academic Experts 0.1-0.25%. All allocations are subject to vesting schedules.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="term" className="border-2 border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What's the term length?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-4">
                All board positions are 2-year terms with the option to renew. We believe this provides enough time to make meaningful contributions while allowing for fresh perspectives and new board members.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="remote" className="border-2 border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Can I serve remotely?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-4">
                Yes! All board positions are fully remote. We hold quarterly in-person summits (optional but encouraged) in major cities. All meetings are conducted virtually to accommodate global participation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience" className="border-2 border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Do I need AI safety experience?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 pt-4">
                We're looking for deep expertise in your domain (regulatory, academic, or executive leadership). AI safety knowledge is valuable but not required—we'll provide onboarding and resources to get you up to speed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Shape the Future of AI Safety</h2>
          <p className="text-xl text-purple-100 mb-10">
            Join a global network of experts committed to making AI systems safer and more trustworthy.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Apply for Advisory Board
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
