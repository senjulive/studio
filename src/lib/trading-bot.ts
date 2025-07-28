'use client';

export interface TradingBot {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  strategy: 'grid' | 'dca' | 'momentum' | 'arbitrage';
  pair: string;
  balance: number;
  profit: number;
  profitPercentage: number;
  trades: Trade[];
  settings: BotSettings;
  stats: BotStats;
  lastUpdate: string;
}

export interface Trade {
  id: string;
  type: 'buy' | 'sell';
  pair: string;
  amount: number;
  price: number;
  profit?: number;
  timestamp: string;
  status: 'pending' | 'filled' | 'cancelled';
}

export interface BotSettings {
  gridLevels: number;
  gridSpacing: number;
  investment: number;
  stopLoss?: number;
  takeProfit?: number;
  maxTrades: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface BotStats {
  totalTrades: number;
  winRate: number;
  avgProfitPerTrade: number;
  maxDrawdown: number;
  sharpeRatio: number;
  uptime: number;
}

export interface MarketData {
  pair: string;
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

class TradingBotSimulator {
  private bots: Map<string, TradingBot> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private subscribers: Set<(bots: TradingBot[]) => void> = new Set();
  private isRunning = false;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMarketData();
    this.createDefaultBots();
    this.startSimulation();
  }

  private initializeMarketData() {
    const pairs = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT'];
    const basePrices = {
      'BTC/USDT': 43500,
      'ETH/USDT': 2650,
      'BNB/USDT': 350,
      'ADA/USDT': 0.52,
      'SOL/USDT': 105
    };

    pairs.forEach(pair => {
      const basePrice = basePrices[pair as keyof typeof basePrices];
      this.marketData.set(pair, {
        pair,
        price: basePrice,
        change24h: (Math.random() - 0.5) * 10, // -5% to +5%
        volume: Math.random() * 1000000000,
        high24h: basePrice * (1 + Math.random() * 0.05),
        low24h: basePrice * (1 - Math.random() * 0.05),
        timestamp: new Date().toISOString()
      });
    });
  }

  private createDefaultBots() {
    const defaultBots: Omit<TradingBot, 'id'>[] = [
      {
        name: 'Grid Master Pro',
        status: 'running',
        strategy: 'grid',
        pair: 'BTC/USDT',
        balance: 1000,
        profit: 127.50,
        profitPercentage: 12.75,
        trades: [],
        settings: {
          gridLevels: 10,
          gridSpacing: 0.5,
          investment: 1000,
          stopLoss: 5,
          takeProfit: 15,
          maxTrades: 20,
          riskLevel: 'medium'
        },
        stats: {
          totalTrades: 156,
          winRate: 78.5,
          avgProfitPerTrade: 0.82,
          maxDrawdown: 3.2,
          sharpeRatio: 2.1,
          uptime: 98.7
        },
        lastUpdate: new Date().toISOString()
      },
      {
        name: 'DCA Accumulator',
        status: 'running',
        strategy: 'dca',
        pair: 'ETH/USDT',
        balance: 500,
        profit: 45.25,
        profitPercentage: 9.05,
        trades: [],
        settings: {
          gridLevels: 5,
          gridSpacing: 1.0,
          investment: 500,
          stopLoss: 10,
          takeProfit: 20,
          maxTrades: 10,
          riskLevel: 'low'
        },
        stats: {
          totalTrades: 89,
          winRate: 82.0,
          avgProfitPerTrade: 0.51,
          maxDrawdown: 2.1,
          sharpeRatio: 1.8,
          uptime: 99.2
        },
        lastUpdate: new Date().toISOString()
      },
      {
        name: 'Momentum Surfer',
        status: 'paused',
        strategy: 'momentum',
        pair: 'SOL/USDT',
        balance: 750,
        profit: -12.80,
        profitPercentage: -1.71,
        trades: [],
        settings: {
          gridLevels: 15,
          gridSpacing: 0.3,
          investment: 750,
          stopLoss: 3,
          takeProfit: 10,
          maxTrades: 30,
          riskLevel: 'high'
        },
        stats: {
          totalTrades: 203,
          winRate: 65.5,
          avgProfitPerTrade: -0.06,
          maxDrawdown: 5.8,
          sharpeRatio: 0.9,
          uptime: 95.3
        },
        lastUpdate: new Date().toISOString()
      }
    ];

    defaultBots.forEach(bot => {
      const id = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.bots.set(id, { ...bot, id });
    });
  }

  private updateMarketData() {
    this.marketData.forEach((data, pair) => {
      // Simulate price movement with some volatility
      const volatility = 0.002; // 0.2% volatility
      const change = (Math.random() - 0.5) * volatility * 2;
      const newPrice = data.price * (1 + change);
      
      // Update 24h stats
      const change24h = ((newPrice - data.price) / data.price) * 100;
      
      this.marketData.set(pair, {
        ...data,
        price: newPrice,
        change24h: data.change24h + change24h * 0.1, // Smooth the change
        volume: data.volume + Math.random() * 10000,
        high24h: Math.max(data.high24h, newPrice),
        low24h: Math.min(data.low24h, newPrice),
        timestamp: new Date().toISOString()
      });
    });
  }

  private updateBots() {
    this.bots.forEach((bot, id) => {
      if (bot.status !== 'running') return;

      const marketData = this.marketData.get(bot.pair);
      if (!marketData) return;

      // Simulate trading activity
      if (Math.random() < 0.3) { // 30% chance of trade per update
        const trade = this.generateTrade(bot, marketData);
        bot.trades.unshift(trade);
        
        // Keep only last 10 trades
        if (bot.trades.length > 10) {
          bot.trades = bot.trades.slice(0, 10);
        }

        // Update profit
        if (trade.profit) {
          bot.profit += trade.profit;
          bot.profitPercentage = (bot.profit / bot.balance) * 100;
        }

        // Update stats
        bot.stats.totalTrades++;
        if (trade.profit && trade.profit > 0) {
          bot.stats.winRate = ((bot.stats.winRate * (bot.stats.totalTrades - 1)) + 100) / bot.stats.totalTrades;
        } else {
          bot.stats.winRate = (bot.stats.winRate * (bot.stats.totalTrades - 1)) / bot.stats.totalTrades;
        }
      }

      bot.lastUpdate = new Date().toISOString();
      this.bots.set(id, bot);
    });
  }

  private generateTrade(bot: TradingBot, marketData: MarketData): Trade {
    const isBuy = Math.random() < 0.5;
    const amount = (Math.random() * 0.1 + 0.05) * bot.balance; // 5-15% of balance
    const priceVariation = (Math.random() - 0.5) * 0.01; // ±0.5% price variation
    const price = marketData.price * (1 + priceVariation);
    
    // Calculate profit for simulation
    let profit = 0;
    if (bot.strategy === 'grid') {
      profit = amount * (Math.random() * 0.02 - 0.005); // -0.5% to +1.5%
    } else if (bot.strategy === 'dca') {
      profit = amount * (Math.random() * 0.015); // 0% to +1.5%
    } else {
      profit = amount * (Math.random() * 0.04 - 0.01); // -1% to +3%
    }

    return {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: isBuy ? 'buy' : 'sell',
      pair: bot.pair,
      amount,
      price,
      profit,
      timestamp: new Date().toISOString(),
      status: 'filled'
    };
  }

  public startSimulation() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateInterval = setInterval(() => {
      this.updateMarketData();
      this.updateBots();
      this.notifySubscribers();
    }, 2000); // Update every 2 seconds
  }

  public stopSimulation() {
    this.isRunning = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  public subscribe(callback: (bots: TradingBot[]) => void) {
    this.subscribers.add(callback);
    callback(Array.from(this.bots.values()));
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    const bots = Array.from(this.bots.values());
    this.subscribers.forEach(callback => callback(bots));
  }

  public getBots(): TradingBot[] {
    return Array.from(this.bots.values());
  }

  public getBot(id: string): TradingBot | undefined {
    return this.bots.get(id);
  }

  public getMarketData(pair?: string): MarketData[] {
    if (pair) {
      const data = this.marketData.get(pair);
      return data ? [data] : [];
    }
    return Array.from(this.marketData.values());
  }

  public startBot(id: string): boolean {
    const bot = this.bots.get(id);
    if (bot && bot.status !== 'running') {
      bot.status = 'running';
      bot.lastUpdate = new Date().toISOString();
      this.bots.set(id, bot);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  public pauseBot(id: string): boolean {
    const bot = this.bots.get(id);
    if (bot && bot.status === 'running') {
      bot.status = 'paused';
      bot.lastUpdate = new Date().toISOString();
      this.bots.set(id, bot);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  public updateBotSettings(id: string, settings: Partial<BotSettings>): boolean {
    const bot = this.bots.get(id);
    if (bot) {
      bot.settings = { ...bot.settings, ...settings };
      bot.lastUpdate = new Date().toISOString();
      this.bots.set(id, bot);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  public createBot(config: Omit<TradingBot, 'id' | 'trades' | 'lastUpdate' | 'profit' | 'profitPercentage' | 'stats'>): string {
    const id = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bot: TradingBot = {
      ...config,
      id,
      profit: 0,
      profitPercentage: 0,
      trades: [],
      stats: {
        totalTrades: 0,
        winRate: 0,
        avgProfitPerTrade: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        uptime: 100
      },
      lastUpdate: new Date().toISOString()
    };
    
    this.bots.set(id, bot);
    this.notifySubscribers();
    return id;
  }

  public deleteBot(id: string): boolean {
    if (this.bots.delete(id)) {
      this.notifySubscribers();
      return true;
    }
    return false;
  }
}

// Global singleton instance
export const tradingBotSimulator = new TradingBotSimulator();

// React hook for using the trading bot simulator
export function useTradingBots() {
  const [bots, setBots] = React.useState<TradingBot[]>([]);
  
  React.useEffect(() => {
    const unsubscribe = tradingBotSimulator.subscribe(setBots);
    return unsubscribe;
  }, []);

  return {
    bots,
    startBot: tradingBotSimulator.startBot.bind(tradingBotSimulator),
    pauseBot: tradingBotSimulator.pauseBot.bind(tradingBotSimulator),
    updateBotSettings: tradingBotSimulator.updateBotSettings.bind(tradingBotSimulator),
    createBot: tradingBotSimulator.createBot.bind(tradingBotSimulator),
    deleteBot: tradingBotSimulator.deleteBot.bind(tradingBotSimulator),
    getMarketData: tradingBotSimulator.getMarketData.bind(tradingBotSimulator),
  };
}

// For React import
import * as React from 'react';
