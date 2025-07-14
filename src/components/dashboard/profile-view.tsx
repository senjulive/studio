
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Inbox, User, Mail, BadgeInfo, Phone, MapPin, Users, CheckCircle, Clock, Save, Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { VirtualCard } from "./virtual-card";
import Image from "next/image";
import { getUserRank } from "@/lib/ranks";
import { useUser } from "@/app/dashboard/layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addNotification } from "@/lib/notifications";

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <CardDescription>{announcement.date}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{announcement.content}</p>
      </CardContent>
    </Card>
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

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters.").max(50),
  idCardNo: z.string().regex(/^\d{9,}$/, "ID Card Number must be at least 9 digits and contain only numbers."),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

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
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      idCardNo: "",
    },
  });

  const fetchWallet = React.useCallback(async () => {
    if (user?.id) {
        setIsLoading(true);
        const data = await getOrCreateWallet(user.id);
        setWalletData(data);
        form.reset({
            fullName: data.profile.fullName || "",
            idCardNo: data.profile.idCardNo || "",
        });

        // Check if we should show the verification popup
        if (data.profile.verificationStatus !== 'verified' && data.profile.verificationStatus !== 'verifying') {
          // A small delay to let the page render before showing the popup
          setTimeout(() => setShowVerificationPopup(true), 1000);
        }

        setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [user, form]);


  React.useEffect(() => {
    fetchWallet();
    setAnnouncements(getAnnouncements());

    const interval = setInterval(() => {
        // Only refetch if the status is 'verifying'
        if (walletData?.profile.verificationStatus === 'verifying') {
            fetchWallet();
        }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);

  }, [user, fetchWallet, walletData?.profile.verificationStatus]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          fullName: values.fullName,
          idCardNo: values.idCardNo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile.');
      }

      toast({
        title: "Profile Submitted",
        description: "Your information is being verified. This may take a few minutes.",
      });

      await addNotification(user.id, {
        title: "Verification in Progress",
        content: "Your profile information has been submitted for verification.",
        href: "/dashboard/profile"
      });

      await fetchWallet();

    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const profile = walletData?.profile;
  const profileDisplayName = profile?.fullName || profile?.username || "User Profile";
  const squadSize = walletData?.squad?.members?.length ?? 0;
  const usdtBalance = walletData?.balances?.usdt ?? 0;
  const rank = getUserRank(usdtBalance);
  
  const isProfileComplete = profile?.fullName && profile?.idCardNo;
  const isVerified = profile?.verificationStatus === 'verified';
  const isVerifying = profile?.verificationStatus === 'verifying';
  const canEditProfile = !isVerified && !isVerifying;

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
            </DialogContent>
        </Dialog>
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
        <TabsTrigger value="profile">
          <User className="mr-2 h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="inbox">
          <Inbox className="mr-2 h-4 w-4" />
          Inbox
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="max-w-md mx-auto">
              <CardHeader className="items-center text-center p-0">
                 <div className="p-4 w-full">
                    <VirtualCard walletData={walletData} userEmail={user?.email || null} />
                 </div>
                 <div className="p-6 pt-2 w-full">
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
                 </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                    <Label className="text-xs text-muted-foreground">Asset Balances</Label>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-10" />
                            </div>
                            </div>
                            <Skeleton className="h-5 w-24" />
                        </div>
                        ))
                    ) : (
                        assetConfig.map(asset => (
                        <div key={asset.ticker} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                            <Image src={asset.iconUrl} alt={asset.name} width={32} height={32} className="rounded-full" />
                            <div>
                                <p className="font-medium">{asset.name}</p>
                                <p className="text-sm text-muted-foreground">{asset.ticker}</p>
                            </div>
                            </div>
                            <div className="text-right">
                            <p className="font-medium font-mono text-green-600">
                                {walletData?.balances[asset.balanceKey].toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 6,
                                }) ?? '0.00'}
                            </p>
                            </div>
                        </div>
                        ))
                    )}
                </div>
                <Separator className="mb-6"/>

                {canEditProfile && !isLoading ? (
                   <div className="space-y-4">
                     <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="idCardNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your national ID number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-y-6 text-left sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                      <ProfileDetailItem isLoading={isLoading} icon={<User className="h-4 w-4" />} label="Username" value={profile?.username} />
                      <ProfileDetailItem isLoading={isLoading} icon={<BadgeInfo className="h-4 w-4" />} label="Full Name" value={profile?.fullName} />
                      <ProfileDetailItem isLoading={isLoading} icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email} />
                      <ProfileDetailItem isLoading={isLoading} icon={<BadgeInfo className="h-4 w-4" />} label="ID Card No." value={profile?.idCardNo} />
                      <ProfileDetailItem isLoading={isLoading} icon={<Phone className="h-4 w-4" />} label="Contact Number" value={profile?.contactNumber} />
                      <ProfileDetailItem isLoading={isLoading} icon={<MapPin className="h-4 w-4" />} label="Country" value={profile?.country} />
                      <div className="sm:col-span-2">
                          <ProfileDetailItem isLoading={isLoading} icon={<Users className="h-4 w-4" />} label="Squad Members" value={`${squadSize} member${squadSize !== 1 ? 's' : ''}`} />
                      </div>
                  </div>
                )}
              </CardContent>
              {canEditProfile && !isLoading && (
                 <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save & Verify Profile
                    </Button>
                </CardFooter>
              )}
            </Card>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="inbox" className="mt-6">
         <Card>
            <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Important updates and notifications from the AstralCore team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            {announcements.length > 0 ? (
                announcements.map((item) => <AnnouncementCard key={item.id} announcement={item} />)
            ) : (
                <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">Your inbox is empty.</p>
                </div>
            )}
            </CardContent>
         </Card>
      </TabsContent>
    </Tabs>
    </>
  );
}
