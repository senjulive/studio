"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Loader2,
  Users,
} from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";

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

const MOCK_TRANSACTIONS = [
  {
    id: "txn_1",
    type: "Deposit",
    asset: "USDT",
    amount: 1500.75,
    date: "2024-05-22T14:30:00Z",
    status: "Completed",
  },
  {
    id: "txn_2",
    type: "Withdrawal",
    asset: "ETH",
    amount: 2.5,
    date: "2024-05-21T09:00:00Z",
    status: "Completed",
  },
  {
    id: "txn_3",
    type: "Deposit",
    asset: "ETH",
    amount: 5.0,
    date: "2024-05-20T18:45:00Z",
    status: "Completed",
  },
  {
    id: "txn_4",
    type: "Withdrawal",
    asset: "USDT",
    amount: 500.0,
    date: "2024-05-19T11:20:00Z",
    status: "Pending",
  },
  {
    id: "txn_5",
    type: "Deposit",
    asset: "USDT",
    amount: 2500.0,
    date: "2024-05-18T16:00:00Z",
    status: "Failed",
  },
];

const WALLET_ADDRESSES = {
  USDT: "TQ1a1zP1Z5d6qF2w7gX8sR9j0kL3m4N5p6",
  ETH: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
};

export function WalletView() {
  const { toast } = useToast();
  const [balance] = React.useState(12540.52);
  const [showDepositDialog, setShowDepositDialog] = React.useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [withdrawAddress, setWithdrawAddress] = React.useState("");

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Address copied to clipboard" });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard.",
        variant: "destructive",
      });
    }
  };

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
      description: `Your withdrawal of ${withdrawAmount} has been processed.`,
    });
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
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
            <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available for trading and withdrawal
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
            <div className="text-2xl font-bold">$25.00</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/referrals" className="font-medium text-accent hover:underline">
                View details &rarr;
              </Link>
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
                <CardDescription>Deposit or withdraw funds.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow items-center justify-center gap-4">
                 <Button className="w-full" onClick={() => setShowDepositDialog(true)}>
                    <ArrowDownLeft className="mr-2 h-4 w-4" /> Deposit
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setShowWithdrawDialog(true)}>
                    <ArrowUpRight className="mr-2 h-4 w-4" /> Withdraw
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A record of your recent deposits and withdrawals.
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
                  <TableCell>{txn.amount.toFixed(2)}</TableCell>
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

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>
              Select a network and send funds to the address below.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="usdt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usdt">USDT (TRC20)</TabsTrigger>
              <TabsTrigger value="eth">ETH (ERC20)</TabsTrigger>
            </TabsList>
            <TabsContent value="usdt">
              <div className="flex flex-col items-center gap-4 py-4">
                <QRCode value={WALLET_ADDRESSES.USDT} size={160} />
                <p className="text-sm text-muted-foreground">
                  Only send USDT (TRC20) to this address.
                </p>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="usdt-address">Deposit Address</Label>
                  <div className="flex items-center gap-2">
                    <Input id="usdt-address" value={WALLET_ADDRESSES.USDT} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(WALLET_ADDRESSES.USDT)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="eth">
              <div className="flex flex-col items-center gap-4 py-4">
                <QRCode value={WALLET_ADDRESSES.ETH} size={160} />
                <p className="text-sm text-muted-foreground">
                  Only send ETH (ERC20) to this address.
                </p>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="eth-address">Deposit Address</Label>
                  <div className="flex items-center gap-2">
                    <Input id="eth-address" value={WALLET_ADDRESSES.ETH} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(WALLET_ADDRESSES.ETH)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter the address and amount to withdraw.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-1.5">
                <Label htmlFor="withdraw-address">Recipient Address</Label>
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
               <Button type="submit" disabled={isWithdrawing} className="w-full">
                {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Withdrawal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
