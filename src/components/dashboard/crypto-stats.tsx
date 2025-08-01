"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Zap } from "lucide-react";
import { StatCard, GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CryptoStatsProps {
  className?: string;
}

export function CryptoStats({ className }: CryptoStatsProps) {
  const stats = [
    {
      title: "Total Balance",
      value: "$586,580.86",
      trend: "up" as const,
      trendValue: "+12.3%",
      icon: DollarSign,
      variant: "crypto" as const,
    },
    {
      title: "24h Volume",
      value: "$138.50",
      trend: "up" as const,
      trendValue: "+5.2%",
      icon: BarChart3,
      variant: "success" as const,
    },
    {
      title: "Active Trades",
      value: "23",
      trend: "neutral" as const,
      trendValue: "0",
      icon: Activity,
      variant: "gradient" as const,
    },
    {
      title: "Success Rate",
      value: "94.7%",
      trend: "up" as const,
      trendValue: "+2.1%",
      icon: Zap,
      variant: "gaming" as const,
    },
  ];

  const cryptoAssets = [
    { symbol: "BTC", name: "Bitcoin", price: "$49K.80", change: "+2.34%", positive: true },
    { symbol: "ETH", name: "Ethereum", price: "$3,423.25", change: "+5.67%", positive: true },
    { symbol: "LTC", name: "Litecoin", price: "$84.85", change: "-1.23%", positive: false },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            trendValue={stat.trendValue}
            icon={stat.icon}
            variant={stat.variant}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div />
          </StatCard>
        ))}
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crypto Assets */}
        <GlassCard variant="crypto" glow="subtle" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Crypto Assets</h3>
              <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                Live
              </Badge>
            </div>
            
            <div className="space-y-3">
              {cryptoAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-background/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-cyan-400">{asset.symbol}</span>
                    </div>
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{asset.price}</p>
                    <p className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      asset.positive ? "text-green-400" : "text-red-400"
                    )}>
                      {asset.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {asset.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Trading Activity */}
        <GlassCard variant="gradient" glow="subtle" className="animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Trading Activity</h3>
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                Bot Active
              </Badge>
            </div>
            
            {/* Mini Chart Representation */}
            <div className="relative h-32 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20 overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-primary to-cyan-400 rounded-full animate-bar-pulse"
                    style={{
                      height: `${Math.random() * 80 + 20}%`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
              
              {/* Floating stats */}
              <div className="absolute top-4 left-4">
                <p className="text-2xl font-bold text-primary">+$247.30</p>
                <p className="text-sm text-muted-foreground">Today's Profit</p>
              </div>
            </div>
            
            {/* Recent Trades */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Trades</h4>
              <div className="space-y-2">
                {[
                  { pair: "BTC/USDT", type: "BUY", amount: "+0.0234", time: "2m ago" },
                  { pair: "ETH/USDT", type: "SELL", amount: "-1.245", time: "5m ago" },
                  { pair: "LTC/USDT", type: "BUY", amount: "+12.45", time: "8m ago" },
                ].map((trade, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded-lg bg-background/30 border border-border/30"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={trade.type === "BUY" ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          trade.type === "BUY" 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        )}
                      >
                        {trade.type}
                      </Badge>
                      <span>{trade.pair}</span>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-medium",
                        trade.type === "BUY" ? "text-green-400" : "text-red-400"
                      )}>
                        {trade.amount}
                      </p>
                      <p className="text-muted-foreground">{trade.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
