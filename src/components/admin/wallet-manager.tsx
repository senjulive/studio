
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, MinusCircle, Save, User, CheckCircle, AlertTriangle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
import { getAllWallets, updateWallet, type WalletData, resetWithdrawalAddressForUser } from "@/lib/wallet";
import { sendAdminMessage } from "@/lib/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { addNotification } from "@/lib/notifications";

const addressUpdateSchema = z.object({
  usdtAddress: z.string().min(1, { message: "Address is required." }),
});

const balanceUpdateSchema = z.object({
  asset: z.enum(["usdt", "btc", "eth"], {
    required_error: "You need to select an asset.",
  }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
});

type AddressUpdateFormValues = z.infer<typeof addressUpdateSchema>;
type BalanceUpdateFormValues = z.infer<typeof balanceUpdateSchema>;

const formatBalance = (amount: number) => {
    if (amount === 0) return '0.00';
    if (amount > 0 && amount < 0.0001) return amount.toExponential(2);
    if (amount > 1000) return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
}


export function WalletManager() {
  const { toast } = useToast();
  const [allWallets, setAllWallets] = React.useState<Record<
    string,
    WalletData
  > | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = React.useState<string>("");
  const [isUpdatingAddress, setIsUpdatingAddress] = React.useState(false);
  const [isUpdatingBalance, setIsUpdatingBalance] = React.useState(false);
  const [isCompleting, setIsCompleting] = React.useState<string | null>(null);
  const [isFetchingWallets, setIsFetchingWallets] = React.useState(true);
  const [isResettingAddress, setIsResettingAddress] = React.useState(false);

  const addressForm = useForm<AddressUpdateFormValues>({
    resolver: zodResolver(addressUpdateSchema),
    defaultValues: { usdtAddress: "" },
  });

  const balanceForm = useForm<BalanceUpdateFormValues>({
    resolver: zodResolver(balanceUpdateSchema),
    defaultValues: { amount: 0 },
  });

  const refetchWallets = React.useCallback(async () => {
    setIsFetchingWallets(true);
    const data = await getAllWallets();
    setAllWallets(data);
    setIsFetchingWallets(false);
  }, []);

  React.useEffect(() => {
    refetchWallets();
  }, [refetchWallets]);

  const selectedWalletData =
    selectedUserEmail && allWallets ? allWallets[selectedUserEmail] : null;

  React.useEffect(() => {
    if (selectedWalletData) {
      addressForm.setValue("usdtAddress", selectedWalletData.addresses.usdt);
    } else {
      addressForm.reset({ usdtAddress: "" });
    }
    balanceForm.reset({ amount: 0 });
  }, [selectedUserEmail, selectedWalletData, addressForm, balanceForm]);

  const handleAddressUpdate = async (values: AddressUpdateFormValues) => {
    if (!selectedWalletData || !selectedUserEmail) return;

    setIsUpdatingAddress(true);
    const newWalletData: WalletData = {
      ...selectedWalletData,
      addresses: { ...selectedWalletData.addresses, usdt: values.usdtAddress },
    };

    await updateWallet(selectedUserEmail, newWalletData);
    await refetchWallets();
    toast({
      title: "Address Updated",
      description: `Successfully updated USDT address for ${selectedUserEmail}.`,
    });
    setIsUpdatingAddress(false);
  };

  const handleBalanceUpdate = async (
    values: BalanceUpdateFormValues,
    action: "add" | "remove"
  ) => {
    if (!selectedWalletData || !selectedUserEmail) {
      toast({
        title: "Error",
        description: "Please select a user.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingBalance(true);

    const { asset } = values;
    const newBalances = { ...selectedWalletData.balances };
    const amount = action === "add" ? values.amount : -values.amount;
    
    newBalances[asset] = (newBalances[asset] || 0) + amount;

    if (newBalances[asset] < 0) {
      toast({
        title: "Invalid Operation",
        description: "Balance cannot be negative.",
        variant: "destructive",
      });
      setIsUpdatingBalance(false);
      return;
    }

    if (action === "add") {
      await sendAdminMessage(
        selectedUserEmail,
        `Deposit received: ${values.amount.toFixed(
          8
        )} ${asset.toUpperCase()} has been credited to your account.`
      );
      await addNotification(selectedUserEmail, {
        title: "Deposit Approved",
        content: `Your balance has been credited with ${values.amount} ${asset.toUpperCase()}.`,
        href: "/dashboard",
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

    balanceForm.reset({ amount: 0 });
    setIsUpdatingBalance(false);
  };

  const onSubmitBalanceAdd = (values: BalanceUpdateFormValues) =>
    handleBalanceUpdate(values, "add");
  const onSubmitBalanceRemove = (values: BalanceUpdateFormValues) =>
    handleBalanceUpdate(values, "remove");

  const handleCompleteWithdrawal = async (withdrawalId: string) => {
    if (!selectedWalletData || !selectedUserEmail) return;
    setIsCompleting(withdrawalId);

    const withdrawal = selectedWalletData.pendingWithdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) {
        toast({ title: "Error", description: "Withdrawal not found.", variant: "destructive" });
        setIsCompleting(null);
        return;
    }

    const newWalletData: WalletData = {
        ...selectedWalletData,
        pendingWithdrawals: selectedWalletData.pendingWithdrawals.filter(w => w.id !== withdrawalId),
    };

    await updateWallet(selectedUserEmail, newWalletData);

    await sendAdminMessage(
        selectedUserEmail,
        `Your withdrawal of ${withdrawal.amount.toFixed(2)} USDT to ${withdrawal.address} has been completed.`
    );
    await addNotification(selectedUserEmail, {
        title: "Withdrawal Completed",
        content: `Your withdrawal of $${withdrawal.amount.toFixed(2)} USDT has been successfully processed.`,
        href: "/dashboard",
    });

    toast({ title: "Withdrawal Marked as Complete" });
    await refetchWallets();
    setIsCompleting(null);
  };

  const handleResetAddress = async () => {
    if (!selectedUserEmail) return;

    setIsResettingAddress(true);
    await resetWithdrawalAddressForUser(selectedUserEmail);
    toast({
        title: "Withdrawal Address Reset",
        description: `Successfully reset withdrawal address for ${selectedUserEmail}.`,
    });
    setIsResettingAddress(false);
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select User</Label>
        <Select
          onValueChange={setSelectedUserEmail}
          value={selectedUserEmail}
          disabled={isFetchingWallets}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a user to manage..." />
          </SelectTrigger>
          <SelectContent>
            {allWallets && Object.keys(allWallets).length > 0 ? (
              Object.keys(allWallets).map((email) => (
                <SelectItem key={email} value={email}>
                  {allWallets[email].profile?.username || email}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                {isFetchingWallets ? "Loading users..." : "No users found."}
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedUserEmail &&
        (isFetchingWallets ? (
          <Skeleton className="h-48 w-full" />
        ) : selectedWalletData ? (
          <div className="mb-6 rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="border-b pb-4">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><User className="h-4 w-4" /> User Details</p>
                <p className="text-lg font-bold">{selectedWalletData.profile.username || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">{selectedUserEmail}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">USDT Balance</p>
                <p className="text-xl font-bold">
                  ${formatBalance(selectedWalletData.balances.usdt)}
                </p>
              </div>
               <div>
                <p className="text-sm text-muted-foreground">ETH Balance</p>
                <p className="text-xl font-bold">
                  {formatBalance(selectedWalletData.balances.eth)}
                </p>
              </div>
               <div>
                <p className="text-sm text-muted-foreground">BTC Balance</p>
                <p className="text-xl font-bold">
                  {formatBalance(selectedWalletData.balances.btc)}
                </p>
              </div>
            </div>
          </div>
        ) : null)}

       {selectedWalletData?.pendingWithdrawals && selectedWalletData.pendingWithdrawals.length > 0 && (
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
                  {selectedWalletData.pendingWithdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>{format(new Date(w.timestamp), "PPp")}</TableCell>
                      <TableCell className="font-mono">${w.amount.toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-xs">{w.address}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleCompleteWithdrawal(w.id)}
                          disabled={isCompleting === w.id}
                        >
                          {isCompleting === w.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
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
          <CardTitle>Update Deposit Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...addressForm}>
            <form
              onSubmit={addressForm.handleSubmit(handleAddressUpdate)}
              className="space-y-4"
            >
              <FormField
                control={addressForm.control}
                name="usdtAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>USDT Deposit Address (TRC20)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="T..."
                        {...field}
                        disabled={!selectedUserEmail || isUpdatingAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={!selectedUserEmail || isUpdatingAddress}
              >
                {isUpdatingAddress ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save />
                )}
                Update Address
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Balance</CardTitle>
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
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedUserEmail || isUpdatingBalance}>
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
                        <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            disabled={!selectedUserEmail || isUpdatingBalance}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
              <div className="flex gap-4">
                <Button
                  onClick={balanceForm.handleSubmit(onSubmitBalanceAdd)}
                  className="w-full"
                  disabled={!selectedUserEmail || isUpdatingBalance}
                >
                  {isUpdatingBalance ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusCircle />
                  )}
                  Add Balance
                </Button>
                <Button
                  onClick={balanceForm.handleSubmit(onSubmitBalanceRemove)}
                  variant="destructive"
                  className="w-full"
                  disabled={!selectedUserEmail || isUpdatingBalance}
                >
                  {isUpdatingBalance ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <MinusCircle />
                  )}
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
        <CardContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!selectedUserEmail || isResettingAddress}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reset Withdrawal Address
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete the saved withdrawal address for{" "}
                        <span className="font-bold">{selectedUserEmail}</span>.
                        The user will need to re-enter it. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel disabled={isResettingAddress}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleResetAddress}
                        disabled={isResettingAddress}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isResettingAddress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Reset
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>

    </div>
  );
}
