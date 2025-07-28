'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useTradingBots, type TradingBot, type BotSettings } from '@/lib/trading-bot';
import { useMarketData } from '@/lib/market-data';
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  BarChart3,
  Activity,
  Zap,
  Target,
  Shield,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

function TradingChart({ pair }: { pair: string }) {
  // Mock chart data - in real app this would be real chart component
  const [data, setData] = React.useState<number[]>([]);

  React.useEffect(() => {
    // Generate mock price data
    const generateData = () => {
      const basePrice = 43500; // Mock BTC price
      const points = 50;
      const newData = [];
      
      for (let i = 0; i < points; i++) {
        const volatility = 0.02;
        const change = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + change * i / points);
        newData.push(price);
      }
      
      setData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 5000);
    
    return () => clearInterval(interval);
  }, [pair]);

  const currentPrice = data[data.length - 1] || 43500;
  const priceChange = data.length > 1 ? ((currentPrice - data[data.length - 2]) / data[data.length - 2]) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{pair}</CardTitle>
            <CardDescription>Real-time price chart</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
            <p className={cn(
              "text-sm flex items-center gap-1",
              priceChange >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Mock candlestick chart visualization */}
          <div className="absolute inset-0 flex items-end justify-around p-4">
            {data.slice(-20).map((price, i) => {
              const height = ((price - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 100;
              const isUp = i === 0 || price >= data[data.length - 20 + i - 1];
              
              return (
                <div
                  key={i}
                  className={cn(
                    "w-2 rounded-sm",
                    isUp ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              );
            })}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Live Chart</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BotCreationForm({ onCreateBot }: { onCreateBot: (config: any) => void }) {
  const [formData, setFormData] = React.useState({
    name: '',
    strategy: 'grid',
    pair: 'BTC/USDT',
    investment: 1000,
    gridLevels: 10,
    gridSpacing: 0.5,
    stopLoss: 5,
    takeProfit: 15,
    maxTrades: 20,
    riskLevel: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const config = {
      name: formData.name || `${formData.strategy.toUpperCase()} Bot`,
      status: 'idle' as const,
      strategy: formData.strategy as 'grid' | 'dca' | 'momentum' | 'arbitrage',
      pair: formData.pair,
      balance: formData.investment,
      settings: {
        gridLevels: formData.gridLevels,
        gridSpacing: formData.gridSpacing / 100, // Convert to decimal
        investment: formData.investment,
        stopLoss: formData.stopLoss,
        takeProfit: formData.takeProfit,
        maxTrades: formData.maxTrades,
        riskLevel: formData.riskLevel as 'low' | 'medium' | 'high'
      }
    };

    onCreateBot(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Trading Bot
        </CardTitle>
        <CardDescription>
          Configure and deploy a new automated trading bot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                placeholder="My Trading Bot"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={formData.strategy} onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid Trading</SelectItem>
                  <SelectItem value="dca">DCA (Dollar Cost Average)</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="arbitrage">Arbitrage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pair">Trading Pair</Label>
              <Select value={formData.pair} onValueChange={(value) => setFormData(prev => ({ ...prev, pair: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                  <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                  <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                type="number"
                min="100"
                max="10000"
                step="100"
                value={formData.investment}
                onChange={(e) => setFormData(prev => ({ ...prev, investment: parseInt(e.target.value) || 1000 }))}
              />
            </div>
          </div>

          {formData.strategy === 'grid' && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">Grid Strategy Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grid Levels: {formData.gridLevels}</Label>
                  <Slider
                    value={[formData.gridLevels]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, gridLevels: value }))}
                    min={5}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grid Spacing: {formData.gridSpacing}%</Label>
                  <Slider
                    value={[formData.gridSpacing]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, gridSpacing: value }))}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium">Risk Management</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stop Loss (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  step="0.5"
                  value={formData.stopLoss}
                  onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 5 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Take Profit (%)</Label>
                <Input
                  type="number"
                  min="5"
                  max="50"
                  step="1"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) || 15 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Trades</Label>
                <Input
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={formData.maxTrades}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTrades: parseInt(e.target.value) || 20 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select value={formData.riskLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ActiveBotCard({ bot, onStart, onPause, onConfigure }: any) {
  const isRunning = bot.status === 'running';
  const isProfitable = bot.profit > 0;

  return (
    <Card className="relative overflow-hidden">
      {isRunning && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 animate-pulse" />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {bot.name}
            </CardTitle>
            <CardDescription>
              {bot.strategy.toUpperCase()} • {bot.pair} • Balance: ${bot.balance.toLocaleString()}
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge 
              variant={isRunning ? "default" : "secondary"}
              className={cn(
                isRunning && "bg-green-500 hover:bg-green-600 animate-pulse"
              )}
            >
              {bot.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Profit</p>
            <p className={cn(
              "text-lg font-bold",
              isProfitable ? "text-green-500" : "text-red-500"
            )}>
              ${Math.abs(bot.profit).toFixed(2)}
            </p>
            <p className={cn(
              "text-xs",
              isProfitable ? "text-green-500" : "text-red-500"
            )}>
              {bot.profitPercentage >= 0 ? '+' : ''}{bot.profitPercentage.toFixed(2)}%
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-lg font-bold">{bot.stats.winRate.toFixed(1)}%</p>
            <Progress value={bot.stats.winRate} className="h-1 mt-1" />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Trades</p>
            <p className="text-lg font-bold">{bot.stats.totalTrades}</p>
            <p className="text-xs text-muted-foreground">
              Avg: ${bot.stats.avgProfitPerTrade.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isRunning ? "secondary" : "default"}
            onClick={() => isRunning ? onPause(bot.id) : onStart(bot.id)}
            className="flex-1"
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => onConfigure(bot.id)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {bot.trades.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Latest Trades</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {bot.trades.slice(0, 3).map((trade: any) => (
                <div key={trade.id} className="flex justify-between items-center text-xs p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "px-1 py-0 text-xs",
                        trade.type === 'buy' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                      )}
                    >
                      {trade.type.toUpperCase()}
                    </Badge>
                    <span>${trade.amount.toFixed(2)}</span>
                  </div>
                  <span className={cn(
                    "font-mono",
                    trade.profit && trade.profit > 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {trade.profit ? `${trade.profit > 0 ? '+' : ''}$${trade.profit.toFixed(2)}` : '--'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TradingPage() {
  const { bots, startBot, pauseBot, createBot } = useTradingBots();
  const [selectedPair, setSelectedPair] = React.useState('BTC/USDT');
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const handleCreateBot = (config: any) => {
    createBot(config);
    setShowCreateForm(false);
  };

  const handleStartBot = (botId: string) => {
    startBot(botId);
  };

  const handlePauseBot = (botId: string) => {
    pauseBot(botId);
  };

  const handleConfigureBot = (botId: string) => {
    // In a real app, this would open a configuration modal
    console.log('Configure bot:', botId);
  };

  const activeBots = bots.filter(bot => bot.status !== 'idle');
  const runningBots = bots.filter(bot => bot.status === 'running');
  const totalProfit = bots.reduce((sum, bot) => sum + bot.profit, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-xl font-bold">{activeBots.length}</p>
              </div>
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-xl font-bold text-green-500">{runningBots.length}</p>
              </div>
              <Zap className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className={cn(
                  "text-xl font-bold",
                  totalProfit >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
              <Target className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Return</p>
                <p className="text-xl font-bold text-primary">
                  {bots.length > 0 ? (totalProfit / bots.length * 100 / 1000).toFixed(2) : '0.00'}%
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Bots ({activeBots.length})</TabsTrigger>
            <TabsTrigger value="create">Create Bot</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="md:hidden"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Bot
          </Button>
        </div>

        <TabsContent value="active" className="space-y-6">
          {activeBots.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Bots</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first trading bot to start automated trading
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Bot
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeBots.map((bot) => (
                <ActiveBotCard
                  key={bot.id}
                  bot={bot}
                  onStart={handleStartBot}
                  onPause={handlePauseBot}
                  onConfigure={handleConfigureBot}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <BotCreationForm onCreateBot={handleCreateBot} />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Label>Trading Pair:</Label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <TradingChart pair={selectedPair} />
        </TabsContent>
      </Tabs>

      {/* Create Bot Modal/Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create New Trading Bot</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <BotCreationForm onCreateBot={handleCreateBot} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
