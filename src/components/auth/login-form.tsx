"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
import { Separator } from "../ui/separator";

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
            title: "Login Failed",
            description: error,
            variant: "destructive",
        });
    } else {
        toast({
          title: "Login Successful",
          description: "Welcome to AstralCore!",
        });
        router.push('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    console.log("UI: Google sign-in clicked");
  };

  const handleEmailSignIn = () => {
    console.log("UI: Email sign-in clicked");
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3">
        <Button 
          variant="outline" 
          onClick={handleGoogleSignIn}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200"
        >
          Sign in with Google
        </Button>
        <Button 
          variant="outline" 
          onClick={handleEmailSignIn}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200"
        >
          Sign in with Email
        </Button>
      </div>
      
      <div className="relative">
        <Separator className="bg-white/30" />
        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-transparent px-3 text-xs text-white/70">
          OR
        </span>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    {...field} 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-white/90">Password</FormLabel>
                  <Button variant="link" asChild className="p-0 h-auto text-sm">
                    <Link
                      href="/forgot-password"
                      className="text-white/80 hover:text-white transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 transition-all duration-200 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-white/70 hover:text-white hover:bg-white/20"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
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
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white/90 text-sm">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 h-11"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Authorizing..." : "Login"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        <p className="text-white/70">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-white hover:text-white/80 font-semibold transition-colors duration-200 underline underline-offset-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
