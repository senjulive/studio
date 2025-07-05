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
          <svg width="48" height="48" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <style>{`
                  .logo-a {
                      font-family: 'Times New Roman', serif;
                      font-size: 40px;
                      font-weight: bold;
                      fill: hsl(var(--primary));
                      animation: logo-fade-in 1.5s ease-out;
                      -webkit-animation: logo-fade-in 1.5s ease-out;
                  }
                  .logo-ring-1 {
                      stroke: hsl(var(--accent));
                      stroke-width: 1.5;
                      fill: none;
                      transform-origin: center;
                      animation: logo-rotate-1 10s linear infinite;
                      -webkit-animation: logo-rotate-1 10s linear infinite;
                  }
                  .logo-ring-2 {
                      stroke: hsl(var(--primary));
                      stroke-width: 1;
                      fill: none;
                      transform-origin: center;
                      animation: logo-rotate-2 15s linear infinite reverse;
                      -webkit-animation: logo-rotate-2 15s linear infinite reverse;
                  }
                  @keyframes logo-fade-in {
                      from { opacity: 0; transform: translateY(10px) scale(0.9); }
                      to { opacity: 1; transform: translateY(0) scale(1); }
                  }
                  @-webkit-keyframes logo-fade-in {
                      from { opacity: 0; -webkit-transform: translateY(10px) scale(0.9); }
                      to { opacity: 1; -webkit-transform: translateY(0) scale(1); }
                  }
                  @keyframes logo-rotate-1 {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                  }
                  @-webkit-keyframes logo-rotate-1 {
                      from { -webkit-transform: rotate(0deg); }
                      to { -webkit-transform: rotate(360deg); }
                  }
                  @keyframes logo-rotate-2 {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                  }
                  @-webkit-keyframes logo-rotate-2 {
                      from { -webkit-transform: rotate(0deg); }
                      to { -webkit-transform: rotate(360deg); }
                  }
              `}</style>
              <g className="logo-ring-1">
                  <ellipse cx="25" cy="25" rx="23" ry="15" />
              </g>
              <g className="logo-ring-2">
                  <ellipse cx="25" cy="25" rx="15" ry="23" />
              </g>
              <text x="25" y="36" textAnchor="middle" className="logo-a">
                  A
              </text>
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
