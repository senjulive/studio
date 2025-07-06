"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, MinusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateWallet, updateWallet, type WalletData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";

const adminPanelSchema = z.object({
  asset: z.enum(["usdt", "eth"]),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
});

type AdminPanelFormValues = z.infer<typeof adminPanelSchema>;

export function AdminPanel() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchWallet() {
      const data = await getOrCreateWallet();
      setWalletData(data);
    }
    fetchWallet();
  }, []);

  const form = useForm<AdminPanelFormValues>({
    resolver: zodResolver(adminPanelSchema),
    defaultValues: {
      asset: "usdt",
      amount: 0,
    },
  });

  const handleBalanceUpdate = async (values: AdminPanelFormValues, action: "add" | "remove") => {
    if (!walletData) {
        toast({ title: "Error", description: "Wallet data not loaded.", variant: "destructive" });
        return;
    }
    
    setIsLoading(true);

    const newBalances = { ...walletData.balances };
    const amount = action === 'add' ? values.amount : -values.amount;

    if (values.asset === 'usdt') {
        newBalances.usdt += amount;
    } else {
        newBalances.eth += amount;
    }

    if (newBalances.usdt < 0 || newBalances.eth < 0) {
        toast({ title: "Invalid Operation", description: "Balance cannot be negative.", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    
    const newWalletData: WalletData = {
      ...walletData,
      balances: newBalances,
    };

    await updateWallet(newWalletData);
    setWalletData(newWalletData);

    toast({
      title: "Balance Updated",
      description: `Successfully ${action}ed ${values.amount} ${values.asset.toUpperCase()}.`,
    });
    
    form.reset({ asset: values.asset, amount: 0 });
    setIsLoading(false);
  };
  
  const onSubmitAdd = (values: AdminPanelFormValues) => handleBalanceUpdate(values, 'add');
  const onSubmitRemove = (values: AdminPanelFormValues) => handleBalanceUpdate(values, 'remove');

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Administrator Panel</CardTitle>
        <CardDescription>
          Add or remove balance from the user's virtual wallet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {walletData ? (
            <div className="mb-6 grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Current USDT Balance</p>
                    <p className="text-2xl font-bold">${walletData.balances.usdt.toFixed(2)}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Current ETH Balance</p>
                    <p className="text-2xl font-bold">{walletData.balances.eth.toFixed(4)} ETH</p>
                </div>
            </div>
        ) : (
            <div className="mb-6 grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        )}

        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="asset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usdt">USDT</SelectItem>
                      <SelectItem value="eth">ETH</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
                <Button
                  onClick={form.handleSubmit(onSubmitAdd)}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <PlusCircle />}
                  Add Balance
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmitRemove)}
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <MinusCircle />}
                  Remove Balance
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
