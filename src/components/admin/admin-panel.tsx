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
  Bell,
  UserCheck,
  Gift,
} from "lucide-react";
import { WalletManager } from "./wallet-manager";
import { MessageViewer } from "./message-viewer";
import { BotSettingsManager } from "./bot-settings-manager";
import { AnnouncementManager } from "./announcement-manager";
import { SiteSettingsManager } from "./site-settings-manager";
import { VerificationManager } from "./verification-manager";
import { NotificationViewer } from "./notification-viewer";
import { PromotionManager } from "./promotion-manager";

export function AdminPanel() {
  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-primary"/>
            </div>
            <div>
                <CardTitle>AstralCore AI</CardTitle>
                <CardDescription>
                  Platform management and user oversight system.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallets" className="w-full">
          <TooltipProvider>
            <TabsList className="grid w-full grid-cols-8 gap-2">
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="wallets"><WalletCards /><span className="sr-only">Wallets</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Manage Wallets</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="verifications"><UserCheck /><span className="sr-only">Verifications</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Manage Verifications</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="messages"><Mail /><span className="sr-only">Messages</span></TabsTrigger></TooltipTrigger><TooltipContent><p>View Messages</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="notifications"><Bell /><span className="sr-only">Notifications</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Admin Notifications</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="bot-settings"><Bot /><span className="sr-only">Bot Settings</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Bot Settings</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="announcements"><Megaphone /><span className="sr-only">Announcements</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Announcements</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="promotions"><Gift /><span className="sr-only">Promotions</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Promotions</p></TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><TabsTrigger value="site-settings"><Settings /><span className="sr-only">Site Settings</span></TabsTrigger></TooltipTrigger><TooltipContent><p>Site Settings</p></TooltipContent></Tooltip>
            </TabsList>
          </TooltipProvider>
          <TabsContent value="wallets" className="mt-6">
            <WalletManager />
          </TabsContent>
          <TabsContent value="verifications" className="mt-6">
            <VerificationManager />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessageViewer />
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <NotificationViewer />
          </TabsContent>
          <TabsContent value="bot-settings" className="mt-6">
            <BotSettingsManager />
          </TabsContent>
           <TabsContent value="announcements" className="mt-6">
            <AnnouncementManager />
          </TabsContent>
           <TabsContent value="promotions" className="mt-6">
            <PromotionManager />
          </TabsContent>
           <TabsContent value="site-settings" className="mt-6">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
