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
          answer: "CSOAI is the world's first comprehensive AI safety platform that trains, certifies, and employs AI Safety Analysts. We combine human expertise with a 33-Agent Byzantine Council to ensure unbiased AI safety assessments."
        },
        {
          question: "Do I need any prior experience to become an AI Safety Analyst?",
          answer: "No prior experience required. We teach you everything from scratch. You only need critical thinking skills, attention to detail, and a commitment to protecting humanity from AI risks."
        },
        {
          question: "How do I sign up?",
          answer: "Visit our signup page, enter your email, and create a password. You'll get instant access to free training. No credit card required."
        },
        {
          question: "Is the training really free?",
          answer: "Yes, 100% free. We make money when you get certified and start earning as an analyst. Your success is our success."
        }
      ]
    },
    {
      category: "Training & Certification",
      items: [
        {
          question: "How long does the training take?",
          answer: "Most students complete training in 4-6 hours. You can learn at your own pace and take breaks whenever you want. There's no time limit."
        },
        {
          question: "What topics does the training cover?",
          answer: "The training covers EU AI Act, NIST AI RMF, ISO 42001, incident analysis, compliance assessment, and real-world case studies from AI safety incidents."
        },
        {
          question: "How difficult is the certification exam?",
          answer: "The exam has 50 multiple-choice questions, 90-minute time limit, and 70% passing threshold. Most students pass on their first attempt. You can retake it unlimited times."
        },
        {
          question: "Can I retake the exam if I fail?",
          answer: "Yes, unlimited retakes. We provide detailed feedback after each attempt to help you improve. There's no penalty for retaking."
        },
        {
          question: "How long is the certification valid?",
          answer: "Your certification is valid for 2 years. After that, you can renew by taking a shorter refresher exam to stay current with new frameworks and regulations."
        }
      ]
    },
    {
      category: "Work & Earnings",
      items: [
        {
          question: "How much can I earn as an AI Safety Analyst?",
          answer: "Entry-level analysts start at $45/hour. Experienced analysts earn $75-150/hour depending on expertise, case complexity, and specialization. All work is remote."
        },
        {
          question: "How do I find jobs?",
          answer: "After certification, you can browse available AI safety monitoring jobs on our platform. We match you with enterprises that need analyst support. You apply directly and negotiate terms."
        },
        {
          question: "Can I work part-time?",
          answer: "Yes, 100% flexible. You set your own hours and choose which jobs to take. Many analysts work part-time while maintaining other jobs."
        },
        {
          question: "How do I get paid?",
          answer: "You work directly with enterprises through our platform. We handle invoicing and payment processing. You get paid weekly or bi-weekly depending on the job."
        },
        {
          question: "What if I don't get hired?",
          answer: "We have a large and growing network of enterprises. Most certified analysts find work within 1-2 weeks. If you don't, we offer free support and additional training."
        }
      ]
    },
    {
      category: "Platform & Technology",
      items: [
        {
          question: "What is the 33-Agent Council?",
          answer: "Our 33-Agent Council uses 12 different AI providers (OpenAI, Anthropic, Google, etc.). Every safety decision requires 23 of 33 agents to agree. This Byzantine consensus prevents any single vendor from manipulating outcomes."
        },
        {
          question: "Why do you use multiple AI providers?",
          answer: "Single-vendor AI safety tools can be biased or manipulated. By using 12 providers, we ensure unbiased assessments. If one provider is compromised, the other 11 catch it."
        },
        {
          question: "Is my data private?",
          answer: "Yes. We encrypt all data in transit and at rest. You control what data you share. Watchdog reports are public by default to ensure transparency, but you can request anonymization."
        },
        {
          question: "What frameworks does CSOAI support?",
          answer: "We support EU AI Act, NIST AI RMF, ISO 42001, and China TC260. We're constantly adding new frameworks based on regulatory updates."
        }
      ]
    },
    {
      category: "Enterprise & Compliance",
      items: [
        {
          question: "I'm an enterprise. How does CSOAI help my company?",
          answer: "Register your AI systems on CSOAI. Our platform automatically assesses compliance with EU AI Act, NIST, and ISO standards. You get real-time compliance scores and can avoid fines up to €35M."
        },
        {
          question: "How much does enterprise compliance cost?",
          answer: "Enterprise plans start at $999/month for basic compliance monitoring. Custom pricing available for large organizations. Contact our sales team for a demo."
        },
        {
          question: "Can we integrate CSOAI with our existing systems?",
          answer: "Yes. We provide REST APIs and webhooks for seamless integration. Our API documentation is available at /api-docs."
        },
        {
          question: "What if we find compliance issues?",
          answer: "Our platform provides detailed remediation recommendations. You can track fixes through our PDCA (Plan-Do-Check-Act) cycle management system."
        }
      ]
    },
    {
      category: "About CSOAI",
      items: [
        {
          question: "Who founded CSOAI?",
          answer: "CSOAI was founded by AI safety researchers and compliance experts who believe the world needs a transparent, unbiased platform for AI governance."
        },
        {
          question: "Is CSOAI open source?",
          answer: "Yes, our core platform is open source on GitHub. We believe in transparency and community contribution to AI safety."
        },
        {
          question: "How is CSOAI funded?",
          answer: "We're funded by enterprise subscriptions, analyst earnings revenue share, and impact investors who believe in AI safety. We're not funded by AI companies, ensuring independence."
        },
        {
          question: "What's your mission?",
          answer: "Our mission is to train, certify, and employ AI Safety Analysts who monitor AI systems for compliance and safety. We're building the workforce to enforce AI safety globally."
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
        <meta name="description" content="Find answers to common questions about CSOAI, AI Safety Analyst training, certification, and employment." />
        <meta name="og:title" content="FAQ - CSOAI" />
        <meta name="og:description" content="Frequently asked questions about becoming an AI Safety Analyst." />
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
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
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
