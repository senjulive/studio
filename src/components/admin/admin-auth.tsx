
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

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Simplified auth status for mock environment
  const [authStatus, setAuthStatus] = React.useState<"loading" | "authed" | "unauthed">("unauthed");

  // In a real app, you would have a session check here.
  // For now, we'll just show the login form.
  React.useEffect(() => {
    setAuthStatus("unauthed");
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
