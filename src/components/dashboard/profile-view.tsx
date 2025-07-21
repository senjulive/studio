
"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData, updateWallet } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, BadgeInfo, Phone, MapPin, Users, CheckCircle, Clock, ShieldCheck, AlertCircle, Home, Calendar, Lock, Image as ImageIcon, Loader2, Save, Upload, X } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { VirtualCard } from "./virtual-card";
import Image from "next/image";
import { getUserRank } from "@/lib/ranks";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from 'date-fns';
import type { SVGProps } from 'react';
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};


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
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const { toast } = useToast();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select an image smaller than 5MB.", variant: "destructive" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({ title: "Invalid File Type", description: "Please select an image file (PNG, JPG, etc.).", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile || !user?.id || !walletData) return;
    setIsUploading(true);
    try {
      const avatarDataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(selectedFile);
      });
      
      const updatedWallet: WalletData = {
        ...walletData,
        profile: {
          ...walletData.profile,
          avatarUrl: avatarDataUri,
        },
      };

      await updateWallet(updatedWallet);
      setWalletData(updatedWallet);
      toast({ title: "Avatar Updated!", description: "Your new profile picture has been saved." });
      setSelectedFile(null);
      setPreview(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };


  const profile = walletData?.profile;
  const profileDisplayName = profile?.fullName || profile?.username || "User Profile";
  const squadSize = walletData?.squad?.members?.length ?? 0;
  const usdtBalance = walletData?.balances?.usdt ?? 0;
  const rank = getUserRank(usdtBalance);
  const RankIcon = rankIcons[rank.Icon] || RecruitRankIcon;
  
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
                        <RankIcon className="h-5 w-5" />
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

            <Dialog onOpenChange={() => { setPreview(null); setSelectedFile(null); }}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mb-6">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Change Avatar
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload a New Avatar</DialogTitle>
                        <DialogDescription>
                            Select an image from your device. Recommended size: 400x400 pixels.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="avatar-upload" className={cn(
                            "w-full aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors",
                            preview && "border-solid border-primary"
                        )}>
                            {preview ? (
                                <div className="relative w-full h-full">
                                    <Image src={preview} alt="Avatar preview" layout="fill" objectFit="cover" className="rounded-md" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 z-10" onClick={(e) => { e.preventDefault(); setPreview(null); setSelectedFile(null); }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 mb-2" />
                                    <span className="text-sm font-medium">Click to upload</span>
                                    <span className="text-xs">PNG, JPG, or WEBP (max 5MB)</span>
                                </>
                            )}
                        </label>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUploadAvatar} disabled={isUploading || !selectedFile}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Avatar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
