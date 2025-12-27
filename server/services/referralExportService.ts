/**
 * Referral Analytics Export Service
 * Handles CSV and PDF export of referral analytics data
 */

import { ReferralAnalyticsService } from './referralAnalyticsService.js';

export class ReferralExportService {
  /**
   * Export referral analytics as CSV
   */
  static async exportAsCSV(userId: number, dateRange: 'week' | 'month' | 'quarter' = 'month'): Promise<string> {
    try {
      const analytics = await ReferralAnalyticsService.getReferralAnalytics(userId, dateRange);
      const summary = await ReferralAnalyticsService.getReferralSummary(userId);

      // Build CSV content
      const csvLines = [
        ['REFERRAL ANALYTICS REPORT'],
        [`Generated: ${new Date().toISOString()}`],
        [`Date Range: ${dateRange}`],
        [],
        ['SUMMARY METRICS'],
        ['Metric', 'Value'],
        ['Total Clicks', analytics.totalClicks],
        ['Total Conversions', analytics.totalConversions],
        ['Total Earnings', `$${analytics.totalEarnings.toFixed(2)}`],
        ['Conversion Rate', `${analytics.conversionRate.toFixed(2)}%`],
        ['Average Commission per Conversion', `$${analytics.averageCommissionPerConversion.toFixed(2)}`],
        ['Active Referral Codes', summary.activeReferralCodes],
        ['Total Referral Codes', summary.totalReferralCodes],
        [],
        ['TOP REFERRAL CODES'],
        ['Code', 'Clicks', 'Conversions', 'Earnings'],
        ...analytics.topReferralCodes.map((code) => [
          code.code,
          code.clicks,
          code.conversions,
          `$${code.earnings.toFixed(2)}`,
        ]),
        [],
        ['CLICKS TREND'],
        ['Date', 'Clicks'],
        ...analytics.clicksTrend.map((trend) => [trend.date, trend.clicks]),
        [],
        ['CONVERSIONS TREND'],
        ['Date', 'Conversions'],
        ...analytics.conversionsTrend.map((trend) => [trend.date, trend.conversions]),
        [],
        ['EARNINGS TREND'],
        ['Date', 'Earnings'],
        ...analytics.earningsTrend.map((trend) => [trend.date, `$${trend.earnings.toFixed(2)}`]),
      ];

      // Convert to CSV format
      return csvLines.map((line) => line.map((cell) => `"${cell}"`).join(',')).join('\n');
    } catch (error) {
      console.error('Error exporting analytics as CSV:', error);
      throw error;
    }
  }

  /**
   * Export referral analytics as PDF (requires jsPDF)
   */
  static async exportAsPDF(
    userId: number,
    dateRange: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<Buffer> {
    try {
      const analytics = await ReferralAnalyticsService.getReferralAnalytics(userId, dateRange);
      const summary = await ReferralAnalyticsService.getReferralSummary(userId);

      // Build PDF content as HTML
      const htmlContent = `
        <html>
          <head>
            <title>Referral Analytics Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #059669; margin-bottom: 10px; }
              h2 { color: #0f766e; margin-top: 20px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f3f4f6; }
              .metric { display: inline-block; margin-right: 30px; }
              .metric-value { font-size: 24px; font-weight: bold; color: #059669; }
              .metric-label { font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Referral Analytics Report</h1>
            <p>Generated: ${new Date().toISOString()}</p>
            <p>Date Range: ${dateRange}</p>

            <h2>Summary Metrics</h2>
            <div class="metric">
              <div class="metric-value">${analytics.totalClicks}</div>
              <div class="metric-label">Total Clicks</div>
            </div>
            <div class="metric">
              <div class="metric-value">${analytics.totalConversions}</div>
              <div class="metric-label">Conversions</div>
            </div>
            <div class="metric">
              <div class="metric-value">$${analytics.totalEarnings.toFixed(2)}</div>
              <div class="metric-label">Total Earnings</div>
            </div>
            <div class="metric">
              <div class="metric-value">${analytics.conversionRate.toFixed(2)}%</div>
              <div class="metric-label">Conversion Rate</div>
            </div>

            <h2>Top Referral Codes</h2>
            <table>
              <tr>
                <th>Code</th>
                <th>Clicks</th>
                <th>Conversions</th>
                <th>Earnings</th>
              </tr>
              ${analytics.topReferralCodes
                .map(
                  (code) => `
                <tr>
                  <td>${code.code}</td>
                  <td>${code.clicks}</td>
                  <td>${code.conversions}</td>
                  <td>$${code.earnings.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </table>

            <h2>Referral Program Status</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
              <tr>
                <td>Active Referral Codes</td>
                <td>${summary.activeReferralCodes}</td>
              </tr>
              <tr>
                <td>Total Referral Codes</td>
                <td>${summary.totalReferralCodes}</td>
              </tr>
              <tr>
                <td>Pending Earnings</td>
                <td>$${summary.pendingEarnings.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Processed Earnings</td>
                <td>$${summary.processedEarnings.toFixed(2)}</td>
              </tr>
            </table>
          </body>
        </html>
      `;

      // TODO: Convert HTML to PDF using a library like jsPDF or pdfkit
      // For now, return empty buffer as placeholder
      return Buffer.from(htmlContent);
    } catch (error) {
      console.error('Error exporting analytics as PDF:', error);
      throw error;
    }
  }

  /**
   * Generate analytics report summary
   */
  static async generateReportSummary(
    userId: number,
    dateRange: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<string> {
    try {
      const analytics = await ReferralAnalyticsService.getReferralAnalytics(userId, dateRange);
      const summary = await ReferralAnalyticsService.getReferralSummary(userId);

      const report = `
REFERRAL ANALYTICS REPORT
Generated: ${new Date().toISOString()}
Date Range: ${dateRange}

SUMMARY METRICS
===============
Total Clicks: ${analytics.totalClicks}
Total Conversions: ${analytics.totalConversions}
Total Earnings: $${analytics.totalEarnings.toFixed(2)}
Conversion Rate: ${analytics.conversionRate.toFixed(2)}%
Average Commission per Conversion: $${analytics.averageCommissionPerConversion.toFixed(2)}

REFERRAL PROGRAM STATUS
=======================
Active Referral Codes: ${summary.activeReferralCodes}
Total Referral Codes: ${summary.totalReferralCodes}
Pending Earnings: $${summary.pendingEarnings.toFixed(2)}
Processed Earnings: $${summary.processedEarnings.toFixed(2)}

TOP REFERRAL CODES
==================
${analytics.topReferralCodes
  .map((code) => `${code.code}: ${code.clicks} clicks, ${code.conversions} conversions, $${code.earnings.toFixed(2)} earnings`)
  .join('\n')}

PERFORMANCE INSIGHTS
====================
- Best performing code: ${analytics.topReferralCodes[0]?.code || 'N/A'}
- Average clicks per code: ${(analytics.totalClicks / summary.totalReferralCodes).toFixed(2)}
- Average conversions per code: ${(analytics.totalConversions / summary.totalReferralCodes).toFixed(2)}
- Average earnings per code: $${(analytics.totalEarnings / summary.totalReferralCodes).toFixed(2)}
      `;

      return report.trim();
    } catch (error) {
      console.error('Error generating report summary:', error);
      throw error;
    }
  }
}
