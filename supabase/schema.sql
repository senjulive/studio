--
-- Enums
--
CREATE TYPE public.chat_sender AS ENUM ('user', 'admin');
CREATE TYPE public.promotion_status AS ENUM ('Upcoming', 'Active', 'Expired');

--
-- Tables
--

-- PROFILES
CREATE TABLE public.profiles (
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    username text NOT NULL,
    full_name text,
    avatar_url text,
    contact_number text,
    country text,
    id_card_no text,
    address text,
    date_of_birth date,
    id_card_front_url text,
    id_card_back_url text,
    referral_code text,
    squad_leader_id uuid,
    CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
    CONSTRAINT profiles_username_key UNIQUE (username),
    CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT profiles_squad_leader_id_fkey FOREIGN KEY (squad_leader_id) REFERENCES auth.users(id) ON DELETE SET NULL
);
COMMENT ON TABLE public.profiles IS 'Stores public-facing user profile information.';

-- WALLETS
CREATE TABLE public.wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    addresses jsonb DEFAULT '{"usdt": ""}'::jsonb NOT NULL,
    balances jsonb DEFAULT '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb NOT NULL,
    growth jsonb DEFAULT '{"clicksLeft": 4, "lastReset": null, "dailyEarnings": 0, "earningsHistory": []}'::jsonb NOT NULL,
    security jsonb DEFAULT '{"withdrawalAddresses": {}}'::jsonb NOT NULL,
    pending_withdrawals jsonb[] DEFAULT ARRAY[]::jsonb[],
    verification_status text DEFAULT 'unverified'::text NOT NULL,
    CONSTRAINT wallets_pkey PRIMARY KEY (id),
    CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.wallets IS 'Stores user financial data, including balances and transaction info.';

-- MESSAGES (for support chat)
CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    sender public.chat_sender NOT NULL,
    text text NOT NULL,
    file_url text,
    silent boolean DEFAULT false,
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_messages_user_id ON public.messages (user_id);
COMMENT ON TABLE public.messages IS 'Stores messages for the user support chat.';

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    href text,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.notifications IS 'Stores user-specific notifications.';

-- PROMOTIONS
CREATE TABLE public.promotions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image_url text,
    status public.promotion_status NOT NULL,
    CONSTRAINT promotions_pkey PRIMARY KEY (id)
);
COMMENT ON TABLE public.promotions IS 'Stores platform-wide promotions.';

-- SETTINGS
CREATE TABLE public.settings (
    key text NOT NULL,
    value jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT settings_pkey PRIMARY KEY (key)
);
COMMENT ON TABLE public.settings IS 'Stores global application settings.';

-- ACTION_LOGS (for moderator/admin actions)
CREATE TABLE public.action_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    metadata jsonb,
    CONSTRAINT action_logs_pkey PRIMARY KEY (id),
    CONSTRAINT action_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.action_logs IS 'Audit trail for moderator and admin actions.';

-- SUPPORT_THREADS (for tracking support ticket claims)
CREATE TABLE public.support_threads (
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    handler_id uuid,
    CONSTRAINT support_threads_pkey PRIMARY KEY (user_id),
    CONSTRAINT support_threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT support_threads_handler_id_fkey FOREIGN KEY (handler_id) REFERENCES auth.users(id) ON DELETE SET NULL
);
COMMENT ON TABLE public.support_threads IS 'Tracks which moderator is handling a support ticket.';

--
-- Functions and Triggers
--

-- Function to generate a random referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT[] := '{A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9}';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || chars[1+random()*(array_length(chars, 1)-1)];
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    squad_leader_user_id uuid;
    bonus_amount numeric := 5.00;
BEGIN
    -- Create Profile
    INSERT INTO public.profiles (user_id, username, contact_number, country, referral_code)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'contact_number',
        new.raw_user_meta_data->>'country',
        generate_referral_code()
    );

    -- Create Wallet with initial bonus
    INSERT INTO public.wallets (user_id, balances)
    VALUES (new.id, jsonb_build_object('usdt', bonus_amount, 'btc', 0, 'eth', 0));
    
    -- Check for referral and assign squad leader
    IF new.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
        SELECT p.user_id INTO squad_leader_user_id
        FROM public.profiles p
        WHERE p.referral_code = new.raw_user_meta_data->>'referral_code'
        LIMIT 1;

        IF squad_leader_user_id IS NOT NULL THEN
            -- Update new user's profile with squad leader
            UPDATE public.profiles
            SET squad_leader_id = squad_leader_user_id
            WHERE user_id = new.id;
            
            -- Add invitation bonus to new user
            UPDATE public.wallets
            SET balances = jsonb_set(balances, '{usdt}', (balances->>'usdt')::numeric + bonus_amount)
            WHERE user_id = new.id;
            
            -- Add referral bonus to squad leader
            UPDATE public.wallets
            SET balances = jsonb_set(balances, '{usdt}', (balances->>'usdt')::numeric + bonus_amount)
            WHERE user_id = squad_leader_user_id;
        END IF;
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user sign-up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Initial Admin Email Setting (Replace with your actual admin email)
INSERT INTO public.settings (key, value)
VALUES ('adminEmail', '""')
ON CONFLICT (key) DO NOTHING;
