-- Supabase Schema for AstralCore App
-- Run this script in your Supabase project's SQL Editor.

-- Create wallets table for private user data
create table
  public.wallets (
    id uuid not null,
    data jsonb null,
    constraint wallets_pkey primary key (id),
    constraint wallets_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

-- Enable Row Level Security for wallets
alter table public.wallets enable row level security;

-- Policy: Users can manage their own wallet data.
create policy "Users can manage their own wallet." on public.wallets
as permissive for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Create wallets_public table for public data and referral logic
create table
  public.wallets_public (
    id uuid not null,
    username text null,
    referral_code text null,
    squad_leader_id uuid null,
    balances jsonb null default '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
    squad_members uuid[] null default '{}'::uuid[],
    created_at timestamp with time zone not null default now(),
    constraint wallets_public_pkey primary key (id),
    constraint wallets_public_referral_code_key unique (referral_code),
    constraint wallets_public_id_fkey foreign key (id) references auth.users (id) on delete cascade,
    constraint wallets_public_squad_leader_id_fkey foreign key (squad_leader_id) references auth.users (id)
  ) tablespace pg_default;

-- Enable Row Level Security for wallets_public
alter table public.wallets_public enable row level security;

-- Policy: Authenticated users can view all public wallets.
create policy "Allow auth users to read all public wallets" on public.wallets_public
as permissive for select
to authenticated
using (true);

-- Policy: Users can update their own public wallet data.
create policy "Users can update their own public wallet" on public.wallets_public
as permissive for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Policy: Users can create their own public wallet entry.
create policy "Users can insert their own public wallet" on public.wallets_public
as permissive for insert
to authenticated
with check (auth.uid() = id);

-- Create chats table for support messages
create table
  public.chats (
    id text not null,
    user_id uuid not null,
    message jsonb null,
    created_at timestamp with time zone not null default now(),
    constraint chats_pkey primary key (id),
    constraint chats_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

-- Enable Row Level Security for chats
alter table public.chats enable row level security;

-- Policy: Users can manage their own chat messages.
create policy "Users can manage their own chat messages" on public.chats
as permissive for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create notifications table
create table
  public.notifications (
    id text not null,
    user_id uuid not null,
    notification jsonb null,
    created_at timestamp with time zone not null default now(),
    constraint notifications_pkey primary key (id),
    constraint notifications_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

-- Enable Row Level Security for notifications
alter table public.notifications enable row level security;

-- Policy: Users can manage their own notifications.
create policy "Users can manage their own notifications" on public.notifications
as permissive for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create settings table for admin-managed settings
create table
  public.settings (
    key text not null,
    value jsonb null,
    created_at timestamp with time zone not null default now(),
    constraint settings_pkey primary key (key)
  ) tablespace pg_default;

-- Enable Row Level Security for settings
alter table public.settings enable row level security;

-- Policy: Authenticated users can read settings.
create policy "Allow authenticated users to read settings" on public.settings
as permissive for select
to authenticated
using (true);

-- DB function to handle squad referral rewards
create or replace function public.handle_new_squad_member()
returns trigger
language plpgsql
security definer -- IMPORTANT: Allows the function to bypass RLS to update leader's balance
as $$
begin
  -- Grant 5 USDT bonus to the new user for joining a squad
  if new.squad_leader_id is not null then
    new.balances := jsonb_set(
      new.balances,
      '{usdt}',
      to_jsonb((new.balances->>'usdt')::numeric + 5)
    );
  end if;

  -- Grant 5 USDT bonus to the squad leader and add new member to their list
  if new.squad_leader_id is not null then
    update public.wallets_public
    set
      balances = jsonb_set(
        balances,
        '{usdt}',
        to_jsonb((balances->>'usdt')::numeric + 5)
      ),
      squad_members = array_append(squad_members, new.id)
    where
      id = new.squad_leader_id;
  end if;

  return new;
end;
$$;

-- Trigger to execute the function after a new user's public wallet is created
create trigger on_new_squad_member
  after insert on public.wallets_public
  for each row execute function public.handle_new_squad_member();

-- Grant usage on the function to the authenticated role
grant execute on function public.handle_new_squad_member() to authenticated;
