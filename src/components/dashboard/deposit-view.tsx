
"use client";

import * as React from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { BtcLogoIcon } from "../icons/btc-logo";
import { EthLogoIcon } from "../icons/eth-logo";
import { UsdtLogoIcon } from "../icons/usdt-logo";

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
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [amount, setAmount] = React.useState("");
  const [selectedAsset, setSelectedAsset] = React.useState("usdt");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (userEmail) {
      getOrCreateWallet(userEmail).then(setWallet);
    }
  }, [userEmail]);

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
      const username = wallet?.profile.username || userEmail;
      await sendSystemNotification(
        userEmail,
        `User '${username}' (${userEmail}) has initiated a deposit request for ${parseFloat(amount).toFixed(2)} ${selectedAsset.toUpperCase()}. Please verify payment and credit their account manually via the Wallet Management tab.`
      );

      await addNotification(userEmail, {
        title: "Deposit Request Submitted",
        content: `Your request to deposit ${parseFloat(amount).toFixed(2)} ${selectedAsset.toUpperCase()} has been received and is pending approval.`,
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
  
  const assets = [
    { id: "usdt", name: "USDT", icon: UsdtLogoIcon },
    { id: "eth", name: "ETH", icon: EthLogoIcon },
    { id: "btc", name: "BTC", icon: BtcLogoIcon },
  ];

  return (
    <form onSubmit={handleDepositRequest} className="space-y-6">
        <div className="space-y-4">
            <Label className="block text-center text-sm font-medium text-muted-foreground">Select Asset</Label>
            <RadioGroup onValueChange={setSelectedAsset} value={selectedAsset} className="flex justify-center gap-4">
                {assets.map(asset => (
                    <Label key={asset.id} htmlFor={asset.id} className="cursor-pointer rounded-full border-2 p-1 transition-all hover:border-primary/50 has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary/20">
                        <RadioGroupItem value={asset.id} id={asset.id} className="sr-only" />
                        <asset.icon className="h-10 w-10" />
                    </Label>
                ))}
            </RadioGroup>
        </div>
      <div className="space-y-2">
        <Label htmlFor="deposit-amount">Amount to Deposit ({selectedAsset.toUpperCase()})</Label>
        <Input 
          id="deposit-amount"
          type="number"
          placeholder="e.g., 500.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isSubmitting || !wallet}
          min="0"
          step="0.01"
        />
      </div>
      <Button type="submit" disabled={isSubmitting || !amount || !wallet} className="w-full">
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
          <span>Deposit</span>
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
                    <TabsTrigger value="usdt" className="gap-2">
                        <UsdtLogoIcon />
                        USDT
                    </TabsTrigger>
                    <TabsTrigger value="eth" className="gap-2">
                        <EthLogoIcon />
                        ETH
                    </TabsTrigger>
                    <TabsTrigger value="btc" className="gap-2">
                        <BtcLogoIcon />
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
             <Alert className="mt-6 w-full text-left">
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
             <Alert className="mt-6 w-full text-left">
                <Info className="h-4 w-4" />
                <AlertTitle>How It Works</AlertTitle>
                <AlertDescription>
                    <ul className="list-inside list-disc space-y-1">
                        <li>Select the asset, enter the amount you wish to deposit, and submit the request.</li>
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
