"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultTierSettings, type TierSetting } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "@/contexts/AdminContext";

const tierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required."),
  balanceThreshold: z.coerce.number().min(0, "Threshold must be non-negative."),
  dailyProfit: z.coerce.number().min(0, "Profit rate must be non-negative."),
  clicks: z.coerce.number().int().min(1, "Clicks must be at least 1."),
});

const settingsSchema = z.object({
  tiers: z.array(tierSchema),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;
const BOT_TIERS_KEY = 'botTierSettings';

export function BotSettingsManager() {
  const { toast } = useToast();
  const { adminPassword } = useAdmin();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      tiers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  React.useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/public-settings?key=${BOT_TIERS_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        const data = await response.json();
        const settings = data || defaultTierSettings;
        form.reset({ tiers: settings.sort((a,b) => a.balanceThreshold - b.balanceThreshold) });
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        form.reset({ tiers: defaultTierSettings });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [form, toast]);

  const onSubmit = async (values: SettingsFormValues) => {
    if (!adminPassword) {
      toast({ title: 'Error', description: 'Admin authentication not found.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const sortedTiers = [...values.tiers].sort((a, b) => a.balanceThreshold - b.balanceThreshold);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword, key: BOT_TIERS_KEY, value: sortedTiers })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save settings.');
      
      form.reset({ tiers: sortedTiers });
      toast({
        title: "Settings Saved",
        description: "The bot tier settings have been updated.",
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth Bot Tier Settings</CardTitle>
          <CardDescription>
            Configure the profit tiers for the automated trading bot based on user balance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Bot Tier Settings</CardTitle>
        <CardDescription>
          Configure the profit tiers for the automated trading bot. Sorts automatically by balance on save.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 relative bg-muted/30 shadow-inner">
                   <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-3 -right-3 h-7 w-7"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove Tier</span>
                    </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                     <FormField
                        control={form.control}
                        name={`tiers.${index}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tier Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`tiers.${index}.balanceThreshold`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Min. Balance ($)</FormLabel>
                                <FormControl><Input type="number" step="1" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`tiers.${index}.dailyProfit`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profit Rate (0.02=2%)</FormLabel>
                                <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`tiers.${index}.clicks`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Daily Grids</FormLabel>
                                <FormControl><Input type="number" step="1" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                </Card>
              ))}
            </div>
             <Button
                type="button"
                variant="outline"
                onClick={() => append({ id: `new-tier-${Date.now()}`, name: `VIP CORE ${fields.length + 1}`, balanceThreshold: 20000, dailyProfit: 0.1, clicks: 12 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Tier
              </Button>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving || !adminPassword}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
