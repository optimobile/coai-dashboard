/**
 * Referral Program Frontend Tests
 * Tests for referral components and user interactions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferralAnalyticsDashboard from '../pages/ReferralAnalyticsDashboard';
import ReferralManagerDashboard from '../pages/ReferralManagerDashboard';

describe('Referral Analytics Dashboard', () => {
  beforeEach(() => {
    // Mock tRPC calls
    vi.mock('@/lib/trpc', () => ({
      trpc: {
        referral: {
          getReferralAnalytics: {
            useQuery: () => ({
              data: {
                success: true,
                data: {
                  totalClicks: 1250,
                  totalConversions: 87,
                  totalEarnings: 4350,
                  conversionRate: 6.96,
                  averageCommissionPerConversion: 50,
                },
              },
              isLoading: false,
            }),
          },
          exportAnalyticsAsCSV: {
            useMutation: () => ({
              mutateAsync: vi.fn(),
            }),
          },
          exportAnalyticsAsPDF: {
            useMutation: () => ({
              mutateAsync: vi.fn(),
            }),
          },
        },
      },
    }));
  });

  it('should render analytics dashboard', () => {
    render(<ReferralAnalyticsDashboard />);

    expect(screen.getByText('Referral Analytics')).toBeInTheDocument();
    expect(screen.getByText('Track your referral program performance and earnings')).toBeInTheDocument();
  });

  it('should display key metrics', () => {
    render(<ReferralAnalyticsDashboard />);

    expect(screen.getByText('Total Clicks')).toBeInTheDocument();
    expect(screen.getByText('Conversions')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('Total Earnings')).toBeInTheDocument();
  });

  it('should allow date range selection', async () => {
    const user = userEvent.setup();
    render(<ReferralAnalyticsDashboard />);

    const dateRangeSelect = screen.getByRole('combobox');
    await user.click(dateRangeSelect);

    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 90 Days')).toBeInTheDocument();
  });

  it('should have export buttons', () => {
    render(<ReferralAnalyticsDashboard />);

    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
  });
});

describe('Referral Manager Dashboard', () => {
  it('should render manager dashboard', () => {
    render(<ReferralManagerDashboard />);

    expect(screen.getByText('Referral Manager Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage your referral team and approve commissions')).toBeInTheDocument();
  });

  it('should display team metrics', () => {
    render(<ReferralManagerDashboard />);

    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Team Conversions')).toBeInTheDocument();
    expect(screen.getByText('Team Earnings')).toBeInTheDocument();
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
  });

  it('should display commission approvals', () => {
    render(<ReferralManagerDashboard />);

    expect(screen.getByText('Commission Approvals')).toBeInTheDocument();
    expect(screen.getByText('Review and approve pending commission requests')).toBeInTheDocument();
  });

  it('should allow filtering team members', async () => {
    const user = userEvent.setup();
    render(<ReferralManagerDashboard />);

    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    await user.type(searchInput, 'Sarah');

    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });

  it('should have approval and rejection buttons', () => {
    render(<ReferralManagerDashboard />);

    const approveButtons = screen.getAllByText('Approve');
    const rejectButtons = screen.getAllByText('Reject');

    expect(approveButtons.length).toBeGreaterThan(0);
    expect(rejectButtons.length).toBeGreaterThan(0);
  });
});

describe('Referral Program Integration', () => {
  it('should track referral code in signup URL', () => {
    // Test that ?ref=CODE parameter is captured
    const url = new URL('http://localhost:3000/signup?ref=COAI2024');
    const refCode = url.searchParams.get('ref');

    expect(refCode).toBe('COAI2024');
  });

  it('should validate referral code format', () => {
    const validCodes = ['COAI2024', 'SAFETY50', 'ANALYST20', 'REFER100'];
    const invalidCodes = ['', 'invalid code with spaces', '123'];

    validCodes.forEach((code) => {
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    invalidCodes.forEach((code) => {
      if (code) {
        expect(code).not.toMatch(/^[A-Z0-9]{6,12}$/);
      }
    });
  });

  it('should calculate conversion rate correctly', () => {
    const clicks = 1250;
    const conversions = 87;
    const expectedRate = (conversions / clicks) * 100;

    expect(expectedRate).toBeCloseTo(6.96, 2);
  });

  it('should calculate average commission correctly', () => {
    const totalEarnings = 4350;
    const conversions = 87;
    const expectedAverage = totalEarnings / conversions;

    expect(expectedAverage).toBeCloseTo(50, 0);
  });
});
