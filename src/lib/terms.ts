/**
 * Fair Board Standard — the transparency layer (Phase A).
 *
 * Every dimension is TRI-STATE: a disclosed value, an explicit "Not disclosed"
 * (rendered honestly, never a flattering blank), or n/a where it genuinely
 * doesn't apply (e.g. remote scope for an on-site role). In the model, absent
 * === undisclosed; the UI turns that into "Not disclosed".
 *
 * `terms` on a job is assembled at BUILD TIME (see lib/jobs.ts):
 *   1. extractTerms() reads high-confidence signals out of the description /
 *      title / location — conservative on purpose, since a WRONG disclosed
 *      value is worse than an honest blank for a board whose whole pitch is
 *      trust.
 *   2. a manual overrides file (src/data/terms-overrides.json) layers on top,
 *      so curated / partner roles can be hand-perfected to full disclosure.
 *
 * This file is deliberately free of any dependency on the Job type so it can't
 * create an import cycle with lib/jobs.ts. Functions take just the fields they
 * need.
 */

/* ----------------------------------------------------------------- types */

export type Pay = {
  min?: number;
  max?: number;
  currency?: string; // ISO 4217, e.g. "GBP"
  period?: "year" | "month" | "day" | "hour";
  variable?: string; // optional free-text note (bonus / equity)
};

export type ContractKind = "permanent" | "fixed_term" | "rolling" | "contractor";
export type Contract = {
  type?: ContractKind;
  fixed_term_months?: number; // only meaningful when type === "fixed_term"
  probation_months?: number;
  notice_weeks?: number;
};

export type Hours = {
  per_week?: number; // contracted hours: 40, 37.5, 20 …
  full_time?: boolean; // stated full-time (when exact hours aren't given)
  second_job_allowed?: boolean; // exclusivity clause? true = a second job is allowed
  flexible?: boolean; // flexible / core-hours arrangement
};

export type WorkMode = "remote" | "hybrid" | "onsite";
export type RemoteScope = "global" | "region" | "country";
export type LocationTerms = {
  mode?: WorkMode;
  remote_scope?: RemoteScope;
  remote_where?: string; // "UK", "EU (CET ±3h)", "Worldwide" …
  timezone_overlap?: string; // "4h overlap with CET"
  office_days_per_week?: number;
  office_city?: string;
  relocation?: "offered" | "required" | "none";
};

export type Terms = {
  pay?: Pay;
  contract?: Contract;
  hours?: Hours;
  location?: LocationTerms;
};

/* ---------------------------------------------------------------- labels */

export const CONTRACT_LABELS: Record<ContractKind, string> = {
  permanent: "Permanent",
  fixed_term: "Fixed-term",
  rolling: "Rolling contract",
  contractor: "Contractor",
};

const CURRENCY_SYMBOL: Record<string, string> = { GBP: "£", USD: "$", EUR: "€" };
const PERIOD_SUFFIX: Record<NonNullable<Pay["period"]>, string> = {
  year: "/yr",
  month: "/mo",
  day: "/day",
  hour: "/hr",
};

/* -------------------------------------------------------------- formatters */

function money(n: number, currency?: string): string {
  const sym = (currency && CURRENCY_SYMBOL[currency]) || "";
  let body: string;
  if (n >= 1000) {
    const k = n / 1000;
    body = (Number.isInteger(k) ? k : Math.round(k * 10) / 10) + "k";
  } else {
    body = String(n);
  }
  return sym + body;
}

/** "£60k–£80k /yr", "Up to £80k /yr", "From £60k /yr", or null if no pay. */
export function formatPay(pay?: Pay): string | null {
  if (!pay || (pay.min == null && pay.max == null)) return null;
  const per = pay.period ? " " + PERIOD_SUFFIX[pay.period] : "";
  if (pay.min != null && pay.max != null) {
    return `${money(pay.min, pay.currency)}–${money(pay.max, pay.currency)}${per}`;
  }
  if (pay.max != null) return `Up to ${money(pay.max, pay.currency)}${per}`;
  return `From ${money(pay.min!, pay.currency)}${per}`;
}

function formatContract(c?: Contract): string | null {
  if (!c || !c.type) return null;
  let s = CONTRACT_LABELS[c.type];
  if (c.type === "fixed_term" && c.fixed_term_months) {
    s += ` · ${c.fixed_term_months} months`;
  }
  return s;
}

function formatHours(h?: Hours): string | null {
  if (!h) return null;
  const flex = h.flexible ? " · flexible" : "";
  if (h.per_week != null) {
    const n = Number.isInteger(h.per_week) ? h.per_week : h.per_week.toFixed(1);
    return `${n}h / week${flex}`;
  }
  // "Full-time" is a real stated fact when a role names it but not exact hours —
  // enough to not read as withheld, without inventing a number they didn't give.
  if (h.full_time) return `Full-time${flex}`;
  return h.flexible ? "Flexible hours" : null;
}

function formatSecondJob(h?: Hours): string | null {
  if (!h || h.second_job_allowed == null) return null;
  return h.second_job_allowed
    ? "Second job allowed"
    : "Exclusive — no second job";
}

const SCOPE_FALLBACK: Record<RemoteScope, string> = {
  global: "Worldwide",
  region: "Regional",
  country: "One country",
};

/** For a remote role, the disclosed scope; for hybrid, the office-days detail.
 *  Returns { label, value } or null when the dimension doesn't apply (onsite,
 *  or no mode known). value === null means applicable-but-undisclosed. */
function locationDim(
  loc: LocationTerms | undefined,
  fallbackMode?: WorkMode,
): { label: string; value: string | null } | null {
  const mode = loc?.mode ?? fallbackMode;
  if (mode === "remote") {
    if (!loc?.remote_scope) return { label: "Remote scope", value: null };
    const where = loc.remote_where || SCOPE_FALLBACK[loc.remote_scope];
    const tz = loc.timezone_overlap ? ` (${loc.timezone_overlap})` : "";
    return { label: "Remote scope", value: `Remote · ${where}${tz}` };
  }
  if (mode === "hybrid") {
    if (loc?.office_days_per_week == null) return { label: "Office days", value: null };
    const city = loc.office_city ? ` · ${loc.office_city}` : "";
    return {
      label: "Office days",
      value: `Hybrid · ${loc.office_days_per_week} days in office${city}`,
    };
  }
  if (mode === "onsite") {
    // "5 days/week in-office" is a stated commitment worth surfacing. Without a
    // stated number the remote-scope question just doesn't apply (n/a).
    if (loc?.office_days_per_week == null) return null;
    return {
      label: "On-site schedule",
      value: `On-site · ${loc.office_days_per_week} days/week in office`,
    };
  }
  // unknown mode: the location question doesn't apply.
  return null;
}

/* ----------------------------------------------------- transparency report */

export type TransparencyDim = {
  key: string;
  label: string;
  disclosed: boolean;
  value: string | null; // disclosed value, or null when not stated
};

export type TransparencyReport = {
  dims: TransparencyDim[];
  disclosed: number;
  total: number; // dynamic denominator — only dimensions that apply
  full: boolean; // every applicable dimension disclosed
};

/**
 * A role is "verified" only when the employer put it here themselves and
 * therefore opted into the Standard. Everything sourced from a public ATS /
 * board did NOT — so we never score it or imply it chose to withhold anything.
 * We only hold to account those who signed up to be held to account.
 */
export function isVerifiedSource(source: string): boolean {
  return source === "employer" || source === "partner";
}

/** Build the disclosure report for a role. `fallbackMode` is the job's legacy
 *  `remote` field, used when terms.location.mode isn't set. Undisclosed dims
 *  carry `value: null`; the panel chooses the wording ("Not stated" for sourced
 *  roles vs "Not disclosed" for employer-verified ones). */
export function transparencyReport(
  terms: Terms | undefined,
  fallbackMode?: WorkMode,
): TransparencyReport {
  const t = terms ?? {};
  const dims: TransparencyDim[] = [];

  const push = (key: string, label: string, value: string | null) =>
    dims.push({ key, label, disclosed: value != null, value });

  push("pay", "Pay", formatPay(t.pay));
  push("contract", "Contract", formatContract(t.contract));
  push("hours", "Weekly hours", formatHours(t.hours));
  push("second_job", "Second job", formatSecondJob(t.hours));

  const loc = locationDim(t.location, fallbackMode);
  if (loc) push("location", loc.label, loc.value);

  const disclosed = dims.filter((d) => d.disclosed).length;
  return {
    dims,
    disclosed,
    total: dims.length,
    full: dims.length > 0 && disclosed === dims.length,
  };
}

/* --------------------------------------------------------------- merge */

const TERM_KEYS = ["pay", "contract", "hours", "location"] as const;

/** Shallow-merge per sub-object: override wins field-by-field over the base
 *  (extracted) terms. Used to layer manual overrides on top of extraction. */
export function mergeTerms(base?: Terms, over?: Terms): Terms | undefined {
  if (!over) return base;
  if (!base) return over;
  const out: Terms = { ...base };
  for (const k of TERM_KEYS) {
    const o = over[k];
    if (o) out[k] = { ...(base[k] ?? {}), ...o } as never;
  }
  return out;
}

/** True when a Terms object carries no disclosed field at all. */
export function isEmptyTerms(t?: Terms): boolean {
  if (!t) return true;
  return TERM_KEYS.every((k) => {
    const v = t[k];
    return !v || Object.values(v).every((x) => x == null);
  });
}

/* ------------------------------------------------------------- extraction
 * Conservative, high-precision parsing from free text. Recall is deliberately
 * low: when in doubt we leave a field undisclosed rather than risk a wrong
 * disclosed value. Everything here can be overridden by terms-overrides.json.
 */

export function extractTerms(input: {
  description_md: string;
  title?: string;
  location?: string;
  remote?: WorkMode;
}): Terms {
  const text = (input.description_md || "").replace(/\s+/g, " ");
  const loc = input.location || "";
  const terms: Terms = {};

  const pay = extractPay(text);
  if (pay) terms.pay = pay;

  const contract = extractContract(text);
  if (contract) terms.contract = contract;

  const hours = extractHours(text);
  if (hours) terms.hours = hours;

  const location = extractLocation(text, loc, input.remote);
  if (location) terms.location = location;

  return terms;
}

/* -- pay -- */
const NUM = "\\d{1,3}(?:[,.\\s]\\d{3})*(?:\\.\\d+)?";
const PAY_RANGE = new RegExp(
  `([£$€])\\s?(${NUM})\\s?(k)?\\s?(?:-|–|—|to)\\s?([£$€])?\\s?(${NUM})\\s?(k)?`,
  "i",
);
const CURRENCY_OF: Record<string, string> = { "£": "GBP", $: "USD", "€": "EUR" };

function toNumber(raw: string, k?: string): number {
  let n = parseFloat(raw.replace(/[,\s]/g, ""));
  if (k) n *= 1000;
  return Math.round(n);
}

/** Plausible annual/other band per period so we don't read "$1M ARR" as pay. */
function inferPeriod(min: number, max: number): Pay["period"] | undefined {
  const hi = Math.max(min, max);
  const lo = Math.min(min, max);
  if (lo >= 15000 && hi <= 1_500_000) return "year";
  if (lo >= 1000 && hi <= 60000) return "month";
  if (lo >= 100 && hi <= 5000) return "day";
  if (lo >= 8 && hi <= 500) return "hour";
  return undefined;
}

function extractPay(text: string): Pay | null {
  const m = PAY_RANGE.exec(text);
  if (!m) return null;
  const currency = CURRENCY_OF[m[1]];
  const min = toNumber(m[2], m[3]);
  const max = toNumber(m[5], m[6]);
  if (!min || !max || max < min) return null;

  // Prefer an explicitly stated period near the match; else infer by magnitude.
  const tail = text.slice(m.index, m.index + m[0].length + 40).toLowerCase();
  let period: Pay["period"] | undefined;
  if (/per\s?(annum|year|yr|a)\b|p\.?a\.?\b|\/\s?(yr|year)|annual/.test(tail)) period = "year";
  else if (/per\s?hour|\/\s?hr|hourly/.test(tail)) period = "hour";
  else if (/per\s?day|\/\s?day|day rate|daily/.test(tail)) period = "day";
  else if (/per\s?month|\/\s?mo|monthly/.test(tail)) period = "month";
  else period = inferPeriod(min, max);

  if (!period) return null; // can't trust it without a period
  return { min, max, currency, period };
}

/* -- contract -- */
function extractContract(text: string): Contract | null {
  const t = text.toLowerCase();
  const c: Contract = {};

  const months =
    /(\d{1,2})[-\s]month(?:s)?\b[^.]{0,30}\b(?:contract|fixed[-\s]term|ftc|cover|temporary)\b/.exec(t) ||
    /\b(?:fixed[-\s]term|contract|ftc)\b[^.]{0,30}?(\d{1,2})[-\s]month/.exec(t);
  if (months) c.fixed_term_months = parseInt(months[1], 10);

  if (/\brolling contract\b/.test(t)) c.type = "rolling";
  else if (c.fixed_term_months || /\bfixed[-\s]term\b|\bftc\b|\bfixed term contract\b/.test(t))
    c.type = "fixed_term";
  else if (/\bpermanent\b|\bperm(anent)? (role|position|contract)\b/.test(t)) c.type = "permanent";
  else if (/\b(contractor|freelance(r)?|day rate|b2b contract)\b/.test(t)) c.type = "contractor";

  const prob = /(\d)[-\s]month(?:s)? probation/.exec(t);
  if (prob) c.probation_months = parseInt(prob[1], 10);

  const noticeW = /(\d{1,2})[-\s]week(?:s)? notice/.exec(t);
  const noticeM = /(\d)[-\s]month(?:s)? notice/.exec(t);
  if (noticeW) c.notice_weeks = parseInt(noticeW[1], 10);
  else if (noticeM) c.notice_weeks = parseInt(noticeM[1], 10) * 4;

  return c.type || c.fixed_term_months || c.probation_months || c.notice_weeks ? c : null;
}

/* -- hours -- */
function extractHours(text: string): Hours | null {
  const t = text.toLowerCase();
  const h: Hours = {};

  const hrs =
    /\b(\d{2}(?:\.\d)?)\s?(?:hours?|hrs)\s?(?:per week|a week|\/\s?week|weekly)/.exec(t) ||
    /\b(\d{2}(?:\.\d)?)[-\s]hour week\b/.exec(t);
  if (hrs) {
    const n = parseFloat(hrs[1]);
    if (n >= 10 && n <= 60) h.per_week = n;
  }

  // A stated "full-time" is a real fact — enough to not read as withheld,
  // without inventing an exact number the posting didn't give.
  if (h.per_week == null && /\bfull[-\s]?time\b/.test(t)) h.full_time = true;

  if (/\bflexible (working )?hours\b|\bcore hours\b|\bflexi[-\s]?time\b/.test(t)) h.flexible = true;

  if (/\bsecond job\b/.test(t)) {
    if (/(no|not|cannot|can't|may not|prohibit|forbidd?en)[^.]{0,30}\bsecond job\b/.test(t))
      h.second_job_allowed = false;
    else if (/\bsecond job\b[^.]{0,30}(allowed|permitted|welcome|fine|encouraged|ok)/.test(t))
      h.second_job_allowed = true;
  }
  if (/\bexclusivity clause\b|\bmust be exclusive\b/.test(t)) h.second_job_allowed = false;

  return h.per_week != null ||
    h.full_time != null ||
    h.flexible != null ||
    h.second_job_allowed != null
    ? h
    : null;
}

/** Days a week in the office, when a posting states it. Handles "5 days/week
 *  in-office", "in the office 3 days", "hybrid, 2 days", "3 days on-site". */
function extractOfficeDays(text: string): number | undefined {
  const m =
    /\b([1-5])\s?days?[^.]{0,14}\bin[-\s](?:the\s)?office\b/i.exec(text) ||
    /\bin[-\s](?:the\s)?office\b[^.]{0,14}?\b([1-5])\s?days?/i.exec(text) ||
    /\b([1-5])\s?days?\s?(?:\/|per|a)\s?week\b[^.]{0,14}(?:office|on[-\s]?site)/i.exec(text) ||
    /\bhybrid\b[^.]{0,40}?\b([1-5])\s?days?\b/i.exec(text) ||
    /\b([1-5])\s?days?\s?on[-\s]?site\b/i.exec(text);
  return m ? parseInt(m[1], 10) : undefined;
}

/* -- location / remote scope -- */
const COUNTRY_RE =
  /\b(uk|united kingdom|england|scotland|us|usa|united states|germany|france|spain|poland|canada|ireland|netherlands|portugal|sweden|finland|norway|denmark|india|turkey|t[üu]rkiye|cyprus)\b/i;
const COUNTRY_LABEL: Record<string, string> = {
  uk: "UK",
  "united kingdom": "UK",
  england: "UK",
  scotland: "UK",
  us: "US",
  usa: "US",
  "united states": "US",
  turkey: "Türkiye",
  türkiye: "Türkiye",
  turkiye: "Türkiye",
};

function extractLocation(
  text: string,
  locationStr: string,
  mode?: WorkMode,
): LocationTerms | null {
  if (!mode) return null;
  const hay = `${locationStr} ${text}`.toLowerCase();
  const out: LocationTerms = { mode };

  if (mode === "remote") {
    if (/\b(worldwide|globally|global|anywhere in the world|from anywhere|any timezone|fully distributed)\b/.test(hay)) {
      out.remote_scope = "global";
      out.remote_where = "Worldwide";
    } else if (/\b(eu|eea|europe|european|emea|apac|latam|americas)\b/.test(hay) || /\btimezones?\b/.test(hay)) {
      out.remote_scope = "region";
      const r = /\b(eu|eea|europe|emea|apac|latam|americas)\b/i.exec(hay);
      out.remote_where = r ? r[1].toUpperCase() : "Regional";
    } else {
      const c = COUNTRY_RE.exec(hay);
      if (c) {
        out.remote_scope = "country";
        const key = c[1].toLowerCase();
        out.remote_where = COUNTRY_LABEL[key] || c[1].replace(/\b\w/g, (x) => x.toUpperCase());
      }
    }
    const tz = /(\d)\s?h(?:ours?)?\s?overlap|overlap[^.]{0,20}?\b(cet|cest|gmt|utc|est|pst|bst)\b/i.exec(text);
    if (tz) out.timezone_overlap = tz[0].trim();
  } else if (mode === "hybrid") {
    const days = extractOfficeDays(text);
    if (days) out.office_days_per_week = days;
    const city = locationStr.split(/[,(]/)[0].trim();
    if (city && !/remote|hybrid/i.test(city)) out.office_city = city;
  } else if (mode === "onsite") {
    const days = extractOfficeDays(text);
    if (days) out.office_days_per_week = days;
  }

  // Only return if we learned something beyond the mode itself.
  return Object.keys(out).length > 1 ? out : null;
}
