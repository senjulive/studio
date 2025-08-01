"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
} from "recharts";
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
  coins?: CryptoData[];
  className?: string;
};

const cryptoColors: { [key: string]: string } = {
  BTC: "hsl(var(--chart-1))",
  ETH: "hsl(var(--chart-2))",
  USDT: "hsl(var(--chart-3))",
  SOL: "hsl(var(--chart-4))",
  XRP: "hsl(var(--chart-5))",
};


// Default mock data for when coins prop is not provided
const defaultCoins: CryptoData[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    ticker: 'BTC',
    iconUrl: '',
    price: 45000,
    change24h: 2.5,
    volume24h: 25000000000,
    marketCap: 850000000000,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      value: 45000 + (Math.sin(i / 5) * 2000) + (Math.random() - 0.5) * 1000
    }))
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    ticker: 'ETH',
    iconUrl: '',
    price: 3200,
    change24h: 1.8,
    volume24h: 15000000000,
    marketCap: 380000000000,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      value: 3200 + (Math.sin(i / 4) * 150) + (Math.random() - 0.5) * 100
    }))
  },
  {
    id: 'tether',
    name: 'Tether',
    ticker: 'USDT',
    iconUrl: '',
    price: 1.0,
    change24h: 0.01,
    volume24h: 50000000000,
    marketCap: 75000000000,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      value: 1.0 + (Math.random() - 0.5) * 0.002
    }))
  }
];

export function AllAssetsChart({ coins = defaultCoins, className }: AllAssetsChartProps) {
  const safeCoins = coins;

  const filteredCoins = React.useMemo(() => {
    const tickersToShow = ['BTC', 'ETH', 'USDT'];
    return safeCoins.filter(coin => tickersToShow.includes(coin.ticker));
  }, [safeCoins]);


  const chartData = React.useMemo(() => {
    if (!filteredCoins || filteredCoins.length === 0) return [];
    
    const refCoin = filteredCoins.find(c => c.priceHistory && c.priceHistory.length > 0);
    if (!refCoin) return [];

    const numPoints = refCoin.priceHistory.length;
    const data = [];
    
    const initialPrices: { [key: string]: number } = {};
    filteredCoins.forEach(coin => {
      if (coin.priceHistory && coin.priceHistory.length > 0) {
        initialPrices[coin.ticker] = coin.priceHistory[0].value;
      }
    });

    for (let i = 0; i < numPoints; i++) {
      const dataPoint: { [key: string]: number | string } = { name: `Point ${i}` };
      filteredCoins.forEach(coin => {
        if(coin.priceHistory && coin.priceHistory[i]) {
            const initialPrice = initialPrices[coin.ticker];
            if (initialPrice > 0) {
                const currentValue = coin.priceHistory[i].value;
                dataPoint[coin.ticker] = ((currentValue / initialPrice) - 1) * 100;
            } else {
                dataPoint[coin.ticker] = 0;
            }
        }
      });
      data.push(dataPoint);
    }
    return data;
  }, [filteredCoins]);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

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
          Normalized performance of BTC, ETH, and USDT over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="name" hide />
              <YAxis
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                domain={['auto', 'auto']}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value: number, name: string) => [formatPercent(value), name]}
                labelFormatter={() => 'Performance Change'}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: "20px" }}
              />
              {filteredCoins.filter(c => c.ticker !== 'USDT').map((coin) => (
                <defs key={`def-${coin.id}`}>
                    <linearGradient id={`color-${coin.ticker}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cryptoColors[coin.ticker] || '#8884d8'} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={cryptoColors[coin.ticker] || '#8884d8'} stopOpacity={0} />
                    </linearGradient>
                </defs>
              ))}
              <Area
                key="BTC"
                type="monotone"
                dataKey="BTC"
                stroke={cryptoColors['BTC']}
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#color-BTC)"
                dot={false}
                name="Bitcoin"
              />
              <Area
                key="ETH"
                type="natural"
                dataKey="ETH"
                stroke={cryptoColors['ETH']}
                strokeWidth={2}
                fillOpacity={0.1}
                fill="url(#color-ETH)"
                dot={false}
                name="Ethereum"
              />
              <Line
                key="USDT"
                type="monotone"
                dataKey="USDT"
                name="Tether"
                stroke={cryptoColors['USDT']}
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
