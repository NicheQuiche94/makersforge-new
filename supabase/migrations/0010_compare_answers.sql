-- /compare: the questions behind the suggested order (Andre 2026-11-25):
-- level, how many people could do it, in-house TA, fee possible, referrals asked.
alter table public.compare_requests add column if not exists answers jsonb;
