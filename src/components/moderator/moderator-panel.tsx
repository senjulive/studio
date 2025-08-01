'use client';

import * as React from 'react';
import {
  Shield,
  Mail,
  Banknote,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard, FeatureCard, StatCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Import moderator managers
import { VerificationManager } from '@/components/admin/verification-manager';
import { DepositManager } from './deposit-manager';
import { SupportManager } from './support-manager';
import { useModerator } from '@/contexts/ModeratorContext';

const VerificationIcon = () => <span className="text-xl">🪪</span>;

export function ModeratorPanel() {
  const { permissions } = useModerator();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const availableTabs = [
    {
      id: 'support',
      label: 'Support',
      icon: Mail,
      condition: permissions?.customer_support,
      component: <SupportManager />,
      badge: '3',
      description: 'Handle customer inquiries',
    },
    {
      id: 'verifications',
      label: 'Verifications',
      icon: VerificationIcon,
      condition: permissions?.user_verification,
      component: <VerificationManager />,
      badge: 'New',
      description: 'Review user documents',
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: Banknote,
      condition: permissions?.deposit_approval,
      component: <DepositManager />,
      badge: 'Pending',
      description: 'Approve transactions',
    },
  ].filter(tab => tab.condition);

  const getThemeVariant = () => {
    switch (theme) {
      case 'crypto': return 'crypto';
      case 'gaming': return 'gaming';
      case 'volcanic': return 'warning';
      default: return 'gradient';
    }
  };

  if (availableTabs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GlassCard variant="danger" className="max-w-md text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">No Permissions</h2>
              <p className="text-muted-foreground">
                You do not have any active moderation permissions. Please contact an administrator.
              </p>
            </div>
            <Button variant="outline" className="w-full">
              Contact Admin
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

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
              <h1 className="font-semibold text-lg">Moderator Panel</h1>
              <p className="text-xs text-muted-foreground">Platform Moderation</p>
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
                Moderator Panel
              </h1>
              <p className="text-sm text-muted-foreground">Platform Moderation Tools</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                title="Active"
                value={availableTabs.length.toString()}
                icon={Activity}
                variant="success"
                size="sm"
              />
              <StatCard
                title="Status"
                value="Online"
                icon={CheckCircle2}
                variant="crypto"
                size="sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center gap-2 px-2 mb-4">
              <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Moderation Tools
              </h3>
              <div className="h-px bg-gradient-to-l from-primary/50 to-transparent flex-1" />
            </div>

            {availableTabs.map((tab) => (
              <FeatureCard
                key={tab.id}
                title={tab.label}
                description={tab.description}
                icon={tab.icon}
                badge={tab.badge}
                variant={getThemeVariant()}
                className="cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <GlassCard variant="crypto" size="sm" className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">Secure Moderation</span>
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
            <GlassCard variant={getThemeVariant()}>
              <Tabs defaultValue={availableTabs[0].id} className="w-full">
                {/* Tab Navigation */}
                <div className="border-b border-border/50 pb-4 mb-6">
                  <TabsList className={cn(
                    "grid w-full gap-2 bg-background/50 p-1",
                    {
                      "grid-cols-1": availableTabs.length === 1,
                      "grid-cols-2": availableTabs.length === 2,
                      "grid-cols-3": availableTabs.length === 3,
                    }
                  )}>
                    {availableTabs.map(tab => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                      >
                        <tab.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.badge && (
                          <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs">
                            {tab.badge}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Tab Content */}
                {availableTabs.map(tab => (
                  <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                          <tab.icon className="h-6 w-6 text-primary" />
                          {tab.label}
                        </h2>
                        <p className="text-muted-foreground mt-1">{tab.description}</p>
                      </div>
                      {tab.badge && (
                        <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                          {tab.badge} items
                        </Badge>
                      )}
                    </div>
                    
                    <div className="min-h-[50vh]">
                      {tab.component}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
