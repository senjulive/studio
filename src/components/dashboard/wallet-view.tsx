"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
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
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getOrCreateWallet, updateWallet, type WalletData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { TradingBotCard } from "./trading-bot-card";

const MOCK_TRANSACTIONS: any[] = [];

export function WalletView() {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = React.useState("usdt");
  
  React.useEffect(() => {
    async function fetchWallet() {
      let data = await getOrCreateWallet();

      // Check for daily reset
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (now - data.growth.lastReset > oneDay) {
        data.growth.clicksLeft = 4;
        data.growth.lastReset = now;
        await updateWallet(data);
      }
      setWalletData(data);
    }
    fetchWallet();
  }, []);

  const totalBalance = walletData ? walletData.balances.usdt + walletData.balances.eth * 2500 : 0; // Assuming ETH price for calculation

  const handleWalletUpdate = (newData: WalletData) => {
    setWalletData(newData);
  };
  
  if (!walletData) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[120px] rounded-lg" />
                <Skeleton className="h-[120px] rounded-lg" />
                <Skeleton className="h-[120px] rounded-lg md:col-span-2 lg:col-span-1" />
            </div>
            <Skeleton className="h-[400px] rounded-lg" />
        </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Assets
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all your assets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Referral Earnings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              <Link
                href="/dashboard/referrals"
                className="font-medium text-accent hover:underline"
              >
                View referrals &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>
        <div className="md:col-span-2 lg:col-span-1">
          <TradingBotCard walletData={walletData} onUpdate={handleWalletUpdate} />
        </div>
      </div>

      <Tabs
        defaultValue="usdt"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="usdt">USDT Wallet</TabsTrigger>
            <TabsTrigger value="eth">ETH Wallet</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/deposit">
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/withdraw">
                <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
              </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="usdt">
          <Card>
            <CardHeader>
              <CardTitle>USDT Balance</CardTitle>
              <CardDescription>
                Your available Tether (TRC20) balance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${walletData.balances.usdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="eth">
          <Card>
            <CardHeader>
              <CardTitle>ETH Balance</CardTitle>
              <CardDescription>
                Your available Ethereum (ERC20) balance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {walletData.balances.eth.toLocaleString()} ETH
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
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
    </>
  );
}
