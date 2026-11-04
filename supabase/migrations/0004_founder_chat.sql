-- Founder chat (2026-11-04): visitors message Andre from the site, it lands
-- in his Telegram, his replies come back to the site (and their email).
-- Server-side only, like the onboarding tables: RLS on, no policies.

create table chat_threads (
  id              uuid primary key default gen_random_uuid(),
  visitor_id      uuid not null unique,       -- random id kept in the visitor's browser
  name            text,
  email           text,
  first_page      text,
  last_seen_at    timestamptz not null default now(), -- updated while their chat window polls
  last_message_at timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create table chat_messages (
  id           bigint generated always as identity primary key,
  thread_id    uuid not null references chat_threads(id) on delete cascade,
  sender       text not null check (sender in ('visitor', 'andre')),
  body         text not null check (length(body) between 1 and 4000),
  page         text,
  telegram_id  bigint,                        -- the Telegram message it was sent as / came from
  emailed_at   timestamptz,                   -- Andre's reply also emailed (they'd left)
  at           timestamptz not null default now()
);
create index on chat_messages (thread_id, at);
create index on chat_messages (telegram_id);

alter table chat_threads  enable row level security;
alter table chat_messages enable row level security;
revoke all on chat_threads, chat_messages from anon, authenticated;
