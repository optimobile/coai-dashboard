import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, AlertTriangle, Shield, Users, Download, FileImage, FileText, FileSpreadsheet } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { exportAsPNG, exportAsPDF, exportAsCSV, flattenDataForCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';
import NotificationSubscriptionForm from '@/components/NotificationSubscriptionForm';

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#8b5cf6',
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    
    if (dateRange === '7d') {
      start.setDate(end.getDate() - 7);
    } else if (dateRange === '30d') {
      start.setDate(end.getDate() - 30);
    } else {
      start.setDate(end.getDate() - 90);
    }
    
    return { startDate: start, endDate: end };
  }, [dateRange]);

  // Fetch analytics data
  const { data: incidentTrends, isLoading: incidentsLoading } = trpc.analytics.getIncidentTrends.useQuery({
    startDate,
    endDate,
    groupBy,
  });

  const { data: complianceHistory, isLoading: complianceLoading } = trpc.analytics.getComplianceHistory.useQuery({
    startDate,
    endDate,
  });

  const { data: userActivity, isLoading: activityLoading } = trpc.analytics.getUserActivityMetrics.useQuery({
    startDate,
    endDate,
  });

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!incidentTrends || !complianceHistory || !userActivity) {
      return {
        totalIncidents: 0,
        criticalIncidents: 0,
        avgComplianceScore: 0,
        totalActiveUsers: 0,
      };
    }

    const totalIncidents = incidentTrends.reduce((sum, item) => sum + item.total, 0);
    const criticalIncidents = incidentTrends.reduce((sum, item) => sum + item.critical, 0);
    const avgComplianceScore = complianceHistory.length > 0
      ? complianceHistory.reduce((sum, item) => sum + item.averageScore, 0) / complianceHistory.length
      : 0;
    const totalActiveUsers = userActivity.reduce((sum, item) => sum + item.activeUsers, 0);

    return {
      totalIncidents,
      criticalIncidents,
      avgComplianceScore: Math.round(avgComplianceScore),
      totalActiveUsers,
    };
  }, [incidentTrends, complianceHistory, userActivity]);

  // Prepare incident type distribution data
  const incidentTypeData = useMemo(() => {
    if (!incidentTrends) return [];
    
    const typeCount: Record<string, number> = {};
    incidentTrends.forEach((item) => {
      Object.entries(item.byType).forEach(([type, count]) => {
        typeCount[type] = (typeCount[type] || 0) + (count as number);
      });
    });

    return Object.entries(typeCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [incidentTrends]);

  const handleExportPNG = async () => {
    try {
      await exportAsPNG('analytics-dashboard', `analytics-${dateRange}-${Date.now()}.png`);
      toast.success('Dashboard exported as PNG successfully');
    } catch (error) {
      console.error('Export PNG error:', error);
      toast.error('Failed to export as PNG');
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportAsPDF('analytics-dashboard', `analytics-${dateRange}-${Date.now()}.pdf`);
      toast.success('Dashboard exported as PDF successfully');
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error('Failed to export as PDF');
    }
  };

  const handleExportCSV = () => {
    try {
      // Combine all data for CSV export
      const allData: any[] = [];
      
      // Add incident trends
      if (incidentTrends) {
        incidentTrends.forEach(item => {
          const flatItem = flattenDataForCSV([item])[0];
          allData.push({
            category: 'Incident Trends',
            ...flatItem,
          });
        });
      }
      
      // Add compliance history
      if (complianceHistory) {
        complianceHistory.forEach(item => {
          const flatItem = flattenDataForCSV([item])[0];
          allData.push({
            category: 'Compliance History',
            ...flatItem,
          });
        });
      }
      
      // Add user activity
      if (userActivity) {
        userActivity.forEach(item => {
          const flatItem = flattenDataForCSV([item])[0];
          allData.push({
            category: 'User Activity',
            ...flatItem,
          });
        });
      }
      
      if (allData.length === 0) {
        toast.error('No data available to export');
        return;
      }
      
      exportAsCSV(allData, `analytics-${dateRange}-${Date.now()}.csv`);
      toast.success('Data exported as CSV successfully');
    } catch (error) {
      console.error('Export CSV error:', error);
      toast.error('Failed to export as CSV');
    }
  };

  return (
    <div id="analytics-dashboard" className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into incidents, compliance, and user activity</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPNG}>
              <FileImage className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'outline'}
                onClick={() => setDateRange(range)}
                className={dateRange === range ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </Button>
            ))}
          </div>

          <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Incidents</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{summaryMetrics.totalIncidents}</div>
              <p className="text-xs text-gray-500 mt-1">All severity levels</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Critical Incidents</CardTitle>
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{summaryMetrics.criticalIncidents}</div>
              <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Compliance Score</CardTitle>
                <Shield className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{summaryMetrics.avgComplianceScore}%</div>
              <p className="text-xs text-gray-500 mt-1">Across all frameworks</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{summaryMetrics.totalActiveUsers}</div>
              <p className="text-xs text-gray-500 mt-1">In selected period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Incident Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Trends Over Time</CardTitle>
              <CardDescription>Daily incident reports by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
              ) : incidentTrends && incidentTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={incidentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="critical" stackId="1" stroke={COLORS.critical} fill={COLORS.critical} />
                    <Area type="monotone" dataKey="high" stackId="1" stroke={COLORS.high} fill={COLORS.high} />
                    <Area type="monotone" dataKey="medium" stackId="1" stroke={COLORS.medium} fill={COLORS.medium} />
                    <Area type="monotone" dataKey="low" stackId="1" stroke={COLORS.low} fill={COLORS.low} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">No incident data available</div>
              )}
            </CardContent>
          </Card>

          {/* Compliance History */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Score History</CardTitle>
              <CardDescription>Average compliance scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              {complianceLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
              ) : complianceHistory && complianceHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={complianceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" stroke={COLORS.primary} strokeWidth={2} name="Avg Score" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">No compliance data available</div>
              )}
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity Metrics</CardTitle>
              <CardDescription>New registrations and active users</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
              ) : userActivity && userActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newUsers" fill={COLORS.secondary} name="New Users" />
                    <Bar dataKey="activeUsers" fill={COLORS.accent} name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">No user activity data available</div>
              )}
            </CardContent>
          </Card>

          {/* Incident Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Type Distribution</CardTitle>
              <CardDescription>Breakdown by incident category</CardDescription>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
              ) : incidentTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={incidentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incidentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">No incident type data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resolution Status */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Resolution Status</CardTitle>
            <CardDescription>Resolved vs pending incidents over time</CardDescription>
          </CardHeader>
          <CardContent>
            {incidentsLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
            ) : incidentTrends && incidentTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={incidentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="resolved" fill={COLORS.primary} name="Resolved" />
                  <Bar dataKey="pending" fill={COLORS.high} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No resolution data available</div>
            )}
          </CardContent>
        </Card>

        {/* Notification Subscription */}
        <div className="mt-8">
          <NotificationSubscriptionForm />
        </div>
      </div>
    </div>
  );
}
