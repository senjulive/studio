
"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, BadgeInfo, Phone, MapPin, Users, CheckCircle, Clock, ShieldCheck, AlertCircle, Home, Calendar } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { VirtualCard } from "./virtual-card";
import Image from "next/image";
import { getUserRank } from "@/lib/ranks";
import { useUser } from "@/app/dashboard/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from 'date-fns';

const ProfileDetailItem = ({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  isLoading: boolean;
}) => (
  <div>
    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
      {icon}
      {label}
    </Label>
    <div className="mt-1">
      {isLoading ? (
        <Skeleton className="h-6 w-3/4" />
      ) : (
        <p className="text-base font-medium text-foreground break-words">{value || "Not set"}</p>
      )}
    </div>
  </div>
);

const assetConfig = [
    {
        ticker: "USDT",
        name: "Tether",
        iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
        balanceKey: "usdt",
    },
    {
        ticker: "ETH",
        name: "Ethereum",
        iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
        balanceKey: "eth",
    },
    {
        ticker: "BTC",
        name: "Bitcoin",
        iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
        balanceKey: "btc",
    },
] as const;

const VerificationStatusBadge = ({ status }: { status?: string }) => {
  if (status === 'verified') {
    return (
      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="h-4 w-4 mr-1.5" />
        Verified
      </Badge>
    );
  }
  if (status === 'verifying') {
    return (
      <Badge variant="secondary">
        <Clock className="h-4 w-4 mr-1.5 animate-spin" />
        Verifying...
      </Badge>
    );
  }
  return (
    <Badge variant="destructive">
      <AlertCircle className="h-4 w-4 mr-1.5" />
      Unverified
    </Badge>
  );
};


export function ProfileView() {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useUser();
  const [showVerificationPopup, setShowVerificationPopup] = React.useState(false);

  const fetchWallet = React.useCallback(async () => {
    if (user?.id) {
        setIsLoading(true);
        const data = await getOrCreateWallet(user.id);
        setWalletData(data);
       
        if (data.profile.verificationStatus !== 'verified' && data.profile.verificationStatus !== 'verifying') {
          setTimeout(() => setShowVerificationPopup(true), 1000);
        }

        setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [user]);


  React.useEffect(() => {
    fetchWallet();

    const interval = setInterval(() => {
        if (walletData?.profile.verificationStatus === 'verifying') {
            fetchWallet();
        }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);

  }, [user, fetchWallet, walletData?.profile.verificationStatus]);

  const profile = walletData?.profile;
  const profileDisplayName = profile?.fullName || profile?.username || "User Profile";
  const squadSize = walletData?.squad?.members?.length ?? 0;
  const usdtBalance = walletData?.balances?.usdt ?? 0;
  const rank = getUserRank(usdtBalance);
  
  const isVerified = profile?.verificationStatus === 'verified';

  return (
    <>
       <Dialog open={showVerificationPopup} onOpenChange={setShowVerificationPopup}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Verify Your Account</DialogTitle>
                    <DialogDescription>
                        To access all features and ensure your account's security, please complete your profile. Verification is quick and helps us protect your assets.
                    </DialogDescription>
                </DialogHeader>
                <Button asChild onClick={() => setShowVerificationPopup(false)}>
                    <Link href="/dashboard/profile/verify">Start Verification</Link>
                </Button>
            </DialogContent>
        </Dialog>
        <Card className="max-w-md mx-auto">
            <CardHeader className="items-center text-center p-6">
                <CardTitle className="text-2xl">
                    {isLoading ? <Skeleton className="h-8 w-40 mx-auto" /> : profileDisplayName}
                </CardTitle>
                <div className="mt-2 flex justify-center gap-2 items-center">
                    {isLoading ? (
                    <>
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-6 w-20" />
                    </>
                    ) : (
                    <>
                        <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5", rank.className)}>
                        <rank.Icon className="h-5 w-5" />
                        <span>{rank.name}</span>
                        </Badge>
                        <VerificationStatusBadge status={profile?.verificationStatus} />
                    </>
                    )}
                </div>
            </CardHeader>
            <CardContent>
            <div className="mb-6">
                <Label className="text-xs text-muted-foreground text-center block mb-4">Asset Balances</Label>
                {isLoading ? (
                    <div className="flex justify-around">
                        {Array.from({ length: 3 }).map((_, i) => (
                             <div key={i} className="flex flex-col items-center gap-2">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-5 w-16" />
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-around text-center">
                        {assetConfig.map(asset => (
                            <div key={asset.ticker} className="flex flex-col items-center gap-2">
                                <Image src={asset.iconUrl} alt={asset.name} width={40} height={40} className="rounded-full" />
                                <span className="text-sm font-semibold font-mono">
                                    {walletData?.balances[asset.balanceKey].toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 6,
                                    }) ?? '0.00'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-6 p-4">
              <VirtualCard walletData={walletData} userEmail={user?.email || null} />
            </div>

            <Separator className="mb-6"/>

                <div className="grid grid-cols-1 gap-y-6 text-left sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                    <ProfileDetailItem isLoading={isLoading} icon={<User className="h-4 w-4" />} label="Username" value={profile?.username} />
                    <ProfileDetailItem isLoading={isLoading} icon={<BadgeInfo className="h-4 w-4" />} label="Full Name" value={profile?.fullName} />
                    <ProfileDetailItem isLoading={isLoading} icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email} />
                    <ProfileDetailItem isLoading={isLoading} icon={<BadgeInfo className="h-4 w-4" />} label="ID Card No." value={profile?.idCardNo} />
                    <ProfileDetailItem isLoading={isLoading} icon={<Phone className="h-4 w-4" />} label="Contact Number" value={profile?.contactNumber} />
                    <ProfileDetailItem isLoading={isLoading} icon={<MapPin className="h-4 w-4" />} label="Country" value={profile?.country} />
                    {isVerified && (
                    <>
                        <ProfileDetailItem isLoading={isLoading} icon={<Home className="h-4 w-4" />} label="Address" value={profile?.address} />
                        <ProfileDetailItem isLoading={isLoading} icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), 'PPP') : 'Not set'} />
                    </>
                    )}
                    <div className="sm:col-span-2">
                        <ProfileDetailItem isLoading={isLoading} icon={<Users className="h-4 w-4" />} label="Squad Members" value={`${squadSize} member${squadSize !== 1 ? 's' : ''}`} />
                    </div>
                </div>
            </CardContent>
            {!isVerified && !isLoading && (
                <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/dashboard/profile/verify">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Start Verification
                    </Link>
                </Button>
            </CardFooter>
            )}
        </Card>
    </>
  );
}
