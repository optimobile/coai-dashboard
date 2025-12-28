import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CountdownTimer } from '@/components/CountdownTimer';
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
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'CSOAI: AI Safety Certification & Compliance Platform';
  }, []);

  const handleCTA = (source: string) => {
    // Redirect to signup with source tracking
    setLocation(`/signup?source=${encodeURIComponent(source)}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="w-full bg-white">
      {/* ============================================
          SECTION 1: HERO - FOUR SOLUTIONS
          ============================================ */}
      <section className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          {/* Urgency Banner with Countdown */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 mb-8 text-center"
          >
            <p className="text-sm md:text-base font-semibold text-gray-800 mb-3">
              🚨 <span className="text-red-600">EU AI Act Enforcement Deadline</span> — We need <span className="font-bold text-red-700">250,000 AI Safety Analysts</span> in:
            </p>
            <CountdownTimer />
          </motion.div>

          {/* Main Headline */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
              AI is Growing.
              <br />
              <span className="text-emerald-600">We Fixed the Problem.</span>
            </h1>
            <p className="text-2xl text-gray-700 font-semibold mt-6">Four critical solutions. One unified platform.</p>
            <p className="text-lg text-red-600 font-semibold mt-4">Without 250,000 trained analysts by Feb 2, 2026, enterprises face compliance chaos. Our Byzantine Council ensures safety.</p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button onClick={() => handleCTA('analyst')} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
              Become an AI Safety Analyst
            </Button>
            <Button onClick={() => handleCTA('enterprise')} size="lg" variant="outline" className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold">
              Enterprise Compliance Solution
            </Button>
            <Button onClick={() => handleCTA('government')} size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold">
              Government Portal
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center text-sm text-gray-600 mb-8"
          >
            Join 10,000+ early adopters • First 10,000 get free $499 course • EU AI Act enforcement: Feb 2, 2026 • No credit card required
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
          SECTION 8: FINAL CTA
          ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-bold mb-6">Ready to Protect Humanity & Build Your Career?</h2>
            <p className="text-xl mb-12 opacity-90">Join the AI safety movement. Get started today.</p>

            <div className="grid md:grid-cols-3 gap-6">
              <Button onClick={() => handleCTA('analyst')} size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Get Free Course
              </Button>
              <Button onClick={() => handleCTA('enterprise')} size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Enterprise Compliance
              </Button>
              <Button onClick={() => handleCTA('watchdog')} size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Report AI Problem
              </Button>
            </div>

            <p className="text-sm mt-8 opacity-75">First 10,000 signups get free $499 course • EU AI Act enforcement: Feb 2, 2026 • Founding member discount: 50% off</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
