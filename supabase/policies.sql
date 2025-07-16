--
-- RLS POLICIES
--
-- This script contains all the necessary Row Level Security (RLS) policies
-- for the AstralCore application. Run this script in your Supabase SQL Editor
-- to secure your database tables.
--

-- -----------------------------------------------------------------------------
-- PROFILES TABLE
-- Users should be able to see their own profile and update it.
-- Authenticated users should be able to see limited public data of others (e.g., usernames).
-- -----------------------------------------------------------------------------
-- 1. Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (if any) to start fresh
DROP POLICY IF EXISTS "Allow individual user access to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read public profile info" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- 3. Create new policies for profiles
CREATE POLICY "Allow individual user access to their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to read public profile info"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- MESSAGES TABLE
-- Users should only be able to read and write messages in their own support thread.
-- -----------------------------------------------------------------------------
-- 1. Enable RLS on the messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy (if any)
DROP POLICY IF EXISTS "Allow users to manage their own chat messages" ON public.messages;

-- 3. Create new policy for messages
CREATE POLICY "Allow users to manage their own chat messages"
ON public.messages FOR ALL
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- WALLETS TABLE
-- Users should only have access to their own wallet.
-- -----------------------------------------------------------------------------
-- 1. Enable RLS on the wallets table
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy (if any)
DROP POLICY IF EXISTS "Allow individual user access to their own wallet" ON public.wallets;

-- 3. Create new policy for wallets
CREATE POLICY "Allow individual user access to their own wallet"
ON public.wallets FOR ALL
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- NOTIFICATIONS TABLE
-- Users should only have access to their own notifications.
-- -----------------------------------------------------------------------------
-- 1. Enable RLS on the notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy (if any)
DROP POLICY IF EXISTS "Allow individual user access to their own notifications" ON public.notifications;

-- 3. Create new policy for notifications
CREATE POLICY "Allow individual user access to their own notifications"
ON public.notifications FOR ALL
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- PROMOTIONS TABLE
-- All authenticated users should be able to view promotions.
-- -----------------------------------------------------------------------------
-- 1. Enable RLS on the promotions table
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy (if any)
DROP POLICY IF EXISTS "Allow authenticated users to read promotions" ON public.promotions;

-- 3. Create new policy for promotions
CREATE POLICY "Allow authenticated users to read promotions"
ON public.promotions FOR SELECT
TO authenticated
USING (true);

-- -----------------------------------------------------------------------------
-- SETTINGS, ACTION_LOGS, SUPPORT_THREADS TABLES
-- These tables should not be directly accessible by users. Access is handled
-- through secure server-side API routes with the admin client.
-- We will enable RLS and DENY all access by default as a safeguard.
-- -----------------------------------------------------------------------------
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deny all access to settings" ON public.settings;
CREATE POLICY "Deny all access to settings" ON public.settings FOR ALL USING (false);

ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deny all access to action_logs" ON public.action_logs;
CREATE POLICY "Deny all access to action_logs" ON public.action_logs FOR ALL USING (false);

ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deny all access to support_threads" ON public.support_threads;
CREATE POLICY "Deny all access to support_threads" ON public.support_threads FOR ALL USING (false);

--
-- END OF POLICIES
--
