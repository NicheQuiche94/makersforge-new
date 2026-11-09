-- Global currency (Andre 2026-11-09): every amount on a booking is in this currency.
alter table public.bookings add column if not exists currency text not null default 'GBP' check (currency in ('GBP','EUR','USD'));
comment on column public.bookings.currency is 'Currency every amount on this booking (fees, retainer, invoices) is in. Prices: lib/plans priceList.';
