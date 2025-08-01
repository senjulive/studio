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
  Gift,
  Users,
  Activity,
  LayoutDashboard,
  Banknote,
  ArrowUpFromLine,
  GitBranch,
  UserPlus,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { WalletManager } from './wallet-manager';
import { SupportChatManager } from './support-chat-manager';
import { BotSettingsManager } from './bot-settings-manager';
import { AnnouncementManager } from './announcement-manager';
import { SiteSettingsManager } from './site-settings-manager';
import { VerificationManager } from './verification-manager';
import { PromotionManager } from './promotion-manager';
import { ModeratorManager } from './moderator-manager';
import { ActionLogViewer } from './action-log-viewer';
import { AnalyticsManager } from './analytics/AnalyticsManager';
import { DepositApprovalManager } from './deposit-approval-manager';
import { BotTierSettingsManager } from './bot-tier-settings-manager';
import { WithdrawalManager } from './withdrawal-manager';
import { PublicChatManager } from './public-chat-manager';
import { SquadRewardSettingsManager } from './squad-reward-settings-manager';
import { UserManager } from './user-manager';
import { RewardsManager } from './rewards-manager';
import { MarketingManager } from './marketing-manager';


const adminSections = {
    'Dashboard': { component: <AnalyticsManager />, icon: LayoutDashboard },
    'User Management': {
        'Users': { component: <UserManager />, icon: UserPlus },
        'Wallets': { component: <WalletManager />, icon: WalletCards },
        'Verifications': { component: <VerificationManager />, icon: () => <span className="text-xl">🪪</span> },
        'Moderators': { component: <ModeratorManager />, icon: Users },
    },
    'Platform Activity': {
        'Deposits': { component: <DepositApprovalManager />, icon: Banknote },
        'Withdrawals': { component: <WithdrawalManager />, icon: ArrowUpFromLine },
        'Support Messages': { component: <SupportChatManager />, icon: Mail },
        'Public Chat': { component: <PublicChatManager />, icon: Users },
        'Action Log': { component: <ActionLogViewer />, icon: Activity },
    },
    'Content & Engagement': {
        'Alerts': { component: <AnnouncementManager />, icon: Megaphone },
        'Promotions': { component: <PromotionManager />, icon: Gift },
        'Rewards': { component: <RewardsManager />, icon: Trophy },
        'Marketing': { component: <MarketingManager />, icon: TrendingUp },
    },
    'Platform Settings': {
        'General Settings': { component: <SiteSettingsManager />, icon: Settings },
        'Bot & Tier Settings': { component: <BotTierSettingsManager />, icon: Bot },
        'Squad & Rewards': { component: <SquadRewardSettingsManager />, icon: GitBranch },
    }
} as const;


type AdminView = keyof (typeof adminSections)['User Management'] | 
                 keyof (typeof adminSections)['Platform Activity'] |
                 keyof (typeof adminSections)['Content & Engagement'] |
                 keyof (typeof adminSections)['Platform Settings'] |
                 'Dashboard';


export function AdminPanel() {
    const [activeView, setActiveView] = React.useState<AdminView>('Dashboard');

    const renderContent = () => {
        if (activeView === 'Dashboard') {
            return adminSections.Dashboard.component;
        }
        for (const section of Object.values(adminSections)) {
            if (typeof section === 'object' && activeView in section) {
                 // @ts-ignore
                return section[activeView].component;
            }
        }
        return null;
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
                        <CardDescription>Platform management and user oversight system.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-3 lg:col-span-2 space-y-4">
                        {Object.entries(adminSections).map(([sectionName, items]) => {
                             if(sectionName === 'Dashboard') {
                                const Icon = items.icon;
                                return (
                                    <Button
                                        key={sectionName}
                                        variant={activeView === sectionName ? 'default' : 'outline'}
                                        onClick={() => setActiveView(sectionName as AdminView)}
                                        className="w-full justify-start gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {sectionName}
                                    </Button>
                                )
                             }
                             return (
                                <div key={sectionName}>
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">{sectionName}</h3>
                                    <div className="space-y-1">
                                    {Object.entries(items).map(([itemName, itemDetails]) => {
                                        const Icon = itemDetails.icon;
                                        return (
                                            <Button
                                                key={itemName}
                                                variant={activeView === itemName ? 'secondary' : 'ghost'}
                                                onClick={() => setActiveView(itemName as AdminView)}
                                                className="w-full justify-start gap-2"
                                            >
                                                <Icon className="h-4 w-4" />
                                                {itemName}
                                            </Button>
                                        )
                                    })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="col-span-12 md:col-span-9 lg:col-span-10">
                        <Card className="min-h-[70vh]">
                            <CardContent className="p-6">
                                {renderContent()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
