import {ModeratorPanel} from '@/components/moderator/moderator-panel';
import {ModeratorAuth} from '@/components/moderator/moderator-auth';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AstralCore AI - Moderator Panel',
  description: 'Manage the AstralCore Platform.',
};

export default function ModeratorPage() {
  return (
    <main className="min-h-dvh p-4" style={{
      background: 'var(--qn-darker)',
      color: 'var(--qn-light)',
      backgroundImage: `
        radial-gradient(circle at 10% 20%, rgba(110, 0, 255, 0.1) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 20%)
      `
    }}>
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(90deg, var(--qn-primary), var(--qn-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            AstralCore Moderator Panel
          </h1>
          <p style={{color: 'var(--qn-secondary)'}}>
            Moderate the AstralCore Platform
          </p>
        </div>
        <ModeratorAuth>
          <ModeratorPanel />
        </ModeratorAuth>
      </div>
    </main>
  );
}
