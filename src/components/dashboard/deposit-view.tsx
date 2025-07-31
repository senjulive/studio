'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Upload, Wallet, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { depositRequestSchema } from "@/lib/validators";

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
      // Here you would typically send the deposit request to your API
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Deposit Funds
          </CardTitle>
          <CardDescription>
            Add funds to your AstralCore account to start automated trading
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="deposit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposit">Make Deposit</TabsTrigger>
          <TabsTrigger value="history">Deposit History</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Asset Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Asset</CardTitle>
                <CardDescription>
                  Choose the cryptocurrency you want to deposit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {cryptoAssets.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setSelectedNetwork(0);
                        form.setValue("currency", asset.symbol as any);
                      }}
                      className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                        selectedAsset.symbol === asset.symbol
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Image
                        src={asset.iconUrl}
                        alt={asset.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                      </div>
                      {selectedAsset.symbol === asset.symbol && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Network</CardTitle>
                <CardDescription>
                  Choose the blockchain network for your deposit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {selectedAsset.networks.map((network, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedNetwork(index)}
                      className={`flex items-center justify-between p-3 border rounded-lg text-left transition-colors ${
                        selectedNetwork === index
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{network.name}</p>
                        <p className="text-sm text-muted-foreground">Fee: {network.fee}</p>
                      </div>
                      {selectedNetwork === index && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deposit Address */}
          <Card>
            <CardHeader>
              <CardTitle>Deposit Address</CardTitle>
              <CardDescription>
                Send {selectedAsset.symbol} to the address below using {currentNetwork.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deposit Address</label>
                    <div className="flex gap-2">
                      <Input
                        value={currentNetwork.address}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(currentNetwork.address)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Network</label>
                    <Input value={currentNetwork.name} readOnly />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Network Fee</label>
                    <Input value={currentNetwork.fee} readOnly />
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="p-4 bg-white rounded-lg">
                    <QRCodeSVG value={currentNetwork.address} size={150} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan QR code to copy address
                  </p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Important Notice
                    </p>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• Only send {selectedAsset.symbol} to this address</li>
                      <li>• Minimum deposit: $100 USD equivalent</li>
                      <li>• Deposits are processed after 1-3 network confirmations</li>
                      <li>• Wrong network deposits will result in permanent loss</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Confirmation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Deposit</CardTitle>
              <CardDescription>
                After sending funds, please fill out this form to speed up processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <Input value={selectedAsset.symbol} readOnly />
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
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="cursor-pointer"
                            />
                            {uploadedFile && (
                              <p className="text-sm text-green-600">
                                File uploaded: {uploadedFile.name}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Deposit Request
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deposit History</CardTitle>
              <CardDescription>
                View all your previous deposit transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDeposits.map((deposit) => (
                  <div key={deposit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Image
                        src={cryptoAssets.find(a => a.symbol === deposit.currency)?.iconUrl || ""}
                        alt={deposit.currency}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">
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
                      >
                        {deposit.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {deposit.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                      </Badge>
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
