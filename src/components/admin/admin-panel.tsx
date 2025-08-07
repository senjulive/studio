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
import { SlideshowImageManager } from './slideshow-image-manager';
import { RewardsAdminManager } from './rewards-admin-manager';
import { NotificationsAdminManager } from './notifications-admin-manager';
import { DepositsAdminManager } from './deposits-admin-manager';
import { WithdrawalsAdminManager } from './withdrawals-admin-manager';
import {
  Bell,
  ArrowDownCircle,
  ArrowUpCircle,
  CreditCard,
  TrendingUp,
  PieChart,
  FileText
} from 'lucide-react';

const adminSections = {
    'Dashboard': { component: <AnalyticsManager />, icon: LayoutDashboard },
    'User Management': {
        'Users': { component: <UserManager />, icon: UserPlus },
        'Wallets': { component: <WalletManager />, icon: WalletCards },
        'Verifications': { component: <VerificationManager />, icon: Shield },
        'Moderators': { component: <ModeratorManager />, icon: Users },
    },
    'Financial Operations': {
        'Deposits Manager': { component: <DepositsAdminManager />, icon: ArrowDownCircle },
        'Withdrawals Manager': { component: <WithdrawalsAdminManager />, icon: ArrowUpCircle },
        'Legacy Deposits': { component: <DepositApprovalManager />, icon: Banknote },
        'Legacy Withdrawals': { component: <WithdrawalManager />, icon: ArrowUpFromLine },
    },
    'Communications': {
        'Notifications Manager': { component: <NotificationsAdminManager />, icon: Bell },
        'Support Messages': { component: <SupportChatManager />, icon: Mail },
        'Public Chat': { component: <PublicChatManager />, icon: Users },
        'Alerts': { component: <AnnouncementManager />, icon: Megaphone },
    },
    'Content & Engagement': {
        'Promotions': { component: <PromotionManager />, icon: Gift },
        'Rewards System': { component: <RewardsAdminManager />, icon: TrendingUp },
        'Slideshow Images': { component: <SlideshowImageManager />, icon: FileText },
        'Action Log': { component: <ActionLogViewer />, icon: Activity },
    },
    'Platform Settings': {
        'General Settings': { component: <SiteSettingsManager />, icon: Settings },
        'Bot & Tier Settings': { component: <BotTierSettingsManager />, icon: Bot },
        'Squad & Rewards': { component: <SquadRewardSettingsManager />, icon: GitBranch },
    }
} as const;


type AdminView = keyof (typeof adminSections)['User Management'] |
                 keyof (typeof adminSections)['Financial Operations'] |
                 keyof (typeof adminSections)['Communications'] |
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
