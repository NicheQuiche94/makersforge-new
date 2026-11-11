-- What's Appening (Andre 2026-11-10): a spotlight on new mobile games and
-- apps. Two editions (games, apps), 3 spotlights + a list per issue.
-- Entries come from two places: studios that apply (/whats-appening/apply)
-- and launches our App Store radar finds. Service role only (RLS on, no policies).

create table if not exists public.appening_issues (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  edition text not null check (edition in ('games','apps')),
  number integer not null,
  intro text,
  status text not null default 'draft' check (status in ('draft','approved')),
  approved_at timestamptz,
  published_on date,           -- set by the daily job the day it goes out
  emailed_at timestamptz,
  unique (edition, number)
);

create table if not exists public.appening_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  origin text not null check (origin in ('applied','found')),
  edition text not null check (edition in ('games','apps')),
  store text not null check (store in ('ios','android')),
  store_id text not null,
  store_url text not null,
  name text not null,
  publisher text,
  icon_url text,
  genre text,
  release_date date,
  store_text text,
  screenshots jsonb not null default '[]'::jsonb,
  website text,
  -- from the application form
  email text,
  contact_name text,
  pitch text,
  hiring boolean,
  -- from the radar
  signal text,
  -- editorial
  status text not null default 'new' check (status in ('new','booked','declined')),
  issue_id uuid references public.appening_issues(id) on delete set null,
  slot text check (slot in ('spotlight','list')),
  position integer,
  take_draft text,
  take text,
  booked_mail_at timestamptz,
  live_mail_at timestamptz,
  unique (store, store_id)
);
create index if not exists appening_entries_queue_idx on public.appening_entries (edition, status, created_at);
create index if not exists appening_entries_issue_idx on public.appening_entries (issue_id);

create table if not exists public.appening_subscribers (
  email text primary key,
  created_at timestamptz not null default now(),
  editions text[] not null default array['games','apps'],
  token text not null unique,
  source text,
  unsubscribed_at timestamptz
);

-- One row of settings: launch date (null = not launched) and cadence.
create table if not exists public.appening_settings (
  id boolean primary key default true check (id),
  launch_on date,
  cadence text not null default 'alternate' check (cadence in ('alternate','weekly')),
  first_edition text not null default 'games' check (first_edition in ('games','apps'))
);
insert into public.appening_settings (id) values (true) on conflict do nothing;

alter table public.appening_issues enable row level security;
alter table public.appening_entries enable row level security;
alter table public.appening_subscribers enable row level security;
alter table public.appening_settings enable row level security;
