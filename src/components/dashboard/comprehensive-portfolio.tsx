'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Minus,
  BarChart3,
  PieChart,
  History,
  Send,
  Download,
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  percentage: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade';
  asset: string;
  amount: number;
  value: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  hash?: string;
}

interface PortfolioProps {
  className?: string;
}

export function ComprehensivePortfolio({ className }: PortfolioProps) {
  const [isBalanceVisible, setIsBalanceVisible] = React.useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('1D');

  const totalPortfolioValue = 12847.32;
  const totalChange24h = 2.34;
  const totalPnL = 847.32;

  const assets: Asset[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.28394,
      value: 12280.45,
      change24h: 2.4,
      percentage: 65.2,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 1.5673,
      value: 4156.82,
      change24h: -1.2,
      percentage: 22.1,
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      balance: 1847.23,
      value: 1847.23,
      change24h: 0.01,
      percentage: 9.8,
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      balance: 1.892,
      value: 596.82,
      change24h: 4.2,
      percentage: 3.2,
    },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      asset: 'USDT',
      amount: 1000,
      value: 1000,
      status: 'completed',
      timestamp: '2024-01-15 14:30:22',
      hash: '0x1234...5678',
    },
    {
      id: '2',
      type: 'trade',
      asset: 'BTC',
      amount: 0.02315,
      value: 1000,
      status: 'completed',
      timestamp: '2024-01-15 14:35:18',
    },
    {
      id: '3',
      type: 'withdrawal',
      asset: 'ETH',
      amount: 0.5,
      value: 1325.44,
      status: 'pending',
      timestamp: '2024-01-15 15:12:05',
    },
  ];

  const timeframes = ['1H', '1D', '1W', '1M', '3M', '1Y', 'ALL'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'trade':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Track your crypto investments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Total Portfolio Value</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              >
                {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  {isBalanceVisible ? formatCurrency(totalPortfolioValue) : '••••••'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`flex items-center gap-1 ${totalChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {totalChange24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{Math.abs(totalChange24h)}%</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span
                    className={`font-medium ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {totalPnL >= 0 ? '+' : ''}
                    {formatCurrency(totalPnL)}
                  </span>
                  <span className="text-muted-foreground text-sm">24h</span>
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {timeframes.map(timeframe => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className="flex-1"
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>

              {/* Mock Chart Area */}
              <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Portfolio Chart</p>
                  <p className="text-xs text-muted-foreground">
                    Real-time performance visualization
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map(asset => (
                <div key={asset.symbol} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="font-medium">{asset.symbol}</span>
                    </div>
                    <span className="text-muted-foreground">{asset.percentage}%</span>
                  </div>
                  <Progress value={asset.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Assets</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Deposit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                  <div className="col-span-3">Asset</div>
                  <div className="col-span-2">Balance</div>
                  <div className="col-span-2">Value</div>
                  <div className="col-span-2">24h Change</div>
                  <div className="col-span-2">Allocation</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Asset Rows */}
                {assets.map(asset => (
                  <div
                    key={asset.symbol}
                    className="grid grid-cols-12 gap-4 py-4 text-sm hover:bg-muted/50 rounded-lg px-2"
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{asset.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col justify-center">
                      <span className="font-medium">
                        {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </span>
                    </div>

                    <div className="col-span-2 flex flex-col justify-center">
                      <span className="font-medium">{formatCurrency(asset.value)}</span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div
                        className={`flex items-center gap-1 ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {asset.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="font-medium">{Math.abs(asset.change24h)}%</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex-1">
                          <Progress value={asset.percentage} className="h-2" />
                        </div>
                        <span className="text-xs text-muted-foreground">{asset.percentage}%</span>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Transactions
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{transaction.type}</p>
                          <Badge
                            variant={
                              transaction.status === 'completed'
                                ? 'default'
                                : transaction.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.amount} {transaction.asset} • {transaction.timestamp}
                        </p>
                        {transaction.hash && (
                          <p className="text-xs text-muted-foreground font-mono">
                            {transaction.hash}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(transaction.value)}</p>
                      <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Return</span>
                    <span className="font-bold text-green-500">+$847.32 (7.04%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Performing Asset</span>
                    <span className="font-bold">BNB (+4.2%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Worst Performing Asset</span>
                    <span className="font-bold text-red-500">ETH (-1.2%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Daily Return</span>
                    <span className="font-bold">+0.23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Portfolio Volatility</span>
                    <span className="font-bold">12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sharpe Ratio</span>
                    <span className="font-bold">1.67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Max Drawdown</span>
                    <span className="font-bold text-red-500">-8.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Beta (vs BTC)</span>
                    <span className="font-bold">0.87</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
              <CardDescription>Customize your portfolio experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hide Small Balances</p>
                    <p className="text-sm text-muted-foreground">Hide assets worth less than $10</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Toggle
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-refresh</p>
                    <p className="text-sm text-muted-foreground">Automatically update prices</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified of significant changes
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
