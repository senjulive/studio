"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  WalletCards,
  Mail,
  Bot,
  Megaphone,
  Settings,
} from "lucide-react";
import { WalletManager } from "./wallet-manager";
import { MessageViewer } from "./message-viewer";
import { BotSettingsManager } from "./bot-settings-manager";
import { AnnouncementManager } from "./announcement-manager";
import { SiteSettingsManager } from "./site-settings-manager";

export function AdminPanel() {
  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-primary"/>
            </div>
            <div>
                <CardTitle>Administrator Panel</CardTitle>
                <CardDescription>
                  Manage wallets, messages, bot settings, announcements and site settings.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="wallets">
              <WalletCards className="mr-2 h-4 w-4" />
              <span>Wallet Management</span>
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="mr-2 h-4 w-4" />
              <span>User Messages</span>
            </TabsTrigger>
            <TabsTrigger value="bot-settings">
              <Bot className="mr-2 h-4 w-4" />
              <span>Bot Settings</span>
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="mr-2 h-4 w-4" />
              <span>Announcements</span>
            </TabsTrigger>
            <TabsTrigger value="site-settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Site Settings</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wallets" className="mt-6">
            <WalletManager />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessageViewer />
          </TabsContent>
          <TabsContent value="bot-settings" className="mt-6">
            <BotSettingsManager />
          </TabsContent>
           <TabsContent value="announcements" className="mt-6">
            <AnnouncementManager />
          </TabsContent>
           <TabsContent value="site-settings" className="mt-6">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
