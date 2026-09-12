-- ============================================================
-- LifeRPG – Supabase Schema
-- Run this entire file in your Supabase SQL Editor.
-- ============================================================

-- Enable UUID extension (already on in Supabase by default)
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. PLAYERS
-- ============================================================
create table if not exists public.players (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null default 'Hero',
  email           text not null default '',
  bio             text not null default '',
  title           text not null default 'Newcomer',
  avatar          text not null default '⚔️',
  level           int  not null default 1,
  current_xp      int  not null default 0,
  gold            int  not null default 100,
  attribute_points int not null default 0,
  strength        int  not null default 10,
  intellect       int  not null default 10,
  discipline      int  not null default 10,
  creativity      int  not null default 10,
  health          int  not null default 10,
  focus           int  not null default 10,
  streak          int  not null default 0,
  longest_streak  int  not null default 0,
  last_active_date text not null default '',
  joined_date     text not null default '',
  equipped_theme  text not null default 'dark-obsidian',
  equipped_badge  text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id)
);

-- ============================================================
-- 2. QUESTS
-- ============================================================
create table if not exists public.quests (
  id              text primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text not null default '',
  category        text not null default 'Personal',
  difficulty      text not null default 'Easy',
  xp_reward       int  not null default 10,
  gold_reward     int  not null default 5,
  attribute_type  text not null default 'Discipline',
  attribute_reward int not null default 1,
  is_daily        boolean not null default false,
  is_weekly       boolean not null default false,
  completed       boolean not null default false,
  completed_at    text,
  deadline        text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 3. ACHIEVEMENTS
-- ============================================================
create table if not exists public.achievements (
  id               text primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  title            text not null,
  description      text not null default '',
  icon             text not null default '🏆',
  category         text not null default 'General',
  current_progress int  not null default 0,
  max_progress     int  not null default 1,
  unlocked         boolean not null default false,
  unlocked_at      text,
  reward_xp        int  not null default 0,
  reward_gold      int  not null default 0,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 4. SHOP ITEMS
-- ============================================================
create table if not exists public.shop_items (
  id               text primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  name             text not null,
  description      text not null default '',
  category         text not null default 'Power-ups',
  price            int  not null default 0,
  icon             text not null default '🎁',
  value            text not null default '',
  is_purchased     boolean not null default false,
  is_equipped      boolean not null default false,
  buff_description text,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 5. INVENTORY
-- ============================================================
create table if not exists public.inventory (
  id               text primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  name             text not null,
  description      text not null default '',
  category         text not null default 'Power-ups',
  price            int  not null default 0,
  icon             text not null default '🎁',
  value            text not null default '',
  is_purchased     boolean not null default true,
  is_equipped      boolean not null default false,
  buff_description text,
  purchased_at     text not null default '',
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 6. SKILLS
-- ============================================================
create table if not exists public.skills (
  id                  text primary key,
  user_id             uuid not null references auth.users(id) on delete cascade,
  title               text not null,
  branch              text not null default 'Intellect',
  tier                int  not null default 1,
  description         text not null default '',
  icon                text not null default '⭐',
  required_level      int  not null default 1,
  req_attr_type       text not null default 'Intellect',
  req_attr_value      int  not null default 0,
  cost_attribute_points int not null default 1,
  cost_gold           int  not null default 0,
  unlocked            boolean not null default false,
  unlocked_at         text,
  parent_id           text,
  perk                text not null default '',
  created_at          timestamptz not null default now()
);

-- ============================================================
-- 7. LOOT CHESTS
-- ============================================================
create table if not exists public.loot_chests (
  id               text primary key,
  user_id          uuid not null references auth.users(id) on delete cascade,
  type             text not null default 'daily',
  name             text not null,
  description      text not null default '',
  requirement_text text not null default '',
  progress         int  not null default 0,
  max_progress     int  not null default 1,
  unlocked         boolean not null default false,
  opened           boolean not null default false,
  reward_gold      int  not null default 0,
  reward_xp        int  not null default 0,
  reward_title     text,
  reward_badge     text,
  reward_avatar    text,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 8. DAILY MISSIONS
-- ============================================================
create table if not exists public.daily_missions (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  category    text not null default 'General',
  target      int  not null default 1,
  current     int  not null default 0,
  completed   boolean not null default false,
  reward_xp   int  not null default 0,
  reward_gold int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 9. GAME SETTINGS
-- ============================================================
create table if not exists public.game_settings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  sound_enabled       boolean not null default true,
  animations_enabled  boolean not null default true,
  theme               text not null default 'dark-obsidian',
  quest_reminders     boolean not null default true,
  streak_alerts       boolean not null default true,
  daily_bonus_claimed boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(user_id)
);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  message    text not null default '',
  timestamp  text not null default 'Just now',
  type       text not null default 'quest',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) – users only access their own rows
-- ============================================================

alter table public.players        enable row level security;
alter table public.quests         enable row level security;
alter table public.achievements   enable row level security;
alter table public.shop_items     enable row level security;
alter table public.inventory      enable row level security;
alter table public.skills         enable row level security;
alter table public.loot_chests    enable row level security;
alter table public.daily_missions enable row level security;
alter table public.game_settings  enable row level security;
alter table public.notifications  enable row level security;

-- Helper macro: each table gets SELECT/INSERT/UPDATE/DELETE policies
-- restricted to auth.uid() = user_id

-- players
create policy "players_select"   on public.players for select using (auth.uid() = user_id);
create policy "players_insert"   on public.players for insert with check (auth.uid() = user_id);
create policy "players_update"   on public.players for update using (auth.uid() = user_id);
create policy "players_delete"   on public.players for delete using (auth.uid() = user_id);

-- quests
create policy "quests_select"    on public.quests for select using (auth.uid() = user_id);
create policy "quests_insert"    on public.quests for insert with check (auth.uid() = user_id);
create policy "quests_update"    on public.quests for update using (auth.uid() = user_id);
create policy "quests_delete"    on public.quests for delete using (auth.uid() = user_id);

-- achievements
create policy "ach_select"       on public.achievements for select using (auth.uid() = user_id);
create policy "ach_insert"       on public.achievements for insert with check (auth.uid() = user_id);
create policy "ach_update"       on public.achievements for update using (auth.uid() = user_id);
create policy "ach_delete"       on public.achievements for delete using (auth.uid() = user_id);

-- shop_items
create policy "shop_select"      on public.shop_items for select using (auth.uid() = user_id);
create policy "shop_insert"      on public.shop_items for insert with check (auth.uid() = user_id);
create policy "shop_update"      on public.shop_items for update using (auth.uid() = user_id);
create policy "shop_delete"      on public.shop_items for delete using (auth.uid() = user_id);

-- inventory
create policy "inv_select"       on public.inventory for select using (auth.uid() = user_id);
create policy "inv_insert"       on public.inventory for insert with check (auth.uid() = user_id);
create policy "inv_update"       on public.inventory for update using (auth.uid() = user_id);
create policy "inv_delete"       on public.inventory for delete using (auth.uid() = user_id);

-- skills
create policy "skills_select"    on public.skills for select using (auth.uid() = user_id);
create policy "skills_insert"    on public.skills for insert with check (auth.uid() = user_id);
create policy "skills_update"    on public.skills for update using (auth.uid() = user_id);
create policy "skills_delete"    on public.skills for delete using (auth.uid() = user_id);

-- loot_chests
create policy "chests_select"    on public.loot_chests for select using (auth.uid() = user_id);
create policy "chests_insert"    on public.loot_chests for insert with check (auth.uid() = user_id);
create policy "chests_update"    on public.loot_chests for update using (auth.uid() = user_id);
create policy "chests_delete"    on public.loot_chests for delete using (auth.uid() = user_id);

-- daily_missions
create policy "missions_select"  on public.daily_missions for select using (auth.uid() = user_id);
create policy "missions_insert"  on public.daily_missions for insert with check (auth.uid() = user_id);
create policy "missions_update"  on public.daily_missions for update using (auth.uid() = user_id);
create policy "missions_delete"  on public.daily_missions for delete using (auth.uid() = user_id);

-- game_settings
create policy "settings_select"  on public.game_settings for select using (auth.uid() = user_id);
create policy "settings_insert"  on public.game_settings for insert with check (auth.uid() = user_id);
create policy "settings_update"  on public.game_settings for update using (auth.uid() = user_id);
create policy "settings_delete"  on public.game_settings for delete using (auth.uid() = user_id);

-- notifications
create policy "notif_select"     on public.notifications for select using (auth.uid() = user_id);
create policy "notif_insert"     on public.notifications for insert with check (auth.uid() = user_id);
create policy "notif_update"     on public.notifications for update using (auth.uid() = user_id);
create policy "notif_delete"     on public.notifications for delete using (auth.uid() = user_id);

-- ============================================================
-- updated_at trigger for players & game_settings
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger players_updated_at
  before update on public.players
  for each row execute procedure public.handle_updated_at();

create trigger game_settings_updated_at
  before update on public.game_settings
  for each row execute procedure public.handle_updated_at();
