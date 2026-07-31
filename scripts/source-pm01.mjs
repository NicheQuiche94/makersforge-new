/**
 * Bespoke sourcing for pm·01 — Head of Product & Ad Monetisation.
 *
 * pm·01 is `product` discipline, which is OFF the board's UA/growth/marketing
 * remit, so the standard talent-source pipeline (gated on categoryFor) skips
 * them entirely. This searches their actual seats directly — senior product /
 * ad-monetisation / GM roles in mobile games & apps — with no remit gate, a
 * seniority filter (Head / Director / VP / GM / Lead / Chief), and the same
 * aggregator + on-board dedupe. Review-gated: writes docs/pm01-roles.md, never
 * auto-publishes.
 *
 * Run: node --env-file=.env.local scripts/source-pm01.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROSTER } from "../src/data/roster.ts";
import { fetchGoogleJobs, slugify, parsePostedAt } from "./serpapi.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JOBS_PATH = join(ROOT, "src", "data", "jobs.json");
const MD_PATH = join(ROOT, "docs", "pm01-roles.md");

// pm·01's real seats. Ad-mon roles are the closest neighbours of the board's
// growth remit; the rest are senior product / GM leadership in mobile.
const QUERIES = [
  `"Head of Product" mobile games`,
  `"Head of Ad Monetisation" mobile games`,
  `"Head of Ad Monetization" mobile games`,
  `"Director of Product" mobile games`,
  `"VP Product" mobile games`,
  `"Head of Monetisation" mobile games`,
  `"Head of Product" casual games`,
];

// Must read as a leadership seat at their level.
const SENIOR =
  /\b(head|director|vp|vice[-\s]?president|gm|general manager|lead|principal|chief|c[a-z]o)\b/i;
// Must be product / monetisation / commercial, not some unrelated "head of X".
const RELEVANT =
  /\b(product|moneti[sz]|revenue|commercial|growth|ad[-\s]?mon|liveops|live ops|p&l)\b/i;

const AGGREGATOR =
  /jobleads|monster|gamecompanies|games? ?companies|talents? by vaia|\bvaia\b|linkedin|\bindeed\b|glassdoor|ziprecruiter|jooble|lensa|jobrapido|adzuna|whatjobs|careerbuilder|snagajob|talent\.com|jobget|mundo gamer|get\.it|jobsora|neuvoo|simplyhired|jobsite|totaljobs|reed\.co/i;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function mapRaw(r) {
  const company = (r.company_name || "").trim();
  const title = (r.title || "").replace(/\s+/g, " ").trim();
  const ext = r.detected_extensions || {};
  const apply_url = (r.apply_options || [])[0]?.link || "";
  return {
    company,
    companySlug: slugify(company),
    title,
    location: (r.location || "").trim(),
    remote: ext.work_from_home ? "remote" : "onsite",
    posted_at: parsePostedAt(ext.posted_at),
    via: (r.via || "").replace(/^via\s+/i, ""),
    apply_url,
  };
}

async function boardKeys() {
  const raw = JSON.parse(await readFile(JOBS_PATH, "utf8"));
  const jobs = Array.isArray(raw) ? raw : raw.jobs || [];
  return new Set(jobs.map((j) => `${j.company?.slug}::${slugify(j.title || "")}`));
}

async function main() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.error("Missing SERPAPI_KEY. Run: node --env-file=.env.local scripts/source-pm01.mjs");
    process.exit(1);
  }
  const pm = ROSTER.find((p) => p.id === "pm-01");
  const onBoard = await boardKeys();
  const seen = new Set();
  const found = [];
  let searches = 0;

  for (const q of QUERIES) {
    let raw = [];
    try {
      raw = await fetchGoogleJobs(q, { apiKey });
      searches++;
    } catch (e) {
      console.error(`  ! "${q}" failed: ${e.message}`);
      continue;
    }
    let kept = 0;
    for (const r of raw) {
      const m = mapRaw(r);
      if (!m.company || !m.apply_url) continue;
      if (AGGREGATOR.test(m.company)) continue;
      if (!SENIOR.test(m.title) || !RELEVANT.test(m.title)) continue;
      // Collapse aggregator state-spam: the same role posted per-US-state with a
      // trailing number ("… Casual 52", "… Casual 33") is one role.
      const baseTitle = m.title.replace(/[\s\-–]+\d{1,3}$/, "").trim();
      const key = `${m.companySlug}::${slugify(baseTitle)}`;
      if (onBoard.has(key) || seen.has(key)) continue;
      seen.add(key);
      found.push(m);
      kept++;
    }
    console.log(`  ${q} -> ${kept} kept`);
  }

  // Remote / EU first — pm·01 is EU-remote.
  found.sort(
    (a, b) =>
      (b.remote === "remote" ? 1 : 0) - (a.remote === "remote" ? 1 : 0) ||
      (b.posted_at || "").localeCompare(a.posted_at || ""),
  );

  const out = ["# Senior product / ad-mon roles for pm·01", ""];
  out.push(
    `Generated ${todayISO()} from ${searches} searches. **${found.length} off-board role${found.length === 1 ? "" : "s"}** for ${pm?.role || "Head of Product & Ad Monetisation"} (${pm?.location?.label || "EU · remote"}, £1,000/day).`,
    "",
    "_Off the board's normal remit (product, not UA/growth), so hand-checked queries. Sanity-check the employer before outreach; remote roles are listed first._",
    "",
  );
  for (const m of found) {
    const loc = m.location ? ` · ${m.location}` : "";
    const rem = m.remote === "remote" ? " · **remote**" : "";
    const posted = m.posted_at ? ` · posted ${m.posted_at}` : "";
    const via = m.via ? ` · via ${m.via}` : "";
    out.push(
      `- **${m.company}** — ${m.title}${loc}${rem}${posted}${via}  \n  [apply ↗](${m.apply_url})`,
    );
  }
  if (!found.length) out.push("_No off-board roles found this run._");
  out.push("", `_Auto-generated ${todayISO()} by scripts/source-pm01.mjs._`);

  await writeFile(MD_PATH, out.join("\n") + "\n", "utf8");
  console.log(`\n✓ ${searches} searches, ${found.length} roles → docs/pm01-roles.md`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
