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
import { User, Mail, BadgeInfo, Phone, MapPin, Users, CheckCircle, Clock, ShieldCheck, AlertCircle, Home, Calendar, Lock, Image as ImageIcon, Loader2, Save, Link as LinkIcon, Edit, Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

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


export function AvatarUploadDialog({ children, wallet, onUploadSuccess }: { children: React.ReactNode, wallet: WalletData | null, onUploadSuccess: () => void }) {
    const { toast } = useToast();
    const { user } = useUser();
    const [isUpdatingAvatar, setIsUpdatingAvatar] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = React.useState(wallet?.profile?.avatarUrl || "");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast({ title: "File too large", description: "Please select a file smaller than 2MB.", variant: "destructive" });
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast({ title: "Invalid file type", description: "Only image files are supported.", variant: "destructive" });
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUpdateAvatar = async () => {
        if (!avatarUrl || !user?.id || !wallet) return;
        
        setIsUpdatingAvatar(true);
        try {
          const updatedWallet: WalletData = {
            ...wallet,
            profile: {
              ...wallet.profile,
              avatarUrl: avatarUrl,
            },
          };
    
          await updateWallet(updatedWallet);
          toast({ title: "Avatar Updated!", description: "Your new profile picture has been saved." });
          onUploadSuccess();
        } catch (error: any) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
          setIsUpdatingAvatar(false);
        }
    };
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative group">
                    {children}
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-card cursor-pointer group-hover:bg-red-500 transition-colors">
                        <Plus className="h-4 w-4 text-white" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Update Your Avatar</DialogTitle><DialogDescription>Select an image file from your device.</DialogDescription></DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <Image src={avatarUrl || "https://placehold.co/128x128.png"} alt="Avatar preview" width={128} height={128} className="rounded-full" />
                    </div>
                    <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpdateAvatar} disabled={isUpdatingAvatar || !avatarUrl}>
                        {isUpdatingAvatar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Avatar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


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
        <p className="text-base font-medium text-foreground break-words">{value || <span className="text-sm text-muted-foreground italic">Not set</span>}</p>
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
  const [isUpdatingDisplayName, setIsUpdatingDisplayName] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const { toast } = useToast();

  const fetchWallet = React.useCallback(async () => {
    if (user?.id) {
        setIsLoading(true);
        const data = await getOrCreateWallet(user.id);
        setWalletData(data);
        setDisplayName(data?.profile?.displayName || data?.profile?.username || "");
       
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
  
  const handleUpdateDisplayName = async () => {
    if (!displayName || !user?.id || !walletData) return;
    if (displayName.length < 3) {
        toast({ title: "Display Name Too Short", description: "Must be at least 3 characters.", variant: "destructive"});
        return;
    }

    setIsUpdatingDisplayName(true);
    try {
      const updatedWallet: WalletData = {
        ...walletData,
        profile: {
          ...walletData.profile,
          displayName: displayName,
        },
      };

      await updateWallet(updatedWallet);
      setWalletData(updatedWallet);
      toast({ title: "Display Name Updated!", description: "Your new display name has been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingDisplayName(false);
    }
  };


  const profile = walletData?.profile;
  const profileDisplayName = profile?.displayName || profile?.fullName || profile?.username || "User Profile";
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



            <div className="grid grid-cols-1 gap-4 mb-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Display Name</Button>
                    </DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Set Display Name</DialogTitle><DialogDescription>This name will be visible in the public chat.</DialogDescription></DialogHeader><div className="space-y-4"><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="display-name" placeholder="Your public name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-9"/></div></div><DialogFooter><Button onClick={handleUpdateDisplayName} disabled={isUpdatingDisplayName || !displayName}>{isUpdatingDisplayName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Name</Button></DialogFooter></DialogContent>
                </Dialog>
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
                        Edit Profile & Verify
                    </Link>
                </Button>
            </CardFooter>
            )}
        </Card>
    </>
  );
}
