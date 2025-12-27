/**
 * Admin Exam Oversight Dashboard
 * Analytics, flagged certificates, and cheating pattern detection
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle,
  Flag,
  BarChart3,
  Shield,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdminExamDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [analytics, setAnalytics] = useState({
    totalExams: 1247,
    passRate: 78,
    avgScore: 82,
    proctoringStats: {
      totalProctored: 1089,
      flaggedCount: 87,
      invalidCount: 12,
      flagRate: 9.1,
    },
  });

  const [integrityTrends, setIntegrityTrends] = useState([
    { date: '2025-12-01', avgScore: 80, flagCount: 5, passRate: 75 },
    { date: '2025-12-02', avgScore: 82, flagCount: 4, passRate: 78 },
    { date: '2025-12-03', avgScore: 81, flagCount: 6, passRate: 76 },
    { date: '2025-12-04', avgScore: 83, flagCount: 3, passRate: 80 },
    { date: '2025-12-05', avgScore: 84, flagCount: 2, passRate: 82 },
  ]);

  const [certificationStats, setCertificationStats] = useState({
    fundamentals: { total: 450, passed: 380, flagged: 25 },
    professional: { total: 520, passed: 390, flagged: 42 },
    expert: { total: 277, passed: 195, flagged: 20 },
  });

  const [flaggedCertificates, setFlaggedCertificates] = useState([
    {
      id: 1,
      certificateNumber: 'CEASA-1735689600000-A1B2C3D4',
      userId: 'user-001',
      certificationType: 'professional',
      integrityScore: 42,
      flagReason: 'Low integrity score, suspicious eye movement patterns',
      flaggedAt: new Date('2025-12-27'),
      reviewStatus: 'pending' as const,
    },
    {
      id: 2,
      certificateNumber: 'CEASA-1735603200000-E5F6G7H8',
      userId: 'user-002',
      certificationType: 'fundamentals',
      integrityScore: 58,
      flagReason: 'Multiple face detections, possible cheating attempt',
      flaggedAt: new Date('2025-12-26'),
      reviewStatus: 'pending' as const,
    },
    {
      id: 3,
      certificateNumber: 'CEASA-1735516800000-I9J0K1L2',
      userId: 'user-003',
      certificationType: 'expert',
      integrityScore: 35,
      flagReason: 'Critical: Screen sharing detected, multiple suspicious events',
      flaggedAt: new Date('2025-12-25'),
      reviewStatus: 'pending' as const,
    },
  ]);

  const [suspiciousPatterns, setSuspiciousPatterns] = useState([
    {
      pattern: 'Perfect scores (100%)',
      count: 12,
      severity: 'medium' as const,
      affectedUsers: 8,
    },
    {
      pattern: 'Flagged by proctoring',
      count: 87,
      severity: 'high' as const,
      affectedUsers: 73,
    },
    {
      pattern: 'Low integrity score (<50%)',
      count: 34,
      severity: 'critical' as const,
      affectedUsers: 29,
    },
    {
      pattern: 'Rapid retakes (<24 hours)',
      count: 156,
      severity: 'low' as const,
      affectedUsers: 142,
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const certificationData = [
    { name: 'Fundamentals', value: analytics.totalExams * 0.36 },
    { name: 'Professional', value: analytics.totalExams * 0.42 },
    { name: 'Expert', value: analytics.totalExams * 0.22 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-8 h-8 text-blue-600" />
                Exam Oversight Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Real-time analytics and integrity monitoring</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  onClick={() => setTimeRange(range)}
                  className="text-sm"
                >
                  {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Exams</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalExams}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pass Rate</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.passRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Score</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.avgScore}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flag Rate</p>
                  <p className="text-3xl font-bold text-red-600">{analytics.proctoringStats.flagRate}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Integrity Trends */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Integrity Trends</CardTitle>
              <CardDescription>Average score and flagged attempts over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={integrityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" name="Avg Score" />
                  <Line type="monotone" dataKey="flagCount" stroke="#ef4444" name="Flagged Count" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Certification Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Certification Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={certificationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${Math.round(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {certificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Tabs defaultValue="flagged" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="flagged">Flagged Certificates</TabsTrigger>
              <TabsTrigger value="patterns">Suspicious Patterns</TabsTrigger>
              <TabsTrigger value="stats">Certification Stats</TabsTrigger>
            </TabsList>

            {/* Flagged Certificates Tab */}
            <TabsContent value="flagged" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-600" />
                    Certificates Requiring Manual Review
                  </CardTitle>
                  <CardDescription>
                    {flaggedCertificates.length} certificates flagged for integrity concerns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {flaggedCertificates.map((cert) => (
                      <motion.div
                        key={cert.id}
                        whileHover={{ x: 4 }}
                        className="p-4 border border-red-200 rounded-lg bg-red-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="destructive">{cert.certificationType}</Badge>
                              <Badge variant="outline">Integrity: {cert.integrityScore}%</Badge>
                            </div>
                            <p className="font-mono text-sm text-gray-600 mb-1">
                              {cert.certificateNumber}
                            </p>
                            <p className="text-sm text-gray-700">{cert.flagReason}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Flagged: {cert.flaggedAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              Reject
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suspicious Patterns Tab */}
            <TabsContent value="patterns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Detected Cheating Patterns
                  </CardTitle>
                  <CardDescription>
                    Suspicious activity detected across exam attempts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suspiciousPatterns.map((pattern, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ x: 4 }}
                        className={`p-4 rounded-lg border ${getSeverityColor(pattern.severity)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{pattern.pattern}</p>
                            <p className="text-sm mt-1">
                              {pattern.count} instances • {pattern.affectedUsers} users affected
                            </p>
                          </div>
                          <Badge
                            variant={
                              pattern.severity === 'critical'
                                ? 'destructive'
                                : pattern.severity === 'high'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {pattern.severity}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certification Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Statistics by Certification Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(certificationStats).map(([level, stats]) => (
                      <motion.div
                        key={level}
                        whileHover={{ y: -4 }}
                        className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100"
                      >
                        <h3 className="font-semibold text-gray-900 capitalize mb-3">{level}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold">{stats.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Passed:</span>
                            <span className="font-semibold text-green-600">{stats.passed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Flagged:</span>
                            <span className="font-semibold text-red-600">{stats.flagged}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pass Rate:</span>
                              <span className="font-semibold">
                                {Math.round((stats.passed / stats.total) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-900">
              <strong>Action Required:</strong> 3 certificates are pending manual review due to
              integrity concerns. Please review and approve/reject by end of day.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
}
