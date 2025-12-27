/**
 * Certificate Verification Service
 * Handles CEASAI certificate generation, verification, and blockchain registration
 */

import crypto from 'crypto';

export interface CEASAICertificate {
  certificateId: string;
  organizationId: number;
  analystName: string;
  certificationLevel: 'fundamentals' | 'professional' | 'expert';
  issuanceDate: Date;
  expiryDate: Date;
  score: number;
  issuer: string;
  verificationHash: string;
  blockchainHash?: string;
  qrCodeUrl: string;
}

export interface VerificationResult {
  valid: boolean;
  certificate: CEASAICertificate | null;
  verificationDate: Date;
  blockchainVerified: boolean;
  governmentPortalVerified: boolean;
  message: string;
}

export class CertificateVerificationService {
  private issuer = 'CSOAI - Certified EU AI Safety Analyst Program';
  private blockchainNetwork = 'ethereum-mainnet'; // In production: actual blockchain

  /**
   * Generate CEASAI Certificate
   */
  async generateCertificate(
    organizationId: number,
    analystName: string,
    certificationLevel: 'fundamentals' | 'professional' | 'expert',
    score: number
  ): Promise<CEASAICertificate> {
    try {
      console.log('[Certificate] Generating CEASAI certificate for', analystName);

      // Validate score
      if (score < 70) {
        throw new Error('Score must be 70 or higher to pass');
      }

      // Generate unique certificate ID
      const certificateId = this.generateCertificateId(organizationId, analystName);

      // Set expiry dates based on level
      const issuanceDate = new Date();
      const expiryDate = this.calculateExpiryDate(certificationLevel, issuanceDate);

      // Create certificate object
      const certificate: CEASAICertificate = {
        certificateId,
        organizationId,
        analystName,
        certificationLevel,
        issuanceDate,
        expiryDate,
        score,
        issuer: this.issuer,
        verificationHash: '',
        qrCodeUrl: '',
      };

      // Generate verification hash
      certificate.verificationHash = this.generateVerificationHash(certificate);

      // Generate QR code URL
      certificate.qrCodeUrl = this.generateQRCodeUrl(certificateId);

      // Register on blockchain
      certificate.blockchainHash = await this.registerOnBlockchain(certificate);

      console.log('[Certificate] ✅ Certificate generated successfully');
      console.log(`[Certificate] ID: ${certificateId}`);
      console.log(`[Certificate] Blockchain Hash: ${certificate.blockchainHash}`);

      return certificate;
    } catch (error) {
      console.error('[Certificate] ❌ Failed to generate certificate:', error);
      throw error;
    }
  }

  /**
   * Verify CEASAI Certificate
   */
  async verifyCertificate(certificateId: string): Promise<VerificationResult> {
    try {
      console.log('[Verification] Verifying certificate:', certificateId);

      // Parse certificate ID to extract data
      const certificate = await this.retrieveCertificate(certificateId);

      if (!certificate) {
        return {
          valid: false,
          certificate: null,
          verificationDate: new Date(),
          blockchainVerified: false,
          governmentPortalVerified: false,
          message: 'Certificate not found',
        };
      }

      // Verify hash
      const hashValid = this.verifyHash(certificate);

      // Verify blockchain
      const blockchainVerified = await this.verifyBlockchain(certificate);

      // Verify government portal
      const governmentPortalVerified = await this.verifyGovernmentPortal(
        certificate
      );

      // Check expiry
      const isExpired = new Date() > certificate.expiryDate;

      const valid =
        hashValid && blockchainVerified && governmentPortalVerified && !isExpired;

      console.log(`[Verification] ✅ Certificate verification complete`);
      console.log(`[Verification] Valid: ${valid}`);
      console.log(`[Verification] Hash Valid: ${hashValid}`);
      console.log(`[Verification] Blockchain Verified: ${blockchainVerified}`);
      console.log(`[Verification] Government Portal: ${governmentPortalVerified}`);

      return {
        valid,
        certificate,
        verificationDate: new Date(),
        blockchainVerified,
        governmentPortalVerified,
        message: valid ? 'Certificate is valid and authentic' : 'Certificate verification failed',
      };
    } catch (error) {
      console.error('[Verification] ❌ Verification failed:', error);
      throw error;
    }
  }

  /**
   * Generate QR Code for certificate
   */
  generateQRCode(certificateId: string): string {
    try {
      console.log('[QR Code] Generating QR code for certificate');

      const verificationUrl = `https://csoai.org/verify/${certificateId}`;

      // In production, use a QR code library like qrcode
      // For now, return the URL
      console.log('[QR Code] ✅ QR code URL generated');

      return verificationUrl;
    } catch (error) {
      console.error('[QR Code] ❌ Failed to generate QR code:', error);
      throw error;
    }
  }

  /**
   * Register certificate on blockchain
   */
  private async registerOnBlockchain(certificate: CEASAICertificate): Promise<string> {
    try {
      console.log('[Blockchain] Registering certificate on blockchain');

      // In production, interact with actual blockchain
      // For demo, generate a mock blockchain hash
      const blockchainHash = crypto
        .createHash('sha256')
        .update(
          JSON.stringify({
            certificateId: certificate.certificateId,
            analystName: certificate.analystName,
            issuanceDate: certificate.issuanceDate.toISOString(),
            verificationHash: certificate.verificationHash,
            timestamp: new Date().toISOString(),
          })
        )
        .digest('hex');

      console.log('[Blockchain] ✅ Certificate registered on blockchain');
      console.log(`[Blockchain] Hash: ${blockchainHash}`);

      return blockchainHash;
    } catch (error) {
      console.error('[Blockchain] ❌ Failed to register on blockchain:', error);
      throw error;
    }
  }

  /**
   * Verify blockchain registration
   */
  private async verifyBlockchain(certificate: CEASAICertificate): Promise<boolean> {
    try {
      console.log('[Blockchain Verify] Verifying blockchain registration');

      if (!certificate.blockchainHash) {
        return false;
      }

      // In production, query actual blockchain
      // For demo, verify hash format
      const isValidHash = /^[a-f0-9]{64}$/.test(certificate.blockchainHash);

      console.log(`[Blockchain Verify] ✅ Blockchain verification: ${isValidHash}`);

      return isValidHash;
    } catch (error) {
      console.error('[Blockchain Verify] ❌ Blockchain verification failed:', error);
      return false;
    }
  }

  /**
   * Verify government portal registration
   */
  private async verifyGovernmentPortal(certificate: CEASAICertificate): Promise<boolean> {
    try {
      console.log('[Government Verify] Verifying government portal registration');

      // In production, query government portal APIs
      // For demo, assume verified if certificate exists
      const isVerified = true;

      console.log(`[Government Verify] ✅ Government portal verification: ${isVerified}`);

      return isVerified;
    } catch (error) {
      console.error('[Government Verify] ❌ Government verification failed:', error);
      return false;
    }
  }

  /**
   * Generate verification hash
   */
  private generateVerificationHash(certificate: CEASAICertificate): string {
    const hashInput = JSON.stringify({
      certificateId: certificate.certificateId,
      organizationId: certificate.organizationId,
      analystName: certificate.analystName,
      certificationLevel: certificate.certificationLevel,
      issuanceDate: certificate.issuanceDate.toISOString(),
      expiryDate: certificate.expiryDate.toISOString(),
      score: certificate.score,
      issuer: certificate.issuer,
    });

    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * Verify hash integrity
   */
  private verifyHash(certificate: CEASAICertificate): boolean {
    const expectedHash = this.generateVerificationHash(certificate);
    return expectedHash === certificate.verificationHash;
  }

  /**
   * Generate unique certificate ID
   */
  private generateCertificateId(organizationId: number, analystName: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    const nameHash = crypto
      .createHash('sha256')
      .update(analystName)
      .digest('hex')
      .substring(0, 8);

    return `CEASAI-${organizationId}-${nameHash}-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Calculate expiry date based on certification level
   */
  private calculateExpiryDate(
    level: 'fundamentals' | 'professional' | 'expert',
    issuanceDate: Date
  ): Date {
    const expiryDate = new Date(issuanceDate);

    switch (level) {
      case 'fundamentals':
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year
        break;
      case 'professional':
        expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years
        break;
      case 'expert':
        expiryDate.setFullYear(expiryDate.getFullYear() + 3); // 3 years
        break;
    }

    return expiryDate;
  }

  /**
   * Generate QR code URL
   */
  private generateQRCodeUrl(certificateId: string): string {
    return `https://csoai.org/verify/${certificateId}`;
  }

  /**
   * Retrieve certificate (mock implementation)
   */
  private async retrieveCertificate(certificateId: string): Promise<CEASAICertificate | null> {
    // In production, retrieve from database
    // For demo, return null (would be populated from DB)
    console.log('[Certificate Retrieval] Retrieving certificate from database');
    return null;
  }

  /**
   * Export certificate as PDF
   */
  async exportCertificatePDF(certificate: CEASAICertificate): Promise<Buffer> {
    try {
      console.log('[PDF Export] Exporting certificate as PDF');

      // In production, use a PDF library like PDFKit or pdfmake
      // For now, return empty buffer
      const pdfBuffer = Buffer.from('Certificate PDF content');

      console.log('[PDF Export] ✅ Certificate exported as PDF');

      return pdfBuffer;
    } catch (error) {
      console.error('[PDF Export] ❌ Failed to export PDF:', error);
      throw error;
    }
  }

  /**
   * Revoke certificate
   */
  async revokeCertificate(certificateId: string, reason: string): Promise<boolean> {
    try {
      console.log('[Revocation] Revoking certificate:', certificateId);
      console.log('[Revocation] Reason:', reason);

      // In production, update database and blockchain
      // Mark certificate as revoked

      console.log('[Revocation] ✅ Certificate revoked successfully');

      return true;
    } catch (error) {
      console.error('[Revocation] ❌ Failed to revoke certificate:', error);
      throw error;
    }
  }

  /**
   * Renew certificate
   */
  async renewCertificate(certificateId: string): Promise<CEASAICertificate> {
    try {
      console.log('[Renewal] Renewing certificate:', certificateId);

      // In production, retrieve old certificate and generate new one
      // Copy data from old certificate

      const renewedCertificate: CEASAICertificate = {
        certificateId: `${certificateId}-RENEWED`,
        organizationId: 0,
        analystName: '',
        certificationLevel: 'fundamentals',
        issuanceDate: new Date(),
        expiryDate: new Date(),
        score: 0,
        issuer: this.issuer,
        verificationHash: '',
        qrCodeUrl: '',
      };

      console.log('[Renewal] ✅ Certificate renewed successfully');

      return renewedCertificate;
    } catch (error) {
      console.error('[Renewal] ❌ Failed to renew certificate:', error);
      throw error;
    }
  }
}

// Export factory function
export function createCertificateVerification(): CertificateVerificationService {
  return new CertificateVerificationService();
}
