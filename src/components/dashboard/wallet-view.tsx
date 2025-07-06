
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { getOrCreateWallet } from "@/lib/wallet";

const MOCK_TRANSACTIONS: any[] = [];

export function WalletView() {
  const { toast } = useToast();
  const [balance] = React.useState(0);
  const [showWithdrawDialog, setShowWithdrawDialog] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [withdrawAddress, setWithdrawAddress] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("usdt");
  const [walletAddresses, setWalletAddresses] = React.useState({
    usdt: "",
    eth: "",
  });

  React.useEffect(() => {
    async function fetchWallet() {
      const addresses = await getOrCreateWallet();
      if (addresses) {
        setWalletAddresses(addresses);
      }
    }
    fetchWallet();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAddress || !withdrawAmount) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setIsWithdrawing(true);
    await new Promise((res) => setTimeout(res, 1500));
    setIsWithdrawing(false);
    setShowWithdrawDialog(false);
    setWithdrawAddress("");
    setWithdrawAmount("");
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal of ${withdrawAmount} ${activeTab.toUpperCase()} has been processed.`,
    });
  };

  const balances = {
    usdt: 0,
    eth: 0,
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
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
              ${balance.toLocaleString()}
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
            <Button
              variant="outline"
              onClick={() => setShowWithdrawDialog(true)}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
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
                ${balances.usdt.toLocaleString()}
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
                {balances.eth.toLocaleString()} ETH
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
              {MOCK_TRANSACTIONS.map((txn) => (
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

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw {activeTab.toUpperCase()}</DialogTitle>
            <DialogDescription>
              Enter the address and amount to withdraw.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-1.5">
                <Label htmlFor="withdraw-address">
                  Recipient {activeTab.toUpperCase()} Address
                </Label>
                <Input
                  id="withdraw-address"
                  placeholder="Enter wallet address"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>
              <div className="grid items-center gap-1.5">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={isWithdrawing}
                className="w-full"
              >
                {isWithdrawing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm Withdrawal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
