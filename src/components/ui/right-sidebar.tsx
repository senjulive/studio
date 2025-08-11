"use client";

import * as React from "react";
import { X, ChevronLeft, Home, BarChart3, Wallet, CreditCard, Users, MessageSquare, Bell, User, Settings, HelpCircle, LogOut, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { AstralLogo } from "@/components/icons/astral-logo";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/trading", label: "CORE", icon: BarChart3 },
  { href: "/dashboard/market", label: "Market", icon: TrendingUp },
  { href: "/dashboard/deposit", label: "Deposit", icon: Wallet },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: CreditCard },
  { href: "/dashboard/squad", label: "Squad", icon: Users },
  { href: "/dashboard/chat", label: "Community", icon: MessageSquare },
  { href: "/dashboard/inbox", label: "Inbox", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/security", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Customer Support", icon: HelpCircle },
];

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const pathname = usePathname();
  const { user, wallet, tier, rank } = useUser();
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);

  // Handle touch events for mobile swipe
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragOffset(touch.clientX);
  }, []);

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = touch.clientX - dragOffset;
    if (diff > 50) {
      onClose();
      setIsDragging(false);
    }
  }, [isDragging, dragOffset, onClose]);

  const handleTouchEnd = React.useCallback(() => {
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  // Calculate total balance
  const balances = wallet?.balances as any;
  const totalBalance = React.useMemo(() => {
    if (!balances) return 0;
    const btcPrice = 68000;
    const ethPrice = 3500;
    return balances.usdt + (balances.btc * btcPrice) + (balances.eth * ethPrice);
  }, [balances]);

  const userDisplayName = wallet?.profile?.displayName || wallet?.profile?.fullName || user?.email?.split('@')[0] || 'User';
  const unreadNotifications = 3; // This would come from notification context

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed right-0 top-0 h-full w-80 z-50",
              "bg-background/80 backdrop-blur-xl border-l border-border/50",
              "shadow-2xl shadow-black/10",
              "flex flex-col"
            )}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AstralLogo className="h-6 w-6" />
                  <span className="font-bold text-lg">AstralCore</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={wallet?.profile?.avatarUrl} />
                  <AvatarFallback>{userDisplayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{userDisplayName}</p>
                  <p className="text-xs text-muted-foreground">${totalBalance.toFixed(2)}</p>
                </div>
                {tier && (
                  <Badge variant="outline" className="text-xs">
                    {tier.name.split(' ').pop()}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-b border-border/50">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-lg font-bold text-green-600">
                    ${(totalBalance * (tier?.dailyProfit || 0.02)).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Daily Earnings</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-lg font-bold text-blue-600">
                    {rank?.name || 'Recruit'}
                  </div>
                  <div className="text-xs text-muted-foreground">Current Rank</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;
                  
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium text-sm">{item.label}</span>
                        
                        {/* Show notification badge for inbox */}
                        {item.href === "/dashboard/inbox" && unreadNotifications > 0 && (
                          <Badge className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {unreadNotifications}
                          </Badge>
                        )}
                        
                        {/* Show active indicator */}
                        {isActive && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 space-y-3">
              {/* Balance Summary */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Portfolio Value</div>
                    <div className="text-lg font-bold text-primary">
                      ${totalBalance.toLocaleString()}
                    </div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Handle logout
                  onClose();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Swipe Indicator */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-20 bg-border/50 rounded-l-full">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-3 h-8 bg-muted-foreground/30 rounded-l-lg flex items-center justify-center">
                <ChevronLeft className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Trigger component for showing the sidebar
export function RightSidebarTrigger({ onOpen }: { onOpen: () => void }) {
  const { user, wallet } = useUser();
  const userDisplayName = wallet?.profile?.displayName || wallet?.profile?.fullName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="fixed right-4 top-4 z-30">
      <Button
        onClick={onOpen}
        variant="secondary"
        size="sm"
        className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src={wallet?.profile?.avatarUrl} />
          <AvatarFallback className="text-xs">{userDisplayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline text-sm">{userDisplayName}</span>
        <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
      </Button>
    </div>
  );
}
