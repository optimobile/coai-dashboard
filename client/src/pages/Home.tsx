/*
 * CSOAI Home Page - Comprehensive Platform Overview
 * Explains CEASAI→CSOAI pipeline, audience-specific CTAs, and detailed FAQ
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  ChevronDown,
  Users,
  Briefcase,
  Building2,
  Globe,
  Award,
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  BookOpen,
  Zap,
  Eye,
  Network,
  Layers,
  Gauge,
  Code,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { FeatureShowcase } from "@/components/FeatureShowcase";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is CEASAI and how does it relate to CSOAI?",
    answer:
      "CEASAI (Certified EU AI Safety Analyst) is our professional certification program that trains individuals to become AI Safety Analysts. CSOAI (Council of AI Safety) is the global regulatory authority that oversees AI safety governance, uses CEASAI-certified analysts for incident investigation, and maintains the 33-Agent Byzantine Council for impartial AI system audits. CEASAI is the training pipeline; CSOAI is the regulatory framework.",
  },
  {
    question: "How long does it take to become a CEASAI-certified analyst?",
    answer:
      "The CEASAI Fundamentals course takes 6-8 weeks of part-time study (10-15 hours per week). The Professional certification adds 12 weeks, and the Expert level adds another 16 weeks. Most people start with Fundamentals while working their current job, then transition to full-time analyst work after certification.",
  },
  {
    question: "What is the 33-Agent Byzantine Council and why does it matter?",
    answer:
      "The 33-Agent Byzantine Council is a system of 33 independent AI and human experts that votes on AI system compliance decisions using Byzantine fault-tolerant consensus. This means that even if some agents are compromised or biased, the system still produces fair, impartial decisions. It's the same technology used in blockchain and military systems—designed to be tamper-proof and unbiased.",
  },
  {
    question: "How much can I earn as an AI Safety Analyst?",
    answer:
      "Entry-level analysts earn $45/hour ($3,600/month full-time). Experienced analysts earn $75/hour ($6,000/month), and expert analysts earn $150/hour ($12,000/month). Most analysts work remotely and choose their own hours. With referral bonuses and performance incentives, top analysts earn $15,000+ per month.",
  },
  {
    question: "What frameworks does CSOAI compliance cover?",
    answer:
      "CSOAI provides compliance assessment and certification across four major frameworks: EU AI Act (mandatory in Europe by Feb 2, 2026), NIST AI Risk Management Framework (US standard), ISO 42001 (international AI management systems), and TC260 (China's AI safety standards). Our multi-framework approach ensures your AI systems are compliant globally.",
  },
  {
    question: "How does the Watchdog program work?",
    answer:
      "The Watchdog is CSOAI's public incident reporting system where anyone can anonymously report AI safety concerns. Submitted reports are reviewed by CEASAI-certified analysts, investigated by the 33-Agent Council, and tracked in our public database. This creates transparency around AI incidents and helps identify systemic safety issues.",
  },
  {
    question: "What is SOAI-PDCA and how does it help my organization?",
    answer:
      "SOAI-PDCA combines Safety Oversight AI (our 33-Agent Council) with the Deming Cycle (Plan-Do-Check-Act) methodology. It provides a continuous improvement framework for AI governance. Your organization plans compliance measures, implements them, the Council checks for violations, and you act on findings—creating a perpetual cycle of improvement.",
  },
  {
    question: "Can I integrate CSOAI with my existing compliance tools?",
    answer:
      "Yes! CSOAI provides REST APIs, webhooks, and SDKs for Python and JavaScript. You can integrate our compliance assessments into your CI/CD pipeline, connect to your SIEM/SOAR platforms, and receive real-time alerts for compliance violations. Enterprise plans include dedicated integration support.",
  },
  {
    question: "What happens if my AI system fails a compliance assessment?",
    answer:
      "If your system fails assessment, you receive a detailed report identifying specific violations, risk levels, and remediation recommendations. You have 30 days to address critical issues or 90 days for high-priority items. The 33-Agent Council provides impartial review of your remediation efforts, and you can retest after fixes.",
  },
  {
    question: "Is CSOAI certification mandatory?",
    answer:
      "Certification is mandatory in the EU for high-risk AI systems starting Feb 2, 2026 (EU AI Act enforcement). In other regions, it's currently voluntary but increasingly required by regulators and enterprises. We expect global mandates within 2-3 years as AI regulation accelerates worldwide.",
  },
  {
    question: "How do you ensure the 33-Agent Council is truly unbiased?",
    answer:
      "The Council uses Byzantine fault-tolerant consensus, meaning 22 out of 33 agents must agree on a decision. We rotate agents across 5 different AI providers (OpenAI, Anthropic, Google, Kimi, DeepSeek) and include human experts to prevent any single entity from controlling outcomes. All voting records are public and auditable.",
  },
  {
    question: "What makes CSOAI different from other AI compliance platforms?",
    answer:
      "CSOAI is unique because: (1) We're vendor-independent—no conflicts of interest, (2) We use Byzantine consensus for truly impartial decisions, (3) We create jobs for analysts while providing oversight, (4) We're transparent—all reports are public, (5) We cover all major global frameworks, (6) We're building the global standard for AI safety governance.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              The Global Standard for{" "}
              <span className="text-emerald-600">AI Safety</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Train to become an AI Safety Analyst. Get certified. Earn $45-150/hour. Help protect humanity from AI risks while building a career in the fastest-growing profession.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Start Free Training <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-4 w-4" /> Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Core Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore the complete AI safety ecosystem built to protect humanity while creating meaningful careers.
            </p>
          </motion.div>

          {/* 33-Agent Council Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-8 border border-emerald-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Network className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">33-Agent Byzantine Council</h3>
                <p className="text-slate-700 mb-4">
                  An impartial voting system of 33 independent AI and human experts that makes compliance decisions using Byzantine fault-tolerant consensus. Impossible to bias or manipulate—the same technology used in blockchain and military systems.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {["Tamper-proof voting", "Multi-provider AI", "Human oversight", "Public audit trail"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/council">
                  <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Explore Council <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Watchdog Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-8 border border-blue-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Eye className="h-12 w-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">The Watchdog Program</h3>
                <p className="text-slate-700 mb-4">
                  Public incident reporting system where anyone can anonymously report AI safety concerns. Investigated by certified analysts and reviewed by the Council. Creates transparency around AI incidents and identifies systemic safety issues.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {["Anonymous reporting", "Public database", "Analyst investigation", "Council review"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/watchdog">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    View Watchdog <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* SOAI-PDCA Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Layers className="h-12 w-12 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">SOAI-PDCA Framework</h3>
                <p className="text-slate-700 mb-4">
                  Combines Safety Oversight AI with the Deming Cycle for continuous AI governance improvement. Plan → Do → Check → Act, powered by the Council. Creates a perpetual cycle of improvement for your AI systems.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {["Continuous improvement", "Deming methodology", "Council oversight", "Automated workflows"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/soai-pdca">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    Learn SOAI-PDCA <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Multi-Framework Compliance Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Gauge className="h-12 w-12 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Multi-Framework Compliance</h3>
                <p className="text-slate-700 mb-4">
                  Single platform for EU AI Act, NIST AI RMF, ISO 42001, and TC260 compliance. Assess once, report to all regulators. Ensure your AI systems are compliant globally across all major frameworks.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {["4 global frameworks", "Single assessment", "Multi-report export", "Regulatory ready"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/compliance">
                  <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                    Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Training & Certification Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border border-green-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <BookOpen className="h-12 w-12 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Training & Certification</h3>
                <p className="text-slate-700 mb-4">
                  Professional certification program covering EU AI Act, NIST RMF, ISO 42001, and TC260. Learn at your own pace, pass the rigorous exam, and earn credentials recognized globally. Start your career as an AI Safety Analyst.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {["Expert instructors", "Rigorous exams", "Global recognition", "Career support"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/training">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Explore Training <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Enterprise API Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-8 border border-slate-200"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Code className="h-12 w-12 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Enterprise API & Integration</h3>
                <p className="text-slate-700 mb-4">
                  REST APIs, webhooks, and SDKs for Python and JavaScript. Integrate compliance assessments into your CI/CD pipeline, connect to SIEM/SOAR platforms, and receive real-time alerts for compliance violations. Enterprise plans include dedicated integration support.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {["REST APIs", "Webhooks", "SDKs", "Real-time alerts"].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-slate-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/api-docs">
                  <Button variant="outline" className="border-slate-600 text-slate-600 hover:bg-slate-50">
                    View API Docs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Pipeline: CEASAI → CSOAI */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works: The CEASAI → CSOAI Pipeline</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've built a complete ecosystem that trains analysts, certifies their expertise, employs them to audit AI systems, and uses their insights to build the global AI safety standard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                step: "1",
                title: "CEASAI Training",
                description: "Free online courses covering EU AI Act, NIST RMF, ISO 42001, and TC260 standards. Learn at your own pace while working.",
                icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: "2",
                title: "Certification Exam",
                description: "Pass the rigorous 50-question exam (70% required). Proctored with AI integrity detection to ensure credential value.",
                icon: <Award className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: "3",
                title: "Analyst Jobs",
                description: "Join the Watchdog program or work directly with enterprises. Audit AI systems, investigate incidents, earn $45-150/hour.",
                icon: <Briefcase className="h-8 w-8 text-emerald-600" />,
              },
              {
                step: "4",
                title: "CSOAI Authority",
                description: "Your audit findings feed into the 33-Agent Council, which votes on compliance decisions. Help shape global AI governance.",
                icon: <Globe className="h-8 w-8 text-emerald-600" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-slate-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600">
                    {item.step}
                  </div>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We've Built */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose CSOAI</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We're building the global standard for AI safety governance with transparency, independence, and democratic decision-making at our core.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Vendor-Independent",
                description:
                  "We have no conflicts of interest. Unlike compliance platforms owned by AI vendors, we're independent and serve all stakeholders equally.",
                icon: <Lock className="h-8 w-8 text-emerald-600" />,
              },
              {
                title: "Truly Impartial Decisions",
                description:
                  "Byzantine consensus means 22 out of 33 agents must agree. Impossible to bias or manipulate—the same technology used in blockchain.",
                icon: <Shield className="h-8 w-8 text-emerald-600" />,
              },
              {
                title: "Creates Meaningful Jobs",
                description:
                  "We're not just building compliance tools—we're creating a career path for thousands of AI Safety Analysts earning $45-150/hour.",
                icon: <Briefcase className="h-8 w-8 text-emerald-600" />,
              },
              {
                title: "Complete Transparency",
                description:
                  "All incident reports are public. All council votes are auditable. All compliance decisions are documented. No hidden agendas.",
                icon: <Eye className="h-8 w-8 text-emerald-600" />,
              },
              {
                title: "Global Framework Coverage",
                description:
                  "Single platform for EU AI Act, NIST RMF, ISO 42001, and TC260. Assess once, comply everywhere.",
                icon: <Globe className="h-8 w-8 text-emerald-600" />,
              },
              {
                title: "Building the Global Standard",
                description:
                  "We're creating the equivalent of the FAA for AI—a trusted, independent authority that regulators and enterprises can rely on.",
                icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="bg-white rounded-lg p-8 border border-gray-200"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Helps Society */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Helps Society</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              CSOAI solves four critical problems simultaneously: protecting humanity from AI risks, creating meaningful jobs, ensuring regulatory compliance, and building democratic AI governance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Protects Humanity from AI Risks",
                description:
                  "The Watchdog program surfaces AI safety issues before they become crises. The 33-Agent Council ensures impartial review. Continuous PDCA cycles prevent systemic failures.",
                icon: <Shield className="h-8 w-8 text-red-600" />,
              },
              {
                title: "Creates High-Quality Jobs",
                description:
                  "AI Safety Analyst is projected to be a top-10 job by 2045. We're creating 10,000+ positions globally, paying $45-150/hour, mostly remote. Career growth path from Fundamentals → Professional → Expert → Advisory Board.",
                icon: <Briefcase className="h-8 w-8 text-green-600" />,
              },
              {
                title: "Ensures Regulatory Compliance",
                description:
                  "EU AI Act enforcement starts Feb 2, 2026. NIST RMF is US standard. ISO 42001 is international. TC260 is China's requirement. We provide single platform for all four.",
                icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
              },
              {
                title: "Builds Democratic AI Governance",
                description:
                  "No single company controls AI safety decisions. The 33-Agent Council includes diverse AI providers and human experts. All decisions are public. Regulators have real-time visibility.",
                icon: <Users className="h-8 w-8 text-purple-600" />,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-slate-50 rounded-lg p-8 border border-gray-200"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience-Specific CTAs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What's Your Role?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your path and get started today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Individual",
                description: "Become an AI Safety Analyst",
                details: "Learn compliance frameworks, pass certification, earn $45-150/hour investigating AI safety incidents.",
                cta: "Start Training",
                href: "/training",
                color: "emerald",
              },
              {
                title: "Enterprise",
                description: "Ensure AI Compliance",
                details: "Audit your AI systems across EU AI Act, NIST, ISO 42001, and TC260. Get certified and stay compliant.",
                cta: "Start Assessment",
                href: "/compliance",
                color: "blue",
              },
              {
                title: "Government",
                description: "Monitor AI Safety",
                details: "Real-time compliance visibility across your jurisdiction. Access to Watchdog incident database and council decisions.",
                cta: "Government Portal",
                href: "/government-portal",
                color: "purple",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-lg p-8 border border-gray-200"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className={`text-lg font-semibold text-${item.color}-600 mb-4`}>{item.description}</p>
                <p className="text-slate-600 mb-6">{item.details}</p>
                <Link href={item.href}>
                  <Button className={`w-full bg-${item.color}-600 hover:bg-${item.color}-700`}>
                    {item.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">
              Have questions? We've got answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-slate-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <span className="font-semibold text-slate-900 text-left">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-600 transition-transform ${
                      expandedFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the AI Safety Movement?</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Whether you want to become an analyst, ensure compliance, or oversee AI safety—CSOAI is your platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Start Free Training <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
