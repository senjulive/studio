"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Calculator,
  FileText,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

// Mock financial data
const financialOverview = {
  totalRevenue: 125750.50,
  totalFees: 8450.25,
  netProfit: 117300.25,
  monthlyGrowth: 12.5,
  activeUsers: 1247,
  avgRevenuePerUser: 100.84
};

const revenueStreams = [
  { source: 'Trading Fees', amount: 45250.00, percentage: 36, growth: 8.5 },
  { source: 'Deposit Fees', amount: 32150.00, percentage: 25.6, growth: 15.2 },
  { source: 'Withdrawal Fees', amount: 28100.00, percentage: 22.4, growth: -2.1 },
  { source: 'Premium Subscriptions', amount: 20250.50, percentage: 16, growth: 25.8 }
];

const monthlyData = [
  { month: 'Jan', revenue: 85000, fees: 6500, profit: 78500 },
  { month: 'Feb', revenue: 92000, fees: 7200, profit: 84800 },
  { month: 'Mar', revenue: 105000, fees: 8100, profit: 96900 },
  { month: 'Apr', revenue: 115000, fees: 8900, profit: 106100 },
  { month: 'May', revenue: 125750, fees: 9450, profit: 116300 }
];

const topUsers = [
  { id: 'user_001', name: 'John Smith', email: 'john@example.com', totalFees: 2450.50, trades: 148 },
  { id: 'user_002', name: 'Sarah Johnson', email: 'sarah@test.com', totalFees: 1875.25, trades: 92 },
  { id: 'user_003', name: 'Mike Wilson', email: 'mike@crypto.com', totalFees: 1650.75, trades: 156 },
  { id: 'user_004', name: 'Emma Davis', email: 'emma@trading.io', totalFees: 1325.00, trades: 78 },
  { id: 'user_005', name: 'Alex Brown', email: 'alex@invest.com', totalFees: 1180.90, trades: 134 }
];

export function FinancialManager() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 p-2 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Financial Management</h2>
            <p className="text-muted-foreground">Revenue tracking and financial analytics</p>
          </div>
        </div>
        <Button className="btn-primary">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Total Revenue</span>
              </div>
              <p className="text-3xl font-bold text-green-500">
                {formatCurrency(financialOverview.totalRevenue)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatPercent(financialOverview.monthlyGrowth)} this month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Total Fees</span>
              </div>
              <p className="text-3xl font-bold text-blue-500">
                {formatCurrency(financialOverview.totalFees)}
              </p>
              <p className="text-sm text-muted-foreground">
                From all transactions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Net Profit</span>
              </div>
              <p className="text-3xl font-bold text-purple-500">
                {formatCurrency(financialOverview.netProfit)}
              </p>
              <p className="text-sm text-muted-foreground">
                After all expenses
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Financial Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="revenue">Revenue Streams</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
          <TabsTrigger value="settings">Fee Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {revenueStreams.map((stream, index) => (
                <motion.div
                  key={stream.source}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{stream.source}</h3>
                      <Badge 
                        className={stream.growth >= 0 
                          ? "bg-green-500/20 text-green-500 border-green-500/30" 
                          : "bg-red-500/20 text-red-500 border-red-500/30"
                        }
                      >
                        {formatPercent(stream.growth)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(stream.amount)}</p>
                      <p className="text-sm text-muted-foreground">{stream.percentage}%</p>
                    </div>
                  </div>
                  <Progress value={stream.percentage} className="h-2" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((month, index) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 glass rounded-lg"
                    >
                      <span className="font-medium">{month.month}</span>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(month.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          Profit: {formatCurrency(month.profit)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 glass rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-lg font-bold">{financialOverview.activeUsers.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg Revenue/User</span>
                      <span className="text-lg font-bold">{formatCurrency(financialOverview.avgRevenuePerUser)}</span>
                    </div>
                  </div>
                  <div className="p-4 glass rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Growth</span>
                      <span className="text-lg font-bold text-green-500">
                        {formatPercent(financialOverview.monthlyGrowth)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Top Revenue Contributors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>Avg Fee/Trade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="font-bold text-green-500">
                        {formatCurrency(user.totalFees)}
                      </TableCell>
                      <TableCell>{user.trades}</TableCell>
                      <TableCell>
                        {formatCurrency(user.totalFees / user.trades)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Fee Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Trading Fees</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-sm">Maker Fee</span>
                      <span className="font-medium">0.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-sm">Taker Fee</span>
                      <span className="font-medium">0.15%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Transaction Fees</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-sm">Deposit Fee</span>
                      <span className="font-medium">$2.50</span>
                    </div>
                    <div className="flex justify-between items-center p-3 glass rounded-lg">
                      <span className="text-sm">Withdrawal Fee</span>
                      <span className="font-medium">$5.00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="btn-primary">
                  Update Fee Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
