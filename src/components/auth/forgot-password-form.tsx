"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, ArrowLeft, KeyRound, Shield, Mail, Sparkles } from "lucide-react";

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
  const [emailSent, setEmailSent] = React.useState(false);

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
        title: "Reset Link Sent",
        description: "Check your email for password reset instructions.",
      });
      setEmailSent(true);
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

  if (emailSent) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-4 left-4 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float" />
        </div>

        <Card className="glass border-green-500/20 shadow-2xl shadow-green-500/10 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="relative mx-auto">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse-glow" />
              <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Mail className="h-10 w-10 text-green-400 animate-bounce-subtle" />
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Check Your Email
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Password Reset Instructions Sent</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We've sent password reset instructions to your email address. Please check your inbox and follow the link to create a new password.
            </p>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-sm text-green-400 font-medium">
                💡 Don't see the email? Check your spam folder or wait a few minutes for delivery.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button 
              onClick={() => setEmailSent(false)}
              variant="outline" 
              className="w-full border-green-500/30 hover:bg-green-500/10"
            >
              Try Different Email
            </Button>
            
            <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-float" />
      </div>

      <Card className="glass border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
            <AstralLogo className="relative mx-auto h-20 w-20 animate-float" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <KeyRound className="h-4 w-4" />
              <span>Secure Account Recovery</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          
          <CardDescription className="text-sm leading-relaxed">
            Enter your email address and we'll send you instructions to reset your password securely
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          placeholder="your@email.com" 
                          className="h-12 pl-4 pr-4 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                          {...field} 
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>

          {/* Security Notice */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Security Notice</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Password reset links are valid for 15 minutes and can only be used once for security purposes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
          
          <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" />
            <span>Quantum Encrypted Recovery</span>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
