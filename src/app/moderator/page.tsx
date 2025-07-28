import {ModeratorPanel} from '@/components/moderator/moderator-panel';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AstralCore AI - Moderator Panel',
  description: 'Manage the AstralCore Platform.',
};

export default function ModeratorPage() {
  return (
    <main className="min-h-dvh bg-secondary p-4">
      <ModeratorPanel />
    </main>
  );
}
