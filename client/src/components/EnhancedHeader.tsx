/*
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
  FileText,
  Info,
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
          icon: <FileCheck className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Run Assessment',
              href: '/compliance/assessment',
              description: 'Start compliance evaluation',
            },
            {
              name: 'Assessment History',
              href: '/compliance/history',
              description: 'View past assessments',
            },
            {
              name: 'Generate Reports',
              href: '/compliance/reports',
              description: 'Export compliance reports',
            },
          ],
        },
      ],
    },
    {
      name: 'AI Systems',
      href: '/ai-systems',
      icon: <Shield className="h-4 w-4" />,
      sections: [
        {
          title: 'Management',
          icon: <Shield className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'All Systems',
              href: '/ai-systems',
              description: 'View all registered systems',
            },
            {
              name: 'Add New System',
              href: '/ai-systems/add',
              description: 'Register a new AI system',
            },
            {
              name: 'System Details',
              href: '/ai-systems/details',
              description: 'View system information',
            },
          ],
        },
        {
          title: 'Risk Management',
          icon: <AlertTriangle className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Risk Assessment',
              href: '/ai-systems/risk',
              description: 'Assess system risks',
            },
            {
              name: 'Incident Reports',
              href: '/ai-systems/incidents',
              description: 'View reported incidents',
            },
            {
              name: 'Mitigation Plans',
              href: '/ai-systems/mitigation',
              description: 'Risk mitigation strategies',
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
          title: 'Public Database',
          icon: <Eye className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Incident Database',
              href: '/watchdog/incidents',
              description: 'Search all incidents',
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
              name: 'Compliance Analytics',
              href: '/analytics/compliance',
              description: 'Compliance trends',
            },
            {
              name: 'Incident Analytics',
              href: '/analytics/incidents',
              description: 'Incident patterns',
            },
          ],
        },
        {
          title: 'Reports',
          icon: <FileText className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Generate Report',
              href: '/analytics/reports/generate',
              description: 'Create custom reports',
            },
            {
              name: 'Saved Reports',
              href: '/analytics/reports/saved',
              description: 'Your reports',
            },
            {
              name: 'Export Data',
              href: '/analytics/export',
              description: 'Download datasets',
            },
          ],
        },
      ],
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: <BookOpen className="h-4 w-4" />,
      sections: [
        {
          title: 'Documentation',
          icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'Getting Started',
              href: '/docs/getting-started',
              description: 'Quick start guide',
            },
            {
              name: 'User Guide',
              href: '/docs/user-guide',
              description: 'Complete documentation',
            },
            {
              name: 'FAQ',
              href: '/docs/faq',
              description: 'Frequently asked questions',
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
    {
      name: 'About',
      href: '/about',
      icon: <Info className="h-4 w-4" />,
      sections: [
        {
          title: 'Company',
          icon: <Info className="h-5 w-5 text-emerald-600" />,
          items: [
            {
              name: 'About CSOAI',
              href: '/about',
              description: 'Our mission and vision',
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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <img
              src="/csoai-icon.svg.png"
              alt="CSOAI"
              className="h-10 w-10"
            />
            <div className="flex flex-col hidden sm:flex">
              <span className="text-2xl font-bold text-slate-900">CSOAI</span>
              <span className="text-xs text-emerald-600 font-semibold">Open Public Regulatory Authority</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-0.5 flex-1 justify-center">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
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
                  <div className="absolute left-0 top-full mt-0 w-screen max-w-6xl bg-white rounded-lg shadow-xl border border-gray-200 py-6 px-8 z-50 max-h-[70vh] overflow-y-auto">
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
          <div className="hidden lg:flex items-center space-x-1">
            {/* Language Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-700 px-2 h-8">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <LanguageSelector />
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <>
                <NotificationCenter />
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-700 px-2 h-8">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-700 px-2 h-8">
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
                  <Button variant="ghost" size="sm" className="px-2 h-8">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
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
          <div className="lg:hidden pb-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
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
