'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  Info,
  DollarSign,
  Bot,
  Users,
  Settings,
  Trash2,
  MarkAsUnread,
  Filter,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'trading' | 'deposits' | 'withdrawals' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    category: 'trading',
    title: 'Trade Completed',
    message: 'Your BTC/USDT trade was executed successfully with a profit of $45.67',
    timestamp: '2024-01-15T12:30:00Z',
    read: false,
    priority: 'medium',
    actionUrl: '/dashboard/trading'
  },
  {
    id: '2',
    type: 'info',
    category: 'deposits',
    title: 'Deposit Confirmed',
    message: 'Your deposit of 500 USDT has been confirmed and added to your balance',
    timestamp: '2024-01-15T11:45:00Z',
    read: false,
    priority: 'low'
  },
  {
    id: '3',
    type: 'warning',
    category: 'trading',
    title: 'Bot Paused',
    message: 'Your trading bot has been paused due to low balance. Please add funds to continue.',
    timestamp: '2024-01-15T10:20:00Z',
    read: true,
    priority: 'high',
    actionUrl: '/dashboard/deposit'
  },
  {
    id: '4',
    type: 'info',
    category: 'system',
    title: 'New Feature Available',
    message: 'Check out our new advanced analytics dashboard for better trading insights',
    timestamp: '2024-01-15T09:15:00Z',
    read: true,
    priority: 'low'
  },
  {
    id: '5',
    type: 'success',
    category: 'withdrawals',
    title: 'Withdrawal Processed',
    message: 'Your withdrawal of 0.01 BTC has been processed and sent to your wallet',
    timestamp: '2024-01-14T16:30:00Z',
    read: true,
    priority: 'medium'
  },
  {
    id: '6',
    type: 'info',
    category: 'social',
    title: 'New Squad Member',
    message: 'CryptoTrader123 has joined your squad. Welcome them to the team!',
    timestamp: '2024-01-14T14:20:00Z',
    read: true,
    priority: 'low'
  }
];

export function NotificationCenterMobile() {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || (filter === 'unread' && !notification.read);
    const matchesCategoryFilter = categoryFilter === 'all' || notification.category === categoryFilter;
    return matchesReadFilter && matchesCategoryFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared.",
    });
  };

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case 'trading':
        return <Bot className="w-5 h-5" />;
      case 'deposits':
      case 'withdrawals':
        return <DollarSign className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'system':
        return <Settings className="w-5 h-5" />;
      default:
        return type === 'success' ? <CheckCircle className="w-5 h-5" /> :
               type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
               <Info className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-orange-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const categories = [
    { id: 'all', label: 'All', icon: <Bell className="w-4 h-4" /> },
    { id: 'trading', label: 'Trading', icon: <Bot className="w-4 h-4" /> },
    { id: 'deposits', label: 'Deposits', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mobile-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center electric-glow">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-6 min-w-[24px]">
                {unreadCount}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs"
            >
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="text-xs text-red-400 border-red-400/50"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mobile-card">
        <div className="p-4">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all min-w-fit text-xs",
                  categoryFilter === category.id
                    ? "border-primary bg-primary/10 electric-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="mobile-card">
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No notifications found</p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "mobile-card transition-all",
                !notification.read && "border-primary/30 bg-primary/5"
              )}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    notification.read ? "bg-muted/50" : "bg-primary/20 electric-glow"
                  )}>
                    <div className={getNotificationColor(notification.type)}>
                      {getNotificationIcon(notification.type, notification.category)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={cn(
                          "font-semibold text-sm",
                          !notification.read && "text-foreground"
                        )}>
                          {notification.title}
                        </h3>
                        <p className="text-xs text-muted-foreground capitalize">
                          {notification.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs h-4">
                            High
                          </Badge>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {!notification.read ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsUnread(notification.id)}
                          >
                            <MarkAsUnread className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-400 hover:text-red-300"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
