
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Create Wallets Table (Private Data)
-- Stores the main JSONB object with all of a user's private data.
-- RLS: Users can only access their own row.
create table wallets (
  id uuid primary key references auth.users(id) on delete cascade not null,
  data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wallets Table Policies
alter table wallets enable row level security;

create policy "Users can view their own wallet"
on wallets for select
using (auth.uid() = id);

create policy "Users can create their own wallet"
on wallets for insert
with check (auth.uid() = id);

create policy "Users can update their own wallet"
on wallets for update
using (auth.uid() = id);

-- Create Public Wallets Table
-- Stores public-facing data for referrals and squad lookups.
-- RLS: Authenticated users can read all rows (for referral code lookups).
create table wallets_public (
    id uuid primary key references auth.users(id) on delete cascade not null,
    username text,
    referral_code text unique,
    squad_leader_id uuid references auth.users(id),
    squad_members uuid[] default '{}',
    balances jsonb default '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Public Wallets Table Policies
alter table wallets_public enable row level security;

create policy "Authenticated users can view public wallet data"
on wallets_public for select
using (auth.role() = 'authenticated');

create policy "Users can create their own public wallet entry"
on wallets_public for insert
with check (auth.uid() = id);

create policy "Users can update their own username"
on wallets_public for update
using (auth.uid() = id)
with check (auth.uid() = id);


-- Create Chats Table
-- Stores support chat messages.
-- RLS: Users can only access their own messages.
create table chats (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    message jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chats Table Policies
alter table chats enable row level security;

create policy "Users can view their own chats"
on chats for select
using (auth.uid() = user_id);

create policy "Users can create their own chats"
on chats for insert
with check (auth.uid() = user_id);

-- Create Notifications Table
-- Stores user-specific notifications.
-- RLS: Users can only access their own notifications.
create table notifications (
  id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  notification jsonb,
  created_at timestamp with time zone not null default now(),
  constraint notifications_pkey primary key (id, user_id)
);

-- Notifications Table Policies
alter table notifications enable row level security;

create policy "Users can view their own notifications"
on notifications for select
using (auth.uid() = user_id);

create policy "Users can insert their own notifications"
on notifications for insert
with check (auth.uid() = user_id);

create policy "Users can update their own notifications"
on notifications for update
using (auth.uid() = user_id);


-- Create Settings Table
-- Stores global application settings.
-- RLS: No public access. Meant for service_role key access.
create table settings (
  key text primary key,
  value jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Function to handle referral bonuses
create or replace function public.handle_new_user_referral()
returns trigger
language plpgsql
security definer -- grants the function elevated privileges
as $$
declare
  leader_wallet public.wallets_public%rowtype;
begin
  -- Check if a squad leader is specified for the new user
  if new.squad_leader_id is not null then
    -- Retrieve the leader's wallet
    select * into leader_wallet from public.wallets_public where id = new.squad_leader_id;

    if found then
      -- Give $5 bonus to the new user
      new.balances := jsonb_set(
        coalesce(new.balances, '{}'::jsonb),
        '{usdt}',
        to_jsonb(coalesce((new.balances->>'usdt')::numeric, 0) + 5)
      );

      -- Give $5 bonus to the squad leader
      update public.wallets_public
      set
        balances = jsonb_set(
          coalesce(balances, '{}'::jsonb),
          '{usdt}',
          to_jsonb(coalesce((balances->>'usdt')::numeric, 0) + 5)
        ),
        squad_members = array_append(squad_members, new.id)
      where id = new.squad_leader_id;
    end if;
  end if;
  
  return new;
end;
$$;

-- Trigger to execute the function after a new user's public wallet is created
create trigger on_new_user
  before insert on public.wallets_public
  for each row execute procedure public.handle_new_user_referral();

