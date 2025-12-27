import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ComplianceTrendAnalysisService } from "../complianceTrendAnalysis";
import { CustomReportBuilderService } from "../customReportBuilder";
import { DataExportService } from "../dataExport";
import { AuditLoggingService } from "../auditLogging";
import { LocalizationService } from "../localization";

describe("ComplianceTrendAnalysisService", () => {
  it("should return array for trends", async () => {
    const trends = await ComplianceTrendAnalysisService.getComplianceTrends(
      new Date("2024-01-01"),
      new Date("2024-01-31")
    );
    expect(Array.isArray(trends)).toBe(true);
  });

  it("should get metrics snapshot", async () => {
    const metrics = await ComplianceTrendAnalysisService.getMetricsSnapshot();
    expect(metrics).toHaveProperty("averageScore");
    expect(metrics).toHaveProperty("highRiskCount");
    expect(metrics).toHaveProperty("trendDirection");
    expect(["improving", "declining", "stable"]).toContain(metrics.trendDirection);
  });

  it("should get framework comparison", async () => {
    const comparison = await ComplianceTrendAnalysisService.getFrameworkComparison();
    expect(Array.isArray(comparison)).toBe(true);
  });

  it("should get incident patterns", async () => {
    const patterns = await ComplianceTrendAnalysisService.getIncidentPatterns(
      new Date("2024-01-01"),
      new Date("2024-01-31")
    );
    expect(Array.isArray(patterns)).toBe(true);
  });

  it("should get compliance gaps for framework", async () => {
    const gaps = await ComplianceTrendAnalysisService.getComplianceGaps("EU AI Act");
    expect(Array.isArray(gaps)).toBe(true);
  });

  it("should get predictive score for system", async () => {
    const predictions = await ComplianceTrendAnalysisService.getPredictiveScore(
      "system-123",
      30
    );
    expect(Array.isArray(predictions)).toBe(true);
  });
});

describe("CustomReportBuilderService", () => {
  it("should get available templates", () => {
    const templates = CustomReportBuilderService.getAvailableTemplates();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);
  });

  it("should build executive summary report", async () => {
    const report = await CustomReportBuilderService.buildReport(
      "executive-summary",
      "EU AI Act",
      new Date("2024-01-01"),
      new Date("2024-01-31")
    );
    expect(report).toBeDefined();
    expect(report.title).toBe("Executive Summary");
    expect(report.framework).toBe("EU AI Act");
  });

  it("should build detailed compliance report", async () => {
    const report = await CustomReportBuilderService.buildReport(
      "detailed-compliance",
      "NIST AI RMF",
      new Date("2024-01-01"),
      new Date("2024-01-31")
    );
    expect(report).toBeDefined();
    expect(report.template).toBe("detailed-compliance");
  });
});

describe("DataExportService", () => {
  it("should export filename with timestamp", () => {
    const filename = DataExportService.getExportFilename("compliance-report", "pdf");
    expect(filename).toContain("compliance-report");
    expect(filename).toContain(".pdf");
  });

  it("should validate export format", () => {
    expect(DataExportService.isValidFormat("pdf")).toBe(true);
    expect(DataExportService.isValidFormat("csv")).toBe(true);
    expect(DataExportService.isValidFormat("json")).toBe(true);
    expect(DataExportService.isValidFormat("xml")).toBe(false);
  });

  it("should get correct MIME types", () => {
    expect(DataExportService.getMimeType("pdf")).toBe("application/pdf");
    expect(DataExportService.getMimeType("csv")).toBe("text/csv");
    expect(DataExportService.getMimeType("json")).toBe("application/json");
  });

  it("should export data as CSV", async () => {
    const data = [
      { name: "System A", score: 85, status: "compliant" },
      { name: "System B", score: 72, status: "partial" },
    ];
    const csv = await DataExportService.exportDataAsCSV(data, "test.csv");
    expect(csv).toContain("name");
    expect(csv).toContain("score");
    expect(csv).toContain("System A");
    expect(csv).toContain("85");
  });

  it("should export data as JSON", async () => {
    const data = [{ id: "1", name: "Test" }];
    const json = await DataExportService.exportDataAsJSON(data, "test.json");
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
  });
});

describe("AuditLoggingService", () => {
  beforeEach(() => {
    AuditLoggingService.clearAllLogs();
  });

  afterEach(() => {
    AuditLoggingService.clearAllLogs();
  });

  it("should log audit event", async () => {
    await AuditLoggingService.logEvent({
      id: "event-1",
      userId: "user-123",
      action: "create",
      resource: "ai_system",
      resourceId: "system-1",
      timestamp: new Date(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      status: "success",
    });

    expect(AuditLoggingService.getLogCount()).toBe(1);
  });

  it("should retrieve audit logs with filtering", async () => {
    await AuditLoggingService.logEvent({
      id: "event-1",
      userId: "user-123",
      action: "create",
      resource: "ai_system",
      resourceId: "system-1",
      timestamp: new Date(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      status: "success",
    });

    const logs = await AuditLoggingService.getAuditLogs({
      userId: "user-123",
    });

    expect(logs.length).toBe(1);
    expect(logs[0].userId).toBe("user-123");
  });

  it("should search audit logs", async () => {
    await AuditLoggingService.logEvent({
      id: "event-1",
      userId: "user-123",
      action: "delete",
      resource: "ai_system",
      resourceId: "system-1",
      timestamp: new Date(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      status: "success",
    });

    const results = await AuditLoggingService.searchAuditLogs("delete");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].action).toBe("delete");
  });

  it("should get audit statistics", async () => {
    await AuditLoggingService.logEvent({
      id: "event-1",
      userId: "user-123",
      action: "create",
      resource: "ai_system",
      resourceId: "system-1",
      timestamp: new Date(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      status: "success",
    });

    const stats = await AuditLoggingService.getAuditStats();
    expect(stats).toHaveProperty("totalEvents");
  });

  it("should generate audit report", async () => {
    await AuditLoggingService.logEvent({
      id: "event-1",
      userId: "user-123",
      action: "update",
      resource: "compliance_assessment",
      resourceId: "assessment-1",
      timestamp: new Date(),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      status: "success",
    });

    const report = await AuditLoggingService.generateAuditReport(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      new Date()
    );

    expect(typeof report).toBe("string");
    expect(report.length).toBeGreaterThan(0);
  });

  it("should archive old logs", async () => {
    await AuditLoggingService.logEvent({
      id: "event-1",
      userId: "user-123",
      action: "create",
      resource: "ai_system",
      resourceId: "system-1",
      timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0",
      status: "success",
    });

    const archivedCount = await AuditLoggingService.archiveOldLogs(90);
    expect(archivedCount).toBe(1);
    expect(AuditLoggingService.getLogCount()).toBe(0);
  });
});

describe("LocalizationService", () => {
  it("should get all supported languages", () => {
    const languages = LocalizationService.getSupportedLanguages();
    expect(Array.isArray(languages)).toBe(true);
    expect(languages.length).toBeGreaterThanOrEqual(13);
  });

  it("should get language configuration", () => {
    const config = LocalizationService.getLanguageConfig("en");
    expect(config).not.toBeNull();
    expect(config?.code).toBe("en");
    expect(config?.direction).toBe("ltr");
  });

  it("should support RTL languages", () => {
    const config = LocalizationService.getLanguageConfig("ar");
    expect(config?.direction).toBe("rtl");
  });

  it("should format dates by language", () => {
    const date = new Date("2024-01-15T00:00:00Z");
    const enDate = LocalizationService.formatDate(date, "en");
    const deDate = LocalizationService.formatDate(date, "de");

    expect(enDate).toBeTruthy();
    expect(deDate).toBeTruthy();
  });

  it("should format currency by language", () => {
    const formatted = LocalizationService.formatCurrency(100, "en");
    expect(formatted).toContain("100");
  });

  it("should format numbers by language", () => {
    const formatted = LocalizationService.formatNumber(1234.56, "en", 2);
    expect(formatted).toBeTruthy();
  });

  it("should get text direction", () => {
    expect(LocalizationService.getTextDirection("en")).toBe("ltr");
    expect(LocalizationService.getTextDirection("ar")).toBe("rtl");
  });

  it("should detect language from Accept-Language header", () => {
    const detected = LocalizationService.detectLanguage("fr-FR,fr;q=0.9,en;q=0.8");
    expect(detected).toBe("fr");
  });

  it("should get compliance framework translations", () => {
    const translations = LocalizationService.getComplianceFrameworkTranslations(
      "EU AI Act",
      "en"
    );
    expect(translations).toHaveProperty("title");
    expect(translations.title).toBe("EU AI Act");
  });

  it("should get UI translations", () => {
    const translations = LocalizationService.getUITranslations("en");
    expect(translations).toHaveProperty("dashboard");
    expect(translations).toHaveProperty("analytics");
    expect(translations).toHaveProperty("reports");
  });

  it("should validate language code", () => {
    expect(LocalizationService.isValidLanguage("en")).toBe(true);
    expect(LocalizationService.isValidLanguage("xx")).toBe(false);
  });

  it("should get default language", () => {
    const defaultLang = LocalizationService.getDefaultLanguage();
    expect(defaultLang).toBe("en");
  });
});
