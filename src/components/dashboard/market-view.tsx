
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
import { BrainCircuit, Loader2, AlertCircle } from "lucide-react";
import type { MarketSummaryOutput } from "@/ai/flows/market-summary-flow";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Scale, Landmark, Bitcoin } from 'lucide-react';

type CryptoData = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d: {
    price: number[];
  };
};

// A more generic asset type for use in components
type GenericAsset = {
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


export function MarketView() {
  const [data, setData] = React.useState<GenericAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = React.useState<GenericAsset | null>(null);
  const [summary, setSummary] = React.useState<MarketSummaryOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const mapApiDataToGenericAsset = (apiData: CryptoData[]): GenericAsset[] => {
    return apiData.map(coin => ({
      id: coin.id,
      name: coin.name,
      ticker: coin.symbol.toUpperCase(),
      iconUrl: coin.image,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      priceHistory: coin.sparkline_in_7d.price.map(p => ({ value: p })),
    }));
  };

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const apiData: CryptoData[] = await response.json();
      const mappedData = mapApiDataToGenericAsset(apiData);
      setData(mappedData);
      if (!selectedAsset && mappedData.length > 0) {
        setSelectedAsset(mappedData[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAsset]);

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  
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
    if (isLoading && data.length === 0) {
      return Array.from({ length: 10 }).map((_, index) => (
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

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <AlertCircle className="mx-auto h-6 w-6 text-destructive mb-2"/>
            Failed to load market data. Please try again later.
          </TableCell>
        </TableRow>
      );
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
          {(isLoading && !selectedAsset) ? (
              <Skeleton className="h-[480px] w-full rounded-lg" />
          ) : (
              <LiveTradingChart coin={selectedAsset} />
          )}
          <Tabs defaultValue="crypto" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="crypto" disabled><Bitcoin className="mr-2"/>Crypto</TabsTrigger>
                <TabsTrigger value="stocks" disabled><TrendingUp className="mr-2"/>Stocks</TabsTrigger>
                <TabsTrigger value="commodities" disabled><Scale className="mr-2"/>Commodities</TabsTrigger>
                <TabsTrigger value="forex" disabled><Landmark className="mr-2"/>Forex</TabsTrigger>
            </TabsList>
            <TabsContent value="crypto">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Crypto Market</CardTitle>
                    <CardDescription>Select a cryptocurrency to view its live chart. Data refreshes automatically.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">24h Change</TableHead><TableHead className="text-right">24h Volume</TableHead><TableHead className="text-right">Market Cap</TableHead><TableHead>Last 7 Days</TableHead></TableRow></TableHeader>
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
            <Button onClick={handleAnalyzeMarket} disabled={isAnalyzing || isLoading || !!error} className="w-full">
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                {summary ? 'Regenerate Summary' : 'Analyze Market'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
