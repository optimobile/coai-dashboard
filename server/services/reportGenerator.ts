import { getDb } from "../db";
import { complianceReports } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { PDFDocument, rgb, StandardFonts } from "@react-pdf/renderer";
import ExcelJS from "exceljs";

export interface ReportData {
  title: string;
  jurisdiction: string;
  organizationName: string;
  reportPeriod: { start: Date; end: Date };
  complianceScore: number;
  auditResults: Array<{
    date: Date;
    status: "passed" | "failed" | "warning";
    findings: string[];
  }>;
  enforcementActions: Array<{
    date: Date;
    action: string;
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "resolved";
  }>;
  certifications: Array<{
    name: string;
    issueDate: Date;
    expiryDate: Date;
    status: "active" | "expired" | "pending";
  }>;
  trends: {
    riskTrend: "improving" | "stable" | "declining";
    complianceTrend: "improving" | "stable" | "declining";
    keyMetrics: Record<string, number>;
  };
  recommendations: string[];
}

export class ReportGenerator {
  /**
   * Generate PDF report
   */
  static async generatePDF(data: ReportData): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {});

    // Header
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("Compliance Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Organization: ${data.organizationName}`, { align: "center" });
    doc.text(
      `Jurisdiction: ${data.jurisdiction}`,
      { align: "center" }
    );
    doc.text(
      `Period: ${data.reportPeriod.start.toLocaleDateString()} - ${data.reportPeriod.end.toLocaleDateString()}`,
      { align: "center" }
    );
    doc.moveDown(1);

    // Compliance Score
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Overall Compliance Score");
    doc.moveDown(0.3);
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor(data.complianceScore >= 80 ? "#22c55e" : "#ef4444")
      .text(`${data.complianceScore}%`, { align: "center" });
    doc.fillColor("black");
    doc.moveDown(1);

    // Audit Results
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Recent Audit Results");
    doc.moveDown(0.3);
    data.auditResults.forEach((audit) => {
      const statusColor =
        audit.status === "passed"
          ? "#22c55e"
          : audit.status === "warning"
          ? "#eab308"
          : "#ef4444";
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(statusColor)
        .text(`${audit.date.toLocaleDateString()} - ${audit.status.toUpperCase()}`);
      doc.fillColor("black").fontSize(10).font("Helvetica");
      audit.findings.forEach((finding) => {
        doc.text(`• ${finding}`, { indent: 20 });
      });
      doc.moveDown(0.3);
    });
    doc.moveDown(0.5);

    // Enforcement Actions
    if (data.enforcementActions.length > 0) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Enforcement Actions");
      doc.moveDown(0.3);
      data.enforcementActions.forEach((action) => {
        const severityColor =
          action.severity === "critical"
            ? "#dc2626"
            : action.severity === "high"
            ? "#ea580c"
            : action.severity === "medium"
            ? "#eab308"
            : "#22c55e";
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor(severityColor)
          .text(
            `${action.date.toLocaleDateString()} - ${action.severity.toUpperCase()}`
          );
        doc.fillColor("black").fontSize(10).font("Helvetica");
        doc.text(`Action: ${action.action}`, { indent: 20 });
        doc.text(`Status: ${action.status}`, { indent: 20 });
        doc.moveDown(0.3);
      });
      doc.moveDown(0.5);
    }

    // Certifications
    if (data.certifications.length > 0) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Certifications");
      doc.moveDown(0.3);
      data.certifications.forEach((cert) => {
        const statusColor =
          cert.status === "active"
            ? "#22c55e"
            : cert.status === "pending"
            ? "#eab308"
            : "#ef4444";
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor(statusColor)
          .text(`${cert.name} - ${cert.status.toUpperCase()}`);
        doc.fillColor("black").fontSize(10).font("Helvetica");
        doc.text(`Issued: ${cert.issueDate.toLocaleDateString()}`, {
          indent: 20,
        });
        doc.text(`Expires: ${cert.expiryDate.toLocaleDateString()}`, {
          indent: 20,
        });
        doc.moveDown(0.3);
      });
      doc.moveDown(0.5);
    }

    // Trends
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Compliance Trends");
    doc.moveDown(0.3);
    doc
      .fontSize(11)
      .font("Helvetica")
      .text(`Risk Trend: ${data.trends.riskTrend}`);
    doc.text(`Compliance Trend: ${data.trends.complianceTrend}`);
    doc.moveDown(0.5);

    // Recommendations
    if (data.recommendations.length > 0) {
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Recommendations");
      doc.moveDown(0.3);
      data.recommendations.forEach((rec) => {
        doc.fontSize(10).font("Helvetica").text(`• ${rec}`, { indent: 20 });
      });
    }

    doc.end();

    return Buffer.concat(buffers);
  }

  /**
   * Generate Excel report
   */
  static async generateExcel(data: ReportData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Summary sheet
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Metric", key: "metric", width: 30 },
      { header: "Value", key: "value", width: 20 },
    ];

    summarySheet.addRows([
      { metric: "Organization", value: data.organizationName },
      { metric: "Jurisdiction", value: data.jurisdiction },
      { metric: "Report Period", value: `${data.reportPeriod.start.toLocaleDateString()} - ${data.reportPeriod.end.toLocaleDateString()}` },
      { metric: "Compliance Score", value: `${data.complianceScore}%` },
      { metric: "Risk Trend", value: data.trends.riskTrend },
      { metric: "Compliance Trend", value: data.trends.complianceTrend },
    ]);

    // Audit Results sheet
    const auditSheet = workbook.addWorksheet("Audit Results");
    auditSheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Findings", key: "findings", width: 50 },
    ];

    data.auditResults.forEach((audit) => {
      auditSheet.addRow({
        date: audit.date.toLocaleDateString(),
        status: audit.status,
        findings: audit.findings.join("; "),
      });
    });

    // Enforcement Actions sheet
    if (data.enforcementActions.length > 0) {
      const enforcementSheet = workbook.addWorksheet("Enforcement Actions");
      enforcementSheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Action", key: "action", width: 30 },
        { header: "Severity", key: "severity", width: 15 },
        { header: "Status", key: "status", width: 15 },
      ];

      data.enforcementActions.forEach((action) => {
        enforcementSheet.addRow({
          date: action.date.toLocaleDateString(),
          action: action.action,
          severity: action.severity,
          status: action.status,
        });
      });
    }

    // Certifications sheet
    if (data.certifications.length > 0) {
      const certSheet = workbook.addWorksheet("Certifications");
      certSheet.columns = [
        { header: "Name", key: "name", width: 30 },
        { header: "Issue Date", key: "issueDate", width: 15 },
        { header: "Expiry Date", key: "expiryDate", width: 15 },
        { header: "Status", key: "status", width: 15 },
      ];

      data.certifications.forEach((cert) => {
        certSheet.addRow({
          name: cert.name,
          issueDate: cert.issueDate.toLocaleDateString(),
          expiryDate: cert.expiryDate.toLocaleDateString(),
          status: cert.status,
        });
      });
    }

    // Recommendations sheet
    if (data.recommendations.length > 0) {
      const recSheet = workbook.addWorksheet("Recommendations");
      recSheet.columns = [{ header: "Recommendation", key: "recommendation", width: 80 }];

      data.recommendations.forEach((rec) => {
        recSheet.addRow({ recommendation: rec });
      });
    }

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  /**
   * Save report to database
   */
  static async saveReport(
    userId: number,
    organizationId: number | null,
    reportType: string,
    jurisdiction: string,
    title: string,
    data: ReportData,
    exportFormat: string,
    fileUrl?: string
  ) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const result = await db.insert(complianceReports).values({
      userId,
      organizationId,
      reportType: reportType as any,
      jurisdiction,
      title,
      data: JSON.stringify(data),
      exportFormat: exportFormat as any,
      fileUrl,
      isScheduled: false,
    });

    return result;
  }

  /**
   * Get report by ID
   */
  static async getReport(reportId: number, userId: number) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const report = await db
      .select()
      .from(complianceReports)
      .where(
        and(
          eq(complianceReports.id, reportId),
          eq(complianceReports.userId, userId)
        )
      )
      .limit(1);

    return report[0];
  }

  /**
   * List reports for user
   */
  static async listReports(userId: number, limit = 10, offset = 0) {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    const reports = await db
      .select()
      .from(complianceReports)
      .where(eq(complianceReports.userId, userId))
      .orderBy(complianceReports.createdAt)
      .limit(limit)
      .offset(offset);

    return reports;
  }
}
