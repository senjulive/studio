"use client";

import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getNotifications,
  markAllAsRead,
  type Notification,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/dashboard/layout";

function NotificationItem({ notification }: { notification: Notification }) {
    const content = (
        <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
            <div className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", !notification.read && "bg-primary")} />
            <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.content}</p>
                <p className="text-xs text-muted-foreground/80">{formatDistanceToNow(new Date(notification.date), { addSuffix: true })}</p>
            </div>
        </div>
    );
    
    if (notification.href) {
        return <Link href={notification.href} className="block w-full">{content}</Link>;
    }
    
    return content;
}

export function NotificationBell() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const { user } = useUser();
  const userEmail = user?.email;

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const fetchNotifications = React.useCallback(async () => {
    if (userEmail) {
      // Don't show loader on background refresh
      if(!isOpen) {
        setIsLoading(true);
      }
      const data = await getNotifications(userEmail);
      setNotifications(data);
      setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [userEmail, isOpen]);

  React.useEffect(() => {
    fetchNotifications();
    // Periodically refetch to catch new notifications
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);
  
  const handleMarkAllRead = async () => {
    if (!userEmail) return;
    const updatedNotifications = await markAllAsRead(userEmail);
    setNotifications(updatedNotifications);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-7 w-7">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px]">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b p-3">
            <h3 className="font-medium">Notifications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
        </div>
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 font-medium">No new notifications</p>
              <p className="text-sm text-muted-foreground">We'll let you know when something new happens.</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
