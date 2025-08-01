import {ModeratorPanel} from '@/components/moderator/moderator-panel';
import {ModeratorAuth} from '@/components/moderator/moderator-auth';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AstralCore AI - Moderator Panel',
  description: 'Manage the AstralCore Platform.',
};

export default function ModeratorPage() {
  return (
    <ModeratorAuth>
      <ModeratorPanel />
    </ModeratorAuth>
  );
}
