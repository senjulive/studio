
"use client";

import * as React from "react";
import { LineChart, BarChart, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type GlobalStats = {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
};

const StatItem = ({ title, value, isLoading }: { title: string; value: string; isLoading: boolean }) => (
  <div className="text-center">
    <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
    {isLoading ? (
      <Skeleton className="h-6 w-24 mx-auto mt-1" />
    ) : (
      <p className="text-lg font-semibold">{value}</p>
    )}
  </div>
);

const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    return `$${(value / 1e6).toFixed(2)}M`;
}

export function GlobalStatsBar({ stats, isLoading }: { stats: GlobalStats | null, isLoading: boolean }) {
  const marketCap = stats ? formatCurrency(stats.total_market_cap.usd) : "0";
  const volume = stats ? formatCurrency(stats.total_volume.usd) : "0";
  const btcDominance = stats ? `${stats.market_cap_percentage.btc.toFixed(1)}%` : "0%";
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
            <StatItem title="Market Cap" value={marketCap} isLoading={isLoading} />
            <StatItem title="24h Volume" value={volume} isLoading={isLoading} />
            <StatItem title="BTC Dominance" value={btcDominance} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}

    
