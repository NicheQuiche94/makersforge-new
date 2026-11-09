-- Hire timeline tool leads (/hire-timeline, Andre 2026-11-09). Service role only (RLS on, no policies).
create table if not exists public.timeline_requests (
  lid text primary key,
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  title text not null,
  tier text not null check (tier in ('team','senior','executive')),
  country text not null,
  method text not null check (method in ('jobad','recruiter')),
  need_by date,
  weeks_late integer,
  opened_at timestamptz,
  booking_id uuid,
  folk_synced_at timestamptz
);
create index if not exists timeline_requests_created_idx on public.timeline_requests (created_at);
alter table public.timeline_requests enable row level security;
