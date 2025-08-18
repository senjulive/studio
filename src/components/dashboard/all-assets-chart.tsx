"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

type AllAssetsChartProps = {
  coins: CryptoData[];
  className?: string;
};

export function AllAssetsChart({ coins, className }: AllAssetsChartProps) {
  const filteredCoins = React.useMemo(() => {
    const tickersToShow = ['BTC', 'ETH', 'USDT'];
    return coins.filter(coin => tickersToShow.includes(coin.ticker));
  }, [coins]);

  if (!filteredCoins || filteredCoins.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Asset Performance</CardTitle>
          <CardDescription>Live price data for your assets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Loading asset data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Key Asset Performance</CardTitle>
        <CardDescription>
          Performance overview of BTC, ETH, and USDT.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] space-y-6">
          {filteredCoins.map((coin) => (
            <div key={coin.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {coin.ticker.charAt(0)}
                  </div>
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-sm text-muted-foreground">({coin.ticker})</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${coin.price.toLocaleString()}</div>
                  <div className={cn(
                    "text-sm",
                    coin.change24h >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              {/* Simple progress bar to simulate chart */}
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      coin.change24h >= 0 
                        ? "bg-gradient-to-r from-green-500 to-green-600" 
                        : "bg-gradient-to-r from-red-500 to-red-600"
                    )}
                    style={{ 
                      width: `${Math.min(Math.abs(coin.change24h) * 10, 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>24h Volume: ${(coin.volume24h / 1000000000).toFixed(2)}B</span>
                  <span>Market Cap: ${(coin.marketCap / 1000000000).toFixed(2)}B</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Simple trend visualization */}
          <div className="pt-6 border-t">
            <div className="text-sm font-medium mb-3">Price Trend Visualization</div>
            <div className="grid grid-cols-3 gap-4">
              {filteredCoins.map((coin) => (
                <div key={`trend-${coin.id}`} className="text-center space-y-2">
                  <div className="text-xs text-muted-foreground">{coin.ticker}</div>
                  <div className="h-16 bg-muted rounded flex items-end p-2">
                    {/* Simulated mini chart bars */}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 mx-0.5 rounded-sm transition-all duration-500",
                          coin.change24h >= 0 ? "bg-green-500" : "bg-red-500"
                        )}
                        style={{
                          height: `${Math.max(10, Math.random() * 80)}%`,
                          opacity: 0.3 + (i * 0.1)
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
