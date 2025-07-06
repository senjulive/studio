"use client";

import * as React from "react";
import { getCurrentUserEmail } from "@/lib/auth";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
import { getOrCreateWallet, updateWallet, type WalletData } from "@/lib/wallet";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Inbox, User, Mail, BadgeInfo, Phone, MapPin, Pencil, Award, Star, Shield, Users, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <CardDescription>{announcement.date}</CardDescription>
            </div>
            {!announcement.read && <Badge variant="destructive">New</Badge>}
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

export function ProfileView() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = React.useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);

  const announcements = getAnnouncements();
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
  }, [userEmail]);

  const handleUpdateAvatar = async () => {
    if (!newAvatarUrl || !userEmail || !walletData) return;
    
    setIsUpdating(true);
    try {
      const updatedWallet: WalletData = {
          ...walletData,
          profile: {
              ...walletData.profile,
              avatarUrl: newAvatarUrl,
          }
      };
      
      await updateWallet(userEmail, updatedWallet);
      setWalletData(updatedWallet);
      setIsEditAvatarOpen(false);
      setNewAvatarUrl("");
      toast({ title: "Avatar Updated!" });
    } catch(e) {
      toast({ title: "Failed to update avatar", variant: "destructive" });
    } finally {
        setIsUpdating(false);
    }
  };

  const userInitial = walletData?.profile?.username?.charAt(0).toUpperCase() || userEmail?.charAt(0).toUpperCase() || "";
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
          <CardHeader className="items-center text-center">
            <Dialog open={isEditAvatarOpen} onOpenChange={setIsEditAvatarOpen}>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer">
                    <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile?.avatarUrl || `https://placehold.co/100x100.png`} data-ai-hint="abstract user" />
                    <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-8 w-8 text-white" />
                    </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="avatar-url">Image URL</Label>
                        <Input 
                            id="avatar-url" 
                            placeholder="https://example.com/image.png"
                            value={newAvatarUrl}
                            onChange={(e) => setNewAvatarUrl(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditAvatarOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateAvatar} disabled={isUpdating || !newAvatarUrl}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <CardTitle className="text-2xl flex items-center gap-2">
              {isLoading ? <Skeleton className="h-8 w-40" /> : profileDisplayName}
              <Badge variant="outline" className={cn("flex items-center gap-1.5", rank.color)}>
                <rank.icon className="h-4 w-4" />
                {rank.name}
              </Badge>
            </CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <User className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Username</p>
                {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <p className="text-sm text-muted-foreground">{profile?.username || 'Not set'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Mail className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Email</p>
                {isLoading ? (
                    <Skeleton className="h-5 w-48" />
                ) : (
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                )}
              </div>
            </div>
             <div className="flex items-center space-x-4 rounded-md border p-4">
              <BadgeInfo className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Full Name</p>
                {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <p className="text-sm text-muted-foreground">{profile?.fullName || 'Not set'}</p>
                )}
              </div>
            </div>
             <div className="flex items-center space-x-4 rounded-md border p-4">
              <BadgeInfo className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">ID Card No.</p>
                {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <p className="text-sm text-muted-foreground">{profile?.idCardNo || 'Not set'}</p>
                )}
              </div>
            </div>
             <div className="flex items-center space-x-4 rounded-md border p-4">
              <Phone className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Contact Number</p>
                 {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <p className="text-sm text-muted-foreground">{profile?.contactNumber || 'Not set'}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <MapPin className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Country</p>
                 {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <p className="text-sm text-muted-foreground">{profile?.country || 'Not set'}</p>
                )}
              </div>
            </div>
             <div className="flex items-center space-x-4 rounded-md border p-4">
              <Users className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Squad Members</p>
                 {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                ) : (
                    <p className="text-sm text-muted-foreground">{squadSize} member{squadSize !== 1 && 's'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="inbox" className="mt-6">
         <Card>
            <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Important updates and notifications from the Astral Core team.</CardDescription>
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
