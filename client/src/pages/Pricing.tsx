import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { trpc } from '@/lib/trpc';
import { 
  Check, 
  X, 
  Zap, 
  Building2, 
  Rocket,
  Shield,
  Users,
  FileText,
  Brain,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
  Headphones
} from 'lucide-react';

// Updated pricing tiers based on market research
const PRICING_TIERS = [
  {
    id: 'startup',
    name: 'Startup',
    description: 'For early-stage companies and SMBs',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    icon: Rocket,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    features: {
      users: '5',
      aiSystems: '10',
      assessments: '50/month',
      frameworks: ['EU AI Act', 'NIST RMF'],
      training: 'Basic (50 courses)',
      certification: false,
      watchdog: 'Community access',
      apiAccess: false,
      pdfReports: true,
      emailDelivery: true,
      bulkRegistration: false,
      customIntegrations: false,
      dedicatedSupport: false,
      sla: 'None',
      councilAccess: 'View only',
      support: 'Email',
      knowledgeBase: 'Limited',
    },
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For scaling mid-market enterprises',
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    icon: TrendingUp,
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    features: {
      users: '25',
      aiSystems: 'Unlimited',
      assessments: 'Unlimited',
      frameworks: ['EU AI Act', 'NIST RMF', 'ISO 42001'],
      training: 'Full library (240+ courses)',
      certification: true,
      watchdog: 'Incident reporting + analytics',
      apiAccess: true,
      pdfReports: true,
      emailDelivery: true,
      bulkRegistration: true,
      customIntegrations: true,
      dedicatedSupport: false,
      sla: '24-hour response',
      councilAccess: 'Full access',
      support: 'Priority email + chat',
      knowledgeBase: 'Full',
    },
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For Fortune 500 and regulated industries',
    monthlyPrice: null,
    yearlyPrice: null,
    customPrice: 'Custom',
    icon: Building2,
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
    features: {
      users: 'Unlimited',
      aiSystems: 'Unlimited',
      assessments: 'Unlimited',
      frameworks: 'All frameworks + custom',
      training: 'Custom training programs',
      certification: true,
      watchdog: 'Advanced analytics + threat intelligence',
      apiAccess: true,
      pdfReports: true,
      emailDelivery: true,
      bulkRegistration: true,
      customIntegrations: true,
      dedicatedSupport: true,
      sla: '4-hour response + SLA',
      councilAccess: 'Priority + custom',
      support: 'Dedicated account manager + phone',
      knowledgeBase: 'Full + custom content',
    },
    cta: 'Contact Sales',
    popular: false,
  },
];

const FEATURE_CATEGORIES = [
  {
    name: 'Core Features',
    features: [
      { key: 'users', label: 'Team Members', description: 'Users in your organization' },
      { key: 'aiSystems', label: 'AI Systems', description: 'Number of AI systems you can register' },
      { key: 'assessments', label: 'Compliance Assessments', description: 'Monthly assessment limit' },
      { key: 'frameworks', label: 'Compliance Frameworks', description: 'Supported regulatory frameworks' },
    ],
  },
  {
    name: 'Training & Certification',
    features: [
      { key: 'training', label: 'Training Modules', description: 'Access to compliance training' },
      { key: 'certification', label: 'Certification Program', description: 'Formal certification exams' },
      { key: 'watchdog', label: 'Watchdog Program', description: 'AI incident reporting and tracking' },
    ],
  },
  {
    name: 'Reporting & Analytics',
    features: [
      { key: 'pdfReports', label: 'PDF Reports', description: 'Generate downloadable compliance reports' },
      { key: 'emailDelivery', label: 'Email Delivery', description: 'Send reports directly via email' },
      { key: 'knowledgeBase', label: 'Knowledge Base', description: 'Access to AI safety scenarios' },
    ],
  },
  {
    name: 'Integration & API',
    features: [
      { key: 'apiAccess', label: 'API Access', description: 'Programmatic access to CSOAI' },
      { key: 'bulkRegistration', label: 'Bulk Registration', description: 'Register multiple systems at once' },
      { key: 'customIntegrations', label: 'Custom Integrations', description: 'Connect to your existing tools' },
    ],
  },
  {
    name: 'Support & SLA',
    features: [
      { key: 'support', label: 'Support Channel', description: 'How to reach our team' },
      { key: 'sla', label: 'Response SLA', description: 'Guaranteed response time' },
      { key: 'dedicatedSupport', label: 'Dedicated Support', description: 'Named account manager' },
    ],
  },
  {
    name: 'CSOAI Ecosystem',
    features: [
      { key: 'councilAccess', label: '33-Agent Council', description: 'AI safety evaluation access' },
    ],
  },
];

const FAQ = [
  {
    question: 'Why is CSOAI priced higher than competitors?',
    answer: 'CSOAI combines multi-framework compliance (EU AI Act, NIST, ISO 42001), comprehensive training, certification programs, and the Watchdog incident tracking system in one platform. Competitors typically offer single-framework tools. Our pricing reflects the comprehensive value delivered.',
  },
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes! Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle. Contact our team for custom arrangements.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes, both Startup and Growth plans include a 14-day free trial with full feature access. Enterprise customers can request a custom pilot program.',
  },
  {
    question: 'What happens when I exceed my plan limits?',
    answer: 'For Startup plans, you\'ll receive a notification when approaching limits. You can upgrade anytime to Growth or Enterprise. Growth and Enterprise plans have unlimited assessments and systems.',
  },
  {
    question: 'How does the 33-Agent Council work?',
    answer: 'Our AI council evaluates safety scenarios using 33 specialized agents representing different stakeholder perspectives. Growth and Enterprise tiers get full access to council evaluations.',
  },
  {
    question: 'Can I get a custom enterprise quote?',
    answer: 'Absolutely! Contact our sales team at enterprise@coai.dev for custom pricing based on your organization\'s specific needs, scale, and compliance requirements.',
  },
  {
    question: 'What\'s included in the Watchdog program?',
    answer: 'Startup: Community access to public incident reports. Growth: Full incident reporting, analytics, and trend analysis. Enterprise: Advanced threat intelligence and custom threat modeling.',
  },
  {
    question: 'Do you offer annual discounts?',
    answer: 'Yes! Annual billing saves approximately 17% compared to monthly pricing across all tiers.',
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [isYearly, setIsYearly] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const { data: user } = trpc.auth.me.useQuery();
  const checkoutMutation = trpc.stripe.createCheckoutSession.useMutation();
  
  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'enterprise') {
      window.location.href = 'mailto:enterprise@coai.dev?subject=Enterprise%20Inquiry&body=I%20am%20interested%20in%20learning%20more%20about%20CSOAI%20Enterprise%20pricing%20and%20features.';
      return;
    }
    
    try {
      const result = await checkoutMutation.mutateAsync({
        tier: tierId as 'startup' | 'growth' | 'enterprise',
        billingPeriod: isYearly ? 'yearly' : 'monthly',
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };
  
  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-gray-400 dark:text-gray-600" />
      );
    }
    if (Array.isArray(value)) {
      return <span className="text-sm">{value.join(', ')}</span>;
    }
    return <span className="text-sm font-medium">{value}</span>;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Enterprise Pricing for AI Compliance
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Simple, transparent pricing that scales with your organization. From startups to Fortune 500, we have a plan for you.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              Monthly
            </span>
            <Switch 
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              Annual <span className="text-emerald-500 font-semibold">(Save 17%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PRICING_TIERS.map((tier) => {
            const Icon = tier.icon;
            const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
            const displayPrice = tier.customPrice || (price ? `$${price}` : 'Custom');
            const billingLabel = tier.customPrice ? '' : (isYearly ? '/year' : '/month');
            
            return (
              <Card 
                key={tier.id}
                className={`relative transition-all duration-300 ${
                  tier.popular 
                    ? 'md:scale-105 border-emerald-500 shadow-xl' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Icon className={`h-5 w-5 ${tier.color}`} />
                        {tier.name}
                      </CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {displayPrice}
                      <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">{billingLabel}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Button 
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full mb-6 ${
                      tier.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                  
                  {/* Key Features */}
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Team Members</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{tier.features.users}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI Systems</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{tier.features.aiSystems}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Frameworks</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {Array.isArray(tier.features.frameworks) ? tier.features.frameworks.length : 'All'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Support</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{tier.features.support}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Detailed Feature Comparison
          </h2>
          
          {FEATURE_CATEGORIES.map((category) => (
            <div key={category.name} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{category.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Feature</th>
                      {PRICING_TIERS.map((tier) => (
                        <th key={tier.id} className="text-center py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                          {tier.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature) => (
                      <tr key={feature.key} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                          </div>
                        </td>
                        {PRICING_TIERS.map((tier) => (
                          <td key={tier.id} className="text-center py-4 px-4">
                            {renderFeatureValue((tier.features as any)[feature.key])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {FAQ.map((item, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 rounded-lg border border-emerald-500/30 dark:border-emerald-500/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Secure Your AI?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of organizations using CSOAI to ensure compliance with EU AI Act, NIST RMF, and ISO 42001 standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => handleSubscribe('startup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Start Free Trial
            </Button>
            <Button 
              onClick={() => handleSubscribe('enterprise')}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
