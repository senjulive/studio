"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowDownLeft, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { getCurrentUserEmail } from "@/lib/auth";
import { sendSystemNotification } from "@/lib/chat";

const depositRequestSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Please enter a positive amount." }),
});

type DepositRequestFormValues = z.infer<typeof depositRequestSchema>;

export function DepositView() {
  const { toast } = useToast();
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setCurrentUserEmail(getCurrentUserEmail());
  }, []);

  const form = useForm<DepositRequestFormValues>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (values: DepositRequestFormValues) => {
    if (!currentUserEmail) {
      toast({ title: "Error", description: "Could not identify user.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const asset = "usdt";

    await sendSystemNotification(
      currentUserEmail,
      `User initiated a deposit request of ${values.amount} ${asset.toUpperCase()}.`
    );

    // Simulate network delay for user feedback
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Deposit Request Submitted",
      description: `Your request to deposit ${values.amount} ${asset.toUpperCase()} is pending review.`,
    });
    
    form.reset({ amount: 0 });
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request a USDT Deposit</CardTitle>
        <CardDescription>
          Submit a deposit request. An administrator will review and process it shortly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USDT)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} disabled={isSubmitting} step="any" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowDownLeft className="mr-2 h-4 w-4" />
              )}
              Submit Deposit Request
            </Button>
          </form>
        </Form>
        <Alert className="mt-6 text-left bg-muted/30">
          <Info className="h-4 w-4" />
          <AlertTitle>Please Note</AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc space-y-1">
                <li>This is a request form. Funds will not be automatically added to your account.</li>
                <li>An administrator will review your request and credit your account balance manually.</li>
                <li>Processing may take some time. Please check your balance later.</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
