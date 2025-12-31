import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ChevronDown, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function FAQ() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          question: "What is CSOAI?",
          answer: "CSOAI (Council of AIs) is the world's first comprehensive AI safety platform that trains, certifies, and employs AI Safety Analysts. We combine human expertise with a 33-Agent Byzantine Council to ensure unbiased AI safety assessments. Our platform integrates with 12 global regulatory frameworks including the EU AI Act, UK AISI, US NIST RMF, and China TC260."
        },
        {
          question: "What is the difference between CSOAI and CEASAI?",
          answer: "**CSOAI (Council of AIs)** is our FREE public platform that includes:\n\n• The Watchdog incident reporting system\n• Public AI safety database\n• Free Watchdog Analyst training & certification\n• Community forum access\n\n**CEASAI (Certified European AI Safety Institute)** is our professional certification body that offers PAID courses:\n\n• Fundamentals: £499 (6 weeks)\n• Advanced: £999 (12 weeks)\n• Expert: £1,999 (16 weeks)\n\nCEASAI operates under CSOAI to provide legally recognized professional certifications."
        },
        {
          question: "Is the Watchdog program really free?",
          answer: "Yes! The CSOAI Watchdog program is 100% FREE. This includes:\n\n• Free Watchdog Analyst training\n• Free certification exam\n• Free digital certificate\n• Access to report AI safety incidents\n• Community forum access\n\nThe paid CEASAI courses (£499-£1,999) are optional professional certifications for those who want advanced training and career advancement."
        },
        {
          question: "Do I need any prior experience to become an AI Safety Analyst?",
          answer: "No prior experience required. We teach you everything from scratch. You only need critical thinking skills, attention to detail, and a commitment to protecting humanity from AI risks. Our Fundamentals course (£499) is designed for complete beginners."
        },
        {
          question: "How do I sign up?",
          answer: "Visit our signup page, enter your email, and create a password. You'll get instant access to free introductory training. No credit card required for the free content."
        },
        {
          question: "Is there free training available?",
          answer: "Yes! We offer free introductory modules to help you understand AI safety basics. For full certification, our courses start at £499 for Fundamentals, £999 for Advanced, and £1,999 for Expert level."
        }
      ]
    },
    {
      category: "Course Structure & Pricing",
      items: [
        {
          question: "What are the three certification levels?",
          answer: "We offer three certification tiers:\n\n• **Fundamentals (£499)** - 6 weeks, 10 modules, 100 exam questions. Perfect for beginners. Covers EU AI Act essentials, risk classification, and compliance basics.\n\n• **Advanced (£999)** - 12 weeks, 20 modules, 200 exam questions. For professionals. Includes NIST AI RMF, conformity assessment, quality management systems, and blockchain-verified certificate.\n\n• **Expert (£1,999)** - 16 weeks, 30 modules, 300 exam questions. Regulatory-level expertise. Covers TC260 framework, policy development, international harmonization, and includes government agency access."
        },
        {
          question: "How long does each course take?",
          answer: "Course durations are:\n\n• **Fundamentals**: 6 weeks (recommended pace: 5-7 hours/week)\n• **Advanced**: 12 weeks (recommended pace: 8-10 hours/week)\n• **Expert**: 16 weeks (recommended pace: 10-12 hours/week)\n\nYou can learn at your own pace. These are recommended timelines, but you have lifetime access to all course materials."
        },
        {
          question: "Are there payment plans available?",
          answer: "Yes! We offer flexible payment options:\n\n• **Pay in Full**: One-time payment at the listed price\n• **12-Month Plan**: Split your payment over 12 months\n• **24-Month Plan**: Lower monthly payments over 24 months\n• **36-Month Plan**: Lowest monthly payments over 36 months\n\nAll payment plans include a small financing fee but provide the same full access to course materials."
        },
        {
          question: "What's included in each course?",
          answer: "All courses include:\n\n• Full module access with video lessons\n• Interactive quizzes and assessments\n• Real-world case studies\n• Digital certificate upon completion\n• Lifetime access to course materials\n• Community forum access\n\nAdvanced and Expert levels also include:\n• Blockchain-verified certificates\n• Job board access\n• Professional community membership\n• Government portal integration (Expert only)"
        }
      ]
    },
    {
      category: "Exams & Certification",
      items: [
        {
          question: "How difficult is the certification exam?",
          answer: "Exam details by level:\n\n• **Fundamentals**: 100 multiple-choice questions, 90-minute time limit, 70% passing threshold\n• **Advanced**: 200 questions, 180-minute time limit, 75% passing threshold\n• **Expert**: 300 questions, 240-minute time limit, 80% passing threshold\n\nMost students pass on their first attempt with proper preparation. You can retake unlimited times."
        },
        {
          question: "Can I retake the exam if I fail?",
          answer: "Yes, unlimited retakes are included in your course fee. We provide detailed feedback after each attempt showing which areas need improvement. There's no penalty for retaking, and many students use their first attempt as a learning experience."
        },
        {
          question: "How long is the certification valid?",
          answer: "Certificate validity periods:\n\n• **Fundamentals**: 1 year validity\n• **Advanced**: 2 years validity\n• **Expert**: 3 years validity\n\nAfter expiration, you can renew by taking a shorter refresher exam to stay current with new frameworks and regulations. Renewal exams are discounted."
        },
        {
          question: "Are the certificates recognized by employers?",
          answer: "Yes! Our certifications are industry-recognized and aligned with major regulatory frameworks. Advanced and Expert certificates are blockchain-verified for authenticity. Many enterprises specifically look for CEASAI-certified analysts when hiring for AI compliance roles."
        }
      ]
    },
    {
      category: "Work & Earnings",
      items: [
        {
          question: "How much can I earn as an AI Safety Analyst?",
          answer: "Earnings vary by certification level:\n\n• **Fundamentals certified**: $45-65/hour\n• **Advanced certified**: $65-100/hour\n• **Expert certified**: $100-200/hour\n\nAll work is remote. Experienced analysts with Expert certification and specialized skills can earn significantly more, especially in consulting roles."
        },
        {
          question: "How do I find jobs after certification?",
          answer: "After certification, you can:\n\n1. Browse available AI safety monitoring jobs on our platform\n2. Access our job board (Advanced/Expert levels)\n3. Get matched with enterprises needing analyst support\n4. Apply directly to companies and negotiate terms\n5. Join our professional network for referrals"
        },
        {
          question: "Can I work part-time?",
          answer: "Yes, 100% flexible. You set your own hours and choose which jobs to take. Many analysts work part-time while maintaining other jobs or studying. Our platform supports both full-time and part-time work arrangements."
        },
        {
          question: "What if I don't get hired?",
          answer: "We have a large and growing network of enterprises. Most certified analysts find work within 1-2 weeks. If you don't, we offer:\n\n• Free career support and additional training\n• Resume and portfolio review\n• Interview preparation\n• Direct introductions to hiring partners"
        }
      ]
    },
    {
      category: "Platform & Technology",
      items: [
        {
          question: "What is the 33-Agent Byzantine Council?",
          answer: "Our 33-Agent Council uses AI models from 12+ different providers (OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral, Cohere, xAI, and more). Every safety decision requires 23 of 33 agents to agree (Byzantine fault tolerance). This prevents any single vendor from manipulating outcomes and ensures unbiased assessments."
        },
        {
          question: "Why do you use multiple AI providers?",
          answer: "Single-vendor AI safety tools can be biased or manipulated. By using 12+ providers, we ensure:\n\n• Unbiased assessments\n• Redundancy if one provider fails\n• Cross-validation of safety decisions\n• Protection against vendor manipulation\n\nIf one provider is compromised, the other providers catch it through consensus."
        },
        {
          question: "How do you integrate with government regulators?",
          answer: "We integrate with 12 global regulatory frameworks:\n\n• EU AI Act (European Union)\n• UK AI Safety Institute\n• US NIST AI RMF\n• China TC260\n• Canada AIDA\n• Australia AI Ethics Framework\n• Singapore IMDA\n• Japan METI AI Strategy\n• South Korea AI Act\n• Brazil AI Bill\n• India NITI Aayog\n• ISO/IEC 42001 (International)\n\nOur platform automatically tracks regulatory updates and adjusts compliance requirements."
        },
        {
          question: "Is my data private?",
          answer: "Yes. We encrypt all data in transit and at rest. You control what data you share. Watchdog reports are public by default to ensure transparency, but you can request anonymization for sensitive reports."
        }
      ]
    },
    {
      category: "Enterprise & Compliance",
      items: [
        {
          question: "I'm an enterprise. How does CSOAI help my company?",
          answer: "Register your AI systems on CSOAI. Our platform:\n\n• Automatically assesses compliance with EU AI Act, NIST, ISO, and TC260 standards\n• Provides real-time compliance scores\n• Tracks regulatory changes automatically\n• Implements SOAI-PDCA continuous improvement cycles\n• Helps avoid fines up to €35M under EU AI Act"
        },
        {
          question: "How much does enterprise compliance cost?",
          answer: "Enterprise plans start at $999/month for basic compliance monitoring. Custom pricing available for large organizations with complex AI portfolios. Contact our sales team for a demo and personalized quote."
        },
        {
          question: "Can we integrate CSOAI with our existing systems?",
          answer: "Yes. We provide:\n\n• REST APIs for programmatic access\n• Webhooks for real-time alerts\n• SDKs for Python and JavaScript\n• Enterprise SSO integration\n• Custom integrations for large deployments\n\nSee our API documentation at /api-docs for details."
        }
      ]
    },
    {
      category: "About CSOAI",
      items: [
        {
          question: "Who founded CSOAI?",
          answer: "CSOAI was founded by AI safety researchers and compliance experts who believe the world needs a transparent, unbiased platform for AI governance. We're building the Western equivalent of China's TC260 system."
        },
        {
          question: "Is CSOAI open source?",
          answer: "Yes, our core platform is open source on GitHub. We believe in transparency and community contribution to AI safety. Anyone can audit our code and contribute improvements."
        },
        {
          question: "How is CSOAI funded?",
          answer: "We're funded by:\n\n• Enterprise subscriptions\n• Certification course fees\n• Impact investors who believe in AI safety\n\nWe are NOT funded by AI companies, ensuring our independence and unbiased assessments."
        },
        {
          question: "What's your mission?",
          answer: "Our mission is to train, certify, and employ AI Safety Analysts who monitor AI systems for compliance and safety. We're building the workforce to enforce AI safety globally, with the goal of having 250,000 certified analysts by February 2026 to meet EU AI Act requirements."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 py-24">
          <div className="container max-w-4xl space-y-4">
            <Skeleton className="h-8 w-32 bg-white/10" />
            <Skeleton className="h-16 w-full bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>FAQ - CSOAI | Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about CSOAI, AI Safety Analyst training, certification pricing (£499/£999/£1,999), course duration, and employment." />
        <meta name="og:title" content="FAQ - CSOAI" />
        <meta name="og:description" content="Frequently asked questions about becoming an AI Safety Analyst. Courses from £499." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 py-24">
          <div className="container max-w-4xl">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              Have Questions?
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about CSOAI, training, certification, and careers.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-4xl py-20">
          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">£499</p>
              <p className="text-sm text-emerald-600">Fundamentals (6 weeks)</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">£999</p>
              <p className="text-sm text-blue-600">Advanced (12 weeks)</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">£1,999</p>
              <p className="text-sm text-purple-600">Expert (16 weeks)</p>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-12">
            {filteredFaqs.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
                <div className="space-y-4">
                  {category.items.map((item, itemIdx) => (
                    <Card
                      key={itemIdx}
                      className="border border-gray-200 overflow-hidden hover:border-emerald-600 transition-colors"
                    >
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === `${catIdx}-${itemIdx}` ? null : `${catIdx}-${itemIdx}`)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 text-left">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                            expandedIndex === `${catIdx}-${itemIdx}` ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {expandedIndex === `${catIdx}-${itemIdx}` && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.answer}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No FAQs match your search.</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Still Have Questions */}
          <div className="mt-20 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg mb-8 text-emerald-50">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
