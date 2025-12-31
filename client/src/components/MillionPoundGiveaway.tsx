/**
 * £1,000,000 Training Giveaway Campaign
 * PR campaign to give away free AI Safety certifications
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Award,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Zap,
  Globe,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface GiveawayStats {
  totalValue: number;
  spotsTotal: number;
  spotsClaimed: number;
  daysRemaining: number;
}

export function MillionPoundGiveaway() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<GiveawayStats>({
    totalValue: 1000000,
    spotsTotal: 2004, // £1M ÷ £499 = ~2004 Fundamentals courses
    spotsClaimed: 847,
    daysRemaining: 32,
  });

  // Simulate spots being claimed
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        spotsClaimed: Math.min(prev.spotsClaimed + Math.floor(Math.random() * 2), prev.spotsTotal),
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const spotsRemaining = stats.spotsTotal - stats.spotsClaimed;
  const percentageClaimed = (stats.spotsClaimed / stats.spotsTotal) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('🎉 Application submitted!', {
      description: 'Check your email for next steps. Welcome to CEASAI!',
    });
    
    setEmail('');
    setIsSubmitting(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      spotsClaimed: prev.spotsClaimed + 1,
    }));
  };

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-slate-900 to-purple-900/20" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: '-20%',
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 mb-6"
          >
            <Gift className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 font-semibold">Limited Time Offer</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
              £1,000,000
            </span>
            <br />
            <span className="text-white">Training Giveaway</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto mb-4"
          >
            We're giving away <span className="text-amber-400 font-bold">£1 million</span> worth of 
            AI Safety Analyst certifications to prepare the West for the EU AI Act deadline.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-400"
          >
            First <span className="text-white font-semibold">{stats.spotsTotal.toLocaleString()}</span> applicants 
            get certified <span className="text-emerald-400 font-semibold">FREE</span>.
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">£1M</p>
                <p className="text-sm text-slate-400">Total Value</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{spotsRemaining.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Spots Remaining</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">£499</p>
                <p className="text-sm text-slate-400">Course Value</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stats.daysRemaining}</p>
                <p className="text-sm text-slate-400">Days Left</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">{stats.spotsClaimed.toLocaleString()} claimed</span>
            <span className="text-slate-400">{stats.spotsTotal.toLocaleString()} total</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentageClaimed}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-center text-sm text-amber-400 mt-2">
            {percentageClaimed.toFixed(1)}% claimed - Don't miss out!
          </p>
        </div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white text-center mb-6">
                Claim Your Free Certification
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Apply for Free Course
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Full £499 Fundamentals course included</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Industry-recognized certification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Lifetime access to course materials</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why We're Doing This */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Why We're Giving Away £1 Million</h3>
          <p className="text-slate-400 leading-relaxed">
            The EU AI Act creates 250,000 new AI Safety Analyst jobs by February 2026. 
            The West needs trained professionals <span className="text-white">now</span>. 
            We've built the certification platform—it costs us nothing for people to learn. 
            By giving away £1M in training, we're investing in humanity's AI safety future 
            while building the largest community of certified analysts in the world.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>Global Impact</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>250K Jobs Created</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Industry Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MillionPoundGiveaway;
