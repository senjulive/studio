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
import { registerSchema } from "@/lib/validators";
import { createWallet } from "@/lib/wallet";
import { AstralLogo } from "../icons/astral-logo";

const MALDIVES_COUNTRY = { name: 'Maldives', dial_code: '+960', code: 'MV', flag: '🇲🇻' };
type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      referralCode: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);

    const fullContactNumber = `${MALDIVES_COUNTRY.dial_code}${
      values.contactNumber
    }`;

    try {
      await createWallet(
        values.email,
        values.username,
        fullContactNumber,
        MALDIVES_COUNTRY.name,
        values.referralCode
      );
      toast({
        title: "Account Created",
        description: "Your wallet is ready. Please sign in to continue.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm border-border/50">
      <CardHeader className="text-center">
        <AstralLogo className="mx-auto mb-2" />
        <CardTitle className="text-2xl font-headline">System Registration</CardTitle>
        <CardDescription>
          Complete the form below to register your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your unique username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-24 items-center justify-center rounded-md border bg-muted px-3 text-sm shrink-0">
                         <span className="mr-2">{MALDIVES_COUNTRY.flag}</span>
                         <span>{MALDIVES_COUNTRY.dial_code}</span>
                      </div>
                      <Input
                        placeholder="Your phone number"
                        {...field}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Squad Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter squad code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="w-full text-muted-foreground">
          Already have an account?{" "}
          <Link href="/" className="font-semibold text-primary/90 hover:text-primary">
            Authorize Access
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
