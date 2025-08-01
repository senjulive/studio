'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Upload, Wallet, AlertCircle, CheckCircle, Clock, TrendingUp, ArrowDownLeft, Shield, Zap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { depositRequestSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type DepositFormValues = z.infer<typeof depositRequestSchema>;

const cryptoAssets = [
  {
    symbol: "USDT",
    name: "Tether",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    networks: [
      { name: "TRC20 (TRON)", address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMkx", fee: "1 USDT" },
      { name: "ERC20 (Ethereum)", address: "0x742d35Cc6544A8E5D7C5B6E4b7b3f3", fee: "5 USDT" },
      { name: "BEP20 (BSC)", address: "0x742d35Cc6544A8E5D7C5B6E4b7b3f3", fee: "1 USDT" }
    ]
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    networks: [
      { name: "Bitcoin Network", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", fee: "0.0005 BTC" }
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    networks: [
      { name: "ERC20 (Ethereum)", address: "0x742d35Cc6544A8E5D7C5B6E4b7b3f3", fee: "0.005 ETH" }
    ]
  }
];

const pendingDeposits = [
  {
    id: "dep_001",
    amount: 100,
    currency: "USDT",
    network: "TRC20 (TRON)",
    transactionId: "a1b2c3d4e5f6g7h8i9j0",
    status: "pending",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "dep_002",
    amount: 0.05,
    currency: "BTC",
    network: "Bitcoin Network",
    transactionId: "z9y8x7w6v5u4t3s2r1q0",
    status: "confirmed",
    timestamp: "2024-01-14T15:45:00Z"
  }
];

export function DepositView() {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = React.useState(cryptoAssets[0]);
  const [selectedNetwork, setSelectedNetwork] = React.useState(0);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      amount: 0,
      currency: "USDT",
      transactionId: "",
      proofOfPayment: "",
    },
  });

  const onSubmit = async (values: DepositFormValues) => {
    try {
      console.log("Deposit request:", values);
      
      toast({
        title: "Deposit Request Submitted",
        description: "Your deposit request has been submitted and is being processed. You will receive confirmation once verified.",
      });

      form.reset();
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit deposit request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      form.setValue("proofOfPayment", file.name);
    }
  };

  const currentNetwork = selectedAsset.networks[selectedNetwork];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-full">
                  <ArrowDownLeft className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Fund Your Account</h1>
                  <p className="text-muted-foreground">Deposit cryptocurrency to start automated trading</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Bank-Level Security
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Zap className="h-3 w-3 mr-1" />
                  Instant Processing
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Start Trading Now
                </Badge>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">$100</div>
              <div className="text-sm text-muted-foreground">Minimum Deposit</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="deposit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1">
          <TabsTrigger value="deposit" className="flex items-center gap-2 text-xs sm:text-sm">
            <ArrowDownLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Make Deposit</span>
            <span className="sm:hidden">Deposit</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          {/* Asset Selection */}
          <Card className="overflow-hidden bg-gradient-to-br from-background to-background/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Choose Cryptocurrency
              </CardTitle>
              <CardDescription>Select the digital asset you want to deposit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {cryptoAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setSelectedNetwork(0);
                      form.setValue("currency", asset.symbol as any);
                    }}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 hover:shadow-lg",
                      selectedAsset.symbol === asset.symbol
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-4">
                      <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10">
                        <Image
                          src={asset.iconUrl}
                          alt={asset.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                      </div>
                      {selectedAsset.symbol === asset.symbol && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Selection */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Select Network
              </CardTitle>
              <CardDescription>Choose the blockchain network for your {selectedAsset.symbol} deposit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {selectedAsset.networks.map((network, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedNetwork(index)}
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-xl text-left transition-all duration-300",
                      selectedNetwork === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                    )}
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{network.name}</p>
                      <p className="text-sm text-muted-foreground">Network fee: {network.fee}</p>
                    </div>
                    {selectedNetwork === index && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deposit Address */}
          <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="h-5 w-5 text-primary" />
                Deposit Address
              </CardTitle>
              <CardDescription>
                Send {selectedAsset.symbol} to this address using {currentNetwork.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Wallet Address</label>
                    <div className="flex gap-2">
                      <Input
                        value={currentNetwork.address}
                        readOnly
                        className="font-mono text-sm bg-background/50"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(currentNetwork.address)}
                        className="border-primary/30 hover:bg-primary/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Network</label>
                      <Input value={currentNetwork.name} readOnly className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Fee</label>
                      <Input value={currentNetwork.fee} readOnly className="bg-background/50" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-xl shadow-lg">
                    <QRCodeSVG value={currentNetwork.address} size={150} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan QR code with your wallet app
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Important Notice</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Only send {selectedAsset.symbol} to this address</li>
                      <li>• Minimum deposit: $100 USD equivalent</li>
                      <li>• Deposits are processed after 1-3 confirmations</li>
                      <li>• Wrong network deposits will result in permanent loss</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Form */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Confirm Your Deposit
              </CardTitle>
              <CardDescription>
                Submit transaction details to speed up processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deposit Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              className="bg-background/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <FormControl>
                            <Input value={selectedAsset.symbol} readOnly className="bg-background/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction ID / Hash</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the transaction hash from your wallet"
                            {...field}
                            className="bg-background/50 font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proofOfPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proof of Payment (Optional)</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="cursor-pointer bg-background/50"
                            />
                            {uploadedFile && (
                              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <p className="text-sm text-green-400">
                                  File uploaded: {uploadedFile.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-primary-foreground font-semibold py-3">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Deposit Request
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Deposit History
              </CardTitle>
              <CardDescription>
                Track all your deposit transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDeposits.map((deposit) => (
                  <div key={deposit.id} className="group relative overflow-hidden rounded-xl border p-4 hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10">
                          <Image
                            src={cryptoAssets.find(a => a.symbol === deposit.currency)?.iconUrl || ""}
                            alt={deposit.currency}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            {deposit.amount} {deposit.currency}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {deposit.network} • {new Date(deposit.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {deposit.transactionId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            deposit.status === "confirmed" ? "default" :
                            deposit.status === "pending" ? "secondary" : "destructive"
                          }
                          className={cn(
                            "font-medium",
                            deposit.status === "confirmed" && "bg-green-500/10 border-green-500/20 text-green-400"
                          )}
                        >
                          {deposit.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {deposit.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
