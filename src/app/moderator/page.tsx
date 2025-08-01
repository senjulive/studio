import { redirect } from 'next/navigation';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'AstralCore AI - Dashboard',
  description: 'Access the AstralCore Platform.',
};

export default function ModeratorPage() {
  // Moderator panel is disabled - redirect to dashboard
  redirect('/dashboard');
}
