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

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("loading");

  React.useEffect(() => {
    // Check session storage to see if admin was logged in
    const loggedInEmail = sessionStorage.getItem('loggedInEmail');
    if (loggedInEmail === 'admin@astralcore.io') {
      setAuthStatus("authed");
    } else {
      setAuthStatus("unauthed");
    }
  }, []);


  const handleLoginSuccess = () => {
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
    return <AdminProvider>{children}</AdminProvider>;
  }

  return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
}
