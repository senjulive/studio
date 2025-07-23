
import { SquadClanChat } from '@/components/dashboard/squad-clan-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Squad Clan Chat - AstralCore",
    description: "Private chat for your squad.",
};

export default function ClanChatPage({ params }: { params: { clanId: string } }) {
  return (
    <div className="space-y-6">
      <SquadClanChat clanId={params.clanId} />
    </div>
  );
}
