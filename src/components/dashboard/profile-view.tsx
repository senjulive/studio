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
import { User, Mail, BadgeInfo, Phone, MapPin, Users, CheckCircle, Clock, ShieldCheck, AlertCircle, Home, Calendar, Lock, Image as ImageIcon, Loader2, Save, Link as LinkIcon, Edit, Plus, Wallet, TrendingUp, Award, Settings } from "lucide-react";
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
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center border-2 border-card cursor-pointer group-hover:bg-primary/80 transition-colors">
                        <Plus className="h-4 w-4 text-primary-foreground" />
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
                    <DialogTitle>Update Your KYC</DialogTitle>
                    <DialogDescription>
                        To access all features and ensure your account's security, please complete your profile. KYC verification is quick and helps us protect your assets.
                    </DialogDescription>
                </DialogHeader>
                <Button asChild onClick={() => setShowVerificationPopup(false)}>
                    <Link href="/dashboard/profile/verify">Start KYC Update</Link>
                </Button>
            </DialogContent>
        </Dialog>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center lg:items-start">
                  <AvatarUploadDialog wallet={walletData} onUploadSuccess={fetchWallet}>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 p-1 cursor-pointer group">
                      <div className="w-full h-full rounded-full overflow-hidden bg-background">
                        <Image
                          src={profile?.avatarUrl || "https://placehold.co/128x128.png"}
                          alt="Profile"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </div>
                  </AvatarUploadDialog>
                  
                  <div className="mt-4 text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-foreground">
                      {isLoading ? <Skeleton className="h-8 w-40" /> : profileDisplayName}
                    </h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                      {isLoading ? (
                        <>
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </>
                      ) : (
                        <>
                          <Badge variant="outline" className={cn("flex items-center gap-1.5", rank.className)}>
                            <RankIcon className="h-4 w-4" />
                            <span>{rank.name}</span>
                          </Badge>
                          <VerificationStatusBadge status={profile?.verificationStatus} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Wallet className="h-4 w-4" />
                      <span className="text-sm">Total Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {isLoading ? <Skeleton className="h-8 w-20" /> : `$${usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </p>
                  </div>
                  
                  <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Squad Members</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {isLoading ? <Skeleton className="h-8 w-8" /> : squadSize}
                    </p>
                  </div>
                  
                  <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">Rank</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {isLoading ? <Skeleton className="h-6 w-16" /> : rank.name}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Edit Profile */}
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Display Name
                </CardTitle>
                <CardDescription>Update your public display name</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Change Display Name
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Display Name</DialogTitle>
                      <DialogDescription>This name will be visible in the public chat.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="display-name" 
                          placeholder="Your public name" 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)} 
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleUpdateDisplayName} disabled={isUpdatingDisplayName || !displayName}>
                        {isUpdatingDisplayName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Name
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* KYC Verification */}
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  KYC Status
                </CardTitle>
                <CardDescription>
                  {isVerified ? "Your account is fully verified" : "Complete KYC to unlock all features"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant={isVerified ? "outline" : "default"}>
                  <Link href="/dashboard/profile/verify">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {isVerified ? "Update KYC" : "Complete KYC"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal information and account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BadgeInfo className="h-4 w-4" />
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Username</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {isLoading ? <Skeleton className="h-4 w-24" /> : (profile?.username || "Not set")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {isLoading ? <Skeleton className="h-4 w-32" /> : (profile?.fullName || "Not set")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {isLoading ? <Skeleton className="h-4 w-40" /> : (user?.email || "Not set")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone Number</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {isLoading ? <Skeleton className="h-4 w-28" /> : (profile?.contactNumber || "Not set")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Country</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {isLoading ? <Skeleton className="h-4 w-24" /> : (profile?.country || "Not set")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">ID Card Number</Label>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {isLoading ? <Skeleton className="h-4 w-32" /> : (profile?.idCardNo || "Not set")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Information (only if verified) */}
                {isVerified && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Additional Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Address</Label>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {isLoading ? <Skeleton className="h-4 w-48" /> : (profile?.address || "Not set")}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {isLoading ? <Skeleton className="h-4 w-24" /> : (profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), 'PPP') : 'Not set')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Account Stats
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Squad Members</Label>
                          <p className="text-sm font-medium text-foreground mt-1">
                            {isLoading ? <Skeleton className="h-4 w-16" /> : `${squadSize} member${squadSize !== 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </>
  );
}
