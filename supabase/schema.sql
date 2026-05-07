create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.stickers (
  id bigint primary key,
  team_code text not null,
  team_name text not null,
  player_name text not null,
  position text not null,
  rarity text not null,
  is_starter boolean not null default false,
  role text not null,
  number_code text not null
);

create table if not exists public.user_stickers (
  user_id uuid not null references public.profiles(id) on delete cascade,
  sticker_id bigint not null references public.stickers(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, sticker_id)
);

create table if not exists public.weekly_limits (
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_key text not null,
  packs_opened integer not null default 0 check (packs_opened >= 0),
  lifetime_packs_opened integer not null default 0 check (lifetime_packs_opened >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, week_key)
);

create table if not exists public.pack_openings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_key text not null,
  cards jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.trade_offers (
  id uuid primary key default gen_random_uuid(),
  offered_by uuid not null references public.profiles(id) on delete cascade,
  requested_with uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trade_offer_items (
  id uuid primary key default gen_random_uuid(),
  trade_offer_id uuid not null references public.trade_offers(id) on delete cascade,
  owner_user_id uuid not null references public.profiles(id) on delete cascade,
  sticker_id bigint not null references public.stickers(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0)
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_code text not null,
  current_value integer not null default 0,
  target_value integer not null default 1,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, achievement_code)
);

alter table public.stickers enable row level security;
alter table public.profiles enable row level security;
alter table public.user_stickers enable row level security;
alter table public.weekly_limits enable row level security;
alter table public.pack_openings enable row level security;
alter table public.trade_offers enable row level security;
alter table public.trade_offer_items enable row level security;
alter table public.user_achievements enable row level security;

drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles authenticated read basic" on public.profiles;
drop policy if exists "profiles self write" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles authenticated read basic" on public.profiles for select using (auth.role() = 'authenticated');
create policy "profiles self write" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

drop policy if exists "stickers read all" on public.stickers;
create policy "stickers read all" on public.stickers for select using (true);

drop policy if exists "user stickers self" on public.user_stickers;
drop policy if exists "weekly self" on public.weekly_limits;
drop policy if exists "pack openings self" on public.pack_openings;
create policy "user stickers self" on public.user_stickers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weekly self" on public.weekly_limits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pack openings self" on public.pack_openings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "trade offers visible to participants" on public.trade_offers;
drop policy if exists "trade offers creator insert" on public.trade_offers;
drop policy if exists "trade offers participant update" on public.trade_offers;
create policy "trade offers visible to participants" on public.trade_offers
for select using (auth.uid() = offered_by or auth.uid() = requested_with);
create policy "trade offers creator insert" on public.trade_offers
for insert with check (auth.uid() = offered_by);
create policy "trade offers participant update" on public.trade_offers
for update using (auth.uid() = offered_by or auth.uid() = requested_with);

drop policy if exists "trade items visible to participants" on public.trade_offer_items;
drop policy if exists "trade items owner insert" on public.trade_offer_items;
create policy "trade items visible to participants" on public.trade_offer_items
for select using (
  exists (
    select 1
    from public.trade_offers t
    where t.id = trade_offer_id
      and (t.offered_by = auth.uid() or t.requested_with = auth.uid())
  )
);
create policy "trade items owner insert" on public.trade_offer_items
for insert with check (auth.uid() = owner_user_id);

drop policy if exists "user achievements self" on public.user_achievements;
create policy "user achievements self" on public.user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.search_profiles(search_term text default '')
returns table (
  id uuid,
  email text,
  display_name text
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.email, p.display_name
  from public.profiles p
  where auth.uid() is not null
    and p.id <> auth.uid()
    and (
      search_term = ''
      or coalesce(p.display_name, '') ilike '%' || search_term || '%'
      or coalesce(p.email, '') ilike '%' || search_term || '%'
    )
  order by coalesce(p.display_name, p.email)
  limit 20;
$$;

create or replace function public.current_week_key()
returns text
language sql
stable
as $$
  select to_char(current_date, 'IYYY') || '-W' || to_char(current_date, 'IW');
$$;

create or replace function public.open_weekly_pack()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_week text := public.current_week_key();
  current_limit record;
  drawn_cards jsonb := '[]'::jsonb;
  card_record record;
  draw_index integer := 0;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.weekly_limits (user_id, week_key, packs_opened, lifetime_packs_opened)
  values (current_user_id, current_week, 0, 0)
  on conflict (user_id, week_key) do nothing;

  select *
  into current_limit
  from public.weekly_limits
  where user_id = current_user_id
    and week_key = current_week
  for update;

  if current_limit.packs_opened >= 7 then
    raise exception 'Weekly pack limit reached';
  end if;

  while draw_index < 8 loop
    select s.*
    into card_record
    from public.stickers s
    order by random()
    limit 1;

    insert into public.user_stickers (user_id, sticker_id, quantity)
    values (current_user_id, card_record.id, 1)
    on conflict (user_id, sticker_id)
    do update set quantity = public.user_stickers.quantity + 1, updated_at = now();

    drawn_cards := drawn_cards || jsonb_build_array(jsonb_build_object(
      'id', card_record.id,
      'code', card_record.team_code,
      'team', card_record.team_name,
      'name', card_record.player_name,
      'position', card_record.position,
      'rarity', card_record.rarity,
      'role', card_record.role,
      'number', card_record.number_code,
      'isStarter', card_record.is_starter,
      'countAfterOpen', (select quantity from public.user_stickers where user_id = current_user_id and sticker_id = card_record.id),
      'isNew', (select quantity = 1 from public.user_stickers where user_id = current_user_id and sticker_id = card_record.id)
    ));

    draw_index := draw_index + 1;
  end loop;

  update public.weekly_limits
  set packs_opened = packs_opened + 1,
      lifetime_packs_opened = lifetime_packs_opened + 1,
      updated_at = now()
  where user_id = current_user_id
    and week_key = current_week;

  insert into public.pack_openings (user_id, week_key, cards)
  values (current_user_id, current_week, drawn_cards);

  return jsonb_build_object(
    'week_key', current_week,
    'packs_opened', (select packs_opened from public.weekly_limits where user_id = current_user_id and week_key = current_week),
    'total_packs_opened', (select lifetime_packs_opened from public.weekly_limits where user_id = current_user_id and week_key = current_week),
    'cards', drawn_cards,
    'inventory', (
      select jsonb_agg(jsonb_build_object('sticker_id', sticker_id, 'quantity', quantity))
      from public.user_stickers
      where user_id = current_user_id
    )
  );
end;
$$;

create or replace function public.create_trade_offer(
  target_user_id uuid,
  offered_sticker_id bigint,
  requested_sticker_id bigint,
  offered_quantity integer default 1,
  requested_quantity integer default 1,
  note_text text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  new_trade_id uuid;
  available_quantity integer;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if target_user_id is null or target_user_id = current_user_id then
    raise exception 'Invalid target user';
  end if;

  if offered_quantity <= 0 or requested_quantity <= 0 then
    raise exception 'Invalid quantities';
  end if;

  select quantity
  into available_quantity
  from public.user_stickers
  where user_id = current_user_id
    and sticker_id = offered_sticker_id;

  if coalesce(available_quantity, 0) <= offered_quantity - 1 then
    raise exception 'Not enough repeated stickers to offer';
  end if;

  insert into public.trade_offers (offered_by, requested_with, note)
  values (current_user_id, target_user_id, note_text)
  returning id into new_trade_id;

  insert into public.trade_offer_items (trade_offer_id, owner_user_id, sticker_id, quantity)
  values
    (new_trade_id, current_user_id, offered_sticker_id, offered_quantity),
    (new_trade_id, target_user_id, requested_sticker_id, requested_quantity);

  return new_trade_id;
end;
$$;

create or replace function public.respond_to_trade_offer(
  target_trade_id uuid,
  next_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  trade_row public.trade_offers%rowtype;
  offered_item record;
  requested_item record;
  current_qty integer;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if next_status not in ('accepted', 'rejected', 'cancelled') then
    raise exception 'Invalid status';
  end if;

  select *
  into trade_row
  from public.trade_offers
  where id = target_trade_id
  for update;

  if not found then
    raise exception 'Trade not found';
  end if;

  if trade_row.status <> 'pending' then
    raise exception 'Trade already processed';
  end if;

  if next_status = 'cancelled' and trade_row.offered_by <> current_user_id then
    raise exception 'Only the creator can cancel';
  end if;

  if next_status in ('accepted', 'rejected') and trade_row.requested_with <> current_user_id then
    raise exception 'Only the requested user can respond';
  end if;

  if next_status = 'accepted' then
    select *
    into offered_item
    from public.trade_offer_items
    where trade_offer_id = target_trade_id
      and owner_user_id = trade_row.offered_by
    limit 1;

    select *
    into requested_item
    from public.trade_offer_items
    where trade_offer_id = target_trade_id
      and owner_user_id = trade_row.requested_with
    limit 1;

    select quantity into current_qty
    from public.user_stickers
    where user_id = trade_row.offered_by
      and sticker_id = offered_item.sticker_id
    for update;

    if coalesce(current_qty, 0) < offered_item.quantity then
      raise exception 'Offer creator no longer has enough stickers';
    end if;

    select quantity into current_qty
    from public.user_stickers
    where user_id = trade_row.requested_with
      and sticker_id = requested_item.sticker_id
    for update;

    if coalesce(current_qty, 0) < requested_item.quantity then
      raise exception 'Target user no longer has enough stickers';
    end if;

    update public.user_stickers
    set quantity = quantity - offered_item.quantity,
        updated_at = now()
    where user_id = trade_row.offered_by
      and sticker_id = offered_item.sticker_id;

    update public.user_stickers
    set quantity = quantity - requested_item.quantity,
        updated_at = now()
    where user_id = trade_row.requested_with
      and sticker_id = requested_item.sticker_id;

    insert into public.user_stickers (user_id, sticker_id, quantity)
    values (trade_row.offered_by, requested_item.sticker_id, requested_item.quantity)
    on conflict (user_id, sticker_id)
    do update set quantity = public.user_stickers.quantity + excluded.quantity, updated_at = now();

    insert into public.user_stickers (user_id, sticker_id, quantity)
    values (trade_row.requested_with, offered_item.sticker_id, offered_item.quantity)
    on conflict (user_id, sticker_id)
    do update set quantity = public.user_stickers.quantity + excluded.quantity, updated_at = now();
  end if;

  update public.trade_offers
  set status = next_status,
      updated_at = now()
  where id = target_trade_id;
end;
$$;
