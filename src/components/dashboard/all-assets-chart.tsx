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
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
};

const cryptoColors: { [key: string]: string } = {
  BTC: "hsl(var(--chart-1))",
  ETH: "hsl(var(--chart-2))",
  USDT: "hsl(var(--chart-3))",
  SOL: "hsl(var(--chart-4))",
  XRP: "hsl(var(--chart-5))",
};


export function AllAssetsChart({ coins }: AllAssetsChartProps) {
  const chartData = React.useMemo(() => {
    if (!coins || coins.length === 0 || !coins[0].priceHistory) return [];
    
    const numPoints = coins[0].priceHistory.length;
    const data = [];
    
    const initialPrices: { [key: string]: number } = {};
    coins.forEach(coin => {
      if (coin.priceHistory.length > 0) {
        initialPrices[coin.ticker] = coin.priceHistory[0].value;
      }
    });

    for (let i = 0; i < numPoints; i++) {
      const dataPoint: { [key: string]: number | string } = { name: `Point ${i}` };
      coins.forEach(coin => {
        if(coin.priceHistory[i]) {
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
  }, [coins]);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  if (!coins || coins.length === 0) {
    return (
      <Card>
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
    <Card>
      <CardHeader>
        <CardTitle>All Assets Overview</CardTitle>
        <CardDescription>
          Normalized performance of all major assets over time.
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
              {coins.map((coin) => (
                <defs key={`def-${coin.id}`}>
                    <linearGradient id={`color-${coin.ticker}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={cryptoColors[coin.ticker] || '#8884d8'} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={cryptoColors[coin.ticker] || '#8884d8'} stopOpacity={0} />
                    </linearGradient>
                </defs>
              ))}
              {coins.map(coin => (
                  <Area
                    key={coin.id}
                    type="monotone"
                    dataKey={coin.ticker}
                    stroke={cryptoColors[coin.ticker] || '#8884d8'}
                    strokeWidth={2}
                    fillOpacity={0.2}
                    fill={`url(#color-${coin.ticker})`}
                    dot={false}
                    name={coin.name}
                  />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
