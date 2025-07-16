-- Enable RLS and define policies for all tables

-- PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow individual user access to their own profile" ON public.profiles;
CREATE POLICY "Allow individual user access to their own profile"
ON public.profiles FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated users to read squad leader and member profiles" ON public.profiles;
CREATE POLICY "Allow authenticated users to read squad leader and member profiles"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');


-- WALLETS TABLE
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow individual user access to their own wallet" ON public.wallets;
CREATE POLICY "Allow individual user access to their own wallet"
ON public.wallets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- MESSAGES TABLE
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to manage their own messages" ON public.messages;
CREATE POLICY "Allow users to manage their own messages"
ON public.messages FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- NOTIFICATIONS TABLE
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow individual access to own notifications" ON public.notifications;
CREATE POLICY "Allow individual access to own notifications"
ON public.notifications FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- PROMOTIONS TABLE (publicly viewable)
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all authenticated users to view promotions" ON public.promotions;
CREATE POLICY "Allow all authenticated users to view promotions"
ON public.promotions FOR SELECT
USING (auth.role() = 'authenticated');


-- SETTINGS TABLE (publicly viewable)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all authenticated users to view settings" ON public.settings;
CREATE POLICY "Allow all authenticated users to view settings"
ON public.settings FOR SELECT
USING (auth.role() = 'authenticated');


-- SUPPORT_THREADS TABLE (moderator/admin access only)
ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;
-- No policies defined by default, access is restricted to service_role key.
-- Moderators will interact via admin API calls.


-- ACTION_LOGS TABLE (admin access only)
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
-- No policies defined by default, access is restricted to service_role key.
-- Actions are logged via admin/moderator API calls.
