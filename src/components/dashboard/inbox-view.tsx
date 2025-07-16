
"use client";

import * as React from "react";
import { getNotifications, type Notification } from "@/lib/notifications";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
import { getPromotions, type Promotion } from "@/lib/promotions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Inbox, Trash2, Loader2, Bell, Megaphone, Gift, AlertCircle, Calendar } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  {notification.title}
                </CardTitle>
                <CardDescription>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</CardDescription>
            </div>
             {notification.href && <Button asChild size="sm" variant="outline"><Link href={notification.href}>View</Link></Button>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{notification.content}</p>
      </CardContent>
    </Card>
  );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-base">{announcement.title}</CardTitle>
        <CardDescription>{new Date(announcement.date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  return (
    <Card className="overflow-hidden bg-muted/30">
      {promotion.image_url && (
        <div className="aspect-video relative">
          <Image src={promotion.image_url} alt={promotion.title} layout="fill" objectFit="cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-base">{promotion.title}</CardTitle>
            <Badge variant={
              promotion.status === 'Active' ? 'default' :
              promotion.status === 'Upcoming' ? 'secondary' :
              'outline'
            }>{promotion.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{promotion.description}</p>
      </CardContent>
    </Card>
  )
}


export function InboxView() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
    const [promotions, setPromotions] = React.useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isClearing, setIsClearing] = React.useState(false);
    const { user } = useUser();
    const { toast } = useToast();

    const fetchAllData = React.useCallback(async () => {
        setIsLoading(true);
        if (user?.id) {
          const [notifs, anncs, promos] = await Promise.all([
            getNotifications(user.id),
            getAnnouncements(),
            getPromotions(),
          ]);
          setNotifications(notifs);
          setAnnouncements(anncs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          setPromotions(promos.filter(p => p.status !== 'Expired'));
        }
        setIsLoading(false);
    }, [user]);

    React.useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);
    
    const handleClearInbox = async () => {
        setIsClearing(true);
        try {
            const response = await fetch('/api/notifications/clear', { method: 'POST' });
            if (!response.ok) throw new Error("Failed to clear inbox.");
            
            await fetchAllData();
            toast({ title: "Notifications Cleared", description: "All personal notifications have been removed." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsClearing(false);
        }
    };

    const unreadCount = React.useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  return (
     <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Inbox /> Inbox</CardTitle>
            <CardDescription>Your central hub for all platform communications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="announcements">
                  <Megaphone className="mr-2 h-4 w-4" />
                  Announcements
                </TabsTrigger>
                <TabsTrigger value="promotions">
                   <Gift className="mr-2 h-4 w-4" />
                   Promotions
                </TabsTrigger>
              </TabsList>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isLoading || notifications.length === 0 || isClearing}>
                          {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          Clear Notifications
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This will permanently delete all personal notifications from your inbox. This action cannot be undone.
                      </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearInbox} className="bg-destructive hover:bg-destructive/90">
                          Confirm
                      </AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <TabsContent value="notifications" className="mt-4">
                <div className="space-y-4">
                  {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
                  ) : notifications.length > 0 ? (
                      notifications.map((item) => <NotificationCard key={item.id} notification={item} />)
                  ) : (
                  <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed text-center">
                      <Bell className="h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 font-medium text-muted-foreground">No notifications.</p>
                      <p className="text-sm text-muted-foreground">Important account updates will appear here.</p>
                  </div>
              )}
              </div>
            </TabsContent>
            
            <TabsContent value="announcements" className="mt-4">
              <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
                ) : announcements.length > 0 ? (
                    announcements.map((item) => <AnnouncementCard key={item.id} announcement={item} />)
                ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <Megaphone className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium text-muted-foreground">No announcements yet.</p>
                </div>
              )}
              </div>
            </TabsContent>

            <TabsContent value="promotions" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
                ) : promotions.length > 0 ? (
                    promotions.map((item) => <PromotionCard key={item.id} promotion={item} />)
                ) : (
                <div className="md:col-span-2 flex h-48 flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <Gift className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium text-muted-foreground">No active promotions.</p>
                    <p className="text-sm text-muted-foreground">Check back soon for special offers!</p>
                </div>
              )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
     </Card>
  );
}
