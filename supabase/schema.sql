
-- Enable Row Level Security (RLS) for all new tables.
alter default privileges in schema public enable row level security;

-- Wallets table (private)
-- Stores the main JSONB data for each user's wallet.
-- RLS ensures users can only access their own data.
create table
  wallets (
    id uuid not null,
    data jsonb null,
    constraint wallets_pkey primary key (id),
    constraint wallets_id_fkey foreign key (id) references auth.users (id) on delete cascade
  );

alter table wallets enable row level security;

create policy "Users can read their own wallet." on wallets for
select
  using (auth.uid () = id);

create policy "Users can update their own wallet." on wallets for
update using (auth.uid () = id);

-- Wallets table (public)
-- Stores public data for performance, referrals, and triggers.
create table
  wallets_public (
    id uuid not null,
    username text null,
    balances jsonb null,
    referral_code text null,
    squad_leader_id uuid null,
    squad_members text[] null,
    created_at timestamp with time zone not null default now(),
    constraint wallets_public_pkey primary key (id),
    constraint wallets_public_id_fkey foreign key (id) references auth.users (id) on delete cascade,
    constraint wallets_public_referral_code_key unique (referral_code),
    constraint wallets_public_squad_leader_id_fkey foreign key (squad_leader_id) references auth.users (id) on delete set null
  );

alter table wallets_public enable row level security;

create policy "Public wallets are viewable by everyone." on wallets_public for
select
  using (true);
create policy "Users can update their own public wallet." on wallets_public for
update using (auth.uid () = id);


-- Chats table
-- Stores support chat messages.
-- RLS allows admins to see all, but users only their own.
create table
  chats (
    id text not null,
    user_id uuid not null,
    message jsonb null,
    created_at timestamp with time zone not null default now(),
    constraint chats_pkey primary key (id),
    constraint chats_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  );

alter table chats enable row level security;

create policy "Users can read and write to their own chat." on chats for all using (auth.uid () = user_id);

-- Notifications table
-- Stores individual user notifications.
create table
  notifications (
    id text not null,
    user_id uuid not null,
    notification jsonb null,
    constraint notifications_pkey primary key (id, user_id),
    constraint notifications_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  );

alter table notifications enable row level security;

create policy "Users can manage their own notifications." on notifications for all using (auth.uid () = user_id);

-- Settings table
-- Stores key-value settings for the app.
-- RLS is disabled as this is managed via service role key in API.
create table
  settings (
    key text not null,
    value jsonb null,
    constraint settings_pkey primary key (key)
  );


-- Function to handle new squad members and distribute rewards
-- This function is called by a trigger when a user with a squad_leader_id is created.
create or replace function handle_new_squad_member()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  leader_id uuid;
  new_user_id uuid;
  leader_balances jsonb;
  new_user_balances jsonb;
  leader_squad_members text[];
begin
  new_user_id := new.id;
  leader_id := new.squad_leader_id;

  -- Only proceed if there is a leader
  if leader_id is not null then
    -- Get current balances, defaulting to zero if null
    select balances into leader_balances from wallets_public where id = leader_id;
    if leader_balances is null then
      leader_balances := '{"usdt": 0, "btc": 0, "eth": 0}';
    end if;

    select balances into new_user_balances from wallets_public where id = new_user_id;
    if new_user_balances is null then
      new_user_balances := '{"usdt": 0, "btc": 0, "eth": 0}';
    end if;
    
    -- Add 5 USDT to both the leader and the new user
    leader_balances := jsonb_set(leader_balances, '{usdt}', to_jsonb( (leader_balances->>'usdt')::numeric + 5 ));
    new_user_balances := jsonb_set(new_user_balances, '{usdt}', to_jsonb( (new_user_balances->>'usdt')::numeric + 5 ));

    -- Update leader's balances
    update wallets_public set balances = leader_balances where id = leader_id;

    -- Update new user's balances in the NEW record before it's inserted
    new.balances = new_user_balances;

    -- Add the new user's username to the leader's squad_members array
    select squad_members into leader_squad_members from wallets_public where id = leader_id;
    if leader_squad_members is null then
        leader_squad_members := '{}';
    end if;
    leader_squad_members := leader_squad_members || new.username;
    update wallets_public set squad_members = leader_squad_members where id = leader_id;

  end if;

  return new;
end;
$$;

-- Trigger to execute the function
-- This activates after a new user is inserted into the public wallets table.
create trigger on_new_squad_member_trigger
before insert on wallets_public
for each row execute procedure handle_new_squad_member();

