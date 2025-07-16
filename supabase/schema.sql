--
-- Users Table
--
create table profiles (
  user_id uuid not null references auth.users on delete cascade,
  username text not null unique,
  full_name text,
  avatar_url text,
  contact_number text,
  country text,
  referral_code text,
  squad_leader_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  id_card_no text,
  address text,
  date_of_birth date,
  id_card_front_url text,
  id_card_back_url text,

  primary key (user_id),
  constraint username_length check (char_length(username) >= 3)
);
alter table profiles enable row level security;

--
-- Wallets Table
--
create table wallets (
    id uuid default gen_random_uuid() not null,
    user_id uuid not null references auth.users on delete cascade,
    -- Balance for different assets. Stored as JSON for flexibility.
    balances jsonb not null default '{"usdt": 5.00, "btc": 0.00, "eth": 0.00}',
    -- Contains user's withdrawal addresses, security question, etc.
    security jsonb not null default '{}',
    -- Tracks growth bot usage
    growth jsonb not null default '{"clicks_left": 4, "last_reset": "2023-01-01T00:00:00Z", "daily_earnings": 0, "earnings_history": []}',
    -- Stores pending withdrawals
    pending_withdrawals jsonb[] not null default '{}',
    verification_status text not null default 'unverified', -- unverified, verifying, verified
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    primary key (id),
    unique(user_id)
);
alter table wallets enable row level security;

--
-- Notifications Table
--
create table notifications (
    id uuid default gen_random_uuid() not null,
    user_id uuid not null references auth.users on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    content text not null,
    read boolean default false not null,
    href text,

    primary key (id)
);
alter table notifications enable row level security;

--
-- Chat Messages Table
--
create type public.chat_sender as enum ('user', 'admin');
create table messages (
    id uuid default gen_random_uuid() not null,
    user_id uuid not null references auth.users on delete cascade,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
    sender public.chat_sender not null,
    text text not null,
    silent boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    file_url text,

    primary key (id)
);
alter table messages enable row level security;

--
-- Settings Table
-- A key-value store for global application settings.
--
create table settings (
    key text not null primary key,
    value jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table settings enable row level security;


--
-- Promotions Table
--
create type public.promotion_status as enum ('Upcoming', 'Active', 'Expired');
create table promotions (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text not null,
    image_url text,
    status public.promotion_status not null,
    primary key (id)
);
alter table promotions enable row level security;

--
-- Moderator Action Logs Table
--
create table action_logs (
    id uuid default gen_random_uuid() not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid not null references auth.users on delete cascade,
    action text not null,
    metadata jsonb,
    primary key (id)
);
alter table action_logs enable row level security;


--
-- Support Ticket Claim Table
--
create table support_threads (
    user_id uuid not null references auth.users on delete cascade,
    handler_id uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id)
);
alter table support_threads enable row level security;


--
-- Handle New User Function
-- This trigger automatically creates a profile and wallet for new users.
--
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  profile_username text;
  squad_leader_id_val uuid;
begin
  -- Extract username from metadata, fallback to a default
  profile_username := new.raw_user_meta_data->>'username';
  if profile_username is null or char_length(profile_username) < 3 then
    profile_username := 'user' || substr(new.id::text, 1, 8);
  end if;

  -- Check for referral code and find squad leader
  if new.raw_user_meta_data->>'referral_code' is not null then
    select p.user_id into squad_leader_id_val
    from public.profiles p
    where p.referral_code = new.raw_user_meta_data->>'referral_code'
    limit 1;
  end if;
  
  -- Insert into public.profiles
  insert into public.profiles (user_id, username, contact_number, country, squad_leader_id, referral_code)
  values (
    new.id,
    profile_username,
    new.raw_user_meta_data->>'contact_number',
    new.raw_user_meta_data->>'country',
    squad_leader_id_val,
    left(upper(replace(gen_random_uuid()::text, '-', '')), 8)
  );

  -- Insert into public.wallets
  insert into public.wallets (user_id)
  values (new.id);
  
  return new;
end;
$$;

--
-- Trigger for Handle New User
--
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

--
-- RPC for manual user creation (used in wallet lib as a fallback)
--
create or replace function public.handle_new_user_by_id(user_id_param uuid)
returns void as $$
declare
  usr record;
begin
  select * into usr from auth.users where id = user_id_param;
  
  -- Check if profile exists
  if not exists (select 1 from public.profiles where user_id = user_id_param) then
    -- Manually call the logic from the trigger function
    declare
      profile_username text;
      squad_leader_id_val uuid;
    begin
      profile_username := usr.raw_user_meta_data->>'username';
      if profile_username is null or char_length(profile_username) < 3 then
        profile_username := 'user' || substr(usr.id::text, 1, 8);
      end if;

      if usr.raw_user_meta_data->>'referral_code' is not null then
        select p.user_id into squad_leader_id_val
        from public.profiles p
        where p.referral_code = usr.raw_user_meta_data->>'referral_code'
        limit 1;
      end if;

      insert into public.profiles (user_id, username, contact_number, country, squad_leader_id, referral_code)
      values (
        usr.id,
        profile_username,
        usr.raw_user_meta_data->>'contact_number',
        usr.raw_user_meta_data->>'country',
        squad_leader_id_val,
        left(upper(replace(gen_random_uuid()::text, '-', '')), 8)
      );
    end;
  end if;

  -- Check if wallet exists
  if not exists (select 1 from public.wallets where user_id = user_id_param) then
    insert into public.wallets (user_id) values (user_id_param);
  end if;
end;
$$ language plpgsql security definer;


-- Grant permissions for new tables
grant all on table public.settings to service_role;
grant all on table public.promotions to service_role;
grant all on table public.action_logs to service_role;
grant all on table public.support_threads to service_role;

grant select on table public.settings to anon, authenticated;
grant select on table public.promotions to anon, authenticated;
grant select on table public.action_logs to authenticated;
grant select on table public.support_threads to authenticated;

grant insert, update, delete on table public.action_logs to authenticated;
grant insert, update, delete on table public.support_threads to authenticated;
