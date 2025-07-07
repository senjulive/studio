"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, PlusCircle, MinusCircle, Save } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { getAllWallets, updateWallet, type WalletData } from "@/lib/wallet";
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
  const [isFetchingWallets, setIsFetchingWallets] = React.useState(true);

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

  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Select User</FormLabel>
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
                  {email}
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                {isFetchingWallets ? "Loading users..." : "No users found."}
              </div>
            )}
          </SelectContent>
        </Select>
      </FormItem>

      {selectedUserEmail &&
        (isFetchingWallets ? (
          <Skeleton className="h-24 w-full" />
        ) : selectedWalletData ? (
          <div className="mb-6 rounded-lg border bg-muted/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
        ) : null)}

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
    </div>
  );
}
