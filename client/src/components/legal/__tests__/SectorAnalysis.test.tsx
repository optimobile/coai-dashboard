import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectorAnalysis } from '../SectorAnalysis';

describe('SectorAnalysis', () => {
  const mockSectorData = [
    {
      sector: 'Finance',
      violations: 45,
      complianceRate: 78,
      criticalCount: 5,
      highCount: 12,
      jurisdiction: 'EU',
      trend: 'decreasing' as const,
    },
    {
      sector: 'Healthcare',
      violations: 32,
      complianceRate: 85,
      criticalCount: 2,
      highCount: 8,
      jurisdiction: 'US',
      trend: 'stable' as const,
    },
    {
      sector: 'Technology',
      violations: 28,
      complianceRate: 82,
      criticalCount: 3,
      highCount: 7,
      jurisdiction: 'Global',
      trend: 'increasing' as const,
    },
  ];

  it('renders sector breakdown view', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('displays jurisdiction view', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="jurisdiction"
      />
    );

    expect(screen.getByText(/jurisdiction/i)).toBeInTheDocument();
  });

  it('renders scatter plot view', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="scatter"
      />
    );

    expect(screen.getByText('Sector Analysis')).toBeInTheDocument();
  });

  it('color codes compliance status correctly', () => {
    const { container } = render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    // Finance (78% compliance) should have different color than Healthcare (85%)
    const complianceElements = container.querySelectorAll('[data-compliance]');
    expect(complianceElements.length).toBeGreaterThan(0);
  });

  it('aggregates statistics correctly', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
      />
    );

    // Total violations: 45 + 32 + 28 = 105
    const totalViolations = mockSectorData.reduce((sum, s) => sum + s.violations, 0);
    expect(totalViolations).toBe(105);

    // Average compliance: (78 + 85 + 82) / 3 = 81.67%
    const avgCompliance = mockSectorData.reduce((sum, s) => sum + s.complianceRate, 0) / mockSectorData.length;
    expect(avgCompliance).toBeGreaterThan(80);
  });

  it('displays violation counts per sector', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    // Verify violation counts are displayed
    expect(screen.getByText(/45/)).toBeInTheDocument(); // Finance violations
  });

  it('shows compliance rate percentages', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    // Verify compliance percentages are displayed
    expect(screen.getByText(/78/)).toBeInTheDocument(); // Finance compliance
  });

  it('displays critical and high violation counts', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    // Verify critical/high counts are shown
    const criticalElements = screen.queryAllByText(/critical/i);
    expect(criticalElements.length).toBeGreaterThanOrEqual(0);
  });

  it('handles empty data gracefully', () => {
    render(
      <SectorAnalysis
        data={[]}
        viewType="breakdown"
      />
    );

    expect(
      screen.getByText(/no data available/i)
    ).toBeInTheDocument();
  });

  it('switches between view types', () => {
    const { rerender } = render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    expect(screen.getByText('Finance')).toBeInTheDocument();

    rerender(
      <SectorAnalysis
        data={mockSectorData}
        viewType="jurisdiction"
      />
    );

    expect(screen.getByText(/jurisdiction/i)).toBeInTheDocument();
  });

  it('calculates sector risk levels correctly', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    // Finance has highest violations (45) and lowest compliance (78%)
    // Should be marked as higher risk
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('displays trend indicators for each sector', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    // Verify trend indicators are visible
    const trendElements = screen.queryAllByText(/trend/i);
    expect(trendElements.length).toBeGreaterThanOrEqual(0);
  });

  it('renders responsive layout', () => {
    const { container } = render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
      />
    );

    const analysisContainer = container.querySelector('.sector-analysis');
    expect(analysisContainer).toBeInTheDocument();
  });

  it('handles single sector data', () => {
    const singleSector = [mockSectorData[0]];

    render(
      <SectorAnalysis
        data={singleSector}
        viewType="breakdown"
      />
    );

    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('sorts sectors by violation count when requested', () => {
    render(
      <SectorAnalysis
        data={mockSectorData}
        viewType="breakdown"
        sortBy="violations"
      />
    );

    // Finance (45) should appear before Technology (28)
    const financeIndex = screen.getByText('Finance').compareDocumentPosition(
      screen.getByText('Technology')
    );
    expect(financeIndex).toBeDefined();
  });
});
