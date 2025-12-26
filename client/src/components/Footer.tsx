/**
 * Unified Footer Component
 * Professional footer with CSOAI branding and comprehensive links
 */

import { Link } from 'wouter';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Training Courses', href: '/training' },
        { name: 'Certification', href: '/certification' },
        { name: 'Watchdog Reports', href: '/watchdog' },
        { name: 'Analyst Workbench', href: '/workbench' },
        { name: 'API Documentation', href: '/api-docs' },
      ],
    },
    {
      title: 'Frameworks',
      links: [
        { name: 'SOAI-PDCA Framework', href: '/soai-pdca' },
        { name: 'Accreditation', href: '/accreditation' },
        { name: 'EU AI Act', href: '/frameworks/eu-ai-act' },
        { name: 'NIST AI RMF', href: '/frameworks/nist' },
        { name: 'China TC260', href: '/frameworks/tc260' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Mission', href: '/about#mission' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/csoai' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/csoai' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/csoai' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@csoai.org' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <a className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity">
                <img
                  src="/csoai-icon.svg.png"
                  alt="CSOAI"
                  className="h-10 w-10"
                />
                <span className="text-2xl font-bold">CSOAI</span>
              </a>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Building the future of AI safety through independent training, certification, and transparent oversight.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>
                      <a className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} CSOAI. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy">
              <a className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Terms of Service
              </a>
            </Link>
            <Link href="/cookies">
              <a className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Cookie Policy
              </a>
            </Link>
            <Link href="/accessibility">
              <a className="text-gray-400 hover:text-emerald-500 text-sm transition-colors">
                Accessibility
              </a>
            </Link>
          </div>
        </div>

        {/* Independence Statement */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-gray-500 text-xs text-center max-w-4xl mx-auto">
            CSOAI is an independent organization with no financial ties to OpenAI, Anthropic, Google, Microsoft, Meta, or any AI vendor. 
            Our only incentive is public safety and workforce development.
          </p>
        </div>
      </div>
    </footer>
  );
}
