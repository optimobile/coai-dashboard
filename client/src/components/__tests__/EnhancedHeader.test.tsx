import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedHeader } from '../EnhancedHeader';
import { BrowserRouter } from 'react-router-dom';

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
  }),
}));

// Mock the LanguageSelector
vi.mock('../LanguageSelector', () => ({
  LanguageSelector: () => <div>Language Selector</div>,
}));

// Mock the NotificationCenter
vi.mock('../NotificationCenter', () => ({
  NotificationCenter: () => <div>Notification Center</div>,
}));

describe('EnhancedHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header with logo and branding', () => {
    render(
      <BrowserRouter>
        <EnhancedHeader />
      </BrowserRouter>
    );

    expect(screen.getByText('CSOAI')).toBeInTheDocument();
    expect(screen.getByText('Open Public Regulatory Authority')).toBeInTheDocument();
  });

  it('renders all main navigation items', () => {
    render(
      <BrowserRouter>
        <EnhancedHeader />
      </BrowserRouter>
    );

    expect(screen.getByText('Compliance')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();
    expect(screen.getByText('Certification')).toBeInTheDocument();
    expect(screen.getByText('Council')).toBeInTheDocument();
    expect(screen.getByText('Watchdog')).toBeInTheDocument();
    expect(screen.getByText('SOAI-PDCA')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('shows Sign In and Get Started buttons when user is not logged in', () => {
    render(
      <BrowserRouter>
        <EnhancedHeader />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(
      <BrowserRouter>
        <EnhancedHeader />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', async () => {
    render(
      <BrowserRouter>
        <EnhancedHeader />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg')
    );

    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton);
      
      await waitFor(() => {
        // Mobile menu should show navigation items
        const complianceLink = screen.getAllByText('Compliance').find(el => 
          el.closest('a')?.getAttribute('href') === '/compliance'
        );
        expect(complianceLink).toBeInTheDocument();
      });
    }
  });

  it('has proper accessibility attributes', () => {
    render(
      <BrowserRouter>
        <EnhancedHeader />
      </BrowserRouter>
    );

    const navItems = screen.getAllByText(/Compliance|Training|Certification/);
    navItems.forEach(item => {
      const link = item.closest('a');
      expect(link).toHaveAttribute('href');
    });
  });
});
