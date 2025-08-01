'use client';

import * as React from "react";
import Link from "next/link";
import { Repeat, Lock, LineChart, Wallet as WalletIcon, User, HeartHandshake, Users, ArrowLeftRight, TrendingUp, Wallet } from "lucide-react";
import type { SVGProps } from 'react';
import { Button } from "@/components/ui/button";

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
import { VirtualCard } from "./virtual-card";

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


type Transaction = {
  id: string;
  type: string;
  asset: 'USDT' | 'BTC' | 'ETH';
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

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

const initialCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    ticker: "BTC",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    price: 68000.0,
    change24h: 2.5,
    volume24h: 45000000000,
    marketCap: 1300000000000,
    priceHistory: Array.from({ length: 50 }, () => ({ value: 68000 + (Math.random() - 0.5) * 2000 })),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    price: 3500.0,
    change24h: -1.2,
    volume24h: 25000000000,
    marketCap: 420000000000,
    priceHistory: Array.from({ length: 50 }, () => ({ value: 3500 + (Math.random() - 0.5) * 200 })),
  },
  {
    id: "tether",
    name: "Tether",
    ticker: "USDT",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    price: 1.0,
    change24h: 0.01,
    volume24h: 80000000000,
    marketCap: 110000000000,
    priceHistory: Array.from({ length: 50 }, () => ({ value: 1 + (Math.random() - 0.5) * 0.01 })),
  },
    {
    id: "solana",
    name: "Solana",
    ticker: "SOL",
    iconUrl: "https://assets.coincap.io/assets/icons/sol@2x.png",
    price: 150.0,
    change24h: 5.8,
    volume24h: 5000000000,
    marketCap: 70000000000,
    priceHistory: Array.from({ length: 50 }, () => ({ value: 150 + (Math.random() - 0.5) * 15 })),
  },
  {
    id: "ripple",
    name: "XRP",
    ticker: "XRP",
    iconUrl: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    price: 0.48,
    change24h: -0.5,
    volume24h: 1500000000,
    marketCap: 26000000000,
    priceHistory: Array.from({ length: 50 }, () => ({ value: 0.48 + (Math.random() - 0.5) * 0.05 })),
  },
];

const assetConfig = [
    {
        ticker: "USDT",
        name: "USDT Balance",
        iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
        balanceKey: "usdt",
    },
    {
        ticker: "ETH",
        name: "ETH Balance",
        iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
        balanceKey: "eth",
    },
    {
        ticker: "BTC",
        name: "BTC Balance",
        iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
        balanceKey: "btc",
    },
] as const;

export function WalletView() {
  const { wallet: walletData, tier, rank, user } = useUser();
  const [allAssetsData, setAllAssetsData] = React.useState<CryptoData[]>([]);

  React.useEffect(() => {
    setAllAssetsData(initialCryptoData);

    const interval = setInterval(() => {
      setAllAssetsData((prevData) => {
        if (!prevData || prevData.length === 0) return [];
        return prevData.map((coin) => {
          const changeFactor = (Math.random() - 0.5) * 0.01;
          const newPrice = coin.price * (1 + changeFactor);
          const newHistory = [
            ...coin.priceHistory.slice(1),
            { value: newPrice },
          ];
          return {
            ...coin,
            price: newPrice,
            priceHistory: newHistory,
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const transactions = React.useMemo(() => {
    if (!walletData || !walletData.created_at) return [];

    const history: Transaction[] = [];
    const registrationDate = new Date(walletData.created_at).toISOString();

    history.push({
      id: `reg-bonus-usdt-${registrationDate}`,
      type: "Registration Bonus",
      asset: "USDT",
      amount: 5,
      date: registrationDate,
      status: "Completed",
    });

    if (walletData.squad.squad_leader) {
      history.push({
        id: `invite-bonus-usdt-${registrationDate}`,
        type: "Invitation Bonus",
        asset: "USDT",
        amount: 5,
        date: registrationDate,
        status: "Completed",
      });
    }

    const growth = walletData.growth as any;
    if (growth.earningsHistory) {
        growth.earningsHistory.forEach((earning: any, index: number) => {
        history.push({
          id: `grid-profit-${earning.timestamp}-${index}`,
          type: "Grid Profit",
          asset: "USDT",
          amount: earning.amount,
          date: new Date(earning.timestamp).toISOString(),
          status: "Completed",
        });
      });
    }

    if(walletData.squad.members) {
      walletData.squad.members.forEach((member: any, index: number) => {
        history.push({
          id: `squad-bonus-${index}-${member.id}`,
          type: "Team Earnings",
          asset: "USDT",
          amount: 5,
          date: new Date(
            Date.now() - Math.random() * (index + 2) * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "Completed",
        });
      });
    }

    if (walletData.pending_withdrawals) {
        walletData.pending_withdrawals.forEach((w: any) => {
        history.push({
          id: w.id,
          type: "Withdrawal",
          asset: "USDT",
          amount: -w.amount,
          date: new Date(w.timestamp).toISOString(),
          status: "Pending",
        });
      });
    }

    return history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [walletData]);

  const totalBalance = React.useMemo(() => {
    if (!walletData || allAssetsData.length === 0) return 0;
    
    const btcPrice = allAssetsData.find(c => c.ticker === "BTC")?.price ?? 0;
    const ethPrice = allAssetsData.find(c => c.ticker === "ETH")?.price ?? 0;

    const balances = walletData.balances as any;
    return (
        balances.usdt +
        (balances.btc * btcPrice) +
        (balances.eth * ethPrice)
    );
  }, [walletData, allAssetsData]);

  const dailyEarnings = (walletData?.growth as any)?.dailyEarnings ?? 0;
  
  const RankIcon = rank ? rankIcons[rank.Icon] : RecruitRankIcon;
  const TierIcon = tier ? tierIcons[tier.id] : null;
  const tierClassName = tier ? tierClassNames[tier.id] : null;

  if (!walletData || !rank) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }
  
  const balances = walletData.balances as any;
  const assetsWithFunds = assetConfig.filter(asset => balances[asset.balanceKey] > 0);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="wallet">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wallet"><WalletIcon className="mr-2 h-4 w-4"/>Wallet</TabsTrigger>
          <TabsTrigger value="squad"><Users className="mr-2 h-4 w-4"/>My Squad</TabsTrigger>
        </TabsList>
        <TabsContent value="wallet">
          <div className="space-y-6">
            {/* User Status & Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-4">
              <div className={cn("text-lg py-2 px-4 flex items-center gap-2 font-semibold", rank.className)}>
                <RankIcon className="h-6 w-6" />
                <span>{rank.name}</span>
              </div>
              {tier && TierIcon && tierClassName && (
                <div className={cn("text-lg py-2 px-4 flex items-center gap-2 font-semibold", tierClassName)}>
                  <TierIcon className="h-6 w-6" />
                  <span>{tier.name}</span>
                </div>
              )}
            </div>

            {/* Portfolio Overview */}
            <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Portfolio Overview
                </CardTitle>
                <CardDescription>Your total asset value and daily performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                    <p className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Today's Earnings</p>
                    <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      +${dailyEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Virtual Card */}
            <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  AstralCore Card
                </CardTitle>
                <CardDescription>Your virtual trading card with live balance</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <VirtualCard walletData={walletData} userEmail={user?.email || null} />
              </CardContent>
            </Card>

            {/* Asset Balances */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Asset Balances
                </CardTitle>
                <CardDescription>Your cryptocurrency holdings breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {assetsWithFunds.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {assetsWithFunds.map(asset => (
                      <div key={asset.ticker} className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-background to-background/80 p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center p-2">
                              <Image src={asset.iconUrl} alt={asset.ticker} width={32} height={32} className="rounded-full" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{asset.ticker}</p>
                              <p className="text-sm text-muted-foreground">{asset.name}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-3xl font-bold tracking-tight">
                              {asset.balanceKey === 'usdt' && '$'}
                              {balances[asset.balanceKey].toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: asset.balanceKey === 'usdt' ? 2 : 6,
                              }) ?? '0.00'}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{asset.ticker} Balance</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center mb-4">
                      <Wallet className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Assets Yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      You currently have no funds. Make a deposit to get started with automated trading.
                    </p>
                    <Button asChild className="mt-4">
                      <Link href="/dashboard/deposit">
                        <Wallet className="mr-2 h-4 w-4" />
                        Make Your First Deposit
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <AllAssetsChart coins={allAssetsData} />

            <Card>
              <CardHeader><CardTitle>Transaction History</CardTitle><CardDescription>A record of all your deposits, withdrawals, and earnings.</CardDescription></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Asset</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No transactions yet.</TableCell></TableRow>
                    ) : (
                      transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell><div className="font-medium">{txn.type}</div></TableCell>
                          <TableCell>{txn.asset}</TableCell>
                          <TableCell className={cn("font-mono", txn.amount >= 0 ? "text-green-600" : "text-red-600")}>
                            {txn.asset === 'USDT' ? (`${txn.amount >= 0 ? "+" : "-"}$${Math.abs(txn.amount).toFixed(2)}`) : (`${txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${txn.asset}`)}
                          </TableCell>
                          <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right"><Badge variant={txn.status === "Completed" ? "default" : txn.status === "Pending" ? "secondary" : "destructive"} className="capitalize">{txn.status}</Badge></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="squad">
          <SquadSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}
