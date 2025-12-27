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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

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

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { label: "Certified Analysts", value: "2,400+" },
              { label: "AI Systems Audited", value: "890+" },
              { label: "Countries Covered", value: "120+" },
              { label: "Avg Analyst Earnings", value: "$6,000/mo" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What We've Built</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A complete AI safety ecosystem that combines training, certification, employment, and global governance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "33-Agent Byzantine Council",
                description:
                  "An impartial voting system of 33 AI and human experts that makes compliance decisions using Byzantine fault-tolerant consensus. Impossible to bias or manipulate.",
                features: ["Tamper-proof voting", "Multi-provider AI agents", "Human expert oversight", "Public audit trail"],
              },
              {
                title: "The Watchdog Program",
                description:
                  "Public incident reporting system where anyone can anonymously report AI safety concerns. Investigated by certified analysts and reviewed by the Council.",
                features: ["Anonymous reporting", "Public database", "Analyst investigation", "Council review"],
              },
              {
                title: "SOAI-PDCA Framework",
                description:
                  "Combines Safety Oversight AI with the Deming Cycle for continuous AI governance improvement. Plan → Do → Check → Act, powered by the Council.",
                features: ["Continuous improvement", "Deming methodology", "Council oversight", "Automated workflows"],
              },
              {
                title: "Multi-Framework Compliance",
                description:
                  "Single platform for EU AI Act, NIST AI RMF, ISO 42001, and TC260 compliance. Assess once, report to all regulators.",
                features: ["4 global frameworks", "Single assessment", "Multi-report export", "Regulatory ready"],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-lg p-8 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
                title: "🛡️ Protects Humanity from AI Risks",
                description:
                  "AI systems are becoming more powerful and harder to understand. CSOAI provides independent oversight through certified analysts and the 33-Agent Council, catching safety issues before they harm people.",
              },
              {
                title: "💼 Creates High-Paying Jobs",
                description:
                  "AI Safety Analysts are projected to be a top-10 job by 2045. CSOAI trains people from any background, certifies their expertise, and connects them to $45-150/hour work—democratizing access to this emerging profession.",
              },
              {
                title: "✅ Ensures Regulatory Compliance",
                description:
                  "The EU AI Act enforcement deadline is Feb 2, 2026. CSOAI helps enterprises and governments meet compliance requirements across all major frameworks, avoiding fines and legal liability.",
              },
              {
                title: "🗳️ Builds Democratic AI Governance",
                description:
                  "Instead of letting AI companies regulate themselves, CSOAI creates independent, transparent, impartial governance. The 33-Agent Council ensures no single entity can control AI safety decisions.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-8 border border-emerald-200"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-700">{item.description}</p>
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
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Find Your Path</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether you're an individual, enterprise, government, or researcher, CSOAI has a solution for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                audience: "👤 Individuals",
                title: "Become an AI Safety Analyst",
                description: "Free training, certification, and $45-150/hour jobs. No prior experience required.",
                cta: "Start Training",
                link: "/training",
                color: "from-blue-500 to-blue-600",
              },
              {
                audience: "🏢 Enterprises",
                title: "Ensure Compliance & Reduce Risk",
                description: "Multi-framework compliance assessments, continuous monitoring, and audit support.",
                cta: "Get Started",
                link: "/enterprise",
                color: "from-purple-500 to-purple-600",
              },
              {
                audience: "🏛️ Governments",
                title: "Regulatory Authority Portal",
                description: "Real-time AI system compliance monitoring, enforcement tracking, and trend analysis.",
                cta: "Learn More",
                link: "/government-portal",
                color: "from-amber-500 to-amber-600",
              },
              {
                audience: "🔬 Researchers",
                title: "Public API & Data Access",
                description: "Access anonymized incident data, voting patterns, and compliance trends for research.",
                cta: "Explore API",
                link: "/api-docs",
                color: "from-green-500 to-green-600",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${item.color} rounded-lg p-8 text-white`}
              >
                <div className="text-3xl mb-2">{item.audience}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/90 mb-6 text-sm">{item.description}</p>
                <Link href={item.link}>
                  <Button size="sm" variant="secondary" className="w-full">
                    {item.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence & How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Evidence & Proof</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              CSOAI is built on transparent, verifiable systems. All decisions, votes, and incident reports are public and auditable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Public Watchdog Database",
                description: "Browse thousands of publicly reported AI safety incidents. See real-world AI risks and how they're being addressed.",
                link: "/watchdog-hub",
              },
              {
                title: "Council Voting Records",
                description: "View all 33-Agent Council voting sessions, decisions, and confidence scores. Complete transparency in AI governance.",
                link: "/council-voting",
              },
              {
                title: "Compliance Scorecards",
                description: "See how AI systems are performing across EU AI Act, NIST, ISO 42001, and TC260 frameworks. Benchmark against peers.",
                link: "/compliance-scorecards",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-slate-50 rounded-lg p-8 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 mb-6">{item.description}</p>
                <Link href={item.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about CEASAI, CSOAI, and how to get started.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 text-left">{item.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-600 transition-transform ${
                      expandedFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4 border-t border-gray-200 bg-slate-50"
                  >
                    <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Join the AI Safety Revolution?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Start your free CEASAI training today. No credit card required. Join thousands of analysts building the future of AI governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Start Free Training <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/training"><a className="hover:text-white">Training</a></Link></li>
                <li><Link href="/certification"><a className="hover:text-white">Certification</a></Link></li>
                <li><Link href="/jobs"><a className="hover:text-white">Jobs</a></Link></li>
                <li><Link href="/enterprise"><a className="hover:text-white">Enterprise</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about"><a className="hover:text-white">About</a></Link></li>
                <li><Link href="/blog"><a className="hover:text-white">Blog</a></Link></li>
                <li><Link href="/careers"><a className="hover:text-white">Careers</a></Link></li>
                <li><Link href="/contact"><a className="hover:text-white">Contact</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/api-docs"><a className="hover:text-white">API Docs</a></Link></li>
                <li><Link href="/watchdog-hub"><a className="hover:text-white">Watchdog</a></Link></li>
                <li><Link href="/council-voting"><a className="hover:text-white">Council</a></Link></li>
                <li><Link href="/standards"><a className="hover:text-white">Standards</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 CSOAI - The Global Standard for AI Safety. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
