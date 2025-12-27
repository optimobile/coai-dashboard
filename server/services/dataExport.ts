import { CustomReport, ReportSection } from "./customReportBuilder";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export class DataExportService {
  /**
   * Export report as PDF
   */
  static async exportAsPDF(report: CustomReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
        });

        const chunks: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        doc.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);

        // Title
        doc.fontSize(24).font("Helvetica-Bold").text(report.title, {
          align: "center",
        });

        // Metadata
        doc.fontSize(10).font("Helvetica").text(
          `Generated: ${report.generatedAt.toLocaleDateString()}`,
          { align: "center" }
        );
        doc.text(
          `Framework: ${report.framework} | Period: ${report.startDate.toLocaleDateString()} - ${report.endDate.toLocaleDateString()}`,
          { align: "center" }
        );

        doc.moveDown();

        // Content sections
        Object.entries(report.content).forEach(([key, section]) => {
          const reportSection = section as ReportSection;

          // Section title
          doc.fontSize(14).font("Helvetica-Bold").text(reportSection.title);
          doc.moveDown(0.5);

          // Section content
          doc.fontSize(11).font("Helvetica").text(reportSection.content, {
            align: "justify",
          });
          doc.moveDown();

          // Section data (if available)
          if (reportSection.data) {
            doc.fontSize(10).font("Helvetica");
            Object.entries(reportSection.data).forEach(([dataKey, value]) => {
              doc.text(`${dataKey}: ${value}`);
            });
            doc.moveDown();
          }

          doc.addPage();
        });

        // Footer
        doc.fontSize(9).text(
          `Page ${doc.bufferedPageRange().count}`,
          { align: "center" }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Export report as CSV
   */
  static async exportAsCSV(report: CustomReport): Promise<string> {
    try {
      const rows: string[] = [];

      // Header
      rows.push(`"${report.title}"`);
      rows.push(`"Generated","${report.generatedAt.toISOString()}"`);
      rows.push(`"Framework","${report.framework}"`);
      rows.push(
        `"Period","${report.startDate.toLocaleDateString()} - ${report.endDate.toLocaleDateString()}"`
      );
      rows.push("");

      // Content sections
      Object.entries(report.content).forEach(([key, section]) => {
        const reportSection = section as ReportSection;

        rows.push(`"${reportSection.title}"`);
        rows.push(`"${reportSection.content}"`);

        if (reportSection.data) {
          Object.entries(reportSection.data).forEach(([dataKey, value]) => {
            rows.push(`"${dataKey}","${value}"`);
          });
        }

        rows.push("");
      });

      return rows.join("\n");
    } catch (error) {
      console.error("Error exporting as CSV:", error);
      throw error;
    }
  }

  /**
   * Export report as JSON
   */
  static async exportAsJSON(report: CustomReport): Promise<string> {
    try {
      const exportData = {
        title: report.title,
        template: report.template,
        framework: report.framework,
        generatedAt: report.generatedAt.toISOString(),
        period: {
          start: report.startDate.toISOString(),
          end: report.endDate.toISOString(),
        },
        filters: report.filters,
        content: report.content,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error("Error exporting as JSON:", error);
      throw error;
    }
  }

  /**
   * Export data as CSV (generic)
   */
  static async exportDataAsCSV(
    data: Record<string, unknown>[],
    filename: string
  ): Promise<string> {
    try {
      if (data.length === 0) {
        return "";
      }

      // Get headers from first row
      const headers = Object.keys(data[0]);
      const rows: string[] = [];

      // Add header row
      rows.push(headers.map((h) => `"${h}"`).join(","));

      // Add data rows
      data.forEach((row) => {
        const values = headers.map((header) => {
          const value = row[header];
          if (value === null || value === undefined) {
            return '""';
          }
          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return `"${value}"`;
        });
        rows.push(values.join(","));
      });

      return rows.join("\n");
    } catch (error) {
      console.error("Error exporting data as CSV:", error);
      throw error;
    }
  }

  /**
   * Export data as JSON (generic)
   */
  static async exportDataAsJSON(
    data: Record<string, unknown>[],
    filename: string
  ): Promise<string> {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("Error exporting data as JSON:", error);
      throw error;
    }
  }

  /**
   * Get export filename with timestamp
   */
  static getExportFilename(
    basename: string,
    format: "pdf" | "csv" | "json"
  ): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const extension = format === "pdf" ? "pdf" : format === "csv" ? "csv" : "json";
    return `${basename}-${timestamp}.${extension}`;
  }

  /**
   * Validate export format
   */
  static isValidFormat(format: string): format is "pdf" | "csv" | "json" {
    return ["pdf", "csv", "json"].includes(format);
  }

  /**
   * Get MIME type for format
   */
  static getMimeType(format: "pdf" | "csv" | "json"): string {
    const mimeTypes = {
      pdf: "application/pdf",
      csv: "text/csv",
      json: "application/json",
    };
    return mimeTypes[format];
  }
}
