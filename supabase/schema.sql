--
-- WALLETS_PUBLIC TABLE
-- This table stores public wallet information.
--
CREATE TABLE
  public.wallets_public (
    id UUID NOT NULL,
    username TEXT NULL,
    referral_code TEXT NOT NULL,
    squad_leader_id UUID NULL,
    balances JSONB NOT NULL DEFAULT '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
    squad_members TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    CONSTRAINT wallets_public_pkey PRIMARY KEY (id),
    CONSTRAINT wallets_public_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT wallets_public_referral_code_key UNIQUE (referral_code)
  );

ALTER TABLE public.wallets_public ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "public"."wallets_public" FOR
SELECT
  USING (TRUE);

--
-- WALLETS TABLE
-- This table stores private wallet data in a JSONB column.
--
CREATE TABLE
  public.wallets (
    id UUID NOT NULL,
    data JSONB NULL,
    CONSTRAINT wallets_pkey PRIMARY KEY (id),
    CONSTRAINT wallets_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
  );

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable access for users based on id" ON public.wallets FOR ALL USING (auth.uid () = id);

--
-- CHATS TABLE
-- This table stores chat messages for the support system.
--
CREATE TABLE
  public.chats (
    id TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    message JSONB NULL,
    CONSTRAINT chats_pkey PRIMARY KEY (id),
    CONSTRAINT chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
  );

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable access for users based on id" ON public.chats FOR ALL USING (auth.uid () = user_id);

--
-- NOTIFICATIONS TABLE
--
CREATE TABLE
  public.notifications (
    id TEXT NOT NULL,
    user_id UUID NOT NULL,
    notification JSONB NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
  );

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable access for users based on id" ON public.notifications FOR ALL USING (auth.uid () = id);

--
-- SETTINGS TABLE
-- This table stores site-wide settings.
--
CREATE TABLE
  public.settings (
    key TEXT NOT NULL,
    value JSONB NULL,
    CONSTRAINT settings_pkey PRIMARY KEY (key)
  );

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON public.settings FOR
SELECT
  USING (auth.role () = 'authenticated');

--
-- DB FUNCTIONS
--

-- Function to handle new user setup
CREATE OR REPLACE FUNCTION public.handle_new_user () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Create a public wallet entry
  INSERT INTO public.wallets_public (id, username, referral_code)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', public.generate_referral_code());

  -- Create a private wallet entry
  INSERT INTO public.wallets (id, data)
  VALUES (NEW.id, jsonb_build_object(
    'addresses', jsonb_build_object('usdt', public.generate_trc20_address()),
    'balances', '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
    'pendingWithdrawals', '[]'::jsonb,
    'growth', jsonb_build_object('clicksLeft', 4, 'lastReset', floor(extract(epoch from now()) * 1000), 'dailyEarnings', 0, 'earningsHistory', '[]'::jsonb),
    'squad', jsonb_build_object('referralCode', (SELECT referral_code FROM public.wallets_public WHERE id = NEW.id), 'members', '[]'::jsonb),
    'profile', jsonb_build_object('username', NEW.raw_user_meta_data->>'username', 'contactNumber', NEW.raw_user_meta_data->>'contactNumber', 'country', NEW.raw_user_meta_data->>'country'),
    'security', jsonb_build_object('withdrawalAddresses', '{}'::jsonb)
  ));
  RETURN NEW;
END;
$$;

-- Function to handle squad rewards and linking
CREATE OR REPLACE FUNCTION public.handle_squad_rewards()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    leader_id UUID;
BEGIN
    -- Check if a squad_leader_id was provided for the new user
    IF NEW.squad_leader_id IS NOT NULL THEN
        leader_id := NEW.squad_leader_id;

        -- Add 5 USDT to the new user's balance
        UPDATE public.wallets_public
        SET balances = jsonb_set(balances, '{usdt}', (balances->>'usdt')::numeric + 5)
        WHERE id = NEW.id;

        -- Add 5 USDT to the squad leader's balance
        UPDATE public.wallets_public
        SET balances = jsonb_set(balances, '{usdt}', (balances->>'usdt')::numeric + 5)
        WHERE id = leader_id;
        
        -- Add the new user's ID to the leader's squad_members array
        UPDATE public.wallets_public
        SET squad_members = array_append(squad_members, NEW.id::text)
        WHERE id = leader_id;
    END IF;
    RETURN NEW;
END;
$$;


-- Helper functions for wallet creation
CREATE OR REPLACE FUNCTION public.generate_trc20_address() RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := 'T';
    i INTEGER;
BEGIN
    FOR i IN 1..33 LOOP
        result := result || substr(chars, floor(random() * length(chars)) + 1, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_referral_code() RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars)) + 1, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;


--
-- TRIGGERS
--

-- Trigger to create wallet entries for a new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user ();

-- Trigger for squad rewards
CREATE TRIGGER on_new_wallet_with_leader
AFTER INSERT ON public.wallets_public
FOR EACH ROW
EXECUTE FUNCTION public.handle_squad_rewards();

--
-- STORAGE BUCKETS
--
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif']);

CREATE POLICY "Enable public read access to avatars" ON storage.objects FOR
SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Enable insert for authenticated users" ON storage.objects FOR INSERT
WITH
  CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on ownership" ON storage.objects FOR
UPDATE
  USING (auth.uid () = owner)
WITH
  CHECK (bucket_id = 'avatars');
