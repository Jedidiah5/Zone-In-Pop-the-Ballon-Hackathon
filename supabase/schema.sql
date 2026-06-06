-- Run this in your Supabase SQL Editor (Dashboard → SQL → New query)

-- Profiles (one per user)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  platform text check (platform in ('uber', 'bolt', 'deliveroo', 'stuart')),
  home_area text,
  active_zone text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

-- Zone search history
create table if not exists public.zone_searches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  platform text not null,
  location text not null,
  source text,
  source_reason text,
  zones jsonb not null default '[]'::jsonb,
  created_at timestamptz default timezone('utc', now()) not null
);

create index if not exists zone_searches_user_created_idx
  on public.zone_searches (user_id, created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.zone_searches enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can view own searches"
  on public.zone_searches for select
  using (auth.uid() = user_id);

create policy "Users can insert own searches"
  on public.zone_searches for insert
  with check (auth.uid() = user_id);
