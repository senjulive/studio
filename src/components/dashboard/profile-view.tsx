
"use client";

import * as React from "react";
import { getCurrentUserEmail } from "@/lib/auth";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Inbox, User, Mail, BadgeInfo, Phone, MapPin, Award, Star, Shield, Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { VirtualCard } from "./virtual-card";

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

const getUserRank = (squadSize: number) => {
    if (squadSize >= 10) {
      return { name: "Gold", icon: Award, color: "text-amber-500" };
    }
    if (squadSize >= 5) {
      return { name: "Silver", icon: Star, color: "text-slate-400" };
    }
    if (squadSize >= 1) {
      return { name: "Bronze", icon: Shield, color: "text-orange-600" };
    }
    return { name: "Recruit", icon: User, color: "text-muted-foreground" };
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
        <p className="text-base font-medium text-foreground">{value || "Not set"}</p>
      )}
    </div>
  </div>
);

export function ProfileView() {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

  const userEmail = getCurrentUserEmail();

  React.useEffect(() => {
    if (userEmail) {
        async function fetchWallet() {
            setIsLoading(true);
            const data = await getOrCreateWallet(userEmail);
            setWalletData(data);
            setIsLoading(false);
        }
        fetchWallet();
    } else {
        setIsLoading(false);
    }
    setAnnouncements(getAnnouncements());
  }, [userEmail]);

  const profile = walletData?.profile;
  const profileDisplayName = profile?.fullName || profile?.username || "User Profile";
  const squadSize = walletData?.squad?.members?.length ?? 0;
  const rank = getUserRank(squadSize);

  return (
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
        <Card className="max-w-md mx-auto">
          <CardHeader className="items-center text-center p-0">
             <div className="p-4 w-full">
                <VirtualCard walletData={walletData} userEmail={userEmail} />
             </div>
             <div className="p-6 pt-2 w-full">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {isLoading ? <Skeleton className="h-8 w-40" /> : profileDisplayName}
                <Badge variant="outline" className={cn("flex items-center gap-1.5", rank.color)}>
                    <rank.icon className="h-4 w-4" />
                    {rank.name}
                </Badge>
                </CardTitle>
                <CardDescription className="mt-1.5">Your account details.</CardDescription>
             </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-y-6 text-left sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8">
                <ProfileDetailItem isLoading={isLoading} icon={<User className="h-4 w-4" />} label="Username" value={profile?.username} />
                <ProfileDetailItem isLoading={isLoading} icon={<BadgeInfo className="h-4 w-4" />} label="Full Name" value={profile?.fullName} />
                <ProfileDetailItem isLoading={isLoading} icon={<Mail className="h-4 w-4" />} label="Email" value={userEmail} />
                <ProfileDetailItem isLoading={isLoading} icon={<BadgeInfo className="h-4 w-4" />} label="ID Card No." value={profile?.idCardNo} />
                <ProfileDetailItem isLoading={isLoading} icon={<Phone className="h-4 w-4" />} label="Contact Number" value={profile?.contactNumber} />
                <ProfileDetailItem isLoading={isLoading} icon={<MapPin className="h-4 w-4" />} label="Country" value={profile?.country} />
                <div className="sm:col-span-2">
                    <ProfileDetailItem isLoading={isLoading} icon={<Users className="h-4 w-4" />} label="Squad Members" value={`${squadSize} member${squadSize !== 1 ? 's' : ''}`} />
                </div>
            </div>
          </CardContent>
        </Card>
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
  );
}
