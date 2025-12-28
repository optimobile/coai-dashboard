import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import {
  BarChart,
  Bar,
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
import {
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  Filter,
  Download,
  Archive,
} from 'lucide-react';

type FeedbackCategory = 'training' | 'ui' | 'features' | 'other';

const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  training: '#3b82f6',
  ui: '#8b5cf6',
  features: '#10b981',
  other: '#6b7280',
};

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  training: 'Training',
  ui: 'UI/UX',
  features: 'Features',
  other: 'Other',
};

export default function FeedbackDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const { data: feedbackStats } = trpc.feedback.getStats.useQuery();
  const { data: feedbackList } = trpc.feedback.list.useQuery({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: 50,
  });

  // Prepare chart data
  const categoryData = feedbackStats ? [
    { name: 'Training', value: feedbackStats.byCategory.training },
    { name: 'UI/UX', value: feedbackStats.byCategory.ui },
    { name: 'Features', value: feedbackStats.byCategory.features },
    { name: 'Other', value: feedbackStats.byCategory.other },
  ] : [];

  const trendData = feedbackStats?.trend || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            User Feedback Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and analyze feedback to continuously improve CSOAI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {feedbackStats?.total || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                All time submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {feedbackStats?.thisMonth || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Recent submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {feedbackStats?.topCategory ? CATEGORY_LABELS[feedbackStats.topCategory as FeedbackCategory] : 'N/A'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Most feedback about
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {feedbackStats?.responseRate || 0}%
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Feedback with email
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback by Category</CardTitle>
              <CardDescription>Distribution of feedback topics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(CATEGORY_COLORS)[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Trend</CardTitle>
              <CardDescription>Submissions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Feedback</CardTitle>
                <CardDescription>Latest user submissions</CardDescription>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="training">Training</option>
                  <option value="ui">UI/UX</option>
                  <option value="features">Features</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Relevant</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackList && feedbackList.length > 0 ? (
                feedbackList.map((item: any) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            item.category === 'training'
                              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                              : item.category === 'ui'
                              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                              : item.category === 'features'
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                              : 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {CATEGORY_LABELS[item.category as FeedbackCategory]}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          {item.email}
                        </a>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-white">{item.feedback}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No feedback yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
