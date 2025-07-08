"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { resetAllWithdrawalAddresses } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
  usdtDepositAddress: z.string().min(1, "Address is required."),
  ethDepositAddress: z.string().min(1, "Address is required."),
  btcDepositAddress: z.string().min(1, "Address is required."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SiteSettingsManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      usdtDepositAddress: "",
      ethDepositAddress: "",
      btcDepositAddress: "",
    },
  });

  React.useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      const settings = await getSiteSettings();
      form.reset({
        usdtDepositAddress: settings.usdtDepositAddress,
        ethDepositAddress: settings.ethDepositAddress,
        btcDepositAddress: settings.btcDepositAddress,
      });
      setIsLoading(false);
    }
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    await saveSiteSettings(values);
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "The site settings have been updated.",
    });
  };

  const handleResetAddresses = async () => {
    setIsResetting(true);
    await resetAllWithdrawalAddresses();
    setIsResetting(false);
    toast({
      title: "Withdrawal Addresses Reset",
      description: "All user withdrawal addresses have been successfully deleted.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-72" />
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site-Wide Settings</CardTitle>
          <CardDescription>
            Configure global deposit addresses for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="usdtDepositAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Global USDT Deposit Address (TRC20)</FormLabel>
                    <FormControl>
                      <Input placeholder="T..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="ethDepositAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Global ETH Deposit Address (ERC20)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="btcDepositAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Global BTC Deposit Address</FormLabel>
                    <FormControl>
                      <Input placeholder="bc1..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Settings
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
            These actions are irreversible. Please proceed with caution.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Reset All User Withdrawal Addresses
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all saved
                        user withdrawal addresses. Users will need to re-enter them.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleResetAddresses}
                        disabled={isResetting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
