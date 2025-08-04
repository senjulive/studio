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
import { Send, Wallet, AlertCircle, CheckCircle, Clock, Shield } from "lucide-react";
import { withdrawRequestSchema } from "@/lib/validators";

type WithdrawFormValues = z.infer<typeof withdrawRequestSchema>;

const cryptoAssets = [
  {
    symbol: "USDT",
    name: "Tether",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    networks: [
      { name: "TRC20 (TRON)", fee: "1 USDT", minWithdraw: 10 },
      { name: "ERC20 (Ethereum)", fee: "5 USDT", minWithdraw: 20 },
      { name: "BEP20 (BSC)", fee: "1 USDT", minWithdraw: 10 }
    ]
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    networks: [
      { name: "Bitcoin Network", fee: "0.0005 BTC", minWithdraw: 0.001 }
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    networks: [
      { name: "ERC20 (Ethereum)", fee: "0.005 ETH", minWithdraw: 0.01 }
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
    timestamp: "2024-01-15T14:30:00Z",
    fee: "1 USDT"
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
      // Here you would typically send the withdrawal request to your API
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Withdraw Funds
          </CardTitle>
          <CardDescription>
            Withdraw your earnings to your personal cryptocurrency wallet
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="withdraw" className="space-y-4">
        <TabsList>
          <TabsTrigger value="withdraw">Make Withdrawal</TabsTrigger>
          <TabsTrigger value="history">Withdrawal History</TabsTrigger>
        </TabsList>

        <TabsContent value="withdraw" className="space-y-6">
          {/* Available Balances */}
          <Card>
            <CardHeader>
              <CardTitle>Available Balances</CardTitle>
              <CardDescription>
                Your current cryptocurrency balances available for withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {cryptoAssets.map((asset) => {
                  const balance = balances?.[asset.symbol.toLowerCase()] || 0;
                  return (
                    <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image
                          src={asset.iconUrl}
                          alt={asset.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {balance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: asset.symbol === 'USDT' ? 2 : 6
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Asset & Network Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Crypto Currencies & Network</CardTitle>
                <CardDescription>
                  Choose the cryptocurrency and blockchain network for withdrawal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Asset</label>
                  <div className="grid gap-2">
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
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="font-medium">{asset.symbol}</span>
                        {selectedAsset.symbol === asset.symbol && (
                          <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Network</label>
                  <div className="grid gap-2">
                    {selectedAsset.networks.map((network, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedNetwork(index);
                          form.setValue("network", network.name);
                        }}
                        className={`flex items-center justify-between p-3 border rounded-lg text-left transition-colors ${
                          selectedNetwork === index
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{network.name}</p>
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
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Details</CardTitle>
                <CardDescription>
                  Enter the amount and destination wallet address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wallet Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${selectedAsset.symbol} wallet address`}
                              {...field}
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
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  step="0.000001"
                                  placeholder="0.00"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={setMaxAmount}
                                  disabled={availableBalance <= feeAmount}
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

                    {/* Fee Breakdown */}
                    {watchedAmount > 0 && (
                      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Withdrawal Amount:</span>
                          <span>{watchedAmount} {selectedAsset.symbol}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Network Fee:</span>
                          <span>-{currentNetwork.fee}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>You Will Receive:</span>
                          <span>{netAmount.toFixed(6)} {selectedAsset.symbol}</span>
                        </div>
                      </div>
                    )}

                    <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={availableBalance === 0 || watchedAmount <= 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Request Withdrawal
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="space-y-4">
                              <p>Please verify your withdrawal details:</p>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Asset:</span>
                                  <span className="font-medium">{selectedAsset.symbol}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Network:</span>
                                  <span className="font-medium">{currentNetwork.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Address:</span>
                                  <span className="font-mono text-xs break-all">
                                    {form.getValues("walletAddress")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-medium">{watchedAmount} {selectedAsset.symbol}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Fee:</span>
                                  <span className="font-medium">{currentNetwork.fee}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                  <span>Net Amount:</span>
                                  <span className="font-bold">{netAmount.toFixed(6)} {selectedAsset.symbol}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                  This action cannot be undone. Please double-check the wallet address.
                                </p>
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmWithdrawal}>
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

          {/* Security Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Processing Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Withdrawals are processed within 24 hours during business days. 
                    Large amounts may require additional verification.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Security Measures</h4>
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
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                View all your previous withdrawal transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Image
                        src={cryptoAssets.find(a => a.symbol === withdrawal.currency)?.iconUrl || ""}
                        alt={withdrawal.currency}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">
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
                    <div className="text-right">
                      <Badge
                        variant={
                          withdrawal.status === "completed" ? "default" :
                          withdrawal.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {withdrawal.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {withdrawal.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fee: {withdrawal.fee}
                      </p>
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
