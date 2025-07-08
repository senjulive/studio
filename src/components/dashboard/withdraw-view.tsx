"use client";

import * as React from "react";
import Link from "next/link";
import { Info, Loader2, Clock, ShieldAlert } from "lucide-react";

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
  updateWallet,
  verifyWithdrawalPasscode,
} from "@/lib/wallet";
import { getCurrentUserEmail } from "@/lib/auth";
import { sendSystemNotification } from "@/lib/chat";
import { addNotification } from "@/lib/notifications";
import Image from "next/image";
import { format } from "date-fns";

export function WithdrawView() {
  const { toast } = useToast();
  const [savedAddresses, setSavedAddresses] =
    React.useState<WithdrawalAddresses | null>(null);
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [currentAddress, setCurrentAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [withdrawalPasscode, setWithdrawalPasscode] = React.useState("");
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);

  const asset = "usdt";
  
  React.useEffect(() => {
    const email = getCurrentUserEmail();
    if (email) {
      setCurrentUserEmail(email);
    }
  }, []);

  const fetchWalletData = React.useCallback(async () => {
    if (currentUserEmail) {
        setIsLoading(true);
        const [addresses, wallet] = await Promise.all([
          getWithdrawalAddresses(currentUserEmail),
          getOrCreateWallet(currentUserEmail),
        ]);
        setSavedAddresses(addresses);
        setWalletData(wallet);
        setIsLoading(false);
      }
  }, [currentUserEmail]);

  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleSaveAddress = async () => {
    if (!currentAddress) {
      toast({
        title: "Address is required",
        description: "Please enter a valid wallet address.",
        variant: "destructive",
      });
      return;
    }
    if (!currentUserEmail) return;

    setIsSaving(true);
    await saveWithdrawalAddress(currentUserEmail, asset, currentAddress);
    const updatedAddresses = await getWithdrawalAddresses(currentUserEmail);
    setSavedAddresses(updatedAddresses);
    setIsSaving(false);
    toast({ title: "Address Saved", description: "Your withdrawal address has been saved." });
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (!walletData || !currentUserEmail || !savedAddresses?.usdt) return;

    if (!amount || withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }
    
    if (withdrawAmount > walletData.balances.usdt) {
      toast({
        title: "Insufficient Balance",
        description: `Your USDT balance is too low to withdraw $${withdrawAmount.toFixed(2)}.`,
        variant: "destructive",
      });
      return;
    }

    if (!withdrawalPasscode) {
      toast({
        title: "Passcode Required",
        description: "Please enter your 4-digit withdrawal passcode.",
        variant: "destructive",
      });
      return;
    }

    setIsWithdrawing(true);

    const isPasscodeCorrect = await verifyWithdrawalPasscode(currentUserEmail, withdrawalPasscode);

    if (!isPasscodeCorrect) {
        toast({
            title: "Incorrect Passcode",
            description: "The withdrawal passcode you entered is incorrect.",
            variant: "destructive",
        });
        setIsWithdrawing(false);
        return;
    }

    const withdrawalRequest = {
        id: `wd_${Date.now()}`,
        amount: withdrawAmount,
        asset: 'usdt' as const,
        address: savedAddresses.usdt,
        timestamp: Date.now()
    };

    const newWalletData: WalletData = {
        ...walletData,
        balances: {
            ...walletData.balances,
            usdt: walletData.balances.usdt - withdrawAmount,
        },
        pendingWithdrawals: [...(walletData.pendingWithdrawals || []), withdrawalRequest]
    };

    await updateWallet(currentUserEmail, newWalletData);
    setWalletData(newWalletData);

    const username = walletData?.profile.username || currentUserEmail;
    await sendSystemNotification(
      currentUserEmail,
      `User '${username}' (${currentUserEmail}) initiated a withdrawal of ${amount} ${asset.toUpperCase()} to address ${savedAddresses.usdt}.`
    );
    await addNotification(currentUserEmail, {
      title: "Withdrawal Request Received",
      content: `Your request to withdraw $${amount} USDT is now pending review.`,
      href: "/dashboard/withdraw"
    });

    setAmount("");
    setWithdrawalPasscode("");
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal of ${withdrawAmount.toFixed(2)} ${asset.toUpperCase()} is being processed.`,
    });
    setIsWithdrawing(false);
  };

  const hasSavedAddress = savedAddresses && savedAddresses[asset as keyof WithdrawalAddresses];
  const hasWithdrawalPasscode = walletData?.security.withdrawalPasscode;
  const pendingWithdrawals = walletData?.pendingWithdrawals || [];
  
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
    
    if (!hasWithdrawalPasscode) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Withdrawal Passcode Required</AlertTitle>
                <AlertDescription>
                    For your security, you must create a 4-digit withdrawal passcode before you can make any withdrawals.
                    <Button asChild variant="link" className="p-0 h-auto ml-1">
                        <Link href="/dashboard/security">Go to Security Settings</Link>
                    </Button>
                </AlertDescription>
            </Alert>
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
            <div className="space-y-2">
            <Label htmlFor="amount">Amount to Withdraw (Available: ${walletData?.balances.usdt.toFixed(2)})</Label>
            <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isWithdrawing}
            />
            </div>
            <div className="space-y-2">
                <Label htmlFor="withdrawal-passcode">Withdrawal Passcode</Label>
                <Input
                    id="withdrawal-passcode"
                    type="password"
                    placeholder="••••"
                    value={withdrawalPasscode}
                    onChange={(e) => setWithdrawalPasscode(e.target.value)}
                    disabled={isWithdrawing}
                    maxLength={4}
                    inputMode="numeric"
                />
            </div>
            <Button type="submit" disabled={isWithdrawing || !amount} className="w-full">
            {isWithdrawing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Withdraw {amount || ""}{" "}
            {amount ? asset.toUpperCase() : ""}
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
                  For security, once an address is saved, you must contact
                  support to change it.
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
