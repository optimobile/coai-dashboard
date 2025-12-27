/**
 * Signup Page
 * OAuth-based registration with CSOAI branding
 */

import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, CheckCircle2, Star, Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Signup() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);

  // Extract referral code from URL and redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }

    // Extract referral code from query parameters
    const params = new URLSearchParams(search);
    const ref = params.get('ref');
    const referrer = params.get('referrer');
    if (ref) {
      setReferralCode(ref);
      setReferrerName(referrer || 'A CSOAI Member');
    }
  }, [user, setLocation, search]);

  const handleSignup = () => {
    // Pass referral code to OAuth signup endpoint
    const signupUrl = referralCode 
      ? `/api/auth/signup?ref=${encodeURIComponent(referralCode)}`
      : '/api/auth/signup';
    window.location.href = signupUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <img src="/csoai-icon.svg.png" alt="CSOAI" className="h-12 w-12" />
            <span className="text-3xl font-bold text-gray-900">CSOAI</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your AI Safety Career Today
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Join the global movement of AI Safety Analysts. Get certified, earn credentials, and
            protect humanity from AI risks.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-5 w-5 text-green-600 fill-green-600" />
              <Star className="h-5 w-5 text-green-600 fill-green-600" />
              <Star className="h-5 w-5 text-green-600 fill-green-600" />
              <Star className="h-5 w-5 text-green-600 fill-green-600" />
              <Star className="h-5 w-5 text-green-600 fill-green-600" />
            </div>
            <p className="text-sm text-green-900 font-medium mb-2">
              "CSOAI certification opened doors I didn't know existed. Within 3 months, I landed a
              $120K AI Safety Analyst role."
            </p>
            <p className="text-xs text-green-700">— Sarah Chen, Certified AI Safety Analyst</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">15+ Professional Courses</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive training on EU AI Act, NIST, TC260, and more
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Globally Recognized Certificates</h3>
                <p className="text-sm text-gray-600">
                  University-grade credentials trusted by employers worldwide
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">100% Independent</h3>
                <p className="text-sm text-gray-600">
                  No ties to OpenAI, Google, Microsoft, or any AI vendor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Create Your Free Account</CardTitle>
            <CardDescription>
              Start learning in under 60 seconds
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What's Included (Free):</h3>
              <ul className="space-y-1 text-sm text-emerald-800">
                <li>✓ Access to 3 foundation courses</li>
                <li>✓ Progress tracking dashboard</li>
                <li>✓ Community forum access</li>
                <li>✓ Certificate upon completion</li>
              </ul>
            </div>

            {referralCode && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Referral Bonus!</span>
                </div>
                <p className="text-sm text-amber-800">
                  {referrerName} referred you. Complete your certification and earn rewards together!
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSignup}
            >
              Sign Up with OAuth
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setLocation('/login')}
            >
              Sign In Instead
            </Button>

            {referralCode && (
              <p className="text-xs text-center text-amber-600 font-medium">
                Referral Code: <code className="bg-amber-100 px-2 py-1 rounded">{referralCode}</code>
              </p>
            )}

            <p className="text-xs text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
