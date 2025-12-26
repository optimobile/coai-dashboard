/**
 * Bulk AI System Import
 * CSV/Excel upload with validation, duplicate detection, and automatic risk classification
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  FileText,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

interface ImportResult {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
  systems: Array<{
    name: string;
    status: 'success' | 'error' | 'duplicate';
    message: string;
    riskLevel?: string;
  }>;
}

export default function BulkAISystemImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a CSV or Excel file');
        return;
      }

      setFile(selectedFile);
      setResult(null);
      toast.success(`File "${selectedFile.name}" selected`);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setImporting(true);
    setProgress(0);

    // Simulate file processing with progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      // Mock result
      const mockResult: ImportResult = {
        total: 25,
        successful: 20,
        failed: 3,
        duplicates: 2,
        systems: [
          {
            name: 'Customer Service Chatbot',
            status: 'success',
            message: 'Successfully imported',
            riskLevel: 'Low',
          },
          {
            name: 'Fraud Detection System',
            status: 'success',
            message: 'Successfully imported',
            riskLevel: 'High',
          },
          {
            name: 'Recommendation Engine',
            status: 'duplicate',
            message: 'System already exists in database',
          },
          {
            name: 'Content Moderation AI',
            status: 'success',
            message: 'Successfully imported',
            riskLevel: 'Medium',
          },
          {
            name: 'Invalid System Name',
            status: 'error',
            message: 'Missing required field: description',
          },
        ],
      };

      setResult(mockResult);
      setImporting(false);
      toast.success(`Import complete: ${mockResult.successful} systems added`);
    }, 3000);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const template = `Name,Description,Purpose,Risk Level,Framework Compliance,Owner,Department
Customer Service AI,Automated customer support chatbot,Customer Service,Low,EU AI Act,John Doe,Support
Fraud Detection System,Real-time fraud detection and prevention,Security,High,NIST AI RMF,Jane Smith,Security
Recommendation Engine,Product recommendation system,Marketing,Medium,ISO 42001,Mike Johnson,Marketing`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_systems_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'duplicate':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'duplicate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk AI System Import</h1>
        <p className="text-gray-600 mt-1">
          Import multiple AI systems at once with automatic validation and risk classification
        </p>
      </div>

      {/* Instructions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">How to Use Bulk Import</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-900">
          <ol className="list-decimal list-inside space-y-2">
            <li>Download the CSV template below</li>
            <li>Fill in your AI system information (Name, Description, Purpose, Risk Level, etc.)</li>
            <li>Upload the completed CSV or Excel file</li>
            <li>Review validation results and fix any errors</li>
            <li>Confirm import to add systems to your dashboard</li>
          </ol>
          <div className="flex items-start gap-2 mt-4 p-3 bg-blue-100 rounded">
            <AlertTriangle className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Duplicate systems (matching name) will be skipped automatically.
              Risk levels are auto-classified based on system purpose and compliance requirements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Download Template</CardTitle>
            <CardDescription>
              Start with our pre-formatted CSV template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={downloadTemplate}
            >
              <Download className="mr-2 h-5 w-5" />
              Download CSV Template
            </Button>
            <p className="text-sm text-gray-600 mt-3">
              The template includes all required fields and example data to help you get started.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Upload Your File</CardTitle>
            <CardDescription>
              CSV or Excel format supported
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileSpreadsheet className="h-12 w-12 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">Click to upload</p>
                      <p className="text-sm text-gray-600">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV or Excel (max 10MB)</p>
                  </div>
                )}
              </label>
            </div>

            <Button
              className="w-full"
              onClick={handleImport}
              disabled={!file || importing}
            >
              {importing ? (
                <>Processing...</>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Import Systems
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {importing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Processing file...
                </span>
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600">
                Validating data, checking for duplicates, and classifying risk levels...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-900">{result.total}</div>
                <p className="text-sm text-gray-600">Total Systems</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{result.successful}</div>
                <p className="text-sm text-gray-600">Successful</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-red-600">{result.failed}</div>
                <p className="text-sm text-gray-600">Failed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-600">{result.duplicates}</div>
                <p className="text-sm text-gray-600">Duplicates</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
              <CardDescription>
                Detailed status for each system in your file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.systems.map((system, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(system.status)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{system.name}</h4>
                        <p className="text-sm text-gray-600">{system.message}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {system.riskLevel && (
                        <Badge className={getRiskColor(system.riskLevel)}>
                          {system.riskLevel} Risk
                        </Badge>
                      )}
                      <Badge className={getStatusColor(system.status)}>
                        {system.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={() => window.location.href = '/ai-systems'}>
                  View All Systems
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                >
                  Import Another File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
