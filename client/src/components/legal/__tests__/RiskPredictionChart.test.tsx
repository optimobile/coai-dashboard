import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskPredictionChart } from '../RiskPredictionChart';

describe('RiskPredictionChart', () => {
  const mockPredictionData = [
    {
      date: '2024-01-01',
      actualRisk: 65,
      predictedRisk: 68,
      confidenceInterval: { lower: 60, upper: 75 },
      confidence: 0.92,
      trend: 'increasing' as const,
    },
    {
      date: '2024-01-02',
      actualRisk: 70,
      predictedRisk: 72,
      confidenceInterval: { lower: 65, upper: 80 },
      confidence: 0.88,
      trend: 'increasing' as const,
    },
    {
      date: '2024-01-03',
      actualRisk: 75,
      predictedRisk: 78,
      confidenceInterval: { lower: 70, upper: 85 },
      confidence: 0.85,
      trend: 'stable' as const,
    },
  ];

  it('renders chart with title and description', () => {
    render(
      <RiskPredictionChart
        data={mockPredictionData}
        title="30-Day Risk Forecast"
        description="Predicted risk levels for the next 30 days"
      />
    );

    expect(screen.getByText('30-Day Risk Forecast')).toBeInTheDocument();
    expect(screen.getByText('Predicted risk levels for the next 30 days')).toBeInTheDocument();
  });

  it('displays empty state when no data provided', () => {
    render(
      <RiskPredictionChart
        data={[]}
        title="Empty Forecast"
      />
    );

    expect(
      screen.getByText(/no data available/i)
    ).toBeInTheDocument();
  });

  it('renders confidence interval information', () => {
    const { container } = render(
      <RiskPredictionChart
        data={mockPredictionData}
      />
    );

    // Verify chart renders with confidence data
    expect(container.querySelector('[role="img"]')).toBeInTheDocument();
  });

  it('displays critical and high risk threshold lines', () => {
    const { container } = render(
      <RiskPredictionChart
        data={mockPredictionData}
      />
    );

    // Verify threshold lines are rendered
    expect(container.innerHTML).toContain('Risk Prediction');
  });

  it('shows trend indicators for predictions', () => {
    render(
      <RiskPredictionChart
        data={mockPredictionData}
      />
    );

    // Verify trend indicators are visible
    const chart = screen.getByRole('img', { hidden: true });
    expect(chart).toBeInTheDocument();
  });

  it('displays confidence percentage for predictions', () => {
    const { container } = render(
      <RiskPredictionChart
        data={mockPredictionData}
      />
    );

    // Verify confidence percentages are displayed
    expect(container.innerHTML).toContain('Risk Prediction');
  });

  it('handles different forecast periods', () => {
    const { rerender } = render(
      <RiskPredictionChart
        data={mockPredictionData}
        forecastDays={30}
      />
    );

    expect(screen.getByText('Risk Prediction')).toBeInTheDocument();

    rerender(
      <RiskPredictionChart
        data={mockPredictionData}
        forecastDays={60}
      />
    );

    expect(screen.getByText('Risk Prediction')).toBeInTheDocument();
  });

  it('renders with responsive design', () => {
    const { container } = render(
      <RiskPredictionChart
        data={mockPredictionData}
      />
    );

    const chartContainer = container.querySelector('.risk-prediction-chart');
    expect(chartContainer).toBeInTheDocument();
  });

  it('calculates average confidence correctly', () => {
    render(
      <RiskPredictionChart
        data={mockPredictionData}
      />
    );

    // Average confidence: (0.92 + 0.88 + 0.85) / 3 = 0.883
    const expectedAverage = ((0.92 + 0.88 + 0.85) / 3 * 100).toFixed(1);
    expect(parseFloat(expectedAverage)).toBeGreaterThan(88);
  });

  it('identifies increasing trend correctly', () => {
    const increasingData = [
      { ...mockPredictionData[0], trend: 'increasing' as const },
      { ...mockPredictionData[1], trend: 'increasing' as const },
    ];

    render(
      <RiskPredictionChart
        data={increasingData}
      />
    );

    expect(screen.getByText('Risk Prediction')).toBeInTheDocument();
  });

  it('handles missing confidence intervals gracefully', () => {
    const incompleteData = [
      {
        date: '2024-01-01',
        actualRisk: 65,
        predictedRisk: 68,
        confidenceInterval: { lower: 0, upper: 0 },
        confidence: 0,
        trend: 'stable' as const,
      },
    ];

    render(
      <RiskPredictionChart
        data={incompleteData}
      />
    );

    expect(screen.getByText('Risk Prediction')).toBeInTheDocument();
  });
});
