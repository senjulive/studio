'use client';

import * as React from "react";
import Link from "next/link";
import { Repeat, Lock, LineChart, Wallet as WalletIcon, User, HeartHandshake, Users, ArrowLeftRight, TrendingUp, Gamepad2, Plus, ArrowUpRight, ArrowDownRight, Eye, Zap, Star, Target } from "lucide-react";
import type { SVGProps } from 'react';

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AllAssetsChart } from "./all-assets-chart";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { tierIcons, tierClassNames } from '@/lib/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquadSystem } from "./squad-system";
import { CryptoStats } from "./crypto-stats";
import { GamingRewards } from "./gaming-rewards";
import { GlassCard, StatCard, FeatureCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      
      {/* Chart skeleton */}
      <Skeleton className="h-80 rounded-2xl" />
      
      {/* Table skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

function ModernBalanceCard({ wallet, totalBalance, rank, tier, RankIcon, TierIcon, tierClassName }: any) {
  const dailyChange = wallet?.growth?.dailyEarnings ?? 0;
  const changePercent = totalBalance > 0 ? (dailyChange / totalBalance) * 100 : 0;
  
  return (
    <GlassCard variant="gradient" className="p-6 relative overflow-hidden floating-element">
      <div className="space-y-4">
        {/* Balance header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                ${totalBalance.toFixed(2)}
              </h2>
              <Badge variant={dailyChange >= 0 ? "default" : "destructive"} className="text-xs">
                {dailyChange >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex gap-2">
              {rank && (
                <Badge variant="outline" className={cn("text-xs", rank.className)}>
                  <RankIcon className="h-3 w-3 mr-1" />
                  {rank.name}
                </Badge>
              )}
              {tier && TierIcon && tierClassName && (
                <Badge variant="outline" className={cn("text-xs", tierClassName)}>
                  <TierIcon className="h-3 w-3 mr-1" />
                  {tier.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Daily earnings */}
        <div className="flex items-center gap-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              dailyChange >= 0 ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm text-muted-foreground">Today</span>
          </div>
          <div className={cn(
            "text-sm font-semibold",
            dailyChange >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {dailyChange >= 0 ? '+' : ''}${Math.abs(dailyChange).toFixed(2)}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link href="/dashboard/deposit">
              <Plus className="h-4 w-4 mr-2" />
              Deposit
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link href="/dashboard/withdraw">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw
            </Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function AssetBalanceCards({ wallet }: any) {
  const assets = [
    {
      symbol: "USDT",
      name: "Tether",
      balance: wallet?.balances?.usdt ?? 0,
      icon: "https://assets.coincap.io/assets/icons/usdt@2x.png",
      change: "+2.3%",
      color: "text-green-500"
    },
    {
      symbol: "ETH",
      name: "Ethereum", 
      balance: wallet?.balances?.eth ?? 0,
      icon: "https://assets.coincap.io/assets/icons/eth@2x.png",
      change: "+1.8%",
      color: "text-blue-500"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: wallet?.balances?.btc ?? 0,
      icon: "https://assets.coincap.io/assets/icons/btc@2x.png", 
      change: "+5.2%",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <GlassCard key={asset.symbol} variant="crypto" className="p-4 hover:scale-105 transition-transform duration-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Image
                src={asset.icon}
                alt={asset.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <Badge variant="outline" className={cn("text-xs", asset.color)}>
                {asset.change}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{asset.symbol}</h3>
                <span className="text-xs text-muted-foreground">{asset.name}</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {asset.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function QuickActionsGrid() {
  const actions = [
    {
      title: "AI Trading",
      description: "Start quantum trading",
      icon: Zap,
      href: "/dashboard/trading",
      variant: "crypto" as const,
      badge: "94.7% Success"
    },
    {
      title: "Squad Trading", 
      description: "Join team trades",
      icon: Users,
      href: "/dashboard/squad",
      variant: "gaming" as const,
      badge: "New"
    },
    {
      title: "Market Analysis",
      description: "Live market data",
      icon: TrendingUp,
      href: "/dashboard/market",
      variant: "gradient" as const,
      badge: "Real-time"
    },
    {
      title: "Rewards Center",
      description: "Claim your rewards",
      icon: Star,
      href: "/dashboard/rewards",
      variant: "success" as const,
      badge: "Daily"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <FeatureCard
          key={action.title}
          title={action.title}
          description={action.description}
          icon={action.icon}
          variant={action.variant}
          className="card-feature cursor-pointer"
          action={
            <Button size="sm" asChild>
              <Link href={action.href}>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        >
          <Badge className="absolute -top-2 -right-2 text-xs">
            {action.badge}
          </Badge>
        </FeatureCard>
      ))}
    </div>
  );
}

function TraditionalDashboard({ wallet, totalBalance, rank, tier, RankIcon, TierIcon, tierClassName }: any) {
  const recentTransactions = [
    { type: 'deposit', amount: 1500, time: '2 hours ago', status: 'completed' },
    { type: 'trade', amount: 125.50, time: '4 hours ago', status: 'completed' },
    { type: 'withdraw', amount: 500, time: '1 day ago', status: 'pending' },
    { type: 'trade', amount: 89.25, time: '2 days ago', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Main balance card */}
      <ModernBalanceCard 
        wallet={wallet}
        totalBalance={totalBalance}
        rank={rank}
        tier={tier}
        RankIcon={RankIcon}
        TierIcon={TierIcon}
        tierClassName={tierClassName}
      />

      {/* Asset balance cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Your Assets</h3>
        <AssetBalanceCards wallet={wallet} />
      </div>

      {/* Quick actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <QuickActionsGrid />
      </div>

      {/* Chart section */}
      <GlassCard variant="gradient" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Your asset performance over time</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <AllAssetsChart className="h-[300px]" />
        </CardContent>
      </GlassCard>

      {/* Recent activity */}
      <GlassCard variant="gradient" className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions and trades</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    transaction.type === 'deposit' && "bg-green-500/20 text-green-500",
                    transaction.type === 'trade' && "bg-blue-500/20 text-blue-500",
                    transaction.type === 'withdraw' && "bg-orange-500/20 text-orange-500"
                  )}>
                    {transaction.type === 'deposit' && <ArrowDownRight className="h-5 w-5" />}
                    {transaction.type === 'trade' && <Repeat className="h-5 w-5" />}
                    {transaction.type === 'withdraw' && <ArrowUpRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    transaction.type === 'deposit' && "text-green-500",
                    transaction.type === 'trade' && "text-blue-500", 
                    transaction.type === 'withdraw' && "text-orange-500"
                  )}>
                    {transaction.type === 'withdraw' ? '-' : '+'}${transaction.amount}
                  </p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/dashboard/transactions">
              <Eye className="h-4 w-4 mr-2" />
              View All Transactions
            </Link>
          </Button>
        </CardContent>
      </GlassCard>

      {/* Trading performance stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Win Rate"
          value="94.7%"
          trend="up"
          trendValue="+2.1%"
          variant="success"
        >
          <Target className="h-5 w-5 text-green-500" />
        </StatCard>
        
        <StatCard
          title="Total Trades"
          value="1,247"
          trend="up"
          trendValue="+18"
          variant="crypto"
        >
          <Repeat className="h-5 w-5 text-blue-500" />
        </StatCard>
        
        <StatCard
          title="Avg Profit"
          value="$127.50"
          trend="up"
          trendValue="+$12.30"
          variant="gradient"
        >
          <TrendingUp className="h-5 w-5 text-purple-500" />
        </StatCard>
        
        <StatCard
          title="Squad Size"
          value={wallet?.squad?.members?.length?.toString() ?? "0"}
          trend="up"
          trendValue="+3"
          variant="gaming"
        >
          <Users className="h-5 w-5 text-pink-500" />
        </StatCard>
      </div>
    </div>
  );
}

export function WalletView() {
  const { user, wallet, rank, tier } = useUser();
  const { theme } = useTheme();
  
  if (!wallet) {
    return <DashboardSkeleton />;
  }

  const totalBalance = wallet.balances?.usdt ?? 0;
  const RankIcon = rankIcons[rank?.Icon] || Lock;
  const TierIcon = tier ? tierIcons[tier.id] : null;
  const tierClassName = tier ? tierClassNames[tier.id] : null;

  // Theme-based content rendering
  if (theme === 'crypto') {
    return (
      <div className="space-y-6">
        <CryptoStats />
        <TraditionalDashboard 
          wallet={wallet} 
          totalBalance={totalBalance} 
          rank={rank} 
          tier={tier} 
          RankIcon={RankIcon} 
          TierIcon={TierIcon} 
          tierClassName={tierClassName} 
        />
      </div>
    );
  }

  if (theme === 'gaming') {
    return (
      <div className="space-y-6">
        <GamingRewards />
        <TraditionalDashboard 
          wallet={wallet} 
          totalBalance={totalBalance} 
          rank={rank} 
          tier={tier} 
          RankIcon={RankIcon} 
          TierIcon={TierIcon} 
          tierClassName={tierClassName} 
        />
      </div>
    );
  }

  // Default modern dashboard
  return (
    <div className="space-y-6 animate-fade-in">
      <TraditionalDashboard 
        wallet={wallet} 
        totalBalance={totalBalance} 
        rank={rank} 
        tier={tier} 
        RankIcon={RankIcon} 
        TierIcon={TierIcon} 
        tierClassName={tierClassName} 
      />
    </div>
  );
}
