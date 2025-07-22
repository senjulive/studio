
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TierSetting } from "@/lib/tiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tier name is required."),
  balanceThreshold: z.coerce.number().min(0, "Balance must be a positive number."),
  dailyProfit: z.coerce.number().min(0, "Profit rate must be positive.").max(1, "Profit rate cannot exceed 100%."),
  clicks: z.coerce.number().int().min(1, "Must have at least 1 click."),
});

const formSchema = z.object({
  tiers: z.array(tierSchema),
});

type SettingsFormValues = z.infer<typeof formSchema>;
const BOT_TIER_SETTINGS_KEY = 'botTierSettings';

export function BotTierSettingsManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tiers: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  React.useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/public-settings?key=${BOT_TIER_SETTINGS_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch bot tier settings');
        const data = await response.json();
        if (data && Array.isArray(data)) {
            form.reset({ tiers: data });
        }
      } catch (error: any) {
        console.error("Could not fetch bot settings:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: BOT_TIER_SETTINGS_KEY, value: values.tiers })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save settings.');
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
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Tier Settings</CardTitle>
        <CardDescription>
          Configure the parameters for each VIP CORE trading tier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tier Name</TableHead>
                        <TableHead className="text-right">Min. Balance ($)</TableHead>
                        <TableHead className="text-right">Daily Grids</TableHead>
                        <TableHead className="text-right">Daily Profit (%)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name={`tiers.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name={`tiers.${index}.balanceThreshold`}
                                    render={({ field }) => (
                                        <FormItem><FormControl><Input type="number" {...field} className="text-right" /></FormControl><FormMessage /></FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name={`tiers.${index}.clicks`}
                                    render={({ field }) => (
                                        <FormItem><FormControl><Input type="number" {...field} className="text-right" /></FormControl><FormMessage /></FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name={`tiers.${index}.dailyProfit`}
                                    render={({ field }) => (
                                        <FormItem><FormControl>
                                            <Input 
                                                type="number" 
                                                step="0.001"
                                                {...field} 
                                                className="text-right"
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                                value={field.value * 100}
                                            />
                                        </FormControl><FormMessage /></FormItem>
                                    )}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save All Tier Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
