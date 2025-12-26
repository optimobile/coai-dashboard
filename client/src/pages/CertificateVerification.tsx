/**
 * Certificate Verification Portal
 * Public page where anyone can verify CSOAI certifications by ID or QR code
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  QrCode,
  Award,
  Calendar,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function CertificateVerification() {
  const [certificateId, setCertificateId] = useState('');
  const [searchMode, setSearchMode] = useState<'manual' | 'qr'>('manual');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyCertificate = trpc.certificates.verifyCertificate.useMutation({
    onSuccess: (data: any) => {
      setVerificationResult(data);
      setIsVerifying(false);
      if (data.valid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate not found or invalid');
      }
    },
    onError: (error: any) => {
      setIsVerifying(false);
      toast.error('Verification failed: ' + error.message);
    },
  });

  const handleVerify = () => {
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    setIsVerifying(true);
    setVerificationResult(null);
    verifyCertificate.mutate({ certificateNumber: certificateId.trim() });
  };

  const handleQRScan = () => {
    toast.info('QR code scanning coming soon! Please enter certificate ID manually.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate Verification</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of CSOAI AI Safety Analyst certifications. Enter a certificate
            ID or scan a QR code to confirm credentials.
          </p>
        </div>

        {/* Verification Method Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={searchMode === 'manual' ? 'default' : 'outline'}
            onClick={() => setSearchMode('manual')}
            className={searchMode === 'manual' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <FileText className="mr-2 h-4 w-4" />
            Enter Certificate ID
          </Button>
          <Button
            variant={searchMode === 'qr' ? 'default' : 'outline'}
            onClick={() => {
              setSearchMode('qr');
              handleQRScan();
            }}
            className={searchMode === 'qr' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <QrCode className="mr-2 h-4 w-4" />
            Scan QR Code
          </Button>
        </div>

        {/* Search Input */}
        {searchMode === 'manual' && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter certificate ID (e.g., CSOAI-2024-001234)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isVerifying ? (
                    <>Verifying...</>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <Card
            className={`border-2 ${
              verificationResult.valid
                ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50'
                : 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50'
            }`}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {verificationResult.valid ? (
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
                <div>
                  <CardTitle className="text-2xl">
                    {verificationResult.valid ? 'Certificate Verified ✓' : 'Certificate Invalid ✗'}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {verificationResult.valid
                      ? 'This is an authentic CSOAI certification'
                      : 'This certificate could not be verified in our system'}
                  </p>
                </div>
              </div>
            </CardHeader>

            {verificationResult.valid && verificationResult.certificate && (
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Certificate Details */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="h-4 w-4" />
                        Certified Professional
                      </div>
                      <p className="font-semibold text-gray-900">
                        {verificationResult.certificate.userName}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Award className="h-4 w-4" />
                        Certification Level
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {verificationResult.certificate.level || 'Professional'}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <FileText className="h-4 w-4" />
                        Certificate Number
                      </div>
                      <p className="font-mono text-sm text-gray-900">
                        {verificationResult.certificate.certificateNumber}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        Issue Date
                      </div>
                      <p className="text-gray-900">
                        {new Date(verificationResult.certificate.issuedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Status
                      </div>
                      <Badge variant="outline" className="border-green-600 text-green-700">
                        Active & Valid
                      </Badge>
                    </div>

                    {verificationResult.certificate.courseName && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <FileText className="h-4 w-4" />
                          Course Completed
                        </div>
                        <p className="text-gray-900">
                          {verificationResult.certificate.courseName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Statement */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700">
                    <strong>Official Verification:</strong> This certificate has been issued by
                    CSOAI (Certified Safety Oversight AI) and is recognized globally as proof of
                    professional competence in AI Safety Analysis. The holder has successfully
                    completed all required training modules and passed the certification examination
                    with a score meeting or exceeding CSOAI standards.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Information Cards */}
        {!verificationResult && (
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Why Verify?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Confirm authenticity of AI Safety Analyst credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Verify certification is current and not revoked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Check professional qualifications before hiring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ensure compliance with regulatory requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Where to Find Certificate ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 flex-shrink-0">•</span>
                    <span>On the certificate document (top right corner)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 flex-shrink-0">•</span>
                    <span>In the QR code (scan with your phone camera)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 flex-shrink-0">•</span>
                    <span>Format: CSOAI-YYYY-XXXXXX (e.g., CSOAI-2024-001234)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-gray-900 flex-shrink-0">•</span>
                    <span>Contact the certificate holder if you don't have access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            For questions about certificate verification, contact{' '}
            <a href="mailto:verify@csoai.org" className="text-green-600 hover:underline">
              verify@csoai.org
            </a>
          </p>
          <p className="mt-2">
            All CSOAI certifications are issued in accordance with international AI safety standards
            (EU AI Act, NIST AI RMF, TC260).
          </p>
        </div>
      </div>
    </div>
  );
}
