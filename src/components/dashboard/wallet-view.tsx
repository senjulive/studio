"use client";

import * as React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, Activity, BarChart3, DollarSign } from "lucide-react";
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
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { VirtualCard } from "./virtual-card";

type Transaction = {
  id: string;
  type: string;
  asset: 'USDT' | 'BTC' | 'ETH';
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

// Market data for crypto prices card
const marketData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    currentPrice: 67842.50,
    priceChangePercentage24h: 2.55,
  },
  {
    id: "ethereum",
    name: "Ethereum", 
    symbol: "ETH",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    currentPrice: 3487.90,
    priceChangePercentage24h: -1.19,
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT", 
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    currentPrice: 1.00,
    priceChangePercentage24h: 0.01,
  }
];

export function WalletView() {
  const { wallet: walletData, user } = useUser();

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

    if (walletData.earnings && Array.isArray(walletData.earnings)) {
      walletData.earnings.forEach((earning: any) => {
        history.push({
          id: earning.id,
          type: "Trading Earnings",
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
    if (!walletData) return 0;

    // Use approximate current market prices for calculation
    const btcPrice = 68000;
    const ethPrice = 3500;

    const balances = walletData.balances as any;
    return (
        balances.usdt +
        (balances.btc * btcPrice) +
        (balances.eth * ethPrice)
    );
  }, [walletData]);

  const dailyEarnings = (walletData?.growth as any)?.dailyEarnings ?? 0;

  if (!walletData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  const userFullName = walletData.profile?.fullName || walletData.profile?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{userFullName}</h2>
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
          </div>
        </CardContent>
      </Card>

      {/* AstralCore Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <VirtualCard walletData={walletData} userEmail={user?.email || null} />
          </div>
        </CardContent>
      </Card>

      {/* Cryptocurrency Prices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cryptocurrency Prices
          </CardTitle>
          <CardDescription>Live market prices and 24h changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.map((coin) => (
              <div key={coin.id} className="flex items-center justify-between p-3 rounded-lg border bg-gradient-to-r from-background to-background/80 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <Image src={coin.iconUrl} alt={coin.symbol} width={32} height={32} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-foreground">{coin.symbol}</p>
                    <p className="text-sm text-muted-foreground">{coin.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${coin.currentPrice.toLocaleString()}</p>
                  <p className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    coin.priceChangePercentage24h >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {coin.priceChangePercentage24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {coin.priceChangePercentage24h >= 0 ? '+' : ''}{coin.priceChangePercentage24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A record of all your deposits, withdrawals, and earnings</CardDescription>
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
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
                    <TableCell className={cn("font-mono", txn.amount >= 0 ? "text-green-600" : "text-red-600")}>
                      {txn.asset === 'USDT' ? (`${txn.amount >= 0 ? "+" : "-"}$${Math.abs(txn.amount).toFixed(2)}`) : (`${txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${txn.asset}`)}
                    </TableCell>
                    <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={txn.status === "Completed" ? "default" : txn.status === "Pending" ? "secondary" : "destructive"} 
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
