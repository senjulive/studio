'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star,
  BarChart3,
  DollarSign,
  Activity,
  Globe,
  Filter,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';

interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  sparkline: number[];
  isFavorite: boolean;
}

interface MarketProps {
  className?: string;
}

export function ComprehensiveMarket({ className }: MarketProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [favorites, setFavorites] = React.useState<string[]>(['bitcoin', 'ethereum', 'binancecoin']);

  // Mock cryptocurrency data
  const cryptocurrencies: CryptoCurrency[] = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.67,
      change24h: 2.34,
      volume24h: 28500000000,
      marketCap: 847000000000,
      rank: 1,
      sparkline: [42800, 42900, 43100, 43050, 43200, 43250],
      isFavorite: favorites.includes('bitcoin')
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.89,
      change24h: -1.23,
      volume24h: 15200000000,
      marketCap: 318000000000,
      rank: 2,
      sparkline: [2680, 2670, 2645, 2655, 2648, 2651],
      isFavorite: favorites.includes('ethereum')
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'BNB',
      price: 315.42,
      change24h: 4.56,
      volume24h: 1800000000,
      marketCap: 47000000000,
      rank: 3,
      sparkline: [310, 312, 318, 316, 314, 315],
      isFavorite: favorites.includes('binancecoin')
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: 98.76,
      change24h: 7.89,
      volume24h: 2100000000,
      marketCap: 42000000000,
      rank: 4,
      sparkline: [92, 94, 96, 98, 99, 99],
      isFavorite: favorites.includes('solana')
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.5234,
      change24h: -2.14,
      volume24h: 890000000,
      marketCap: 18500000000,
      rank: 5,
      sparkline: [0.53, 0.525, 0.522, 0.524, 0.523, 0.523],
      isFavorite: favorites.includes('cardano')
    }
  ];

  const marketStats = {
    totalMarketCap: 1650000000000,
    totalVolume24h: 89500000000,
    btcDominance: 51.3,
    activeCoins: 2847,
    markets: 23456,
    fearGreedIndex: 72
  };

  const categories = [
    { id: 'all', name: 'All Coins', count: cryptocurrencies.length },
    { id: 'favorites', name: 'Favorites', count: favorites.length },
    { id: 'top10', name: 'Top 10', count: 10 },
    { id: 'defi', name: 'DeFi', count: 156 },
    { id: 'gaming', name: 'Gaming', count: 89 }
  ];

  const toggleFavorite = (coinId: string) => {
    setFavorites(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  const filteredCoins = cryptocurrencies.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'favorites') {
      return matchesSearch && favorites.includes(coin.id);
    }
    
    return matchesSearch;
  });

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const MiniChart = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="w-16 h-8 flex items-end gap-0.5">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`flex-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'} opacity-70`}
              style={{ height: `${Math.max(height, 2)}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`space-y-6 p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Market Overview</h1>
          <p className="text-muted-foreground">Real-time cryptocurrency market data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Market Cap</p>
              <p className="text-lg font-bold">{formatNumber(marketStats.totalMarketCap)}</p>
              <p className="text-xs text-green-500">+2.4%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">24h Volume</p>
              <p className="text-lg font-bold">{formatNumber(marketStats.totalVolume24h)}</p>
              <p className="text-xs text-red-500">-1.2%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">BTC Dominance</p>
              <p className="text-lg font-bold">{marketStats.btcDominance}%</p>
              <p className="text-xs text-green-500">+0.3%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Active Coins</p>
              <p className="text-lg font-bold">{marketStats.activeCoins.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Markets</p>
              <p className="text-lg font-bold">{marketStats.markets.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Fear & Greed</p>
              <p className="text-lg font-bold text-green-500">{marketStats.fearGreedIndex}</p>
              <p className="text-xs text-muted-foreground">Greed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="spot" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spot">Spot</TabsTrigger>
          <TabsTrigger value="futures">Futures</TabsTrigger>
          <TabsTrigger value="defi">DeFi</TabsTrigger>
          <TabsTrigger value="nft">NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="spot" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search cryptocurrencies..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Cryptocurrency Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Cryptocurrencies</CardTitle>
              <CardDescription>Real-time prices and market data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">24h %</div>
                  <div className="col-span-2">Volume (24h)</div>
                  <div className="col-span-1">Chart</div>
                  <div className="col-span-1">Action</div>
                </div>

                {/* Table Rows */}
                {filteredCoins.map((coin) => (
                  <div key={coin.id} className="grid grid-cols-12 gap-4 py-3 text-sm hover:bg-muted/50 rounded-lg px-2">
                    <div className="col-span-1 flex items-center">
                      <span className="font-medium">{coin.rank}</span>
                    </div>
                    
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{coin.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <span className="font-medium">${coin.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <div className={`flex items-center gap-1 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="font-medium">{Math.abs(coin.change24h).toFixed(2)}%</span>
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex items-center">
                      <span className="text-muted-foreground">{formatNumber(coin.volume24h)}</span>
                    </div>
                    
                    <div className="col-span-1 flex items-center">
                      <MiniChart data={coin.sparkline} isPositive={coin.change24h >= 0} />
                    </div>
                    
                    <div className="col-span-1 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(coin.id)}
                      >
                        <Star className={`w-4 h-4 ${coin.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="futures" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Futures Trading</h3>
              <p className="text-muted-foreground mb-4">
                Access leveraged trading with advanced futures contracts
              </p>
              <Button>Coming Soon</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">DeFi Protocols</h3>
              <p className="text-muted-foreground mb-4">
                Explore decentralized finance opportunities and yield farming
              </p>
              <Button>Coming Soon</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nft" className="space-y-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">NFT Marketplace</h3>
              <p className="text-muted-foreground mb-4">
                Discover, buy, and sell unique digital collectibles
              </p>
              <Button>Coming Soon</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
