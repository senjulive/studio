--
-- RLS POLICIES
--

-- Ensure this file is idempotent, so it can be run multiple times
DROP POLICY IF EXISTS "Allow individual user access to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read squad leader profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to manage their own chat messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admins to access all messages" ON public.messages;
DROP POLICY IF EXISTS "Allow users to manage their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow admins to access all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow users to access their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Allow admins to access all wallets" ON public.wallets;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.promotions;
DROP POLICY IF EXISTS "Deny all access to promotions for non-admins" ON public.promotions;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.settings;
DROP POLICY IF EXISTS "Deny all access to settings for non-admins" ON public.settings;
DROP POLICY IF EXISTS "Allow moderators to read all action logs" ON public.action_logs;
DROP POLICY IF EXISTS "Allow moderators to insert their own action logs" ON public.action_logs;
DROP POLICY IF EXISTS "Allow admin full access" ON public.action_logs;
DROP POLICY IF EXISTS "Allow moderators to manage support threads" ON public.support_threads;
DROP POLICY IF EXISTS "Allow admin full access" ON public.support_threads;

-- Helper function to check for admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT auth.jwt()->>'email') = (
    SELECT value->>0 FROM public.settings WHERE key = 'adminEmail' LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual user access to their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to read squad leader profiles" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow admin full access" ON public.profiles
  FOR ALL USING (is_admin());

-- MESSAGES TABLE
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to manage their own chat messages" ON public.messages
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow admins to access all messages" ON public.messages
  FOR ALL USING (is_admin());

-- NOTIFICATIONS TABLE
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to manage their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow admins to access all notifications" ON public.notifications
  FOR ALL USING (is_admin());

-- WALLETS TABLE
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to access their own wallet" ON public.wallets
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow admins to access all wallets" ON public.wallets
  FOR ALL USING (is_admin());

-- PROMOTIONS TABLE
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON public.promotions
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Deny all access to promotions for non-admins" ON public.promotions
  FOR ALL USING (is_admin());
  
-- SETTINGS TABLE
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all authenticated users" ON public.settings
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Deny all access to settings for non-admins" ON public.settings
  FOR ALL USING (is_admin());

-- ACTION_LOGS TABLE
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow moderators to read all action logs" ON public.action_logs
  FOR SELECT USING (auth.role() = 'authenticated'); -- Simplified for moderator/admin access
CREATE POLICY "Allow moderators to insert their own action logs" ON public.action_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow admin full access" ON public.action_logs
  FOR ALL USING (is_admin());

-- SUPPORT_THREADS TABLE
ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow moderators to manage support threads" ON public.support_threads
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access" ON public.support_threads
  FOR ALL USING (is_admin());
