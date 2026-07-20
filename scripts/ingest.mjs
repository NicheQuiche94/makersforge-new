#!/usr/bin/env node
/**
 * MakersForge job board, ATS ingestion (v1, run on demand).
 *
 * Pulls open roles from the public ATS APIs (Greenhouse / Lever / Ashby) for
 * the companies in `src/data/sources.json`, keeps ONLY the ones in our remit
 * (UA / growth / marketing-art / creative-strategy / ASO), pulls the REAL
 * posting content for each (cleaned to a short excerpt in our markdown, never
 * the full verbatim ad, we still link out to apply), and merges them into
 * `src/data/jobs.json`. It also writes `src/data/folk-import.csv`, one row
 * per company, ready to import into Folk as leads.
 *
 * Not a live backend, not a cron: run it, review the diff, push. Vercel
 * rebuilds the board from the updated jobs.json.
 *
 *   node scripts/ingest.mjs            # fetch, merge, write jobs.json + CSV
 *   node scripts/ingest.mjs --dry-run  # fetch + report only, write nothing
 *
 * A source entry:
 *   { "ats": "greenhouse", "slug": "acme",   // ATS board slug (from the URL)
 *     "companySlug": "acme-games",            // OPTIONAL clean URL slug
 *     "name": "Acme Games", "url": "https://…",
 *     "sector": "games", "size": "50-200", "blurb": "…",
 *     "stage": "Series A", "lastRaise": "2025-11" }  // OPTIONAL enrichment
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { standardizeJob } from "./standardize.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src", "data");
const SOURCES_PATH = join(DATA_DIR, "sources.json");
const JOBS_PATH = join(DATA_DIR, "jobs.json");
const CSV_PATH = join(DATA_DIR, "folk-import.csv");

const DRY_RUN = process.argv.includes("--dry-run");
// Sources we re-fetch every run (everything except hand-curated/employer).
const ATS_SOURCES = new Set([
  "greenhouse",
  "lever",
  "ashby",
  "workable",
  "teamtailor",
  "getro",
]);
const DEFAULT_EXPIRY_DAYS = 45;
const FETCH_TIMEOUT_MS = 20000;
// Skip roles first posted more than this long ago. Note: some ATS report the
// requisition's CREATED date, which is old for long-open-but-still-live roles
// (they're in the feed, so still open), so this is a lenient backstop against
// truly ancient listings, not a hard 3-month axe, else we'd drop live roles at
// publishers like Peak (Andre 2026-07-18).
const MAX_POSTED_AGE_DAYS = 180;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

/* ---------------------------------------------------- remit title filter */
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
// Out-of-remit even when the title otherwise matches: B2B/enterprise sales
// marketing, engineers on marketing teams, CRM/lifecycle (retention ops), and
// PR. We represent UA / growth / marketing-art talent for consumer mobile
// games & apps — not these (Andre 2026-07-19).
const OFF_REMIT_TITLE =
  /\bb2b\b|enterprise|software engineer|\bcrm\b|life[- ]?cycle|public relations|digital pr|\bpr\b/i;
// Technical/product roles that sit inside a growth/marketing team but aren't the
// talent we represent (e.g. "AI Engineer, Performance Marketing", Andre
// 2026-07-20). Analytics engineers are exempt — that's growth-data, in remit.
const TECHNICAL_ROLE = /\b(engineer(ing)?|developer|scientist|programmer)\b/i;

// A growth role in ANY word order: "growth" + a role word (catches "Associate
// Team Lead Growth", "Junior Growth Associate" that the strict rule missed,
// Andre 2026-07-20).
const GROWTH_ROLE =
  /\b(market|manager|lead|head|associate|specialist|director|analyst|strateg|hacker|executive|coordinator|marketer|ops|operations)\b/i;

function categoryFor(title) {
  if (OFF_REMIT_TITLE.test(title)) return null;
  if (TECHNICAL_ROLE.test(title) && !/analytics engineer/i.test(title)) return null;
  for (const [cat, re] of CATEGORY_RULES) if (re.test(title)) return cat;
  // Broad growth catch, minus product/program/supply/finance roles — those
  // aren't the marketing talent we represent (Andre 2026-07-20).
  if (
    /\bgrowth\b/i.test(title) &&
    GROWTH_ROLE.test(title) &&
    !/\bproduct\b|\bprogram\b|\bpm\b|supply|procurement|\bfinance\b/i.test(title)
  )
    return "growth";
  return null;
}

/* ------------------------------------------------------------- utilities */
function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function normalizeTitle(s) {
  return slugify(s).replace(/-/g, " ").trim();
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function addDaysISO(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function ageInDays(iso) {
  return Math.floor((Date.now() - new Date(iso + "T00:00:00").getTime()) / 86400000);
}
function cleanLocation(loc = "") {
  return loc.replace(/^[A-Z]{2}\s*-\s*/, "").trim();
}
function inferRemote(text = "") {
  const t = text.toLowerCase();
  if (/hybrid/.test(t)) return "hybrid";
  if (/remote|anywhere|distributed/.test(t)) return "remote";
  return "onsite";
}

const US_STATE = /,\s*(a[lkzr]|c[aot]|de|fl|ga|hi|i[adln]|k[sy]|la|m[adeinost]|n[cdehjmvy]|o[hkr]|pa|ri|s[cd]|t[nx]|ut|v[at]|w[aivy])\b/i;
const REGION_BY_HINT = [
  [
    "americas",
    /united states|\busa?\b|u\.s\.|canada|montr[eé]al|toronto|vancouver|ottawa|new york|san francisco|los angeles|austin|chicago|seattle|boston|miami|denver|atlanta|america|brazil|s[aã]o paulo|mexico|argentina|colombia|chile/i,
  ],
  [
    "apac",
    /singapore|japan|tokyo|china|shanghai|beijing|shenzhen|hong kong|korea|seoul|taiwan|australia|sydney|melbourne|new zealand|auckland|india|bangalore|bengaluru|indonesia|jakarta|vietnam|hanoi|ho chi minh|philippines|manila|thailand|bangkok|malaysia|kuala lumpur|apac/i,
  ],
  [
    "emea",
    /london|uk|united kingdom|england|scotland|edinburgh|manchester|ireland|dublin|germany|berlin|munich|hamburg|france|paris|spain|barcelona|madrid|netherlands|amsterdam|portugal|lisbon|italy|milan|rome|sweden|stockholm|finland|helsinki|norway|oslo|denmark|copenhagen|poland|warsaw|czech|prague|hungary|budapest|romania|bucharest|serbia|belgrade|greece|athens|austria|vienna|switzerland|zurich|europe|emea|istanbul|ankara|t[uü]rkiye|turkey|israel|tel aviv|uae|dubai|abu dhabi|cyprus|malta|egypt|cairo|nigeria|lagos|kenya|nairobi|south africa|cape town|johannesburg/i,
  ],
];
function inferRegion(text = "", remote = "onsite") {
  if (US_STATE.test(text)) return "americas";
  for (const [region, re] of REGION_BY_HINT) if (re.test(text)) return region;
  return remote === "remote" ? "global" : "emea";
}
function inferEmployment(text = "") {
  const t = text.toLowerCase();
  if (/contract|freelance|\bb2b\b/.test(t)) return "CONTRACTOR";
  if (/part[- ]time/.test(t)) return "PART_TIME";
  return "FULL_TIME";
}

/* ------------------------------------------------ HTML → clean markdown */
function decodeEntities(s = "") {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, ", ")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}

/** Convert a posting's HTML into our markdown subset (paragraphs, **bold**,
 *  `- ` bullets). Entity-decoded and structure-preserving; not a full parser. */
function htmlToMarkdown(html = "") {
  let s = decodeEntities(html);
  s = s
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*li\s*[^>]*>/gi, "\n- ")
    .replace(/<\s*h[1-6][^>]*>/gi, "\n\n**")
    .replace(/<\/\s*h[1-6]\s*>/gi, "**\n\n")
    .replace(/<\s*(strong|b)\s*[^>]*>/gi, "**")
    .replace(/<\/\s*(strong|b)\s*>/gi, "**")
    .replace(/<\/(p|div|ul|ol)\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, ""); // strip remaining tags
  s = decodeEntities(s); // second pass for any double-encoded text entities
  return s
    .replace(/\*\*\s*\*\*/g, "") // empty bold from adjacent headings
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*-\s*$/gm, "")
    // No em-dashes in board copy (Andre) — swap any (incl. &#8212; decoded) for commas.
    .replace(new RegExp(String.fromCodePoint(0x2014), "g"), ", ")
    .replace(/\s*,\s*,/g, ",")
    .trim();
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { accept: "application/json", "user-agent": UA },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------------------------------------------- per-ATS normalisers */
// Each returns { title, location, remote, employment_type, apply_url,
// posted_at, salary, contentHtml }.

async function fromGreenhouse(slug) {
  const data = await fetchJson(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
  );
  return (data.jobs || []).map((j) => {
    const loc = j.location?.name || "";
    return {
      title: j.title,
      location: loc,
      remote: inferRemote(loc + " " + j.title),
      employment_type: inferEmployment(j.title + " " + loc),
      apply_url: j.absolute_url,
      // first_published = the real "posted" date; updated_at only as fallback.
      posted_at: (j.first_published || j.updated_at || "").slice(0, 10) || todayISO(),
      salary: null,
      contentHtml: j.content || "",
    };
  });
}

async function fromLever(slug) {
  const data = await fetchJson(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  return (data || []).map((j) => {
    const loc = j.categories?.location || "";
    const lists = (j.lists || [])
      .map((l) => `${l.text ? `<h3>${l.text}</h3>` : ""}<ul>${l.content}</ul>`)
      .join("");
    return {
      title: j.text,
      location: loc,
      remote: inferRemote(`${j.workplaceType || ""} ${loc}`),
      employment_type: inferEmployment(j.categories?.commitment || ""),
      apply_url: j.hostedUrl || j.applyUrl,
      posted_at: j.createdAt
        ? new Date(j.createdAt).toISOString().slice(0, 10)
        : todayISO(),
      salary: j.salaryRange?.text || null,
      contentHtml: `${j.description || ""}${lists}`,
    };
  });
}

async function fromAshby(slug) {
  const data = await fetchJson(
    `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`,
  );
  return (data.jobs || []).map((j) => {
    const loc = j.location || j.locationName || "";
    return {
      title: j.title,
      location: loc,
      remote: j.isRemote ? "remote" : inferRemote(`${j.workplaceType || ""} ${loc}`),
      employment_type: inferEmployment(j.employmentType || ""),
      apply_url: j.jobUrl || j.applyUrl,
      posted_at: (j.publishedAt || "").slice(0, 10) || todayISO(),
      salary: j.compensation?.compensationTierSummary || null,
      contentHtml: j.descriptionHtml || "",
    };
  });
}

async function fromWorkable(slug) {
  const data = await fetchJson(
    `https://apply.workable.com/api/v1/widget/accounts/${slug}?details=true`,
  );
  return (data.jobs || []).map((j) => {
    const loc = [j.city, j.country].filter(Boolean).join(", ");
    return {
      title: j.title,
      location: loc,
      remote: j.telecommuting ? "remote" : inferRemote(loc),
      employment_type: inferEmployment(`${j.employment_type || ""} ${j.title}`),
      apply_url: j.url || j.shortlink || j.application_url,
      posted_at: (j.published_on || j.created_at || "").slice(0, 10) || todayISO(),
      salary: null,
      contentHtml: [j.description, j.requirements, j.benefits]
        .filter(Boolean)
        .join(""),
    };
  });
}

async function fromTeamTailor(slug) {
  const data = await fetchJson(`https://${slug}.teamtailor.com/jobs.json`);
  return (data.items || []).map((it) => {
    const p = it._jobposting || {};
    const addr = (p.jobLocation && p.jobLocation.address) || {};
    const loc = [addr.addressLocality, addr.addressCountry].filter(Boolean).join(", ");
    return {
      title: it.title,
      location: loc,
      remote: p.jobLocationType === "TELECOMMUTE" ? "remote" : inferRemote(loc),
      employment_type: inferEmployment(
        `${String(p.employmentType || "").replace(/_/g, " ")} ${it.title}`,
      ),
      apply_url: it.url,
      posted_at: (it.date_published || "").slice(0, 10) || todayISO(),
      salary: null,
      contentHtml: it.content_html || p.description || "",
    };
  });
}

const FETCHERS = {
  greenhouse: fromGreenhouse,
  lever: fromLever,
  ashby: fromAshby,
  workable: fromWorkable,
  teamtailor: fromTeamTailor,
};

/* ------------------------------------------------ Getro (VC portfolio boards)
 * A Getro board aggregates a whole VC portfolio, and each job carries the
 * company's industry tags, funding stage, headcount and salary, so it's a
 * source of enriched company leads, not just roles. We keep only in-remit
 * MOBILE games/apps roles and drop SaaS/other via the industry tags. */

const GETRO_HEADCOUNT = {
  1: "1-10",
  2: "11-50",
  3: "51-200",
  4: "201-500",
  5: "500+",
  6: "1000+",
};
const GETRO_STAGE = {
  pre_seed: "Pre-seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
  series_c: "Series C",
  series_d: "Series D",
  series_e: "Series E",
  series_unknown: "Growth-stage",
};

// Getro companies to exclude: off-remit (web3 / AI game *infrastructure*, not
// studios) or a duplicate of an ATS source we already carry (Andre 2026-07-19).
const GETRO_BLOCKLIST = /^(immutable|inworld|discord|sumup)/i;

/** Classify a company from its Getro industry tags: "games", "apps", or null
 *  (drop, SaaS / B2B / infra / not a mobile consumer product). */
function getroSector(tags = []) {
  const t = tags.map((x) => x.toLowerCase());
  const any = (re) => t.some((x) => re.test(x));
  if (any(/\bgames?\b|gaming|video games|esports|game (design|development)/))
    return "games";
  const consumer = any(
    /mobile|consumer|health|fitness|wellness|mental health|fintech|finance|payments|banking|social|dating|education|edtech|entertainment|music|photo|video|creator|media|streaming|shopping|commerce|travel|food/,
  );
  const b2b = any(
    /enterprise|\bsaas\b|developer tools|devops|infrastructure|cloud|cybersecurity|\bsecurity\b|semiconductor|hardware|robotics|manufacturing|logistics|supply chain|biotech|pharma|real estate|insurance|\blegal\b|hr tech|human resources|data infrastructure|\bapi\b|\bb2b\b|analytics platform|marketing automation/,
  );
  if (consumer && !b2b) return "apps";
  return null;
}

function getroSalary(j) {
  const min = j.compensation_amount_min_cents;
  const max = j.compensation_amount_max_cents;
  if (!min && !max) return null;
  const sym =
    { USD: "$", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$" }[
      j.compensation_currency
    ] || "";
  const per =
    { year: "/yr", month: "/mo", day: "/day", hour: "/hr" }[
      j.compensation_period
    ] || "";
  const k = (c) => {
    const n = c / 100;
    return n >= 1000 ? Math.round(n / 1000) + "k" : String(Math.round(n));
  };
  return [min && sym + k(min), max && sym + k(max)].filter(Boolean).join("–") + per;
}

async function pullGetro(collectionId) {
  const jobs = [];
  let count = Infinity;
  for (let page = 0; page < 40 && jobs.length < count; page++) {
    const res = await fetch(
      `https://api.getro.com/api/v2/collections/${collectionId}/search/jobs`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "user-agent": UA,
        },
        body: JSON.stringify({ hitsPerPage: 20, page }),
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();
    count = d.results.count;
    if (!d.results.jobs.length) break;
    jobs.push(...d.results.jobs);
  }
  return jobs;
}

/**
 * Full description via the underlying ATS posting where the Getro apply URL
 * points at one (cross-referencing the company's own posting, per Andre's
 * pipeline); otherwise a concise summary from the Getro metadata. Never the
 * raw scraped ad.
 */
async function getroDescription(j, companyName) {
  const url = j.url || "";
  try {
    let m;
    if ((m = url.match(/greenhouse\.io\/(?:[^/]*\/)?([^/?]+)\/jobs\/(\d+)/))) {
      const d = await fetchJson(
        `https://boards-api.greenhouse.io/v1/boards/${m[1]}/jobs/${m[2]}`,
      );
      const md = htmlToMarkdown(d.content || "");
      if (md) return md;
    } else if ((m = url.match(/lever\.co\/([^/]+)\/([a-f0-9-]{20,})/))) {
      const d = await fetchJson(
        `https://api.lever.co/v0/postings/${m[1]}/${m[2]}?mode=json`,
      );
      const lists = (d.lists || [])
        .map((l) => `${l.text ? `<h3>${l.text}</h3>` : ""}<ul>${l.content}</ul>`)
        .join("");
      const md = htmlToMarkdown(`${d.description || ""}${lists}`);
      if (md) return md;
    }
  } catch {
    /* fall through to the metadata summary */
  }
  return [
    `${companyName} is hiring a ${j.title}${
      j.locations && j.locations[0] ? ` in ${j.locations[0]}` : ""
    }.`,
    j.skills && j.skills.length
      ? `Focus areas include ${j.skills.slice(0, 6).join(", ")}.`
      : "",
    `Read the full brief and apply on ${companyName}'s own posting.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/* ------------------------------------------------------------------ main */
async function main() {
  const sources = JSON.parse(await readFile(SOURCES_PATH, "utf8"));
  let vcBoards = [];
  try {
    vcBoards = JSON.parse(await readFile(join(DATA_DIR, "vc-boards.json"), "utf8"));
  } catch {
    /* vc-boards.json is optional */
  }
  const existing = JSON.parse(await readFile(JOBS_PATH, "utf8"));

  const curated = existing.filter((j) => !ATS_SOURCES.has(j.source));
  const curatedKeys = new Set(
    curated.map((j) => `${j.company.slug}::${normalizeTitle(j.title)}`),
  );
  // Preserve first-seen dates across runs so freshness is stable, keyed by slug.
  const prevIngested = new Map(
    existing
      .filter((j) => ATS_SOURCES.has(j.source) && j.ingested_at)
      .map((j) => [j.slug, j.ingested_at]),
  );

  const ingested = [];
  const rejects = [];
  let stale = 0;
  const companiesTouched = new Map();
  const usedSlugs = new Set(existing.map((j) => j.slug));
  const seenKeys = new Set(curatedKeys);

  for (const src of sources) {
    const fetcher = FETCHERS[src.ats];
    if (!fetcher) {
      console.warn(`! ${src.name}: unknown ATS "${src.ats}", skipped`);
      continue;
    }
    const companySlug = src.companySlug || src.slug;
    let postings;
    try {
      postings = await fetcher(src.slug);
    } catch (err) {
      console.warn(`! ${src.name} (${src.ats}/${src.slug}): ${err.message}, skipped`);
      continue;
    }

    let kept = 0;
    for (const p of postings) {
      if (!p.title || !p.apply_url) continue;
      const category = categoryFor(p.title);
      if (!category) {
        rejects.push(`${src.name}: ${p.title}`);
        continue;
      }
      p.location = cleanLocation(p.location);

      const posted = /^\d{4}-\d{2}-\d{2}$/.test(p.posted_at)
        ? p.posted_at
        : todayISO();
      if (ageInDays(posted) > MAX_POSTED_AGE_DAYS) {
        stale += 1;
        continue;
      }

      const key = `${companySlug}::${normalizeTitle(p.title)}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      let slug = `${companySlug}-${slugify(p.title)}`;
      let n = 2;
      while (usedSlugs.has(slug)) slug = `${companySlug}-${slugify(p.title)}-${n++}`;
      usedSlugs.add(slug);

      const region = inferRegion(p.location, p.remote);

      const description_md =
        htmlToMarkdown(p.contentHtml) ||
        `${src.name} is hiring a ${p.title}. Read the full brief and apply on ${src.name}'s careers page.`;

      ingested.push({
        slug,
        title: p.title,
        company: {
          slug: companySlug,
          name: src.name,
          url: src.url,
          ...(src.logo ? { logo: src.logo } : {}),
          blurb: src.blurb || `${src.name} is hiring in games and apps.`,
          ...(src.size ? { size: src.size } : {}),
          sector: src.sector || "games",
          ...(src.stage ? { stage: src.stage } : {}),
          ...(src.lastRaise ? { lastRaise: src.lastRaise } : {}),
        },
        category,
        location: p.location || "See posting",
        region,
        remote: p.remote,
        employment_type: p.employment_type,
        salary: p.salary || null,
        description_md,
        apply_url: p.apply_url,
        source: src.ats,
        // posted_at = the real ATS date (drives "Posted X ago"). expires_at is
        // measured from INGEST date, not post date: the role is open right now
        // (it's in today's live feed), so it stays live for the window and a
        // re-run refreshes it, otherwise long-open roles look wrongly expired.
        posted_at: posted,
        expires_at: addDaysISO(todayISO(), DEFAULT_EXPIRY_DAYS),
        ingested_at: prevIngested.get(slug) || todayISO(),
      });
      kept += 1;

      const c = companiesTouched.get(companySlug) || { ...src, roles: 0 };
      c.roles += 1;
      companiesTouched.set(companySlug, c);
    }
    console.log(
      `· ${src.name} (${src.ats}): ${postings.length} postings → ${kept} in remit`,
    );
  }

  // --- VC portfolio boards (Getro) ---
  for (const board of vcBoards) {
    if (board.platform !== "getro") continue;
    let jobs;
    try {
      jobs = await pullGetro(board.collectionId);
    } catch (err) {
      console.warn(`! ${board.vc} (getro/${board.collectionId}): ${err.message}, skipped`);
      continue;
    }

    let kept = 0;
    for (const j of jobs) {
      if (!j.title || !j.url || !j.organization) continue;
      const category = categoryFor(j.title);
      if (!category) {
        rejects.push(`${board.vc}: ${j.title}`);
        continue;
      }
      const sector = getroSector(j.organization.industry_tags);
      if (!sector) continue; // keep only mobile games/apps

      const org = j.organization;
      if (GETRO_BLOCKLIST.test(org.slug || "") || GETRO_BLOCKLIST.test(org.name || ""))
        continue; // off-remit or dup of an ATS source
      const companySlug = "vc-" + slugify(org.slug || org.name);
      const location = cleanLocation(
        (j.locations && j.locations[0]) ||
          (j.searchable_locations && j.searchable_locations[0]) ||
          "",
      );
      const posted = j.created_at
        ? new Date(j.created_at * 1000).toISOString().slice(0, 10)
        : todayISO();
      if (ageInDays(posted) > MAX_POSTED_AGE_DAYS) {
        stale += 1;
        continue;
      }

      const key = `${companySlug}::${normalizeTitle(j.title)}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      let slug = `${companySlug}-${slugify(j.title)}`;
      let n = 2;
      while (usedSlugs.has(slug)) slug = `${companySlug}-${slugify(j.title)}-${n++}`;
      usedSlugs.add(slug);

      const remote =
        j.work_mode === "remote" ? "remote" : j.work_mode === "hybrid" ? "hybrid" : "onsite";
      const stage = GETRO_STAGE[org.stage] || null;
      const size = GETRO_HEADCOUNT[org.head_count];
      const companyUrl = org.domain ? `https://${org.domain}` : j.url;
      const description_md = await getroDescription(j, org.name);

      ingested.push({
        slug,
        title: j.title,
        company: {
          slug: companySlug,
          name: org.name,
          url: companyUrl,
          blurb: `${org.name}, ${(org.industry_tags || []).slice(0, 3).join(", ")}${
            stage ? ` · ${stage}` : ""
          }. Backed by ${board.vc}.`,
          ...(size ? { size } : {}),
          sector,
          ...(stage ? { stage } : {}),
        },
        category,
        location: location || "See posting",
        region: inferRegion(location, remote),
        remote,
        employment_type: inferEmployment(j.title),
        salary: getroSalary(j),
        description_md,
        apply_url: j.url,
        source: "getro",
        posted_at: posted,
        expires_at: addDaysISO(todayISO(), DEFAULT_EXPIRY_DAYS),
        ingested_at: prevIngested.get(slug) || todayISO(),
      });
      kept += 1;

      const c = companiesTouched.get(companySlug) || {
        name: org.name,
        url: companyUrl,
        sector,
        size,
        stage,
        blurb: `Backed by ${board.vc}`,
        roles: 0,
      };
      c.roles += 1;
      companiesTouched.set(companySlug, c);
    }
    console.log(`· ${board.vc} (getro): ${jobs.length} jobs → ${kept} in remit`);
  }

  // Standardise every title/location before writing so scraped artifacts
  // (bracket prefixes, postcodes, pipe separators) never reach the board.
  const merged = [...curated, ...ingested]
    .map(standardizeJob)
    .sort((a, b) => b.posted_at.localeCompare(a.posted_at));

  console.log(
    `\nSummary: ${curated.length} curated kept · ${ingested.length} ingested · ${stale} skipped (>${MAX_POSTED_AGE_DAYS}d old) · ${rejects.length} rejected (off-remit)`,
  );

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  await writeFile(JOBS_PATH, JSON.stringify(merged, null, 2) + "\n", "utf8");
  await writeFile(CSV_PATH, buildFolkCsv(companiesTouched), "utf8");
  console.log(`\n✓ Wrote ${merged.length} jobs → src/data/jobs.json`);
  console.log(`✓ Wrote ${companiesTouched.size} companies → src/data/folk-import.csv`);
  console.log("Review the diff, then commit + push to publish.");
}

/** One row per company with a live in-remit role, import into Folk as leads. */
function buildFolkCsv(companies) {
  const header = [
    "Company",
    "Website",
    "Sector",
    "Size",
    "Stage",
    "Live in-remit roles",
    "Status",
    "Channel",
    "Blurb",
  ];
  const rows = [header];
  for (const c of companies.values()) {
    rows.push([
      c.name,
      c.url,
      c.sector || "",
      c.size || "",
      c.stage || "",
      String(c.roles),
      "Lead",
      "Job board signal",
      c.blurb || "",
    ]);
  }
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
function csvCell(v) {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
