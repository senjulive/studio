
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Loader2, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { AdminProvider } from "@/contexts/AdminContext";

const adminAuthSchema = z.object({
  password: z.string().min(1, { message: "Password is required." }),
});

type AdminAuthFormValues = z.infer<typeof adminAuthSchema>;

// IMPORTANT: For local development, you can create a `.env.local` file in the root of your project
// and add the line: NEXT_PUBLIC_ADMIN_PASSWORD="your_secret_password"
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Xx#%admin%34%xX";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const form = useForm<AdminAuthFormValues>({
    resolver: zodResolver(adminAuthSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: AdminAuthFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      if (values.password === ADMIN_PASSWORD) {
        toast({ title: "Access Granted" });
        setPassword(values.password);
        setIsAuthenticated(true);
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password.",
          variant: "destructive",
        });
        form.reset();
      }
      setIsLoading(false);
    }, 500);
  };

  if (isAuthenticated) {
    return <AdminProvider value={{ adminPassword: password }}>{children}</AdminProvider>;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
            <Shield className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Admin Access Required</CardTitle>
        <CardDescription>
          Please enter the password to access the admin panel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              Unlock
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
