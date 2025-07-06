"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Users,
  Zap,
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
import { useToast } from "@/hooks/use-toast";
import { getOrCreateWallet, updateWallet, type WalletData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_TRANSACTIONS: any[] = [];

function GrowthEngine({
  walletData,
  onUpdate,
}: {
  walletData: WalletData;
  onUpdate: (data: WalletData) => void;
}) {
  const { toast } = useToast();
  const [isBoosting, setIsBoosting] = React.useState(false);
  const totalBalance = walletData.balances.usdt + walletData.balances.eth * 2500; // Assuming ETH price for calculation

  const canBoost = totalBalance >= 100 && walletData.growth.clicksLeft > 0;

  const handleBoost = async () => {
    if (!canBoost) return;

    setIsBoosting(true);

    const rate = totalBalance >= 500 ? 0.03 : 0.025;
    const earnings = totalBalance * rate;
    
    const newWalletData: WalletData = {
      ...walletData,
      balances: {
        ...walletData.balances,
        // Add earnings to USDT balance for simplicity
        usdt: walletData.balances.usdt + earnings,
      },
      growth: {
        ...walletData.growth,
        clicksLeft: walletData.growth.clicksLeft - 1,
      },
    };

    await updateWallet(newWalletData);
    onUpdate(newWalletData);

    toast({
      title: "Balance Boosted!",
      description: `You've earned $${earnings.toFixed(2)}.`,
    });
    setIsBoosting(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>Growth Engine</CardTitle>
            <Zap className="h-5 w-5 text-yellow-500" />
        </div>
        <CardDescription>
          Boost your balance up to 4 times a day.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Clicks remaining today</p>
            <p className="text-4xl font-bold">{walletData.growth.clicksLeft}</p>
        </div>
        <Button onClick={handleBoost} disabled={!canBoost || isBoosting} className="w-full">
          {isBoosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {totalBalance < 100 ? "Need $100 to start" : "Boost Balance"}
        </Button>
         <p className="text-xs text-muted-foreground text-center">
            Earn {totalBalance >= 500 ? "3%" : "2.5%"} on your available assets per boost. Click count resets daily.
        </p>
      </CardContent>
    </Card>
  );
}

export function WalletView() {
  const { toast } = useToast();
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
                <Skeleton className="h-[120px] rounded-lg" />
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
          <GrowthEngine walletData={walletData} onUpdate={handleWalletUpdate} />
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
