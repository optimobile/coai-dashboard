/**
 * Referral Landing Page
 * Public-facing page for referral program signup with earnings calculator
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Share2,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ReferralLandingPage() {
  const [referralCode, setReferralCode] = useState('');
  const [calculatorInputs, setCalculatorInputs] = useState({
    referrals: 10,
    conversionRate: 50,
  });

  const calculateEarnings = () => {
    const certificationPrice = 299; // $299 per certification
    const commissionRate = 0.2; // 20%
    const completedReferrals = Math.floor(
      (calculatorInputs.referrals * calculatorInputs.conversionRate) / 100,
    );
    return completedReferrals * certificationPrice * commissionRate;
  };

  const earnings = calculateEarnings();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode || 'CSOAI-DEMO-CODE');
    toast.success('Referral code copied!');
  };

  const handleShareCode = () => {
    const code = referralCode || 'CSOAI-DEMO-CODE';
    const text = `Join me in the CSOAI Referral Program! Earn 20% commission for every AI Safety certification. Use code: ${code}`;

    if (navigator.share) {
      navigator.share({
        title: 'CSOAI Referral Program',
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Share text copied!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative py-20 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-emerald-600">Earn Passive Income</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Network Into Revenue
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Earn 20% commission for every colleague who completes CEASA certification. No limits,
              no caps. Just pure earning potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Zap className="w-5 h-5" />
                Get Your Referral Code
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share2 className="w-5 h-5" />
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="border-emerald-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Average Earnings</p>
                  <p className="text-3xl font-bold text-emerald-600">$9,400</p>
                  <p className="text-xs text-gray-500 mt-1">per 6 months</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Active Referrers</p>
                  <p className="text-3xl font-bold text-blue-600">342</p>
                  <p className="text-xs text-gray-500 mt-1">and growing</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Commission Rate</p>
                  <p className="text-3xl font-bold text-purple-600">20%</p>
                  <p className="text-xs text-gray-500 mt-1">no limits</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Earnings Calculator */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="py-16 px-6 bg-white/50 backdrop-blur"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Calculate Your Potential Earnings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Referrals to Share With
                  </label>
                  <Input
                    type="range"
                    min="1"
                    max="100"
                    value={calculatorInputs.referrals}
                    onChange={(e) =>
                      setCalculatorInputs({
                        ...calculatorInputs,
                        referrals: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-2xl font-bold text-emerald-600 mt-2">
                    {calculatorInputs.referrals} people
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Conversion Rate
                  </label>
                  <Input
                    type="range"
                    min="1"
                    max="100"
                    value={calculatorInputs.conversionRate}
                    onChange={(e) =>
                      setCalculatorInputs({
                        ...calculatorInputs,
                        conversionRate: parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {calculatorInputs.conversionRate}%
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Estimated Monthly Earnings</p>
                  <p className="text-4xl font-bold text-emerald-600">
                    ${(earnings / 6).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why Join?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'Generous 20% commission' },
                  { icon: DollarSign, text: 'Monthly automatic payouts' },
                  { icon: Share2, text: 'Easy sharing tools' },
                  { icon: TrendingUp, text: 'Real-time tracking' },
                  { icon: Award, text: 'Top earner rewards' },
                  { icon: Target, text: 'Marketing support' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3"
                  >
                    <item.icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="py-16 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Success Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                title: 'AI Safety Consultant',
                earnings: '$9,400',
                referrals: 47,
                quote:
                  'I earned $9,400 in my first 6 months just by sharing my referral code with colleagues.',
              },
              {
                name: 'Marcus Johnson',
                title: 'Enterprise Security Lead',
                earnings: '$31,200',
                referrals: 156,
                quote:
                  'The referral program is incredibly easy to use. My team loves the CEASA certification.',
              },
              {
                name: 'Elena Rodriguez',
                title: 'Compliance Officer',
                earnings: '$17,800',
                referrals: 89,
                quote:
                  'Not only am I earning great commissions, but I\'m helping organizations build safer AI.',
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-emerald-600 font-bold">{testimonial.earnings}</span>
                    <span className="text-gray-600">{testimonial.referrals} referrals</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="py-16 px-6 bg-gradient-to-r from-emerald-600 to-blue-600"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Get your unique referral code and start sharing with your network today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 gap-2"
              onClick={() => setReferralCode('CSOAI-' + Math.random().toString(36).substr(2, 9).toUpperCase())}
            >
              <Zap className="w-5 h-5" />
              Generate My Code
            </Button>
            {referralCode && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 gap-2"
                  onClick={handleCopyCode}
                >
                  <Share2 className="w-5 h-5" />
                  Copy Code
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 gap-2"
                  onClick={handleShareCode}
                >
                  <ArrowRight className="w-5 h-5" />
                  Share
                </Button>
              </>
            )}
          </div>

          {referralCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-white/20 rounded-lg backdrop-blur"
            >
              <p className="text-white/80 text-sm mb-2">Your Referral Code:</p>
              <p className="text-2xl font-mono font-bold text-white">{referralCode}</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="py-16 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">FAQ</h2>

          <div className="space-y-6">
            {[
              {
                q: 'How much can I earn?',
                a: 'You earn 20% commission on every CEASA certification completed by your referrals. There\'s no cap on earnings!',
              },
              {
                q: 'When do I get paid?',
                a: 'Commissions are processed monthly via Stripe once you reach the $50 minimum threshold.',
              },
              {
                q: 'How do I share my code?',
                a: 'Share your unique referral code via email, social media, messaging apps, or any channel. We provide templates to make it easy.',
              },
              {
                q: 'Is there a limit to referrals?',
                a: 'No! Refer as many people as you want. The more you share, the more you earn.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="p-6 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
