
"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalletData } from "@/lib/wallet";
import { AstralLogo } from "../icons/astral-logo";
import { Skeleton } from "../ui/skeleton";

type VirtualCardProps = {
  walletData: WalletData | null;
  userEmail: string | null;
  className?: string;
};

export function VirtualCard({ walletData, userEmail, className }: VirtualCardProps) {
  const [cardDetails, setCardDetails] = React.useState<{
    cardNumber: string;
    cvv: string;
    expiryDate: string;
  } | null>(null);

  React.useEffect(() => {
    // Generate card details on the client to avoid hydration mismatch and ensure consistency for the user
    if (walletData && userEmail) {
      const lastFour = walletData.addresses.usdt.slice(-4) || '....';
      const cardNumber = `4000 1234 5678 ${lastFour}`;
      
      const seed = userEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const cvv = ((seed * 13) % 900) + 100;
      
      const expiryYear = (new Date().getFullYear() + 5).toString().slice(-2);
      const expiryMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const expiryDate = `${expiryMonth}/${expiryYear}`;

      setCardDetails({
        cardNumber,
        cvv: cvv.toString(),
        expiryDate
      });
    }
  }, [walletData, userEmail]);

  const profile = walletData?.profile;
  const fullName = profile?.fullName || profile?.username || "User";
  const balance = walletData?.balances?.usdt ?? 0;
  
  if (!walletData || !userEmail) {
      return <Skeleton className={cn("w-full max-w-sm aspect-[1.586] rounded-xl", className)} />
  }

  return (
    <div className={cn(
        "w-full max-w-sm aspect-[1.586] rounded-xl shadow-2xl p-6 flex flex-col justify-between relative bg-gradient-to-br from-primary via-purple-700 to-indigo-800 text-primary-foreground overflow-hidden", 
        className
    )}>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full opacity-50"></div>
      <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/5 rounded-full opacity-50"></div>
      
      <header className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-md p-1">
                <AstralLogo className="h-8 w-8" />
            </div>
            <span className="font-semibold text-lg">AstralCore</span>
        </div>
        <div className="text-right">
            <p className="text-xs uppercase opacity-70">Balance</p>
            <p className="font-semibold text-lg">${balance.toFixed(2)}</p>
        </div>
      </header>

      <div className="z-10 mt-auto">
        <Cpu className="w-10 h-10 mb-2 text-yellow-300/80" />
        <p className="font-mono text-xl md:text-2xl tracking-widest">
          {cardDetails?.cardNumber || '**** **** **** ****'}
        </p>
      </div>
      
      <footer className="flex justify-between items-end z-10 mt-4">
        <div className="space-y-1">
          <p className="text-xs uppercase opacity-70">Card Holder</p>
          <p className="font-medium truncate">{fullName}</p>
          <p className="text-xs font-mono truncate">{userEmail}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs uppercase opacity-70">Expires</p>
          <p className="font-medium font-mono">{cardDetails?.expiryDate || 'MM/YY'}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs uppercase opacity-70">CVV</p>
          <p className="font-medium font-mono">{cardDetails?.cvv || '***'}</p>
        </div>
      </footer>
    </div>
  );
}
