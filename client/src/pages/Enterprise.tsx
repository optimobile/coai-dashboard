/**
 * Enterprise Landing Page
 * B2B value proposition with ROI calculator, case studies, and clear pricing
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  Users,
  FileCheck,
  Zap,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';

export default function Enterprise() {
  // ROI Calculator State
  const [numSystems, setNumSystems] = useState(10);
  const [avgRiskLevel, setAvgRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [currentStaff, setCurrentStaff] = useState(2);

  // ROI Calculations
  const costPerSystem = avgRiskLevel === 'high' ? 15000 : avgRiskLevel === 'medium' ? 8000 : 3000;
  const manualCost = numSystems * costPerSystem;
  const csoaiCost = numSystems * 2000; // Flat rate per system
  const staffCost = currentStaff * 120000; // Average compliance staff salary
  const csoaiStaffNeeded = Math.ceil(numSystems / 20); // 1 staff per 20 systems
  const csoaiStaffCost = csoaiStaffNeeded * 120000;
  
  const totalManualCost = manualCost + staffCost;
  const totalCsoaiCost = csoaiCost + csoaiStaffCost;
  const savings = totalManualCost - totalCsoaiCost;
  const savingsPercent = Math.round((savings / totalManualCost) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-24">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Enterprise Solutions
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                AI Compliance That Saves You Millions
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Stop spending $15,000 per AI system on manual compliance reviews. CSOAI automates 80% of the work 
                with our 33-Agent Council, reducing costs to $2,000 per system while maintaining higher accuracy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/enterprise-onboarding">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/api-docs">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View API Docs
                  </Button>
                </Link>
              </div>
            </div>
            
            <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-white">Quick ROI Snapshot</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-gray-300">Manual Compliance</span>
                  <span className="text-2xl font-bold text-red-400">$15K/system</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-gray-300">With CSOAI</span>
                  <span className="text-2xl font-bold text-emerald-400">$2K/system</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white font-semibold">Your Savings</span>
                  <span className="text-3xl font-bold text-emerald-300">87%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="container py-20 max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-50 text-red-600 border-red-200">The Enterprise Problem</Badge>
          <h2 className="text-4xl font-bold mb-6">AI Compliance is Expensive, Slow, and Risky</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Companies are spending millions on manual AI compliance reviews, hiring expensive consultants, 
            and still facing regulatory fines because traditional methods can't keep up with AI deployment speed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 border-2 border-red-100 bg-red-50/50">
            <DollarSign className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-red-900">Expensive</h3>
            <p className="text-gray-700 leading-relaxed">
              Manual compliance reviews cost $8K-$15K per AI system. With dozens of systems, costs quickly reach millions annually.
            </p>
          </Card>

          <Card className="p-8 border-2 border-orange-100 bg-orange-50/50">
            <Clock className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-orange-900">Slow</h3>
            <p className="text-gray-700 leading-relaxed">
              Traditional audits take 4-8 weeks per system. By the time you get results, your AI has already evolved.
            </p>
          </Card>

          <Card className="p-8 border-2 border-yellow-100 bg-yellow-50/50">
            <AlertTriangle className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-yellow-900">Risky</h3>
            <p className="text-gray-700 leading-relaxed">
              EU AI Act fines up to €35M. One missed compliance issue can wipe out years of profits.
            </p>
          </Card>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-gray-50 py-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">ROI Calculator</Badge>
            <h2 className="text-4xl font-bold mb-4">Calculate Your Savings</h2>
            <p className="text-xl text-gray-600">
              See how much CSOAI can save your organization in the first year
            </p>
          </div>

          <Card className="p-10">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="numSystems" className="text-base font-semibold mb-2 block">
                    Number of AI Systems
                  </Label>
                  <Input
                    id="numSystems"
                    type="number"
                    value={numSystems}
                    onChange={(e) => setNumSystems(parseInt(e.target.value) || 0)}
                    className="text-lg"
                    min="1"
                    max="1000"
                  />
                  <p className="text-sm text-gray-500 mt-1">How many AI systems do you deploy?</p>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Average Risk Level
                  </Label>
                  <div className="space-y-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <label
                        key={level}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          avgRiskLevel === level
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="riskLevel"
                          value={level}
                          checked={avgRiskLevel === level}
                          onChange={() => setAvgRiskLevel(level)}
                          className="text-emerald-600"
                        />
                        <div>
                          <div className="font-semibold capitalize">{level} Risk</div>
                          <div className="text-sm text-gray-600">
                            {level === 'low' && 'Chatbots, content filters'}
                            {level === 'medium' && 'Recommendation systems, analytics'}
                            {level === 'high' && 'Credit scoring, hiring, medical'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentStaff" className="text-base font-semibold mb-2 block">
                    Current Compliance Staff
                  </Label>
                  <Input
                    id="currentStaff"
                    type="number"
                    value={currentStaff}
                    onChange={(e) => setCurrentStaff(parseInt(e.target.value) || 0)}
                    className="text-lg"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Full-time employees dedicated to AI compliance</p>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6">Your Annual Savings</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Current Annual Cost</div>
                    <div className="text-3xl font-bold text-red-600">
                      ${totalManualCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      ${manualCost.toLocaleString()} reviews + ${staffCost.toLocaleString()} staff
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2 border-emerald-200">
                    <div className="text-sm text-gray-600 mb-1">With CSOAI</div>
                    <div className="text-3xl font-bold text-emerald-600">
                      ${totalCsoaiCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      ${csoaiCost.toLocaleString()} platform + ${csoaiStaffCost.toLocaleString()} staff ({csoaiStaffNeeded} needed)
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-lg text-white">
                    <div className="text-sm mb-1">Total Annual Savings</div>
                    <div className="text-4xl font-bold mb-2">
                      ${savings.toLocaleString()}
                    </div>
                    <div className="text-emerald-100 text-lg font-semibold">
                      {savingsPercent}% cost reduction
                    </div>
                  </div>
                </div>

                <Link href="/enterprise-onboarding">
                  <Button size="lg" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white">
                    Start Saving Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Case Studies */}
      <div className="container py-20 max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">Case Studies</Badge>
          <h2 className="text-4xl font-bold mb-4">Real Results from Real Companies</h2>
          <p className="text-xl text-gray-600">
            See how enterprises are using CSOAI to slash compliance costs and accelerate AI deployment
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-10 border-2 border-emerald-200">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-emerald-100 rounded-xl">
                <Building2 className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="flex-1">
                <Badge className="mb-3 bg-emerald-50 text-emerald-700 border-emerald-200">
                  Financial Services
                </Badge>
                <h3 className="text-2xl font-bold mb-4">Global Bank Saves $2.3M Annually</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  A Fortune 500 bank with 47 AI systems across credit scoring, fraud detection, and customer service 
                  was spending $3.1M annually on manual compliance reviews. After implementing CSOAI:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">74%</div>
                    <div className="text-sm text-gray-600">Cost Reduction</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">6 weeks</div>
                    <div className="text-sm text-gray-600">Faster Reviews</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">EU AI Act Compliant</div>
                  </div>
                </div>
                <blockquote className="mt-6 pl-6 border-l-4 border-emerald-500 italic text-gray-700">
                  "CSOAI's 33-Agent Council caught compliance issues our internal team missed. 
                  The Byzantine consensus gives us confidence that assessments are unbiased."
                </blockquote>
                <p className="text-sm text-gray-500 mt-2">— Chief Compliance Officer</p>
              </div>
            </div>
          </Card>

          <Card className="p-10 border-2 border-emerald-200">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-emerald-100 rounded-xl">
                <Zap className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="flex-1">
                <Badge className="mb-3 bg-emerald-50 text-emerald-700 border-emerald-200">
                  Healthcare Tech
                </Badge>
                <h3 className="text-2xl font-bold mb-4">MedTech Startup Achieves ISO 42001 in 3 Months</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  A medical AI startup needed ISO 42001 certification to sell in Europe. Traditional consultants 
                  quoted $180K and 9 months. CSOAI delivered in 3 months for $45K:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">$135K</div>
                    <div className="text-sm text-gray-600">Saved on Consulting</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">6 months</div>
                    <div className="text-sm text-gray-600">Faster Certification</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">Zero</div>
                    <div className="text-sm text-gray-600">Compliance Violations</div>
                  </div>
                </div>
                <blockquote className="mt-6 pl-6 border-l-4 border-emerald-500 italic text-gray-700">
                  "CSOAI's SOAI-PDCA framework made continuous compliance easy. We now run assessments 
                  weekly instead of annually, catching issues before they become problems."
                </blockquote>
                <p className="text-sm text-gray-500 mt-2">— CTO & Co-Founder</p>
              </div>
            </div>
          </Card>

          <Card className="p-10 border-2 border-purple-200">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-purple-100 rounded-xl">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <div className="flex-1">
                <Badge className="mb-3 bg-purple-50 text-purple-700 border-purple-200">
                  Enterprise SaaS
                </Badge>
                <h3 className="text-2xl font-bold mb-4">SaaS Platform Scales AI Compliance 10x</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  A B2B SaaS company went from 5 AI features to 50 in one year. Their compliance team couldn't keep up. 
                  CSOAI's API integration automated 85% of compliance checks:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">10x</div>
                    <div className="text-sm text-gray-600">AI Features Deployed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">2 hours</div>
                    <div className="text-sm text-gray-600">Per System Review</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">API</div>
                    <div className="text-sm text-gray-600">Fully Automated</div>
                  </div>
                </div>
                <blockquote className="mt-6 pl-6 border-l-4 border-purple-500 italic text-gray-700">
                  "The API integration was seamless. Now every new AI feature gets automatically assessed 
                  before deployment. We've gone from quarterly audits to real-time compliance."
                </blockquote>
                <p className="text-sm text-gray-500 mt-2">— VP of Engineering</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Why CSOAI Section */}
      <div className="bg-gradient-to-br from-slate-50 to-emerald-50 py-20">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Enterprises Choose CSOAI</h2>
            <p className="text-xl text-gray-600">
              The only platform that combines automation, accuracy, and affordability
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">33-Agent Byzantine Consensus</h3>
              <p className="text-gray-600 leading-relaxed">
                Unlike single-vendor AI tools, our 33-Agent Council uses 12 different AI providers for unbiased assessments. 
                No conflicts of interest. No vendor lock-in.
              </p>
            </Card>

            <Card className="p-8">
              <FileCheck className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Multi-Framework Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                One platform for EU AI Act, NIST AI RMF, and ISO 42001. Stop juggling multiple consultants 
                and tools. CSOAI covers all major global frameworks.
              </p>
            </Card>

            <Card className="p-8">
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">API-First Architecture</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrate compliance checks directly into your CI/CD pipeline. Automated assessments, 
                real-time alerts, and instant reports via REST API.
              </p>
            </Card>

            <Card className="p-8">
              <TrendingDown className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3">87% Cost Reduction</h3>
              <p className="text-gray-600 leading-relaxed">
                From $15K to $2K per system. Reduce compliance staff by 75%. Free up budget for innovation 
                instead of paperwork.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container py-20 max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-200">Simple Pricing</Badge>
          <h2 className="text-4xl font-bold mb-4">Transparent, Predictable Pricing</h2>
          <p className="text-xl text-gray-600">
            No hidden fees. No per-user charges. Pay only for the AI systems you monitor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <div className="text-4xl font-bold mb-4">$2,000<span className="text-lg text-gray-500">/system/year</span></div>
            <p className="text-gray-600 mb-6">Perfect for startups and small teams</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Up to 10 AI systems</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>33-Agent Council assessments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Quarterly compliance reports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Email support</span>
              </li>
            </ul>
            <Link href="/enterprise-onboarding">
              <Button className="w-full" variant="outline">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 border-4 border-emerald-500 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white">
              Most Popular
            </Badge>
            <h3 className="text-2xl font-bold mb-2">Professional</h3>
            <div className="text-4xl font-bold mb-4">$1,500<span className="text-lg text-gray-500">/system/year</span></div>
            <p className="text-gray-600 mb-6">For growing companies</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Up to 50 AI systems</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Everything in Starter</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Monthly compliance reports</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>API access</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Priority support</span>
              </li>
            </ul>
            <Link href="/enterprise-onboarding">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <div className="text-4xl font-bold mb-4">Custom</div>
            <p className="text-gray-600 mb-6">For large organizations</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Unlimited AI systems</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Real-time monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Custom SLAs</span>
              </li>
            </ul>
            <Link href="/enterprise-onboarding">
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-900 text-white py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Cut Compliance Costs by 87%?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join hundreds of enterprises using CSOAI to accelerate AI deployment while maintaining 
            rigorous safety standards. Start with a free trial—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enterprise-onboarding">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
