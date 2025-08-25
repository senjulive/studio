"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Play, Pause, Activity, TrendingUp, BarChart3, Settings, Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { GridTradingAnimation } from "./grid-trading-animation";
import { useToast } from "@/hooks/use-toast";
import { TradingBotCard } from "../trading-bot-card";
import Link from "next/link";

export function ProTraderView() {
  const { wallet, tier, rank, user } = useUser();
  const { toast } = useToast();
  const [isTrading, setIsTrading] = React.useState(false);

  // Calculate proper daily earnings based on tier and rank
  const balances = wallet?.balances as any;
  const totalBalance = React.useMemo(() => {
    if (!balances) return 0;
    const btcPrice = 68000;
    const ethPrice = 3500;
    return balances.usdt + (balances.btc * btcPrice) + (balances.eth * ethPrice);
  }, [balances]);

  // Get rank multiplier
  const getRankMultiplier = () => {
    if (!rank) return 1;
    switch (rank.name) {
      case 'Recruit': return 1.0;
      case 'Bronze': return 1.1;
      case 'Silver': return 1.2;
      case 'Gold': return 1.3;
      case 'Platinum': return 1.4;
      case 'Diamond': return 1.5;
      default: return 1.0;
    }
  };

  // Calculate daily earnings: balance * tier.dailyProfit * rankMultiplier
  const dailyEarnings = React.useMemo(() => {
    if (!tier || !totalBalance) return 0;
    const baseEarnings = totalBalance * tier.dailyProfit;
    const rankMultiplier = getRankMultiplier();
    return baseEarnings * rankMultiplier;
  }, [totalBalance, tier, rank]);

  // Check if user can start trading
  const canStartTrading = React.useMemo(() => {
    const hasRequiredBalance = tier && totalBalance >= tier.balanceThreshold;
    const isVerified = wallet?.profile?.verificationStatus === 'verified';
    return hasRequiredBalance && isVerified;
  }, [tier, totalBalance, wallet?.profile?.verificationStatus]);

  const getRequiredAmount = () => {
    if (!tier) return 100; // Default minimum for tier 1
    return tier.balanceThreshold;
  };

  const isVerified = wallet?.profile?.verificationStatus === 'verified';

  const handleTradingToggle = () => {
    if (!canStartTrading) {
      if (!tier || totalBalance < getRequiredAmount()) {
        toast({
          title: "Insufficient Balance",
          description: `You need at least $${getRequiredAmount()} to start trading.`,
          variant: "destructive"
        });
      } else if (!isVerified) {
        toast({
          title: "Verification Required", 
          description: "Please complete your KYC verification to start trading.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsTrading(!isTrading);
    toast({
      title: isTrading ? "Trading Stopped" : "Trading Started",
      description: isTrading 
        ? "CORE Grid Trading is now offline." 
        : "CORE Grid Trading is now online and generating profits.",
    });
  };

  const tradingPairs = [
    { pair: "BTC/USDT", profit: "+2.45%", volume: "$45.2M", status: isTrading ? "active" : "offline" },
    { pair: "ETH/USDT", profit: "+1.87%", volume: "$32.1M", status: isTrading ? "active" : "offline" },
    { pair: "SOL/USDT", profit: "+3.21%", volume: "$18.7M", status: "paused" },
    { pair: "ADA/USDT", profit: "+0.94%", volume: "$12.3M", status: isTrading ? "active" : "offline" },
  ];

  const recentTrades = [
    { time: "2 min ago", pair: "BTC/USDT", type: "BUY", amount: "$125.50", profit: "+$2.45" },
    { time: "5 min ago", pair: "ETH/USDT", type: "SELL", amount: "$89.20", profit: "+$1.87" },
    { time: "8 min ago", pair: "SOL/USDT", type: "BUY", amount: "$67.80", profit: "+$1.23" },
    { time: "12 min ago", pair: "BTC/USDT", type: "SELL", amount: "$156.70", profit: "+$3.21" },
  ];

  return (
    <div className="space-y-6">
      {/* Requirements Status */}
      {!canStartTrading && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Trading Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    totalBalance >= getRequiredAmount() ? "bg-green-500" : "bg-red-500"
                  )} />
                  <span className="text-sm">Minimum Balance: ${getRequiredAmount()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    ${totalBalance.toFixed(2)}
                  </span>
                  {totalBalance >= getRequiredAmount() ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    isVerified ? "bg-green-500" : "bg-red-500"
                  )} />
                  <span className="text-sm">Updated KYC Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <>
                      <span className="text-sm font-medium text-green-600">Verified</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/profile/verify">Update KYC</Link>
                      </Button>
                      <Lock className="h-4 w-4 text-red-500" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Trading Controls */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            CORE Grid Trading
          </CardTitle>
          <CardDescription>
            Automated high-frequency trading with advanced grid algorithms
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  isTrading ? "bg-green-500 animate-pulse" : "bg-gray-400"
                )} />
                <span className="font-medium">
                  {isTrading ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleTradingToggle}
              variant={isTrading ? "destructive" : "default"}
              size="sm"
              disabled={!canStartTrading && !isTrading}
              className={cn(!canStartTrading && !isTrading && "opacity-50 cursor-not-allowed")}
            >
              {!canStartTrading && !isTrading ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Locked
                </>
              ) : (
                <>
                  {isTrading ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTrading ? "Stop" : "Start"}
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Today's Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                +${dailyEarnings.toFixed(2)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-xl font-bold text-foreground">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
            
            {tier && (
              <div>
                <p className="text-sm text-muted-foreground">VIP CORE Tier</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {tier.name}
                  </Badge>
                  <span className="text-sm font-medium">{(tier.dailyProfit * 100).toFixed(1)}% daily</span>
                </div>
              </div>
            )}
          </div>

          {rank && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rank Multiplier</p>
                  <p className="text-sm font-medium text-foreground">
                    {rank.name} - {(getRankMultiplier() * 100).toFixed(0)}% bonus
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-sm", rank.className)}>
                  x{getRankMultiplier().toFixed(1)}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trading Animation */}
      <Card>
        <CardHeader>
          <CardTitle>Live Trading Visualization</CardTitle>
          <CardDescription>
            Real-time view of your automated trading activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GridTradingAnimation isActive={isTrading} />
        </CardContent>
      </Card>

      <Tabs defaultValue="pairs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pairs">Trading Pairs</TabsTrigger>
          <TabsTrigger value="history">Recent Trades</TabsTrigger>
          <TabsTrigger value="bot">Grid</TabsTrigger>
        </TabsList>

        <TabsContent value="pairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Pairs</CardTitle>
              <CardDescription>
                Cryptocurrency pairs currently being traded by your bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {tradingPairs.map((pair) => (
                  <div key={pair.pair} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        pair.status === "active" ? "bg-green-500" : 
                        pair.status === "paused" ? "bg-yellow-500" : "bg-gray-400"
                      )} />
                      <div>
                        <p className="font-medium">{pair.pair}</p>
                        <p className="text-sm text-muted-foreground">24h Volume: {pair.volume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{pair.profit}</p>
                      <p className="text-sm text-muted-foreground capitalize">{pair.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>
                Your latest automated trading activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isTrading ? (
                <div className="space-y-3">
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{trade.pair}</p>
                        <p className="text-sm text-muted-foreground">{trade.time}</p>
                      </div>
                      <div className="text-center">
                        <Badge variant={trade.type === "BUY" ? "default" : "secondary"}>
                          {trade.type}
                        </Badge>
                        <p className="text-sm mt-1">{trade.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{trade.profit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trading activity</p>
                  <p className="text-sm">Start trading to see your trade history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot" className="space-y-4">
          <TradingBotCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
