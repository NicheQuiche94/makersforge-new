-- Client self-onboarding (2026-11-04). Lives in the makersforge-portal project
-- alongside the parked affiliate schema (0001/0002 on feature/affiliate-portal);
-- table names don't overlap. Everything here is read and written server-side
-- with the service role: RLS is ON with no policies, so the anon key can't touch
-- any of it. The app checks who's signed in (client email or admin) in code.

-- A client company and the people who can sign in for it.
create table client_accounts (
  id             uuid primary key default gen_random_uuid(),
  company        text not null,            -- display name, e.g. "Northwind Games"
  legal_name     text,                     -- registered company name, for terms + invoices
  company_number text,
  address        text,
  vat_number     text,
  po_number      text,
  accounts_email text,
  tracker_url    text,                     -- their Airtable base, set by Andre when he invites them
  created_at     timestamptz not null default now()
);

create table client_users (
  id         uuid primary key default gen_random_uuid(),
  account_id uuid not null references client_accounts(id) on delete cascade,
  email      text not null unique,
  name       text,
  title      text,
  user_id    uuid references auth.users(id), -- set once they verify their email
  created_at timestamptz not null default now()
);
create index on client_users (account_id);

-- Andre's capacity: each Monday is a search week with N slots (default 2).
-- One role = one slot. Blocked weeks take no bookings.
create table search_weeks (
  week_start date primary key check (extract(isodow from week_start) = 1),
  slots      int not null default 2 check (slots >= 0),
  blocked    boolean not null default false,
  note       text
);

create type booking_plan as enum ('permanent', 'contract', 'batch');
create type booking_status as enum ('new', 'confirmed', 'searching', 'shortlist_sent', 'complete', 'cancelled');

create table bookings (
  id               uuid primary key default gen_random_uuid(),
  ref              text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 6)),
  account_id       uuid not null references client_accounts(id),
  created_by       uuid not null references client_users(id),
  plan             booking_plan not null,
  retained         boolean not null default false,
  fees             int[] not null,         -- fee per hire in order, in £, after any retained discount
  retainer         int not null default 0, -- £, 0 unless retained
  retainer_paid_at timestamptz,
  brief_confirmed_at timestamptz,
  status           booking_status not null default 'new',
  terms_version    text not null,          -- hash of the exact terms text signed
  terms_pdf_path   text,                   -- storage path of the signed PDF
  change_request   text,                   -- "Need a change to the terms?" text, if any
  created_at       timestamptz not null default now()
);
create index on bookings (account_id);

create table booking_roles (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references bookings(id) on delete cascade,
  position        int not null,            -- 1-based order within the booking
  title           text,
  location        text,
  budget          text,
  musts           text,
  spec_text       text,
  spec_file_path  text,
  search_week     date not null references search_weeks(week_start),
  shortlist_sent_at timestamptz,
  hired_at        timestamptz,
  fee             int,                     -- the fee for this hire once made (order of hires, not of roles)
  invoice_amount  int,                     -- fee minus any retainer credit used
  unique (booking_id, position)
);
create index on booking_roles (search_week);

-- The click-to-sign record: who, when, from where, against which terms text.
create table booking_signatures (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null unique references bookings(id) on delete cascade,
  name        text not null,
  title       text not null,
  email       text not null,
  ip          text,
  user_agent  text,
  terms_hash  text not null,
  signed_at   timestamptz not null default now()
);

-- What happened, for the admin timeline and the client's notifications.
create table booking_events (
  id         bigint generated always as identity primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  kind       text not null,
  detail     jsonb not null default '{}',
  at         timestamptz not null default now()
);
create index on booking_events (booking_id, at desc);

-- Open slots per week: slots minus roles already booked on live bookings.
create or replace view search_week_availability as
select w.week_start, w.slots, w.blocked,
       greatest(0, case when w.blocked then 0 else w.slots end - count(r.id) filter (where b.status <> 'cancelled'))::int as open
from search_weeks w
left join booking_roles r on r.search_week = w.week_start
left join bookings b on b.id = r.booking_id
group by w.week_start, w.slots, w.blocked;

-- Book every role in one go. Locks the weeks involved so two clients can't take
-- the last slot at the same moment; raises 'week_full' if any week has no room.
-- roles: [{"title","location","budget","musts","spec_text","spec_file_path","search_week"}]
create or replace function create_booking(
  p_account uuid, p_user uuid, p_plan booking_plan, p_retained boolean,
  p_fees int[], p_retainer int, p_terms_version text, p_change_request text, p_roles jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_booking uuid;
  v_week record;
  v_role jsonb;
  v_pos int := 0;
begin
  for v_week in
    select (r->>'search_week')::date as wk, count(*) as needed
    from jsonb_array_elements(p_roles) r group by 1
  loop
    perform 1 from search_weeks where week_start = v_week.wk for update;
    if not found then raise exception 'week_full: %', v_week.wk; end if;
    if (select open from search_week_availability where week_start = v_week.wk) < v_week.needed then
      raise exception 'week_full: %', v_week.wk;
    end if;
  end loop;

  insert into bookings (account_id, created_by, plan, retained, fees, retainer, terms_version, change_request)
  values (p_account, p_user, p_plan, p_retained, p_fees, p_retainer, p_terms_version, p_change_request)
  returning id into v_booking;

  for v_role in select * from jsonb_array_elements(p_roles) loop
    v_pos := v_pos + 1;
    insert into booking_roles (booking_id, position, title, location, budget, musts, spec_text, spec_file_path, search_week)
    values (v_booking, v_pos, v_role->>'title', v_role->>'location', v_role->>'budget', v_role->>'musts',
            v_role->>'spec_text', v_role->>'spec_file_path', (v_role->>'search_week')::date);
  end loop;

  insert into booking_events (booking_id, kind) values (v_booking, 'booked');
  return v_booking;
end $$;

alter table client_accounts    enable row level security;
alter table client_users       enable row level security;
alter table search_weeks       enable row level security;
alter table bookings           enable row level security;
alter table booking_roles      enable row level security;
alter table booking_signatures enable row level security;
alter table booking_events     enable row level security;
revoke all on function create_booking from public, anon, authenticated;

-- The next 26 Mondays open at 2 slots each; Andre blocks weeks off in the admin.
insert into search_weeks (week_start)
select d::date from generate_series(date_trunc('week', now()) + interval '7 days', date_trunc('week', now()) + interval '26 weeks', interval '7 days') d
on conflict do nothing;

-- Private storage for spec uploads and signed terms PDFs (service role only).
insert into storage.buckets (id, name, public) values ('onboarding', 'onboarding', false) on conflict do nothing;

-- Views skip RLS unless they run as the caller: lock the availability view
-- down too (the app reads it with the service role).
alter view search_week_availability set (security_invoker = true);
revoke all on search_week_availability from anon, authenticated;
revoke all on client_accounts, client_users, search_weeks, bookings, booking_roles, booking_signatures, booking_events from anon, authenticated;
