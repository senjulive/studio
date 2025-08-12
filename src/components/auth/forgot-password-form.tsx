"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, ArrowLeft, KeyRound, Shield, Mail, Sparkles, CheckCircle, ArrowRight, Lock } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

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
      <div className="relative w-full mobile-container">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-4 left-4 w-20 h-20 bg-green-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-float" />
        </div>

        <Card className="mobile-card border-green-500/20 shadow-2xl shadow-green-500/10 overflow-hidden">
          <CardHeader className="text-center space-y-6 pb-8 safe-top">
            <div className="relative mx-auto floating-element">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse-glow" />
              <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-400 animate-scale-in" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <Mail className="h-3 w-3 mr-1" />
                Email Sent Successfully
              </Badge>
              
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Check Your Email
              </CardTitle>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Password Reset Instructions Sent</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 mobile-padding">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've sent password reset instructions to your email address.
              </p>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-green-400 font-medium">
                      Next Steps:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Check your inbox and spam folder</li>
                      <li>• Click the reset link in the email</li>
                      <li>• Create your new secure password</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6 safe-bottom">
            <Button 
              onClick={() => setEmailSent(false)}
              variant="outline" 
              className="w-full h-12 border-green-500/30 hover:bg-green-500/10 btn-secondary"
            >
              <Mail className="mr-2 h-4 w-4" />
              Try Different Email
            </Button>
            
            <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>

            {/* Security notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-primary/5 rounded-2xl p-4">
              <div className="h-px bg-border flex-1" />
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Link expires in 15 minutes</span>
              </div>
              <div className="h-px bg-border flex-1" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full mobile-container">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-float" />
      </div>

      <Card className="mobile-card shadow-2xl shadow-orange-500/10 overflow-hidden">
        <CardHeader className="text-center space-y-6 pb-8 safe-top">
          <div className="relative mx-auto floating-element">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse-glow" />
            <AstralLogo className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20 animate-float" />
          </div>
          
          <div className="space-y-3">
            <Badge variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-500">
              <KeyRound className="h-3 w-3 mr-1" />
              Password Recovery
            </Badge>
            
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-primary to-cyan-400 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure Account Recovery</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          
          <CardDescription className="text-base leading-relaxed">
            Enter your email address and we'll send you secure instructions to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 mobile-padding">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          placeholder="your@email.com" 
                          className="input-modern text-base h-14 pl-6 pr-6"
                          {...field} 
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 btn-primary text-lg font-semibold mt-8 haptic-medium"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                <Mail className="mr-3 h-5 w-5" />
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                {!isLoading && <ArrowRight className="ml-3 h-5 w-5" />}
              </Button>
            </form>
          </Form>

          {/* Security Notice */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-orange-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-500">Security Notice</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Password reset links are valid for 15 minutes and can only be used once for maximum security.
                </p>
              </div>
            </div>
          </div>

          {/* Help section */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="text-sm text-center text-muted-foreground font-medium">Need help?</div>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base bg-background/50 border-primary/30 hover:bg-primary/10 justify-start gap-3"
                asChild
              >
                <Link href="/support">
                  <Shield className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-semibold">Contact Support</div>
                    <div className="text-xs text-muted-foreground">Get help from our team</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-6 safe-bottom">
          <div className="text-center text-base">
            <span className="text-muted-foreground">Remember your password? </span>
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80 text-base">
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
          
          {/* Security footer */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-primary/5 rounded-2xl p-4">
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Quantum Encrypted Recovery</span>
            </div>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
