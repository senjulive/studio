
-- Drop existing tables and types if they exist, in reverse order of dependency
DROP FUNCTION IF EXISTS handle_new_user_referral();
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS wallets_public;


--
-- wallets_public: Publicly accessible wallet data
--
CREATE TABLE wallets_public (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    referral_code TEXT UNIQUE,
    squad_leader_id UUID REFERENCES wallets_public(id),
    squad_members UUID[] DEFAULT '{}',
    balances JSONB DEFAULT '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb
);

ALTER TABLE wallets_public ENABLE ROW LEVEL SECURITY;

-- Allow users to read all public wallet data (for usernames, etc.)
CREATE POLICY "Public wallets are viewable by everyone."
ON wallets_public FOR SELECT
USING (true);

-- Allow users to create their own public wallet entry
CREATE POLICY "Users can create their own public wallet."
ON wallets_public FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own username
CREATE POLICY "Users can update their own public wallet."
ON wallets_public FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


--
-- wallets: Private, detailed wallet data stored in a single JSONB column
--
CREATE TABLE wallets (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Allow users to read, create, and update their own private wallet data
CREATE POLICY "Users can manage their own private wallet."
ON wallets FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


--
-- chats: Stores support chat messages
--
CREATE TABLE chats (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own chat messages
CREATE POLICY "Users can manage their own chat messages."
ON chats FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

--
-- notifications: Stores user-specific notifications
--
CREATE TABLE notifications (
    id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification JSONB,
    PRIMARY KEY (id, user_id)
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own notifications
CREATE POLICY "Users can manage their own notifications."
ON notifications FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


--
-- settings: Stores site-wide settings
--
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value JSONB
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Settings are read-only for authenticated users
CREATE POLICY "Authenticated users can read settings."
ON settings FOR SELECT
USING (auth.role() = 'authenticated');


--
-- handle_new_user_referral: DB function to handle referral bonuses
--
CREATE OR REPLACE FUNCTION handle_new_user_referral()
RETURNS TRIGGER AS $$
DECLARE
    leader_id_val UUID;
    leader_balances JSONB;
BEGIN
    -- Check if the new user has a squad leader
    IF NEW.squad_leader_id IS NOT NULL THEN
        leader_id_val := NEW.squad_leader_id;

        -- Give the new user a $5 bonus
        NEW.balances := jsonb_set(NEW.balances, '{usdt}', to_jsonb( (NEW.balances->>'usdt')::numeric + 5 ));

        -- Give the squad leader a $5 bonus
        UPDATE wallets_public
        SET balances = jsonb_set(balances, '{usdt}', to_jsonb( (balances->>'usdt')::numeric + 5 ))
        WHERE id = leader_id_val;

        -- Add the new user to the squad leader's list of members
        UPDATE wallets_public
        SET squad_members = array_append(squad_members, NEW.id)
        WHERE id = leader_id_val;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


--
-- Trigger for the referral handling function
--
CREATE TRIGGER on_new_user_referral_trigger
BEFORE INSERT ON wallets_public
FOR EACH ROW EXECUTE FUNCTION handle_new_user_referral();


--
-- Give anon and authenticated roles usage of the functions and tables
--
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE wallets TO anon, authenticated;
GRANT ALL ON TABLE wallets_public TO anon, authenticated;
GRANT ALL ON TABLE chats TO anon, authenticated;
GRANT ALL ON TABLE notifications TO anon,authenticated;
GRANT SELECT ON TABLE settings TO authenticated;
GRANT ALL ON FUNCTION handle_new_user_referral() TO anon, authenticated;

    