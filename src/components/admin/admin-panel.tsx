'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Shield,
  WalletCards,
  Mail,
  Bot,
  Megaphone,
  Settings,
  UserCheck,
  Gift,
  Users,
  Activity,
  LayoutDashboard,
} from 'lucide-react';
import {WalletManager} from './wallet-manager';
import {MessageViewer} from './message-viewer';
import {BotSettingsManager} from './bot-settings-manager';
import {AnnouncementManager} from './announcement-manager';
import {SiteSettingsManager} from './site-settings-manager';
import {VerificationManager} from './verification-manager';
import {PromotionManager} from './promotion-manager';
import {ModeratorManager} from './moderator-manager';
import {ActionLogViewer} from './action-log-viewer';
import { AnalyticsManager } from './analytics/AnalyticsManager';

export function AdminPanel() {
  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
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
        <Tabs defaultValue="analytics" className="w-full">
          <TooltipProvider>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="analytics" className="w-full"><LayoutDashboard className="h-4 w-4 mr-1"/>Dashboard</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Analytics Dashboard</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="wallets" className="w-full"><WalletCards className="h-4 w-4 mr-1"/>Wallets</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Manage User Wallets</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="messages" className="w-full"><Mail className="h-4 w-4 mr-1"/>Messages</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>View Messages</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="verifications" className="w-full"><UserCheck className="h-4 w-4 mr-1"/>Verifications</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Manage Verifications</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="moderators" className="w-full"><Users className="h-4 w-4 mr-1"/>Moderators</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Manage Moderators</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="action-log" className="w-full"><Activity className="h-4 w-4 mr-1"/>Logs</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Moderator Action Log</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="announcements" className="w-full"><Megaphone className="h-4 w-4 mr-1"/>Alerts</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Announcements</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="promotions" className="w-full"><Gift className="h-4 w-4 mr-1"/>Promotions</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Promotions</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="bot-settings" className="w-full"><Bot className="h-4 w-4 mr-1"/>Bot</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Bot Settings</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="site-settings" className="w-full"><Settings className="h-4 w-4 mr-1"/>Site</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Site Settings</p></TooltipContent>
              </Tooltip>
            </TabsList>
          </TooltipProvider>
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsManager />
          </TabsContent>
          <TabsContent value="wallets" className="mt-6">
            <WalletManager />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessageViewer />
          </TabsContent>
          <TabsContent value="verifications" className="mt-6">
            <VerificationManager />
          </TabsContent>
          <TabsContent value="moderators" className="mt-6">
            <ModeratorManager />
          </TabsContent>
          <TabsContent value="action-log" className="mt-6">
            <ActionLogViewer />
          </TabsContent>
          <TabsContent value="announcements" className="mt-6">
            <AnnouncementManager />
          </TabsContent>
          <TabsContent value="promotions" className="mt-6">
            <PromotionManager />
          </TabsContent>
          <TabsContent value="bot-settings" className="mt-6">
            <BotSettingsManager />
          </TabsContent>
          <TabsContent value="site-settings" className="mt-6">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
