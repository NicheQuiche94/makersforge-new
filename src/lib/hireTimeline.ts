/**
 * "Will your job ad hire in time?" (Andre 2026-11-09; live 2026-11-09).
 *
 * A lead magnet that shows a problem, not a pitch: how long their current
 * way of hiring usually takes, plus the notice period in the candidate's
 * country, against the date they need someone in. Then what a search week
 * does to the same timeline. We can't shorten a notice period or their
 * interviews, and the page says so: the time we save is the search.
 *
 * Figures and sources: docs/hire-timeline-benchmarks.md (researched
 * 2026-11-09). Ours: Andre's own searches (to confirm).
 */
import type { Tier } from "@/lib/tier";

export type Method = "jobad" | "recruiter";
export type Stage = { label: string; short: string; weeks: Record<Tier, number>; note: string };
export type Source = { name: string; url: string };

export const SOURCES: Record<string, Source> = {
  ashby: { name: "Ashby, Talent Trends Report 2026 (time to hire by seniority)", url: "https://www.ashbyhq.com/talent-trends-report/reports/recruiting-operations-benchmarks-talent-trends" },
  ashbyStartup: { name: "Ashby, Startup hiring 2026 (with and without a recruiter)", url: "https://www.ashbyhq.com/talent-trends-report/reports/startup-hiring" },
  gem: { name: "Gem, Recruiting Benchmarks 2026 (offer acceptance)", url: "https://app.gem.com/blog/key-takeaways-from-the-2026-recruiting-benchmarks-report" },
  notice: { name: "Notice periods: Eurofound and national employment-law guides", url: "https://www.eurodev.com/blog/notice-period-and-severance-pay-in-eu-countries-in-2025" },
};

export const METHODS: { id: Method; label: string; short: string }[] = [
  { id: "jobad", label: "Posting a job ad ourselves", short: "a job ad" },
  { id: "recruiter", label: "We have a recruiter on it (in-house or agency)", short: "a recruiter" },
];

const d = (days: number) => Math.round((days / 7) * 10) / 10;
/* The faster end of the published range (Andre 2026-11-09, after Ashley's QA:
   the medians read as an extreme case). Job open → hire: Gem's 41-day average
   and SHRM's ~44 days, stepped up for seniority: Team 42, Senior 49,
   Executive 63 days. (Ashby's medians run 52–71 days; that's the slow end.)
   First → last interview ≈ 18 days (Ashby, technical roles). Offer to signed
   contract ≈ 1 week (our estimate). A recruiter saves about a week on finding
   people (Ashby: startups hire faster with a recruiter involved). */
const TOTAL: Record<Tier, number> = { team: 42, senior: 46, executive: 49 }; // Andre 2026-11-09: 6–7 weeks to hire at every level; notice is the long part
const INTERVIEWS = 18;
const OFFER = 7;
const RECRUITER_SAVES = 7;

const stagesFor = (recruiter: boolean): Stage[] => [
  {
    label: recruiter ? "Sourcing and screening" : "Advertising and screening",
    short: recruiter ? "Sourcing" : "Ad and screening",
    weeks: {
      team: d(Math.max(7, TOTAL.team - INTERVIEWS - OFFER - (recruiter ? RECRUITER_SAVES : 0))),
      senior: d(Math.max(7, TOTAL.senior - INTERVIEWS - OFFER - (recruiter ? RECRUITER_SAVES : 0))),
      executive: d(Math.max(7, TOTAL.executive - INTERVIEWS - 7 - OFFER - 3 - (recruiter ? RECRUITER_SAVES : 0))),
    },
    note: recruiter ? "From the brief to a shortlist worth interviewing." : "From the ad going live to a shortlist worth interviewing.",
  },
  { label: "Interview rounds", short: "Interviews", weeks: { team: d(INTERVIEWS), senior: d(INTERVIEWS), executive: d(INTERVIEWS + 7) }, note: "First interview to last, typically about 18 days." },
  { label: "Offer and acceptance", short: "Offer", weeks: { team: d(OFFER), senior: d(OFFER), executive: d(OFFER + 3) }, note: "Offer, negotiation and a signed contract." },
];

/** Typical weeks per stage, by tier. */
export const STAGES: Record<Method, Stage[]> = { jobad: stagesFor(false), recruiter: stagesFor(true) };

/**
 * Ours (Andre 2026-11-09): the search week, your 5 the Monday after, then
 * about 2 weeks of interviews we book and run, and a quick offer.
 */
export const OUR_STAGES: Stage[] = [
  { label: "Headhunting and screening", short: "Headhunting", weeks: { team: 1, senior: 1, executive: 1 }, note: "Your search week: we headhunt and call all week, and your shortlist of 5 lands the Monday after." },
  { label: "Interview rounds", short: "Interviews", weeks: { team: 2, senior: 2, executive: 3 }, note: "We book the interviews and run the feedback, so rounds don't stall." },
  { label: "Offer and acceptance", short: "Offer", weeks: { team: 0.5, senior: 0.5, executive: 1 }, note: "We negotiate the offer through to a signed contract." },
];

/**
 * Notice a hire usually has to work before starting, in weeks, by country
 * and tier: common practice for professional roles, not legal minimums.
 * Medium confidence; senior figures in NL and IT are low confidence.
 */
export const COUNTRIES: { id: string; label: string; notice: Record<Tier, number> }[] = [
  { id: "GB", label: "United Kingdom", notice: { team: 4, senior: 4, executive: 13 } }, // Andre: UK is normally 4 weeks
  { id: "DE", label: "Germany", notice: { team: 13, senior: 13, executive: 17 } },
  { id: "NL", label: "Netherlands", notice: { team: 4, senior: 9, executive: 13 } },
  { id: "FR", label: "France", notice: { team: 6, senior: 13, executive: 13 } },
  { id: "ES", label: "Spain", notice: { team: 3, senior: 4, executive: 13 } },
  { id: "IT", label: "Italy", notice: { team: 6, senior: 9, executive: 13 } },
  { id: "PL", label: "Poland", notice: { team: 4, senior: 13, executive: 13 } },
  { id: "SE", label: "Sweden", notice: { team: 4, senior: 13, executive: 13 } },
  { id: "FI", label: "Finland", notice: { team: 4, senior: 4, executive: 9 } },
  { id: "IE", label: "Ireland", notice: { team: 4, senior: 13, executive: 13 } },
  { id: "PT", label: "Portugal", notice: { team: 4, senior: 9, executive: 17 } },
  { id: "US", label: "United States", notice: { team: 2, senior: 2, executive: 6 } },
  // Anywhere not listed (Andre 2026-11-09: nobody should be stuck on the form). A middle-of-the-road
  // European norm: a month, more for senior and executive hires. Our estimate, not a sourced figure.
  { id: "XX", label: "Somewhere else", notice: { team: 4, senior: 8, executive: 13 } },
];

/** Gem 2026: 82% of offers are accepted, so about 1 in 5 isn't. */
export const OFFER_DECLINE = 0.18;

/** "the United Kingdom", "Germany": for use after "in". */
export const inCountry = (label: string) => (label === "Somewhere else" ? "most countries" : /^(United|Netherlands)/.test(label) ? `the ${label}` : label);

export const countryById = (id: string) => COUNTRIES.find((c) => c.id === id) ?? COUNTRIES[0];

const DAY = 864e5;
export const addWeeks = (dt: Date, w: number) => new Date(dt.getTime() + Math.round(w * 7) * DAY);
export const weeksBetween = (a: Date, b: Date) => (b.getTime() - a.getTime()) / (7 * DAY);

export type Bar = { label: string; short: string; from: Date; to: Date; note: string; kind: "stage" | "wait" | "notice" };
export type Lane = { bars: Bar[]; start: Date };

function lane(stages: Stage[], tier: Tier, notice: number, from: Date, wait?: { to: Date; label: string }): Lane {
  const bars: Bar[] = [];
  let at = from;
  if (wait && wait.to > from) {
    bars.push({ label: wait.label, short: "", from, to: wait.to, note: "", kind: "wait" });
    at = wait.to;
  }
  for (const s of stages) {
    const to = addWeeks(at, s.weeks[tier]);
    bars.push({ label: s.label, short: s.short, from: at, to, note: s.note, kind: "stage" });
    at = to;
  }
  const start = addWeeks(at, notice);
  if (notice > 0) bars.push({ label: "Notice period", short: "Notice period", from: at, to: start, note: "", kind: "notice" });
  return { bars, start };
}

export type TimelineInput = { title: string; tier: Tier; country: string; method: Method; needBy?: string; today?: string; nextWeek?: string };

/** Their route and ours, from today, to a likely start date each. */
/** noNotice: the hire is available now (between jobs, or we put people with no notice first). */
export function timeline(i: TimelineInput, noNotice = false) {
  const today = i.today ? new Date(i.today) : new Date();
  const c = countryById(i.country);
  const typicalNotice = c.notice[i.tier];
  const notice = noNotice ? 0 : typicalNotice;
  const theirs = lane(STAGES[i.method], i.tier, notice, today);
  const week = i.nextWeek ? new Date(i.nextWeek + "T00:00:00") : addWeeks(today, 1);
  const ours = lane(OUR_STAGES, i.tier, notice, today, { to: week, label: "Until your search week starts" });
  const need = i.needBy ? new Date(i.needBy + "T00:00:00") : null;
  const late = need ? Math.round(weeksBetween(need, theirs.start)) : null; // + = weeks late
  const oursLate = need ? Math.round(weeksBetween(need, ours.start)) : null;
  const saved = Math.round(weeksBetween(ours.start, theirs.start));
  // The latest day a search could start and still land on their date, with notice.
  const startBy = need ? addWeeks(need, -(notice + OUR_STAGES.reduce((a, s) => a + s.weeks[i.tier], 0))) : null;
  return { today, country: c, notice, typicalNotice, theirs, ours, need, late, oursLate, saved, startBy };
}

export const fmtDay = (dt: Date) => dt.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
export const fmtShort = (dt: Date) => dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
export const weeksText = (w: number) => {
  const r = Math.round(w);
  return r === 1 ? "1 week" : `${r} weeks`;
};
