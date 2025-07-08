"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getOrCreateWallet,
  setWithdrawalPassword,
  verifyWithdrawalPassword,
  type WalletData,
} from "@/lib/wallet";
import {
  createWithdrawalPasswordSchema,
  changeWithdrawalPasswordSchema,
} from "@/lib/validators";
import { getCurrentUserEmail } from "@/lib/auth";
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

type CreatePasswordValues = z.infer<typeof createWithdrawalPasswordSchema>;
type ChangePasswordValues = z.infer<typeof changeWithdrawalPasswordSchema>;

export function SecurityView() {
  const { toast } = useToast();
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const hasPassword = !!wallet?.security.withdrawalPassword;

  const form = useForm({
    resolver: zodResolver(
      hasPassword
        ? changeWithdrawalPasswordSchema
        : createWithdrawalPasswordSchema
    ),
    defaultValues: hasPassword
      ? { currentPassword: "", newPassword: "", confirmPassword: "" }
      : { newPassword: "", confirmPassword: "" },
  });

  const fetchWallet = React.useCallback(async () => {
    setIsLoading(true);
    const email = getCurrentUserEmail();
    if (email) {
      const data = await getOrCreateWallet(email);
      setWallet(data);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);
  
  React.useEffect(() => {
    form.reset(hasPassword
      ? { currentPassword: "", newPassword: "", confirmPassword: "" }
      : { newPassword: "", confirmPassword: "" });
  }, [hasPassword, form]);


  const onSubmit = async (values: CreatePasswordValues | ChangePasswordValues) => {
    const email = getCurrentUserEmail();
    if (!email) return;

    setIsSubmitting(true);

    try {
      if ("currentPassword" in values) { // Change password
        const isValid = await verifyWithdrawalPassword(email, values.currentPassword);
        if (!isValid) {
          form.setError("currentPassword", { message: "Incorrect current password." });
          return;
        }
      }
      
      await setWithdrawalPassword(email, values.newPassword);
      
      toast({
        title: "Password Updated",
        description: "Your withdrawal password has been set successfully.",
      });

      await fetchWallet(); // Refetch wallet to update UI state
      form.reset();

    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span>Withdrawal Password</span>
        </CardTitle>
        <CardDescription>
          {hasPassword
            ? "Change your withdrawal password. This password is required for all withdrawal operations."
            : "Create a withdrawal password to protect your funds. This password will be required for all withdrawals."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {hasPassword && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : hasPassword ? (
                <ShieldCheck className="mr-2 h-4 w-4" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {hasPassword ? "Change Password" : "Create Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
