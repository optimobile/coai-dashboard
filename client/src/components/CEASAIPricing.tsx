/**
 * CEASAI Certification Pricing
 * £499 / £999 / £1,999 tiers with monthly payment options
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  TrendingUp,
  Shield,
  Award,
  BookOpen,
  Clock,
  Users,
  Globe,
  Zap,
  CreditCard,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  duration: string;
  modules: number;
  questions: number;
  features: string[];
  monthlyOptions: {
    months: number;
    monthlyPrice: number;
    totalPrice: number;
  }[];
  popular?: boolean;
  color: string;
  icon: React.ElementType;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    subtitle: 'EU AI Act Essentials',
    price: 499,
    currency: '£',
    duration: '6 weeks',
    modules: 10,
    questions: 100,
    features: [
      'EU AI Act fundamentals',
      'Risk classification basics',
      'Compliance overview',
      'Digital certificate',
      'Lifetime course access',
      '1-year certificate validity',
      'Community forum access',
      'Email support',
    ],
    monthlyOptions: [
      { months: 12, monthlyPrice: 42, totalPrice: 504 },
      { months: 24, monthlyPrice: 21, totalPrice: 504 },
      { months: 36, monthlyPrice: 14, totalPrice: 504 },
    ],
    color: 'emerald',
    icon: BookOpen,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    subtitle: 'Professional Certification',
    price: 999,
    currency: '£',
    duration: '12 weeks',
    modules: 20,
    questions: 200,
    features: [
      'Everything in Fundamentals',
      'Advanced risk assessment',
      'NIST AI RMF framework',
      'Conformity assessment',
      'Quality management systems',
      'Sector-specific compliance',
      'Job board access',
      'Professional community',
      'Blockchain-verified certificate',
      '2-year certificate validity',
      'Priority email support',
    ],
    monthlyOptions: [
      { months: 12, monthlyPrice: 84, totalPrice: 1008 },
      { months: 24, monthlyPrice: 42, totalPrice: 1008 },
      { months: 36, monthlyPrice: 28, totalPrice: 1008 },
    ],
    popular: true,
    color: 'blue',
    icon: TrendingUp,
  },
  {
    id: 'expert',
    name: 'Expert',
    subtitle: 'Specialist Certification',
    price: 1999,
    currency: '£',
    duration: '16 weeks',
    modules: 30,
    questions: 300,
    features: [
      'Everything in Advanced',
      'TC260 framework mastery',
      'Regulatory procedures',
      'Policy development',
      'International harmonization',
      'Research project mentorship',
      'Government agency access',
      'Speaking opportunities',
      'Multi-signature certificate',
      '3-year certificate validity',
      'Dedicated account manager',
      'Lifetime professional network',
    ],
    monthlyOptions: [
      { months: 12, monthlyPrice: 167, totalPrice: 2004 },
      { months: 24, monthlyPrice: 84, totalPrice: 2016 },
      { months: 36, monthlyPrice: 56, totalPrice: 2016 },
    ],
    color: 'purple',
    icon: Shield,
  },
];

interface PricingCardProps {
  tier: PricingTier;
  paymentType: 'full' | 'monthly';
  selectedMonths: number;
  onSelect: (tierId: string) => void;
}

function PricingCard({ tier, paymentType, selectedMonths, onSelect }: PricingCardProps) {
  const Icon = tier.icon;
  const monthlyOption = tier.monthlyOptions.find(o => o.months === selectedMonths);
  
  const colorClasses = {
    emerald: {
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      button: 'bg-emerald-600 hover:bg-emerald-700',
    },
    blue: {
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      border: 'border-blue-500/50',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    purple: {
      badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
  };
  
  const colors = colorClasses[tier.color as keyof typeof colorClasses];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${tier.popular ? 'md:scale-105 z-10' : ''}`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <Card className={`h-full bg-slate-900/50 backdrop-blur-sm border-2 ${tier.popular ? colors.border : 'border-slate-700'} ${tier.popular ? 'shadow-xl shadow-blue-500/20' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className={`p-3 rounded-xl ${colors.bg}`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <Badge className={colors.badge}>{tier.duration}</Badge>
          </div>
          <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
          <CardDescription className="text-slate-400">{tier.subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Display */}
          <div className={`rounded-xl p-4 ${colors.bg}`}>
            {paymentType === 'full' ? (
              <div>
                <p className="text-slate-400 text-sm mb-1">One-time payment</p>
                <p className="text-4xl font-bold text-white">
                  {tier.currency}{tier.price.toLocaleString()}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 text-sm mb-1">{selectedMonths} monthly payments of</p>
                <p className="text-4xl font-bold text-white">
                  {tier.currency}{monthlyOption?.monthlyPrice}
                  <span className="text-lg text-slate-400 font-normal">/mo</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Total: {tier.currency}{monthlyOption?.totalPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Program Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{tier.modules} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-500" />
              <span className="text-slate-300">{tier.questions} questions</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {tier.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                <span className="text-sm text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => onSelect(tier.id)}
            className={`w-full ${colors.button} text-white`}
            size="lg"
          >
            Enroll Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CEASAIPricing() {
  const [paymentType, setPaymentType] = useState<'full' | 'monthly'>('full');
  const [selectedMonths, setSelectedMonths] = useState(12);

  const handleSelect = (tierId: string) => {
    const tier = pricingTiers.find(t => t.id === tierId);
    if (tier) {
      toast.success(`Selected ${tier.name} certification!`, {
        description: paymentType === 'full' 
          ? `One-time payment of ${tier.currency}${tier.price}`
          : `${selectedMonths} payments of ${tier.currency}${tier.monthlyOptions.find(o => o.months === selectedMonths)?.monthlyPrice}/month`,
      });
    }
  };

  return (
    <div className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            CEASAI Certification
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in Your Future
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get certified before the EU AI Act deadline. Join 250,000 AI Safety Analysts needed by February 2026.
          </p>
        </div>

        {/* Payment Type Toggle */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <Tabs value={paymentType} onValueChange={(v) => setPaymentType(v as 'full' | 'monthly')} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="full" className="data-[state=active]:bg-emerald-600">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay in Full
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-emerald-600">
                <Clock className="w-4 h-4 mr-2" />
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Monthly Options */}
          {paymentType === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-4"
            >
              {[12, 24, 36].map((months) => (
                <button
                  key={months}
                  onClick={() => setSelectedMonths(months)}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    selectedMonths === months
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="font-bold">{months}</span> months
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              paymentType={paymentType}
              selectedMonths={selectedMonths}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 mb-6">Trusted by professionals worldwide</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-5 h-5" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Award className="w-5 h-5" />
              <span>Industry Recognized</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Globe className="w-5 h-5" />
              <span>Global Certification</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-5 h-5" />
              <span>10,000+ Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CEASAIPricing;
