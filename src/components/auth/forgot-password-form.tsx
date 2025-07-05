"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { forgotPasswordSchema } from "@/lib/validators";

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    setIsLoading(false);
    console.log(values);
    toast({
      title: "Password Reset Email Sent",
      description:
        "If an account with that email exists, we've sent instructions to reset your password.",
    });
    form.reset();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" className="fill-primary" />
              <path d="M12 6C9.24 6 7 8.24 7 11C7 12.76 7.93 14.31 9.25 15.24L8.7 17.31L10.5 16.66C10.96 16.88 11.48 17 12 17C14.76 17 17 14.76 17 12C17 8.24 14.76 6 12 6ZM13 13H11V11H13V13ZM13 10H11V8H13V10Z" className="fill-accent" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-headline">Forgot Password?</CardTitle>
        <CardDescription>
          No worries, we&apos;ll send you reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full">
          <Link
            href="/"
            className="text-accent font-medium hover:underline"
          >
            &larr; Back to Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
