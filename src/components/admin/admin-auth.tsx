
"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminProvider } from "@/contexts/AdminContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "./admin-login-form";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");

  React.useEffect(() => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!adminEmail) {
        console.error("CRITICAL: NEXT_PUBLIC_ADMIN_EMAIL is not set in the environment.");
        setAuthStatus("unauthed");
        return;
    }

    const checkAdmin = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && user.email === adminEmail) {
        setAuthStatus("authed");
      } else {
        setAuthStatus("unauthed");
      }
    };
    
    checkAdmin();

    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            if (session?.user && session.user.email === adminEmail) {
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

  const handleLoginSuccess = () => {
    setAuthStatus("authed");
    router.refresh();
  };

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
    return <AdminProvider>{children}</AdminProvider>;
  }

  // If not authenticated, show the login form.
  return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
}
