"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Asterisk, Loader2 } from "lucide-react";

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

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
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
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
    setIsLoading(false);
    console.log(values);
    toast({
      title: "Login Successful",
      description: "Welcome back to Astral Core!",
    });
    form.reset();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
                >
                <path
                    d="M12 2L14.09 8.26L20.5 9.5L15.8 13.84L17.18 20.02L12 16.77L6.82 20.02L8.2 13.84L3.5 9.5L9.91 8.26L12 2Z"
                    className="fill-primary"
                />
                <path
                    d="M19.64 18.36C19.33 18.05 18.82 18.05 18.51 18.36L17.15 19.72C16.84 20.03 16.84 20.54 17.15 20.85C17.46 21.16 17.97 21.16 18.28 20.85L19.64 19.49C19.95 19.18 19.95 18.67 19.64 18.36Z"
                    className="fill-accent"
                />
                <path
                    d="M5.36 5.64C5.67 5.33 6.18 5.33 6.49 5.64L7.85 7C8.16 7.31 8.16 7.82 7.85 8.13C7.54 8.44 7.03 8.44 6.72 8.13L5.36 6.77C5.05 6.46 5.05 5.95 5.36 5.64Z"
                    className="fill-accent"
                />
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
