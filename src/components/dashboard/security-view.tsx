
"use client";

import * as React from "react";
import {
  getOrCreateWallet,
  type WalletData,
} from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/app/dashboard/layout";

export function SecurityView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useUser();
  
  const fetchWallet = React.useCallback(async () => {
    if (user?.id) {
      setIsLoading(true);
      const data = await getOrCreateWallet(user.id);
      setWallet(data);
      setIsLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-6 w-6"/>
            <span>Account Security</span>
        </CardTitle>
        <CardDescription>
            To change your password, please use the "Forgot Password" link on the login page. For other security concerns, contact support.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="p-4 text-center bg-muted rounded-lg text-muted-foreground">
              Withdrawal passcodes have been deprecated for a more streamlined user experience.
          </div>
      </CardContent>
    </Card>
  );
}
