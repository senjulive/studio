'use client';

import * as React from 'react';
import { useToast } from './use-toast';

interface TradingBotSettings {
  riskLevel: number;
  autoReinvest: boolean;
  stopLoss: number;
  takeProfit: number;
  maxConcurrentTrades: number;
  tradingPairs: string[];
  minTradeAmount: number;
  maxTradeAmount: number;
}

interface TradingStats {
  totalTrades: number;
  successfulTrades: number;
  totalProfit: number;
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  successRate: number;
  averageTradeTime: number;
  bestTrade: number;
  worstTrade: number;
}

interface TradingBot {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  isRunning: boolean;
  settings: TradingBotSettings;
  stats: TradingStats;
  lastActivity: string;
  uptime: number;
  errorMessage?: string;
}

const defaultSettings: TradingBotSettings = {
  riskLevel: 3,
  autoReinvest: true,
  stopLoss: 5,
  takeProfit: 10,
  maxConcurrentTrades: 5,
  tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
  minTradeAmount: 10,
  maxTradeAmount: 1000
};

const defaultStats: TradingStats = {
  totalTrades: 247,
  successfulTrades: 228,
  totalProfit: 1247.83,
  dailyProfit: 47.25,
  weeklyProfit: 312.58,
  monthlyProfit: 1247.83,
  successRate: 92.3,
  averageTradeTime: 45,
  bestTrade: 156.78,
  worstTrade: -23.45
};

export function useTradingBotEnhanced() {
  const { toast } = useToast();
  const [bot, setBot] = React.useState<TradingBot>({
    id: 'astral-core-bot',
    name: 'AstralCore AI Bot',
    status: 'stopped',
    isRunning: false,
    settings: defaultSettings,
    stats: defaultStats,
    lastActivity: new Date().toISOString(),
    uptime: 0
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [logs, setLogs] = React.useState<Array<{
    id: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
  }>>([]);

  // Simulate real-time updates
  React.useEffect(() => {
    if (!bot.isRunning) return;

    const interval = setInterval(() => {
      // Update profits randomly
      setBot(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          dailyProfit: prev.stats.dailyProfit + (Math.random() - 0.4) * 2,
          totalProfit: prev.stats.totalProfit + (Math.random() - 0.4) * 2
        },
        uptime: prev.uptime + 1,
        lastActivity: new Date().toISOString()
      }));

      // Add random trading logs
      if (Math.random() > 0.7) {
        const actions = [
          'Opened BTC/USDT position at $67,850',
          'Closed ETH/USDT trade with +$23.45 profit',
          'Market analysis: Bullish trend detected',
          'Risk management: Reducing position size',
          'Grid level triggered: Buying opportunity'
        ];
        
        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.8 ? 'success' : 'info' as const,
          message: actions[Math.floor(Math.random() * actions.length)]
        };

        setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [bot.isRunning]);

  const startBot = React.useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBot(prev => ({
      ...prev,
      status: 'running',
      isRunning: true,
      uptime: 0
    }));

    const startLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'success' as const,
      message: 'AstralCore AI Bot started successfully'
    };
    
    setLogs(prev => [startLog, ...prev]);
    
    toast({
      title: "Bot Started",
      description: "AstralCore AI Bot is now running.",
    });
    
    setIsLoading(false);
  }, [toast]);

  const stopBot = React.useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBot(prev => ({
      ...prev,
      status: 'stopped',
      isRunning: false
    }));

    const stopLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'info' as const,
      message: 'AstralCore AI Bot stopped by user'
    };
    
    setLogs(prev => [stopLog, ...prev]);
    
    toast({
      title: "Bot Stopped",
      description: "AstralCore AI Bot has been stopped.",
    });
    
    setIsLoading(false);
  }, [toast]);

  const pauseBot = React.useCallback(async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBot(prev => ({
      ...prev,
      status: 'paused',
      isRunning: false
    }));

    toast({
      title: "Bot Paused",
      description: "AstralCore AI Bot has been paused.",
    });
    
    setIsLoading(false);
  }, [toast]);

  const updateSettings = React.useCallback((newSettings: Partial<TradingBotSettings>) => {
    setBot(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));

    const settingsLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'info' as const,
      message: 'Bot settings updated'
    };
    
    setLogs(prev => [settingsLog, ...prev]);

    toast({
      title: "Settings Updated",
      description: "Bot settings have been saved.",
    });
  }, [toast]);

  const resetStats = React.useCallback(() => {
    setBot(prev => ({
      ...prev,
      stats: {
        ...defaultStats,
        totalTrades: 0,
        successfulTrades: 0,
        totalProfit: 0,
        dailyProfit: 0,
        weeklyProfit: 0,
        monthlyProfit: 0
      }
    }));

    toast({
      title: "Stats Reset",
      description: "Trading statistics have been reset.",
    });
  }, [toast]);

  const toggleBot = React.useCallback(() => {
    if (bot.isRunning) {
      stopBot();
    } else {
      startBot();
    }
  }, [bot.isRunning, startBot, stopBot]);

  const getPerformanceMetrics = React.useCallback(() => {
    const { stats } = bot;
    return {
      profitability: stats.totalProfit > 0 ? 'profitable' : 'loss',
      riskLevel: bot.settings.riskLevel <= 2 ? 'low' : bot.settings.riskLevel <= 3 ? 'medium' : 'high',
      efficiency: stats.successRate > 90 ? 'excellent' : stats.successRate > 80 ? 'good' : 'average',
      activity: bot.isRunning ? 'active' : 'inactive'
    };
  }, [bot]);

  return {
    bot,
    isLoading,
    logs,
    startBot,
    stopBot,
    pauseBot,
    toggleBot,
    updateSettings,
    resetStats,
    getPerformanceMetrics,
    // Derived values for convenience
    isRunning: bot.isRunning,
    status: bot.status,
    settings: bot.settings,
    stats: bot.stats,
    profit: bot.stats.dailyProfit,
    trades: bot.stats.totalTrades,
    successRate: bot.stats.successRate
  };
}
