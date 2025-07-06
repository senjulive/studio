"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, MinusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { getAllWallets, updateWallet, type WalletData } from "@/lib/wallet";
import { sendAdminMessage } from "@/lib/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { addNotification } from "@/lib/notifications";

const adminPanelSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
});

type AdminPanelFormValues = z.infer<typeof adminPanelSchema>;

export function WalletManager() {
  const { toast } = useToast();
  const [allWallets, setAllWallets] = React.useState<Record<string, WalletData> | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingWallets, setIsFetchingWallets] = React.useState(true);

  const refetchWallets = React.useCallback(async () => {
      setIsFetchingWallets(true);
      const data = await getAllWallets();
      setAllWallets(data);
      setIsFetchingWallets(false);
  }, []);

  React.useEffect(() => {
    refetchWallets();
  }, [refetchWallets]);

  const form = useForm<AdminPanelFormValues>({
    resolver: zodResolver(adminPanelSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const selectedWalletData = selectedUserEmail && allWallets ? allWallets[selectedUserEmail] : null;

  const handleBalanceUpdate = async (values: AdminPanelFormValues, action: "add" | "remove") => {
    if (!selectedWalletData || !selectedUserEmail) {
        toast({ title: "Error", description: "Please select a user.", variant: "destructive" });
        return;
    }
    
    setIsLoading(true);

    const newBalances = { ...selectedWalletData.balances };
    const amount = action === 'add' ? values.amount : -values.amount;
    const asset = "usdt";

    newBalances.usdt += amount;

    if (newBalances.usdt < 0) {
        toast({ title: "Invalid Operation", description: "Balance cannot be negative.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    if (action === 'add') {
      await sendAdminMessage(
        selectedUserEmail,
        `Deposit received: ${values.amount.toFixed(2)} ${asset.toUpperCase()} has been credited to your account.`
      );
      await addNotification(selectedUserEmail, {
        title: "Deposit Approved",
        content: `Your balance has been credited with $${values.amount.toFixed(2)} USDT.`,
        href: "/dashboard"
      });
    }
    
    const newWalletData: WalletData = {
      ...selectedWalletData,
      balances: newBalances,
    };

    await updateWallet(selectedUserEmail, newWalletData);
    
    await refetchWallets();

    toast({
      title: "Balance Updated",
      description: `Successfully ${action}ed ${values.amount} ${asset.toUpperCase()} for ${selectedUserEmail}.`,
    });
    
    form.reset({ amount: 0 });
    setIsLoading(false);
  };
  
  const onSubmitAdd = (values: AdminPanelFormValues) => handleBalanceUpdate(values, 'add');
  const onSubmitRemove = (values: AdminPanelFormValues) => handleBalanceUpdate(values, 'remove');

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormItem>
          <FormLabel>Select User</FormLabel>
          <Select onValueChange={setSelectedUserEmail} value={selectedUserEmail} disabled={isFetchingWallets}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a user to manage..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {allWallets && Object.keys(allWallets).length > 0 ? (
                Object.keys(allWallets).map(email => (
                  <SelectItem key={email} value={email}>{email}</SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                    {isFetchingWallets ? 'Loading users...' : 'No users found.'}
                </div>
              )}
            </SelectContent>
          </Select>
        </FormItem>

        {selectedUserEmail && (
          isFetchingWallets ? (
            <div className="mb-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : selectedWalletData ? (
            <div className="mb-6 rounded-lg border bg-muted/30 p-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">USDT Balance</p>
                    <p className="text-2xl font-bold">${selectedWalletData.balances.usdt.toFixed(2)}</p>
                </div>
            </div>
          ) : null
        )}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (USDT)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} disabled={!selectedUserEmail || isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <Button
              onClick={form.handleSubmit(onSubmitAdd)}
              className="w-full"
              disabled={!selectedUserEmail || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <PlusCircle />}
              Add Balance
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmitRemove)}
              variant="destructive"
              className="w-full"
              disabled={!selectedUserEmail || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <MinusCircle />}
              Remove Balance
            </Button>
        </div>
      </form>
    </Form>
  );
}
