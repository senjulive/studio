'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useTradingBots } from '@/lib/trading-bot';
import { useMarketData } from '@/lib/market-data';
import { Play, Pause, Settings, TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

function TradingBotCard({ bot, onStart, onPause }: any) {
  const isRunning = bot.status === 'running';
  const isProfitable = bot.profit > 0;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{bot.name}</CardTitle>
            <CardDescription className="text-sm">
              {bot.strategy.toUpperCase()} • {bot.pair}
            </CardDescription>
          </div>
          <Badge 
            variant={isRunning ? "default" : "secondary"}
            className={cn(
              "animate-pulse",
              isRunning && "bg-green-500 hover:bg-green-600"
            )}
          >
            {bot.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-lg font-semibold">${bot.balance.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Profit</p>
            <p className={cn(
              "text-lg font-semibold flex items-center gap-1",
              isProfitable ? "text-green-500" : "text-red-500"
            )}>
              {isProfitable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              ${Math.abs(bot.profit).toFixed(2)} ({bot.profitPercentage.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Win Rate</span>
            <span>{bot.stats.winRate.toFixed(1)}%</span>
          </div>
          <Progress value={bot.stats.winRate} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="font-semibold">{bot.stats.totalTrades}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Profit</p>
            <p className="font-semibold">${bot.stats.avgProfitPerTrade.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Uptime</p>
            <p className="font-semibold">{bot.stats.uptime.toFixed(1)}%</p>
          </div>
        </div>

        <Separator />

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
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {bot.trades.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Trades</p>
            <div className="space-y-1">
              {bot.trades.slice(0, 3).map((trade: any) => (
                <div key={trade.id} className="flex justify-between items-center text-xs">
                  <span className={cn(
                    "capitalize",
                    trade.type === 'buy' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {trade.type} ${trade.amount.toFixed(2)}
                  </span>
                  <span className={cn(
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

function MarketOverview() {
  const { data: marketData, loading } = useMarketData('top-coins');
  const { data: globalStats } = useMarketData('global-stats');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
                <div className="h-4 bg-muted rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
        {globalStats && (
          <CardDescription>
            Market Cap: ${(globalStats.total_market_cap / 1e12).toFixed(2)}T • 
            24h Vol: ${(globalStats.total_volume_24h / 1e9).toFixed(2)}B
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketData?.slice(0, 5).map((coin: any) => (
            <div key={coin.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-medium">{coin.name}</p>
                  <p className="text-sm text-muted-foreground">{coin.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${coin.current_price.toLocaleString()}</p>
                <p className={cn(
                  "text-sm",
                  coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function WalletSummary() {
  // Mock wallet data - in real app this would come from API
  const walletData = {
    totalBalance: 2847.50,
    change24h: 127.85,
    changePercent: 4.7,
    assets: [
      { symbol: 'USDT', amount: 1000, value: 1000, change: 0 },
      { symbol: 'BTC', amount: 0.042, value: 1827.50, change: 5.2 },
      { symbol: 'ETH', amount: 0.12, value: 20, change: -2.1 },
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Wallet Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold">${walletData.totalBalance.toLocaleString()}</p>
          <p className={cn(
            "text-sm flex items-center justify-center gap-1",
            walletData.change24h >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {walletData.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {walletData.change24h >= 0 ? '+' : ''}${walletData.change24h.toFixed(2)} ({walletData.changePercent.toFixed(1)}%)
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          {walletData.assets.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{asset.symbol}</p>
                <p className="text-sm text-muted-foreground">{asset.amount} {asset.symbol}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${asset.value.toLocaleString()}</p>
                <p className={cn(
                  "text-sm",
                  asset.change >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { bots, startBot, pauseBot } = useTradingBots();

  const handleStartBot = (botId: string) => {
    startBot(botId);
  };

  const handlePauseBot = (botId: string) => {
    pauseBot(botId);
  };

  const runningBots = bots.filter(bot => bot.status === 'running').length;
  const totalProfit = bots.reduce((sum, bot) => sum + bot.profit, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{runningBots}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit</p>
                <p className={cn(
                  "text-2xl font-bold",
                  totalProfit >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">
                  {bots.reduce((sum, bot) => sum + bot.stats.totalTrades, 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bots" className="space-y-6">
        <TabsList>
          <TabsTrigger value="bots">Trading Bots</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="bots" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Trading Bots</h2>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Create Bot
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <TradingBotCard
                key={bot.id}
                bot={bot}
                onStart={handleStartBot}
                onPause={handlePauseBot}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <WalletSummary />
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <MarketOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
