/**
 * "Every way to hire, compared" (Andre 2026-11-07, MOCKUP): the shared model
 * behind /compare (the form), the email it sends, and /compare/result (the
 * comparison the email links to). Every number is a draft assumption for
 * Andre to set.
 */

export const HOOKS = [
  { h: "Hiring, but not sure which route is most cost-effective?", g: "We'll compare them for your role." },
  { h: "Which way of hiring is most efficient for your team?", g: "Compare every route for your role." },
  { h: "How much team time will this hire really cost you?", g: "See every route side by side." },
];

export const ROLES = [
  { id: "ua", label: "UA Manager", salary: 55000 },
  { id: "senior-ua", label: "Senior UA Manager", salary: 70000 },
  { id: "head-growth", label: "Head of UA / Growth", salary: 100000 },
  { id: "game-designer", label: "Game Designer", salary: 50000 },
  { id: "game-artist", label: "Senior Game Artist", salary: 55000 },
  { id: "unity", label: "Senior Unity Engineer", salary: 70000 },
  { id: "product", label: "Product Manager", salary: 75000 },
];

export const NOTICE_WEEKS = 4; // typical notice between an accepted offer and a start date
export const HOURLY = 60; // team time, £ an hour

export type Route = {
  id: string;
  name: string;
  how: string;
  fee: (salary: number) => number;
  feeNote: string;
  shortlist: string;
  hireWeeks: [number, number];
  get: string;
  interviews: number;
  hours: { label: string; h: number }[];
  tips: string[];
  us?: boolean;
};

export const ROUTES: Route[] = [
  {
    id: "mf",
    name: "MakersForge",
    how: "Mobile games and apps specialists, flat fee",
    fee: () => 12000,
    feeNote: "£12,000 flat, paid only if you hire",
    shortlist: "1 week",
    hireWeeks: [3, 5],
    get: "5 vetted people",
    interviews: 4,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Interviews", h: 6 },
      { label: "Coordination", h: 1 },
    ],
    tips: ["Book a search week online, no sales call.", "You get 5 people in about 5 working days, each already interviewed by us.", "If nobody fits, you pay nothing."],
    us: true,
  },
  {
    id: "games20",
    name: "Games-specialist agency",
    how: "A mobile games recruiter at 20%",
    fee: (s) => s * 0.2,
    feeNote: "20% of first-year salary",
    shortlist: "1–2 weeks",
    hireWeeks: [5, 8],
    get: "8–12 CVs",
    interviews: 6,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 2 },
      { label: "Interviews", h: 9 },
      { label: "Coordination", h: 3 },
    ],
    tips: ["Ask how many hires they've made for this exact role in the last year.", "Ask for a replacement guarantee if the hire leaves early.", "Agree up front how many CVs you'll see."],
  },
  {
    id: "tech25",
    name: "General tech agency",
    how: "A broad tech recruiter at 25%",
    fee: (s) => s * 0.25,
    feeNote: "25% of first-year salary",
    shortlist: "2–3 weeks",
    hireWeeks: [6, 10],
    get: "10–20 CVs",
    interviews: 8,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 4 },
      { label: "Interviews", h: 12 },
      { label: "Coordination", h: 4 },
    ],
    tips: ["Check they understand mobile metrics (ROAS, LTV, retention) before you brief them.", "Expect to filter more CVs that aren't from games or apps."],
  },
  {
    id: "ads",
    name: "Job ad, hire yourself",
    how: "Job boards plus an applicant tracking system",
    fee: () => 400 + 350 * 3,
    feeNote: "About £400 on job boards + about £350 a month for tracking software",
    shortlist: "3–6 weeks",
    hireWeeks: [8, 12],
    get: "200–500 applications",
    interviews: 10,
    hours: [
      { label: "Writing and posting the ad", h: 3 },
      { label: "Screening applications", h: 18 },
      { label: "Interviews", h: 15 },
      { label: "Coordination", h: 6 },
    ],
    tips: ["Post on Games Jobs Direct, Hitmarker and LinkedIn Jobs.", "Add 2–3 screening questions to cut the pile down fast.", "Block out screening time every day, or the good applicants go elsewhere."],
  },
];

export type Priority = "balanced" | "cost" | "speed" | "hours";
/** What the visitor told us. Travels in the result link (mockup; the real build stores it and links by id). */
export type CompareInput = {
  role: string;
  salary: number;
  start?: string; // yyyy-mm-dd
  budget?: number;
  p: Priority;
  name?: string;
  company?: string;
  hook: number; // which headline they saw (A/B)
  lid: string; // this request's id
};

export const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
export const wks = ([a, b]: [number, number]) => (a === b ? `${a} weeks` : `${a}–${b} weeks`);
export const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export const addWeeks = (w: number, from = Date.now()) => new Date(from + w * 7 * 864e5);
export const roleLabel = (id: string) => ROLES.find((r) => r.id === id)?.label ?? "this role";

export function compare(input: CompareInput, now = Date.now()) {
  const weeksToStart = input.start ? Math.max(0, (Date.parse(input.start) - now) / (7 * 864e5)) : null;
  const base = ROUTES.map((r) => {
    const fee = r.fee(input.salary);
    const hours = r.hours.reduce((n, x) => n + x.h, 0);
    const real = fee + hours * HOURLY;
    const startWeeks = r.hireWeeks[1] + NOTICE_WEEKS;
    const overBudget = input.budget ? fee > input.budget : false;
    const tooSlow = weeksToStart != null ? startWeeks > weeksToStart : false;
    return { r, fee, hours, real, startWeeks, overBudget, tooSlow };
  });
  const max = (f: (x: (typeof base)[number]) => number) => Math.max(...base.map(f));
  const [mR, mW, mH, mI] = [max((x) => x.real), max((x) => x.startWeeks), max((x) => x.hours), max((x) => x.r.interviews)];
  const score = (x: (typeof base)[number]) =>
    input.p === "cost" ? x.real : input.p === "speed" ? x.startWeeks : input.p === "hours" ? x.hours
      : x.real / mR + x.startWeeks / mW + x.hours / mH + x.r.interviews / mI;
  // Options that fit the budget and start date first, then by what matters most.
  const rows = base.slice().sort((a, b) => Number(a.overBudget || a.tooSlow) - Number(b.overBudget || b.tooSlow) || score(a) - score(b));
  const lo = (f: (x: (typeof rows)[number]) => number) => Math.min(...rows.map(f));
  return {
    rows,
    best: rows[0],
    lowest: { real: lo((x) => x.real), start: lo((x) => x.startWeeks), hours: lo((x) => x.hours), interviews: lo((x) => x.r.interviews) },
  };
}

/* The result link carries the inputs (mockup). base64url JSON. */
export function encodeInput(i: CompareInput) {
  return Buffer.from(JSON.stringify(i)).toString("base64url");
}
export function decodeInput(s: string): CompareInput | null {
  try {
    const json = typeof window === "undefined" ? Buffer.from(s, "base64url").toString("utf8") : decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));
    const i = JSON.parse(json);
    return i && typeof i.role === "string" && typeof i.salary === "number" ? i : null;
  } catch {
    return null;
  }
}

/* ---- The Christmas gift box (DRAFT: Andre to confirm the rewards and odds) ---- */
export const GIFT_UNTIL = "2026-12-24";
export const DROPS = [
  { pct: 5, rarity: "Common", odds: 60, color: "#ffb347" },
  { pct: 10, rarity: "Rare", odds: 30, color: "#ff5d00" },
  { pct: 15, rarity: "Legendary", odds: 10, color: "#ffd700" },
];
/** Same request, same prize: the roll is seeded by the request id, so reopening never rerolls. */
export function rollGift(lid: string) {
  let h = 2166136261;
  for (const c of lid) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const n = (h >>> 0) % 100;
  let acc = 0;
  const drop = DROPS.find((d) => (acc += d.odds) > n) ?? DROPS[0];
  const code = `XMAS${drop.pct}-${((h >>> 8) & 0xffff).toString(36).toUpperCase().padStart(4, "0")}`;
  return { ...drop, code };
}
