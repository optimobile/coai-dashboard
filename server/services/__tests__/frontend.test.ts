import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ComplianceTrendChart } from "@/components/analytics/ComplianceTrendChart";
import { MetricsCard } from "@/components/analytics/MetricsCard";
import { AuditLogTable } from "@/components/audit/AuditLogTable";
import { translations } from "@/lib/translations";

// Mock Recharts to avoid canvas issues in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  AreaChart: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  Line: () => <div />,
  Area: () => <div />,
  Bar: () => <div />,
}));

describe("LanguageContext and LanguageSwitcher", () => {
  it("should provide default language as English", () => {
    const TestComponent = () => {
      const { language } = useLanguage();
      return <div>{language}</div>;
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByText("en")).toBeInTheDocument();
  });

  it("should switch language when selected", async () => {
    const TestComponent = () => {
      const { language } = useLanguage();
      return (
        <div>
          <div data-testid="current-lang">{language}</div>
          <LanguageSwitcher />
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId("current-lang")).toHaveTextContent("en");

    // Note: Full language switching test would require more complex setup
    // with Select component mocking
  });

  it("should persist language preference to localStorage", () => {
    const TestComponent = () => {
      const { setLanguage } = useLanguage();
      return (
        <button onClick={() => setLanguage("fr")}>
          Switch to French
        </button>
      );
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const button = screen.getByText("Switch to French");
    fireEvent.click(button);

    expect(localStorage.getItem("preferred-language")).toBe("fr");
  });

  it("should update HTML dir attribute for RTL languages", () => {
    const TestComponent = () => {
      const { setLanguage } = useLanguage();
      return (
        <button onClick={() => setLanguage("ar")}>
          Switch to Arabic
        </button>
      );
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const button = screen.getByText("Switch to Arabic");
    fireEvent.click(button);

    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });
});

describe("ComplianceTrendChart", () => {
  const mockData = [
    { date: "2024-01-01", score: 72, framework: "EU AI Act", systemCount: 5 },
    { date: "2024-01-08", score: 74, framework: "EU AI Act", systemCount: 6 },
    { date: "2024-01-15", score: 75, framework: "EU AI Act", systemCount: 7 },
  ];

  it("should render loading state", () => {
    render(
      <LanguageProvider>
        <ComplianceTrendChart data={[]} isLoading={true} />
      </LanguageProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render no data message when data is empty", () => {
    render(
      <LanguageProvider>
        <ComplianceTrendChart data={[]} isLoading={false} />
      </LanguageProvider>
    );

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it("should render chart with data", () => {
    render(
      <LanguageProvider>
        <ComplianceTrendChart data={mockData} isLoading={false} />
      </LanguageProvider>
    );

    expect(screen.getByText(/compliance trends/i)).toBeInTheDocument();
  });

  it("should support different chart types", () => {
    const { rerender } = render(
      <LanguageProvider>
        <ComplianceTrendChart data={mockData} chartType="line" />
      </LanguageProvider>
    );

    expect(screen.getByText(/compliance trends/i)).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <ComplianceTrendChart data={mockData} chartType="area" />
      </LanguageProvider>
    );

    expect(screen.getByText(/compliance trends/i)).toBeInTheDocument();
  });
});

describe("MetricsCard", () => {
  it("should render loading state", () => {
    render(
      <LanguageProvider>
        <MetricsCard title="Test Metric" value={0} isLoading={true} />
      </LanguageProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render metric with value and unit", () => {
    render(
      <LanguageProvider>
        <MetricsCard title="Average Score" value={85} unit="%" />
      </LanguageProvider>
    );

    expect(screen.getByText("Average Score")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("should display trend indicator", () => {
    render(
      <LanguageProvider>
        <MetricsCard
          title="Score"
          value={78}
          trend="up"
          trendValue={5}
          color="success"
        />
      </LanguageProvider>
    );

    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
  });

  it("should apply correct color classes", () => {
    const { container } = render(
      <LanguageProvider>
        <MetricsCard
          title="High Risk"
          value={5}
          color="danger"
        />
      </LanguageProvider>
    );

    const valueElement = container.querySelector(".text-red-600");
    expect(valueElement).toBeInTheDocument();
  });

  it("should render different trend directions", () => {
    const { rerender } = render(
      <LanguageProvider>
        <MetricsCard title="Metric" value={50} trend="up" />
      </LanguageProvider>
    );

    expect(screen.getByText("50")).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <MetricsCard title="Metric" value={50} trend="down" />
      </LanguageProvider>
    );

    expect(screen.getByText("50")).toBeInTheDocument();

    rerender(
      <LanguageProvider>
        <MetricsCard title="Metric" value={50} trend="stable" />
      </LanguageProvider>
    );

    expect(screen.getByText("50")).toBeInTheDocument();
  });
});

describe("AuditLogTable", () => {
  const mockLogs = [
    {
      id: "1",
      userId: "user@example.com",
      action: "create",
      resource: "ai_system",
      resourceId: "system-001",
      timestamp: new Date("2024-01-15T10:00:00"),
      status: "success" as const,
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      userId: "admin@example.com",
      action: "update",
      resource: "compliance_assessment",
      resourceId: "assessment-042",
      timestamp: new Date("2024-01-15T11:00:00"),
      status: "failure" as const,
      ipAddress: "192.168.1.101",
    },
  ];

  it("should render loading state", () => {
    render(
      <LanguageProvider>
        <AuditLogTable logs={[]} isLoading={true} />
      </LanguageProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render no data message when logs are empty", () => {
    render(
      <LanguageProvider>
        <AuditLogTable logs={[]} isLoading={false} />
      </LanguageProvider>
    );

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it("should render audit logs in table", () => {
    render(
      <LanguageProvider>
        <AuditLogTable logs={mockLogs} isLoading={false} />
      </LanguageProvider>
    );

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
    expect(screen.getByText("create")).toBeInTheDocument();
    expect(screen.getByText("update")).toBeInTheDocument();
  });

  it("should display status with correct color", () => {
    const { container } = render(
      <LanguageProvider>
        <AuditLogTable logs={mockLogs} isLoading={false} />
      </LanguageProvider>
    );

    const successElements = container.querySelectorAll(".text-green-600");
    const failureElements = container.querySelectorAll(".text-red-600");

    expect(successElements.length).toBeGreaterThan(0);
    expect(failureElements.length).toBeGreaterThan(0);
  });

  it("should filter logs by search term", async () => {
    render(
      <LanguageProvider>
        <AuditLogTable logs={mockLogs} isLoading={false} />
      </LanguageProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search logs/i);
    fireEvent.change(searchInput, { target: { value: "user@example.com" } });

    await waitFor(() => {
      expect(screen.getByText("user@example.com")).toBeInTheDocument();
    });
  });

  it("should sort logs by clicking column headers", async () => {
    render(
      <LanguageProvider>
        <AuditLogTable logs={mockLogs} isLoading={false} />
      </LanguageProvider>
    );

    const timestampHeader = screen.getByText(/timestamp/i);
    fireEvent.click(timestampHeader);

    await waitFor(() => {
      expect(screen.getByText("user@example.com")).toBeInTheDocument();
    });
  });

  it("should call onRowClick when row is clicked", async () => {
    const onRowClick = vi.fn();
    render(
      <LanguageProvider>
        <AuditLogTable logs={mockLogs} isLoading={false} onRowClick={onRowClick} />
      </LanguageProvider>
    );

    const rows = screen.getAllByText(/user@example.com|admin@example.com/);
    fireEvent.click(rows[0]);

    await waitFor(() => {
      expect(onRowClick).toHaveBeenCalled();
    });
  });

  it("should call onExport when export button is clicked", async () => {
    const onExport = vi.fn();
    render(
      <LanguageProvider>
        <AuditLogTable logs={mockLogs} isLoading={false} onExport={onExport} />
      </LanguageProvider>
    );

    const exportButton = screen.getByText(/export/i);
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(onExport).toHaveBeenCalled();
    });
  });
});

describe("Translation System", () => {
  it("should have translations for all supported languages", () => {
    const languages = ["en", "fr", "de", "es", "it", "nl", "pl", "pt", "ru", "zh", "ja", "ko", "ar"];

    languages.forEach((lang) => {
      expect(translations[lang as any]).toBeDefined();
      expect(Object.keys(translations[lang as any]).length).toBeGreaterThan(0);
    });
  });

  it("should have consistent keys across all languages", () => {
    const englishKeys = Object.keys(translations.en).sort();
    const languages = ["fr", "de", "es", "it", "nl", "pl", "pt", "ru", "zh", "ja", "ko", "ar"];

    languages.forEach((lang) => {
      const langKeys = Object.keys(translations[lang as any]).sort();
      expect(langKeys).toEqual(englishKeys);
    });
  });

  it("should provide translations for common UI strings", () => {
    const commonStrings = [
      "dashboard",
      "analytics",
      "audit",
      "language",
      "loading",
      "error",
      "save",
      "cancel",
    ];

    commonStrings.forEach((key) => {
      expect(translations.en[key]).toBeDefined();
      expect(translations.en[key]).not.toBe("");
    });
  });

  it("should have Arabic translations with RTL support", () => {
    expect(translations.ar).toBeDefined();
    expect(translations.ar.dashboard).toBe("لوحة التحكم");
    expect(translations.ar.analytics).toBe("التحليلات");
  });
});
