/**
 * Job board data layer.
 *
 * Single source of truth is `src/data/jobs.json` — a flat array of job
 * objects. Everything the board renders (index, job pages, company pages,
 * category pages, sitemap) is derived from that file at BUILD TIME, so the
 * whole board is statically generated: editing jobs.json + rebuilding is
 * the entire content workflow. There is no runtime/database read.
 *
 * Company records are derived by grouping jobs on `company.slug` — there is
 * deliberately no separate companies file to keep in sync (per brief §3).
 *
 * "Expired" is evaluated against the build date. Expired jobs drop out of
 * the index and company live-role lists, but keep their own pages alive
 * (with an expired state) so the SEO equity survives the role (brief §3).
 */

import rawJobs from "@/data/jobs.json";
import folkEnrichment from "@/data/folk-enrichment.json";
import termsOverrides from "@/data/terms-overrides.json";
import {
  type Terms,
  type WorkMode,
  extractTerms,
  isVerifiedSource,
  mergeTerms,
} from "./terms";

export type { Terms } from "./terms";

export type JobCategory =
  | "ua"
  | "growth"
  | "marketing-art"
  | "creative-strategy"
  | "aso";

export type Sector = "games" | "apps";

export type RemoteMode = "remote" | "hybrid" | "onsite";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACTOR";

export type Region = "emea" | "americas" | "apac" | "global";

export type JobSource =
  | "curated"
  | "employer"
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workable"
  | "teamtailor"
  | "getro"
  | "partner";

/** Coarse headcount buckets for the company-size filter. */
export type SizeBucket = "startup" | "emerging" | "scaleup" | "large";

export type Company = {
  slug: string;
  name: string;
  url: string;
  /** Optional path to a logo in /public/jobs/logos. Falls back to a monogram. */
  logo?: string;
  blurb: string;
  /** Headcount range, e.g. "15-50", "500+". */
  size?: string;
  sector: Sector;
  /** Optional enrichment (e.g. from Folk): funding stage + last raise. */
  stage?: string;
  /** ISO month "YYYY-MM" of most recent raise, if known. */
  lastRaise?: string;
  /** Display string for funding, e.g. "$25M raised" (from Folk read-back). */
  funding?: string;
};

export type Job = {
  slug: string;
  title: string;
  company: Company;
  category: JobCategory;
  location: string;
  /** Coarse region bucket, used by the board's region filter. */
  region?: Region;
  remote: RemoteMode;
  employment_type: EmploymentType;
  salary?: string | null;
  description_md: string;
  apply_url: string;
  source: JobSource;
  /** ISO date (YYYY-MM-DD) — original ATS post date, for schema + display. */
  posted_at: string;
  /** ISO date (YYYY-MM-DD). */
  expires_at: string;
  /** ISO date (YYYY-MM-DD) we first pulled it — freshness fallback when the
   *  original post date is stale (long-open evergreen reqs). */
  ingested_at?: string;
  /** Fair Board Standard transparency layer — pay / contract / hours /
   *  remote-scope, each tri-state (value | undisclosed | n/a). Assembled at
   *  build time from extraction + manual overrides (see below). */
  terms?: Terms;
};

/** A company plus the roles that reference it — live and past. */
export type CompanyWithJobs = {
  company: Company;
  live: Job[];
  expired: Job[];
  /** live + expired, newest first. */
  all: Job[];
};

/* ---------------------------------------------------------------- labels */

export const CATEGORY_LABELS: Record<JobCategory, string> = {
  ua: "User Acquisition",
  growth: "Growth",
  "marketing-art": "Marketing Art",
  "creative-strategy": "Creative Strategy",
  aso: "ASO",
};

/** Short chip label — kept tight for cards. */
export const CATEGORY_SHORT: Record<JobCategory, string> = {
  ua: "UA",
  growth: "Growth",
  "marketing-art": "Marketing Art",
  "creative-strategy": "Creative Strategy",
  aso: "ASO",
};

export const SECTOR_LABELS: Record<Sector, string> = {
  games: "Games",
  apps: "Apps",
};

export const REMOTE_LABELS: Record<RemoteMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export const REGION_LABELS: Record<Region, string> = {
  emea: "EMEA",
  americas: "Americas",
  apac: "APAC",
  global: "Global",
};

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACTOR: "Contract",
};

export const SIZE_BUCKETS: { key: SizeBucket; label: string }[] = [
  { key: "startup", label: "Startup · under 50" },
  { key: "emerging", label: "50–200" },
  { key: "scaleup", label: "200–500" },
  { key: "large", label: "500+" },
];

/** Map a free-text headcount ("15-50", "500+", "1000+") to a coarse bucket.
 *  Keyed off the lower bound of the range. */
export function sizeBucketOf(size?: string): SizeBucket | null {
  if (!size) return null;
  const first = parseInt(size.replace(/[,\s]/g, ""), 10);
  if (Number.isNaN(first)) return null;
  if (first < 50) return "startup";
  if (first < 200) return "emerging";
  if (first < 500) return "scaleup";
  return "large";
}

/** Category order used everywhere the categories are listed. */
export const CATEGORY_ORDER: JobCategory[] = [
  "ua",
  "growth",
  "marketing-art",
  "creative-strategy",
  "aso",
];

/* ------------------------------------------------------------- accessors */

/**
 * Company enrichment read back from Folk (funding stage/size/blurb/funding),
 * keyed by company slug. Folk is the system of record for relationship data;
 * once a company is enriched there, `scripts/folk-enrich.mjs` writes it here and
 * it overrides the board's base fields. Empty until the first read-back.
 */
type FolkEnrichment = Partial<
  Pick<Company, "size" | "blurb" | "stage" | "funding" | "lastRaise">
>;
const ENRICH = folkEnrichment as Record<string, FolkEnrichment>;

/** "YYYY-MM" five years before build. Funding whose last round predates this
 *  is suppressed: an old pre-acquisition round (e.g. Supercell 2013) reads as
 *  stale and misrepresents the company (Andre 2026-07-19). */
const FUNDING_STALE_CUTOFF = (() => {
  const d = buildToday();
  return `${d.getFullYear() - 5}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

function applyEnrichment(company: Company): Company {
  const e = ENRICH[company.slug];
  if (!e) return company;
  // Keep funding only when it isn't stale (no date = can't tell, so keep).
  const fundingFresh = !e.lastRaise || e.lastRaise >= FUNDING_STALE_CUTOFF;
  return {
    ...company,
    // NOTE: size is intentionally NOT taken from Folk — its employee-range
    // data was unreliable (downgrading e.g. Perplexity to 11-50 while showing
    // $1.5B raised, Andre 2026-07-19). The base size from the job source is
    // trustworthy and uses one consistent bucket scheme. Folk still supplies
    // blurb / stage / funding / lastRaise.
    ...(e.blurb ? { blurb: e.blurb } : {}),
    ...(e.stage ? { stage: e.stage } : {}),
    ...(e.funding && fundingFresh ? { funding: e.funding } : {}),
    ...(e.lastRaise && fundingFresh ? { lastRaise: e.lastRaise } : {}),
  };
}

const TERMS_OVERRIDES = termsOverrides as Record<string, Terms>;

const JOBS = (rawJobs as unknown as Job[]).map((j) => {
  // Transparency terms are layered lowest→highest: text extraction, then any
  // inline terms already on the record, then the manual overrides file (which
  // lets curated/partner roles be hand-perfected to full disclosure).
  const extracted = extractTerms({
    description_md: j.description_md,
    title: j.title,
    location: j.location,
    remote: j.remote as WorkMode,
    employment_type: j.employment_type,
    verified: isVerifiedSource(j.source),
  });
  const terms = mergeTerms(mergeTerms(extracted, j.terms), TERMS_OVERRIDES[j.slug]);
  return {
    ...j,
    company: applyEnrichment(j.company),
    ...(terms ? { terms } : {}),
  };
});

/** Build-time "today", at day granularity (local build timezone). */
function buildToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isExpired(job: Job, today: Date = buildToday()): boolean {
  // expires_at is inclusive of its own day: a job expiring today is still
  // live today, and drops from the index tomorrow.
  const expiry = new Date(job.expires_at + "T23:59:59");
  return expiry.getTime() < today.getTime();
}

function byNewest(a: Job, b: Job): number {
  return b.posted_at.localeCompare(a.posted_at);
}

/** Every job in the file, newest first (includes expired). */
export function getAllJobs(): Job[] {
  return [...JOBS].sort(byNewest);
}

/** Live (non-expired) jobs, newest first — what the index shows. */
export function getLiveJobs(): Job[] {
  return getAllJobs().filter((j) => !isExpired(j));
}

export function getJob(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}

/** All job slugs — for generateStaticParams (live AND expired pages exist). */
export function getAllJobSlugs(): string[] {
  return JOBS.map((j) => j.slug);
}

/** Companies derived from the jobs file, each with its live/expired roles. */
export function getCompanies(): CompanyWithJobs[] {
  const bySlug = new Map<string, CompanyWithJobs>();

  for (const job of getAllJobs()) {
    const existing = bySlug.get(job.company.slug);
    if (existing) {
      existing.all.push(job);
      (isExpired(job) ? existing.expired : existing.live).push(job);
    } else {
      bySlug.set(job.company.slug, {
        // Use the most-recent job's company record as canonical.
        company: job.company,
        all: [job],
        live: isExpired(job) ? [] : [job],
        expired: isExpired(job) ? [job] : [],
      });
    }
  }

  return [...bySlug.values()].sort((a, b) =>
    a.company.name.localeCompare(b.company.name),
  );
}

export function getCompany(slug: string): CompanyWithJobs | undefined {
  return getCompanies().find((c) => c.company.slug === slug);
}

export function getAllCompanySlugs(): string[] {
  return [...new Set(JOBS.map((j) => j.company.slug))];
}

/** Live jobs in a category, newest first. */
export function getJobsByCategory(category: JobCategory): Job[] {
  return getLiveJobs().filter((j) => j.category === category);
}

/** Count of live jobs per category (for filter badges / landing pages). */
export function getCategoryCounts(): Record<JobCategory, number> {
  const counts = { ua: 0, growth: 0, "marketing-art": 0, "creative-strategy": 0, aso: 0 } as Record<JobCategory, number>;
  for (const job of getLiveJobs()) counts[job.category] += 1;
  return counts;
}

/** Distinct regions present in live jobs, in canonical order. */
export function getActiveRegions(): Region[] {
  const order: Region[] = ["emea", "americas", "apac", "global"];
  const present = new Set(getLiveJobs().map((j) => j.region ?? "global"));
  return order.filter((r) => present.has(r));
}

/**
 * Compact location label for cards, where space is tight. Multi-location
 * roles collapse to "Multiple locations" (+ a shared country if there is one).
 * The full string still shows on the job detail page.
 */
export function shortLocation(location: string): string {
  const explicit = location
    .split(/\s*[;|]\s*|\s+\/\s+|\s+\bor\b\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);
  const commas = (location.match(/,/g) || []).length;

  // Multi-location if there are explicit separators, or a comma-jammed list
  // (some ATS pack every office into one comma string). A single "City,
  // Region, Country" has at most 2 commas, so 4+ is a safe multi signal.
  const isMulti = explicit.length > 1 || commas >= 4;
  if (!isMulti) return location;

  const US_STATE = /,\s*(a[lkzr]|c[aot]|de|fl|ga|hi|i[adln]|k[sy]|la|m[adeinost]|n[cdehjmvy]|o[hkr]|pa|ri|s[cd]|t[nx]|ut|v[at]|w[aivy]|d\.c\.)\b/i;
  const NON_US =
    /\b(canada|united kingdom|england|scotland|france|germany|spain|italy|poland|ukraine|ireland|netherlands|portugal|sweden|india|brazil|mexico|singapore|australia|japan|china|t[uü]rkiye|turkey|europe|emea|apac|uae|dubai)\b/i;
  const hasUS = /\b(united states|usa)\b/i.test(location) || US_STATE.test(location);
  const hasUK = /\b(united kingdom|england|scotland|wales|uk)\b/i.test(location);

  let suffix = "";
  if (hasUS && !NON_US.test(location)) suffix = " · US";
  else if (hasUK && !hasUS) suffix = " · UK";
  return `Multiple locations${suffix}`;
}

/** Size buckets actually represented in live jobs, in canonical order. */
export function getActiveSizeBuckets(): { key: SizeBucket; label: string }[] {
  const present = new Set(
    getLiveJobs()
      .map((j) => sizeBucketOf(j.company.size))
      .filter(Boolean),
  );
  return SIZE_BUCKETS.filter((b) => present.has(b.key));
}

/** Headline numbers for the board's stat bar. */
export type JobStats = {
  total: number;
  last30: number;
  companies: number;
  remote: number;
};

export function getJobStats(): JobStats {
  const live = getLiveJobs();
  const cutoff = buildToday();
  cutoff.setDate(cutoff.getDate() - 30);
  const last30 = live.filter((j) => {
    const d = new Date(j.posted_at + "T00:00:00");
    return !Number.isNaN(d.getTime()) && d >= cutoff;
  }).length;
  return {
    total: live.length,
    last30,
    companies: new Set(live.map((j) => j.company.slug)).size,
    remote: live.filter((j) => j.remote === "remote").length,
  };
}

/** Canonical funding-stage order (data comes from VC-board enrichment). */
export const STAGE_ORDER = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D",
  "Series E",
  "Growth-stage",
];

/** Funding stages actually present in live jobs, in canonical order. */
export function getActiveStages(): string[] {
  const present = new Set(
    getLiveJobs()
      .map((j) => j.company.stage)
      .filter(Boolean) as string[],
  );
  return STAGE_ORDER.filter((s) => present.has(s));
}
