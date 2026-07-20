/**
 * SerpApi Google Jobs client + mapper (Andre 2026-07-20).
 *
 * Google Jobs aggregates LinkedIn / Indeed / company postings, so this is a
 * low-risk way to pull LinkedIn-sourced roles WITHOUT scraping LinkedIn
 * directly (no account, no ToS breach). But it's an OPEN search — results are
 * noisier than our curated ATS + VC-board sources — so the runner
 * (serpapi-pull.mjs) writes candidates to a REVIEW queue, never straight to the
 * live board. Approved companies get promoted into sources.json afterwards.
 *
 * This module is pure/testable: fetch + map only, no file writes.
 */

import { cleanTitle, cleanLocation } from "./standardize.mjs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

/* ---- remit filter — MIRRORS scripts/ingest.mjs; keep the two in sync ---- */
const CATEGORY_RULES = [
  ["aso", /\baso\b|app store optimi[sz]/i],
  ["creative-strategy", /creative strateg|playable ads? strateg/i],
  [
    "marketing-art",
    /marketing artist|ua artist|ua creative|motion designer|video (artist|editor)|creative (producer|designer)|playable ads? (artist|designer|creative|producer)/i,
  ],
  [
    "ua",
    /user acquisition|\bua\b(?!\w)|performance marketing|paid (media|social|acquisition|marketing)|media buyer|growth marketing/i,
  ],
  ["growth", /\bgrowth (marketing|marketer|lead|manager|head|analyst)|head of growth/i],
];
const OFF_REMIT_TITLE =
  /\bb2b\b|enterprise|software engineer|\bcrm\b|life[- ]?cycle|public relations|digital pr|\bpr\b/i;
// Technical/product roles inside a growth team (e.g. "AI Engineer, Performance
// Marketing") — not the talent we represent. Analytics engineers are exempt.
const TECHNICAL_ROLE = /\b(engineer|developer|scientist|programmer)\b/i;

export function categoryFor(title) {
  if (!title || OFF_REMIT_TITLE.test(title)) return null;
  if (TECHNICAL_ROLE.test(title) && !/analytics engineer/i.test(title)) return null;
  for (const [cat, re] of CATEGORY_RULES) if (re.test(title)) return cat;
  return null;
}

/* ---- helpers ---- */
export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Google Jobs "posted_at" is relative ("3 days ago", "30+ days ago",
 *  "13 hours ago"). Convert to an approximate ISO date. */
export function parsePostedAt(rel) {
  if (!rel) return todayISO();
  const m = /(\d+)\+?\s*(hour|day|week|month)/i.exec(rel);
  if (!m) return todayISO();
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const days =
    unit === "hour" ? 0 : unit === "day" ? n : unit === "week" ? n * 7 : n * 30;
  return addDaysISO(todayISO(), -days);
}

const AGGREGATOR =
  /(linkedin|indeed|glassdoor|ziprecruiter|jobrapido|talent\.com|bebee|trabajo|adzuna|jooble|simplyhired)/i;

/** Prefer a direct/company apply link over an aggregator; derive the company
 *  site from it when we can. */
function pickApply(options = []) {
  if (!options.length) return { apply_url: "", company_url: "" };
  const direct = options.find((o) => o.link && !AGGREGATOR.test(o.link));
  const chosen = direct || options[0];
  let company_url = "";
  if (direct?.link) {
    try {
      company_url = new URL(direct.link).origin;
    } catch {
      /* ignore */
    }
  }
  return { apply_url: chosen.link || "", company_url };
}

/**
 * One Google Jobs search. Returns the raw jobs_results array (may be []).
 * Throws on HTTP / network error so the runner can log and continue.
 */
export async function fetchGoogleJobs(q, { apiKey, location } = {}) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_jobs");
  url.searchParams.set("q", q);
  if (location) url.searchParams.set("location", location);
  url.searchParams.set("hl", "en");
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`SerpApi HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`SerpApi: ${data.error}`);
  return data.jobs_results || [];
}

/** A Google web search (engine=google). Returns organic_results. */
export async function fetchGoogleSearch(q, { apiKey, gl = "gb", num = 10 } = {}) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", q);
  url.searchParams.set("gl", gl);
  url.searchParams.set("hl", "en");
  url.searchParams.set("num", String(num));
  url.searchParams.set("api_key", apiKey);
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`SerpApi Search HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`SerpApi Search: ${data.error}`);
  return data.organic_results || [];
}

/**
 * One Google Play chart page. Games and apps use DIFFERENT engines:
 *   - games: engine "google_play_games" (no category)
 *   - apps:  engine "google_play", store "apps", apps_category "FINANCE" etc.
 * `chart` is topgrossing / topselling_free / topselling_paid; `gl` a country.
 * Apps sit under `top_charts`. Each row has title + author (the developer).
 */
export async function fetchGooglePlayChart({
  engine = "google_play",
  store,
  apps_category,
  chart,
  gl,
  apiKey,
}) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", engine);
  if (store) url.searchParams.set("store", store);
  if (apps_category) url.searchParams.set("apps_category", apps_category);
  url.searchParams.set("chart", chart);
  if (gl) url.searchParams.set("gl", gl);
  url.searchParams.set("hl", "en");
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      `SerpApi Play HTTP ${res.status}${body.error ? `: ${body.error}` : ""}`,
    );
  }
  const data = await res.json();
  if (data.error) throw new Error(`SerpApi Play: ${data.error}`);

  if (Array.isArray(data.top_charts)) return data.top_charts;
  if (Array.isArray(data.organic_results)) return data.organic_results;
  for (const v of Object.values(data)) {
    if (Array.isArray(v) && v.some((x) => x && x.title && (x.author || x.developer)))
      return v;
  }
  return [];
}

/** Extract the developer/publisher from a Play app row. Returns null if no
 *  usable author. `downloads` and `product_id` come along for scoring/linking. */
export function normalizePlayApp(app, sector) {
  const author = (app.author || app.developer || "").trim();
  if (!author) return null;
  return {
    developer: author,
    developerSlug: slugify(author),
    app: (app.title || "").trim(),
    product_id: app.product_id || app.app_id || "",
    downloads: app.downloads || app.extracted_downloads || "",
    rating: app.rating ?? null,
    sector,
  };
}

/**
 * Map one Google Jobs result to a review candidate. Returns null if the title
 * is out of remit or the row is unusable. `sectorGuess` is the sector the
 * QUERY targeted — a guess, since the company may not actually match (that's
 * what the human review step confirms).
 */
export function mapResult(r, sectorGuess) {
  const title = cleanTitle(r.title || "");
  const category = categoryFor(title);
  if (!category) return null;

  const company = (r.company_name || "").trim();
  if (!company) return null;

  const ext = r.detected_extensions || {};
  const { apply_url, company_url } = pickApply(r.apply_options);
  if (!apply_url) return null;

  const description_md = (r.description || "").trim();
  const remote = ext.work_from_home ? "remote" : "onsite";

  return {
    companySlug: slugify(company),
    company,
    company_url,
    title,
    category,
    sectorGuess,
    location: cleanLocation(r.location || "") || "See posting",
    remote,
    employment_type: ext.schedule_type || "Full-time",
    posted_at: parsePostedAt(ext.posted_at),
    via: (r.via || "").replace(/^via\s+/i, ""),
    apply_url,
    blurb: description_md.slice(0, 180).replace(/\s+/g, " ").trim(),
    description_md,
  };
}
