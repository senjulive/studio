"use client";

import * as React from "react";
import { Copy, Info, QrCode, Wallet, User } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { getCurrentUserEmail } from "@/lib/auth";

// A reusable component for displaying a deposit address
const DepositAddressDisplay = ({
  address,
  isLoading,
}: {
  address: string;
  isLoading: boolean;
}) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
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
  
  if (isLoading) {
    return <DepositAddressSkeleton />;
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-lg bg-white p-4">
        <QRCodeSVG value={address} size={176} />
      </div>
      <div className="w-full space-y-2 text-left">
        <Label htmlFor={`deposit-address-${address}`}>Deposit Address</Label>
        <div className="flex items-center gap-2">
          <Input
            id={`deposit-address-${address}`}
            value={address}
            readOnly
            className="font-mono text-base"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy address"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export function DepositView() {
  const [globalDepositAddress, setGlobalDepositAddress] = React.useState<string>("");
  const [personalDepositAddress, setPersonalDepositAddress] = React.useState<string>("");
  const [isLoadingGlobal, setIsLoadingGlobal] = React.useState(true);
  const [isLoadingPersonal, setIsLoadingPersonal] = React.useState(true);
  
  const userEmail = getCurrentUserEmail();

  React.useEffect(() => {
    async function fetchAddresses() {
      setIsLoadingGlobal(true);
      const settings = await getSiteSettings();
      setGlobalDepositAddress(settings.usdtDepositAddress);
      setIsLoadingGlobal(false);

      if (userEmail) {
        setIsLoadingPersonal(true);
        const wallet = await getOrCreateWallet(userEmail);
        setPersonalDepositAddress(wallet.addresses.usdt);
        setIsLoadingPersonal(false);
      } else {
        setIsLoadingPersonal(false);
      }
    }
    fetchAddresses();
  }, [userEmail]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span>Deposit USDT (TRC20)</span>
        </CardTitle>
        <CardDescription>
          Send USDT to one of the addresses below to fund your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="platform" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platform">
              <Wallet className="mr-2 h-4 w-4" />
              Platform Address
            </TabsTrigger>
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Personal Address
            </TabsTrigger>
          </TabsList>
          <TabsContent value="platform" className="mt-6">
            <DepositAddressDisplay
              address={globalDepositAddress}
              isLoading={isLoadingGlobal}
            />
             <Alert className="mt-6 w-full text-left bg-muted/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Instructions</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                        <li>This is a shared platform deposit address.</li>
                        <li>Only send <strong>USDT</strong> on the <strong>TRC20 (Tron)</strong> network to this address.</li>
                        <li>Sending any other asset or using a different network will result in the permanent loss of your funds.</li>
                        <li>Deposits are typically credited by an administrator after verification. Please contact support if you have any questions.</li>
                    </ul>
                </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="personal" className="mt-6">
            <DepositAddressDisplay
              address={personalDepositAddress}
              isLoading={isLoadingPersonal}
            />
             <Alert className="mt-6 w-full text-left bg-muted/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Instructions</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                        <li>This is your unique, personal deposit address.</li>
                        <li>Only send <strong>USDT</strong> on the <strong>TRC20 (Tron)</strong> network to this address.</li>
                        <li>Funds sent to this address will be automatically credited to your account.</li>
                        <li>Using this address may result in faster deposit confirmation times.</li>
                    </ul>
                </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
