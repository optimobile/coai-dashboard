/**
 * Referral Manager Dashboard
 * Dashboard for referral managers to view team performance and manage commissions
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Table, TableBody, TableCell, TableHead, TableRow } from 'recharts';
import { Users, TrendingUp, DollarSign, CheckCircle2, Clock, AlertCircle, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  conversionRate: number;
  status: 'active' | 'inactive';
}

interface CommissionApproval {
  id: number;
  memberName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvalDate?: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    totalClicks: 450,
    totalConversions: 35,
    totalEarnings: 1750,
    conversionRate: 7.78,
    status: 'active',
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    totalClicks: 380,
    totalConversions: 28,
    totalEarnings: 1400,
    conversionRate: 7.37,
    status: 'active',
  },
  {
    id: 3,
    name: 'Emily Watson',
    email: 'emily@example.com',
    totalClicks: 250,
    totalConversions: 15,
    totalEarnings: 750,
    conversionRate: 6.0,
    status: 'active',
  },
  {
    id: 4,
    name: 'James Park',
    email: 'james@example.com',
    totalClicks: 170,
    totalConversions: 9,
    totalEarnings: 450,
    conversionRate: 5.29,
    status: 'inactive',
  },
];

const mockCommissionApprovals: CommissionApproval[] = [
  {
    id: 1,
    memberName: 'Sarah Chen',
    amount: 1750,
    status: 'pending',
    submittedDate: '2024-12-26',
  },
  {
    id: 2,
    memberName: 'Michael Rodriguez',
    amount: 1400,
    status: 'approved',
    submittedDate: '2024-12-25',
    approvalDate: '2024-12-26',
  },
  {
    id: 3,
    memberName: 'Emily Watson',
    amount: 750,
    status: 'pending',
    submittedDate: '2024-12-26',
  },
];

export default function ReferralManagerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Filter team members
  const filteredMembers = useMemo(() => {
    return mockTeamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Calculate team totals
  const teamTotals = useMemo(() => {
    return {
      totalMembers: mockTeamMembers.length,
      activeMembers: mockTeamMembers.filter((m) => m.status === 'active').length,
      totalClicks: mockTeamMembers.reduce((sum, m) => sum + m.totalClicks, 0),
      totalConversions: mockTeamMembers.reduce((sum, m) => sum + m.totalConversions, 0),
      totalEarnings: mockTeamMembers.reduce((sum, m) => sum + m.totalEarnings, 0),
      pendingApprovals: mockCommissionApprovals.filter((a) => a.status === 'pending').length,
      pendingAmount: mockCommissionApprovals
        .filter((a) => a.status === 'pending')
        .reduce((sum, a) => sum + a.amount, 0),
    };
  }, []);

  const handleApproveCommission = (id: number) => {
    console.log('Approving commission:', id);
    // TODO: Call API to approve commission
  };

  const handleRejectCommission = (id: number) => {
    console.log('Rejecting commission:', id);
    // TODO: Call API to reject commission
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Referral Manager Dashboard</h1>
          <p className="text-gray-600">Manage your referral team and approve commissions</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{teamTotals.activeMembers}</div>
              <p className="text-xs text-gray-500 mt-1">of {teamTotals.totalMembers} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Team Conversions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{teamTotals.totalConversions}</div>
              <p className="text-xs text-gray-500 mt-1">Total certified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Team Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${teamTotals.totalEarnings}</div>
              <p className="text-xs text-gray-500 mt-1">Total commission</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">${teamTotals.pendingAmount}</div>
              <p className="text-xs text-gray-500 mt-1">{teamTotals.pendingApprovals} pending</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Commission Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Commission Approvals</CardTitle>
              <CardDescription>Review and approve pending commission requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommissionApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{approval.memberName}</div>
                      <div className="text-sm text-gray-500">
                        Submitted: {new Date(approval.submittedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right mr-6">
                      <div className="font-semibold text-gray-900">${approval.amount}</div>
                      <div className={`text-xs font-medium ${
                        approval.status === 'pending'
                          ? 'text-amber-600'
                          : approval.status === 'approved'
                            ? 'text-emerald-600'
                            : 'text-red-600'
                      }`}>
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </div>
                    </div>

                    {approval.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectCommission(approval.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveCommission(approval.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Approve
                        </Button>
                      </div>
                    )}

                    {approval.status === 'approved' && (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Approved</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>View and manage referral team performance</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Team Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Clicks</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Conversions</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Conv. Rate</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Earnings</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{member.totalClicks}</td>
                        <td className="py-3 px-4 text-gray-900">{member.totalConversions}</td>
                        <td className="py-3 px-4 text-gray-900">{member.conversionRate.toFixed(2)}%</td>
                        <td className="py-3 px-4 font-semibold text-emerald-600">${member.totalEarnings}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No team members found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
