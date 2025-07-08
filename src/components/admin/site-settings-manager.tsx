"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
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
    </div>
  );
}
