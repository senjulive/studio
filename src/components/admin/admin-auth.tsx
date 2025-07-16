
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
import { useToast } from "@/hooks/use-toast";
import { AdminProvider } from "@/contexts/AdminContext";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");

  React.useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.email?.startsWith('admin')) {
        setAuthStatus("authed");
      } else {
        setAuthStatus("unauthed");
      }
    };
    
    checkAdmin();

    const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            if (session?.user && session.user.email?.startsWith('admin')) {
                setAuthStatus("authed");
            } else {
                setAuthStatus("unauthed");
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

  if (authStatus === "authed") {
    // We pass a dummy value. In a real-world scenario, API calls would use the user's JWT.
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
