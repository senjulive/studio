'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AstralLogo } from '@/components/icons/astral-logo';

// Icons
import {
  Home,
  TrendingUp,
  Bot,
  Users,
  MessageSquare,
  UserPlus,
  Trophy,
  CreditCard,
  ArrowUpRight,
  User,
  Shield,
  Mail,
  Megaphone,
  Star,
  HelpCircle,
  Info,
  Download,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Globe,
  Zap,
  DollarSign,
  BarChart3,
  Lock,
  Bell,
  Search,
  Moon,
  Sun
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  };
  isNew?: boolean;
  isPro?: boolean;
  isExternal?: boolean;
  download?: string;
}

export interface NavigationCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  items: NavigationItem[];
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

interface ModernSidebarProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    country?: string;
  };
  rank?: {
    name: string;
    icon: React.ComponentType<any>;
    className?: string;
  };
  tier?: {
    name: string;
    icon: React.ComponentType<any>;
    className?: string;
  };
  balance?: {
    total: number;
    currency: string;
  };
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
  className?: string;
}

const defaultCategories: NavigationCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: Cpu,
    defaultExpanded: true,
    items: [
      {
        id: 'home',
        label: 'Dashboard',
        href: '/dashboard',
        icon: Home
      },
      {
        id: 'market',
        label: 'Market',
        href: '/dashboard/market',
        icon: TrendingUp,
        badge: {
          text: 'Live',
          variant: 'default',
          className: 'bg-green-500 text-white animate-pulse'
        }
      },
      {
        id: 'trading',
        label: 'CORE AI',
        href: '/dashboard/trading',
        icon: Bot,
        isPro: true,
        badge: {
          text: 'AI',
          variant: 'default',
          className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
        }
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        isNew: true
      }
    ]
  },
  {
    id: 'trading',
    title: 'Trading & Finance',
    icon: DollarSign,
    defaultExpanded: true,
    items: [
      {
        id: 'deposit',
        label: 'Deposit',
        href: '/dashboard/deposit',
        icon: CreditCard
      },
      {
        id: 'withdraw',
        label: 'Withdraw',
        href: '/dashboard/withdraw',
        icon: ArrowUpRight
      },
      {
        id: 'rewards',
        label: 'Rewards',
        href: '/dashboard/rewards',
        icon: Trophy,
        badge: {
          text: '3',
          variant: 'secondary',
          className: 'bg-yellow-500 text-white'
        }
      }
    ]
  },
  {
    id: 'community',
    title: 'Community & Social',
    icon: Users,
    defaultExpanded: false,
    isCollapsible: true,
    items: [
      {
        id: 'chat',
        label: 'Community',
        href: '/dashboard/chat',
        icon: MessageSquare,
        badge: {
          text: '12',
          variant: 'outline'
        }
      },
      {
        id: 'squad',
        label: 'Squad',
        href: '/dashboard/squad',
        icon: Users
      },
      {
        id: 'invite',
        label: 'Invite Friends',
        href: '/dashboard/invite',
        icon: UserPlus,
        badge: {
          text: 'Earn $5',
          variant: 'default',
          className: 'bg-green-500 text-white'
        }
      }
    ]
  },
  {
    id: 'account',
    title: 'Account Management',
    icon: User,
    defaultExpanded: false,
    isCollapsible: true,
    items: [
      {
        id: 'profile',
        label: 'Profile',
        href: '/dashboard/profile',
        icon: User
      },
      {
        id: 'security',
        label: 'Security',
        href: '/dashboard/security',
        icon: Shield,
        badge: {
          text: '!',
          variant: 'destructive'
        }
      },
      {
        id: 'inbox',
        label: 'Inbox',
        href: '/dashboard/inbox',
        icon: Mail,
        badge: {
          text: '5',
          variant: 'outline'
        }
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell
      }
    ]
  },
  {
    id: 'platform',
    title: 'Platform & Support',
    icon: Globe,
    defaultExpanded: false,
    isCollapsible: true,
    items: [
      {
        id: 'promotions',
        label: 'Promotions',
        href: '/dashboard/promotions',
        icon: Star,
        isNew: true
      },
      {
        id: 'tiers',
        label: 'Tiers & Ranks',
        href: '/dashboard/trading-info',
        icon: Trophy
      },
      {
        id: 'announcements',
        label: 'Announcements',
        href: '/dashboard/announcements',
        icon: Megaphone
      },
      {
        id: 'support',
        label: 'Support',
        href: '/dashboard/support',
        icon: HelpCircle
      },
      {
        id: 'about',
        label: 'About',
        href: '/dashboard/about',
        icon: Info
      },
      {
        id: 'download',
        label: 'Download App',
        href: '#',
        icon: Download,
        download: 'AstralCore.url',
        isExternal: true
      }
    ]
  }
];

export function ModernSidebar({
  user,
  rank,
  tier,
  balance,
  isCollapsed = false,
  onToggleCollapse,
  onLogout,
  className
}: ModernSidebarProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(defaultCategories.filter(cat => cat.defaultExpanded).map(cat => cat.id))
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return defaultCategories;
    
    return defaultCategories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: '80px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const userInitial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'relative h-screen bg-gradient-to-b from-background via-background/95 to-background/90',
          'border-r border-border/50 backdrop-blur-xl shadow-2xl',
          'flex flex-col overflow-hidden',
          className
        )}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm animate-pulse" />
                    <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-2 rounded-xl border border-primary/20">
                      <AstralLogo className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                      AstralCore
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium">
                      Quantum AI v4.0
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {onToggleCollapse && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* User Profile */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
                    <Avatar className="h-10 w-10 relative border-2 border-primary/20">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                      {user?.country && <span className="text-sm">{user.country}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    {balance && (
                      <p className="text-xs font-medium text-green-600">
                        ${balance.total.toLocaleString()} {balance.currency}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex gap-2 mt-3">
                  {rank && (
                    <Badge variant="outline" className={cn("text-xs flex items-center gap-1", rank.className)}>
                      <rank.icon className="h-3 w-3" />
                      {rank.name}
                    </Badge>
                  )}
                  {tier && (
                    <Badge variant="outline" className={cn("text-xs flex items-center gap-1", tier.className)}>
                      <tier.icon className="h-3 w-3" />
                      {tier.name}
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="mt-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search navigation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-background/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <div className="py-4 space-y-2">
            {filteredCategories.map((category) => (
              <div key={category.id} className="space-y-1">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => category.isCollapsible && toggleCategory(category.id)}
                        className={cn(
                          "w-full justify-start px-3 py-2 h-auto text-xs font-bold text-muted-foreground/60 uppercase tracking-wider",
                          category.isCollapsible && "hover:text-foreground cursor-pointer",
                          !category.isCollapsible && "cursor-default"
                        )}
                      >
                        <category.icon className="h-3 w-3 mr-2" />
                        {category.title}
                        {category.isCollapsible && (
                          <ChevronRight
                            className={cn(
                              "h-3 w-3 ml-auto transition-transform",
                              expandedCategories.has(category.id) && "rotate-90"
                            )}
                          />
                        )}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(!category.isCollapsible || expandedCategories.has(category.id)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {category.items.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        
                        return (
                          <Tooltip key={item.id} delayDuration={isCollapsed ? 300 : 1000}>
                            <TooltipTrigger asChild>
                              <Link
                                href={item.href}
                                download={item.download}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                  isActive
                                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm"
                                    : "hover:bg-accent/50 hover:text-accent-foreground text-muted-foreground"
                                )}
                              >
                                {/* Active indicator */}
                                {isActive && (
                                  <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                  />
                                )}

                                {/* Icon with special effects */}
                                <div className={cn(
                                  "relative flex-shrink-0",
                                  item.isPro && "relative"
                                )}>
                                  {item.isPro && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-md blur-sm animate-pulse" />
                                  )}
                                  <div className={cn(
                                    "relative",
                                    item.isPro && "bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1 rounded-md border border-blue-500/20"
                                  )}>
                                    <item.icon className={cn(
                                      "h-5 w-5 transition-colors",
                                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                  </div>
                                </div>

                                {/* Label */}
                                <AnimatePresence>
                                  {!isCollapsed && (
                                    <motion.div
                                      variants={contentVariants}
                                      initial="collapsed"
                                      animate="expanded"
                                      exit="collapsed"
                                      className="flex-1 flex items-center justify-between min-w-0"
                                    >
                                      <span className={cn(
                                        "font-medium text-sm truncate",
                                        isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
                                      )}>
                                        {item.label}
                                      </span>

                                      {/* Badges and indicators */}
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {item.isNew && (
                                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-500 text-white">
                                            NEW
                                          </Badge>
                                        )}
                                        {item.badge && (
                                          <Badge
                                            variant={item.badge.variant}
                                            className={cn("text-xs px-1.5 py-0.5", item.badge.className)}
                                          >
                                            {item.badge.text}
                                          </Badge>
                                        )}
                                        {isActive && (
                                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className={cn(!isCollapsed && "hidden")}>
                              <div className="flex items-center gap-2">
                                {item.label}
                                {item.badge && (
                                  <Badge variant={item.badge.variant} className="text-xs">
                                    {item.badge.text}
                                  </Badge>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Separator */}
                <Separator className="my-3 bg-border/30" />
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background/50 to-transparent">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="h-8 w-8"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Toggle theme
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Settings
              </TooltipContent>
            </Tooltip>

            {onLogout && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Sign out
                </TooltipContent>
              </Tooltip>
            )}

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-auto"
                >
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">AstralCore</p>
                    <p className="text-xs text-muted-foreground/60">v4.0.1</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse indicator */}
        {isCollapsed && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
              <AstralLogo className="h-5 w-5 text-primary" />
            </div>
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
