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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10">
                            <Shield className="h-8 w-8 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AstralCore Admin
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base">
                                Platform management and oversight system
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Mobile Navigation */}
                    <div className="lg:hidden">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
                            <select
                                value={activeView}
                                onChange={(e) => setActiveView(e.target.value as AdminView)}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Dashboard">Dashboard</option>
                                {Object.entries(adminSections).map(([sectionName, items]) => {
                                    if (sectionName === 'Dashboard') return null;
                                    return Object.entries(items).map(([itemName]) => (
                                        <option key={itemName} value={itemName}>
                                            {sectionName} - {itemName}
                                        </option>
                                    ));
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1 space-y-4">
                        {Object.entries(adminSections).map(([sectionName, items]) => {
                             if(sectionName === 'Dashboard') {
                                const Icon = items.icon;
                                return (
                                    <div key={sectionName} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
                                        <Button
                                            variant={activeView === sectionName ? 'default' : 'outline'}
                                            onClick={() => setActiveView(sectionName as AdminView)}
                                            className={`w-full justify-start gap-2 ${
                                                activeView === sectionName
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0'
                                                    : 'border-white/20 text-white hover:bg-white/10'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {sectionName}
                                        </Button>
                                    </div>
                                )
                             }
                             return (
                                <div key={sectionName} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        {sectionName}
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.entries(items).map(([itemName, itemDetails]) => {
                                            const Icon = itemDetails.icon;
                                            return (
                                                <Button
                                                    key={itemName}
                                                    variant={activeView === itemName ? 'secondary' : 'ghost'}
                                                    onClick={() => setActiveView(itemName as AdminView)}
                                                    className={`w-full justify-start gap-2 text-left ${
                                                        activeView === itemName
                                                            ? 'bg-white/10 text-white'
                                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    <span className="truncate">{itemName}</span>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 min-h-[70vh] overflow-hidden">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
