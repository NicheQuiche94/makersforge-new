/**
 * Talent ↔ board matching (internal, for Andre's outreach).
 *
 * For every available roster profile, finds the live board roles that are a
 * STRONG fit: discipline aligns, sector overlaps, they're open to the role's
 * contract type, and there's no hard geographic blocker. Location is treated
 * leniently on purpose — the roster is remote-first specialists, so an on-site
 * role in another country still matches (with a caveat note); only a role that
 * is remote-but-locked to a different country is excluded (work authorisation).
 *
 * Powers the internal /jobs/matches page today; the same function will feed an
 * email push once Resend is configured. Build-time only.
 */

import { ROSTER, type Profile } from "@/data/roster";
import {
  type Job,
  type JobCategory,
  getLiveJobs,
  shortLocation,
} from "./jobs";

/** Which board categories each roster discipline can fill. `product` maps to
 *  nothing — the board is UA / growth / marketing, not product. */
const DISCIPLINE_CATEGORIES: Record<Profile["discipline"], JobCategory[]> = {
  ua: ["ua", "growth"],
  creative: ["marketing-art", "creative-strategy"],
  aso: ["aso"],
  product: [],
};

export type LocationFit =
  | "remote-anywhere"
  | "remote-same-country"
  | "remote-region"
  | "same-country"
  | "onsite-elsewhere";

const FIT_RANK: Record<LocationFit, number> = {
  "remote-anywhere": 0,
  "remote-same-country": 1,
  "same-country": 2,
  "remote-region": 3,
  "onsite-elsewhere": 4,
};

export type RoleMatch = {
  job: Job;
  fit: LocationFit;
  /** Human note when the fit carries a caveat (on-site elsewhere, region). */
  note?: string;
  isNew: boolean;
};

export type TalentMatches = {
  profile: Profile;
  matches: RoleMatch[];
};

/* ---------------------------------------------------------------- country */

const COUNTRY_ALIAS: Record<string, string> = {
  uk: "united kingdom",
  england: "united kingdom",
  scotland: "united kingdom",
  wales: "united kingdom",
  britain: "united kingdom",
  gb: "united kingdom",
  us: "united states",
  usa: "united states",
  america: "united states",
  uae: "united arab emirates",
  "czech republic": "czechia",
  turkey: "turkiye",
  türkiye: "turkiye",
};

function normCountry(s?: string): string {
  if (!s) return "";
  const t = s.toLowerCase().replace(/[^a-zà-ÿ ]/g, "").trim();
  return COUNTRY_ALIAS[t] || t;
}

// Rough region membership so a region-locked remote role (e.g. "Remote, EU")
// only matches talent actually in that region.
const EUROPE = new Set([
  "united kingdom", "ireland", "france", "germany", "spain", "portugal",
  "italy", "netherlands", "belgium", "poland", "czechia", "austria",
  "switzerland", "sweden", "finland", "norway", "denmark", "cyprus", "greece",
  "romania", "hungary", "turkiye", "ukraine", "estonia", "lithuania", "latvia",
  "bulgaria", "croatia", "slovenia", "slovakia", "serbia",
]);
const REGION_COUNTRIES: { test: RegExp; countries: Set<string> }[] = [
  { test: /\b(eu|eea|emea|europe|european)\b/i, countries: EUROPE },
  {
    test: /\b(us|usa|united states|america|north america|americas)\b/i,
    countries: new Set(["united states", "canada"]),
  },
  {
    test: /\b(apac|asia)\b/i,
    countries: new Set(["singapore", "australia", "japan", "india", "china"]),
  },
];

/** For a region-locked remote role, is this talent's country in the region?
 *  Unknown region → treat as open (lenient), since we can't disprove it. */
function inRegion(remoteWhere: string | undefined, talentCountry: string): boolean {
  if (!remoteWhere || !talentCountry) return true;
  const region = REGION_COUNTRIES.find((r) => r.test.test(remoteWhere));
  return region ? region.countries.has(talentCountry) : true;
}

/** Country from a "City, Region, Country" label — the last comma segment. */
function countryOf(label?: string): string {
  if (!label) return "";
  const parts = label.split(",").map((p) => p.trim()).filter(Boolean);
  return normCountry(parts[parts.length - 1]);
}

/* --------------------------------------------------------------- matching */

function contractOK(job: Job, profile: Profile): boolean {
  const type = job.terms?.contract?.type;
  if (!type) return true; // unknown — don't disqualify
  const need = type === "permanent" ? "permanent" : "contract";
  return profile.availableFor.includes(need);
}

/** Returns the location fit, or null when there's a hard geo blocker. */
function locationFit(
  job: Job,
  talentCountry: string,
): { fit: LocationFit; note?: string } | null {
  const loc = job.terms?.location;
  if (job.remote === "remote") {
    const scope = loc?.remote_scope;
    if (!scope || scope === "global") return { fit: "remote-anywhere" };
    if (scope === "region") {
      if (!inRegion(loc?.remote_where, talentCountry)) return null; // wrong region
      return {
        fit: "remote-region",
        note: `Remote · ${loc?.remote_where || "regional"}`,
      };
    }
    // country-locked remote: only fits a talent in that country.
    const required = normCountry(loc?.remote_where);
    if (required && talentCountry && required === talentCountry) {
      return { fit: "remote-same-country" };
    }
    return null; // hard blocker (work authorisation) — excluded
  }

  // on-site / hybrid
  const jobCountry = countryOf(job.location);
  if (jobCountry && talentCountry && jobCountry === talentCountry) {
    return { fit: "same-country" };
  }
  const mode = job.remote === "hybrid" ? "Hybrid" : "On-site";
  return {
    fit: "onsite-elsewhere",
    note: `${mode} · ${shortLocation(job.location)} — remote or relocation`,
  };
}

/** ISO date this build; a match is "new" if the role was ingested this week. */
function weekAgoISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

/** Strong talent→role matches, per available profile, most matches first. */
export function getTalentMatches(): TalentMatches[] {
  const jobs = getLiveJobs();
  const cutoff = weekAgoISO();
  const out: TalentMatches[] = [];

  for (const profile of ROSTER) {
    if (!profile.available) continue;
    const cats = DISCIPLINE_CATEGORIES[profile.discipline];
    if (!cats.length) continue;
    const talentCountry = countryOf(profile.location.label);

    const matches: RoleMatch[] = [];
    for (const job of jobs) {
      if (!cats.includes(job.category)) continue;
      if (!profile.industries.includes(job.company.sector)) continue;
      if (!contractOK(job, profile)) continue;
      const lf = locationFit(job, talentCountry);
      if (!lf) continue; // hard geo blocker
      // Strong = they can genuinely take it: remote-compatible or in-country.
      // On-site in another country is a speculative "pitch remote", not strong.
      if (lf.fit === "onsite-elsewhere") continue;
      matches.push({
        job,
        fit: lf.fit,
        note: lf.note,
        isNew: (job.ingested_at || "") >= cutoff,
      });
    }

    if (!matches.length) continue;
    matches.sort(
      (a, b) =>
        Number(b.isNew) - Number(a.isNew) ||
        FIT_RANK[a.fit] - FIT_RANK[b.fit] ||
        (b.job.posted_at || "").localeCompare(a.job.posted_at || ""),
    );
    out.push({ profile, matches });
  }

  out.sort((a, b) => b.matches.length - a.matches.length);
  return out;
}

/** Totals for the page header. */
export function getMatchStats(): {
  talent: number;
  roles: number;
  newRoles: number;
} {
  const all = getTalentMatches();
  const roleSet = new Set<string>();
  const newSet = new Set<string>();
  for (const t of all)
    for (const m of t.matches) {
      roleSet.add(m.job.slug);
      if (m.isNew) newSet.add(m.job.slug);
    }
  return { talent: all.length, roles: roleSet.size, newRoles: newSet.size };
}
