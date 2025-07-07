
"use client";

import * as React from "react";
import Link from "next/link";
import { Repeat } from "lucide-react";

import { DepositIcon } from "@/components/icons/nav/deposit-icon";
import { MarketIcon } from "@/components/icons/nav/market-icon";
import { ProfileIcon } from "@/components/icons/nav/profile-icon";
import { SquadIcon } from "@/components/icons/nav/squad-icon";
import { SupportIcon } from "@/components/icons/nav/support-icon";
import { WithdrawIcon } from "@/components/icons/nav/withdraw-icon";

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
import { getOrCreateWallet, updateWallet, type WalletData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingBotCard } from "./trading-bot-card";
import { getCurrentUserEmail } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AllAssetsChart } from "./all-assets-chart";
import Image from "next/image";

type Transaction = {
  id: string;
  type: string;
  asset: string;
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
  { href: "/dashboard/market", label: "Market", icon: MarketIcon },
  { href: "/dashboard/deposit", label: "Deposit", icon: DepositIcon },
  { href: "/dashboard/market", label: "Trade", icon: Repeat },
  { href: "/dashboard/profile", label: "Profile", icon: ProfileIcon },
  { href: "/dashboard/support", label: "Support", icon: SupportIcon },
  { href: "/dashboard/squad", label: "Squad", icon: SquadIcon },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: WithdrawIcon },
];

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
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(
    null
  );
  const [allAssetsData, setAllAssetsData] = React.useState<CryptoData[]>([]);

  React.useEffect(() => {
    const email = getCurrentUserEmail();
    if (email) {
      setCurrentUserEmail(email);
      async function fetchWallet() {
        const data = await getOrCreateWallet(email);
        setWalletData(data);
      }
      fetchWallet();
    }
  }, []);

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
    if (!walletData) return [];

    const history: Transaction[] = [];

    // Grid Profits from earnings history
    if (walletData.growth.earningsHistory) {
      walletData.growth.earningsHistory.forEach((earning, index) => {
        history.push({
          id: `grid-profit-${earning.timestamp}-${index}`,
          type: 'Grid Profit',
          asset: 'USDT',
          amount: earning.amount,
          date: new Date(earning.timestamp).toISOString(),
          status: 'Completed',
        });
      });
    }

    // Invitation Bonus
    if (walletData.squad.squadLeader) {
      history.push({
        id: `invite-bonus`,
        type: "Invitation Bonus",
        asset: "USDT",
        amount: 5,
        date: new Date(
          Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "Completed",
      });
    }

    // Team Earnings from squad members
    walletData.squad.members.forEach((member, index) => {
      history.push({
        id: `squad-bonus-${index}`,
        type: "Team Earnings",
        asset: "USDT",
        amount: 5,
        date: new Date(
          Date.now() - Math.random() * (index + 2) * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: "Completed",
      });
    });

    // Pending Withdrawals from walletData
    if (walletData.pendingWithdrawals) {
      walletData.pendingWithdrawals.forEach(w => {
          history.push({
              id: w.id,
              type: 'Withdrawal',
              asset: 'USDT',
              amount: -w.amount,
              date: new Date(w.timestamp).toISOString(),
              status: 'Pending',
          });
      });
    }

    // Mock deposit for demonstration, since there is no deposit history yet
    history.push({
      id: "txn-dep-1",
      type: "Deposit",
      asset: "USDT",
      amount: Math.floor(Math.random() * (2000 - 500 + 1) + 500),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Completed",
    });


    return history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [walletData]);

  const totalBalance = React.useMemo(() => {
    if (!walletData || allAssetsData.length === 0) return 0;
    
    const btcPrice = allAssetsData.find(c => c.ticker === "BTC")?.price ?? 0;
    const ethPrice = allAssetsData.find(c => c.ticker === "ETH")?.price ?? 0;

    return (
        walletData.balances.usdt +
        (walletData.balances.btc * btcPrice) +
        (walletData.balances.eth * ethPrice)
    );
  }, [walletData, allAssetsData]);

  const dailyEarnings = walletData?.growth?.dailyEarnings ?? 0;

  const handleWalletUpdate = async (newData: WalletData) => {
    if (currentUserEmail) {
      await updateWallet(currentUserEmail, newData);
      setWalletData(newData);
    }
  };

  if (!walletData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }
  
  const assetsWithFunds = assetConfig.filter(asset => walletData.balances[asset.balanceKey] > 0);

  return (
    <div className="space-y-6">
      <Card
        className="relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white -z-10"
          style={{
            clipPath: 'ellipse(100% 70% at 0% 100%)'
          }}
        />
        <CardHeader>
          <CardTitle>Available Assets</CardTitle>
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
                          {walletData.balances[asset.balanceKey].toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: asset.balanceKey === 'usdt' ? 2 : 6,
                          })}
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

      <TradingBotCard walletData={walletData} onUpdate={handleWalletUpdate} />

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
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
                        txn.amount >= 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {`${txn.amount >= 0 ? "+" : "-"}$${Math.abs(
                        txn.amount
                      ).toFixed(2)}`}
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
