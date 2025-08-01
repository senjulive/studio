'use client';

import * as React from 'react';
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
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard, FeatureCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Import all admin managers
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

const adminSections = {
    'Dashboard': { component: <AnalyticsManager />, icon: LayoutDashboard, badge: 'Live' },
    'User Management': {
        'Wallets': { component: <WalletManager />, icon: WalletCards, badge: 'Active' },
        'Verifications': { component: <VerificationManager />, icon: () => <span className="text-xl">🪪</span>, badge: 'New' },
        'Moderators': { component: <ModeratorManager />, icon: Users },
    },
    'Platform Activity': {
        'Deposits': { component: <DepositApprovalManager />, icon: Banknote, badge: 'Pending' },
        'Withdrawals': { component: <WithdrawalManager />, icon: ArrowUpFromLine },
        'Support Messages': { component: <SupportChatManager />, icon: Mail, badge: '3' },
        'Public Chat': { component: <PublicChatManager />, icon: Users },
        'Action Log': { component: <ActionLogViewer />, icon: Activity },
    },
    'Content & Engagement': {
        'Alerts': { component: <AnnouncementManager />, icon: Megaphone },
        'Promotions': { component: <PromotionManager />, icon: Gift },
    },
    'Platform Settings': {
        'General Settings': { component: <SiteSettingsManager />, icon: Settings },
        'Bot & Tier Settings': { component: <BotSettingsManager />, icon: Bot },
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
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const { theme } = useTheme();

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

    const getThemeVariant = () => {
        switch (theme) {
            case 'crypto': return 'crypto';
            case 'gaming': return 'gaming';
            case 'volcanic': return 'warning';
            default: return 'gradient';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg">Admin Panel</h1>
                            <p className="text-xs text-muted-foreground">Platform Management</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="h-8 w-8"
                    >
                        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className={cn(
                    "fixed inset-y-0 left-0 z-40 w-80 bg-background/95 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center gap-3 p-6 border-b border-border/50">
                        <div className="bg-primary/10 p-3 rounded-xl">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                AstralCore AI
                            </h1>
                            <p className="text-sm text-muted-foreground">Admin Control Center</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {Object.entries(adminSections).map(([sectionName, items]) => {
                            if(sectionName === 'Dashboard') {
                                const Icon = items.icon;
                                return (
                                    <FeatureCard
                                        key={sectionName}
                                        title={sectionName}
                                        description="Platform overview"
                                        icon={Icon}
                                        badge={items.badge}
                                        variant={getThemeVariant()}
                                        className={cn(
                                            "cursor-pointer transition-all duration-200",
                                            activeView === sectionName && "ring-2 ring-primary/50"
                                        )}
                                        onClick={() => {
                                            setActiveView(sectionName as AdminView);
                                            setSidebarOpen(false);
                                        }}
                                        action={
                                            activeView === sectionName && (
                                                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                                                    Active
                                                </Badge>
                                            )
                                        }
                                    />
                                )
                            }
                            
                            return (
                                <div key={sectionName} className="space-y-3">
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {sectionName}
                                        </h3>
                                        <div className="h-px bg-gradient-to-l from-primary/50 to-transparent flex-1" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {Object.entries(items).map(([itemName, itemDetails]) => {
                                            const Icon = itemDetails.icon;
                                            const isActive = activeView === itemName;
                                            
                                            return (
                                                <Button
                                                    key={itemName}
                                                    variant={isActive ? 'default' : 'ghost'}
                                                    onClick={() => {
                                                        setActiveView(itemName as AdminView);
                                                        setSidebarOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full justify-between group h-auto p-3",
                                                        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className="h-4 w-4" />
                                                        <span className="font-medium">{itemName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {itemDetails.badge && (
                                                            <Badge 
                                                                variant="secondary" 
                                                                className="text-xs h-5 px-2"
                                                            >
                                                                {itemDetails.badge}
                                                            </Badge>
                                                        )}
                                                        <ChevronRight className={cn(
                                                            "h-3 w-3 transition-transform",
                                                            isActive && "rotate-90"
                                                        )} />
                                                    </div>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border/50">
                        <GlassCard variant="crypto" size="sm" className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="font-medium">Quantum Secured</span>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    <div className="p-4 lg:p-6">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <span>Admin</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-foreground font-medium">{activeView}</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                                {activeView}
                            </h2>
                        </div>

                        {/* Content */}
                        <GlassCard variant={getThemeVariant()} className="min-h-[70vh]">
                            <div className="p-6">
                                {renderContent()}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
