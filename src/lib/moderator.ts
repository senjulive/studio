'use server';

import {createClient} from './supabase/server';
import {createAdminClient} from './supabase/admin';

export type ActionLog = {
  id: string;
  created_at: string;
  user_id: string;
  action: string;
  user: {username: string} | null;
};

export async function getModeratorStatus(
  userId: string
): Promise<{status: string; permissions: any} | null> {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'moderators')
    .single();

  if (error || !data || !Array.isArray(data.value)) {
    return null;
  }

  const moderator = data.value.find(mod => mod.userId === userId);
  if (!moderator) {
    return null;
  }

  return {status: moderator.status, permissions: moderator.permissions};
}

export async function logModeratorAction(
  action: string,
  metadata?: any
): Promise<void> {
  const supabase = createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) return;

  // Check if the user is the admin.
  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const actorId = isAdmin ? user.id : user.id;

  const {error} = await supabase.from('action_logs').insert({
    user_id: actorId,
    action,
    metadata,
  });

  if (error) {
    console.error('Failed to log moderator action:', error);
  }
}
