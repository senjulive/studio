
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, MinusCircle, Save, User, CheckCircle, AlertTriangle, Search } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { WalletData } from "@/lib/wallet";
import { sendAdminMessage } from "@/lib/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { addNotification } from "@/lib/notifications";
import { Badge } from "../ui/badge";

type MappedWallet = WalletData & { user_id: string };

const userSearchSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
});

const balanceUpdateSchema = z.object({
  asset: z.enum(["usdt", "btc", "eth"], {
    required_error: "You need to select an asset.",
  }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
});

type UserSearchFormValues = z.infer<typeof userSearchSchema>;
type BalanceUpdateFormValues = z.infer<typeof balanceUpdateSchema>;

const formatBalance = (amount: number) => {
    if (amount === 0) return '0.00';
    if (amount > 0 && amount < 0.0001) return amount.toExponential(2);
    if (amount > 1000) return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
}

export function WalletManager() {
  const { toast } = useToast();
  const [selectedWalletData, setSelectedWalletData] = React.useState<MappedWallet | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isCompleting, setIsCompleting] = React.useState<string | null>(null);
  const [isFetchingUser, setIsFetchingUser] = React.useState(false);

  const searchForm = useForm<UserSearchFormValues>({
      resolver: zodResolver(userSearchSchema),
      defaultValues: { email: "" },
  });

  const balanceForm = useForm<BalanceUpdateFormValues>({
    resolver: zodResolver(balanceUpdateSchema),
    defaultValues: { amount: 0 },
  });

  const refetchWallet = React.useCallback(async (email: string) => {
      setIsFetchingUser(true);
      try {
          const response = await fetch('/api/admin/find-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          setSelectedWalletData(result);
      } catch (error: any) {
          toast({ title: "Error", description: `Could not fetch user: ${error.message}`, variant: "destructive" });
          setSelectedWalletData(null);
      } finally {
          setIsFetchingUser(false);
      }
  }, [toast]);

  const postAdminUpdate = React.useCallback(async (url: string, body: object) => {
    if (!selectedWalletData) return;
    setIsUpdating(true);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || 'API request failed');
        await refetchWallet(searchForm.getValues("email"));
        return result;
    } catch (error: any) {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsUpdating(false);
    }
  }, [refetchWallet, toast, selectedWalletData, searchForm]);

  React.useEffect(() => {
    balanceForm.reset({ amount: 0 });
  }, [selectedWalletData, balanceForm]);

  const handleUserSearch = async (values: UserSearchFormValues) => {
      await refetchWallet(values.email);
  };
  
  const handleBalanceUpdate = async (values: BalanceUpdateFormValues, action: "add" | "remove") => {
    if (!selectedWalletData) return;
    
    setIsUpdating(true);
    const { asset } = values;
    const newBalances = { ...selectedWalletData.balances };
    const amount = action === "add" ? values.amount : -values.amount;
    newBalances[asset] = (newBalances[asset] || 0) + amount;

    if (newBalances[asset] < 0) {
      toast({ title: "Invalid Operation", description: "Balance cannot be negative.", variant: "destructive" });
      setIsUpdating(false);
      return;
    }

    if (action === "add") {
      await sendAdminMessage(selectedWalletData.user_id, `Credit received: ${values.amount.toFixed(8)} ${asset.toUpperCase()} has been added to your account.`);
      await addNotification(selectedWalletData.user_id, { title: "AstralCore Deposit", content: `Your balance has been credited with ${values.amount} ${asset.toUpperCase()}.`, href: "/dashboard" });
    }

    const newWalletData: Partial<WalletData> = { balances: newBalances };
    await postAdminUpdate('/api/admin/update-wallet', { userId: selectedWalletData.user_id, newWalletData });

    toast({ title: "Balance Updated", description: `Successfully ${action}ed ${values.amount} ${asset.toUpperCase()} for ${selectedWalletData.user_id}.` });
    balanceForm.reset({ amount: 0 });
    setIsUpdating(false);
  };

  const onSubmitBalanceAdd = (values: BalanceUpdateFormValues) => handleBalanceUpdate(values, "add");
  const onSubmitBalanceRemove = (values: BalanceUpdateFormValues) => handleBalanceUpdate(values, "remove");

  const handleCompleteWithdrawal = async (withdrawalId: string) => {
    if (!selectedWalletData) return;
    setIsCompleting(withdrawalId);

    const withdrawal = selectedWalletData.pending_withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) {
        toast({ title: "Error", description: "Withdrawal not found.", variant: "destructive" });
        setIsCompleting(null);
        return;
    }

    const newWalletData: Partial<WalletData> = {
        pending_withdrawals: selectedWalletData.pending_withdrawals.filter(w => w.id !== withdrawalId),
    };

    await postAdminUpdate('/api/admin/update-wallet', { userId: selectedWalletData.user_id, newWalletData });
    await sendAdminMessage(selectedWalletData.user_id, `Your withdrawal of ${withdrawal.amount.toFixed(2)} USDT to ${withdrawal.address} has been completed.`);
    await addNotification(selectedWalletData.user_id, { title: "AstralCore Withdrawal", content: `Your withdrawal of $${withdrawal.amount.toFixed(2)} USDT has been successfully processed.`, href: "/dashboard/withdraw" });
    
    toast({ title: "Withdrawal Marked as Complete" });
    setIsCompleting(null);
  };

  const handleResetAddress = async () => {
    if (!selectedWalletData) return;
    await postAdminUpdate('/api/admin/reset-address', { userId: selectedWalletData.user_id });
    toast({ title: "Withdrawal Address Reset", description: `Successfully reset withdrawal address for ${selectedWalletData.user_id}.` });
  };


  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Find User Wallet</CardTitle>
          <CardDescription>Enter a user's email address to manage their wallet and balances.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(handleUserSearch)} className="flex items-start gap-4">
              <FormField
                control={searchForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">User Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} disabled={isFetchingUser} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isFetchingUser}>
                {isFetchingUser ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2"/>}
                Find User
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isFetchingUser && ( <Skeleton className="h-48 w-full" /> )}

      {selectedWalletData ? (
          <>
            <div className="mb-6 rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="border-b pb-4 flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> User Details</p>
                    <p className="text-lg font-bold">{selectedWalletData.profile.username || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{selectedWalletData.user_id}</p>
                </div>
                <Badge variant={selectedWalletData.verification_status === 'verified' ? 'default' : 'secondary'} className={selectedWalletData.verification_status === 'verified' ? 'bg-green-600' : ''}>
                    {selectedWalletData.verification_status}
                </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">USDT Balance</p>
                    <p className="text-xl font-bold">${formatBalance(selectedWalletData.balances.usdt)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">ETH Balance</p>
                    <p className="text-xl font-bold">{formatBalance(selectedWalletData.balances.eth)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">BTC Balance</p>
                    <p className="text-xl font-bold">{formatBalance(selectedWalletData.balances.btc)}</p>
                </div>
                </div>
            </div>

            {selectedWalletData.pending_withdrawals && selectedWalletData.pending_withdrawals.length > 0 && (
                <Card>
                    <CardHeader>
                    <CardTitle>Pending Withdrawals</CardTitle>
                    <CardDescription>Review and process pending withdrawal requests for this user.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount (USDT)</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {selectedWalletData.pending_withdrawals.map((w) => (
                            <TableRow key={w.id}>
                            <TableCell>{format(new Date(w.timestamp), "PPp")}</TableCell>
                            <TableCell className="font-mono">${w.amount.toFixed(2)}</TableCell>
                            <TableCell className="font-mono text-xs truncate max-w-xs">{w.address}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => handleCompleteWithdrawal(w.id)} disabled={isCompleting === w.id}>
                                {isCompleting === w.id ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<CheckCircle className="mr-2 h-4 w-4" />)}
                                Mark as Complete
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                <CardTitle>Update Balance</CardTitle>
                <CardDescription>Manually credit or debit a user's asset balance.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...balanceForm}>
                    <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                        control={balanceForm.control}
                        name="asset"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Asset</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isUpdating}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select asset" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="usdt">USDT</SelectItem>
                                <SelectItem value="btc">BTC</SelectItem>
                                <SelectItem value="eth">ETH</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={balanceForm.control}
                            name="amount"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="0.00" {...field} disabled={isUpdating} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={balanceForm.handleSubmit(onSubmitBalanceAdd)} className="w-full" disabled={isUpdating}>
                        {isUpdating ? (<Loader2 className="animate-spin" />) : (<PlusCircle />)}
                        Add Balance
                        </Button>
                        <Button onClick={balanceForm.handleSubmit(onSubmitBalanceRemove)} variant="destructive" className="w-full" disabled={isUpdating}>
                        {isUpdating ? (<Loader2 className="animate-spin" />) : (<MinusCircle />)}
                        Remove Balance
                        </Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                    This action is irreversible. Please proceed with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 items-start">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isUpdating}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Reset Withdrawal Address
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will delete the saved withdrawal address for{" "}
                                <span className="font-bold">{selectedWalletData?.profile.username || selectedWalletData.user_id}</span>.
                                The user will need to re-enter it. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetAddress} disabled={isUpdating} className="bg-destructive hover:bg-destructive/90">
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Reset
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </>
      ) : (
          <div className="text-center text-muted-foreground p-4 border border-dashed rounded-lg">
            Search for a user to begin managing their wallet.
          </div>
      )}

    </div>
  );
}
