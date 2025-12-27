import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportExportDialog } from '../ReportExportDialog';

describe('ReportExportDialog', () => {
  const mockReportData = {
    title: 'Legal Compliance Report',
    dateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
    },
    summary: {
      totalViolations: 25,
      criticalCount: 5,
      highCount: 10,
      mediumCount: 7,
      lowCount: 3,
      averageRiskScore: 65.5,
    },
    metrics: {
      complianceRate: 75,
      violationTrend: -12,
      casesResolved: 8,
      pendingCases: 7,
    },
    trends: [
      {
        date: '2024-01-01',
        category: 'Data Privacy',
        count: 5,
      },
    ],
    sectorData: [
      {
        sector: 'Finance',
        violations: 10,
        compliance: 80,
      },
    ],
    cases: [
      {
        id: 1,
        caseNumber: 'CASE-2024-0001',
        violationType: 'Data Privacy Breach',
        riskScore: 85,
        status: 'pending' as const,
        jurisdiction: 'EU',
      },
    ],
  };

  it('renders format selector', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/export format/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
    expect(screen.getByText(/CSV/)).toBeInTheDocument();
  });

  it('shows content options checkboxes', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/include summary/i)).toBeInTheDocument();
    expect(screen.getByText(/include trends/i)).toBeInTheDocument();
    expect(screen.getByText(/include sector analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/include cases/i)).toBeInTheDocument();
  });

  it('validates email input', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
  });

  it('triggers file download on export', async () => {
    const mockDownload = vi.fn();
    global.URL.createObjectURL = vi.fn();
    global.URL.revokeObjectURL = vi.fn();

    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
        onExport={mockDownload}
      />
    );

    const downloadButton = screen.getByText(/download/i);
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockDownload).toHaveBeenCalled();
    });
  });

  it('shows loading state during export', async () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const exportButton = screen.getByText(/export/i);
    fireEvent.click(exportButton);

    // Should show loading indicator
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
  });

  it('handles format selection', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const pdfOption = screen.getByLabelText(/PDF/);
    fireEvent.click(pdfOption);

    expect(pdfOption).toBeChecked();
  });

  it('toggles content options', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const summaryCheckbox = screen.getByLabelText(/include summary/i);
    fireEvent.click(summaryCheckbox);

    expect(summaryCheckbox).toBeChecked();
  });

  it('displays notes textarea', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const notesInput = screen.getByPlaceholderText(/notes/i);
    expect(notesInput).toBeInTheDocument();

    fireEvent.change(notesInput, { target: { value: 'Test notes' } });
    expect(notesInput).toHaveValue('Test notes');
  });

  it('sends email with report', async () => {
    const mockSendEmail = vi.fn();

    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
        onSendEmail={mockSendEmail}
      />
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
        })
      );
    });
  });

  it('displays success message after export', async () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const downloadButton = screen.getByText(/download/i);
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });

  it('closes dialog on cancel', () => {
    const onClose = vi.fn();

    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={onClose}
      />
    );

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('disables export button with invalid email', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid' } });

    const sendButton = screen.getByText(/send/i);
    expect(sendButton).toBeDisabled();
  });

  it('handles PDF generation', async () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const pdfOption = screen.getByLabelText(/PDF/);
    fireEvent.click(pdfOption);

    const downloadButton = screen.getByText(/download/i);
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText(/PDF generated/i)).toBeInTheDocument();
    });
  });

  it('handles CSV export', async () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const csvOption = screen.getByLabelText(/CSV/);
    fireEvent.click(csvOption);

    const downloadButton = screen.getByText(/download/i);
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText(/CSV generated/i)).toBeInTheDocument();
    });
  });

  it('displays report preview', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
        showPreview={true}
      />
    );

    expect(screen.getByText(/preview/i)).toBeInTheDocument();
    expect(screen.getByText('Legal Compliance Report')).toBeInTheDocument();
  });

  it('handles multiple content selections', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const summaryCheckbox = screen.getByLabelText(/include summary/i);
    const trendsCheckbox = screen.getByLabelText(/include trends/i);
    const sectorCheckbox = screen.getByLabelText(/include sector analysis/i);

    fireEvent.click(summaryCheckbox);
    fireEvent.click(trendsCheckbox);
    fireEvent.click(sectorCheckbox);

    expect(summaryCheckbox).toBeChecked();
    expect(trendsCheckbox).toBeChecked();
    expect(sectorCheckbox).toBeChecked();
  });

  it('validates required fields before export', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const sendButton = screen.getByText(/send/i);
    expect(sendButton).toBeDisabled(); // No email provided
  });

  it('shows file size estimate', () => {
    render(
      <ReportExportDialog
        reportData={mockReportData}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/file size/i)).toBeInTheDocument();
  });
});
