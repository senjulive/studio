
"use client";

import * as React from "react";
import { Info, Loader2, Clock } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  getWithdrawalAddresses,
  saveWithdrawalAddress,
  type WithdrawalAddresses,
  getOrCreateWallet,
  type WalletData,
} from "@/lib/wallet";
import Image from "next/image";
import { format } from "date-fns";
import { useUser } from "@/contexts/UserContext";

export function WithdrawView() {
  const { toast } = useToast();
  const [savedAddresses, setSavedAddresses] =
    React.useState<WithdrawalAddresses | null>(null);
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [currentAddress, setCurrentAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);

  const asset = "usdt";
  
  const fetchWalletData = React.useCallback(async () => {
    if (user?.id) {
        setIsLoading(true);
        const [addresses, wallet] = await Promise.all([
          getWithdrawalAddresses(),
          getOrCreateWallet(),
        ]);
        setSavedAddresses(addresses);
        setWalletData(wallet);
        setIsLoading(false);
      }
  }, [user]);

  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleSaveAddress = async () => {
    if (!currentAddress || !/T[A-Za-z1-9]{33}/.test(currentAddress)) {
      toast({
        title: "Invalid TRC20 Address",
        description: "Please enter a valid TRC20 address for USDT.",
        variant: "destructive",
      });
      return;
    }
    if (!user?.id) return;

    setIsSaving(true);
    await saveWithdrawalAddress(asset, currentAddress);
    const updatedAddresses = await getWithdrawalAddresses();
    setSavedAddresses(updatedAddresses);
    setIsSaving(false);
    toast({ title: "Address Saved", description: "Your withdrawal address has been saved." });
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (!walletData || !user?.id || !savedAddresses?.usdt) return;

    if (!amount || withdrawAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    if (withdrawAmount < 10) {
      toast({ title: "Minimum Withdrawal", description: `The minimum withdrawal amount is $10.00 USDT.`, variant: "destructive" });
      return;
    }
    
    if (withdrawAmount > walletData.balances.usdt) {
      toast({ title: "Insufficient Balance", description: `Your USDT balance is too low.`, variant: "destructive" });
      return;
    }

    if (!passcode || passcode.length < 4) {
      toast({ title: "Passcode Required", description: `Please enter your 4-6 digit withdrawal passcode.`, variant: "destructive" });
      return;
    }

    setIsWithdrawing(true);
    
    // Mock passcode check
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const response = await fetch('/api/withdraw/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                amount: withdrawAmount,
                asset: 'usdt',
                address: savedAddresses.usdt,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to submit withdrawal request.");
        }

        await fetchWalletData(); // Refetch data to show new pending request and updated balance

        setAmount("");
        setPasscode("");
        toast({
            title: "Withdrawal Initiated",
            description: `Your request for ${withdrawAmount.toFixed(2)} USDT is being processed.`,
        });

    } catch (error: any) {
        toast({ title: "Withdrawal Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsWithdrawing(false);
    }
  };

  const hasSavedAddress = savedAddresses && savedAddresses[asset as keyof WithdrawalAddresses];
  const pendingWithdrawals = walletData?.pending_withdrawals || [];
  
  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/4" />
          </div>
      );
    }

    if (!hasSavedAddress) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You have not set a withdrawal address for{" "}
            {asset.toUpperCase()}. Please add one to continue.
          </p>
          <div className="space-y-2">
            <Label htmlFor="new-address">
              New {asset.toUpperCase()} Withdrawal Address (TRC20)
            </Label>
            <Input
              id="new-address"
              placeholder="Enter your external TRC20 wallet address"
              value={currentAddress}
              onChange={(e) => setCurrentAddress(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSaveAddress}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Address
          </Button>
        </div>
      );
    }

    return (
        <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-2">
            <Label>Your Saved USDT Address</Label>
            <Input
                value={
                savedAddresses?.[asset as keyof WithdrawalAddresses] || ""
                }
                readOnly
                className="font-mono text-sm"
            />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Withdraw (Available: ${walletData?.balances.usdt.toFixed(2)})</Label>
                <Input
                    id="amount"
                    type="number"
                    placeholder="Minimum $10.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isWithdrawing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passcode">Withdrawal Passcode</Label>
                <Input
                    id="passcode"
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    disabled={isWithdrawing}
                />
              </div>
            </div>
            <Button type="submit" disabled={isWithdrawing || !amount || !passcode} className="w-full">
            {isWithdrawing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Request Withdrawal
            </Button>
        </form>
    );
  };


  return (
    <div className="space-y-6">
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Image src="https://assets.coincap.io/assets/icons/usdt@2x.png" alt="USDT logo" width={24} height={24} className="rounded-full" />
            <span>Withdraw USDT (TRC20)</span>
        </CardTitle>
        <CardDescription>
          Manage your withdrawal address and send funds to your external
          wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-4">
          {renderContent()}

          <Alert className="mt-4 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Please Note</AlertTitle>
            <AlertDescription>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  Ensure the wallet address is correct and on the{" "}
                  <strong>TRC20</strong> network.
                </li>
                <li>
                  Withdrawals typically take <strong>24-72 hours</strong> to be fully processed for security reasons.
                </li>
                <li>
                  You must set a withdrawal passcode on the Security page before you can withdraw funds.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>

    {pendingWithdrawals.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Withdrawals
                </CardTitle>
                <CardDescription>These withdrawals are currently being processed.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount (USDT)</TableHead>
                            <TableHead>Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingWithdrawals.map((w) => (
                            <TableRow key={w.id}>
                                <TableCell>{format(new Date(w.timestamp), "PPp")}</TableCell>
                                <TableCell className="font-mono">${w.amount.toFixed(2)}</TableCell>
                                <TableCell className="font-mono text-xs truncate max-w-[100px] sm:max-w-xs">{w.address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )}
    </div>
  );
}
