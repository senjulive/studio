"use client";

import * as React from "react";
import Image from "next/image";
import { Copy, Info, QrCode, Wallet, User, Loader2 } from "lucide-react";
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
import { getCurrentUserEmail } from "@/lib/auth";
import { sendSystemNotification } from "@/lib/chat";
import { addNotification } from "@/lib/notifications";

const DepositAddressDisplay = ({
  address,
  isLoading,
  network,
  asset,
}: {
  address: string;
  isLoading: boolean;
  network: string;
  asset: string;
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
    <div className="space-y-6 pt-6">
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
    <div className="flex flex-col items-center gap-6 text-center pt-6">
      <div className="rounded-lg bg-white p-4">
        <QRCodeSVG value={address} size={176} />
      </div>
      <div className="w-full space-y-2 text-left">
        <Label htmlFor={`deposit-address-${address}`}>{asset} Deposit Address ({network})</Label>
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

const PersonalDepositRequest = () => {
  const { toast } = useToast();
  const userEmail = getCurrentUserEmail();
  const [amount, setAmount] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDepositRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !userEmail) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive amount to deposit.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendSystemNotification(
        userEmail,
        `User has initiated a deposit request for $${parseFloat(amount).toFixed(2)} USDT. Please verify payment and credit their account manually via the Wallet Management tab.`
      );

      await addNotification(userEmail, {
        title: "Deposit Request Submitted",
        content: `Your request to deposit $${parseFloat(amount).toFixed(2)} USDT has been received and is pending approval.`,
        href: "/dashboard/deposit",
      });
      
      toast({
        title: "Deposit Request Sent",
        description: "Your balance will be updated upon confirmation."
      });

      setAmount("");

    } catch (error) {
        toast({
            title: "Request Failed",
            description: "Could not submit your deposit request. Please try again later.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleDepositRequest} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deposit-amount">Amount to Deposit (USDT)</Label>
        <Input 
          id="deposit-amount"
          type="number"
          placeholder="e.g., 500.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting}
          min="0"
          step="0.01"
        />
      </div>
      <Button type="submit" disabled={isSubmitting || !amount} className="w-full">
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Submit Deposit Request
      </Button>
    </form>
  )
}

export function DepositView() {
  const [addresses, setAddresses] = React.useState({ usdt: '', eth: '', btc: ''});
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    async function fetchAddresses() {
      setIsLoading(true);
      const settings = await getSiteSettings();
      setAddresses({
        usdt: settings.usdtDepositAddress,
        eth: settings.ethDepositAddress,
        btc: settings.btcDepositAddress,
      });
      setIsLoading(false);
    }
    fetchAddresses();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span>Deposit Crypto</span>
        </CardTitle>
        <CardDescription>
          Choose a method below to fund your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">
              <Wallet className="mr-2 h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="personal">
              <User className="mr-2 h-4 w-4" />
              Confirm Request
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="mt-6">
            <Tabs defaultValue="usdt" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="usdt">
                        <Image src="https://assets.coincap.io/assets/icons/usdt@2x.png" alt="USDT logo" width={20} height={20} className="mr-2 rounded-full" />
                        USDT
                    </TabsTrigger>
                    <TabsTrigger value="eth">
                        <Image src="https://assets.coincap.io/assets/icons/eth@2x.png" alt="ETH logo" width={20} height={20} className="mr-2 rounded-full" />
                        ETH
                    </TabsTrigger>
                    <TabsTrigger value="btc">
                        <Image src="https://assets.coincap.io/assets/icons/btc@2x.png" alt="BTC logo" width={20} height={20} className="mr-2 rounded-full" />
                        BTC
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="usdt">
                    <DepositAddressDisplay
                    address={addresses.usdt}
                    isLoading={isLoading}
                    network="TRC20"
                    asset="USDT"
                    />
                </TabsContent>
                <TabsContent value="eth">
                    <DepositAddressDisplay
                    address={addresses.eth}
                    isLoading={isLoading}
                    network="ERC20"
                    asset="ETH"
                    />
                </TabsContent>
                <TabsContent value="btc">
                    <DepositAddressDisplay
                    address={addresses.btc}
                    isLoading={isLoading}
                    network="Bitcoin"
                    asset="BTC"
                    />
                </TabsContent>
            </Tabs>
             <Alert className="mt-6 w-full text-left bg-muted/30">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Instructions</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                        <li>Deposit to the address, then confirm your request.</li>
                        <li>Only send the correct asset to the corresponding address (e.g., USDT to the USDT address). Sending any other asset will result in the permanent loss of your funds.</li>
                    </ul>
                </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="personal" className="mt-6">
            <PersonalDepositRequest />
             <Alert className="mt-6 w-full text-left bg-muted/30">
                <Info className="h-4 w-4" />
                <AlertTitle>How It Works</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                        <li>Enter the amount of USDT you wish to deposit and submit the request.</li>
                        <li>Your funds will be credited to your account within 5-15 minutes of approval.</li>
                        <li>You can contact support if you have any questions about your deposit status.</li>
                    </ul>
                </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
