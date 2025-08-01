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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Send, Wallet, AlertCircle, CheckCircle, Clock, Shield, ArrowUpRight, TrendingUp, Zap, Calculator } from "lucide-react";
import { withdrawRequestSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";

type WithdrawFormValues = z.infer<typeof withdrawRequestSchema>;

const cryptoAssets = [
  {
    symbol: "USDT",
    name: "Tether",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    networks: [
      { name: "TRC20 (TRON)", minWithdraw: 10 },
      { name: "ERC20 (Ethereum)", minWithdraw: 20 },
      { name: "BEP20 (BSC)", minWithdraw: 10 }
    ]
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    networks: [
      { name: "Bitcoin Network", minWithdraw: 0.001 }
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    networks: [
      { name: "ERC20 (Ethereum)", minWithdraw: 0.01 }
    ]
  }
];

const pendingWithdrawals = [
  {
    id: "with_001",
    amount: 500,
    currency: "USDT",
    network: "TRC20 (TRON)",
    walletAddress: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMkx",
    status: "pending",
    timestamp: "2024-01-15T14:30:00Z"
  },
  {
    id: "with_002",
    amount: 0.1,
    currency: "BTC",
    network: "Bitcoin Network",
    walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    status: "completed",
    timestamp: "2024-01-14T09:15:00Z",
    fee: "0.0005 BTC"
  }
];

export function WithdrawView() {
  const { wallet } = useUser();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = React.useState(cryptoAssets[0]);
  const [selectedNetwork, setSelectedNetwork] = React.useState(0);
  const [isConfirming, setIsConfirming] = React.useState(false);

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawRequestSchema),
    defaultValues: {
      amount: 0,
      currency: "USDT",
      walletAddress: "",
      network: "",
    },
  });

  const watchedAmount = form.watch("amount");
  const currentNetwork = selectedAsset.networks[selectedNetwork];
  const balances = wallet?.balances as any;
  const availableBalance = balances?.[selectedAsset.symbol.toLowerCase()] || 0;
  const feeAmount = currentNetwork.fee.includes("USDT") ? parseFloat(currentNetwork.fee) : 0;
  const netAmount = Math.max(0, watchedAmount - feeAmount);

  const onSubmit = async (values: WithdrawFormValues) => {
    if (values.amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this withdrawal.",
        variant: "destructive"
      });
      return;
    }

    if (values.amount < currentNetwork.minWithdraw) {
      toast({
        title: "Minimum Amount Required",
        description: `Minimum withdrawal amount is ${currentNetwork.minWithdraw} ${selectedAsset.symbol}`,
        variant: "destructive"
      });
      return;
    }

    setIsConfirming(true);
  };

  const confirmWithdrawal = async () => {
    try {
      const withdrawalData = {
        ...form.getValues(),
        currency: selectedAsset.symbol,
        network: currentNetwork.name,
        fee: currentNetwork.fee,
        netAmount
      };
      
      console.log("Withdrawal request:", withdrawalData);
      
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and will be processed within 24 hours.",
      });

      form.reset();
      setIsConfirming(false);
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive"
      });
      setIsConfirming(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = Math.max(0, availableBalance - feeAmount);
    form.setValue("amount", maxAmount);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-red-500/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/20 rounded-full">
                  <ArrowUpRight className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Withdraw Funds</h1>
                  <p className="text-muted-foreground">Transfer your earnings to your personal wallet</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Transfer
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                  <Clock className="h-3 w-3 mr-1" />
                  24h Processing
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Low Fees
                </Badge>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">
                ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">Available Balance</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="withdraw" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1">
          <TabsTrigger value="withdraw" className="flex items-center gap-2 text-xs sm:text-sm">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Make Withdrawal</span>
            <span className="sm:hidden">Withdraw</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdraw" className="space-y-6">
          {/* Available Balances */}
          <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Available Balances
              </CardTitle>
              <CardDescription>Your cryptocurrency holdings ready for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {cryptoAssets.map((asset) => {
                  const balance = balances?.[asset.symbol.toLowerCase()] || 0;
                  return (
                    <div key={asset.symbol} className="group relative overflow-hidden rounded-xl border p-4 hover:border-primary/50 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10">
                            <Image
                              src={asset.iconUrl}
                              alt={asset.symbol}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{asset.name}</p>
                            <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            {balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: asset.symbol === 'USDT' ? 2 : 6
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Asset & Network Selection */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Asset & Network
                </CardTitle>
                <CardDescription>Select cryptocurrency and blockchain network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Choose Asset</label>
                  <div className="grid gap-2">
                    {cryptoAssets.map((asset) => (
                      <button
                        key={asset.symbol}
                        onClick={() => {
                          setSelectedAsset(asset);
                          setSelectedNetwork(0);
                          form.setValue("currency", asset.symbol as any);
                        }}
                        className={cn(
                          "flex items-center gap-3 p-3 border rounded-lg text-left transition-colors",
                          selectedAsset.symbol === asset.symbol
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        )}
                      >
                        <Image
                          src={asset.iconUrl}
                          alt={asset.symbol}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="font-medium text-foreground">{asset.symbol}</span>
                        {selectedAsset.symbol === asset.symbol && (
                          <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Choose Network</label>
                  <div className="grid gap-2">
                    {selectedAsset.networks.map((network, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedNetwork(index);
                          form.setValue("network", network.name);
                        }}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg text-left transition-colors",
                          selectedNetwork === index
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-accent/50"
                        )}
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{network.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Fee: {network.fee} • Min: {network.minWithdraw} {selectedAsset.symbol}
                          </p>
                        </div>
                        {selectedNetwork === index && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Form */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Withdrawal Details
                </CardTitle>
                <CardDescription>Enter amount and destination wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Wallet Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${selectedAsset.symbol} wallet address`}
                              {...field}
                              className="font-mono bg-background/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Withdrawal Amount</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  step="0.000001"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  className="bg-background/50"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={setMaxAmount}
                                  disabled={availableBalance <= feeAmount}
                                  className="border-primary/30 hover:bg-primary/10"
                                >
                                  Max
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Available: {availableBalance.toFixed(6)} {selectedAsset.symbol}
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fee Calculation */}
                    {watchedAmount > 0 && (
                      <div className="p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Calculator className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">Fee Breakdown</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Withdrawal Amount:</span>
                            <span className="font-medium text-foreground">{watchedAmount} {selectedAsset.symbol}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Network Fee:</span>
                            <span className="font-medium text-red-400">-{currentNetwork.fee}</span>
                          </div>
                          <div className="border-t border-primary/20 pt-2 flex justify-between">
                            <span className="font-medium text-foreground">You Will Receive:</span>
                            <span className="font-bold text-primary">{netAmount.toFixed(6)} {selectedAsset.symbol}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-3"
                          disabled={availableBalance === 0 || watchedAmount <= 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Request Withdrawal
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="space-y-4">
                              <p>Please verify your withdrawal details:</p>
                              <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 rounded-lg">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Asset:</span>
                                  <span className="font-medium text-foreground">{selectedAsset.symbol}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Network:</span>
                                  <span className="font-medium text-foreground">{currentNetwork.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Address:</span>
                                  <span className="font-mono text-xs break-all text-foreground">
                                    {form.getValues("walletAddress")}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Amount:</span>
                                  <span className="font-medium text-foreground">{watchedAmount} {selectedAsset.symbol}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Fee:</span>
                                  <span className="font-medium text-red-400">{currentNetwork.fee}</span>
                                </div>
                                <div className="flex justify-between border-t border-primary/20 pt-2">
                                  <span className="font-medium text-foreground">Net Amount:</span>
                                  <span className="font-bold text-primary">{netAmount.toFixed(6)} {selectedAsset.symbol}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                  This action cannot be undone. Please double-check the wallet address.
                                </p>
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmWithdrawal} className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700">
                            Confirm Withdrawal
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Security Information */}
          <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Security & Processing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Processing Time
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Withdrawals are processed within 24 hours during business days.
                    Large amounts may require additional KYC verification.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Security Measures
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All withdrawals are reviewed by our security team to ensure 
                    the safety of your funds. Email confirmation is required.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Withdrawal History
              </CardTitle>
              <CardDescription>
                Track all your withdrawal transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="group relative overflow-hidden rounded-xl border p-4 hover:border-primary/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10">
                          <Image
                            src={cryptoAssets.find(a => a.symbol === withdrawal.currency)?.iconUrl || ""}
                            alt={withdrawal.currency}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            {withdrawal.amount} {withdrawal.currency}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {withdrawal.network} • {new Date(withdrawal.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            To: {withdrawal.walletAddress.slice(0, 20)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge
                          variant={
                            withdrawal.status === "completed" ? "default" :
                            withdrawal.status === "pending" ? "secondary" : "destructive"
                          }
                          className={cn(
                            "font-medium",
                            withdrawal.status === "completed" && "bg-green-500/10 border-green-500/20 text-green-400"
                          )}
                        >
                          {withdrawal.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {withdrawal.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Fee: {withdrawal.fee}
                        </p>
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
