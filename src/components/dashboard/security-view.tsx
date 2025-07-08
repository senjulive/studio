
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getOrCreateWallet,
  setWithdrawalPasscode,
  verifyWithdrawalPasscode,
  type WalletData,
} from "@/lib/wallet";
import {
  createWithdrawalPasscodeSchema,
  changeWithdrawalPasscodeSchema,
} from "@/lib/validators";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, ShieldCheck, KeyRound } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/app/dashboard/layout";

type CreatePasscodeValues = z.infer<typeof createWithdrawalPasscodeSchema>;
type ChangePasscodeValues = z.infer<typeof changeWithdrawalPasscodeSchema>;

function PasscodeForm({ wallet, fetchWallet }: { wallet: WalletData | null; fetchWallet: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();
  const userEmail = user?.email;
  
  const hasPasscode = !!wallet?.security.withdrawalPasscode;

  const form = useForm({
    resolver: zodResolver(
      hasPasscode
        ? changeWithdrawalPasscodeSchema
        : createWithdrawalPasscodeSchema
    ),
    defaultValues: hasPasscode
      ? { currentPasscode: "", newPasscode: "", confirmPasscode: "" }
      : { newPasscode: "", confirmPasscode: "" },
  });

  const onSubmit = async (values: CreatePasscodeValues | ChangePasscodeValues) => {
    if (!userEmail) return;

    setIsSubmitting(true);

    try {
      if (hasPasscode) {
        // Handle changing the passcode
        const changeValues = values as ChangePasscodeValues;
        const isValid = await verifyWithdrawalPasscode(userEmail, changeValues.currentPasscode);

        if (!isValid) {
          form.setError("currentPasscode", { message: "Incorrect current passcode." });
        } else {
          await setWithdrawalPasscode(userEmail, changeValues.newPasscode);
          toast({
            title: "Passcode Updated",
            description: "Your withdrawal passcode has been changed successfully.",
          });
          form.reset();
          fetchWallet(); // Re-fetch to update parent state, which will re-key this component
        }
      } else {
        // Handle creating a new passcode
        const createValues = values as CreatePasscodeValues;
        await setWithdrawalPasscode(userEmail, createValues.newPasscode);
        toast({
          title: "Passcode Created",
          description: "Your withdrawal passcode has been set successfully.",
        });
        form.reset();
        fetchWallet(); // Re-fetch to update parent state, which will re-key this component
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your passcode.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {hasPasscode && (
          <FormField
            control={form.control}
            name="currentPasscode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Passcode</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••" {...field} maxLength={4} inputMode="numeric" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="newPasscode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New 4-Digit Passcode</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••" {...field} maxLength={4} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPasscode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Passcode</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••" {...field} maxLength={4} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : hasPasscode ? (
            <ShieldCheck className="mr-2 h-4 w-4" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          {hasPasscode ? "Change Passcode" : "Create Passcode"}
        </Button>
      </form>
    </Form>
  );
}


export function SecurityView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useUser();
  const userEmail = user?.email;
  
  const hasPasscode = !!wallet?.security.withdrawalPasscode;

  const fetchWallet = React.useCallback(async () => {
    setIsLoading(true);
    if (userEmail) {
      const data = await getOrCreateWallet(userEmail);
      setWallet(data);
    }
    setIsLoading(false);
  }, [userEmail]);

  React.useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/3 self-end" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-6 w-6"/>
            <span>Withdrawal Passcode</span>
        </CardTitle>
        <CardDescription>
          {hasPasscode
            ? "Change your 4-digit withdrawal passcode. This is required for all withdrawal operations."
            : "Create a 4-digit withdrawal passcode to protect your funds. This will be required for all withdrawals."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasscodeForm 
            key={hasPasscode ? 'change-form' : 'create-form'}
            wallet={wallet}
            fetchWallet={fetchWallet}
        />
      </CardContent>
    </Card>
  );
}
