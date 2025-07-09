
-- Enable the required extension for UUID generation
create extension if not exists "uuid-ossp" with schema "extensions";

--
-- Wallets Public Table
--
-- This table stores public-facing wallet information.
-- It is designed to be accessible by authenticated users.
-- RLS policies should be configured to control access.
--
create table if not exists public.wallets_public (
  id uuid not null primary key,
  username text,
  balances jsonb not null default '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
  referral_code text not null unique,
  squad_leader_id uuid references public.wallets_public(id),
  squad_members uuid[] not null default '{}'
);
alter table public.wallets_public enable row level security;


--
-- Wallets Private Table
--
-- This table stores sensitive wallet data in a single JSONB column.
-- It should only be accessible by the user who owns the data or by service roles.
--
create table if not exists public.wallets (
  id uuid not null primary key,
  data jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.wallets enable row level security;


--
-- Chat History Table
--
-- Stores chat messages between users and administrators.
--
create table if not exists public.chats (
  id text not null primary key,
  user_id uuid not null,
  message jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.chats enable row level security;


--
-- Notifications Table
--
-- Stores individual user notifications.
--
create table if not exists public.notifications (
  id text not null primary key,
  user_id uuid not null,
  notification jsonb
);
alter table public.notifications enable row level security;


--
-- Settings Table
--
-- Stores global application settings as key-value pairs.
--
create table if not exists public.settings (
    key text not null primary key,
    value jsonb,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- No RLS for settings, as it's managed via API with service key.


--
-- Database Function for Squad Rewards
--
-- This function automatically handles the rewards when a new user
-- joins a squad using a referral code.
--
create or replace function public.handle_new_user_squad_referral()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  leader_id uuid;
  leader_balances jsonb;
  member_balances jsonb;
  referral_bonus numeric := 5.00;
begin
  -- Check if the new user was referred by a leader
  if new.squad_leader_id is not null then
    leader_id := new.squad_leader_id;

    -- Update the new member's balance
    update public.wallets_public
    set balances = jsonb_set(balances, '{usdt}', to_jsonb(coalesce((balances->>'usdt')::numeric, 0) + referral_bonus))
    where id = new.id;

    -- Update the leader's balance
    update public.wallets_public
    set balances = jsonb_set(balances, '{usdt}', to_jsonb(coalesce((balances->>'usdt')::numeric, 0) + referral_bonus))
    where id = leader_id;

    -- Add the new member to the leader's squad_members array
    update public.wallets_public
    set squad_members = array_append(squad_members, new.id)
    where id = leader_id;
  end if;

  return new;
end;
$$;

--
-- Database Trigger
--
-- This trigger calls the function whenever a new user is added
-- to the wallets_public table.
--
create or replace trigger on_new_user_squad_creation
  after insert on public.wallets_public
  for each row execute procedure public.handle_new_user_squad_referral();


--
-- RLS Policies
--

-- Policy: Allow users to view their own private wallet data
create policy "Allow individual read access on wallets"
on public.wallets for select
using (auth.uid() = id);

-- Policy: Allow users to create their own private wallet data
create policy "Allow individual insert access on wallets"
on public.wallets for insert
with check (auth.uid() = id);

-- Policy: Allow users to update their own private wallet data
create policy "Allow individual update access on wallets"
on public.wallets for update
using (auth.uid() = id);


-- Policy: Allow authenticated users to view all public wallet data
create policy "Allow all authenticated users to read wallets_public"
on public.wallets_public for select
to authenticated
using (true);

-- Policy: Allow users to create their own public wallet entry
create policy "Allow individual insert access on wallets_public"
on public.wallets_public for insert
to authenticated
with check (auth.uid() = id);


-- Policy: Allow users to view their own chat messages
create policy "Allow individual read access on chats"
on public.chats for select
using (auth.uid() = user_id);

-- Policy: Allow users to create their own chat messages
create policy "Allow individual insert access on chats"
on public.chats for insert
with check (auth.uid() = user_id);


-- Policy: Allow users to view their own notifications
create policy "Allow individual read access on notifications"
on public.notifications for select
using (auth.uid() = user_id);

-- Policy: Allow users to create their own notifications
create policy "Allow individual insert access on notifications"
on public.notifications for insert
with check (auth.uid() = user_id);

-- Policy: Allow users to update their own notifications (for marking as read)
create policy "Allow individual update access on notifications"
on public.notifications for update
using (auth.uid() = user_id);
