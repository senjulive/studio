
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getOrCreateWallet,
  updateWallet,
  type WalletData,
} from "@/lib/wallet";
import {
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

type ChangePasscodeValues = z.infer<typeof changeWithdrawalPasscodeSchema>;

function PasscodeForm({ wallet, fetchWallet }: { wallet: WalletData | null; fetchWallet: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();
  
  const hasPasscode = false; // This feature is being removed/simplified

  const form = useForm({
    resolver: zodResolver(changeWithdrawalPasscodeSchema),
    defaultValues: { currentPasscode: "", newPasscode: "", confirmPasscode: "" }
  });

  const onSubmit = async (values: ChangePasscodeValues) => {
    if (!user?.id || !wallet) return;

    setIsSubmitting(true);

    try {
        // This is a placeholder for a real password change flow
        toast({
            title: "Security Feature Updated",
            description: "Password management will be handled via user account settings.",
        });
        
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPasscode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Account Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPasscode"
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
          name="confirmPasscode"
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
        <Button type="submit" disabled={true} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-4 w-4" />
          )}
          Update Password (Feature Disabled)
        </Button>
      </form>
    </Form>
  );
}


export function SecurityView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useUser();
  
  const hasPasscode = false; // Feature removed

  const fetchWallet = React.useCallback(async () => {
    if (user?.id) {
      setIsLoading(true);
      const data = await getOrCreateWallet(user.id);
      setWallet(data);
      setIsLoading(false);
    }
  }, [user]);

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
            <span>Account Security</span>
        </CardTitle>
        <CardDescription>
            To change your password, please use the "Forgot Password" link on the login page. For other security concerns, contact support.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="p-4 text-center bg-muted rounded-lg text-muted-foreground">
              Withdrawal passcodes have been deprecated for a more streamlined user experience.
          </div>
      </CardContent>
    </Card>
  );
}
