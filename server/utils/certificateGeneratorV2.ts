/**
 * Certificate PDF Generator V2
 * 
 * Generates professional PDF certificates using the modern template image
 * with overlaid student data, QR codes, and CSOAI branding
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface CertificateDataV2 {
  certificateId: string;
  studentName: string;
  courseName: string;
  framework: string;
  completionDate: Date;
  verificationUrl: string;
}

export async function generateCertificatePDFV2(data: CertificateDataV2): Promise<Buffer> {
  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    const { width, height } = page.getSize();

    // Embed fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Draw border
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.067, 0.533, 0.329), // emerald-600
      borderWidth: 3,
    });

    // Draw inner border
    page.drawRectangle({
      x: 40,
      y: 40,
      width: width - 80,
      height: height - 80,
      borderColor: rgb(0.067, 0.533, 0.329),
      borderWidth: 1,
    });

    // Title
    page.drawText('CERTIFICATE OF COMPLETION', {
      x: width / 2 - 200,
      y: height - 100,
      size: 32,
      font: helveticaBoldFont,
      color: rgb(0.067, 0.533, 0.329),
    });

    // CSOAI Logo text
    page.drawText('CSOAI', {
      x: width / 2 - 40,
      y: height - 140,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });

    // This certifies that
    page.drawText('This certifies that', {
      x: width / 2 - 80,
      y: height - 200,
      size: 18,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Student Name (large, elegant)
    page.drawText(data.studentName, {
      x: width / 2 - (data.studentName.length * 15),
      y: height - 250,
      size: 48,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Course completion text
    const courseText = `has successfully completed ${data.courseName}`;
    page.drawText(courseText, {
      x: width / 2 - (courseText.length * 4.5),
      y: height - 310,
      size: 16,
      font: helveticaFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Framework
    page.drawText(`Framework: ${data.framework}`, {
      x: width / 2 - 80,
      y: height - 350,
      size: 14,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Completion Date
    const formattedDate = data.completionDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    page.drawText(`Completion Date: ${formattedDate}`, {
      x: 80,
      y: 120,
      size: 12,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });

    // Certificate ID
    page.drawText(`Certificate ID: ${data.certificateId}`, {
      x: width - 280,
      y: 120,
      size: 12,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });

    // Generate QR Code
    const qrCodeDataURL = await QRCode.toDataURL(data.verificationUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    
    // Embed QR code
    const qrCodeImageBytes = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);
    
    // Draw QR code
    page.drawImage(qrCodeImage, {
      x: width - 150,
      y: 180,
      width: 100,
      height: 100,
    });

    // Verification text
    page.drawText('Scan to verify', {
      x: width - 145,
      y: 165,
      size: 10,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Add metadata
    pdfDoc.setTitle(`CSOAI Certificate - ${data.studentName}`);
    pdfDoc.setSubject(`Certificate of Completion for ${data.courseName}`);
    pdfDoc.setAuthor('CSOAI - Certified Safety Oversight AI');
    pdfDoc.setCreator('CSOAI Platform');
    pdfDoc.setProducer('CSOAI Certificate Generator V2');
    pdfDoc.setKeywords(['AI Safety', 'Certification', 'CSOAI', data.framework]);
    pdfDoc.setCreationDate(new Date());

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw new Error(`Failed to generate certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
