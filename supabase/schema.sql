-- Custom types
create type public.chat_sender as enum ('user', 'admin');
create type public.promotion_status as enum ('Upcoming', 'Active', 'Expired');

-- Tables
create table public.profiles (
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  username text not null,
  full_name text null,
  contact_number text null,
  country text null,
  referral_code text null,
  squad_leader_id uuid null,
  avatar_url text null,
  id_card_no text null,
  id_card_front_url text null,
  id_card_back_url text null,
  address text null,
  date_of_birth date null,
  constraint profiles_pkey primary key (user_id),
  constraint profiles_username_key unique (username),
  constraint profiles_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint profiles_squad_leader_id_fkey foreign key (squad_leader_id) references auth.users (id) on delete set null
);
comment on table public.profiles is 'Stores public profile information for each user.';

create table public.wallets (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  balances jsonb not null default '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
  addresses jsonb not null default '{}'::jsonb,
  growth jsonb not null default '{}'::jsonb,
  security jsonb not null default '{}'::jsonb,
  pending_withdrawals jsonb[] not null default '{}'::jsonb[],
  verification_status text not null default 'unverified',
  constraint wallets_pkey primary key (id),
  constraint wallets_user_id_key unique (user_id),
  constraint wallets_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);
comment on table public.wallets is 'Stores wallet, balance, and security information for each user.';

create table public.messages (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  timestamp timestamp with time zone not null default now(),
  sender public.chat_sender not null,
  text text not null,
  file_url text null,
  silent boolean not null default false,
  constraint messages_pkey primary key (id),
  constraint messages_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);
comment on table public.messages is 'Stores chat messages for the support system.';

create table public.notifications (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  title text not null,
  content text not null,
  read boolean not null default false,
  href text null,
  constraint notifications_pkey primary key (id),
  constraint notifications_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);
comment on table public.notifications is 'Stores user-specific notifications.';

create table public.promotions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  description text not null,
  image_url text null,
  status public.promotion_status not null,
  constraint promotions_pkey primary key (id)
);
comment on table public.promotions is 'Stores platform-wide promotions.';

create table public.settings (
  key text not null,
  value jsonb null,
  created_at timestamp with time zone not null default now(),
  constraint settings_pkey primary key (key)
);
comment on table public.settings is 'Stores site-wide settings as key-value pairs.';

create table public.support_threads (
  user_id uuid not null,
  handler_id uuid null,
  created_at timestamp with time zone not null default now(),
  constraint support_threads_pkey primary key (user_id),
  constraint support_threads_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint support_threads_handler_id_fkey foreign key (handler_id) references auth.users (id) on delete set null
);
comment on table public.support_threads is 'Tracks claims on support tickets by moderators.';

create table public.action_logs (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  created_at timestamp with time zone not null default now(),
  action text not null,
  metadata jsonb null,
  constraint action_logs_pkey primary key (id),
  constraint action_logs_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
);
comment on table public.action_logs is 'Logs actions performed by admins and moderators.';

-- Function to handle new user setup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  squad_leader_user_id uuid;
  referral_bonus numeric := 5;
begin
  -- Create profile
  insert into public.profiles (user_id, username, contact_number, country, referral_code, squad_leader_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'contact_number',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'referral_code',
    null
  );

  -- Create wallet
  insert into public.wallets (user_id, addresses, balances, growth, security)
  values (
    new.id,
    jsonb_build_object('usdt', new.raw_user_meta_data ->> 'username' || '_' || substr(md5(random()::text), 0, 10)),
    jsonb_build_object('usdt', referral_bonus, 'btc', 0, 'eth', 0),
    jsonb_build_object('clicks_left', 4, 'last_reset', now(), 'daily_earnings', 0, 'earnings_history', '[]'::jsonb),
    jsonb_build_object('withdrawal_addresses', '{}'::jsonb)
  );

  -- Handle squad logic if a referral code was used
  if new.raw_user_meta_data ->> 'referral_code' is not null then
    select p.user_id into squad_leader_user_id
    from public.profiles p
    join public.wallets w on p.user_id = w.user_id
    where (w.security ->> 'referral_code') = (new.raw_user_meta_data ->> 'referral_code')
    limit 1;

    if squad_leader_user_id is not null then
      -- Assign squad leader to new user
      update public.profiles
      set squad_leader_id = squad_leader_user_id
      where user_id = new.id;

      -- Give squad leader a bonus
      update public.wallets
      set balances = jsonb_set(
        balances,
        '{usdt}',
        (coalesce((balances ->> 'usdt')::numeric, 0) + referral_bonus)::text::jsonb
      )
      where user_id = squad_leader_user_id;

      -- Give new user an additional bonus for joining a squad
      update public.wallets
      set balances = jsonb_set(
        balances,
        '{usdt}',
        (coalesce((balances ->> 'usdt')::numeric, 0) + referral_bonus)::text::jsonb
      )
      where user_id = new.id;
    end if;
  end if;

  return new;
end;
$$;

-- Trigger to call the function on new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_messages_user_id on public.messages (user_id);
create index idx_notifications_user_id on public.notifications (user_id);
create index idx_wallets_user_id on public.wallets (user_id);
create index idx_profiles_squad_leader_id on public.profiles (squad_leader_id);

-- Seed initial settings
insert into public.settings (key, value)
values
  ('moderators', '[]'::jsonb),
  ('siteSettings', '{"usdtDepositAddress": "TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x", "ethDepositAddress": "0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE", "btcDepositAddress": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"}'::jsonb),
  ('botTierSettings', '[{"id": "tier-1", "name": "VIP CORE I", "clicks": 4, "dailyProfit": 0.02, "balanceThreshold": 0}, {"id": "tier-2", "name": "VIP CORE II", "clicks": 5, "dailyProfit": 0.03, "balanceThreshold": 500}, {"id": "tier-3", "name": "VIP CORE III", "clicks": 6, "dailyProfit": 0.04, "balanceThreshold": 1000}, {"id": "tier-4", "name": "VIP CORE IV", "clicks": 7, "dailyProfit": 0.055, "balanceThreshold": 5000}, {"id": "tier-5", "name": "VIP CORE V", "clicks": 8, "dailyProfit": 0.065, "balanceThreshold": 10000}, {"id": "tier-6", "name": "VIP CORE VI", "clicks": 10, "dailyProfit": 0.085, "balanceThreshold": 15000}, {"id": "tier-7", "name": "VIP CORE VII", "clicks": 12, "dailyProfit": 0.1, "balanceThreshold": 50000}, {"id": "tier-8", "name": "VIP CORE VIII", "clicks": 15, "dailyProfit": 0.12, "balanceThreshold": 100000}]'::jsonb),
  ('announcements', '[{"id": "default-announcement-0", "date": "2024-07-08", "title": "🎉 Welcome to the New AstralCore Platform!", "content": "We are thrilled to launch our redesigned platform. Explore the new features, including the Squad System and AI Growth Engine. We appreciate your feedback!"}, {"id": "default-announcement-1", "date": "2024-07-09", "title": "Security Update: Withdrawal Addresses", "content": "For your security, once a withdrawal address is saved, it cannot be changed directly. Please contact support if you need to update your address. This measure helps protect your assets from unauthorized access."}, {"id": "default-announcement-2", "date": "2024-07-10", "title": "Scheduled Maintenance on July 20th", "content": "The platform will undergo scheduled maintenance on July 20th from 02:00 to 04:00 UTC. The AI Growth Engine may be temporarily unavailable during this period. Thank you for your understanding."}]'::jsonb)
on conflict (key) do nothing;
