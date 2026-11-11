-- What's Appening (Andre 2026-11-10): a "Built by" section. The people who
-- made it get credit (and a reason to share): studio blurb, website,
-- studio LinkedIn, and up to 4 builders with role and LinkedIn.
alter table public.appening_entries
  add column if not exists studio_about text,
  add column if not exists studio_linkedin text,
  add column if not exists builders jsonb not null default '[]'::jsonb; -- [{name, role, linkedin}]
