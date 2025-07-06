"use client";

import * as React from "react";
import { Copy, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { getCurrentUserEmail } from "@/lib/auth";

export function DepositView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("usdt");
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);

  React.useEffect(() => {
    const email = getCurrentUserEmail();
    if (email) {
      async function fetchWallet() {
        const data = await getOrCreateWallet(email);
        setWalletData(data);
      }
      fetchWallet();
    }
  }, []);

  const handleCopy = async (text: string) => {
    if (!text) return;
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

  const currentWalletAddress = walletData
    ? activeTab === "usdt"
      ? walletData.addresses.usdt
      : walletData.addresses.eth
    : "";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Deposit Crypto</CardTitle>
        <CardDescription>
          Select an asset and send it to your unique wallet address below.
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

        <div className="flex flex-col items-center gap-4 py-4 text-center">
          {currentWalletAddress ? (
            <QRCodeSVG
              value={currentWalletAddress}
              size={180}
              fgColor="hsl(var(--foreground))"
              bgColor="transparent"
            />
          ) : (
            <Skeleton className="h-[180px] w-[180px] rounded-md" />
          )}
          <div className="grid w-full max-w-md items-center gap-1.5">
            <Label htmlFor="deposit-address">Your {activeTab.toUpperCase()} Address</Label>
            <div className="flex items-center gap-2">
              {currentWalletAddress ? (
                <Input
                  id="deposit-address"
                  value={currentWalletAddress}
                  readOnly
                  className="text-center"
                />
              ) : (
                <Skeleton className="h-10 w-full" />
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(currentWalletAddress)}
                disabled={!currentWalletAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Alert className="mt-4 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>Please Note</AlertTitle>
            <AlertDescription>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  Only send{" "}
                  <strong>
                    {activeTab.toUpperCase()} (
                    {activeTab === "usdt" ? "TRC20" : "ERC20"})
                  </strong>{" "}
                  to this address. Sending any other asset may result in permanent loss.
                </li>
                <li>
                  Your deposit will arrive in <strong>5-30 minutes</strong>, depending on network congestion.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
