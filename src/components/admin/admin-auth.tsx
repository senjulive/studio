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
import { AdminLoginForm } from "./admin-login-form";
import { UserProvider } from "@/contexts/UserContext";
import { getSupabaseClient } from "@/lib/supabaseClient";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient();
        // Try Supabase user first
        // @ts-ignore - getUser may throw if not configured
        const { data: userData } = await supabase.auth.getUser();
        const supaUser = userData?.user;

        let email: string | null = supaUser?.email || null;

        // Fallback to session storage email for local mock usage
        if (!email && typeof window !== "undefined") {
          email = sessionStorage.getItem("loggedInEmail");
        }

        if (email === "admin@astralcore.io") {
          setUser({ id: supaUser?.id || "mock-admin-id", email });
          setAuthStatus("authed");
        } else {
          setAuthStatus("unauthed");
        }
      } catch {
        // If Supabase isn't configured, fallback to sessionStorage
        const email = typeof window !== "undefined" ? sessionStorage.getItem("loggedInEmail") : null;
        if (email === "admin@astralcore.io") {
          setUser({ id: "mock-admin-id", email });
          setAuthStatus("authed");
        } else {
          setAuthStatus("unauthed");
        }
      }
    };
    checkAuth();
  }, []);


  const handleLoginSuccess = (email: string) => {
    setUser({ id: 'mock-admin-id', email });
    setAuthStatus("authed");
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
    return (
      <UserProvider value={{ user }}>
        <AdminProvider>{children}</AdminProvider>
      </UserProvider>
    );
  }

  return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
}
