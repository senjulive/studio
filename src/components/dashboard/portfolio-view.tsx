"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart, BarChart3, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const portfolioData = {
  totalValue: 15750.50,
  totalChange: 425.75,
  totalChangePercent: 2.78,
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.25,
      value: 8750.00,
      change: 325.50,
      changePercent: 3.87,
      allocation: 55.6,
      icon: '₿',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 2.1,
      value: 4200.00,
      change: 85.25,
      changePercent: 2.07,
      allocation: 26.7,
      icon: 'Ξ',
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      amount: 1500.25,
      value: 1500.25,
      change: 0.00,
      changePercent: 0.00,
      allocation: 9.5,
      icon: '₮',
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      amount: 3.2,
      value: 800.00,
      change: 15.00,
      changePercent: 1.91,
      allocation: 5.1,
      icon: '🔸',
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      amount: 1250.0,
      value: 500.25,
      change: 0.00,
      changePercent: 0.00,
      allocation: 3.2,
      icon: '◇',
    },
  ],
  performance: {
    day: { value: 125.50, percent: 0.80 },
    week: { value: 385.75, percent: 2.51 },
    month: { value: 1125.25, percent: 7.70 },
    year: { value: 3850.75, percent: 32.35 },
  }
};

export function PortfolioView() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <h1 className="text-2xl font-bold text-gradient">Portfolio</h1>
      </div>

      <div className="mobile-content">
        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <h2 className="text-3xl font-bold mb-2">
                {formatCurrency(portfolioData.totalValue)}
              </h2>
              <div className="flex items-center justify-center gap-2">
                {portfolioData.totalChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`font-medium ${
                  portfolioData.totalChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatCurrency(Math.abs(portfolioData.totalChange))} ({formatPercent(portfolioData.totalChangePercent)})
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">24h change</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(portfolioData.performance).map(([period, data]) => (
                  <div key={period} className="text-center">
                    <p className="text-sm font-medium capitalize mb-1">{period}</p>
                    <p className={`text-lg font-bold ${
                      data.value >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatPercent(data.percent)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(data.value)}
                    </p>
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
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolioData.assets.map((asset, index) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{asset.icon}</span>
                        <div>
                          <h3 className="font-medium">{asset.symbol}</h3>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(asset.value)}</p>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant={asset.change >= 0 ? "default" : "destructive"}
                            className={asset.change >= 0 ? 
                              "bg-green-500/20 text-green-500 border-green-500/30" : 
                              "bg-red-500/20 text-red-500 border-red-500/30"
                            }
                          >
                            {formatPercent(asset.changePercent)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={asset.allocation} 
                        className="flex-1 h-2"
                      />
                      <span className="text-xs text-muted-foreground w-10">
                        {asset.allocation}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{asset.amount.toFixed(asset.symbol === 'USDT' ? 2 : 4)} {asset.symbol}</span>
                      <span>{formatCurrency(asset.change)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="mobile-stat-grid">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Diversification</p>
                <p className="text-lg font-bold">Excellent</p>
                <p className="text-xs text-green-500">5 assets</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Percent className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className="text-lg font-bold">Moderate</p>
                <p className="text-xs text-blue-500">Balanced</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
