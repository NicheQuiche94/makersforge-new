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
  { pre: "Hiring, but not sure which route is most ", accent: "cost-effective", post: "?", g: "We'll design your hiring route." },
  { pre: "Hiring, but not sure which route is most ", accent: "time-efficient", post: "?", g: "We'll design your hiring route, including the hours it takes your team." },
  { pre: "Hiring, and it's ", accent: "time-sensitive", post: "?", g: "We'll show you which route gets someone in fastest." },
  // The LinkedIn ad's headline (2026-11-09): shown for ?ad=1 only, never at random.
  { pre: "Hiring, but don't know ", accent: "where to start", post: "?", g: "We'll design your hiring route." },
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
  /** The questions behind the plan (Andre 2026-11-25). Missing on older links: the plan falls back to the job title. */
  level?: Level;
  history?: History;
  runner?: Runner;
  stakes?: Stakes;
  asked?: boolean; // they've already asked for referrals (team, network or a post)
  process?: number; // their interview process, first interview to accepted offer, in weeks
};

export type Level = "junior" | "mid" | "senior" | "lead";
/** How hiring for this kind of role has gone before: a pool size people actually know. */
export type History = "easy" | "hard" | "first";
/** Who runs the hiring day to day. */
export type Runner = "ta" | "manager" | "founder";
/** How much the hire matters: the pain behind it, which stands in for appetite to pay a fee. */
export type Stakes = "critical" | "important" | "nice";

export const LEVELS: { id: Level; label: string }[] = [
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Mid-level" },
  { id: "senior", label: "Senior" },
  { id: "lead", label: "Lead, Head or above" },
];
export const HISTORY: { id: History; label: string }[] = [
  { id: "easy", label: "We found good people quickly" },
  { id: "hard", label: "It was hard to find the right person" },
  { id: "first", label: "First time hiring this role" },
];
export const RUNNERS: { id: Runner; label: string }[] = [
  { id: "ta", label: "An in-house recruiter or TA" },
  { id: "manager", label: "The hiring manager" },
  { id: "founder", label: "A founder" },
];
export const STAKES: { id: Stakes; label: string }[] = [
  { id: "critical", label: "Mission critical: we're stuck without them" },
  { id: "important", label: "Important, but we can wait for the right person" },
  { id: "nice", label: "Nice to have" },
];
/** Interview process length, first interview to accepted offer, in weeks. */
export const PROCESS: { w: number; label: string }[] = [
  { w: 1, label: "About a week" },
  { w: 2, label: "About 2 weeks" },
  { w: 3.5, label: "3 to 4 weeks" },
  { w: 5.5, label: "5 to 6 weeks" },
  { w: 8, label: "2 months or more" },
];

/** Level from the form, or from the job title on older links. */
export function levelOf(input: CompareInput): Level {
  if (input.level) return input.level;
  const t = tierFor(roleLabel(input.role)).tier;
  return t === "executive" ? "lead" : t === "senior" ? "senior" : "mid";
}

/* Timeline assumptions (Andre 2026-11-25). All in weeks. */
const WEEK = 7 * 864e5;
const T = {
  referrals: 1, // ask around for a week
  review: 0.5, // a few days to look at who came in
  adCollect: 2, // an ad usually reaches the 150 cap within about two weeks
  screenTA: 0.5, // a recruiter gets through 150 CVs (about 12 hours) in a few days
  screenOther: 1, // a hiring manager or founder fits it around their job
  mfShortlist: 1, // our shortlist of about 5, in about 5 working days
  christmas: 1.5, // most studios lose 24 Dec to 2 Jan
};
const CAP = 150;
/** Adds the Christmas break if a stretch of work runs through it. */
const withXmas = (from: number, weeks: number) => {
  const to = from + weeks * WEEK;
  const y = new Date(from).getFullYear();
  for (const yr of [y, y + 1]) {
    const a = Date.UTC(yr, 11, 24), b = Date.UTC(yr + 1, 0, 2);
    if (from < b && to > a) return to + T.christmas * WEEK;
  }
  return to;
};

export type Lane = { id: "referral" | "ads" | "screen" | "mf" | "interviews"; label: string; from: number; to: number; free?: boolean };
/** One step of the plan: what to do, when, and exactly how. */
export type Step = { id: string; title: string; when: string; tips: string[]; line: string; chip?: string };

/** The routes a visitor can flick between (Andre 2026-11-25). */
export type Kind = "recommended" | "cheapest" | "quickest" | "safest";
export const KINDS: { id: Kind; label: string; blurb: string }[] = [
  { id: "recommended", label: "Recommended", blurb: "What we'd do" },
  { id: "cheapest", label: "Cheapest", blurb: "Lowest cost" },
  { id: "quickest", label: "Quickest", blurb: "Earliest hire" },
  { id: "safest", label: "Lowest risk", blurb: "Most chances at once" },
];

/** When a route on its own would make the hire, from today, with their interview process. */
export function soloHire(id: string, input: CompareInput, now = Date.now()) {
  const P = input.process ?? 3.5;
  const screen = (input.runner ?? "manager") === "ta" ? T.screenTA : T.screenOther;
  const lead: Record<string, number> = { mf: T.mfShortlist, games20: 2, tech25: 3, inhouse: 4, referral: T.referrals + T.review, ads: T.adCollect + screen };
  return withXmas(withXmas(now, lead[id] ?? 3), P);
}

/**
 * A hiring route (Andre 2026-11-25): honest, dated and tactical.
 * - recommended: referrals first; a capped job ad when it suits the role and
 *   still lands in time, with MakersForge as the backup, started no later than
 *   the last day that still makes their date; otherwise MakersForge alongside
 *   referrals from day one.
 * - cheapest: referrals, a capped job ad, then messaging people yourself. No fees.
 * - quickest: referrals and a MakersForge search from day one.
 * - safest: referrals, a capped job ad and a MakersForge search all at once.
 * A MakersForge search costs nothing unless they hire someone we found.
 * DRAFT copy for Andre.
 */
export function planFor(input: CompareInput, now = Date.now(), kind: Kind = "recommended") {
  const level = levelOf(input);
  const senior = level === "senior" || level === "lead";
  const small = input.history ? input.history === "hard" || (input.history === "first" && senior) : senior;
  const stakes = input.stakes ?? "important";
  const runner = input.runner ?? "manager";
  const P = input.process ?? 3.5;
  const deadline = input.start ? Date.parse(input.start) : null;
  const role = roleLabel(input.role);
  const who = runner === "ta" ? "your recruiter" : runner === "founder" ? "you" : "the hiring manager";
  const d = (t: number) => day(new Date(t));
  const range = (a: number, b: number) => `${d(a)} to ${d(b)}`;
  const fits = (t: number) => deadline == null || t <= deadline;

  // The building blocks.
  const refTo = input.asked ? now : now + T.referrals * WEEK;
  const refReady = now + (T.referrals + T.review) * WEEK; // a referral could be interviewing by now
  const adFrom = kind === "safest" ? now : refTo;
  const adFull = adFrom + T.adCollect * WEEK;
  const screenTo = withXmas(adFull, runner === "ta" ? T.screenTA : T.screenOther);
  const adHire = withXmas(screenTo, P);
  const mfShort = withXmas(now, T.mfShortlist);
  const mfHire = withXmas(mfShort, P);
  /** The last day a MakersForge search can start and still make their date. */
  const mfLatest = (() => {
    if (deadline == null) return screenTo;
    let s = deadline - (T.mfShortlist + P) * WEEK;
    while (s > now && withXmas(withXmas(s, T.mfShortlist), P) > deadline) s -= 864e5;
    return Math.max(now, s);
  })();

  // Which pieces this route uses.
  const adSuits = !small && !senior && !(stakes === "critical" && runner !== "ta");
  const recAd = stakes === "nice" || (adSuits && fits(adHire));
  const useAd = kind === "cheapest" || kind === "safest" || (kind === "recommended" && recAd);
  const mfNow = kind === "quickest" || kind === "safest" || (kind === "recommended" && !recAd);
  const mfBackup = kind === "recommended" && recAd && stakes !== "nice";
  const sourcing = kind === "cheapest" && runner === "ta";

  const steps: Step[] = [];
  const lanes: Lane[] = [];
  if (!input.asked) {
    steps.push({
      id: "referral",
      title: "Ask for referrals",
      chip: "Referrals",
      line: "Ask for a specific person",
      when: range(now, refTo),
      tips: [
        `Ask for a specific person, not "anyone good": "Who's the best ${role} you've worked with?"`,
        "Post the role on LinkedIn and ask your team to share it",
        "Offer a referral bonus for a hire: €1,500 to 3,000 is typical",
        `If someone fits, interview them and hire them: nothing is cheaper or lower risk`,
      ],
    });
    lanes.push({ id: "referral", label: "Referrals", from: now, to: refTo });
  }
  if (mfNow) {
    steps.push({
      id: "mf",
      title: input.asked || kind === "safest" ? "Run a MakersForge search" : "Run a MakersForge search alongside",
      chip: "MakersForge",
      line: "£0 until you hire someone we found",
      when: `From ${d(now)}`,
      tips: [
        "We start straight away, so you don't lose a week",
        `A shortlist of about 5 people by ${d(mfShort)}, each already interviewed by us`,
        `1 in ${MF_PER_HIRE} of the candidates we send get hired`,
        "No fee unless you hire someone we found",
      ],
    });
    lanes.push({ id: "mf", label: "MakersForge", from: now, to: mfShort, free: true });
  }
  if (useAd) {
    steps.push({
      id: "ads",
      title: `Post a job ad, capped at ${CAP} applicants`,
      chip: "Job ad, capped",
      line: `Take it down at ${CAP} applicants`,
      when: `From ${d(adFrom)}`,
      tips: [
        "Post on Hitmarker, Games Jobs Direct and LinkedIn Jobs",
        `Take it down the moment you reach ${CAP} applicants, usually within two weeks`,
        `Screen as they arrive: ${CAP} CVs at 5 minutes each is about 12 hours for ${who}`,
        `Shortlist 3 to 4 people by ${d(screenTo)}`,
        "Reply to everyone you don't take forward",
      ],
    });
    lanes.push({ id: "ads", label: "Job ad", from: adFrom, to: adFull }, { id: "screen", label: "Screening", from: adFull, to: screenTo });
  }
  if (mfBackup) {
    const late = mfLatest < screenTo;
    steps.push({
      id: "mf",
      title: "MakersForge, if the ad isn't working",
      chip: "MakersForge if needed",
      line: `Start us by ${d(mfLatest)} to keep your date`,
      when: `By ${d(mfLatest)} at the latest`,
      tips: [
        late
          ? `Your ad won't be screened until ${d(screenTo)}, so judge it early: if the first applicants aren't right by ${d(mfLatest)}, start us then`
          : `If nobody's right by ${d(mfLatest)}, start us then: it's the last day that still makes your date`,
        "We go direct to the people who didn't apply, with a shortlist within a week",
        "No fee unless you hire someone we found",
      ],
    });
    lanes.push({ id: "mf", label: "MakersForge if needed", from: mfLatest, to: mfLatest + T.mfShortlist * WEEK, free: true });
  }
  if (sourcing)
    steps.push({
      id: "inhouse",
      title: "If the ad doesn't land: message people directly",
      chip: "Sourcing if needed",
      line: "Message people who aren't looking",
      when: `If nobody's right by ${d(screenTo)}`,
      tips: ["Search LinkedIn for people who aren't looking", "Expect to message a lot of people: 1 in 72 sourced candidates get hired"],
    });

  // The earliest the hire can land on this route.
  const candidates: number[] = [];
  if (useAd) candidates.push(adHire);
  if (mfNow) candidates.push(mfHire);
  if (!input.asked && mfNow) candidates.push(withXmas(refReady, P));
  const hire = candidates.length ? Math.min(...candidates) : adHire;
  const iFrom = Math.min(...[useAd ? screenTo : Infinity, mfNow ? mfShort : Infinity, !input.asked && mfNow ? refReady : Infinity]);
  steps.push({
    id: "interviews",
    title: "Interview and offer",
    line: `Accepted offer by ${d(hire)}`,
    when: range(iFrom === Infinity ? screenTo : iFrom, hire),
    tips: [`Run your interview process: ${PROCESS.find((p) => p.w === P)?.label.toLowerCase() ?? `${P} weeks`}, by your answer`, `Aim for an accepted offer by ${d(hire)}`],
  });
  lanes.push({ id: "interviews", label: "Interviews", from: iFrom === Infinity ? screenTo : iFrom, to: hire });

  const main = useAd && !mfNow ? "ads" : "mf";
  return { kind, steps, lanes, hire, deadline, onTime: fits(hire), main, mfFree: mfNow || mfBackup, usesAd: useAd, usesMf: mfNow || mfBackup };
}

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
  const deadline = input.start ? Date.parse(input.start) : null;
  const base = ROUTES.map((r) => {
    const fee = r.fee(input.salary, roleLabel(input.role));
    const hours = r.hours.reduce((n, x) => n + x.h, 0);
    const real = fee + hours * HOURLY;
    const solo = soloHire(r.id, input, now);
    const hireBy = (solo - now) / (7 * 864e5); // weeks from today, same maths as the plan
    const startWeeks = hireBy + NOTICE_WEEKS;
    const overBudget = input.budget ? fee > input.budget : false;
    const tooSlow = deadline != null ? solo > deadline : false;
    return { r, fee, hours, real, startWeeks, hireBy, overBudget, tooSlow };
  });
  const max = (f: (x: (typeof base)[number]) => number) => Math.max(...base.map(f));
  const [mR, mW, mH, mI] = [max((x) => x.real), max((x) => x.startWeeks), max((x) => x.hours), max((x) => x.r.interviews)];
  const score = (x: (typeof base)[number]) =>
    input.p === "cost" ? x.real : input.p === "speed" ? x.startWeeks : input.p === "hours" ? x.hours
      : x.real / mR + x.startWeeks / mW + x.hours / mH + x.r.interviews / mI;
  // Best fit: options that fit the date first, then by what matters most.
  const ranked = base.filter((x) => !x.r.noRank).sort((a, b) => Number(a.overBudget || a.tooSlow) - Number(b.overBudget || b.tooSlow) || score(a) - score(b));
  const routes = KINDS.map((k) => ({ ...k, plan: planFor(input, now, k.id) }));
  const plan = routes[0].plan;
  const best = base.find((x) => x.r.id === plan.main) ?? ranked[0];
  // Shown in a fixed order (Andre): us, then the job ad (the route most people take), then the agencies.
  const ORDER = ["mf", "ads", "games20", "tech25", "inhouse", "referral"];
  const rows = base.slice().sort((a, b) => ORDER.indexOf(a.r.id) - ORDER.indexOf(b.r.id));
  const lo = (f: (x: (typeof rows)[number]) => number) => Math.min(...rows.map(f));
  return {
    rows,
    best,
    next: ranked.find((x) => x.r.id !== best.r.id),
    plan,
    routes,
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
