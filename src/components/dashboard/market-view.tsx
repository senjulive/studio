
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { BrainCircuit, Loader2 } from "lucide-react";
import type { MarketSummaryOutput } from "@/ai/flows/market-summary-flow";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AllAssetsChart } from "./all-assets-chart";
import { GlobalStatsBar, type GlobalStats } from "./market/global-stats-bar";
import { FearGreedGauge, type FearGreedData } from "./market/fear-greed-gauge";
import { MarketMovers } from "./market/market-movers";
import { TrendingCoins, type TrendingCoin } from "./market/trending-coins";

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
export type GenericAsset = {
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
  const [allAssetsData, setAllAssetsData] = React.useState<GenericAsset[]>([]);
  const [globalStats, setGlobalStats] = React.useState<GlobalStats | null>(null);
  const [fearGreed, setFearGreed] = React.useState<FearGreedData | null>(null);
  const [trending, setTrending] = React.useState<TrendingCoin[]>([]);
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
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
        const [
            assetsRes,
            globalRes,
            fearGreedRes,
            trendingRes
        ] = await Promise.all([
            fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true'),
            fetch('https://api.coingecko.com/api/v3/global'),
            fetch('https://api.alternative.me/fng/?limit=1'),
            fetch('https://api.coingecko.com/api/v3/search/trending')
        ]);

        if (!assetsRes.ok) throw new Error(`Failed to fetch market data: ${assetsRes.statusText}`);
        if (!globalRes.ok) throw new Error(`Failed to fetch global stats: ${globalRes.statusText}`);
        if (!fearGreedRes.ok) throw new Error(`Failed to fetch Fear & Greed Index: ${fearGreedRes.statusText}`);
        if (!trendingRes.ok) throw new Error(`Failed to fetch trending coins: ${trendingRes.statusText}`);

        const assetsApiData: CryptoData[] = await assetsRes.json();
        const globalApiData = await globalRes.json();
        const fearGreedApiData = await fearGreedRes.json();
        const trendingApiData = await trendingRes.json();

        const mappedAssets = mapApiDataToGenericAsset(assetsApiData);
        setAllAssetsData(mappedAssets);
        
        setGlobalStats(globalApiData.data);
        setFearGreed(fearGreedApiData.data[0]);
        setTrending(trendingApiData.coins);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  
  const handleAnalyzeMarket = async () => {
    if (!allAssetsData.length) return;
    setIsAnalyzing(true);
    setSummary(null);
    
    try {
        const analysisInput = {
            coins: allAssetsData.slice(0, 10).map(c => ({
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

  return (
    <div className="space-y-6">
        <GlobalStatsBar stats={globalStats} isLoading={isLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <AllAssetsChart coins={allAssetsData} />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <FearGreedGauge data={fearGreed} isLoading={isLoading} />
                <MarketMovers assets={allAssetsData} isLoading={isLoading} />
                <TrendingCoins coins={trending} isLoading={isLoading} />
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
    </div>
  );
}

    