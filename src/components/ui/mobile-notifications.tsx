'use client';

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bot, Zap, TrendingUp, Clock, CheckCircle, X, Smartphone, Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationData {
  id: string;
  type: "bot-online" | "bot-offline" | "earnings" | "grid-complete" | "security";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  data?: any;
}

interface MobileNotificationsProps {
  className?: string;
}

export function MobileNotifications({ className }: MobileNotificationsProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<NotificationData[]>([]);
  const [isSupported, setIsSupported] = React.useState(false);
  const [permission, setPermission] = React.useState<NotificationPermission>("default");
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive mobile notifications for bot activities.",
        });
      } else {
        toast({
          title: "Notifications Denied",
          description: "Enable notifications in your browser settings to receive alerts.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Permission Error",
        description: "Failed to request notification permission.",
        variant: "destructive"
      });
    }
  };

  const sendNotification = React.useCallback((data: Omit<NotificationData, "id" | "timestamp" | "isRead">) => {
    const notification: NotificationData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [notification, ...prev]);

    // Send browser notification if permission granted
    if (permission === "granted" && document.hidden) {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: "/icons/icon-192x192.svg",
          badge: "/icons/icon-192x192.svg",
          tag: notification.type,
          requireInteraction: notification.type === "security",
          silent: false
        });

        browserNotification.onclick = () => {
          window.focus();
          setShowNotifications(true);
          browserNotification.close();
        };

        // Auto close after 5 seconds unless it's a security notification
        if (notification.type !== "security") {
          setTimeout(() => browserNotification.close(), 5000);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: notification.type === "security" ? 10000 : 5000,
    });
  }, [permission, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Expose notification sender globally for other components
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).sendMobileNotification = sendNotification;
    }
  }, [sendNotification]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bot-online":
        return <Bot className="h-4 w-4 text-green-500" />;
      case "bot-offline":
        return <Bot className="h-4 w-4 text-red-500" />;
      case "earnings":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "grid-complete":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "security":
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "bot-online":
        return "border-green-500/20 bg-green-500/5";
      case "bot-offline":
        return "border-red-500/20 bg-red-500/5";
      case "earnings":
        return "border-green-500/20 bg-green-500/5";
      case "grid-complete":
        return "border-blue-500/20 bg-blue-500/5";
      case "security":
        return "border-orange-500/20 bg-orange-500/5";
      default:
        return "border-primary/20 bg-primary/5";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Permission Button */}
      {isSupported && permission !== "granted" && (
        <Button
          onClick={requestPermission}
          variant="outline"
          size="sm"
          className="w-full mb-4 border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
        >
          <Bell className="h-4 w-4 mr-2" />
          Enable Mobile Notifications
        </Button>
      )}

      {/* Notification Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Mobile Notifications</span>
          {permission === "granted" ? (
            <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
              <Bell className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400">
              <BellOff className="h-3 w-3 mr-1" />
              Disabled
            </Badge>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
            <Button
              onClick={clearAll}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground">
                You'll see bot status updates and alerts here
              </p>
            </div>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                getNotificationColor(notification.type),
                !notification.isRead && "ring-2 ring-primary/20"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Demo Notifications for Testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 pt-4 border-t space-y-2">
          <p className="text-xs text-muted-foreground">Demo Notifications:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() =>
                sendNotification({
                  type: "bot-online",
                  title: "Bot Online",
                  message: "Your trading bot is now active and scanning for opportunities."
                })
              }
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Bot Online
            </Button>
            <Button
              onClick={() =>
                sendNotification({
                  type: "earnings",
                  title: "Earnings Complete",
                  message: "Grid trading completed! You earned $15.40 from this cycle."
                })
              }
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Earnings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function for other components to send notifications
export const sendMobileNotification = (data: Omit<NotificationData, "id" | "timestamp" | "isRead">) => {
  if (typeof window !== 'undefined' && (window as any).sendMobileNotification) {
    (window as any).sendMobileNotification(data);
  }
};
