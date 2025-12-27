/**
 * Feature Showcase Component
 * Displays key CSOAI systems and features with visual cards
 */

import { Shield, Users, Eye, Zap, FileCheck, BarChart3, BookOpen, Award } from 'lucide-react';
import { Link } from 'wouter';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  color: string;
}

const features: Feature[] = [
  {
    id: 'compliance',
    name: 'Compliance Frameworks',
    description: 'EU AI Act, NIST, ISO 42001, TC260 standards',
    icon: <Shield className="h-6 w-6" />,
    href: '/compliance',
    badge: 'URGENT',
    color: 'bg-red-50 border-red-200',
  },
  {
    id: 'council',
    name: '33-Agent Council',
    description: 'Byzantine consensus for AI safety decisions',
    icon: <Users className="h-6 w-6" />,
    href: '/council',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'watchdog',
    name: 'Watchdog Program',
    description: 'Report incidents, analyst opportunities',
    icon: <Eye className="h-6 w-6" />,
    href: '/watchdog',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'pdca',
    name: 'SOAI-PDCA',
    description: 'Continuous improvement framework',
    icon: <Zap className="h-6 w-6" />,
    href: '/soai-pdca',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'training',
    name: 'Training & Courses',
    description: 'EU AI Act, NIST, ISO 42001 courses',
    icon: <BookOpen className="h-6 w-6" />,
    href: '/training',
    badge: 'NEW',
    color: 'bg-green-50 border-green-200',
  },
  {
    id: 'certification',
    name: 'CEASAI Certification',
    description: 'Fundamentals, Professional, Expert exams',
    icon: <Award className="h-6 w-6" />,
    href: '/certification',
    color: 'bg-indigo-50 border-indigo-200',
  },
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    description: 'Dashboards, reports, audit trails',
    icon: <BarChart3 className="h-6 w-6" />,
    href: '/analytics',
    color: 'bg-cyan-50 border-cyan-200',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solutions',
    description: 'API, webhooks, multi-system monitoring',
    icon: <FileCheck className="h-6 w-6" />,
    href: '/enterprise',
    color: 'bg-emerald-50 border-emerald-200',
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive AI Safety Platform
          </h2>
          <p className="text-lg text-gray-600">
            All the tools you need for compliance, training, and AI safety governance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.href}>
              <a className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-105 cursor-pointer ${feature.color}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Compact Feature Grid for Sidebar or Dashboard
 */
export function CompactFeatureGrid() {
  const mainFeatures = features.slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-4">
      {mainFeatures.map((feature) => (
        <Link key={feature.id} href={feature.href}>
          <a className="block p-4 rounded-lg border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50 transition-all">
            <div className="text-emerald-600 mb-2">
              {feature.icon}
            </div>
            <h4 className="font-semibold text-sm text-gray-900">
              {feature.name}
            </h4>
          </a>
        </Link>
      ))}
    </div>
  );
}

/**
 * Feature Card for Landing Pages
 */
interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Link href={feature.href}>
      <a className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg ${feature.color}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-emerald-600">
            {feature.icon}
          </div>
          {feature.badge && (
            <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">
              {feature.badge}
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 mb-2">
          {feature.name}
        </h3>
        <p className="text-sm text-gray-600">
          {feature.description}
        </p>
      </a>
    </Link>
  );
}
