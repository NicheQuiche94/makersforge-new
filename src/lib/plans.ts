import { CURRENCY_SYMBOLS, RATES, type Currency } from "@/lib/currency";
/**
 * Plans & capacity (PROTOTYPE 2026-11-02, Andre's self-onboarding brief).
 * One source for the homepage section, /pricing and the /start flow.
 * Plan prices are working figures and need Andre's sign-off before anything
 * ships. Capacity is a mock:
 * it becomes the weekly search slots Andre sets in admin.
 *
 * Rules from Andre (2026-11-02):
 *  - "3 free profiles" is only the lead magnet, never part of a plan.
 *  - One rhythm for everyone: outreach Monday, calls Tue to Thu, shortlist
 *    the following Monday. No faster tier.
 *  - Recommend pay as you go for the first role.
 *  - No guarantee or replacement for now (on the bench: MF helps hire, retention is the studio's).
 *  - Max 2 searches a week. The plan is picked LAST in the flow (after week, brief, terms).
 */

/*
 * Pricing v3 (Andre 2026-11-02): no subscriptions, no lock-ins, no anchor
 * package (less is more). Three options: a permanent hire, a contractor, or
 * a batch of permanent roles. Permanent and batch can be paid on success or
 * retained (a third up front, 15% off); the toggle on /pricing switches the
 * cards. Contractors are monthly, so never retained or batched. No spreading
 * the retainer (attracts the wrong clients).
 */
export type PlanId = "permanent" | "contract" | "batch";
export type PayWhen = "success" | "retained";

type Face = { price: string; per: string; points: string[] };
export type Plan = Face & {
  id: PlanId;
  name: string;
  blurb: string;
  cta: string;
  /** The card when the toggle is on Retained (only for plans that can be retained). */
  retained?: Face;
  badge?: string;
};

/** The promise on every search: Andre's version of a guarantee. */
const SHORTLIST = "5 candidates the Monday after your search week";

/**
 * Three tiers by the level in the job title (Andre 2026-11-09, lib/tier):
 * Team £9,000, Senior £14,000, Executive £20,000, flat. Retained is 15% off.
 * Batches of 2–5 Team or Senior roles: each hire £1,000 less than the one
 * before. No hire is ever less than £7,000, whatever discounts apply (Andre's
 * monthly minimum). Executive roles are never batch-discounted.
 */
export type { Tier } from "@/lib/tier";
import type { Tier } from "@/lib/tier";
export const TIERS: Tier[] = ["team", "senior", "executive"];
export const TIER_FEE: Record<Tier, number> = { team: 9_000, senior: 14_000, executive: 20_000 };
export const TIER_NAME: Record<Tier, string> = { team: "Team", senior: "Senior", executive: "Executive" };
export const FEE_FLOOR = 7_000;
export const BATCH_STEP = 1_000;
export const BATCH_SIZES = [2, 3, 4, 5];
export const BATCH_MAX = 5;
export const RETAINED_OFF = 0.15;
/** Contractors: £ per month per contractor, by tier (Andre 2026-11-09). */
export const CONTRACT_TIER_FEE: Record<Tier, number> = { team: 800, senior: 1_200, executive: 2_000 };
/** Kept for older callers: the Team monthly fee. */
export const CONTRACT_FEE = CONTRACT_TIER_FEE.team;
/** Contractor fees in words, for terms and summaries. */
export const contractFeesText = () => `£800 a month for a Team role, £1,200 for Senior and £2,000 for Executive`;
/**
 * "Compared with a typical agency" (Andre 2026-11-09): a typical salary per
 * tier (the same benchmarks as /compare) and a usual agency rate, which
 * climbs with seniority.
 */
export const AGENCY_BENCH: Record<Tier, { salary: number; pct: number }> = {
  team: { salary: 55_000, pct: 0.2 },
  senior: { salary: 70_000, pct: 0.25 },
  executive: { salary: 100_000, pct: 0.3 },
};
/** Kept for older callers: the Team fee. */
export const SINGLE_FEE = TIER_FEE.team;

export const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
/** "£9,350" → "£9.35k" style, for the batch ladder. */
export const gbpK = (n: number) => `£${+(n / 1000).toFixed(2)}k`;
/** Retained price of a fee, never below the floor. */
export const retainedFee = (fee: number) => Math.max(FEE_FLOOR, Math.round(fee * (1 - RETAINED_OFF)));
/**
 * A hire's fee: its tier, less £1,000 for each hire before it in a batch
 * (not Executive), less any gift discount on the first hire, 15% off if
 * retained, and never below £7,000.
 */
export function hireFee(tier: Tier, position = 0, o: { batch?: boolean; retained?: boolean; discountPct?: number } = {}) {
  let f = TIER_FEE[tier] - (o.batch && tier !== "executive" ? BATCH_STEP * position : 0);
  if (position === 0 && o.discountPct) f *= 1 - o.discountPct / 100;
  if (o.retained) f *= 1 - RETAINED_OFF;
  return Math.max(FEE_FLOOR, Math.round(f));
}
/** The fees for a set of hires, in order (one tier per role). */
export const feesFor = (tiers: Tier[], batch: boolean, retained = false) => tiers.map((t, i) => hireFee(t, batch ? i : 0, { batch, retained }));
/** The batch ladder for one tier, 1st to 5th hire. */
export const ladder = (tier: Tier, retained = false) => Array.from({ length: BATCH_MAX }, (_, i) => hireFee(tier, i, { batch: true, retained }));
/** Kept for older callers. */
export const BATCH_STEPS = ladder("team");
export const batchSteps = (roles: number, tier: Tier = "team") => ladder(tier).slice(0, Math.max(1, roles));
export const batchTotal = (roles: number, tier: Tier = "team") => batchSteps(roles, tier).reduce((a, b) => a + b, 0);
/**
 * Retained: 15% off every hire. A third of the total for the roles released is
 * paid up front (rounded to £100) and credited against the first hires' fees,
 * so the account settles itself as hires happen. The retainer is non-refundable.
 */
export function retainedPrice(fullPrice: number) {
  const total = fullPrice * (1 - RETAINED_OFF);
  const upfront = Math.round(total / 3 / 100) * 100;
  return { total, upfront, rest: total - upfront };
}

export const PLANS: Plan[] = [
  {
    id: "permanent",
    name: "Permanent hire",
    price: gbp(TIER_FEE.team),
    per: `per hire · Senior ${gbp(TIER_FEE.senior)} · Executive ${gbp(TIER_FEE.executive)}`,
    blurb: "One flat fee per hire, set by the level of the role. Never a percentage of salary.",
    points: [SHORTLIST, "Nothing up front"],
    retained: {
      price: gbp(retainedFee(TIER_FEE.team)),
      per: `per hire · Senior ${gbp(retainedFee(TIER_FEE.senior))} · Executive ${gbp(retainedFee(TIER_FEE.executive))}`,
      points: [SHORTLIST, "A third up front, the rest when your hire starts"],
    },
    cta: "Start a brief",
  },
  {
    id: "contract",
    name: "Contractor",
    price: `from ${gbp(CONTRACT_TIER_FEE.team)}`,
    per: `per contractor, per month engaged · Senior ${gbp(CONTRACT_TIER_FEE.senior)} · Executive ${gbp(CONTRACT_TIER_FEE.executive)}`,
    blurb: "You pay the specialist directly. No markup on their rate.",
    points: [SHORTLIST, "Stops the month the engagement ends", "Scale up or down month to month"],
    cta: "Start a brief",
  },
  {
    id: "batch",
    name: "Batch",
    badge: "Best value",
    price: `from ${gbp(FEE_FLOOR)}`,
    per: "per hire",
    blurb: `Give us 2 to ${BATCH_MAX} Team or Senior roles at once. Each hire costs £1,000 less than the one before, never below ${gbp(FEE_FLOOR)}.`,
    points: ["Each role gets its own search week and 5 candidates", "Pay only for the hires you make"],
    retained: {
      price: `from ${gbp(FEE_FLOOR)}`,
      per: "per hire",
      points: ["Each role gets its own search week and 5 candidates", "A third up front, counted towards your first hires"],
    },
    cta: "Start a batch",
  },
];

export const planById = (id?: string | null) => PLANS.find((p) => p.id === id);


const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/**
 * Honest capacity (mock). Each Monday is a search week with a number of
 * search slots; Andre sets these in admin. Briefs book a week, and the
 * search runs that week with the shortlist the following Monday.
 */
const FIRST = "2026-11-09";
export const SLOTS_PER_WEEK = 2; // Andre: 2 searches a week, never more
const SLOTS = [2, 1, 0, 2, 1, 2, 0, 0, 2, 2, 2, 2]; // open slots per week, incl. the Christmas weeks off
export const WEEKS = SLOTS.map((open, i) => ({ start: addDays(FIRST, i * 7), open }));
export const CAPACITY = {
  openThisWeek: WEEKS[0].open,
  nextStart: WEEKS.find((w) => w.open > 0)!.start,
};

/**
 * One search slot per role (Andre 2026-11-02: a batch can't cram 5 roles into
 * one search week). Roles fill the open slots from the chosen week onwards,
 * so a batch of 3 from a week with 2 open slots runs 2 that week, 1 the next.
 * Booked slots are firm, first come first served: a reserved week is never
 * moved, even when one client holds both slots (Andre: there's a reason for it).
 */
export function scheduleRoles(start: string, roles: number, weeks: { start: string; open: number }[] = WEEKS) {
  const out: string[] = [];
  for (const w of weeks) {
    if (w.start < start) continue;
    for (let i = 0; i < w.open && out.length < roles; i++) out.push(w.start);
    if (out.length >= roles) break;
  }
  return out;
}

const day = (iso: string, opts: Intl.DateTimeFormatOptions) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", opts);
export const shortDate = (iso: string) => day(iso, { weekday: "short", day: "numeric", month: "short" });
export const monthOf = (iso: string) => day(iso, { month: "long", year: "numeric" });
export const dayNum = (iso: string) => day(iso, { day: "numeric" });

/** The search week that starts on a given Monday, as "9 to 13 Nov". */
export function fiveDays(iso: string) {
  return `${dayNum(iso)} to ${day(addDays(iso, 4), { day: "numeric", month: "short" })}`;
}
/** When the shortlist lands: the Monday after the search week. */
export const shortlistDate = (iso: string) => shortDate(addDays(iso, 7));

/** Terms that appear in the five-line summary (placeholders Andre still signs off). */
export const TERMS = {
  paymentDays: 14,
  cancelHours: 48,
  cancelFee: "£1,500",
  billableMonths: 12,
};

/** The collapsible "Compare all plans" table on /pricing. Columns follow PLANS. */
const all = (v: string) => ({ permanent: v, contract: v, batch: v });
export const COMPARE: { row: string; cells: Record<PlanId, string> }[] = [
  { row: "Roles", cells: { permanent: "One", contract: "One", batch: `2 to ${BATCH_MAX}` } },
  { row: "On success", cells: { permanent: `Team ${gbp(TIER_FEE.team)} · Senior ${gbp(TIER_FEE.senior)} · Executive ${gbp(TIER_FEE.executive)}`, contract: `Team ${gbp(CONTRACT_TIER_FEE.team)} · Senior ${gbp(CONTRACT_TIER_FEE.senior)} · Executive ${gbp(CONTRACT_TIER_FEE.executive)} a month while engaged`, batch: `Each hire £1,000 less, never below ${gbp(FEE_FLOOR)}` } },
  { row: "Retained (15% off)", cells: { permanent: `Team ${gbp(retainedFee(TIER_FEE.team))} · Senior ${gbp(retainedFee(TIER_FEE.senior))} · Executive ${gbp(retainedFee(TIER_FEE.executive))}`, contract: "Monthly, so no retainer", batch: "15% off each hire, never below £7,000" } },
  { row: "Search week", cells: all("Dedicated search time for your role") },
  { row: "Shortlist", cells: all("5, the Monday after your search week") },
  { row: "Interviews to offer", cells: all("We book the interviews and run the process") },
  { row: "Percentage of salary", cells: all("Never") },
  { row: "Payment terms", cells: all("14 days") },
  { row: "Cancel a search week", cells: all("Free up to 48h before") },
];

/** Open search slots left in the current month (the urgency line on /pricing and the homepage). */
export function slotsLeftThisMonth() {
  const month = WEEKS[0].start.slice(0, 7);
  const left = WEEKS.filter((w) => w.start.slice(0, 7) === month).reduce((n, w) => n + w.open, 0);
  return { month: monthOf(WEEKS[0].start).split(" ")[0], left };
}

/**
 * Prices in other currencies (Andre 2026-11-09). Each list price is the
 * pound price converted at lib/currency's fixed rates and rounded to the
 * nearest 1,000 (contractor monthly fees to the nearest 100). Everything
 * else is worked out from those round numbers in that currency, the same
 * way as in pounds: batch steps of 1,000, retained 15% off, and the floor.
 */
export type PriceList = {
  cur: Currency;
  fmt: (n: number) => string;
  fee: (tier: Tier, position?: number, o?: { batch?: boolean; retained?: boolean }) => number;
  base: Record<Tier, number>;
  floor: number;
  step: number;
  contract: Record<Tier, number>;
  salary: Record<Tier, number>;
  /** A typical agency fee for the tier: salary × its rate (rounded to 1,000 outside pounds). */
  agency: (tier: Tier) => number;
};
export function priceList(cur: Currency = "GBP"): PriceList {
  const r = RATES[cur];
  const to = (n: number, unit: number) => (cur === "GBP" ? n : Math.round((n * r) / unit) * unit);
  const each = (rec: Record<Tier, number>, unit: number) => ({ team: to(rec.team, unit), senior: to(rec.senior, unit), executive: to(rec.executive, unit) });
  const base = each(TIER_FEE, 1000);
  const floor = to(FEE_FLOOR, 1000);
  const step = BATCH_STEP;
  return {
    cur,
    fmt: (n) => `${CURRENCY_SYMBOLS[cur]}${Math.round(n).toLocaleString("en-GB")}`,
    base,
    floor,
    step,
    contract: each(CONTRACT_TIER_FEE, 100),
    salary: { team: to(AGENCY_BENCH.team.salary, 1000), senior: to(AGENCY_BENCH.senior.salary, 1000), executive: to(AGENCY_BENCH.executive.salary, 1000) },
    agency: (t) => to(AGENCY_BENCH[t].salary * AGENCY_BENCH[t].pct, 1000),
    fee: (tier, position = 0, o = {}) => {
      let f = base[tier] - (o.batch && tier !== "executive" ? step * position : 0);
      if (o.retained) f *= 1 - RETAINED_OFF;
      return Math.max(floor, Math.round(f));
    },
  };
}
