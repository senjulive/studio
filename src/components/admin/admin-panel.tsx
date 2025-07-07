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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          <TooltipProvider>
            <TabsList className="grid w-full grid-cols-5 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="wallets" className="h-14 w-full">
                    <WalletCards className="h-6 w-6" />
                    <span className="sr-only">Manage Wallets</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage Wallets</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="messages" className="h-14 w-full">
                    <Mail className="h-6 w-6" />
                     <span className="sr-only">View Messages</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Messages</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="bot-settings" className="h-14 w-full">
                    <Bot className="h-6 w-6" />
                     <span className="sr-only">Bot Settings</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bot Settings</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="announcements" className="h-14 w-full">
                    <Megaphone className="h-6 w-6" />
                     <span className="sr-only">Announcements</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Announcements</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="site-settings" className="h-14 w-full">
                    <Settings className="h-6 w-6" />
                     <span className="sr-only">Site Settings</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Site Settings</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </TooltipProvider>
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
