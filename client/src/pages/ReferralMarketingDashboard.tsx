/**
 * Referral Marketing Dashboard
 * Email templates, social media assets, and campaign management
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Share2, TrendingUp, Copy, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function ReferralMarketingDashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const emailTemplates = [
    {
      id: 'onboarding',
      name: 'Referrer Onboarding',
      subject: 'Welcome to the CSOAI Referral Program - Start Earning 20% Commission!',
      preview: 'Get started with your unique referral code and start earning...',
      variables: ['referrerName', 'referralCode', 'dashboardUrl'],
    },
    {
      id: 'commission',
      name: 'Commission Earned',
      subject: 'Congratulations! You earned ${{commissionAmount}} in referral commissions',
      preview: 'Your commission has been calculated and will be processed...',
      variables: ['referrerName', 'commissionAmount', 'referralCount'],
    },
    {
      id: 'conversion',
      name: 'Referral Conversion',
      subject: 'Your referral {{referredName}} completed CEASA certification!',
      preview: 'Great news! Your referral has successfully completed...',
      variables: ['referrerName', 'referredName', 'commissionAmount'],
    },
  ];

  const socialAssets = [
    {
      id: 'twitter-001',
      platform: 'Twitter',
      type: 'Text Post',
      content:
        'Join the AI Safety revolution! 🚀 Earn 20% commission by referring colleagues to CSOAI\'s CEASA certification program.',
      hashtags: ['#AISafety', '#CEASA', '#ReferralProgram'],
      engagement: 'High',
    },
    {
      id: 'linkedin-001',
      platform: 'LinkedIn',
      type: 'Article',
      content:
        'I\'m excited to share the CSOAI Referral Program with my network. If you know professionals interested in AI Safety certification...',
      hashtags: ['#AISafety', '#Certification', '#ReferralProgram'],
      engagement: 'Very High',
    },
    {
      id: 'facebook-001',
      platform: 'Facebook',
      type: 'Community Post',
      content:
        'Earn money by sharing! 💰 Join the CSOAI Referral Program and earn 20% commission for every colleague who completes their CEASA certification.',
      hashtags: ['#AISafety', '#EarnMoney'],
      engagement: 'Medium',
    },
  ];

  const caseStudies = [
    {
      author: 'Sarah Chen',
      company: 'TechSafe Consulting',
      referrals: 47,
      earnings: '$9,400',
      timeframe: '6 months',
      story: 'From Consultant to Referral Partner',
    },
    {
      author: 'Marcus Johnson',
      company: 'Global Tech Corp',
      referrals: 156,
      earnings: '$31,200',
      timeframe: '1 year',
      story: 'Enterprise-Wide Adoption',
    },
    {
      author: 'Elena Rodriguez',
      company: 'AI Ethics Institute',
      referrals: 89,
      earnings: '$17,800',
      timeframe: '8 months',
      story: 'Building Community Impact',
    },
  ];

  const handleCopyTemplate = (templateId: string) => {
    toast.success('Email template copied to clipboard!');
  };

  const handleDownloadAsset = (assetId: string) => {
    toast.success('Social media asset downloaded!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                Referral Marketing Campaign
              </h1>
              <p className="text-gray-600 mt-1">Email templates, social assets, and case studies</p>
            </div>
          </div>
        </motion.div>

        {/* Campaign Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Referrers</p>
                  <p className="text-3xl font-bold text-emerald-600">342</p>
                </div>
                <Share2 className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-blue-600">8</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Commissions</p>
                  <p className="text-3xl font-bold text-purple-600">$124.5K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Conversion</p>
                  <p className="text-3xl font-bold text-orange-600">18%</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Tabs defaultValue="emails" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="emails">Email Templates</TabsTrigger>
              <TabsTrigger value="social">Social Media Assets</TabsTrigger>
              <TabsTrigger value="cases">Case Studies</TabsTrigger>
            </TabsList>

            {/* Email Templates Tab */}
            <TabsContent value="emails" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email Templates for Referrers
                  </CardTitle>
                  <CardDescription>
                    Ready-to-use email templates for referrer outreach and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emailTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ y: -2 }}
                      className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                        </div>
                        <Badge variant="outline">{template.variables.length} variables</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{template.preview}</p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            handleCopyTemplate(template.id);
                          }}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy Template
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Assets Tab */}
            <TabsContent value="social" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-600" />
                    Social Media Assets
                  </CardTitle>
                  <CardDescription>
                    Pre-designed graphics and copy for social media promotion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialAssets.map((asset) => (
                    <motion.div
                      key={asset.id}
                      whileHover={{ y: -2 }}
                      className="p-4 border rounded-lg hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{asset.platform}</h3>
                            <Badge variant="secondary">{asset.type}</Badge>
                            <Badge
                              variant="outline"
                              className={
                                asset.engagement === 'Very High'
                                  ? 'border-green-600 text-green-600'
                                  : asset.engagement === 'High'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-yellow-600 text-yellow-600'
                              }
                            >
                              {asset.engagement}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 italic">"{asset.content}"</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {asset.hashtags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-blue-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAsset(asset.id);
                            handleCopyTemplate(asset.id);
                          }}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Case Studies Tab */}
            <TabsContent value="cases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Success Stories & Case Studies
                  </CardTitle>
                  <CardDescription>
                    Real examples of top referrers and their earnings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {caseStudies.map((study, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                        className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100"
                      >
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-900">{study.story}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {study.author} • {study.company}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Referrals:</span>
                            <span className="font-semibold text-purple-600">{study.referrals}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Earnings:</span>
                            <span className="font-semibold text-green-600">{study.earnings}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Timeframe:</span>
                            <span className="font-semibold text-gray-900">{study.timeframe}</span>
                          </div>
                        </div>

                        <Button size="sm" variant="outline" className="w-full gap-2">
                          <Eye className="w-4 h-4" />
                          Read Full Story
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Campaign Management */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>Create and manage referral marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <Mail className="w-4 h-4" />
                  Create Email Campaign
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  <Share2 className="w-4 h-4" />
                  Schedule Social Posts
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
                  <TrendingUp className="w-4 h-4" />
                  View Campaign Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
