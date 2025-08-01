"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";

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
import { resetPasswordForEmail } from "@/lib/auth";
import { AstralLogo } from "../icons/astral-logo";

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
    try {
      const error = await resetPasswordForEmail(values.email);
      if (error) {
        throw new Error(error);
      }
      toast({
        title: "Password Reset Email Sent",
        description:
          "If an account with that email exists, we've sent instructions to reset your password.",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <AstralLogo className="mx-auto" />
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
                className="w-full"
                disabled={isLoading}
                >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
                </Button>
            </form>
            </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
            <Button variant="link" asChild>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Login
                </Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
