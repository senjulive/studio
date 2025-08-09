import { MobileDashboard } from '@/components/mobile/mobile-dashboard';
import { DashboardLayout } from '@/components/layout/mobile-app-layout';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Your crypto trading overview"
      showHeader={false}
    >
      <MobileDashboard />
    </DashboardLayout>
  );
}
