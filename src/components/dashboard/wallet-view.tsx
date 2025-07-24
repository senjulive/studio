
'use client';

import * as React from "react";
import Link from "next/link";
import { Repeat, Lock, LineChart, Wallet as WalletIcon, User, HeartHandshake, Users, ArrowLeftRight } from "lucide-react";
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
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AllAssetsChart } from "./all-assets-chart";
import Image from "next/image";
import { getUserRank } from "@/lib/ranks";
import { useUser } from "@/contexts/UserContext";
import { type TierSetting as TierData, getBotTierSettings, getCurrentTier } from "@/lib/tiers";
import { tierIcons, tierClassNames } from '@/lib/settings';

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

const quickAccessItems = [
  { href: "/dashboard/market", label: "Market", icon: LineChart },
  { href: "/dashboard/deposit", label: "Deposit", icon: WalletIcon },
  { href: "/dashboard/trading", label: "Trade", icon: Repeat },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/support", label: "Support", icon: HeartHandshake },
  { href: "/dashboard/squad", label: "Squad", icon: Users },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowLeftRight },
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
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const { user } = useUser();
  const [allAssetsData, setAllAssetsData] = React.useState<CryptoData[]>([]);
  const [tier, setTier] = React.useState<TierData | null>(null);

  const fetchWalletData = React.useCallback(async () => {
    if (user?.id) {
        const [wallet, tiers] = await Promise.all([
          getOrCreateWallet(),
          getBotTierSettings(),
        ]);
        setWalletData(wallet);
        const currentTier = await getCurrentTier(wallet.balances?.usdt ?? 0, tiers);
        setTier(currentTier);
      }
  }, [user]);

  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);
  

  React.useEffect(() => {
    const fetchMarketData = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true');
            if (!response.ok) {
                throw new Error('Failed to fetch market data');
            }
            const apiData = await response.json();
            const mappedData = apiData.map((coin: any) => ({
                id: coin.id,
                name: coin.name,
                ticker: coin.symbol.toUpperCase(),
                iconUrl: coin.image,
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h,
                volume24h: coin.total_volume,
                marketCap: coin.market_cap,
                priceHistory: coin.sparkline_in_7d.price.map((p: number) => ({ value: p })),
            }));
            setAllAssetsData(mappedData);
        } catch (error) {
            console.error(error);
            // Optionally set an error state
        }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds
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

  const dailyEarnings = walletData?.growth?.dailyEarnings ?? 0;
  
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || RecruitRankIcon;

  const TierIcon = tier ? tierIcons[tier.id] : null;
  const tierClassName = tier ? tierClassNames[tier.id] : null;

  if (!walletData) {
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
      <Card
        className="relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-primary/5 -z-10"
        />
        <CardHeader>
           <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-2">
            Available Assets
            {walletData && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5", rank.className)}>
                  <RankIcon className="h-5 w-5" />
                  <span>{rank.name}</span>
                </Badge>
                {tier && TierIcon && tierClassName && (
                  <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5", tierClassName)}>
                    <TierIcon className="h-5 w-5" />
                    <span>{tier.name}</span>
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Your total asset value and individual balances.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Value (USD)
                </p>
                <p className="text-4xl font-bold tracking-tighter">
                  $
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Today's Earnings
                </p>
                <p className="text-lg font-semibold text-green-600">
                  +$
                  {dailyEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          {assetsWithFunds.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {assetsWithFunds.map(asset => (
                  <div key={asset.ticker} className="rounded-lg border bg-background/50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Image src={asset.iconUrl} alt={asset.ticker} width={20} height={20} className="rounded-full" />
                          <span>{asset.name}</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">
                          {asset.balanceKey === 'usdt' && '$'}
                          {balances[asset.balanceKey].toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: asset.balanceKey === 'usdt' ? 2 : 6,
                          }) ?? '0.00'}
                      </p>
                  </div>
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground p-4 border border-dashed rounded-lg">
                You currently have no funds. Make a deposit to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center">
            {quickAccessItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center space-y-1 rounded-lg p-1 transition-colors hover:bg-muted"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <AllAssetsChart coins={allAssetsData} />

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A record of all your deposits, withdrawals, and earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No transactions yet.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <div className="font-medium">{txn.type}</div>
                    </TableCell>
                    <TableCell>{txn.asset}</TableCell>
                    <TableCell
                      className={cn(
                        "font-mono",
                        txn.amount >= 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {txn.asset === 'USDT' ? (
                        `${txn.amount >= 0 ? "+" : "-"}$${Math.abs(txn.amount).toFixed(2)}`
                      ) : (
                        `${txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })} ${txn.asset}`
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(txn.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          txn.status === "Completed"
                            ? "default"
                            : txn.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
