/**
 * Login Page
 * OAuth-based authentication with CSOAI branding
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleLogin = () => {
    // Redirect to OAuth endpoint
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <img src="/csoai-icon.svg.png" alt="CSOAI" className="h-12 w-12" />
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">CSOAI</span>
          </div>
          
          <h1 className="text-lg sm:text-xl md:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome Back to the Future of AI Safety
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Join certified AI Safety Analysts protecting humanity from AI risks while
            building rewarding careers.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Access Your Training</h3>
                <p className="text-sm text-gray-600">
                  Continue your courses and track progress toward certification
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage AI Systems</h3>
                <p className="text-sm text-gray-600">
                  Monitor compliance and run assessments with our 33-Agent Council
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Earn Certifications</h3>
                <p className="text-sm text-gray-600">
                  Get recognized credentials that employers worldwide trust
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Sign In to CSOAI</CardTitle>
            <CardDescription>
              Secure authentication powered by OAuth
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleLogin}
            >
              Sign In with OAuth
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to CSOAI?</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setLocation('/signup')}
            >
              Create Free Account
            </Button>

            <p className="text-xs text-center text-gray-500">
              By signing in, you agree to our{' '}
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
