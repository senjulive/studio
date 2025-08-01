"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Smartphone, Shield, Sparkles } from "lucide-react";
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
    <div className="relative w-full max-w-md mx-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-4 left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl animate-float" />
      </div>

      <Card className="glass border-primary/20 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
            <AstralLogo className="relative mx-auto h-20 w-20 animate-float" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Astral Core
            </CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Quantum Trading Platform</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          
          <CardDescription className="text-sm leading-relaxed">
            Experience next-generation automated trading with our AI-powered CORE Nexus Quantum v3.76 system
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
                      <div className="relative">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <Button variant="link" asChild className="p-0 h-auto text-xs text-primary/80 hover:text-primary">
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
                          className="h-12 pl-4 pr-12 bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Remember me on this device
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Authenticating..." : "Enter Astral Core"}
              </Button>
            </form>
          </Form>

          {/* Quick login hints */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="text-xs text-center text-muted-foreground">Quick Access</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs bg-background/50 border-primary/30 hover:bg-primary/10"
                onClick={() => {
                  form.setValue('email', 'demo@astralcore.io');
                  form.setValue('password', 'demo123');
                }}
              >
                <Smartphone className="h-3 w-3 mr-1" />
                Demo User
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs bg-background/50 border-primary/30 hover:bg-primary/10"
                onClick={() => {
                  form.setValue('email', 'admin@astralcore.io');
                  form.setValue('password', 'admin123');
                }}
              >
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <div className="text-center text-sm text-muted-foreground">
            New to Astral Core?{" "}
            <Button variant="link" asChild className="p-0 h-auto font-semibold text-primary hover:text-primary/80">
              <Link href="/register">
                Create Account
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" />
            <span>Secured by Quantum Encryption</span>
            <div className="h-px bg-border flex-1" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
