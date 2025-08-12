"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Smartphone, Shield, Sparkles, ArrowRight, Fingerprint, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/validators";
import { login } from "@/lib/auth";
import { AstralLogo } from "../icons/astral-logo";
import { Badge } from "@/components/ui/badge";

const REMEMBERED_EMAIL_KEY = 'astral-remembered-email';

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
        if (rememberedEmail) {
            form.setValue('email', rememberedEmail);
            form.setValue('rememberMe', true);
        }
    }
  }, [form]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    if (typeof window !== 'undefined') {
        if (values.rememberMe) {
            localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
        } else {
            localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
        sessionStorage.setItem('loggedInEmail', values.email);
    }
    
    const { error } = await login(values);

    if (error) {
        toast({
            title: "Access Denied",
            description: error,
            variant: "destructive",
        });
    } else {
        toast({
          title: "Access Granted",
          description: "Welcome to the future of trading!",
        });
        router.push('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="relative w-full mobile-container">
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-float" />
      </div>

      <Card className="mobile-card shadow-2xl shadow-primary/10 overflow-hidden">
        <CardHeader className="text-center space-y-6 pb-8 safe-top">
          {/* Logo with enhanced animations */}
          <div className="relative mx-auto floating-element">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
            <AstralLogo className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20 animate-float" />
          </div>
          
          {/* Title and branding */}
          <div className="space-y-3">
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secure Access to AstralCore</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            <CardDescription className="text-base leading-relaxed">
              Sign in to continue your quantum trading journey
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 mobile-padding">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          placeholder="your@email.com" 
                          className="input-modern text-base h-14 pl-6 pr-6"
                          {...field} 
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </FormLabel>
                      <Button variant="link" asChild className="p-0 h-auto text-sm text-primary/80 hover:text-primary">
                        <Link href="/forgot-password">
                          Forgot password?
                        </Link>
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="input-modern text-base h-14 pl-6 pr-14"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground transition-colors rounded-xl"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-normal cursor-pointer">
                        Remember me on this device
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Keep me signed in for faster access
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-14 btn-primary text-lg font-semibold mt-8 haptic-medium"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && <ArrowRight className="ml-3 h-5 w-5" />}
              </Button>
            </form>
          </Form>

          {/* Biometric Login (Demo) */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-14 btn-secondary text-base gap-3"
            disabled={isLoading}
          >
            <Fingerprint className="h-5 w-5" />
            Biometric Login
            <Badge variant="secondary" className="text-xs">Demo</Badge>
          </Button>

          {/* Quick Access Demo Accounts */}
          <div className="space-y-4 pt-6 border-t border-border/50">
            <div className="text-sm text-center text-muted-foreground font-medium">Quick Access</div>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base bg-background/50 border-primary/30 hover:bg-primary/10 justify-start gap-3"
                onClick={() => {
                  form.setValue('email', 'demo@astralcore.io');
                  form.setValue('password', 'demo123');
                }}
              >
                <Smartphone className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-semibold">Demo User</div>
                  <div className="text-xs text-muted-foreground">demo@astralcore.io</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base bg-background/50 border-primary/30 hover:bg-primary/10 justify-start gap-3"
                onClick={() => {
                  form.setValue('email', 'admin@astralcore.io');
                  form.setValue('password', 'admin123');
                }}
              >
                <Shield className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-semibold">Admin Access</div>
                  <div className="text-xs text-muted-foreground">admin@astralcore.io</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pt-6 safe-bottom">
          {/* Create Account */}
          <div className="text-center text-base">
            <span className="text-muted-foreground">New to AstralCore? </span>
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80 text-base">
              <Link href="/register">
                Create Account
              </Link>
            </Button>
          </div>
          
          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-primary/5 rounded-2xl p-4">
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secured by Quantum Encryption</span>
            </div>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
