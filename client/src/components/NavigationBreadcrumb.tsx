/**
 * Navigation Breadcrumb Component
 * Shows current page location and allows quick navigation
 */

import { Link, useLocation } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Home', href: '/' },
    { label: 'Dashboard' },
  ],
  '/compliance': [
    { label: 'Home', href: '/' },
    { label: 'Compliance' },
  ],
  '/training': [
    { label: 'Home', href: '/' },
    { label: 'Training' },
  ],
  '/certification': [
    { label: 'Home', href: '/' },
    { label: 'Certification' },
  ],
  '/council': [
    { label: 'Home', href: '/' },
    { label: 'Council' },
  ],
  '/watchdog': [
    { label: 'Home', href: '/' },
    { label: 'Watchdog' },
  ],
  '/soai-pdca': [
    { label: 'Home', href: '/' },
    { label: 'SOAI-PDCA' },
  ],
  '/enterprise': [
    { label: 'Home', href: '/' },
    { label: 'Enterprise' },
  ],
  '/analytics': [
    { label: 'Home', href: '/' },
    { label: 'Analytics' },
  ],
  '/api-docs': [
    { label: 'Home', href: '/' },
    { label: 'Enterprise', href: '/enterprise' },
    { label: 'API Documentation' },
  ],
  '/settings': [
    { label: 'Home', href: '/' },
    { label: 'Settings' },
  ],
};

export function NavigationBreadcrumb() {
  const [location] = useLocation();

  // Find matching breadcrumbs
  let breadcrumbs = routeBreadcrumbs[location];
  
  // If exact match not found, try parent routes
  if (!breadcrumbs) {
    const pathSegments = location.split('/').filter(Boolean);
    for (let i = pathSegments.length; i > 0; i--) {
      const parentPath = '/' + pathSegments.slice(0, i).join('/');
      if (routeBreadcrumbs[parentPath]) {
        breadcrumbs = routeBreadcrumbs[parentPath];
        break;
      }
    }
  }

  // Default breadcrumb
  if (!breadcrumbs) {
    breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: location.split('/').filter(Boolean).pop() || 'Page' },
    ];
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href}>
              <a className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                {index === 0 && <Home className="h-4 w-4" />}
                {item.label}
              </a>
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      ))}
    </nav>
  );
}
