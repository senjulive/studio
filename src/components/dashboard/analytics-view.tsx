"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const analytics = {
  totalProfit: 2450.75,
  totalLoss: -650.25,
  netProfit: 1800.50,
  winRate: 68.5,
  totalTrades: 147,
  successfulTrades: 101,
  avgProfit: 24.26,
  avgLoss: -14.13,
  bestDay: 185.50,
  worstDay: -92.75,
  monthlyPerformance: [
    { month: 'Jan', profit: 320.50 },
    { month: 'Feb', profit: 485.75 },
    { month: 'Mar', profit: 625.25 },
    { month: 'Apr', profit: 369.00 },
  ],
  assetAllocation: [
    { asset: 'BTC/USDT', percentage: 45, profit: 850.25 },
    { asset: 'ETH/USDT', percentage: 30, profit: 620.50 },
    { asset: 'BNB/USDT', percentage: 15, profit: 225.75 },
    { asset: 'ADA/USDT', percentage: 10, profit: 104.00 },
  ]
};

export function AnalyticsView() {
  const profitPercentage = (analytics.netProfit / (analytics.totalProfit + Math.abs(analytics.totalLoss))) * 100;

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <h1 className="text-2xl font-bold text-gradient">Trading Analytics</h1>
      </div>

      <div className="mobile-content">
        {/* Overview Cards */}
        <div className="mobile-stat-grid gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Net Profit</span>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  ${analytics.netProfit.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{profitPercentage.toFixed(1)}% overall
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Win Rate</span>
                </div>
                <p className="text-2xl font-bold text-blue-500">
                  {analytics.winRate}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {analytics.successfulTrades}/{analytics.totalTrades} trades
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">Best Day</span>
                </div>
                <p className="text-2xl font-bold text-emerald-500">
                  ${analytics.bestDay.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Highest single day
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Avg Trade</span>
                </div>
                <p className="text-2xl font-bold text-purple-500">
                  ${analytics.avgProfit.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Per successful trade
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Profit/Loss Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Profit/Loss Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Total Profit</span>
                  <span className="text-sm font-medium text-green-500">
                    ${analytics.totalProfit.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={75} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Total Loss</span>
                  <span className="text-sm font-medium text-red-500">
                    ${analytics.totalLoss.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={25} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.monthlyPerformance.map((month, index) => (
                  <div key={month.month} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{month.month}</span>
                    <div className="flex-1">
                      <Progress 
                        value={(month.profit / 625.25) * 100} 
                        className="h-3"
                      />
                    </div>
                    <span className="text-sm font-medium text-green-500">
                      ${month.profit.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Asset Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Asset Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.assetAllocation.map((asset, index) => (
                  <div key={asset.asset} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{asset.asset}</span>
                      <span className="text-sm text-green-500">
                        +${asset.profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={asset.percentage} 
                        className="flex-1 h-2"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {asset.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
