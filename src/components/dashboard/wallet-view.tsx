'use client';

import * as React from "react";
import Link from "next/link";
import { Repeat, Lock, LineChart, Wallet as WalletIcon, User, HeartHandshake, Users, ArrowLeftRight, TrendingUp, Gamepad2 } from "lucide-react";
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

  // Modern glass card layout for other themes
  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toFixed(2)}`}
          subtitle="USDT equivalent"
          icon={WalletIcon}
          trend="up"
          trendValue="+12.5%"
          variant="gradient"
        />
        <StatCard
          title="Account Rank"
          value={rank?.name || 'Recruit'}
          subtitle={`${rank?.minBalance || 0}+ USDT`}
          icon={RankIcon}
          variant="crypto"
        />
        {tier && (
          <StatCard
            title="VIP Tier"
            value={tier.name}
            subtitle={`${tier.min_balance}+ USDT`}
            icon={TierIcon}
            variant="gaming"
          />
        )}
        <StatCard
          title="Active Trades"
          value="3"
          subtitle="Bot trading"
          icon={Repeat}
          trend="neutral"
          trendValue="0"
          variant="success"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <div className="lg:col-span-2">
          <GlassCard variant="gradient" glow="subtle">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Portfolio Overview</h3>
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                  Live
                </Badge>
              </div>
              <AllAssetsChart />
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <FeatureCard
            title="Quick Deposit"
            description="Add funds to your account"
            icon={WalletIcon}
            variant="crypto"
            action={
              <Button size="sm" asChild>
                <Link href="/dashboard/deposit">Deposit</Link>
              </Button>
            }
          />
          
          <FeatureCard
            title="Trading Bot"
            description="AI-powered automated trading"
            icon={Repeat}
            badge="Active"
            variant="gaming"
            action={
              <Button size="sm" asChild>
                <Link href="/dashboard/trading">Manage</Link>
              </Button>
            }
          />
          
          <FeatureCard
            title="Join Squad"
            description="Connect with other traders"
            icon={Users}
            variant="gradient"
            action={
              <Button size="sm" asChild>
                <Link href="/dashboard/squad">Explore</Link>
              </Button>
            }
          />
        </div>
      </div>

      {/* Traditional Dashboard */}
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

// Traditional dashboard component for fallback
function TraditionalDashboard({ wallet, totalBalance, rank, tier, RankIcon, TierIcon, tierClassName }: any) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="assets">Assets</TabsTrigger>
        <TabsTrigger value="trading">Trading</TabsTrigger>
        <TabsTrigger value="squad">Squad</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">USDT</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Rank</CardTitle>
              <RankIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rank?.name || 'Recruit'}</div>
              <p className="text-xs text-muted-foreground">
                {rank?.minBalance || 0}+ USDT required
              </p>
            </CardContent>
          </Card>

          {tier && TierIcon && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VIP Tier</CardTitle>
                <TierIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tier.name}</div>
                <p className="text-xs text-muted-foreground">
                  {tier.min_balance}+ USDT required
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Bot trading</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <AllAssetsChart />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Deposit</p>
                    <p className="text-muted-foreground">+$100.00 USDT</p>
                  </div>
                  <div className="text-sm text-muted-foreground">2h ago</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Bot Trade</p>
                    <p className="text-muted-foreground">BTC/USDT +$12.50</p>
                  </div>
                  <div className="text-sm text-muted-foreground">4h ago</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Squad Reward</p>
                    <p className="text-muted-foreground">+$5.00 USDT</p>
                  </div>
                  <div className="text-sm text-muted-foreground">1d ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="assets">
        <AssetTable wallet={wallet} />
      </TabsContent>

      <TabsContent value="trading">
        <TradingOverview />
      </TabsContent>

      <TabsContent value="squad">
        <SquadSystem />
      </TabsContent>
    </Tabs>
  );
}

function AssetTable({ wallet }: { wallet: any }) {
  const assets = [
    { symbol: "USDT", name: "Tether", balance: wallet.balances?.usdt || 0, value: wallet.balances?.usdt || 0 },
    { symbol: "BTC", name: "Bitcoin", balance: wallet.balances?.btc || 0, value: (wallet.balances?.btc || 0) * 45000 },
    { symbol: "ETH", name: "Ethereum", balance: wallet.balances?.eth || 0, value: (wallet.balances?.eth || 0) * 3000 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
        <CardDescription>Overview of your cryptocurrency holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Value (USDT)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.symbol}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-muted-foreground">{asset.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{asset.balance.toFixed(6)}</TableCell>
                <TableCell>${asset.value.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/deposit">Deposit</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/withdraw">Withdraw</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TradingOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trading Bot Status</CardTitle>
          <CardDescription>AI-powered automated trading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Strategy</span>
              <span className="font-medium">Grid Trading</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Profit Today</span>
              <span className="font-medium text-green-500">+$24.50</span>
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard/trading">Manage Bot</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>AI insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">BTC/USDT</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  BUY
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ETH/USDT</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  HOLD
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">LTC/USDT</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  SELL
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/market">View Analysis</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[250px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-[120px] mb-1" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="h-3 w-[60px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
