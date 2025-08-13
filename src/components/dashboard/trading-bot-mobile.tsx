'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@/contexts/UserContext';
import { useTradingBot } from '@/hooks/use-trading-bot';
import { useTradingBotEnhanced } from '@/hooks/use-trading-bot-enhanced';
import { AnimatedTradingBot, GridTradingAnimation } from './trading-bot-animations';
import { cn } from '@/lib/utils';
import {
  Bot,
  Play,
  Pause,
  Settings,
  TrendingUp,
  DollarSign,
  Activity,
  Zap,
  Target,
  BarChart3,
  Timer,
  Coins,
  Eye,
  BarChart,
  TrendingDown
} from 'lucide-react';

export function TradingBotMobile() {
  const { wallet, tier } = useUser();
  const {
    isRunning,
    profit,
    trades,
    toggleBot,
    settings
  } = useTradingBot();

  // Use enhanced trading bot for animations
  const {
    bot: enhancedBot,
    logs,
    isLoading,
    updateSettings,
    getPerformanceMetrics
  } = useTradingBotEnhanced();

  const [riskLevel, setRiskLevel] = React.useState([3]);
  const [autoReinvest, setAutoReinvest] = React.useState(true);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [showLogs, setShowLogs] = React.useState(false);

  const dailyProfit = profit || 0;
  const totalTrades = trades || 0;
  const successRate = 92.3; // Mock data

  const performanceMetrics = getPerformanceMetrics();

  return (
    <div className="space-y-4">
      {/* Animated Trading Visualization */}
      <div className="mobile-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Live Trading Visualization</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs"
              >
                <BarChart className="w-4 h-4 mr-1" />
                {showAdvanced ? 'Simple' : 'Advanced'}
              </Button>
            </div>
          </div>

          {showAdvanced ? (
            <GridTradingAnimation />
          ) : (
            <AnimatedTradingBot
              isRunning={isRunning}
              profit={profit}
              trades={trades}
              className="mb-4"
            />
          )}
        </div>
      </div>

      {/* Bot Status Card */}
      <div className="mobile-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                isRunning ? "bg-green-500/20 electric-glow" : "bg-muted/50"
              )}>
                <Bot className={cn(
                  "w-6 h-6 transition-colors",
                  isRunning ? "text-green-400" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <h2 className="font-bold text-lg">AstralCore Bot</h2>
                <p className="text-sm text-muted-foreground">AI Trading Assistant</p>
              </div>
            </div>
            <Badge variant={isRunning ? "default" : "secondary"} className={cn(
              "px-3 py-1",
              isRunning && "bg-green-500/20 text-green-400 border-green-500/30"
            )}>
              {isRunning ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-background/50 border border-primary/10">
              <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Today's Profit</p>
              <p className="font-bold text-green-400">+${dailyProfit.toFixed(2)}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-background/50 border border-primary/10">
              <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Total Trades</p>
              <p className="font-bold">{totalTrades}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-background/50 border border-primary/10">
              <Target className="w-5 h-5 text-secondary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="font-bold text-secondary">{successRate}%</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-background/50 border border-primary/10">
              <Timer className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="font-bold text-accent">24h</p>
            </div>
          </div>

          {/* Control Button */}
          <Button
            onClick={toggleBot}
            className={cn(
              "w-full h-14 text-lg font-bold transition-all duration-300",
              isRunning 
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30" 
                : "bg-gradient-to-r from-primary to-secondary electric-glow hover:scale-105"
            )}
            variant={isRunning ? "outline" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Stop Trading
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start Trading
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Card */}
      <div className="mobile-card">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Trading Settings</h3>
          </div>

          {/* Risk Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Risk Level</label>
              <Badge variant="outline" className="text-xs">
                Level {riskLevel[0]}
              </Badge>
            </div>
            <Slider
              value={riskLevel}
              onValueChange={setRiskLevel}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Conservative</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Auto Reinvest */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-primary/10">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Auto Reinvest</p>
                <p className="text-sm text-muted-foreground">Compound profits automatically</p>
              </div>
            </div>
            <Switch
              checked={autoReinvest}
              onCheckedChange={setAutoReinvest}
            />
          </div>

          {/* Trading Pairs */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Active Trading Pairs</label>
            <div className="grid grid-cols-2 gap-2">
              {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT'].map((pair) => (
                <div key={pair} className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <span className="text-sm font-medium">{pair}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Card */}
      <div className="mobile-card">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-lg">Performance</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
              <div>
                <p className="text-sm text-muted-foreground">Last 24h Profit</p>
                <p className="font-bold text-green-400">+$247.83</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="font-bold text-green-400">+12.3%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
              <div>
                <p className="text-sm text-muted-foreground">Best Trade</p>
                <p className="font-bold text-green-400">+$45.67</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Avg. Trade</p>
                <p className="font-bold">$8.32</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Performance Analytics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-background/50 rounded-xl text-center">
              <div className={cn(
                "text-lg font-bold",
                performanceMetrics.profitability === 'profitable' ? "text-green-400" : "text-red-400"
              )}>
                {enhancedBot.stats.successRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Win Rate</div>
            </div>
            <div className="p-3 bg-background/50 rounded-xl text-center">
              <div className="text-lg font-bold text-blue-400">
                {enhancedBot.stats.averageTradeTime}m
              </div>
              <div className="text-xs text-muted-foreground">Avg Trade Time</div>
            </div>
            <div className="p-3 bg-background/50 rounded-xl text-center">
              <div className="text-lg font-bold text-green-400">
                +${enhancedBot.stats.bestTrade.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Best Trade</div>
            </div>
            <div className="p-3 bg-background/50 rounded-xl text-center">
              <div className="text-lg font-bold text-purple-400">
                ${enhancedBot.stats.monthlyProfit.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Monthly P&L</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Efficiency</span>
              <span className={cn(
                "font-medium capitalize",
                performanceMetrics.efficiency === 'excellent' ? "text-green-400" :
                performanceMetrics.efficiency === 'good' ? "text-blue-400" : "text-orange-400"
              )}>
                {performanceMetrics.efficiency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk Level</span>
              <span className={cn(
                "font-medium capitalize",
                performanceMetrics.riskLevel === 'low' ? "text-green-400" :
                performanceMetrics.riskLevel === 'medium' ? "text-orange-400" : "text-red-400"
              )}>
                {performanceMetrics.riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Logs */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-lg">Trading Activity</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogs(!showLogs)}
              className="text-xs"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showLogs ? 'Hide' : 'Show'} Logs
            </Button>
          </div>

          {showLogs && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-start gap-2 p-2 bg-background/50 rounded-lg">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                    log.type === 'success' ? "bg-green-400" :
                    log.type === 'warning' ? "bg-orange-400" :
                    log.type === 'error' ? "bg-red-400" : "bg-blue-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity logs yet</p>
                  <p className="text-xs">Start the bot to see trading activity</p>
                </div>
              )}
            </div>
          )}

          {!showLogs && (
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>{logs.filter(l => l.type === 'success').length} Successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>{logs.filter(l => l.type === 'info').length} Info</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tier Info */}
      {tier && (
        <div className="mobile-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-lg">Your Tier: {tier.name}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Daily Profit Limit</span>
                <span className="font-medium">${tier.dailyProfitLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Max Concurrent Trades</span>
                <span className="font-medium">{tier.maxConcurrentTrades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Advanced Features</span>
                <span className="font-medium">{tier.advancedFeatures ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
