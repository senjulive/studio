'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import { AstralLogo } from '@/components/icons/astral-logo';

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Settings,
  LogOut,
  Moon,
  Sun,
  Zap,
  TrendingUp,
  ChevronDown
} from 'lucide-react';

interface EnhancedModernSidebarProps {
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
  onLogout?: () => void;
  className?: string;
}

export function EnhancedModernSidebar({
  user,
  rank,
  tier,
  balance,
  onLogout,
  className
}: EnhancedModernSidebarProps) {
  const {
    categories,
    currentItem,
    expandedCategories,
    searchQuery,
    searchResults,
    isSearching,
    sidebarCollapsed,
    toggleCategory,
    setSearchQuery,
    setSidebarCollapsed,
    clearSearch
  } = useNavigation();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const sidebarVariants = {
    expanded: {
      width: '320px',
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

  const renderNavigationItems = (items: any[], categoryId: string) => {
    return items.map((item) => {
      const isActive = currentItem?.id === item.id;
      const isHovered = hoveredItem === item.id;
      
      return (
        <Tooltip key={item.id} delayDuration={sidebarCollapsed ? 300 : 1000}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              download={item.download}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                "hover:shadow-lg hover:scale-[1.02] transform-gpu",
                isActive
                  ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/20"
                  : "hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground text-muted-foreground"
              )}
            >
              {/* Animated background effect */}
              <AnimatePresence>
                {(isActive || isHovered) && (
                  <motion.div
                    layoutId={isActive ? "activeBackground" : "hoverBackground"}
                    className={cn(
                      "absolute inset-0 rounded-xl",
                      isActive 
                        ? "bg-gradient-to-r from-primary/10 to-primary/5" 
                        : "bg-gradient-to-r from-accent/20 to-accent/10"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with special effects */}
              <div className={cn(
                "relative flex-shrink-0 z-10",
                item.isPro && "relative"
              )}>
                {item.isPro && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg blur-sm animate-pulse" />
                )}
                <div className={cn(
                  "relative transition-transform duration-300",
                  item.isPro && "bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-1.5 rounded-lg border border-blue-500/20",
                  isHovered && "scale-110"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isActive ? "text-primary drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground",
                    isHovered && "rotate-6"
                  )} />
                </div>
              </div>

              {/* Label and badges */}
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="flex-1 flex items-center justify-between min-w-0 z-10"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold text-sm truncate transition-colors duration-300",
                          isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
                        )}>
                          {item.label}
                        </span>
                        {item.isNew && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0"
                          >
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-green-500 text-white animate-pulse">
                              NEW
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      {item.description && !sidebarCollapsed && (
                        <p className="text-xs text-muted-foreground/80 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.badge && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Badge
                            variant={item.badge.variant}
                            className={cn("text-xs px-1.5 py-0.5", item.badge.className)}
                          >
                            {item.badge.text}
                          </Badge>
                        </motion.div>
                      )}
                      {isActive && (
                        <motion.div
                          className="w-2 h-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className={cn(!sidebarCollapsed && "hidden")}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {item.label}
                {item.badge && (
                  <Badge variant={item.badge.variant} className="text-xs">
                    {item.badge.text}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    });
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        className={cn(
          'relative h-screen bg-gradient-to-b from-background via-background/98 to-background/95',
          'border-r border-border/50 backdrop-blur-xl shadow-2xl',
          'flex flex-col overflow-hidden',
          className
        )}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex items-center gap-3"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm animate-pulse" />
                    <div className="relative bg-gradient-to-br from-primary/15 to-primary/5 p-3 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                      <AstralLogo className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                      AstralCore
                    </h1>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Quantum AI v4.1
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                >
                  {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* User Profile */}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-border/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
                    <Avatar className="h-12 w-12 relative border-2 border-primary/20 group-hover:scale-105 transition-transform duration-300">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{user?.name || 'User'}</p>
                      {user?.country && <span className="text-base">{user.country}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-medium">{user?.email}</p>
                    {balance && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <p className="text-xs font-bold text-green-600">
                            ${balance.total.toLocaleString()} {balance.currency}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex gap-2 mt-3">
                  {rank && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Badge variant="outline" className={cn("text-xs flex items-center gap-1 border-opacity-50 bg-opacity-10", rank.className)}>
                        <rank.icon className="h-3 w-3" />
                        <span className="font-medium">{rank.name}</span>
                      </Badge>
                    </motion.div>
                  )}
                  {tier && (
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Badge variant="outline" className={cn("text-xs flex items-center gap-1 border-opacity-50 bg-opacity-10", tier.className)}>
                        <tier.icon className="h-3 w-3" />
                        <span className="font-medium">{tier.name}</span>
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="mt-4"
              >
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2 transition-colors group-hover:text-primary" />
                  <input
                    type="text"
                    placeholder="Search navigation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-sm bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 hover:border-primary/30"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 h-8 w-8 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <div className="py-4 space-y-1">
            <AnimatePresence>
              {isSearching ? (
                // Search results
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-2"
                >
                  {!sidebarCollapsed && (
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                        Search Results ({searchResults.length})
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1">
                    {searchResults.map((item) => (
                      <div key={item.id}>
                        {renderNavigationItems([item], 'search')}
                      </div>
                    ))}
                  </div>
                  {searchResults.length === 0 && !sidebarCollapsed && (
                    <div className="px-3 py-8 text-center">
                      <p className="text-sm text-muted-foreground">No results found</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                // Regular navigation
                categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-1"
                  >
                    <AnimatePresence>
                      {!sidebarCollapsed && (
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
                              "w-full justify-start px-3 py-3 h-auto text-xs font-bold text-muted-foreground/60 uppercase tracking-wider hover:bg-primary/5 rounded-xl transition-all duration-300",
                              category.isCollapsible && "hover:text-foreground cursor-pointer group",
                              !category.isCollapsible && "cursor-default"
                            )}
                          >
                            <category.icon className="h-4 w-4 mr-2 transition-colors group-hover:text-primary" />
                            <span className="flex-1 text-left">{category.title}</span>
                            {category.isCollapsible && (
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 transition-all duration-300 group-hover:text-primary",
                                  expandedCategories.has(category.id) && "rotate-180"
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
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="space-y-1 overflow-hidden"
                        >
                          {renderNavigationItems(category.items, category.id)}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {index < categories.length - 1 && (
                      <div className="my-6">
                        <Separator className="bg-border/30" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
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
                  className="h-9 w-9 hover:bg-primary/10 transition-all duration-300"
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
                  className="h-9 w-9 hover:bg-primary/10 transition-all duration-300"
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
                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
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
              {!sidebarCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-auto"
                >
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">AstralCore</p>
                    <p className="text-xs text-muted-foreground/60">v4.1.0</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse indicator */}
        {sidebarCollapsed && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center shadow-lg"
            >
              <AstralLogo className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
