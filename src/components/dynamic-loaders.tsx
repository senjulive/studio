// Dynamic component loaders for performance optimization
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
    <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
  </div>
);

// Heavy chart components - load on demand
export const TradingChart = dynamic(
  () => import('@/components/dashboard/trading-bot-animations').then(mod => ({
    default: mod.AnimatedTradingBot
  })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Disable SSR for chart components
  }
);

export const WalletManagement = dynamic(
  () => import('@/components/dashboard/wallet-management-system'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const AdminDashboard = dynamic(
  () => import('@/components/admin/admin-dashboard-mobile'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const ModeratorDashboard = dynamic(
  () => import('@/components/moderator/moderator-dashboard-mobile'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const TradingBotMobile = dynamic(
  () => import('@/components/dashboard/trading-bot-mobile'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Chat components
export const ChatViewMobile = dynamic(
  () => import('@/components/dashboard/chat-view-mobile'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Market components
export const MarketViewMobile = dynamic(
  () => import('@/components/dashboard/market-view-mobile'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// 3D and animation heavy components
export const ThreeJSComponent = dynamic(
  () => import('@/components/dashboard/three-js-component').catch(() => ({
    default: () => <div>3D component unavailable</div>
  })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// QR Code component
export const QRCodeGenerator = dynamic(
  () => import('qrcode.react').then(mod => ({
    default: mod.QRCodeCanvas
  })),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Form components with validation
export const HeavyForm = dynamic(
  () => import('react-hook-form').then(mod => ({
    default: mod.useForm
  })),
  {
    loading: () => <LoadingSpinner />,
    ssr: true, // Forms can be SSR'd
  }
);

// Export all for easier imports
export const DynamicComponents = {
  TradingChart,
  WalletManagement,
  AdminDashboard,
  ModeratorDashboard,
  TradingBotMobile,
  ChatViewMobile,
  MarketViewMobile,
  ThreeJSComponent,
  QRCodeGenerator,
};

// Helper function to create dynamic imports with consistent loading states
export function createDynamicComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loadingComponent?: React.ComponentType;
    ssr?: boolean;
    suspense?: boolean;
  } = {}
) {
  const {
    loadingComponent = LoadingSpinner,
    ssr = false,
    suspense = false,
  } = options;

  return dynamic(importFn, {
    loading: loadingComponent,
    ssr,
    suspense,
  });
}
