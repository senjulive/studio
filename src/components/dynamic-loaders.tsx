import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { AstralLogo } from '@/components/icons/astral-logo';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-4">
      <AstralLogo className="h-8 w-8 animate-pulse text-primary" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

// Dashboard components - lazy loaded
export const TradingBotMobile = dynamic(
  () => import('@/components/dashboard/trading-bot-mobile'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const WalletManagementSystem = dynamic(
  () => import('@/components/dashboard/wallet-management-system'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const AllAssetsChart = dynamic(
  () => import('@/components/dashboard/all-assets-chart'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const MarketView = dynamic(
  () => import('@/components/dashboard/market-view'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const ChatViewMobile = dynamic(
  () => import('@/components/dashboard/chat-view-mobile'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

// Admin components - lazy loaded
export const AdminDashboardMobile = dynamic(
  () => import('@/components/admin/admin-dashboard-mobile'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const UserManager = dynamic(
  () => import('@/components/admin/user-manager'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const AnnouncementManager = dynamic(
  () => import('@/components/admin/announcement-manager'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

// Heavy UI components - lazy loaded
export const RightSidebar = dynamic(
  () => import('@/components/ui/right-sidebar'),
  {
    loading: () => <Skeleton className="w-80 h-full" />,
    ssr: false,
  }
);

export const NotificationBell = dynamic(
  () => import('@/components/dashboard/notification-bell'),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
    ssr: false,
  }
);

// Chart components - lazy loaded for better performance
export const RewardsChart = dynamic(
  () => import('@/components/dashboard/rewards-chart'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const PerformanceChart = dynamic(
  () => import('@/components/dashboard/performance-chart'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

// Forms - lazy loaded
export const DepositViewMobile = dynamic(
  () => import('@/components/dashboard/deposit-view-mobile'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

export const WithdrawViewMobile = dynamic(
  () => import('@/components/dashboard/withdraw-view-mobile'),
  {
    loading: LoadingFallback,
    ssr: false,
  }
);

// Export all for easy importing
export default {
  TradingBotMobile,
  WalletManagementSystem,
  AllAssetsChart,
  MarketView,
  ChatViewMobile,
  AdminDashboardMobile,
  UserManager,
  AnnouncementManager,
  RightSidebar,
  NotificationBell,
  RewardsChart,
  PerformanceChart,
  DepositViewMobile,
  WithdrawViewMobile,
};
