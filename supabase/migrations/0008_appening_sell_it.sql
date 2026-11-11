-- What's Appening (Andre 2026-11-10): let studios really sell their launch.
alter table public.appening_entries
  add column if not exists tagline text,             -- their one-liner
  add column if not exists highlights text[] not null default '{}', -- up to 3 "what makes it special"
  add column if not exists trailer_url text,         -- YouTube / Vimeo
  add column if not exists other_store_url text,     -- the other platform's link
  add column if not exists model text,               -- free-to-play / premium / subscription / free
  add column if not exists markets text,             -- global / soft launch: … / UK only …
  add column if not exists team text,                -- "12 people, Helsinki"
  add column if not exists proof text;               -- one proof point: rating, D1, award…
