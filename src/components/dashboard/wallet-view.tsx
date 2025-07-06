"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
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

const MOCK_TRANSACTIONS: any[] = [];

export function WalletView() {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const email = getCurrentUserEmail();
    if (email) {
      setCurrentUserEmail(email);
      async function fetchWallet() {
        let data = await getOrCreateWallet(email);

        // Check for daily reset
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (data?.growth && now - data.growth.lastReset > oneDay) {
          data.growth.clicksLeft = 4;
          data.growth.lastReset = now;
          await updateWallet(email, data);
        }
        setWalletData(data);
      }
      fetchWallet();
    }
  }, []);

  const totalBalance = walletData?.balances ? walletData.balances.usdt + walletData.balances.eth * 2500 : 0;

  const handleWalletUpdate = async (newData: WalletData) => {
    if (currentUserEmail) {
      await updateWallet(currentUserEmail, newData);
      setWalletData(newData);
    }
  };
  
  if (!walletData) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-[280px] rounded-lg" />
            <Skeleton className="h-[240px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Your total asset value and individual balances.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-4xl font-bold tracking-tighter">
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground">USDT Balance</p>
                    <p className="text-2xl font-bold">
                        ${walletData.balances.usdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                    <p className="text-sm font-medium text-muted-foreground">ETH Balance</p>
                    <p className="text-2xl font-bold">
                        {walletData.balances.eth.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 8})} ETH
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
          <CardTitle>Full Transaction History</CardTitle>
          <CardDescription>
            A record of all your deposits and withdrawals.
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
              {MOCK_TRANSACTIONS.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No transactions yet.
                    </TableCell>
                </TableRow>
              ) : MOCK_TRANSACTIONS.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>
                    <div className="font-medium">{txn.type}</div>
                  </TableCell>
                  <TableCell>{txn.asset}</TableCell>
                  <TableCell>
                    {txn.asset === "USDT"
                      ? `$${txn.amount.toFixed(2)}`
                      : `${txn.amount.toFixed(4)} ETH`}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
