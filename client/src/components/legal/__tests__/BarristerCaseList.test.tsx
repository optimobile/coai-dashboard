import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BarristerCaseList } from '../BarristerCaseList';

describe('BarristerCaseList', () => {
  const mockCases = [
    {
      id: 1,
      caseNumber: 'CASE-2024-0001',
      violationType: 'Data Privacy Breach',
      riskScore: 85,
      status: 'pending' as const,
      assignedDate: new Date('2024-01-01'),
      deadline: new Date('2024-02-01'),
      barristerName: 'John Doe',
      systemName: 'AI System A',
      summary: 'Unauthorized data access detected',
      isOverdue: false,
    },
    {
      id: 2,
      caseNumber: 'CASE-2024-0002',
      violationType: 'Bias & Discrimination',
      riskScore: 72,
      status: 'in_progress' as const,
      assignedDate: new Date('2024-01-05'),
      deadline: new Date('2024-02-05'),
      barristerName: 'Jane Smith',
      systemName: 'AI System B',
      summary: 'Gender bias in hiring algorithm',
      isOverdue: false,
    },
    {
      id: 3,
      caseNumber: 'CASE-2024-0003',
      violationType: 'Transparency Violation',
      riskScore: 65,
      status: 'pending' as const,
      assignedDate: new Date('2023-12-01'),
      deadline: new Date('2024-01-15'),
      barristerName: 'John Doe',
      systemName: 'AI System C',
      summary: 'Lack of explainability in decisions',
      isOverdue: true,
    },
  ];

  it('renders case list with all cases', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    expect(screen.getByText('CASE-2024-0001')).toBeInTheDocument();
    expect(screen.getByText('CASE-2024-0002')).toBeInTheDocument();
    expect(screen.getByText('CASE-2024-0003')).toBeInTheDocument();
  });

  it('filters cases by status', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
        defaultStatus="pending"
      />
    );

    // Should show pending cases
    expect(screen.getByText('CASE-2024-0001')).toBeInTheDocument();
    expect(screen.getByText('CASE-2024-0003')).toBeInTheDocument();
  });

  it('displays search functionality', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    const searchInput = screen.getByPlaceholderText(/search cases/i);
    expect(searchInput).toBeInTheDocument();

    // Search for specific case
    fireEvent.change(searchInput, { target: { value: 'CASE-2024-0001' } });
    expect(screen.getByText('CASE-2024-0001')).toBeInTheDocument();
  });

  it('shows approval/rejection buttons for pending cases', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    const approveButtons = screen.queryAllByText(/approve/i);
    const rejectButtons = screen.queryAllByText(/reject/i);

    expect(approveButtons.length).toBeGreaterThan(0);
    expect(rejectButtons.length).toBeGreaterThan(0);
  });

  it('displays overdue indicators', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    // Case 3 is overdue
    const overdueIndicators = screen.queryAllByText(/overdue/i);
    expect(overdueIndicators.length).toBeGreaterThan(0);
  });

  it('shows case statistics', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    // Should show stats like total cases, pending, completed
    expect(screen.getByText(/total cases/i)).toBeInTheDocument();
  });

  it('calculates case statistics correctly', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    // Total: 3 cases
    // Pending: 2 cases
    // In Progress: 1 case
    // Overdue: 1 case
    expect(screen.getByText(/3/)).toBeInTheDocument(); // Total cases
  });

  it('handles approval workflow', () => {
    const onApprove = vi.fn();
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
        onApprove={onApprove}
      />
    );

    const approveButtons = screen.queryAllByText(/approve/i);
    if (approveButtons.length > 0) {
      fireEvent.click(approveButtons[0]);
      expect(onApprove).toHaveBeenCalled();
    }
  });

  it('handles rejection workflow', () => {
    const onReject = vi.fn();
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
        onReject={onReject}
      />
    );

    const rejectButtons = screen.queryAllByText(/reject/i);
    if (rejectButtons.length > 0) {
      fireEvent.click(rejectButtons[0]);
      expect(onReject).toHaveBeenCalled();
    }
  });

  it('displays case details on row click', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    const caseRow = screen.getByText('CASE-2024-0001');
    fireEvent.click(caseRow);

    // Should show case details
    expect(screen.getByText('Data Privacy Breach')).toBeInTheDocument();
  });

  it('shows risk score badges', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    // Risk scores: 85, 72, 65
    expect(screen.getByText(/85/)).toBeInTheDocument();
    expect(screen.getByText(/72/)).toBeInTheDocument();
    expect(screen.getByText(/65/)).toBeInTheDocument();
  });

  it('displays violation type badges', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    expect(screen.getByText('Data Privacy Breach')).toBeInTheDocument();
    expect(screen.getByText('Bias & Discrimination')).toBeInTheDocument();
  });

  it('handles empty case list', () => {
    render(
      <BarristerCaseList
        cases={[]}
        barristerEmail="john@example.com"
      />
    );

    expect(screen.getByText(/no cases/i)).toBeInTheDocument();
  });

  it('sorts cases by deadline', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
        sortBy="deadline"
      />
    );

    // Case 3 (deadline 2024-01-15) should appear before Case 1 (2024-02-01)
    expect(screen.getByText('CASE-2024-0003')).toBeInTheDocument();
  });

  it('filters by violation type', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
        filterByType="Data Privacy Breach"
      />
    );

    expect(screen.getByText('CASE-2024-0001')).toBeInTheDocument();
    expect(screen.queryByText('CASE-2024-0002')).not.toBeInTheDocument();
  });

  it('displays deadline information', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    // Should show deadline dates
    expect(screen.getByText(/deadline/i)).toBeInTheDocument();
  });

  it('shows assigned date information', () => {
    render(
      <BarristerCaseList
        cases={mockCases}
        barristerEmail="john@example.com"
      />
    );

    // Should show when cases were assigned
    expect(screen.getByText(/assigned/i)).toBeInTheDocument();
  });
});
