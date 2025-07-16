
'use client';

import * as React from 'react';
import {formatDistanceToNow} from 'date-fns';
import {useToast} from '@/hooks/use-toast';
import {type Notification} from '@/lib/notifications';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Bell, RefreshCw, User} from 'lucide-react';
import {Button} from '@/components/ui/button';

type AdminNotification = Notification & {
  user: {
    username: string | null;
    full_name: string | null;
  } | null;
};

export function NotificationViewer() {
  const {toast} = useToast();
  const [notifications, setNotifications] = React.useState<AdminNotification[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchNotifications = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({}), // Empty body as password is no longer needed
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Failed to fetch admin notifications.'
        );
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Could not fetch notifications: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Admin Notifications</CardTitle>
          <CardDescription>
            A log of important events from across the platform.
          </CardDescription>
        </div>
        <Button
          onClick={fetchNotifications}
          variant="outline"
          size="icon"
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({length: 5}).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))
        ) : notifications.length > 0 ? (
          notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notif.title}</p>
                <p className="text-sm text-muted-foreground">{notif.content}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  {formatDistanceToNow(new Date(notif.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-48 border-dashed border rounded-lg">
            <Bell className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">No notifications yet</p>
            <p className="text-sm text-muted-foreground">
              Important system events will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
