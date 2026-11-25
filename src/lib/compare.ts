/**
 * "Every way to hire, compared" (Andre 2026-11-07, MOCKUP): the shared model
 * behind /compare (the form), the email it sends, and /compare/result (the
 * comparison the email links to). Every number is a draft assumption for
 * Andre to set.
 */
import { TIER_FEE } from "@/lib/plans";
import { tierFor } from "@/lib/tier";

/** Headline A/B test (Andre 2026-11-07): the orange words are what changes. */
export const HOOKS = [
  { pre: "Hiring, but not sure which route is most ", accent: "cost-effective", post: "?", g: "We'll compare every route for your role." },
  { pre: "Hiring, but not sure which route is most ", accent: "time-efficient", post: "?", g: "We'll compare every route for your role, including the hours it takes your team." },
  { pre: "Hiring, and it's ", accent: "time-sensitive", post: "?", g: "We'll show you which route gets someone in fastest." },
  // The LinkedIn ad's headline (2026-11-09): shown for ?ad=1 only, never at random.
  { pre: "Hiring, but don't know ", accent: "where to start", post: "?", g: "Every way to hire your role, side by side." },
];
/** Headlines in the random A/B rotation (the ones after these are ad-only). */
export const ROTATING_HOOKS = 3;
/** The headline that matches the LinkedIn ad (index into HOOKS). */
export const AD_HOOK = 3;

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

/**
 * Candidates seen for each hire (Andre 2026-11-25, from the guide "The 4 ways
 * to find talent"). Market figures: Lever, Little Grey Book of Recruiting
 * Benchmarks (4M+ candidates, ~1,000 employers, Aug 2015 to Jul 2016).
 * Ours: candidates sent to one client since Jan 2025 vs hires, counting roles
 * that changed partway through. Andre is checking the wider record (likely
 * nearer 1 in 8): change MF_PER_HIRE and the note below together.
 */
export const MF_PER_HIRE = 12;
export const MF_PER_HIRE_NOTE = "From our record with one client since January 2025: 147 candidates sent, 12 hired, counting roles that changed partway through";
export const LEVER_NOTE = "Lever's study of 4 million candidates across about 1,000 employers";
/** Screening a CV properly, cover letter included (the guide's figure). */
export const CV_MINUTES = 5;

export type Route = {
  id: string;
  name: string;
  how: string;
  fee: (salary: number, role?: string) => number;
  feeNote: string;
  shortlist: string;
  hireWeeks: [number, number];
  get: string;
  interviews: number; // first interviews typically needed to find someone worth hiring
  /** What the interviews figure is based on, shown in the detail. */
  interviewsNote?: string;
  /** Candidates seen for each hire: the odds behind the risk (1 in N). */
  perHire: number;
  perHireNote: string;
  /** Depends on someone already having a name in mind, so never picked as the best fit. */
  noRank?: string;
  /** What you have to do yourself on this route (the white-glove difference, Andre 2026-11-09). */
  youDo: string;
  speedNote?: string;
  hours: { label: string; h: number }[];
  tips: string[];
  /** Who the route can reach: passive = people not looking, who never see a job ad. */
  reach: { passive: boolean; label: string; detail: string };
  us?: boolean;
};

export const ROUTES: Route[] = [
  {
    id: "mf",
    name: "MakersForge",
    how: "Mobile games and apps specialists, flat fee",
    fee: (_s, role) => TIER_FEE[tierFor(role ?? "").tier],
    feeNote: "flat by level, paid only if you hire",
    shortlist: "1 week",
    hireWeeks: [2, 4],
    get: "About 5 vetted people, plus more batches should you need them",
    interviews: 5,
    interviewsNote: "6 in 10 of our hires come from the first 5 candidates, 9 in 10 within the first 9",
    perHire: MF_PER_HIRE,
    perHireNote: MF_PER_HIRE_NOTE,
    youDo: "Brief us in 30 minutes, then interview the people you like. We headhunt, screen, book every interview, run the feedback and negotiate the offer",
    speedNote: "We can prioritise people with shorter notice periods or who are available now.",
    hours: [
      { label: "Brief", h: 1 },
      { label: "Interviews", h: 6 },
      { label: "Coordination", h: 1 },
    ],
    reach: { passive: true, label: "Active + passive", detail: "We headhunt, so you see people who aren't looking and would never see your ad, as well as those who are" },
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
    perHire: 22,
    perHireNote: `1 in 22 agency candidates get hired, from ${LEVER_NOTE}. A specialist may do better on roles they know`,
    youDo: "Brief them, read 8–12 CVs, interview, give feedback and negotiate the offer, often with the agency in the middle",
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 2 },
      { label: "Interviews", h: 9 },
      { label: "Coordination", h: 3 },
    ],
    reach: { passive: true, label: "Active + passive", detail: "A good agency headhunts too, so they can reach people who aren't looking" },
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
    perHire: 22,
    perHireNote: `1 in 22 agency candidates get hired, from ${LEVER_NOTE}`,
    youDo: "Brief them, filter 10–20 CVs (many from outside games and apps), interview and run the rest of the process",
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 4 },
      { label: "Interviews", h: 12 },
      { label: "Coordination", h: 4 },
    ],
    reach: { passive: true, label: "Active + passive", detail: "They can headhunt, though their network is wider than games and apps" },
    tips: ["Check they understand mobile metrics (ROAS, LTV, retention) before you brief them.", "Expect to filter more CVs that aren't from games or apps."],
  },
  {
    id: "ads",
    name: "Job ad, hire yourself",
    how: "Job boards plus an applicant tracking system",
    fee: () => 400 + 250 * 3,
    feeNote: "About £400 on job boards + about £250 a month for tracking software",
    shortlist: "3–6 weeks",
    hireWeeks: [6, 12],
    get: "100–250 applications",
    interviews: 10,
    perHire: 152,
    perHireNote: `1 in 152 applicants get hired, from ${LEVER_NOTE}`,
    youDo: "Write and post the ad, read every application, screen, book and chase interviews, give feedback and make the offer",
    hours: [
      { label: "Writing and posting the ad", h: 3 },
      { label: `Screening applications (about ${CV_MINUTES} minutes each)`, h: 15 },
      { label: "Interviews", h: 15 },
      { label: "Coordination", h: 6 },
    ],
    reach: { passive: false, label: "Active only", detail: "Only people actively looking for a job will see it. The many strong people who are happy where they are never will" },
    tips: [
      "Cap the applicants at what you can properly read. Past about 150, screening outgrows a small team: 900 CVs at 5 minutes each is 75 hours.",
      "Post on Games Jobs Direct, Hitmarker and LinkedIn Jobs.", "Add 2–3 screening questions to cut the pile down fast.", "Block out screening time every day, or the good applicants go elsewhere."],
  },
  {
    id: "inhouse",
    name: "Sourcing it yourself",
    how: "Your own team finds and messages people on LinkedIn",
    fee: () => 135 * 3,
    feeNote: "LinkedIn Recruiter Lite, about $170 a month (full Recruiter is about $8–15k a seat a year)",
    shortlist: "3–5 weeks",
    hireWeeks: [6, 12],
    get: "Whoever replies to your messages",
    interviews: 8,
    perHire: 72,
    perHireNote: `1 in 72 candidates sourced by in-house teams get hired, from ${LEVER_NOTE}`,
    youDo: "Search, write and send every message, chase replies, screen, interview and make the offer",
    hours: [
      { label: "Searching and messaging", h: 20 },
      { label: "Screening calls", h: 6 },
      { label: "Interviews", h: 12 },
      { label: "Coordination", h: 4 },
    ],
    reach: { passive: true, label: "Active + passive", detail: "You can message anyone, including people who aren't looking, but finding and persuading them takes time" },
    tips: ["Send 50–100 personal messages for each role; reply rates are low.", "Lead with the role and the pay, not the company story."],
  },
  {
    id: "referral",
    name: "Referrals",
    how: "Your team and network recommend people they know",
    fee: () => 2000,
    feeNote: "a referral bonus, typically €1,500–3,000, paid when the hire starts",
    shortlist: "Depends who has a name",
    hireWeeks: [3, 8],
    get: "As many names as your network has",
    interviews: 4,
    perHire: 16,
    perHireNote: `1 in 16 referred candidates get hired, from ${LEVER_NOTE}`,
    noRank: "Only if someone already has a name in mind",
    youDo: "Ask your team and network, then screen, interview and make the offer",
    hours: [
      { label: "Asking around", h: 2 },
      { label: "Interviews", h: 6 },
      { label: "Coordination", h: 2 },
    ],
    reach: { passive: true, label: "Who your network knows", detail: "Only people someone in your team already knows, but they come vouched for" },
    tips: ["Ask first, alongside any other route: it costs little.", "Ask for a specific person for a specific role, not 'anyone good'."],
  },
];

import { CURRENCY_SYMBOLS, RATES, type Currency } from "@/lib/currency";

export type Priority = "balanced" | "cost" | "speed" | "hours";
/** What the visitor told us. Travels in the result link (mockup; the real build stores it and links by id). */
export type CompareInput = {
  role: string;
  salary: number;
  start?: string; // yyyy-mm-dd: the date they need the hire made by (offer accepted)
  budget?: number;
  p: Priority;
  name?: string;
  company?: string;
  hook: number; // which headline they saw (A/B)
  cur?: Currency; // the currency they gave the salary in; salary itself is stored in GBP
  lid: string; // this request's id
};

export const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
/** A GBP amount shown in their currency (to the nearest 10). */
export const money = (gbpAmount: number, cur: Currency = "GBP") =>
  `${CURRENCY_SYMBOLS[cur]}${(cur === "GBP" ? Math.round(gbpAmount) : Math.round((gbpAmount * RATES[cur]) / 10) * 10).toLocaleString("en-GB")}`;
export const wks = ([a, b]: [number, number]) => (a === b ? `${a} weeks` : `${a}–${b} weeks`);
export const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export const addWeeks = (w: number, from = Date.now()) => new Date(from + w * 7 * 864e5);
/** A saved role: an old dropdown id ("senior-ua") or, since 2026-11-09, the job title as typed. */
export const roleLabel = (role: string) => ROLES.find((r) => r.id === role)?.label ?? (role.trim() || "this role");

export function compare(input: CompareInput, now = Date.now()) {
  const weeksToStart = input.start ? Math.max(0, (Date.parse(input.start) - now) / (7 * 864e5)) : null;
  const base = ROUTES.map((r) => {
    const fee = r.fee(input.salary, roleLabel(input.role));
    const hours = r.hours.reduce((n, x) => n + x.h, 0);
    const real = fee + hours * HOURLY;
    const startWeeks = r.hireWeeks[1] + NOTICE_WEEKS;
    const overBudget = input.budget ? fee > input.budget : false;
    const hireBy = r.hireWeeks[1];
    const tooSlow = weeksToStart != null ? hireBy > weeksToStart : false;
    return { r, fee, hours, real, startWeeks, hireBy, overBudget, tooSlow };
  });
  const max = (f: (x: (typeof base)[number]) => number) => Math.max(...base.map(f));
  const [mR, mW, mH, mI] = [max((x) => x.real), max((x) => x.startWeeks), max((x) => x.hours), max((x) => x.r.interviews)];
  const score = (x: (typeof base)[number]) =>
    input.p === "cost" ? x.real : input.p === "speed" ? x.startWeeks : input.p === "hours" ? x.hours
      : x.real / mR + x.startWeeks / mW + x.hours / mH + x.r.interviews / mI;
  // Best fit: options that fit the date first, then by what matters most.
  const ranked = base.filter((x) => !x.r.noRank).sort((a, b) => Number(a.overBudget || a.tooSlow) - Number(b.overBudget || b.tooSlow) || score(a) - score(b));
  const best = ranked[0];
  // Shown in a fixed order (Andre): us, then the job ad (the route most people take), then the agencies.
  const ORDER = ["mf", "ads", "games20", "tech25", "inhouse", "referral"];
  const rows = base.slice().sort((a, b) => ORDER.indexOf(a.r.id) - ORDER.indexOf(b.r.id));
  const lo = (f: (x: (typeof rows)[number]) => number) => Math.min(...rows.map(f));
  return {
    rows,
    best,
    next: ranked[1],
    lowest: { fee: lo((x) => x.fee), real: lo((x) => x.real), start: lo((x) => x.startWeeks), hireBy: lo((x) => x.hireBy), hours: lo((x) => x.hours), interviews: lo((x) => x.r.interviews), perHire: lo((x) => x.r.perHire) },
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
