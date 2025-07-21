
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Banknote,
} from 'lucide-react';
import { WalletManager } from './wallet-manager';
import { MessageViewer } from './message-viewer';
import { BotSettingsManager } from './bot-settings-manager';
import { AnnouncementManager } from './announcement-manager';
import { SiteSettingsManager } from './site-settings-manager';
import { VerificationManager } from './verification-manager';
import { PromotionManager } from './promotion-manager';
import { ModeratorManager } from './moderator-manager';
import { ActionLogViewer } from './action-log-viewer';
import { AnalyticsManager } from './analytics/AnalyticsManager';
import { DepositApprovalManager } from './deposit-approval-manager';

type AdminView =
  | 'analytics'
  | 'wallets'
  | 'messages'
  | 'deposits'
  | 'verifications'
  | 'moderators'
  | 'action-log'
  | 'announcements'
  | 'promotions'
  | 'bot-settings'
  | 'site-settings';

const adminTabs = [
    { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard, component: <AnalyticsManager /> },
    { id: 'wallets', label: 'Wallets', icon: WalletCards, component: <WalletManager /> },
    { id: 'messages', label: 'Messages', icon: Mail, component: <MessageViewer /> },
    { id: 'deposits', label: 'Deposits', icon: Banknote, component: <DepositApprovalManager /> },
    { id: 'verifications', label: 'Verifications', icon: UserCheck, component: <VerificationManager /> },
    { id: 'moderators', label: 'Moderators', icon: Users, component: <ModeratorManager /> },
    { id: 'action-log', label: 'Action Log', icon: Activity, component: <ActionLogViewer /> },
    { id: 'announcements', label: 'Alerts', icon: Megaphone, component: <AnnouncementManager /> },
    { id: 'promotions', label: 'Promotions', icon: Gift, component: <PromotionManager /> },
    { id: 'bot-settings', label: 'Bot Settings', icon: Bot, component: <BotSettingsManager /> },
    { id: 'site-settings', label: 'Site Settings', icon: Settings, component: <SiteSettingsManager /> },
] as const;

export function AdminPanel() {
    const [activeView, setActiveView] = React.useState<AdminView>('analytics');

    const renderContent = () => {
        const activeTab = adminTabs.find(tab => tab.id === activeView);
        return activeTab ? activeTab.component : null;
    };

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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {adminTabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <Button
                        key={tab.id}
                        variant={activeView === tab.id ? 'default' : 'outline'}
                        onClick={() => setActiveView(tab.id)}
                        className="h-auto py-4 flex flex-col gap-2 items-center justify-center text-center"
                    >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{tab.label}</span>
                    </Button>
                );
            })}
        </div>
        <div>
            {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}
