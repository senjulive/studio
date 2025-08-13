import { ModeratorDashboardMobile } from '@/components/moderator/moderator-dashboard-mobile';
import { ModeratorAuth } from '@/components/moderator/moderator-auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AstralCore AI - Moderator Panel',
  description: 'Moderator Panel for Customer Support.',
};

export default function ModeratorPage() {
  return (
    <main className="min-h-dvh bg-background p-4">
      <ModeratorAuth>
        <ModeratorDashboardMobile />
      </ModeratorAuth>
    </main>
  );
}
