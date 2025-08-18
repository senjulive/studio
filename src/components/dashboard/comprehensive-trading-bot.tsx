'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Bot,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Settings,
  Play,
  Pause,
  BarChart3,
  Activity,
  Target,
  Zap,
  Timer,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface TradingBotProps {
  className?: string;
}

export function ComprehensiveTradingBot({ className }: TradingBotProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [balance, setBalance] = React.useState(1000);
  const [profit, setProfit] = React.useState(145.67);
  const [gridCount, setGridCount] = React.useState(10);
  const [riskLevel, setRiskLevel] = React.useState(3);
  const [selectedPair, setSelectedPair] = React.useState('BTC/USDT');

  const tradingPairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT'];

  const stats = {
    totalTrades: 1247,
    successRate: 87.5,
    dailyProfit: 23.45,
    uptime: 99.8,
    gridSpacing: 0.5,
    lastUpdate: new Date().toLocaleTimeString(),
  };

  const recentTrades = [
    {
      id: 1,
      type: 'buy',
      pair: 'BTC/USDT',
      amount: 0.001,
      price: 43250,
      profit: 12.34,
      time: '2 min ago',
    },
    {
      id: 2,
      type: 'sell',
      pair: 'BTC/USDT',
      amount: 0.001,
      price: 43280,
      profit: 8.76,
      time: '5 min ago',
    },
    {
      id: 3,
      type: 'buy',
      pair: 'ETH/USDT',
      amount: 0.05,
      price: 2650,
      profit: 15.23,
      time: '8 min ago',
    },
    {
      id: 4,
      type: 'sell',
      pair: 'BTC/USDT',
      amount: 0.001,
      price: 43290,
      profit: 11.45,
      time: '12 min ago',
    },
  ];

  const handleToggleBot = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header with Bot Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isRunning
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : 'bg-gray-500/20 border-2 border-gray-500/50'
              }`}
            >
              <Bot className={`w-8 h-8 ${isRunning ? 'text-green-500' : 'text-gray-500'}`} />
            </div>
            {isRunning && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Astral Trading Bot</h1>
            <p className="text-muted-foreground">AI-Powered Grid Trading System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isRunning ? 'default' : 'secondary'} className="px-3 py-1">
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Running
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stopped
              </>
            )}
          </Badge>
          <Button
            onClick={handleToggleBot}
            size="lg"
            variant={isRunning ? 'destructive' : 'default'}
            className="px-6"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Bot
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Bot
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold text-green-500">+${profit.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Profit</p>
                <p className="text-2xl font-bold text-green-500">+${stats.dailyProfit}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Real-time Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Real-time Performance
                </CardTitle>
                <CardDescription>Live trading metrics and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grid Completion</span>
                    <span>7/10 positions</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span>{stats.uptime}%</span>
                  </div>
                  <Progress value={stats.uptime} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{stats.totalTrades}</p>
                    <p className="text-xs text-muted-foreground">Total Trades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{stats.gridSpacing}%</p>
                    <p className="text-xs text-muted-foreground">Grid Spacing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Status
                </CardTitle>
                <CardDescription>Current market conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {tradingPairs.map(pair => (
                    <div
                      key={pair}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            pair === selectedPair ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="font-medium">{pair}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${(Math.random() * 50000 + 10000).toFixed(2)}
                        </div>
                        <div
                          className={`text-xs ${
                            Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {Math.random() > 0.5 ? '+' : '-'}
                          {(Math.random() * 5).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trading Configuration</CardTitle>
                <CardDescription>Adjust your trading bot parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Trading Pair</Label>
                  <select
                    className="w-full p-2 rounded-md border bg-background"
                    value={selectedPair}
                    onChange={e => setSelectedPair(e.target.value)}
                  >
                    {tradingPairs.map(pair => (
                      <option key={pair} value={pair}>
                        {pair}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Grid Count: {gridCount}</Label>
                  <Slider
                    value={[gridCount]}
                    onValueChange={value => setGridCount(value[0])}
                    max={20}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Risk Level: {riskLevel}/5</Label>
                  <Slider
                    value={[riskLevel]}
                    onValueChange={value => setRiskLevel(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment">Investment Amount (USDT)</Label>
                  <Input
                    id="investment"
                    type="number"
                    value={balance}
                    onChange={e => setBalance(Number(e.target.value))}
                    min="100"
                    max="100000"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Fine-tune your trading strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Restart</Label>
                    <p className="text-sm text-muted-foreground">Automatically restart on errors</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Take Profit</Label>
                    <p className="text-sm text-muted-foreground">Auto-sell at profit targets</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Stop Loss</Label>
                    <p className="text-sm text-muted-foreground">Auto-sell to limit losses</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get trade alerts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Trades
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>Latest trading activity from your bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrades.map(trade => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={trade.type === 'buy' ? 'default' : 'secondary'}
                        className={
                          trade.type === 'buy'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }
                      >
                        {trade.type.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{trade.pair}</p>
                        <p className="text-sm text-muted-foreground">
                          {trade.amount} @ ${trade.price}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-500">+${trade.profit}</p>
                      <p className="text-sm text-muted-foreground">{trade.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total ROI</span>
                    <span className="font-bold text-green-500">+14.56%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Profit</span>
                    <span className="font-bold">$427.83</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Trade Duration</span>
                    <span className="font-bold">2.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Trade</span>
                    <span className="font-bold text-green-500">+$45.67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Worst Trade</span>
                    <span className="font-bold text-red-500">-$8.23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Bot performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>API Connection</span>
                    </div>
                    <Badge variant="default" className="bg-green-500/10 text-green-500">
                      Healthy
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Market Data</span>
                    </div>
                    <Badge variant="default" className="bg-green-500/10 text-green-500">
                      Live
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-blue-500" />
                      <span>Last Update</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{stats.lastUpdate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Response Time</span>
                    </div>
                    <span className="text-sm font-medium">23ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
