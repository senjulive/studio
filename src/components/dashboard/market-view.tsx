
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
      const fetchCryptoPrices = async () => {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true');
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }
        const data: CryptoData[] = await res.json();
        return data;
      };
      
      const apiData = await fetchCryptoPrices();
      const mappedData = mapApiDataToGenericAsset(apiData);
      setData(mappedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
          <AllAssetsChart coins={data} />
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
