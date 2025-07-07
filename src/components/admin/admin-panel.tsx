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
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="wallets" className="flex-col h-16">
              <WalletCards className="h-5 w-5" />
              <span className="mt-1 text-xs text-center">
                Manage
                <br />
                Wallets
              </span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-col h-16">
              <Mail className="h-5 w-5" />
              <span className="mt-1 text-xs text-center">
                View
                <br />
                Messages
              </span>
            </TabsTrigger>
            <TabsTrigger value="bot-settings" className="flex-col h-16">
              <Bot className="h-5 w-5" />
              <span className="mt-1 text-xs text-center">
                Bot
                <br />
                Settings
              </span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex-col h-16">
              <Megaphone className="h-5 w-5" />
              <span className="mt-1 text-xs text-center">
                Post
                <br />
                Alerts
              </span>
            </TabsTrigger>
            <TabsTrigger value="site-settings" className="flex-col h-16">
              <Settings className="h-5 w-5" />
              <span className="mt-1 text-xs text-center">
                Site
                <br />
                Settings
              </span>
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
