"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/validators";
import { login } from "@/lib/auth";
import { getOrCreateWallet } from "@/lib/wallet";


type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    // This would be a real auth check. Here, we just log in the user.
    await login(values.email);
    // Ensure a wallet exists for the user.
    await getOrCreateWallet(values.email);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    
    setIsLoading(false);
    toast({
      title: "Login Successful",
      description: "Welcome back to Astral Core!",
    });
    router.push("/dashboard");
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
        <CardTitle className="text-2xl font-headline">Astral Core</CardTitle>
        <CardDescription>
          Welcome back! Please enter your details to login.
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-accent font-medium hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-accent font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
