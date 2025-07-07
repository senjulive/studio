"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBotTierSettings, saveBotTierSettings, type TierSetting } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

export function BotSettingsManager() {
  const { toast } = useToast();
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
      const settings = await getBotTierSettings();
      form.reset({ tiers: settings });
      setIsLoading(false);
    }
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    // Ensure tiers are sorted by balance threshold before saving
    const sortedTiers = [...values.tiers].sort((a, b) => a.balanceThreshold - b.balanceThreshold);
    await saveBotTierSettings(sortedTiers);
    form.reset({ tiers: sortedTiers }); // Re-sync form with sorted data
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "The bot tier settings have been updated.",
    });
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
                onClick={() => append({ id: `new-tier-${Date.now()}`, name: `Tier ${fields.length + 1}`, balanceThreshold: 20000, dailyProfit: 0.1, clicks: 12 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Tier
              </Button>
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
  );
}
