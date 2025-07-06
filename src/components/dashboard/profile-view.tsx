"use client";

import * as React from "react";
import { getCurrentUserEmail } from "@/lib/auth";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Inbox, User, Mail } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

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

export function ProfileView() {
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const announcements = getAnnouncements();

  React.useEffect(() => {
    setUserEmail(getCurrentUserEmail());
  }, []);

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "";

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
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="abstract user" />
              <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">
              User Profile
            </CardTitle>
            <CardDescription>Your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <Mail className="h-5 w-5 mt-px text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Email</p>
                {userEmail ? (
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                ) : (
                    <Skeleton className="h-5 w-48" />
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
