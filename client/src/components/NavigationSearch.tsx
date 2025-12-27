/**
 * Navigation Search Component
 * Quick search for features, pages, and documentation
 */

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useLocation } from 'wouter';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  icon?: string;
}

const searchIndex: SearchResult[] = [
  // Compliance
  {
    id: 'compliance-eu',
    title: 'EU AI Act Compliance',
    description: 'Compliance with EU regulations',
    href: '/compliance/eu-ai-act',
    category: 'Compliance',
  },
  {
    id: 'compliance-nist',
    title: 'NIST AI Risk Management',
    description: 'US AI Risk Management Framework',
    href: '/compliance/nist',
    category: 'Compliance',
  },
  {
    id: 'compliance-iso',
    title: 'ISO 42001 Standards',
    description: 'AI Management System standards',
    href: '/compliance/iso-42001',
    category: 'Compliance',
  },
  // Training
  {
    id: 'training-courses',
    title: 'Browse Courses',
    description: 'EU AI Act, NIST, ISO 42001 courses',
    href: '/courses',
    category: 'Training',
  },
  {
    id: 'training-my-courses',
    title: 'My Courses',
    description: 'Your enrolled courses',
    href: '/my-courses',
    category: 'Training',
  },
  // Certification
  {
    id: 'cert-fundamentals',
    title: 'CEASAI Fundamentals Exam',
    description: 'Take the fundamentals certification exam',
    href: '/exam',
    category: 'Certification',
  },
  {
    id: 'cert-my-certs',
    title: 'My Certificates',
    description: 'View your earned certificates',
    href: '/certificates',
    category: 'Certification',
  },
  // Council
  {
    id: 'council-voting',
    title: 'Live Council Voting',
    description: 'Active 33-Agent Council sessions',
    href: '/council/voting',
    category: 'Council',
  },
  // Watchdog
  {
    id: 'watchdog-report',
    title: 'Report AI Incident',
    description: 'Submit an incident report',
    href: '/watchdog/submit',
    category: 'Watchdog',
  },
  {
    id: 'watchdog-jobs',
    title: 'Analyst Jobs',
    description: 'Browse analyst opportunities',
    href: '/jobs',
    category: 'Watchdog',
  },
  // SOAI-PDCA
  {
    id: 'pdca-simulator',
    title: 'PDCA Simulator',
    description: 'Interactive PDCA cycle demo',
    href: '/pdca-simulator',
    category: 'SOAI-PDCA',
  },
  // Enterprise
  {
    id: 'enterprise-api',
    title: 'API Documentation',
    description: 'REST API reference and guides',
    href: '/api-docs',
    category: 'Enterprise',
  },
  {
    id: 'enterprise-pricing',
    title: 'Pricing Plans',
    description: 'View pricing and plans',
    href: '/pricing',
    category: 'Enterprise',
  },
  // Analytics
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'View compliance trends',
    href: '/analytics',
    category: 'Analytics',
  },
  {
    id: 'analytics-reports',
    title: 'Custom Reports',
    description: 'Generate and export reports',
    href: '/reports',
    category: 'Analytics',
  },
  // Resources
  {
    id: 'resources-about',
    title: 'About CSOAI',
    description: 'Learn about our mission',
    href: '/about',
    category: 'Resources',
  },
  {
    id: 'resources-blog',
    title: 'Blog & News',
    description: 'Latest updates and articles',
    href: '/blog',
    category: 'Resources',
  },
];

export function NavigationSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  // Search functionality
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery)
    );

    setResults(filtered);
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        window.location.href = results[selectedIndex].href;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, results, selectedIndex]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Search navigation"
      >
        <Search className="h-5 w-5 text-gray-600" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search features, pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <a
                  key={result.id}
                  href={result.href}
                  className={`block px-4 py-3 transition-colors ${
                    index === selectedIndex
                      ? 'bg-emerald-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {result.description}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 ml-2">
                      {result.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : query ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500">
                Type to search features and pages
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
