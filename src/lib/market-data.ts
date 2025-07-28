'use client';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  image: string;
  last_updated: string;
}

export interface FearGreedData {
  value: number;
  classification: string;
  timestamp: string;
  next_update: string;
}

export interface GlobalStats {
  total_market_cap: number;
  total_volume_24h: number;
  bitcoin_dominance: number;
  ethereum_dominance: number;
  market_cap_change_24h: number;
  active_cryptocurrencies: number;
}

class MarketDataService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly API_BASE = 'https://api.coingecko.com/api/v3';

  private async fetchWithCache<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    cacheDuration = this.CACHE_DURATION
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cacheDuration) {
      return cached.data as T;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn(`API error, using cached data for ${key}:`, error);
        return cached.data as T;
      }
      throw error;
    }
  }

  public async getTopCoins(limit = 100): Promise<CoinData[]> {
    return this.fetchWithCache(
      `top-coins-${limit}`,
      async () => {
        const response = await fetch(
          `${this.API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch top coins: ${response.statusText}`);
        }
        
        return await response.json();
      }
    );
  }

  public async getCoinDetails(coinId: string): Promise<any> {
    return this.fetchWithCache(
      `coin-${coinId}`,
      async () => {
        const response = await fetch(
          `${this.API_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch coin details: ${response.statusText}`);
        }
        
        return await response.json();
      }
    );
  }

  public async getTrendingCoins(): Promise<any> {
    return this.fetchWithCache(
      'trending',
      async () => {
        const response = await fetch(`${this.API_BASE}/search/trending`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch trending coins: ${response.statusText}`);
        }
        
        return await response.json();
      }
    );
  }

  public async getGlobalStats(): Promise<GlobalStats> {
    return this.fetchWithCache(
      'global-stats',
      async () => {
        const response = await fetch(`${this.API_BASE}/global`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch global stats: ${response.statusText}`);
        }
        
        const data = await response.json();
        return {
          total_market_cap: data.data.total_market_cap.usd,
          total_volume_24h: data.data.total_volume.usd,
          bitcoin_dominance: data.data.market_cap_percentage.btc,
          ethereum_dominance: data.data.market_cap_percentage.eth,
          market_cap_change_24h: data.data.market_cap_change_percentage_24h_usd,
          active_cryptocurrencies: data.data.active_cryptocurrencies,
        };
      }
    );
  }

  public async getFearGreedIndex(): Promise<FearGreedData> {
    return this.fetchWithCache(
      'fear-greed',
      async () => {
        // Simulate Fear & Greed Index since the API requires subscription
        const value = Math.floor(Math.random() * 100);
        let classification = 'Neutral';
        
        if (value <= 25) classification = 'Extreme Fear';
        else if (value <= 45) classification = 'Fear';
        else if (value <= 55) classification = 'Neutral';
        else if (value <= 75) classification = 'Greed';
        else classification = 'Extreme Greed';

        return {
          value,
          classification,
          timestamp: new Date().toISOString(),
          next_update: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
      },
      60000 // Cache for 1 minute
    );
  }

  public async getCoinPriceHistory(coinId: string, days = 7): Promise<any> {
    return this.fetchWithCache(
      `price-history-${coinId}-${days}`,
      async () => {
        const response = await fetch(
          `${this.API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch price history: ${response.statusText}`);
        }
        
        return await response.json();
      },
      300000 // Cache for 5 minutes
    );
  }

  public subscribe(key: string, callback: (data: any) => void, updateInterval = 30000) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);

    // Start auto-update if not already running
    if (!this.updateIntervals.has(key)) {
      const interval = setInterval(async () => {
        try {
          let data;
          switch (key) {
            case 'top-coins':
              data = await this.getTopCoins(50);
              break;
            case 'trending':
              data = await this.getTrendingCoins();
              break;
            case 'global-stats':
              data = await this.getGlobalStats();
              break;
            case 'fear-greed':
              data = await this.getFearGreedIndex();
              break;
            default:
              return;
          }
          
          this.notifySubscribers(key, data);
        } catch (error) {
          console.error(`Failed to update ${key}:`, error);
        }
      }, updateInterval);
      
      this.updateIntervals.set(key, interval);
    }

    return () => {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
        
        // Stop auto-update if no more subscribers
        if (subscribers.size === 0) {
          const interval = this.updateIntervals.get(key);
          if (interval) {
            clearInterval(interval);
            this.updateIntervals.delete(key);
          }
          this.subscribers.delete(key);
        }
      }
    };
  }

  private notifySubscribers(key: string, data: any) {
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error notifying subscriber for ${key}:`, error);
        }
      });
    }
  }

  public clearCache() {
    this.cache.clear();
  }

  public getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      subscribers: Object.fromEntries(
        Array.from(this.subscribers.entries()).map(([key, set]) => [key, set.size])
      ),
    };
  }

  // Simulate real-time price updates for demo
  public simulateRealTimeUpdates(coins: string[]) {
    return setInterval(() => {
      coins.forEach(coinId => {
        const cached = this.cache.get(`coin-${coinId}`);
        if (cached && cached.data) {
          // Simulate small price changes
          const change = (Math.random() - 0.5) * 0.02; // ±1% change
          cached.data.market_data.current_price.usd *= (1 + change);
          cached.data.market_data.price_change_percentage_24h += change * 100;
          
          this.notifySubscribers(`coin-${coinId}`, cached.data);
        }
      });
    }, 5000); // Update every 5 seconds
  }
}

// Global singleton instance
export const marketDataService = new MarketDataService();

// React hooks for easy use in components
import * as React from 'react';

export function useMarketData(type: 'top-coins' | 'trending' | 'global-stats' | 'fear-greed') {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        let result;
        
        switch (type) {
          case 'top-coins':
            result = await marketDataService.getTopCoins(50);
            break;
          case 'trending':
            result = await marketDataService.getTrendingCoins();
            break;
          case 'global-stats':
            result = await marketDataService.getGlobalStats();
            break;
          case 'fear-greed':
            result = await marketDataService.getFearGreedIndex();
            break;
        }
        
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const unsubscribe = marketDataService.subscribe(type, (newData) => {
      if (mounted) {
        setData(newData);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [type]);

  return { data, loading, error };
}

export function useCoinDetails(coinId: string | null) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!coinId) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await marketDataService.getCoinDetails(coinId);
        
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch coin details');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [coinId]);

  return { data, loading, error };
}
