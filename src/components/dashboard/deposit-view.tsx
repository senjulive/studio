"use client";

import * as React from "react";
import { Copy, Info, QrCode, Wallet } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { getSiteSettings } from "@/lib/site-settings";
import { Skeleton } from "../ui/skeleton";

export function DepositView() {
  const { toast } = useToast();
  const [depositAddress, setDepositAddress] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAddress() {
      setIsLoading(true);
      const settings = await getSiteSettings();
      setDepositAddress(settings.usdtDepositAddress);
      setIsLoading(false);
    }
    fetchAddress();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      toast({ title: "Address copied to clipboard!" });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard.",
        variant: "destructive",
      });
    }
  };
  
  const DepositAddressSkeleton = () => (
    <div className="space-y-6">
      <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg bg-muted">
        <QrCode className="h-16 w-16 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span>Deposit USDT (TRC20)</span>
        </CardTitle>
        <CardDescription>
          Send USDT to the address below to fund your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 text-center">
            {isLoading ? <DepositAddressSkeleton /> : (
                <>
                  <div className="rounded-lg bg-white p-4">
                    <QRCodeSVG value={depositAddress} size={176} />
                  </div>
                  <div className="w-full space-y-2 text-left">
                    <Label htmlFor="deposit-address">Platform Deposit Address</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="deposit-address"
                        value={depositAddress}
                        readOnly
                        className="font-mono text-base"
                      />
                      <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy address">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
            )}

            <Alert className="mt-6 w-full text-left bg-muted/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Instructions</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                        <li>Only send <strong>USDT</strong> on the <strong>TRC20 (Tron)</strong> network to this address.</li>
                        <li>Sending any other asset or using a different network will result in the permanent loss of your funds.</li>
                        <li>Deposits are typically credited by an administrator after verification. Please contact support if you have any questions.</li>
                        <li>The deposit address can be changed by the administrator at any time. Always verify the address here before sending funds.</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
