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
import { BrainCircuit, Loader2 } from "lucide-react";
// Local type to replace AI import for Netlify builds
type MarketSummaryOutput = {
  reasoning?: string;
  summary: string;
  trends?: string[];
  confidence?: number;
};
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Scale, Landmark, Bitcoin } from 'lucide-react';

type GenericAsset = {
  id: string;
  name: string;
  ticker: string;
  iconUrl?: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  priceHistory: { value: number }[];
};

const initialCryptoData: GenericAsset[] = [
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
];

const initialStockData: GenericAsset[] = [
    { id: 'aapl', name: 'Apple Inc.', ticker: 'AAPL', price: 172.25, change24h: 1.5, volume24h: 90000000, marketCap: 2800000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 172.25 + (Math.random() - 0.5) * 5 })) },
    { id: 'googl', name: 'Alphabet Inc.', ticker: 'GOOGL', price: 139.74, change24h: -0.8, volume24h: 25000000, marketCap: 1700000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 139.74 + (Math.random() - 0.5) * 4 })) },
    { id: 'tsla', name: 'Tesla, Inc.', ticker: 'TSLA', price: 250.50, change24h: 3.2, volume24h: 120000000, marketCap: 800000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 250.50 + (Math.random() - 0.5) * 10 })) },
];

const initialCommodityData: GenericAsset[] = [
    { id: 'gold', name: 'Gold', ticker: 'XAU/USD', price: 2350.50, change24h: 0.5, volume24h: 20000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 2350.50 + (Math.random() - 0.5) * 20 })) },
    { id: 'silver', name: 'Silver', ticker: 'XAG/USD', price: 28.75, change24h: 1.2, volume24h: 5000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 28.75 + (Math.random() - 0.5) * 1 })) },
];

const initialForexData: GenericAsset[] = [
    { id: 'eurusd', name: 'Euro to US Dollar', ticker: 'EUR/USD', price: 1.0850, change24h: -0.2, volume24h: 500000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 1.0850 + (Math.random() - 0.5) * 0.01 })) },
    { id: 'gbpusd', name: 'British Pound to US Dollar', ticker: 'GBP/USD', price: 1.2750, change24h: 0.1, volume24h: 300000000000, priceHistory: Array.from({ length: 20 }, () => ({ value: 1.2750 + (Math.random() - 0.5) * 0.01 })) },
];


export function MarketView() {
  const [data, setData] = React.useState<GenericAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedAsset, setSelectedAsset] = React.useState<GenericAsset | null>(null);
  const [summary, setSummary] = React.useState<MarketSummaryOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  
  React.useEffect(() => {
    setData(initialCryptoData);
    setSelectedAsset(initialCryptoData.find(c => c.ticker === 'BTC') || initialCryptoData[0]);
    setIsLoading(false);

    const timer = setTimeout(() => {
        const allData = {
            crypto: initialCryptoData,
            stocks: initialStockData,
            commodities: initialCommodityData,
            forex: initialForexData,
        };
        
        setData(allData.crypto);
        setSelectedAsset(allData.crypto[0]);
        setIsLoading(false);
    }, 1500);


    return () => {
      clearTimeout(timer);
    };
    
  }, []);

  const handleTabChange = (tab: string) => {
    let newDataSet: GenericAsset[] = [];
    switch(tab) {
        case 'crypto': newDataSet = initialCryptoData; break;
        case 'stocks': newDataSet = initialStockData; break;
        case 'commodities': newDataSet = initialCommodityData; break;
        case 'forex': newDataSet = initialForexData; break;
    }
    setData(newDataSet);
    setSelectedAsset(newDataSet[0]);
  }
  
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

  const renderRows = (currentData: GenericAsset[]) => {
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
          {currentData[0]?.marketCap !== undefined && <TableCell><Skeleton className="h-5 w-24" /></TableCell>}
          <TableCell><Skeleton className="h-8 w-32" /></TableCell>
        </TableRow>
      ));
    }

    return currentData.map((asset) => (
      <TableRow 
        key={asset.id}
        onClick={() => setSelectedAsset(asset)}
        className={cn(
          "cursor-pointer",
          selectedAsset?.id === asset.id && "bg-muted/50 hover:bg-muted/60"
        )}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            {asset.iconUrl && <Image
              src={asset.iconUrl}
              alt={`${asset.name} logo`}
              width={32}
              height={32}
              className="rounded-full"
            />}
            <div>
              <div className="font-medium">{asset.name}</div>
              <div className="text-xs text-muted-foreground">{asset.ticker}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="font-mono text-right">{formatCurrency(asset.price, asset.price < 1 ? 4 : 2)}</TableCell>
        <TableCell
          className={cn(
            "text-right",
            asset.change24h >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {asset.change24h >= 0 ? "+" : ""}
          {asset.change24h.toFixed(2)}%
        </TableCell>
        <TableCell className="text-right">{formatMarketCap(asset.volume24h)}</TableCell>
        {asset.marketCap !== undefined && <TableCell className="text-right">{formatMarketCap(asset.marketCap)}</TableCell>}
        <TableCell>
          <div className="h-8 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={asset.priceHistory}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={asset.change24h >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
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
              <LiveTradingChart coin={selectedAsset} />
          )}
          <Tabs defaultValue="crypto" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="crypto"><Bitcoin className="mr-2"/>Crypto</TabsTrigger>
                <TabsTrigger value="stocks"><TrendingUp className="mr-2"/>Stocks</TabsTrigger>
                <TabsTrigger value="commodities"><Scale className="mr-2"/>Commodities</TabsTrigger>
                <TabsTrigger value="forex"><Landmark className="mr-2"/>Forex</TabsTrigger>
            </TabsList>
            <TabsContent value="crypto">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Crypto Market</CardTitle>
                    <CardDescription>Select a cryptocurrency to view its live chart.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">24h Change</TableHead><TableHead className="text-right">24h Volume</TableHead><TableHead className="text-right">Market Cap</TableHead><TableHead>Last 7 Days</TableHead></TableRow></TableHeader>
                        <TableBody>{renderRows(data)}</TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="stocks">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Market</CardTitle>
                    <CardDescription>Select a stock to view its live chart.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">24h Change</TableHead><TableHead className="text-right">24h Volume</TableHead><TableHead className="text-right">Market Cap</TableHead><TableHead>Last 7 Days</TableHead></TableRow></TableHeader>
                        <TableBody>{renderRows(data)}</TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="commodities">
                <Card>
                  <CardHeader>
                    <CardTitle>Commodities Market</CardTitle>
                    <CardDescription>Select a commodity to view its live chart.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">24h Change</TableHead><TableHead className="text-right">24h Volume</TableHead><TableHead>Last 7 Days</TableHead></TableRow></TableHeader>
                        <TableBody>{renderRows(data)}</TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="forex">
                <Card>
                  <CardHeader>
                    <CardTitle>Forex Market</CardTitle>
                    <CardDescription>Select a currency pair to view its live chart.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">24h Change</TableHead><TableHead className="text-right">24h Volume</TableHead><TableHead>Last 7 Days</TableHead></TableRow></TableHeader>
                        <TableBody>{renderRows(data)}</TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
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
      </div>
    </div>
  );
}
