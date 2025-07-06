"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  LineChart,
  MessageSquare,
  Repeat,
  User,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { UsdtLogoIcon } from "@/components/icons/usdt-logo";
import { cn } from "@/lib/utils";
import { LiveTradingChart } from "./live-trading-chart";

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
  priceHistory: { value: number }[];
};

const quickAccessItems = [
  { href: "/dashboard/market", label: "Market", icon: LineChart },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownLeft },
  { href: "/dashboard/market", label: "Trade", icon: Repeat },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/support", label: "Support", icon: MessageSquare },
  { href: "/dashboard/squad", label: "Squad", icon: Users },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight },
];

export function WalletView() {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(
    null
  );
  const [usdtData, setUsdtData] = React.useState<CryptoData | null>(null);

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
    const initialUsdtData: CryptoData = {
      id: "tether-dashboard",
      name: "Tether",
      ticker: "USDT",
      iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
      price: 1.0,
      change24h: 0.01,
      priceHistory: Array.from({ length: 50 }, () => ({
        value: 1 + (Math.random() - 0.5) * 0.01,
      })),
    };
    setUsdtData(initialUsdtData);

    const interval = setInterval(() => {
      setUsdtData((prevData) => {
        if (!prevData) return null;
        const changeFactor = (Math.random() - 0.5) * 0.001;
        const newPrice = prevData.price * (1 + changeFactor);
        const newChange24h =
          prevData.change24h + (Math.random() - 0.5) * 0.005;
        const newHistory = [
          ...prevData.priceHistory.slice(1),
          { value: newPrice },
        ];
        return {
          ...prevData,
          price: newPrice,
          change24h: newChange24h,
          priceHistory: newHistory,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const transactions = React.useMemo(() => {
    if (!walletData) return [];

    const history: Transaction[] = [];

    // Daily Earnings
    if (walletData.growth.dailyEarnings > 0) {
      history.push({
        id: `earn-${walletData.growth.lastReset}`,
        type: "Daily Earnings",
        asset: "USDT",
        amount: walletData.growth.dailyEarnings,
        date: new Date(walletData.growth.lastReset).toISOString(),
        status: "Completed",
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

    // Mock deposit and withdrawal for demonstration
    history.push({
      id: "txn-dep-1",
      type: "Deposit",
      asset: "USDT",
      amount: Math.floor(Math.random() * (2000 - 500 + 1) + 500),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Completed",
    });

    history.push({
      id: "txn-wd-1",
      type: "Withdrawal",
      asset: "USDT",
      amount: -Math.floor(Math.random() * (500 - 50 + 1) + 50),
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Pending",
    });

    return history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [walletData]);

  const totalBalance = walletData?.balances ? walletData.balances.usdt : 0;
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

  return (
    <div className="space-y-6">
      <Card>
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
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-lg border bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UsdtLogoIcon />
                <span>USDT Balance</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                $
                {walletData.balances.usdt.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild className="w-full">
            <Link href="/dashboard/deposit">
              <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard/withdraw">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <TradingBotCard walletData={walletData} onUpdate={handleWalletUpdate} />

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            {quickAccessItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center space-y-2 rounded-lg p-2 transition-colors hover:bg-muted"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <LiveTradingChart coin={usdtData} />

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
