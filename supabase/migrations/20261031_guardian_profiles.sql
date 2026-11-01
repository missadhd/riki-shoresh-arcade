-- Riki's Arcade: guardian-owned profiles, isolated save snapshots and entitlements.
-- Apply to a SEPARATE Supabase TEST project first. Do not run in production without review.
-- Requires Supabase Auth auth.users. No child email, DOB, or password is stored.
begin;
create extension if not exists pgcrypto;
create table if not exists public.arcade_guardians (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  created_at timestamptz not null default now()
);
create table if not exists public.arcade_players (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.arcade_guardians(user_id) on delete cascade,
  nickname text not null check (length(btrim(nickname)) between 1 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.arcade_progress (
  player_id uuid primary key references public.arcade_players(id) on delete cascade,
  version integer not null default 1 check (version >= 1),
  snapshot jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  check (pg_column_size(snapshot) <= 1048576)
);
create table if not exists public.arcade_entitlements (
  guardian_id uuid primary key references public.arcade_guardians(user_id) on delete cascade,
  access_mode text not null default 'open' check (access_mode in ('open','invited','subscribed')),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.arcade_guardians enable row level security;
alter table public.arcade_players enable row level security;
alter table public.arcade_progress enable row level security;
alter table public.arcade_entitlements enable row level security;
create policy "guardian self read" on public.arcade_guardians for select to authenticated using ((select auth.uid()) = user_id);
create policy "guardian self create" on public.arcade_guardians for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "guardian self edit" on public.arcade_guardians for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "guardian players read" on public.arcade_players for select to authenticated using ((select auth.uid()) = guardian_id);
create policy "guardian players create" on public.arcade_players for insert to authenticated with check ((select auth.uid()) = guardian_id);
create policy "guardian players edit" on public.arcade_players for update to authenticated using ((select auth.uid()) = guardian_id) with check ((select auth.uid()) = guardian_id);
create policy "guardian players delete" on public.arcade_players for delete to authenticated using ((select auth.uid()) = guardian_id);
create policy "guardian progress read" on public.arcade_progress for select to authenticated using (exists(select 1 from public.arcade_players p where p.id = player_id and p.guardian_id = (select auth.uid())));
create policy "guardian progress create" on public.arcade_progress for insert to authenticated with check (exists(select 1 from public.arcade_players p where p.id = player_id and p.guardian_id = (select auth.uid())));
create policy "guardian progress edit" on public.arcade_progress for update to authenticated using (exists(select 1 from public.arcade_players p where p.id = player_id and p.guardian_id = (select auth.uid()))) with check (exists(select 1 from public.arcade_players p where p.id = player_id and p.guardian_id = (select auth.uid())));
-- Entitlements are set by a trusted server/admin only; do not add client write policy.
create policy "guardian entitlement read" on public.arcade_entitlements for select to authenticated using ((select auth.uid()) = guardian_id);
commit;
