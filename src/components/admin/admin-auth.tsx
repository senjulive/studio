
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
import { useRouter } from "next/navigation";
import { AdminLoginForm } from "./admin-login-form";

// Mock auth state since Supabase is removed
let mockIsAdminLoggedIn = false;

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");

  React.useEffect(() => {
    // Simulate checking auth status
    setTimeout(() => {
        setAuthStatus(mockIsAdminLoggedIn ? "authed" : "unauthed");
    }, 500);
  }, []);

  const handleLoginSuccess = () => {
    mockIsAdminLoggedIn = true;
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
