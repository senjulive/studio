
"use client";

import * as React from "react";
import { getNotifications, type Notification } from "@/lib/notifications";
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
import { Inbox, Trash2, Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/app/dashboard/layout";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

function AnnouncementCard({ announcement }: { announcement: Notification }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <CardDescription>{new Date(announcement.created_at).toLocaleDateString()}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}

export function InboxView() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isClearing, setIsClearing] = React.useState(false);
    const { user } = useUser();
    const { toast } = useToast();

    const fetchNotifications = React.useCallback(async () => {
        if (user?.id) {
            setIsLoading(true);
            const data = await getNotifications(user.id);
            setNotifications(data);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [user]);

    React.useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    
    const handleClearInbox = async () => {
        setIsClearing(true);
        try {
            const response = await fetch('/api/notifications/clear', { method: 'POST' });
            if (!response.ok) throw new Error("Failed to clear inbox.");
            
            await fetchNotifications();
            toast({ title: "Inbox Cleared", description: "All notifications have been removed." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsClearing(false);
        }
    };

  return (
     <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><Inbox /> Inbox</CardTitle>
                <CardDescription>Important updates and notifications from the AstralCore team.</CardDescription>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isLoading || notifications.length === 0 || isClearing}>
                        {isClearing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Clear All
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete all notifications from your inbox. This action cannot be undone.
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
        </CardHeader>
        <CardContent className="space-y-4">
            {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
            ) : notifications.length > 0 ? (
                notifications.map((item) => <AnnouncementCard key={item.id} announcement={item} />)
            ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed text-center">
                <Inbox className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-medium text-muted-foreground">Your inbox is empty.</p>
                <p className="text-sm text-muted-foreground">You have no new notifications.</p>
            </div>
        )}
        </CardContent>
     </Card>
  );
}
