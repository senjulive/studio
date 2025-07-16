
"use client";

import * as React from "react";
import { Loader2, Shield, ShieldAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminProvider } from "@/contexts/AdminContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!adminEmail) {
        console.error("CRITICAL: NEXT_PUBLIC_ADMIN_EMAIL is not set in the environment.");
        setAuthStatus("unauthed");
        setIsAdmin(false);
        return;
    }

    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.email === adminEmail) {
        setAuthStatus("authed");
        setIsAdmin(true);
      } else {
        setAuthStatus("unauthed");
        setIsAdmin(false);
      }
    };
    
    checkAdmin();

    const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            if (session?.user && session.user.email === adminEmail) {
                setAuthStatus("authed");
                setIsAdmin(true);
            } else {
                setAuthStatus("unauthed");
                setIsAdmin(false);
            }
        }
    );

    return () => {
        authListener.subscription.unsubscribe();
    };

  }, []);

  if (authStatus === "loading") {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <CardTitle>Verifying Access</CardTitle>
                <CardDescription>
                Please wait while we check your credentials.
                </CardDescription>
            </CardHeader>
        </Card>
    );
  }

  if (authStatus === "authed" && isAdmin) {
    return <AdminProvider value={{ adminPassword: 'authenticated' }}>{children}</AdminProvider>;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto bg-destructive/10 p-3 rounded-full mb-2">
            <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle>Access Denied</CardTitle>
        <CardDescription>
          You do not have permission to view this page. Please log in with an administrator account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push('/')} className="w-full">
            Return to Login
        </Button>
      </CardContent>
    </Card>
  );
}
