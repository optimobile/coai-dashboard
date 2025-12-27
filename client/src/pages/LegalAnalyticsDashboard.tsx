import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { LegalFlagBadge } from '@/components/LegalFlagBadge';

interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface ViolationTrend {
  date: string;
  category: string;
  count: number;
  riskScore: number;
}

interface EnforcementMetric {
  authority: string;
  jurisdiction: string;
  totalCases: number;
  avgResponseTime: number;
  resolutionRate: number;
}

export function LegalAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');

  // Sample data - in production, this would come from the API
  const metrics: MetricCard[] = [
    {
      title: 'Total Flags This Month',
      value: 24,
      change: '+12%',
      trend: 'up',
      icon: <AlertCircle className="w-6 h-6" />,
    },
    {
      title: 'Critical Cases Open',
      value: 5,
      change: '-2',
      trend: 'down',
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
    },
    {
      title: 'Avg Response Time',
      value: '24h',
      change: '-4h',
      trend: 'down',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: 'Compliance Score',
      value: '78%',
      change: '+5%',
      trend: 'up',
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ];

  const violationTrends: ViolationTrend[] = [
    {
      date: '2025-12-20',
      category: 'Bias & Discrimination',
      count: 5,
      riskScore: 85,
    },
    {
      date: '2025-12-21',
      category: 'Data Privacy',
      count: 3,
      riskScore: 72,
    },
    {
      date: '2025-12-22',
      category: 'Transparency',
      count: 4,
      riskScore: 68,
    },
    {
      date: '2025-12-23',
      category: 'Safety & Security',
      count: 2,
      riskScore: 91,
    },
  ];

  const enforcementMetrics: EnforcementMetric[] = [
    {
      authority: 'European Commission',
      jurisdiction: 'EU',
      totalCases: 12,
      avgResponseTime: 48,
      resolutionRate: 75,
    },
    {
      authority: 'UK ICO',
      jurisdiction: 'UK',
      totalCases: 8,
      avgResponseTime: 36,
      resolutionRate: 87,
    },
    {
      authority: 'German BfDI',
      jurisdiction: 'Germany',
      totalCases: 6,
      avgResponseTime: 24,
      resolutionRate: 100,
    },
  ];

  const topViolations = [
    { type: 'Bias & Discrimination', count: 18, percentage: 32 },
    { type: 'Data Privacy', count: 14, percentage: 25 },
    { type: 'Transparency', count: 12, percentage: 21 },
    { type: 'Safety & Security', count: 11, percentage: 20 },
  ];

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting analytics as ${format}`);
    // Implementation would call the export API
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Legal Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track violation trends, enforcement response times, and compliance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Jurisdiction</label>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="all">All Jurisdictions</option>
              <option value="eu">European Union</option>
              <option value="uk">United Kingdom</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="all">All Sectors</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="tech">Technology</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  {metric.change && (
                    <p
                      className={`text-sm mt-2 ${
                        metric.trend === 'up'
                          ? 'text-red-600'
                          : metric.trend === 'down'
                            ? 'text-green-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {metric.change}
                    </p>
                  )}
                </div>
                <div className="text-gray-400">{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Violation Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Violation Trends (Last 7 Days)</CardTitle>
          <CardDescription>
            Track the most common violation categories and their risk scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violationTrends.map((trend, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{trend.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trend.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{trend.count} cases</span>
                  <LegalFlagBadge
                    severity={
                      trend.riskScore >= 80
                        ? 'critical'
                        : trend.riskScore >= 60
                          ? 'high'
                          : trend.riskScore >= 40
                            ? 'medium'
                            : 'low'
                    }
                    riskScore={trend.riskScore}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Violations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Top Violation Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topViolations.map((violation, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{violation.type}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {violation.count} ({violation.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${violation.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enforcement Authority Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Enforcement Authority Metrics</CardTitle>
            <CardDescription>
              Response times and resolution rates by authority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enforcementMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="font-medium mb-2">{metric.authority}</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Cases</p>
                      <p className="font-semibold">{metric.totalCases}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Avg Response</p>
                      <p className="font-semibold">{metric.avgResponseTime}h</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Resolution</p>
                      <p className="font-semibold">{metric.resolutionRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Risk Predictions (Next 30 Days)
          </CardTitle>
          <CardDescription>
            Predictive analytics based on historical trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Predicted Risk Score
              </p>
              <p className="text-3xl font-bold text-blue-600">72</p>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Confidence: 85%
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Trend Direction
              </p>
              <p className="text-2xl font-bold text-orange-600">↑ Increasing</p>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                +8% from last week
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Emerging Risks
              </p>
              <ul className="text-sm space-y-1">
                <li>• Rapid increase in bias cases</li>
                <li>• Privacy violations trending</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
