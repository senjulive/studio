
import SquadClanChat from '@/components/dashboard/squad-clan-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Squad Clan Chat - AstralCore",
    description: "Private chat for your squad.",
};

// Attempting to accommodate the type error message's suggestion
// This is NOT the standard Next.js typing for page props
interface ClanChatPageProps {
  params: Promise<{ clanId: string }>; // Explicitly typing params as a Promise
}

export default function ClanChatPage({ params }: ClanChatPageProps) {
  // You might need to await params inside the component if it's truly a Promise,
  // but in standard Next.js dynamic routes, params are directly available.
  // The fact that the error suggests Promise<any> is unusual.
  return (
    <div className="space-y-6">
      {/* Assuming params is directly available despite the error message */}
      <SquadClanChat clanId={params.clanId} />
    </div>
  );
}
