
import SquadClanChat from '@/components/dashboard/squad-clan-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Squad Clan Chat - AstralCore',
  description: 'Private chat for your squad.',
};

// Use a loose type for Next.js generated props to avoid mismatches with generated PageProps on CI
export default function ClanChatPage({ params }: any) {
  return (
    <div className="space-y-6">
      <SquadClanChat clanId={params?.clanId as string} />
    </div>
  );
}
