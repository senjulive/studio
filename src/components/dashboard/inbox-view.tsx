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
import { Inbox, Trash2, Loader2, AlertCircle, Calendar, Bell, MessageSquare, Tag, MoreVertical, Archive } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <div className={cn(
          "h-2 w-2 rounded-full",
          notification.read ? "bg-muted" : "bg-primary"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.content}
            </p>
            <span className="text-xs text-muted-foreground mt-2 block">
              {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {notification.href && (
              <Button asChild size="sm" variant="ghost" className="h-6 px-2 text-xs">
                <Link href={notification.href}>View</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementItem({ announcement }: { announcement: Announcement }) {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <MessageSquare className="h-4 w-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{announcement.title}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {announcement.content}
        </p>
        <span className="text-xs text-muted-foreground mt-2 block">
          {new Date(announcement.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function PromotionItem({ promotion }: { promotion: Promotion }) {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <Tag className="h-4 w-4 text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium truncate">{promotion.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {promotion.description}
            </p>
          </div>
          <Badge 
            variant={
              promotion.status === 'Active' ? 'default' :
              promotion.status === 'Upcoming' ? 'secondary' :
              'outline'
            }
            className="text-xs ml-2 flex-shrink-0"
          >
            {promotion.status}
          </Badge>
        </div>
      </div>
    </div>
  );
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6" />
            Inbox
          </h1>
          <p className="text-muted-foreground">Stay updated with your notifications and announcements</p>
        </div>
        {notifications.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading || isClearing}>
                {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all personal notifications from your inbox. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearInbox} className="bg-destructive hover:bg-destructive/90">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Mobile-First Tabs */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
            {unreadCount > 0 && <Badge className="ml-1 h-4 w-4 p-0 text-xs">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="announcements" className="text-xs sm:text-sm">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Announcements</span>
            <span className="sm:hidden">News</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="text-xs sm:text-sm">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Promotions</span>
            <span className="sm:hidden">Offers</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Personal account updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-2 w-2 rounded-full mt-2" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {notifications.map((item) => (
                    <NotificationItem key={item.id} notification={item} />
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center p-4">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="font-medium text-muted-foreground">No notifications</p>
                  <p className="text-sm text-muted-foreground">Important account updates will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Announcements</CardTitle>
              <CardDescription>Platform updates and important news</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : announcements.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {announcements.map((item) => (
                    <AnnouncementItem key={item.id} announcement={item} />
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="font-medium text-muted-foreground">No announcements yet</p>
                  <p className="text-sm text-muted-foreground">Platform updates will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Promotions</CardTitle>
              <CardDescription>Special offers and promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              ) : promotions.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {promotions.map((item) => (
                    <PromotionItem key={item.id} promotion={item} />
                  ))}
                </div>
              ) : (
                <div className="flex h-48 flex-col items-center justify-center text-center p-4">
                  <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="font-medium text-muted-foreground">No active promotions</p>
                  <p className="text-sm text-muted-foreground">Check back soon for special offers!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
