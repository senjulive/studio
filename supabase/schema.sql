
-- Wallets Table (Private Data)
-- This table stores sensitive wallet data in a single JSONB column.
-- Row Level Security (RLS) is enabled to ensure users can only access their own data.
create table
  public.wallets (
    id uuid not null,
    data jsonb null,
    constraint wallets_pkey primary key (id),
    constraint wallets_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

-- Enable Row Level Security for wallets
alter table public.wallets enable row level security;

-- RLS policy for wallets: Users can only select/update their own wallet data.
create policy "Users can read/update their own wallet." on public.wallets for all using (auth.uid () = id) with check (auth.uid () = id);

-- Wallets Public Table
-- This table stores public-facing data like usernames, referral codes, and balances.
-- This allows for easier querying of public data without exposing the entire private wallet JSONB.
create table
  public.wallets_public (
    id uuid not null,
    username text null,
    balances jsonb null default '{"usdt": 0, "btc": 0, "eth": 0}'::jsonb,
    referral_code text null,
    squad_leader_id uuid null,
    squad_members uuid[] null default '{}'::uuid[],
    created_at timestamp with time zone not null default now(),
    constraint wallets_public_pkey primary key (id),
    constraint wallets_public_id_fkey foreign key (id) references auth.users (id) on delete cascade,
    constraint wallets_public_referral_code_key unique (referral_code),
    constraint wallets_public_squad_leader_id_fkey foreign key (squad_leader_id) references auth.users (id)
  ) tablespace pg_default;

-- Enable Row Level Security for wallets_public
alter table public.wallets_public enable row level security;

-- RLS policy for wallets_public: Authenticated users can read all public wallet data.
create policy "Authenticated users can read public wallet data." on public.wallets_public for select using (auth.role () = 'authenticated');
-- RLS policy for wallets_public: Users can update their own username.
create policy "Users can update their own username." on public.wallets_public for update using (auth.uid () = id) with check (auth.uid () = id);


-- Chats Table
-- Stores chat messages between users and admins.
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

-- RLS policy for chats: Users can only access their own chat messages.
create policy "Users can manage their own chat messages." on public.chats for all using (auth.uid () = user_id) with check (auth.uid () = user_id);

-- Notifications Table
-- Stores individual notifications for users.
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

-- RLS policy for notifications: Users can only access their own notifications.
create policy "Users can manage their own notifications." on public.notifications for all using (auth.uid () = user_id) with check (auth.uid () = user_id);


-- Settings Table
-- Stores global application settings, like deposit addresses and bot configurations.
create table
  public.settings (
    key text not null,
    value jsonb null,
    constraint settings_pkey primary key (key)
  ) tablespace pg_default;

-- No RLS for settings table. Access is controlled by service_role key on the server.
-- This is secure because only our admin backend (using the service key) can write to it,
-- and a specific API route reads from it after user authentication.


-- Function to handle new squad members and distribute bonuses.
-- This function is called by a trigger when a new row is inserted into wallets_public.
create or replace function public.handle_new_squad_member()
returns trigger
language plpgsql
security definer -- This is important to allow the function to run with elevated privileges
as $$
declare
  leader_wallet public.wallets_public%rowtype;
  new_user_id uuid;
  leader_id uuid;
begin
  -- Get the new user's ID and their squad leader's ID from the new row
  new_user_id := new.id;
  leader_id := new.squad_leader_id;

  -- If the new user has a squad leader, process the bonus
  if leader_id is not null then
    -- Get the leader's wallet data
    select * into leader_wallet from public.wallets_public where id = leader_id;

    -- Check if the leader exists
    if found then
      -- Give 5 USDT to the new user
      update public.wallets_public
      set balances = jsonb_set(balances, '{usdt}', (coalesce((balances->>'usdt')::numeric, 0) + 5)::text::jsonb)
      where id = new_user_id;

      -- Give 5 USDT to the squad leader
      update public.wallets_public
      set balances = jsonb_set(balances, '{usdt}', (coalesce((balances->>'usdt')::numeric, 0) + 5)::text::jsonb)
      where id = leader_id;
      
      -- Add the new member to the leader's squad_members array
      update public.wallets_public
      set squad_members = array_append(squad_members, new_user_id)
      where id = leader_id;
    end if;
  end if;

  return new;
end;
$$;

-- Trigger to execute the function after a new user's public wallet is created.
create trigger on_new_squad_member
  after insert on public.wallets_public
  for each row execute function public.handle_new_squad_member();
