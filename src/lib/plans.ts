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
 * Batch fees (Andre 2026-11-02): each hire £1,000 less than the one before:
 * 1st £12,000, 2nd £11,000, 3rd £10,000, 4th £9,000, 5th £8,000. They only pay
 * for hires made, so releasing 5 roles and filling 3 costs the same as a batch of 3.
 */
export const SINGLE_FEE = 12_000;
export const BATCH_STEPS = [12_000, 11_000, 10_000, 9_000, 8_000];
export const BATCH_SIZES = [2, 3, 4, 5];
export const BATCH_MAX = BATCH_STEPS.length;
export const RETAINED_OFF = 0.15;

export const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
/** "£9,350" → "£9.35k" style, for the batch ladder. */
export const gbpK = (n: number) => `£${+(n / 1000).toFixed(2)}k`;
export const retainedFee = (fee: number) => fee * (1 - RETAINED_OFF);
/** The fees for the first n hires, in order. */
export const batchSteps = (roles: number) => BATCH_STEPS.slice(0, Math.max(1, roles));
/** What a batch costs if every role is filled. */
export const batchTotal = (roles: number) => batchSteps(roles).reduce((a, b) => a + b, 0);
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

const one = retainedPrice(SINGLE_FEE);
const low = BATCH_STEPS[BATCH_MAX - 1];

export const PLANS: Plan[] = [
  {
    id: "permanent",
    name: "Permanent hire",
    price: "£12,000",
    per: "per hire, on success",
    blurb: "One flat fee for your hire. No percentage of salary.",
    points: [SHORTLIST, "Nothing up front"],
    retained: {
      price: gbp(one.total),
      per: "per hire, retained",
      points: [SHORTLIST, `${gbp(one.upfront)} up front, ${gbp(one.rest)} when your hire starts`],
    },
    cta: "Start a brief",
  },
  {
    id: "contract",
    name: "Contractor",
    price: "£1,000",
    per: "per contractor, per month engaged",
    blurb: "You pay the specialist directly. No markup on their rate.",
    points: [SHORTLIST, "Stops the month the engagement ends", "Scale up or down month to month"],
    cta: "Start a brief",
  },
  {
    id: "batch",
    name: "Batch",
    badge: "Best value",
    price: `${gbp(SINGLE_FEE)} to ${gbp(low)}`,
    per: "per hire",
    blurb: `Give us 2 to ${BATCH_MAX} permanent roles at once. Each hire costs £1,000 less than the last.`,
    points: ["Each role gets its own search week and 5 candidates", "Pay only for the hires you make"],
    retained: {
      price: `${gbp(retainedFee(SINGLE_FEE))} to ${gbp(retainedFee(low))}`,
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
  { row: "On success", cells: { permanent: "£12,000 when they start", contract: "£1,000 a month while engaged", batch: `£12,000, then £1,000 less each hire, down to ${gbp(low)}` } },
  { row: "Retained (15% off)", cells: { permanent: `${gbp(one.total)}: ${gbp(one.upfront)} up front, ${gbp(one.rest)} on hire`, contract: "Monthly, so no retainer", batch: `${gbp(retainedFee(SINGLE_FEE))} down to ${gbp(retainedFee(low))}: a third up front, counted towards your first hires` } },
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
