/**
 * Enhanced Header Component with Comprehensive Mega Menu
 * Showcases all CSOAI features, systems, and compliance frameworks
 */

import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  BookOpen,
  BarChart3,
  ChevronDown,
  Globe,
  Shield,
  Users,
  Eye,
  Zap,
  FileCheck,
  AlertTriangle,
  Code,
  Briefcase,
  Award,
  HelpCircle,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MegaMenuSection {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    name: string;
    href: string;
    description: string;
    badge?: string;
  }>;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  sections?: MegaMenuSection[];
}

export function EnhancedHeader() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation: NavigationItem[] = [
    {
      name: 'Compliance',
      href: '/compliance',
      icon: <Shield className="h-4 w-4" />,
      sections: [
        {
          title: 'Frameworks',
          icon: <FileCheck className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'EU AI Act',
              href: '/compliance/eu-ai-act',
              description: 'Compliance with EU regulations (Feb 2, 2026)',
              badge: 'URGENT',
            },
            {
              name: 'NIST AI RMF',
              href: '/compliance/nist',
              description: 'US AI Risk Management Framework',
            },
            {
              name: 'ISO 42001',
              href: '/compliance/iso-42001',
              description: 'AI Management System standards',
            },
            {
              name: 'TC260 (China)',
              href: '/compliance/tc260',
              description: 'China AI safety standards',
            },
          ],
        },
        {
          title: 'Assessment',
          icon: <AlertTriangle className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Run Assessment',
              href: '/compliance/assessment',
              description: 'Assess your AI systems',
            },
            {
              name: 'View Results',
              href: '/compliance/results',
              description: 'Assessment outcomes',
            },
            {
              name: 'Generate Reports',
              href: '/compliance/reports',
              description: 'Export compliance reports',
            },
          ],
        },
        {
          title: 'Systems',
          icon: <Zap className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'My AI Systems',
              href: '/ai-systems',
              description: 'Manage your AI systems',
            },
            {
              name: 'Risk Classification',
              href: '/ai-systems/risk',
              description: 'Classify system risks',
            },
            {
              name: 'Compliance Scoring',
              href: '/ai-systems/scoring',
              description: 'View compliance scores',
            },
          ],
        },
      ],
    },
    {
      name: 'Training',
      href: '/training',
      icon: <BookOpen className="h-4 w-4" />,
      sections: [
        {
          title: 'Courses',
          icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'EU AI Act Fundamentals',
              href: '/courses/eu-ai-act',
              description: '8 modules, 77 hours',
              badge: 'NEW',
            },
            {
              name: 'NIST AI RMF Fundamentals',
              href: '/courses/nist',
              description: '8 modules, comprehensive',
            },
            {
              name: 'ISO 42001 Fundamentals',
              href: '/courses/iso-42001',
              description: '8 modules, practical',
            },
            {
              name: 'Specialization Tracks',
              href: '/courses/specializations',
              description: '8 advanced specializations',
            },
          ],
        },
        {
          title: 'Your Learning',
          icon: <Award className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'My Courses',
              href: '/my-courses',
              description: 'Enrolled courses',
            },
            {
              name: 'Progress Dashboard',
              href: '/dashboard/progress',
              description: 'Learning analytics',
            },
            {
              name: 'My Certificates',
              href: '/certificates',
              description: 'Earned certifications',
            },
          ],
        },
      ],
    },
    {
      name: 'Certification',
      href: '/certification',
      icon: <Award className="h-4 w-4" />,
      sections: [
        {
          title: 'CEASAI Exams',
          icon: <Award className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Fundamentals Exam',
              href: '/exam',
              description: '50 questions, 90 minutes',
            },
            {
              name: 'Professional Exam',
              href: '/exam/professional',
              description: 'Advanced certification',
            },
            {
              name: 'Expert Exam',
              href: '/exam/expert',
              description: 'Highest certification level',
            },
          ],
        },
        {
          title: 'Certification Info',
          icon: <FileCheck className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Certification Path',
              href: '/ceasai',
              description: 'Learn about CEASAI',
            },
            {
              name: 'My Certificates',
              href: '/certificates',
              description: 'View earned certs',
            },
            {
              name: 'Verify Certificate',
              href: '/verify-certificate',
              description: 'Validate a certificate',
            },
          ],
        },
      ],
    },
    {
      name: 'Council',
      href: '/council',
      icon: <Users className="h-4 w-4" />,
      sections: [
        {
          title: '33-Agent Byzantine Council',
          icon: <Users className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'How It Works',
              href: '/council-detail',
              description: 'Byzantine consensus explained',
            },
            {
              name: 'Live Voting',
              href: '/council/voting',
              description: 'Active council sessions',
            },
            {
              name: 'Council Decisions',
              href: '/council/decisions',
              description: 'Historical decisions',
            },
            {
              name: 'Agent Performance',
              href: '/council/analytics',
              description: 'Agent voting patterns',
            },
          ],
        },
      ],
    },
    {
      name: 'Watchdog',
      href: '/watchdog',
      icon: <Eye className="h-4 w-4" />,
      sections: [
        {
          title: 'Report Incidents',
          icon: <AlertTriangle className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Submit Report',
              href: '/watchdog/submit',
              description: 'Report AI incident',
            },
            {
              name: 'Public Reports',
              href: '/watchdog-hub',
              description: 'Browse all reports',
            },
            {
              name: 'Report Statistics',
              href: '/watchdog/stats',
              description: 'Incident trends',
            },
          ],
        },
        {
          title: 'Analyst Program',
          icon: <Briefcase className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Job Board',
              href: '/jobs',
              description: 'Browse analyst positions',
            },
            {
              name: 'Analyst Leaderboard',
              href: '/watchdog-leaderboard',
              description: 'Top analysts',
            },
            {
              name: 'My Applications',
              href: '/my-applications',
              description: 'Job applications',
            },
            {
              name: 'Earnings',
              href: '/referral-program',
              description: 'Track your earnings',
            },
          ],
        },
      ],
    },
    {
      name: 'SOAI-PDCA',
      href: '/soai-pdca',
      icon: <Zap className="h-4 w-4" />,
      sections: [
        {
          title: 'Framework',
          icon: <Zap className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Framework Overview',
              href: '/soai-pdca',
              description: 'SOAI-PDCA methodology',
            },
            {
              name: 'Interactive Simulator',
              href: '/pdca-simulator',
              description: 'Try a demo cycle',
            },
            {
              name: 'Download Templates',
              href: '/soai-pdca/templates',
              description: '12 implementation templates',
            },
          ],
        },
        {
          title: 'Your Cycles',
          icon: <BarChart3 className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Active Cycles',
              href: '/pdca/active',
              description: 'Current PDCA cycles',
            },
            {
              name: 'Completed Cycles',
              href: '/pdca/completed',
              description: 'Historical cycles',
            },
            {
              name: 'Generate Reports',
              href: '/pdca/reports',
              description: 'PDCA reports',
            },
          ],
        },
      ],
    },
    {
      name: 'Enterprise',
      href: '/enterprise',
      icon: <Briefcase className="h-4 w-4" />,
      sections: [
        {
          title: 'Solutions',
          icon: <Briefcase className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Compliance Dashboard',
              href: '/enterprise-dashboard',
              description: 'Multi-system monitoring',
            },
            {
              name: 'Pricing Plans',
              href: '/pricing',
              description: 'Starter, Pro, Enterprise',
            },
            {
              name: 'Onboarding Wizard',
              href: '/enterprise-onboarding',
              description: 'Get started in 5 steps',
            },
          ],
        },
        {
          title: 'Developer',
          icon: <Code className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'API Documentation',
              href: '/api-docs',
              description: 'REST API reference',
            },
            {
              name: 'SDKs & Libraries',
              href: '/enterprise-integration',
              description: 'Integration tools',
            },
            {
              name: 'Webhook Integration',
              href: '/settings/webhooks',
              description: 'Real-time events',
            },
            {
              name: 'API Keys',
              href: '/admin/api-keys',
              description: 'Manage API access',
            },
          ],
        },
      ],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      sections: [
        {
          title: 'Dashboards',
          icon: <BarChart3 className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Executive Dashboard',
              href: '/dashboard/executive',
              description: 'Real-time metrics',
            },
            {
              name: 'Compliance Trends',
              href: '/analytics',
              description: 'Historical analysis',
            },
            {
              name: 'Risk Analytics',
              href: '/analytics/risk',
              description: 'Risk insights',
            },
          ],
        },
        {
          title: 'Reports & Export',
          icon: <FileCheck className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Custom Reports',
              href: '/reports',
              description: 'Generate reports',
            },
            {
              name: 'Export Data',
              href: '/reports/export',
              description: 'PDF, CSV, JSON',
            },
            {
              name: 'Audit Trail',
              href: '/audit',
              description: 'Security events',
            },
          ],
        },
      ],
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: <HelpCircle className="h-4 w-4" />,
      sections: [
        {
          title: 'Learn',
          icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'About CSOAI',
              href: '/about',
              description: 'Our mission & vision',
            },
            {
              name: 'Advisory Board',
              href: '/advisory-board',
              description: 'Leadership team',
            },
            {
              name: 'Research',
              href: '/research',
              description: 'Publications & papers',
            },
          ],
        },
        {
          title: 'Community',
          icon: <Users className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Blog & News',
              href: '/blog',
              description: 'Latest updates',
            },
            {
              name: 'Events & Webinars',
              href: '/events',
              description: 'Upcoming events',
            },
            {
              name: 'Newsletter',
              href: '/newsletter',
              description: 'Subscribe for updates',
            },
          ],
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src="/csoai-icon.svg.png"
              alt="CSOAI"
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">CSOAI</span>
              <span className="text-xs text-emerald-600 font-semibold">Open Public Regulatory Authority</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive(item.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {item.sections && <ChevronDown className="h-3 w-3" />}
                </a>

                {/* Mega Menu */}
                {item.sections && activeDropdown === item.name && (
                  <div className="absolute left-0 top-full mt-0 w-screen max-w-6xl bg-white rounded-lg shadow-xl border border-gray-200 py-6 px-8 z-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {item.sections.map((section) => (
                        <div key={section.title}>
                          <div className="flex items-center gap-2 mb-4">
                            {section.icon}
                            <h3 className="font-bold text-gray-900 text-sm">{section.title}</h3>
                          </div>
                          <ul className="space-y-2">
                            {section.items.map((subItem) => (
                              <li key={subItem.name}>
                                <a
                                  href={subItem.href}
                                  className="block p-2 rounded hover:bg-emerald-50 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {subItem.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {subItem.description}
                                      </div>
                                    </div>
                                    {subItem.badge && (
                                      <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSelector />
            {user ? (
              <>
                <NotificationCenter />
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {item.name}
                </a>
                {item.sections && (
                  <div className="pl-4 space-y-1">
                    {item.sections.map((section) =>
                      section.items.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-xs text-gray-600 hover:text-emerald-600"
                        >
                          {subItem.name}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
