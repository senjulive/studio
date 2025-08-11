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
  Star,
  HelpCircle,
  Info,
  Download,
  Settings,
  BarChart3,
  Zap,
  Globe,
  Bell,
  Lock,
  Cpu,
  DollarSign,
  Megaphone,
  Search,
  Calendar,
  FileText,
  Database,
  Smartphone,
  Headphones,
  MessageCircle,
  Heart,
  Gift,
  Bookmark,
  Target,
  Layers,
  PieChart,
  Activity,
  Briefcase
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  description?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  };
  isNew?: boolean;
  isPro?: boolean;
  isExternal?: boolean;
  download?: string;
  requiredRole?: 'admin' | 'moderator' | 'user';
  requiredTier?: number;
  children?: NavigationItem[];
}

export interface NavigationCategory {
  id: string;
  title: string;
  icon: any;
  description?: string;
  items: NavigationItem[];
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  requiredRole?: 'admin' | 'moderator' | 'user';
  order: number;
}

export const navigationCategories: NavigationCategory[] = [
  {
    id: 'overview',
    title: 'Overview & Analytics',
    icon: Cpu,
    description: 'Main dashboard and key metrics',
    defaultExpanded: true,
    order: 1,
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: Home,
        description: 'Main overview and statistics'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        description: 'Detailed performance metrics',
        isNew: true
      },
      {
        id: 'market',
        label: 'Market',
        href: '/dashboard/market',
        icon: TrendingUp,
        description: 'Real-time market data',
        badge: {
          text: 'Live',
          variant: 'default',
          className: 'bg-green-500 text-white animate-pulse'
        }
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        href: '/dashboard/portfolio',
        icon: PieChart,
        description: 'Your asset distribution'
      }
    ]
  },
  {
    id: 'trading',
    title: 'Trading & AI',
    icon: Bot,
    description: 'AI-powered trading tools',
    defaultExpanded: true,
    order: 2,
    items: [
      {
        id: 'core-trading',
        label: 'CORE AI',
        href: '/dashboard/trading',
        icon: Bot,
        description: 'Advanced AI trading system',
        isPro: true,
        badge: {
          text: 'AI',
          variant: 'default',
          className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
        }
      },
      {
        id: 'trading-history',
        label: 'Trading History',
        href: '/dashboard/trading/history',
        icon: Activity,
        description: 'Your trading performance'
      },
      {
        id: 'strategies',
        label: 'Strategies',
        href: '/dashboard/strategies',
        icon: Target,
        description: 'Custom trading strategies',
        isNew: true
      },
      {
        id: 'signals',
        label: 'AI Signals',
        href: '/dashboard/signals',
        icon: Zap,
        description: 'Real-time trading signals',
        isPro: true
      }
    ]
  },
  {
    id: 'finance',
    title: 'Finance & Wallet',
    icon: DollarSign,
    description: 'Money management',
    defaultExpanded: true,
    order: 3,
    items: [
      {
        id: 'wallet',
        label: 'Wallet',
        href: '/dashboard/wallet',
        icon: CreditCard,
        description: 'Manage your funds'
      },
      {
        id: 'deposit',
        label: 'Deposit',
        href: '/dashboard/deposit',
        icon: ArrowUpRight,
        description: 'Add funds to your account'
      },
      {
        id: 'withdraw',
        label: 'Withdraw',
        href: '/dashboard/withdraw',
        icon: ArrowUpRight,
        description: 'Withdraw your earnings'
      },
      {
        id: 'transactions',
        label: 'Transactions',
        href: '/dashboard/transactions',
        icon: FileText,
        description: 'Transaction history'
      },
      {
        id: 'rewards',
        label: 'Rewards',
        href: '/dashboard/rewards',
        icon: Trophy,
        description: 'Achievements and bonuses',
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
    description: 'Connect with other traders',
    isCollapsible: true,
    order: 4,
    items: [
      {
        id: 'community-blog',
        label: 'Community',
        href: '/dashboard/chat',
        icon: MessageSquare,
        description: 'Community discussions',
        badge: {
          text: '24',
          variant: 'outline'
        }
      },
      {
        id: 'squad',
        label: 'Squad',
        href: '/dashboard/squad',
        icon: Users,
        description: 'Your trading squad'
      },
      {
        id: 'leaderboard',
        label: 'Leaderboard',
        href: '/dashboard/leaderboard',
        icon: Trophy,
        description: 'Top performers',
        isNew: true
      },
      {
        id: 'invite',
        label: 'Invite Friends',
        href: '/dashboard/invite',
        icon: UserPlus,
        description: 'Earn referral rewards',
        badge: {
          text: 'Earn $5',
          variant: 'default',
          className: 'bg-green-500 text-white'
        }
      },
      {
        id: 'social-trading',
        label: 'Social Trading',
        href: '/dashboard/social',
        icon: Heart,
        description: 'Follow successful traders',
        isNew: true
      }
    ]
  },
  {
    id: 'tools',
    title: 'Tools & Utilities',
    icon: Layers,
    description: 'Additional trading tools',
    isCollapsible: true,
    order: 5,
    items: [
      {
        id: 'calculator',
        label: 'Profit Calculator',
        href: '/dashboard/calculator',
        icon: Calculator,
        description: 'Calculate potential profits'
      },
      {
        id: 'screener',
        label: 'Market Screener',
        href: '/dashboard/screener',
        icon: Search,
        description: 'Find trading opportunities'
      },
      {
        id: 'calendar',
        label: 'Economic Calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
        description: 'Important market events'
      },
      {
        id: 'news',
        label: 'Market News',
        href: '/dashboard/news',
        icon: FileText,
        description: 'Latest market updates'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Security',
    icon: User,
    description: 'Manage your account',
    isCollapsible: true,
    order: 6,
    items: [
      {
        id: 'profile',
        label: 'Profile',
        href: '/dashboard/profile',
        icon: User,
        description: 'Personal information'
      },
      {
        id: 'security',
        label: 'Security',
        href: '/dashboard/security',
        icon: Shield,
        description: 'Account security settings',
        badge: {
          text: '!',
          variant: 'destructive'
        }
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        description: 'Notification preferences'
      },
      {
        id: 'inbox',
        label: 'Inbox',
        href: '/dashboard/inbox',
        icon: Mail,
        description: 'Messages and updates',
        badge: {
          text: '5',
          variant: 'outline'
        }
      },
      {
        id: 'settings',
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
        description: 'General preferences'
      }
    ]
  },
  {
    id: 'platform',
    title: 'Platform & Support',
    icon: Globe,
    description: 'Platform information and help',
    isCollapsible: true,
    order: 7,
    items: [
      {
        id: 'promotions',
        label: 'Promotions',
        href: '/dashboard/promotions',
        icon: Star,
        description: 'Special offers and deals',
        isNew: true
      },
      {
        id: 'tiers-ranks',
        label: 'Tiers & Ranks',
        href: '/dashboard/trading-info',
        icon: Trophy,
        description: 'Membership levels'
      },
      {
        id: 'announcements',
        label: 'Announcements',
        href: '/dashboard/announcements',
        icon: Megaphone,
        description: 'Platform updates'
      },
      {
        id: 'education',
        label: 'Education',
        href: '/dashboard/education',
        icon: Briefcase,
        description: 'Learning resources',
        isNew: true
      },
      {
        id: 'support',
        label: 'Support',
        href: '/dashboard/support',
        icon: Headphones,
        description: 'Get help and assistance'
      },
      {
        id: 'feedback',
        label: 'Feedback',
        href: '/dashboard/feedback',
        icon: MessageCircle,
        description: 'Share your thoughts'
      },
      {
        id: 'about',
        label: 'About',
        href: '/dashboard/about',
        icon: Info,
        description: 'Platform information'
      },
      {
        id: 'mobile-app',
        label: 'Mobile App',
        href: '/dashboard/app',
        icon: Smartphone,
        description: 'Download mobile app'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Administration',
    icon: Lock,
    description: 'Admin tools and controls',
    isCollapsible: true,
    requiredRole: 'admin',
    order: 8,
    items: [
      {
        id: 'admin-panel',
        label: 'Admin Panel',
        href: '/admin',
        icon: Shield,
        description: 'Main admin dashboard',
        requiredRole: 'admin'
      },
      {
        id: 'user-management',
        label: 'User Management',
        href: '/admin/users',
        icon: Users,
        description: 'Manage platform users',
        requiredRole: 'admin'
      },
      {
        id: 'system-settings',
        label: 'System Settings',
        href: '/admin/settings',
        icon: Settings,
        description: 'Platform configuration',
        requiredRole: 'admin'
      },
      {
        id: 'moderator-panel',
        label: 'Moderator Panel',
        href: '/moderator',
        icon: Shield,
        description: 'Moderation tools',
        requiredRole: 'moderator'
      }
    ]
  }
];

// Utility functions
export function getNavigationByRole(role: 'admin' | 'moderator' | 'user') {
  return navigationCategories
    .filter(category => !category.requiredRole || category.requiredRole === role || role === 'admin')
    .map(category => ({
      ...category,
      items: category.items.filter(item => 
        !item.requiredRole || item.requiredRole === role || role === 'admin'
      )
    }))
    .sort((a, b) => a.order - b.order);
}

export function getNavigationByTier(tierLevel: number) {
  return navigationCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      !item.requiredTier || item.requiredTier <= tierLevel
    )
  }));
}

export function findNavigationItem(href: string): NavigationItem | null {
  for (const category of navigationCategories) {
    const item = category.items.find(item => item.href === href);
    if (item) return item;
  }
  return null;
}

export function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const item = findNavigationItem(href);
    
    return {
      name: item?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
      current: index === segments.length - 1,
      icon: item?.icon
    };
  });
}

export function getQuickActions() {
  return [
    {
      label: 'Start Trading',
      href: '/dashboard/trading',
      icon: Bot,
      variant: 'default' as const,
      className: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
    },
    {
      label: 'Deposit Funds',
      href: '/dashboard/deposit',
      icon: CreditCard,
      variant: 'outline' as const
    },
    {
      label: 'View Market',
      href: '/dashboard/market',
      icon: TrendingUp,
      variant: 'outline' as const
    },
    {
      label: 'Check Rewards',
      href: '/dashboard/rewards',
      icon: Trophy,
      variant: 'outline' as const
    }
  ];
}

export function getBottomNavItems() {
  return [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/market', icon: TrendingUp, label: 'Market' },
    { href: '/dashboard/trading', icon: Bot, label: 'CORE', isPrimary: true },
    { href: '/dashboard/rewards', icon: Trophy, label: 'Rewards' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' }
  ];
}

// Search functionality
export function searchNavigation(query: string) {
  const results: (NavigationItem & { category: string })[] = [];
  
  navigationCategories.forEach(category => {
    category.items.forEach(item => {
      if (
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({ ...item, category: category.title });
      }
    });
  });
  
  return results;
}
