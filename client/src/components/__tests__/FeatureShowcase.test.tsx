import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureShowcase, CompactFeatureGrid } from '../FeatureShowcase';
import { BrowserRouter } from 'react-router-dom';

describe('FeatureShowcase', () => {
  it('renders the feature showcase section', () => {
    render(
      <BrowserRouter>
        <FeatureShowcase />
      </BrowserRouter>
    );

    expect(screen.getByText('Comprehensive AI Safety Platform')).toBeInTheDocument();
  });

  it('displays all 8 main features', () => {
    render(
      <BrowserRouter>
        <FeatureShowcase />
      </BrowserRouter>
    );

    expect(screen.getByText('Compliance Frameworks')).toBeInTheDocument();
    expect(screen.getByText('33-Agent Council')).toBeInTheDocument();
    expect(screen.getByText('Watchdog Program')).toBeInTheDocument();
    expect(screen.getByText('SOAI-PDCA')).toBeInTheDocument();
    expect(screen.getByText('Training & Courses')).toBeInTheDocument();
    expect(screen.getByText('CEASAI Certification')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Insights')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Solutions')).toBeInTheDocument();
  });

  it('shows feature descriptions', () => {
    render(
      <BrowserRouter>
        <FeatureShowcase />
      </BrowserRouter>
    );

    expect(screen.getByText(/EU AI Act, NIST, ISO 42001, TC260 standards/)).toBeInTheDocument();
    expect(screen.getByText(/Byzantine consensus for AI safety decisions/)).toBeInTheDocument();
  });

  it('displays badges for new and urgent features', () => {
    render(
      <BrowserRouter>
        <FeatureShowcase />
      </BrowserRouter>
    );

    expect(screen.getByText('NEW')).toBeInTheDocument();
    expect(screen.getByText('URGENT')).toBeInTheDocument();
  });

  it('has proper links to feature pages', () => {
    render(
      <BrowserRouter>
        <FeatureShowcase />
      </BrowserRouter>
    );

    const complianceLink = screen.getByText('Compliance Frameworks').closest('a');
    expect(complianceLink).toHaveAttribute('href', '/compliance');

    const councilLink = screen.getByText('33-Agent Council').closest('a');
    expect(councilLink).toHaveAttribute('href', '/council');
  });
});

describe('CompactFeatureGrid', () => {
  it('renders compact feature grid', () => {
    render(
      <BrowserRouter>
        <CompactFeatureGrid />
      </BrowserRouter>
    );

    expect(screen.getByText('Compliance Frameworks')).toBeInTheDocument();
    expect(screen.getByText('33-Agent Council')).toBeInTheDocument();
  });

  it('displays 4 main features in grid', () => {
    render(
      <BrowserRouter>
        <CompactFeatureGrid />
      </BrowserRouter>
    );

    const gridItems = screen.getAllByRole('link');
    expect(gridItems.length).toBeGreaterThanOrEqual(4);
  });
});
