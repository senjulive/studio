
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { LiveTradingChart } from "./live-trading-chart";
import { Button } from "../ui/button";
import { BrainCircuit, Loader2, Newspaper } from "lucide-react";
import type { MarketSummaryOutput } from "@/ai/flows/market-summary-flow";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type CryptoData = {
  id: string;
  name: string;
  ticker: string;
  iconUrl: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  priceHistory: { value: number }[];
};

type NewsItem = {
    id: string;
    source: string;
    title: string;
    timeAgo: string;
    url: string;
};

const mockNews: NewsItem[] = [
    { id: 'n1', source: 'CryptoNews', title: 'Bitcoin Surges Past $70,000 as Institutional Interest Grows', timeAgo: '2h ago', url: '#' },
    { id: 'n2', source: 'CoinDesk', title: 'Ethereum\'s Next Upgrade "Pectra" Details Revealed', timeAgo: '4h ago', url: '#' },
    { id: 'n3', source: 'The Block', title: 'Solana DeFi Protocol Announces Major Airdrop', timeAgo: '5h ago', url: '#' },
    { id: 'n4', source: 'Decrypt', title: 'Regulatory Update: US Senator Proposes New Crypto Framework', timeAgo: '8h ago', url: '#' },
    { id: 'n5', source: 'Cointelegraph', title: 'NFT Market Shows Signs of Recovery with New Blue-Chip Collection', timeAgo: '1d ago', url: '#' },
];


const initialCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    price: 68000.0,
    change24h: 2.5,
    volume24h: 45000000000,
    marketCap: 1300000000000,
    priceHistory: Array.from({ length: 20 }, () => ({ value: 68000 + (Math.random() - 0.5) * 2000 })),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    price: 3500.0,
    change24h: -1.2,
    volume24h: 25000000000,
    marketCap: 420000000000,
    priceHistory: Array.from({ length: 20 }, () => ({ value: 3500 + (Math.random() - 0.5) * 200 })),
  },
  {
    id: "tether",
    name: "Tether",
    ticker: "USDT",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    price: 1.0,
    change24h: 0.01,
    volume24h: 80000000000,
    marketCap: 110000000000,
    priceHistory: Array.from({ length: 20 }, () => ({ value: 1 + (Math.random() - 0.5) * 0.01 })),
  },
    {
    id: "solana",
    name: "Solana",
    ticker: "SOL",
    iconUrl: "https://assets.coincap.io/assets/icons/sol@2x.png",
    price: 150.0,
    change24h: 5.8,
    volume24h: 5000000000,
    marketCap: 70000000000,
    priceHistory: Array.from({ length: 20 }, () => ({ value: 150 + (Math.random() - 0.5) * 15 })),
  },
  {
    id: "ripple",
    name: "XRP",
    ticker: "XRP",
    iconUrl: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    price: 0.48,
    change24h: -0.5,
    volume24h: 1500000000,
    marketCap: 26000000000,
    priceHistory: Array.from({ length: 20 }, () => ({ value: 0.48 + (Math.random() - 0.5) * 0.05 })),
  },
];

export function MarketView() {
  const [data, setData] = React.useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCoin, setSelectedCoin] = React.useState<CryptoData | null>(null);
  const [summary, setSummary] = React.useState<MarketSummaryOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [news, setNews] = React.useState<NewsItem[]>([]);

  React.useEffect(() => {
    // Initial load with a delay to show skeletons
    const timer = setTimeout(() => {
        setData(initialCryptoData);
        setNews(mockNews);
        const usdtCoin = initialCryptoData.find(c => c.ticker === 'USDT');
        setSelectedCoin(usdtCoin || initialCryptoData[0]);
        setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if(isLoading) return;
    
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = prevData.map((coin) => {
          const changeFactor = (Math.random() - 0.5) * 0.02; // small random change
          const newPrice = coin.price * (1 + changeFactor);
          const newChange24h = coin.change24h + (Math.random() - 0.5) * 0.1;
          const newHistory = [...coin.priceHistory.slice(1), { value: newPrice }];

          const updatedCoin = { ...coin, price: newPrice, change24h: newChange24h, priceHistory: newHistory };

          if (selectedCoin && selectedCoin.id === coin.id) {
            setSelectedCoin(updatedCoin);
          }
          
          return updatedCoin;
        });
        return newData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading, selectedCoin]);

  const handleAnalyzeMarket = async () => {
    if (!data.length) return;
    setIsAnalyzing(true);
    setSummary(null);
    
    try {
        const analysisInput = {
            coins: data.map(c => ({
                name: c.name,
                ticker: c.ticker,
                price: c.price,
                change24h: c.change24h,
            }))
        };
        const response = await fetch('/api/market-summary', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(analysisInput),
        });
        if (!response.ok) throw new Error('Failed to get market analysis.');
        const result: MarketSummaryOutput = await response.json();
        setSummary(result);
    } catch (error) {
        console.error(error);
        setSummary({ summary: 'Could not retrieve market analysis at this time.' });
    } finally {
        setIsAnalyzing(false);
    }
  };


  const formatCurrency = (value: number, decimals = 2) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  
  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  }

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-32" /></TableCell>
        </TableRow>
      ));
    }

    return data.map((coin) => (
      <TableRow 
        key={coin.id}
        onClick={() => setSelectedCoin(coin)}
        className={cn(
          "cursor-pointer",
          selectedCoin?.id === coin.id && "bg-muted/50 hover:bg-muted/60"
        )}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            <Image
              src={coin.iconUrl}
              alt={`${coin.name} logo`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <div className="font-medium">{coin.name}</div>
              <div className="text-xs text-muted-foreground">{coin.ticker}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="font-mono text-right">{formatCurrency(coin.price, coin.price < 1 ? 4 : 2)}</TableCell>
        <TableCell
          className={cn(
            "text-right",
            coin.change24h >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {coin.change24h >= 0 ? "+" : ""}
          {coin.change24h.toFixed(2)}%
        </TableCell>
        <TableCell className="text-right">{formatMarketCap(coin.volume24h)}</TableCell>
        <TableCell className="text-right">{formatMarketCap(coin.marketCap)}</TableCell>
        <TableCell>
          <div className="h-8 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={coin.priceHistory}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={coin.change24h >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TableCell>
      </TableRow>
    ));
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
              <Skeleton className="h-[480px] w-full rounded-lg" />
          ) : (
              <LiveTradingChart coin={selectedCoin} />
          )}
          <Card>
            <CardHeader>
              <CardTitle>Live Crypto Market</CardTitle>
              <CardDescription>
                Select a cryptocurrency to view its live chart. Data updates automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">24h Volume</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead>Last 7 Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderRows()}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Market Summary</CardTitle>
            <CardDescription>Get an AI-generated snapshot of the market.</CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : summary ? (
              <p className="text-sm text-muted-foreground">{summary.summary}</p>
            ) : (
                <Alert>
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle>Ready for analysis</AlertTitle>
                    <AlertDescription>
                        Click the button below to get a real-time market summary from our AI analyst.
                    </AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardContent>
            <Button onClick={handleAnalyzeMarket} disabled={isAnalyzing || isLoading} className="w-full">
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                {summary ? 'Regenerate Summary' : 'Analyze Market'}
            </Button>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Market News</CardTitle>
                <CardDescription>Latest headlines from the crypto world.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map(item => (
                            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                    <span>{item.source}</span>
                                    <span>{item.timeAgo}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    