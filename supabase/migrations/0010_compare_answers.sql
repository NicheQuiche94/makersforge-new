-- /compare: the questions behind the suggested order (Andre 2026-11-25):
-- level, how past hires went, who runs the hiring, how important it is, referrals asked.
alter table public.compare_requests add column if not exists answers jsonb;
