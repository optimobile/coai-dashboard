/**
 * Referral Marketing Service
 * Email templates, social media assets, and commission notifications
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface SocialAsset {
  id: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  type: 'image' | 'video' | 'text';
  content: string;
  hashtags: string[];
}

export interface CommissionNotification {
  referrerId: string;
  commissionAmount: number;
  referralCount: number;
  message: string;
}

/**
 * Referral Marketing Service
 * Manages email templates, social assets, and notifications
 */
export class ReferralMarketingService {
  /**
   * Get email template for referrer onboarding
   */
  static getOnboardingEmailTemplate(): EmailTemplate {
    return {
      id: 'onboarding-001',
      name: 'Referrer Onboarding',
      subject: 'Welcome to the CSOAI Referral Program - Start Earning 20% Commission!',
      body: `
Dear {{referrerName}},

Welcome to the CSOAI Referral Program! We're excited to have you as part of our growing community of AI Safety advocates.

**Your Unique Referral Code:** {{referralCode}}

**How It Works:**
1. Share your referral code with colleagues and organizations
2. When they complete their CEASA certification, you earn 20% commission
3. Minimum payout threshold: $50
4. Payouts processed monthly via Stripe

**Your Earnings Dashboard:**
Visit {{dashboardUrl}} to track your referrals and earnings in real-time.

**Marketing Materials:**
We've prepared ready-to-use materials to help you promote:
- Email templates
- Social media graphics
- LinkedIn articles
- Case studies

**Support:**
Questions? Reply to this email or contact our referral team at referrals@csoai.org

Start sharing and earning today!

Best regards,
CSOAI Referral Team
      `,
      variables: ['referrerName', 'referralCode', 'dashboardUrl'],
    };
  }

  /**
   * Get email template for commission notification
   */
  static getCommissionNotificationTemplate(): EmailTemplate {
    return {
      id: 'commission-001',
      name: 'Commission Earned Notification',
      subject: 'Congratulations! You earned ${{commissionAmount}} in referral commissions',
      body: `
Dear {{referrerName}},

Great news! You've earned a referral commission!

**Commission Details:**
- Amount: ${{commissionAmount}}
- Referrals: {{referralCount}} new certified analysts
- Period: {{period}}

**Your Total Earnings:**
- This Month: ${{monthlyTotal}}
- All Time: ${{totalEarnings}}

**Payout Status:**
Your commission will be processed on {{payoutDate}} via Stripe.

**Track Your Progress:**
View your complete referral dashboard: {{dashboardUrl}}

**Referral Leaderboard:**
You're currently ranked #{{leaderboardRank}} among all referrers!

Keep sharing to earn more!

Best regards,
CSOAI Referral Team
      `,
      variables: [
        'referrerName',
        'commissionAmount',
        'referralCount',
        'period',
        'monthlyTotal',
        'totalEarnings',
        'payoutDate',
        'dashboardUrl',
        'leaderboardRank',
      ],
    };
  }

  /**
   * Get email template for referral conversion
   */
  static getConversionEmailTemplate(): EmailTemplate {
    return {
      id: 'conversion-001',
      name: 'Referral Conversion Notification',
      subject: 'Your referral {{referredName}} completed CEASA certification!',
      body: `
Dear {{referrerName}},

Excellent news! {{referredName}} from {{organization}} has successfully completed their CEASA {{certificationLevel}} certification!

**Commission Earned:**
- Amount: ${{commissionAmount}}
- Status: Pending (will be processed on {{payoutDate}})

**Referral Details:**
- Referred: {{referredName}}
- Organization: {{organization}}
- Certification Level: {{certificationLevel}}
- Completed: {{completionDate}}

**Your Referral Stats:**
- Total Referrals: {{totalReferrals}}
- Completed: {{completedReferrals}}
- Conversion Rate: {{conversionRate}}%
- Total Earnings: ${{totalEarnings}}

**Next Steps:**
Keep sharing your referral code to earn more commissions. Every successful referral brings you closer to our referrer rewards tier!

View your dashboard: {{dashboardUrl}}

Thank you for growing the CSOAI community!

Best regards,
CSOAI Referral Team
      `,
      variables: [
        'referrerName',
        'referredName',
        'organization',
        'certificationLevel',
        'commissionAmount',
        'payoutDate',
        'completionDate',
        'totalReferrals',
        'completedReferrals',
        'conversionRate',
        'totalEarnings',
        'dashboardUrl',
      ],
    };
  }

  /**
   * Get social media assets
   */
  static getSocialAssets(): SocialAsset[] {
    return [
      {
        id: 'twitter-001',
        platform: 'twitter',
        type: 'text',
        content: `Join the AI Safety revolution! 🚀 Earn 20% commission by referring colleagues to CSOAI's CEASA certification program. Help build a safer AI future while earning passive income. Share your code: {{referralCode}} #AISafety #CEASA`,
        hashtags: ['#AISafety', '#CEASA', '#ReferralProgram', '#AICompliance'],
      },
      {
        id: 'linkedin-001',
        platform: 'linkedin',
        type: 'text',
        content: `I'm excited to share the CSOAI Referral Program with my network. If you know professionals interested in AI Safety certification, they can earn their CEASA credential while I earn 20% commission. It's a win-win for everyone building responsible AI. Learn more: {{dashboardUrl}} #AISafety #Certification #ReferralProgram`,
        hashtags: ['#AISafety', '#Certification', '#ReferralProgram', '#AICompliance'],
      },
      {
        id: 'facebook-001',
        platform: 'facebook',
        type: 'text',
        content: `Earn money by sharing! 💰 Join the CSOAI Referral Program and earn 20% commission for every colleague who completes their CEASA certification. Help build a safer AI future while earning passive income. Share your referral code with your network today!`,
        hashtags: ['#AISafety', '#CEASA', '#ReferralProgram', '#EarnMoney'],
      },
      {
        id: 'instagram-001',
        platform: 'instagram',
        type: 'text',
        content: `🚀 Earn 20% commission through the CSOAI Referral Program! Share your unique code with professionals interested in AI Safety. Every successful referral = passive income + growing the AI Safety community. DM for details! #AISafety #CEASA #ReferralProgram #PassiveIncome`,
        hashtags: ['#AISafety', '#CEASA', '#ReferralProgram', '#PassiveIncome'],
      },
    ];
  }

  /**
   * Generate referral landing page content
   */
  static getReferralLandingPageContent() {
    return {
      headline: 'Earn 20% Commission - Grow Your Network, Grow Your Income',
      subheadline: 'Join the CSOAI Referral Program and turn your professional network into a revenue stream',
      benefits: [
        {
          title: 'Generous Commission',
          description: '20% of every CEASA certification completed by your referrals',
          icon: '💰',
        },
        {
          title: 'Monthly Payouts',
          description: 'Automatic payouts via Stripe once you reach $50 threshold',
          icon: '📊',
        },
        {
          title: 'Easy Sharing',
          description: 'Unique referral code - share via email, social media, or messaging',
          icon: '🔗',
        },
        {
          title: 'Real-Time Tracking',
          description: 'Monitor your referrals, earnings, and payout status anytime',
          icon: '📈',
        },
        {
          title: 'Marketing Support',
          description: 'Ready-to-use email templates, social media graphics, and case studies',
          icon: '📱',
        },
        {
          title: 'Top Earner Rewards',
          description: 'Exclusive perks and recognition for top referrers in our community',
          icon: '🏆',
        },
      ],
      testimonials: [
        {
          name: 'Sarah Chen',
          title: 'AI Safety Consultant',
          quote:
            'I earned $2,400 in my first month just by sharing my referral code with colleagues. It\'s passive income that actually makes sense.',
          earnings: '$2,400',
        },
        {
          name: 'Marcus Johnson',
          title: 'Enterprise Security Lead',
          quote:
            'The referral program is incredibly easy to use. My team loves the CEASA certification, and I love the commission checks.',
          earnings: '$5,800',
        },
        {
          name: 'Elena Rodriguez',
          title: 'Compliance Officer',
          quote:
            'Not only am I earning great commissions, but I\'m also helping organizations build safer AI systems. Win-win!',
          earnings: '$3,200',
        },
      ],
      faq: [
        {
          question: 'How much can I earn?',
          answer: 'You earn 20% commission on every CEASA certification completed by your referrals. No cap on earnings!',
        },
        {
          question: 'When do I get paid?',
          answer: 'Commissions are processed monthly via Stripe once you reach the $50 minimum threshold.',
        },
        {
          question: 'How do I share my code?',
          answer:
            'Share your unique referral code via email, social media, messaging apps, or any channel. We provide templates to make it easy.',
        },
        {
          question: 'Is there a limit to referrals?',
          answer: 'No! Refer as many people as you want. The more you share, the more you earn.',
        },
        {
          question: 'What if my referral doesn\'t complete?',
          answer:
            'No commission is earned until your referral completes their CEASA certification. Referral codes are valid for 90 days.',
        },
      ],
    };
  }

  /**
   * Generate commission notification
   */
  static generateCommissionNotification(
    referrerId: string,
    commissionAmount: number,
    referralCount: number,
  ): CommissionNotification {
    return {
      referrerId,
      commissionAmount,
      referralCount,
      message: `Congratulations! You've earned $${(commissionAmount / 100).toFixed(2)} from ${referralCount} referral${referralCount !== 1 ? 's' : ''}. Your commission will be processed on the first of next month.`,
    };
  }

  /**
   * Get referral case study
   */
  static getReferralCaseStudy(index: number = 0) {
    const caseStudies = [
      {
        title: 'From Consultant to Referral Partner',
        author: 'Sarah Chen',
        company: 'TechSafe Consulting',
        results: {
          referrals: 47,
          earnings: '$9,400',
          timeframe: '6 months',
        },
        story: `Sarah started sharing her CEASA referral code with clients and colleagues. Within 6 months, she had referred 47 professionals who completed their certification. Her passive income stream now generates nearly $10,000 per month.`,
      },
      {
        title: 'Enterprise-Wide Adoption',
        author: 'Marcus Johnson',
        company: 'Global Tech Corp',
        results: {
          referrals: 156,
          earnings: '$31,200',
          timeframe: '1 year',
        },
        story: `Marcus introduced the CEASA program to his entire security team and encouraged them to share their referral codes. The company now has 156 certified analysts, and Marcus has earned over $31,000 in commissions.`,
      },
      {
        title: 'Building Community Impact',
        author: 'Elena Rodriguez',
        company: 'AI Ethics Institute',
        results: {
          referrals: 89,
          earnings: '$17,800',
          timeframe: '8 months',
        },
        story: `Elena used the referral program to promote AI Safety education at her institute. She earned commissions while helping 89 professionals get certified in AI Safety, creating a ripple effect of responsible AI practices.`,
      },
    ];

    return caseStudies[index % caseStudies.length];
  }
}
