/**
 * Unified Header Component with Mega Menu
 * Professional navigation with CSOAI branding and comprehensive dropdown menus
 */

import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings, BookOpen, BarChart3, ChevronDown, Globe } from 'lucide-react';
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

export function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navigation = [
    { 
      name: 'Training', 
      href: '/training',
      submenu: [
        { name: 'Courses', href: '/courses', description: 'Browse courses' },
        { name: 'My Courses', href: '/my-courses', description: 'Your courses' },
      ]
    },
    { 
      name: 'Certification', 
      href: '/certification',
      submenu: [
        { name: 'Exam', href: '/exam', description: 'Take exam' },
        { name: 'My Certs', href: '/certificates', description: 'Your certificates' },
      ]
    },
    { 
      name: 'SOAI-PDCA', 
      href: '/soai-pdca',
      submenu: [
        { name: 'Framework', href: '/soai-pdca', description: 'Learn about SOAI-PDCA' },
        { name: 'Simulator', href: '/pdca-simulator', description: 'Interactive demo' },
      ]
    },
    { 
      name: 'Watchdog', 
      href: '/watchdog',
      submenu: [
        { name: 'Report', href: '/watchdog', description: 'Report incident' },
        { name: 'Jobs', href: '/jobs', description: 'Analyst jobs' },
      ]
    },
    { 
      name: 'Enterprise', 
      href: '/enterprise',
      submenu: [
        { name: 'Pricing', href: '/pricing', description: 'Plans' },
        { name: 'API', href: '/api-docs', description: 'Developers' },
      ]
    },
    { 
      name: 'Resources', 
      href: '/resources',
      submenu: [
        { name: 'About', href: '/about', description: 'About us' },
        { name: 'Blog', href: '/blog', description: 'News' },
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, itemName: string, submenuLength: number) => {
    if (!activeDropdown) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setActiveDropdown(null);
        setFocusedItemIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedItemIndex((prev) => {
          const next = prev + 1;
          if (next < submenuLength) {
            menuItemsRef.current[next]?.focus();
            return next;
          }
          return prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedItemIndex((prev) => {
          const next = prev - 1;
          if (next >= 0) {
            menuItemsRef.current[next]?.focus();
            return next;
          }
          return prev;
        });
        break;
      case 'Tab':
        // Allow natural tab behavior but close dropdown
        setActiveDropdown(null);
        setFocusedItemIndex(-1);
        break;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setFocusedItemIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset focused item when dropdown changes
  useEffect(() => {
    if (!activeDropdown) {
      setFocusedItemIndex(-1);
      menuItemsRef.current = [];
    }
  }, [activeDropdown]);

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
            <span className="text-2xl font-bold text-slate-900">CSOAI</span>
          </a>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <a
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === '/'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              Home
            </a>
            
            {navigation.map((item) => (
              <div
                key={item.name}
                ref={activeDropdown === item.name ? dropdownRef : null}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
                onKeyDown={(e) => handleKeyDown(e, item.name, item.submenu?.length || 0)}
              >
                <a
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    isActive(item.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  aria-expanded={activeDropdown === item.name}
                  aria-haspopup="true"
                  onClick={(e) => {
                    if (activeDropdown === item.name) {
                      e.preventDefault();
                      setActiveDropdown(null);
                    } else {
                      setActiveDropdown(item.name);
                    }
                  }}
                >
                  {item.name}
                  <ChevronDown className="h-3 w-3" />
                </a>
                
                {/* Mega Menu Dropdown */}
                {activeDropdown === item.name && item.submenu && (
                  <div 
                    className="absolute left-0 top-full mt-1 w-72 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    role="menu"
                    aria-label={`${item.name} submenu`}
                  >
                    {item.submenu.map((subItem, idx) => (
                      <a 
                        key={subItem.name} 
                        href={subItem.href} 
                        ref={(el) => { menuItemsRef.current[idx] = el; }}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors focus:bg-emerald-50 focus:outline-none"
                        role="menuitem"
                        tabIndex={0}
                      >
                        <div className="font-medium text-gray-900 text-sm">{subItem.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{subItem.description}</div>
                      </a>
                    ))}
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
                    <Button variant="ghost" size="sm" className="text-gray-700">
                      <User className="h-4 w-4 mr-2" />
                      {user.name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-courses">
                        <a className="flex items-center w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          My Courses
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/progress">
                        <a className="flex items-center w-full">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          My Progress
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <a className="flex items-center w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Mobile Menu */}
            <div className="fixed left-0 right-0 top-18 bottom-0 bg-white overflow-y-auto z-50 lg:hidden border-t border-gray-200">
              <div className="flex flex-col space-y-2 p-4">
              <a
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === '/'
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              
              {navigation.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors block ${
                      isActive(item.href)
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                  {item.submenu && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-xs text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/my-courses">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Courses
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-gray-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
