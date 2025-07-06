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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  getWithdrawalAddresses,
  saveWithdrawalAddress,
  type WithdrawalAddresses,
} from "@/lib/wallet";
import { getCurrentUserEmail } from "@/lib/auth";

export function WithdrawView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("usdt");
  const [savedAddresses, setSavedAddresses] =
    React.useState<WithdrawalAddresses | null>(null);
  const [currentAddress, setCurrentAddress] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  
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
    await saveWithdrawalAddress(currentUserEmail, activeTab, currentAddress);
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
    setAmount("");
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal of ${amount} ${activeTab.toUpperCase()} is being processed.`,
    });
  };

  const hasSavedAddress =
    savedAddresses && savedAddresses[activeTab as keyof WithdrawalAddresses];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Withdraw Crypto</CardTitle>
        <CardDescription>
          Manage your withdrawal addresses and send funds to your external
          wallets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="usdt"
          className="mb-4"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usdt">USDT (TRC20)</TabsTrigger>
            <TabsTrigger value="eth">ETH (ERC20)</TabsTrigger>
          </TabsList>
        </Tabs>

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
                <Label>Your Saved {activeTab.toUpperCase()} Address</Label>
                <Input
                  value={
                    savedAddresses?.[activeTab as keyof WithdrawalAddresses] || ""
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
                />
              </div>
              <Button type="submit" disabled={isWithdrawing} className="w-full">
                {isWithdrawing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Withdraw {amount || ""}{" "}
                {amount ? activeTab.toUpperCase() : ""}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You have not set a withdrawal address for{" "}
                {activeTab.toUpperCase()}. Please add one to continue.
              </p>
              <div className="space-y-2">
                <Label htmlFor="new-address">
                  New {activeTab.toUpperCase()} Withdrawal Address
                </Label>
                <Input
                  id="new-address"
                  placeholder="Enter your external wallet address"
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
                  <strong>{activeTab === "usdt" ? "TRC20" : "ERC20"}</strong>{" "}
                  network.
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
