/**
 * CSOAI Watchdog Page - Public AI Safety Reporting Hub
 * Public reporting platform where anyone can view and submit AI safety reports
 * Free signup for report submission and analyst training
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle2,
  Users,
  Shield,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function Watchdog() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch public reports
  const { data: reports = [] } = trpc.watchdog.getPublicReports.useQuery();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-24">
          <div className="container max-w-6xl space-y-4">
            <Skeleton className="h-8 w-64 bg-white/10 mx-auto" />
            <Skeleton className="h-20 w-full bg-white/10" />
            <Skeleton className="h-16 w-3/4 bg-white/10 mx-auto" />
          </div>
        </div>
        <div className="container py-20 space-y-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Reports</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  const stats = [
    { label: "Public Reports", value: reports.length.toString(), icon: FileText },
    { label: "Community Reviewers", value: "2,847", icon: Users },
    { label: "Systems Monitored", value: "18,392", icon: Shield },
    { label: "Safety Issues Identified", value: "3,247", icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-24">
        <div className="container max-w-6xl">
          <div className="text-center">
            <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-base px-4 py-1">
              Public Watchdog
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              AI Safety Reporting Hub
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed mb-4 max-w-4xl mx-auto">
              Report AI safety concerns. Review community findings. Join the movement to make AI systems safer for everyone.
            </p>
            <p className="text-xl text-emerald-300 font-semibold mb-10">
              100% free. Transparent. Community-driven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/watchdog/submit">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8">
                  Submit a Report
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/watchdog/browse">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  Browse Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container py-16 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="p-6 text-center border-2 border-gray-100">
                <Icon className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <div className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{stat.value}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{stat.label}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Free Signup Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 py-20 border-t border-emerald-200">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">Sign Up for Free</h2>
              <p className="text-lg text-gray-700 mb-8">
                Join our community of AI safety advocates. No credit card required.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-relaxed">Submit AI Safety Reports</h3>
                    <p className="text-gray-600 mt-1 leading-relaxed">Report issues with AI systems you encounter</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-relaxed">Access Free Training</h3>
                    <p className="text-gray-600 mt-1 leading-relaxed">Learn AI safety fundamentals with our open-source courses</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-relaxed">Become an Analyst</h3>
                    <p className="text-gray-600 mt-1 leading-relaxed">Get certified and start earning reviewing AI systems</p>
                  </div>
                </div>
              </div>
              <Link href="/signup?type=watchdog">
                <Button size="lg" className="mt-8 bg-emerald-600 hover:bg-emerald-700">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Free Training Courses */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Free Training Courses</h3>
              
              <Card className="p-6 border-2 border-emerald-200">
                <Badge className="mb-3 bg-emerald-100 text-emerald-700">Fundamentals</Badge>
                <h4 className="font-bold text-lg mb-3 leading-relaxed">EU AI Act Basics</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">Learn the fundamentals of EU AI Act compliance</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 leading-relaxed">
                  <BookOpen className="h-4 w-4" />
                  <span>3 hours • Free</span>
                </div>
              </Card>

              <Card className="p-6 border-2 border-emerald-200">
                <Badge className="mb-3 bg-emerald-100 text-emerald-700">Fundamentals</Badge>
                <h4 className="font-bold text-lg mb-3 leading-relaxed">AI Risk Assessment</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">Identify and evaluate AI system risks</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 leading-relaxed">
                  <BookOpen className="h-4 w-4" />
                  <span>4 hours • Free</span>
                </div>
              </Card>

              <Card className="p-6 border-2 border-emerald-200">
                <Badge className="mb-3 bg-emerald-100 text-emerald-700">Fundamentals</Badge>
                <h4 className="font-bold text-lg mb-3 leading-relaxed">Bias Detection Methods</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">Detect and mitigate bias in AI systems</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 leading-relaxed">
                  <BookOpen className="h-4 w-4" />
                  <span>3.5 hours • Free</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="container py-20 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">Recent Reports</h2>
          <p className="text-xl text-gray-600">
            See what the community has reported. All reports are public and transparent.
          </p>
        </div>

        {reports.length === 0 ? (
          <Card className="p-12 text-center">
            <Eye className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-6">Be the first to submit an AI safety report</p>
            <Link href="/watchdog/submit">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Submit First Report
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.slice(0, 5).map((report: any) => (
              <Card key={report.id} className="p-6 border-2 border-gray-100 hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700">{report.severity}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{report.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{report.reviewCount || 0} reviews</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/watchdog/browse">
            <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              View All Reports
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="container max-w-6xl">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Sign Up Free</h3>
              <p className="text-gray-600">
                Create your free account. No credit card or technical background required.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Report or Learn</h3>
              <p className="text-gray-600">
                Submit AI safety reports or take free training courses to build your skills.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Get Certified</h3>
              <p className="text-gray-600">
                Complete certification and start earning by reviewing AI systems professionally.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-20">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make AI Safer?</h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join thousands of community members protecting AI systems from safety risks.
          </p>
          <Link href="/signup?type=watchdog">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
