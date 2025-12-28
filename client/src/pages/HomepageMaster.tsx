import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConversionModals } from '@/components/ConversionModals';
import {
  ChevronDown,
  Users,
  Shield,
  Zap,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Briefcase,
  Heart,
} from 'lucide-react';

export default function HomepageMaster() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'loi' | 'course' | 'enterprise' | 'government' | 'watchdog' | null>(null);

  const openModal = (type: 'loi' | 'course' | 'enterprise' | 'government' | 'watchdog') => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="w-full bg-white">
      {/* ============================================
          SECTION 1: HERO
          ============================================ */}
      <section className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI is Growing.
              <br />
              <span className="text-emerald-600">Humanity Needs Oversight.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            The first platform that creates jobs, ensures compliance, and protects people—all at once. We've built the infrastructure for safe, transparent AI governance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button onClick={() => openModal('loi')} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
              Get Free Course + Early Access
            </Button>
            <Button onClick={() => openModal('enterprise')} size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg">
              Enterprise Compliance
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm text-gray-500 mb-8"
          >
            Join 10,000+ early adopters • First 10,000 get free $499 course • EU AI Act enforcement: Feb 2, 2025
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center"
          >
            <ChevronDown className="w-8 h-8 text-emerald-600 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: FOUR PROBLEMS → FOUR SOLUTIONS
          ============================================ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Four Problems. One Ecosystem.</h2>
            <p className="text-xl text-gray-600">We're fixing AI safety by integrating public, AI companies, governments, and training certification.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problem 1 */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-lg border border-red-200">
              <div className="flex items-start gap-4 mb-4">
                <Briefcase className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Problem 1: AI is Taking Jobs</h3>
                  <p className="text-gray-700 mb-4">AI automation is displacing workers, but AI safety requires human expertise.</p>
                  <div className="bg-white p-4 rounded border-l-4 border-red-600">
                    <p className="font-semibold text-gray-900 mb-2">Our Solution: Create 10,000+ AI Safety Analyst Jobs</p>
                    <p className="text-gray-600">$45-150/hr • Remote work • Meaningful careers protecting humanity</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Problem 2 */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg border border-orange-200">
              <div className="flex items-start gap-4 mb-4">
                <Shield className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Problem 2: AI Systems Lack Human Oversight</h3>
                  <p className="text-gray-700 mb-4">AI decisions affect millions of lives, but oversight is fragmented and ineffective.</p>
                  <div className="bg-white p-4 rounded border-l-4 border-orange-600">
                    <p className="font-semibold text-gray-900 mb-2">Our Solution: 33-Agent Byzantine Council</p>
                    <p className="text-gray-600">AI experts + human analysts • Impartial voting • Vendor-independent decisions</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Problem 3 */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-4 mb-4">
                <Zap className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Problem 3: AI Compliance is Fragmented</h3>
                  <p className="text-gray-700 mb-4">EU AI Act, NIST RMF, TC260, ISO 42001—companies struggle to stay compliant.</p>
                  <div className="bg-white p-4 rounded border-l-4 border-yellow-600">
                    <p className="font-semibold text-gray-900 mb-2">Our Solution: SOAI-PDCA Framework</p>
                    <p className="text-gray-600">Unified methodology • All frameworks • Always compliant • Continuous improvement</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Problem 4 */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200">
              <div className="flex items-start gap-4 mb-4">
                <Eye className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Problem 4: AI Incidents Go Unreported</h3>
                  <p className="text-gray-700 mb-4">Safety issues hidden behind corporate NDAs. Public has no visibility into AI risks.</p>
                  <div className="bg-white p-4 rounded border-l-4 border-blue-600">
                    <p className="font-semibold text-gray-900 mb-2">Our Solution: The Watchdog Program</p>
                    <p className="text-gray-600">Transparent incident database • Public reporting • Real-time insights • Pattern detection</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2.5: THE MARKET OPPORTUNITY
          ============================================ */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">The Regulatory Crisis.<br />The Job Opportunity.</h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">The EU AI Act compliance deadline is February 2, 2026. 50,000 enterprises must comply. They need 100,000-250,000 AI Safety Analysts. That job category doesn't exist yet. This is the largest employment opportunity of the decade—and the only way to solve the regulatory crisis while protecting humanity.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Compliance Need */}
            <motion.div {...fadeInUp} className="bg-white bg-opacity-95 p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <p className="text-6xl font-bold text-emerald-600 mb-3">50,000</p>
                <p className="text-lg font-bold text-gray-900 mb-2">EU Enterprises</p>
                <p className="text-gray-600 text-sm">Must comply with EU AI Act by February 2, 2026</p>
              </div>
            </motion.div>

            {/* Analysts Needed */}
            <motion.div {...fadeInUp} className="bg-white bg-opacity-95 p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <p className="text-6xl font-bold text-emerald-600 mb-3">100K-250K</p>
                <p className="text-lg font-bold text-gray-900 mb-2">AI Analysts Needed</p>
                <p className="text-gray-600 text-sm">2-5 analysts per enterprise to audit AI systems</p>
              </div>
            </motion.div>

            {/* Current Supply */}
            <motion.div {...fadeInUp} className="bg-white bg-opacity-95 p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <p className="text-6xl font-bold text-red-600 mb-3">0</p>
                <p className="text-lg font-bold text-gray-900 mb-2">Current Supply</p>
                <p className="text-gray-600 text-sm">This job category doesn't exist in the market</p>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeInUp} className="bg-white bg-opacity-10 border-2 border-white rounded-lg p-10 mb-12">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">How CEASAI Solves the Crisis</h3>
            <p className="text-lg text-emerald-100 mb-8 max-w-4xl mx-auto text-center leading-relaxed">If we train 100,000-250,000 AI Safety Analysts through CEASAI by February 2026, we solve the impossible regulatory deadline while creating the largest employment opportunity in a generation and making AI fundamentally safer for everyone.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-20 hover:bg-opacity-10 transition">
                <p className="text-emerald-300 font-bold text-lg mb-3">✓ Regulatory Compliance</p>
                <p className="text-white text-sm leading-relaxed">50,000 enterprises get access to certified AI Safety Analysts who can audit their systems and ensure compliance before the Feb 2 deadline. No enterprise gets left behind.</p>
              </div>
              <div className="bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-20 hover:bg-opacity-10 transition">
                <p className="text-emerald-300 font-bold text-lg mb-3">✓ Mass Employment</p>
                <p className="text-white text-sm leading-relaxed">250,000 new remote jobs created at $45-150/hour. Career paths for developers, researchers, compliance professionals, and anyone passionate about AI safety. Meaningful work that protects humanity.</p>
              </div>
              <div className="bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-20 hover:bg-opacity-10 transition">
                <p className="text-emerald-300 font-bold text-lg mb-3">✓ AI Safety</p>
                <p className="text-white text-sm leading-relaxed">Every AI system gets human expert review. Bias detection. Ethical oversight. Real accountability. The 33-Agent Council ensures decisions are impartial. This is how we make AI safer for everyone.</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="text-center">
            <p className="text-white text-lg mb-8 max-w-3xl mx-auto leading-relaxed">This isn't just a business opportunity. This is the solution to an impossible regulatory crisis. This is how we create 250,000 meaningful jobs. This is how we protect humanity as AI grows. The time to act is now.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => openModal('course')} className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold">
                Become an AI Safety Analyst
              </Button>
              <Button size="lg" onClick={() => openModal('enterprise')} variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3 text-lg font-bold">
                Enterprise Solution
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: THE ECOSYSTEM
          ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The CSOAI Ecosystem: Four Solutions, One Purpose</h2>
            <p className="text-xl text-gray-600">How they work together to protect humanity and advance AI responsibly.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* CSOAI */}
            <motion.div {...fadeInUp} className="bg-white p-8 rounded-lg border-2 border-emerald-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900">CSOAI</h3>
              </div>
              <p className="text-sm text-emerald-600 font-semibold mb-4">The Public Safety Framework</p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">What it is:</p>
                  <p className="text-gray-600">Open-source AI governance infrastructure for everyone</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">What it includes:</p>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>✓ Watchdog: Transparent incident reporting</li>
                    <li>✓ Council: 33-Agent Byzantine consensus</li>
                    <li>✓ PDCA: Continuous improvement cycle</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Who uses it:</p>
                  <p className="text-gray-600">Governments, companies, researchers, public</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Cost:</p>
                  <p className="text-emerald-600 font-bold">Free (open-source)</p>
                </div>
              </div>
            </motion.div>

            {/* CEASAI */}
            <motion.div {...fadeInUp} className="bg-white p-8 rounded-lg border-2 border-emerald-600 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-gray-900">CEASAI</h3>
              </div>
              <p className="text-sm text-emerald-600 font-semibold mb-4">The Training & Jobs Pipeline</p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">What it is:</p>
                  <p className="text-gray-600">Professional certification program built on CSOAI</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">What it includes:</p>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>✓ Train: 8-week professional certification</li>
                    <li>✓ Certify: 50-question exam, 70% pass rate</li>
                    <li>✓ Employ: Analyst jobs on Watchdog & Council</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Who uses it:</p>
                  <p className="text-gray-600">Individuals seeking AI safety careers</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Cost:</p>
                  <p className="text-emerald-600 font-bold">$99-$499 (one-time or monthly)</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* SOAI-PDCA */}
          <motion.div {...fadeInUp} className="bg-white p-8 rounded-lg border-2 border-emerald-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-emerald-600" />
              <h3 className="text-2xl font-bold text-gray-900">SOAI-PDCA</h3>
            </div>
            <p className="text-sm text-emerald-600 font-semibold mb-4">The Continuous Improvement Methodology</p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">What it is:</p>
                  <p className="text-gray-600">Deming cycle adapted for AI governance. Ongoing, public, iterative safety improvements.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">The Four Phases:</p>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li><strong>Plan:</strong> Identify AI risks and compliance gaps</li>
                    <li><strong>Do:</strong> Implement safety controls</li>
                    <li><strong>Check:</strong> Measure effectiveness</li>
                    <li><strong>Act:</strong> Adjust and improve (loop continues)</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Who uses it:</p>
                  <p className="text-gray-600">Companies, regulators, analysts, governments</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Cost:</p>
                  <p className="text-emerald-600 font-bold">Integrated into CSOAI (free)</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Impact:</p>
                  <p className="text-gray-600">Ensures AI safety improves continuously over time</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Symbiosis */}
          <motion.div {...fadeInUp} className="mt-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">The Symbiosis: How It All Works Together</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <p>Public reports AI problems → Watchdog</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <p>Watchdog data → Council analyzes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <p>Council decisions → PDCA cycle starts</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <p>PDCA improvements → Safer AI</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">5</div>
                  <p>Safer AI → More analyst jobs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">∞</div>
                  <p>Better oversight → Safer AI (loop continues)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: WHY HUMAN OVERSIGHT
          ============================================ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Human Oversight is Critical as AI Grows</h2>
            <p className="text-xl text-gray-600">AI is powerful. But AI making decisions about AI is dangerous. We need human judgment.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Accountability */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200">
              <AlertCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accountability</h3>
              <p className="text-gray-700 mb-4">Someone must answer for AI decisions. AI can't be held legally responsible. Humans must oversee and approve critical decisions.</p>
              <p className="text-sm text-blue-600 font-semibold">CSOAI ensures human experts are always in the loop.</p>
            </motion.div>

            {/* Bias Detection */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg border border-purple-200">
              <Eye className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bias Detection</h3>
              <p className="text-gray-700 mb-4">AI systems inherit human biases. Diverse human experts spot patterns AI can't. The 33-Agent Council ensures no single perspective dominates.</p>
              <p className="text-sm text-purple-600 font-semibold">Multiple viewpoints catch what algorithms miss.</p>
            </motion.div>

            {/* Ethical Judgment */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-lg border border-pink-200">
              <Heart className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ethical Judgment</h3>
              <p className="text-gray-700 mb-4">Some decisions require human values. Healthcare, hiring, law enforcement need human judgment. Not all decisions can be automated.</p>
              <p className="text-sm text-pink-600 font-semibold">CSOAI ensures human experts guide critical decisions.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: FIRST-TO-MARKET
          ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Only Platform Solving All Four Problems</h2>
            <p className="text-xl text-gray-600">We're not just a tool. We're building the infrastructure for safe AI governance—and creating jobs while we do it.</p>
          </motion.div>

          <motion.div {...fadeInUp} className="bg-white rounded-lg border-2 border-emerald-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Solution</th>
                    <th className="px-6 py-4 text-center font-bold">CSOAI</th>
                    <th className="px-6 py-4 text-center font-bold">Competitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-emerald-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Jobs for AI Analysts</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-emerald-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Human Oversight</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-emerald-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Compliance Framework</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-emerald-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Transparency</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto" /></td>
                  </tr>
                  <tr className="hover:bg-emerald-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Integrated Ecosystem</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: AUDIENCE-SPECIFIC VALUE PROPS
          ============================================ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What's Your Role?</h2>
            <p className="text-xl text-gray-600">CSOAI works for everyone protecting AI safety.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Individuals */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-lg border-2 border-emerald-300">
              <Users className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Worried About AI Safety?</h3>
              <p className="text-gray-700 mb-6">Get involved. Learn AI safety in 8 weeks. Get certified. Earn $45-150/hour. Help protect humanity.</p>
              <div className="bg-white p-4 rounded mb-6 border-l-4 border-emerald-600">
                <p className="font-semibold text-gray-900 mb-2">First 10,000 signups get:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Free $499 CEASAI course</li>
                  <li>✓ Early access to certification</li>
                  <li>✓ Founding member discount (50% off)</li>
                </ul>
              </div>
              <Button onClick={() => openModal('course')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Start Free Course</Button>
            </motion.div>

            {/* AI Companies */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border-2 border-blue-300">
              <Briefcase className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Companies Stressed About EU AI Act?</h3>
              <p className="text-gray-700 mb-6">Get compliant today. We automatically track legislation updates. SOAI-PDCA ensures you're never behind. 33-Agent Council audits your systems.</p>
              <div className="bg-white p-4 rounded mb-6 border-l-4 border-blue-600">
                <p className="font-semibold text-gray-900 mb-2">We provide:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Real-time compliance monitoring</li>
                  <li>✓ Automatic legislation tracking</li>
                  <li>✓ SOAI-PDCA implementation</li>
                  <li>✓ Transparent audit reports</li>
                </ul>
              </div>
              <Button onClick={() => openModal('enterprise')} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Enterprise Compliance</Button>
            </motion.div>

            {/* Governments */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg border-2 border-purple-300">
              <Globe className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Governments Worried About AI Companies?</h3>
              <p className="text-gray-700 mb-6">We have the solution. Real-time monitoring. Automatic legislation tracking. Never behind. Transparent enforcement.</p>
              <div className="bg-white p-4 rounded mb-6 border-l-4 border-purple-600">
                <p className="font-semibold text-gray-900 mb-2">We provide:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Real-time incident monitoring (Watchdog)</li>
                  <li>✓ Compliance tracking (SOAI-PDCA)</li>
                  <li>✓ Automatic legislation updates</li>
                  <li>✓ Enforcement action tracking</li>
                </ul>
              </div>
              <Button onClick={() => openModal('government')} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Government Integration</Button>
            </motion.div>

            {/* Public */}
            <motion.div {...fadeInUp} className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg border-2 border-orange-300">
              <Eye className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Had Problems With AI?</h3>
              <p className="text-gray-700 mb-6">Report it publicly to our Watchdog Hub. See what's really happening with AI systems. Help identify patterns and risks. No NDAs. Full transparency.</p>
              <div className="bg-white p-4 rounded mb-6 border-l-4 border-orange-600">
                <p className="font-semibold text-gray-900 mb-2">Watchdog Hub includes:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>✓ Anonymous reporting</li>
                  <li>✓ Public incident database</li>
                  <li>✓ Real-time statistics</li>
                  <li>✓ Council decisions visible</li>
                </ul>
              </div>
              <Button onClick={() => openModal('watchdog')} className="w-full bg-orange-600 hover:bg-orange-700 text-white">Report to Watchdog Hub</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 7: FAQ
          ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "What is CSOAI?",
                a: "CSOAI is an open-source AI safety governance framework that includes the Watchdog incident database, 33-Agent Byzantine Council for impartial decisions, and SOAI-PDCA continuous improvement methodology. It's free and available to everyone.",
              },
              {
                q: "What is CEASAI?",
                a: "CEASAI is a professional certification program built on top of CSOAI. It trains people to become AI Safety Analysts through an 8-week course, 50-question exam (70% pass rate), and employment opportunities on Watchdog and Council cases.",
              },
              {
                q: "How much does it cost?",
                a: "CSOAI is free (open-source). CEASAI training costs $99-$499 depending on the certification level. First 10,000 signups get the $499 course for free.",
              },
              {
                q: "Can I really earn $45-150/hour?",
                a: "Yes. Certified AI Safety Analysts earn $45-150/hour depending on experience level. You work on real Watchdog reports and Council cases, helping improve AI safety while earning income.",
              },
              {
                q: "Is CSOAI EU AI Act compliant?",
                a: "Yes. CSOAI is fully compliant with EU AI Act Article 14 (human oversight requirements). We ensure human experts oversee all critical AI decisions.",
              },
              {
                q: "How do I report AI problems?",
                a: "Visit the Watchdog Hub and submit a report. You can report anonymously. Your report will be reviewed by the 33-Agent Council and tracked through the SOAI-PDCA improvement cycle.",
              },
            ].map((faq, idx) => (
              <motion.div key={idx} {...fadeInUp} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-emerald-50 transition"
                >
                  <h3 className="font-semibold text-gray-900 text-left">{faq.q}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-600 transition transform ${expandedFAQ === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 py-4 bg-emerald-50 border-t border-gray-200">
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: FINAL CTA
          ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-bold mb-6">Ready to Protect Humanity & Build Your Career?</h2>
            <p className="text-xl mb-12 opacity-90">Join the AI safety movement. Get started today.</p>

            <div className="grid md:grid-cols-3 gap-6">
              <Button onClick={() => openModal('loi')} size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Get Free Course
              </Button>
              <Button onClick={() => openModal('enterprise')} size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Enterprise Compliance
              </Button>
              <Button onClick={() => openModal('watchdog')} size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Report AI Problem
              </Button>
            </div>

            <p className="text-sm mt-8 opacity-75">First 10,000 signups get free $499 course • EU AI Act enforcement: Feb 2, 2025 • Founding member discount: 50% off</p>
          </motion.div>
        </div>
      </section>

      {/* Conversion Modals */}
      <ConversionModals isOpen={modalOpen} onClose={closeModal} type={modalType} />

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">CSOAI</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About CSOAI</a></li>
                <li><a href="#" className="hover:text-white">SOAI-PDCA Framework</a></li>
                <li><a href="#" className="hover:text-white">33-Agent Council</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">CEASAI</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Training Program</a></li>
                <li><a href="#" className="hover:text-white">Certification Exam</a></li>
                <li><a href="#" className="hover:text-white">Job Board</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Watchdog Hub</a></li>
                <li><a href="#" className="hover:text-white">Blog & News</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm">
              <p>&copy; 2025 CSOAI. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <span className="text-emerald-400">✓ EU AI Act Compliant</span>
                <span className="text-emerald-400">✓ GDPR Compliant</span>
                <span className="text-emerald-400">✓ ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
