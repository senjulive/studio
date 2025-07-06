"use client";

import * as React from "react";
import { Info, Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  getWithdrawalAddresses,
  saveWithdrawalAddress,
  type WithdrawalAddresses,
} from "@/lib/wallet";
import { getCurrentUserEmail } from "@/lib/auth";
import { sendSystemNotification } from "@/lib/chat";
import { addNotification } from "@/lib/notifications";

export function WithdrawView() {
  const { toast } = useToast();
  const [savedAddresses, setSavedAddresses] =
    React.useState<WithdrawalAddresses | null>(null);
  const [currentAddress, setCurrentAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
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

  React.useEffect(() => {
    async function fetchAddresses() {
      if (currentUserEmail) {
        setIsLoading(true);
        const addresses = await getWithdrawalAddresses(currentUserEmail);
        setSavedAddresses(addresses);
        setIsLoading(false);
      }
    }
    fetchAddresses();
  }, [currentUserEmail]);

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
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }
    setIsWithdrawing(true);

    if (currentUserEmail) {
      await sendSystemNotification(
        currentUserEmail,
        `User initiated a withdrawal of ${amount} ${asset.toUpperCase()}.`
      );
      await addNotification(currentUserEmail, {
        title: "Withdrawal Request Received",
        content: `Your request to withdraw $${amount} USDT is now pending review.`,
        href: "/dashboard/withdraw"
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
    setAmount("");
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal of ${amount} ${asset.toUpperCase()} is being processed.`,
    });
  };

  const hasSavedAddress =
    savedAddresses && savedAddresses[asset as keyof WithdrawalAddresses];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Withdraw USDT (TRC20)</CardTitle>
        <CardDescription>
          Manage your withdrawal address and send funds to your external
          wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          ) : hasSavedAddress ? (
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
                <Label htmlFor="amount">Amount to Withdraw</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isWithdrawing}
                />
              </div>
              <Button type="submit" disabled={isWithdrawing} className="w-full">
                {isWithdrawing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Withdraw {amount || ""}{" "}
                {amount ? asset.toUpperCase() : ""}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have not set a withdrawal address for{" "}
                {asset.toUpperCase()}. Please add one to continue.
              </p>
              <div className="space-y-2">
                <Label htmlFor="new-address">
                  New {asset.toUpperCase()} Withdrawal Address
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
          )}

          <Alert className="mt-4 text-left bg-muted/30">
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
  );
}
