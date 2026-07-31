/**
 * Talent-led sourcing (review-gated).
 *
 * For each AVAILABLE roster profile, searches Google Jobs (via SerpApi) for
 * roles that fit them, drops anything already on the board or off-remit, and
 * writes a review doc (docs/talent-sourcing.md) grouped by talent. NOTHING is
 * auto-published — Andre reviews, then promotes chosen roles to the board and
 * does the outreach. Google Jobs is noisy (aggregator company names, rough
 * locations), which is exactly why this is a review queue, not an auto-ingest.
 *
 * Run:  node --env-file=.env.local scripts/talent-source.mjs [maxTalent]
 *   maxTalent (optional) limits how many talent are searched — use a small
 *   number to conserve the SerpApi free-tier quota (250/mo) while testing.
 *
 * Node 24 strips the TS types when importing roster.ts (no build step).
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ROSTER } from "../src/data/roster.ts";
import { fetchGoogleJobs, mapResult, slugify } from "./serpapi.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JOBS_PATH = join(ROOT, "src", "data", "jobs.json");
const MD_PATH = join(ROOT, "docs", "talent-sourcing.md");
const JSON_PATH = join(ROOT, "src", "data", "talent-sourcing.json");

// Which board categories each discipline can fill (mirror of lib/matches.ts).
const DISCIPLINE_CATEGORIES = {
  ua: ["ua", "growth"],
  creative: ["marketing-art", "creative-strategy"],
  aso: ["aso"],
  product: [],
};

const CAT_LABEL = {
  ua: "UA",
  growth: "Growth",
  "marketing-art": "Marketing Art",
  "creative-strategy": "Creative Strategy",
  aso: "ASO",
};

// Google Jobs often reports an aggregator/job-board as the "company". These are
// never the real employer, so drop them — the rest still gets a human review.
const AGGREGATOR =
  /jobleads|monster|gamecompanies|games? ?companies|talents? by vaia|\bvaia\b|linkedin|\bindeed\b|glassdoor|ziprecruiter|jooble|lensa|jobrapido|adzuna|whatjobs|careerbuilder|snagajob|talent\.com|jobget|mundo gamer|get\.it|jobsora|neuvoo|simplyhired|jobsite|totaljobs|reed\.co/i;

function sectorTerm(industries = []) {
  const g = industries.includes("games");
  const a = industries.includes("apps");
  if (g && a) return "mobile games apps";
  if (g) return "mobile games";
  if (a) return "mobile apps";
  return "mobile";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function loadBoardKeys() {
  const raw = JSON.parse(await readFile(JOBS_PATH, "utf8"));
  const jobs = Array.isArray(raw) ? raw : raw.jobs || [];
  const keys = new Set();
  for (const j of jobs) keys.add(`${j.company?.slug}::${slugify(j.title || "")}`);
  return keys;
}

async function main() {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.error("Missing SERPAPI_KEY. Run with: node --env-file=.env.local scripts/talent-source.mjs");
    process.exit(1);
  }
  const maxTalent = parseInt(process.argv[2] || "0", 10) || Infinity;

  const boardKeys = await loadBoardKeys();
  const available = ROSTER.filter(
    (p) => p.available && DISCIPLINE_CATEGORIES[p.discipline]?.length,
  ).slice(0, maxTalent);

  const seenGlobal = new Set(); // dedupe roles across talent within this run
  const results = [];
  let searches = 0;

  for (const p of available) {
    const cats = DISCIPLINE_CATEGORIES[p.discipline];
    const query = `${p.role} ${sectorTerm(p.industries)}`.trim();
    let raw = [];
    try {
      raw = await fetchGoogleJobs(query, { apiKey });
      searches++;
    } catch (e) {
      console.error(`  ! search failed for ${p.codename}: ${e.message}`);
    }

    const candidates = [];
    for (const r of raw) {
      const m = mapResult(r, p.industries[0]);
      if (!m) continue; // off-remit / unusable
      if (AGGREGATOR.test(m.company)) continue; // aggregator, not a real employer
      if (!cats.includes(m.category)) continue; // must fit this talent's disciplines
      const key = `${m.companySlug}::${slugify(m.title)}`;
      if (boardKeys.has(key)) continue; // already on the board
      if (seenGlobal.has(key)) continue; // already collected this run
      seenGlobal.add(key);
      candidates.push(m);
    }

    console.log(`  ${p.codename} "${query}" -> ${candidates.length} off-board`);
    results.push({ profile: p, query, candidates });
  }

  await writeReview(results, searches);
  const total = results.reduce((n, r) => n + r.candidates.length, 0);
  console.log(`\n✓ ${searches} searches, ${total} off-board candidates`);
  console.log(`✓ Review doc → docs/talent-sourcing.md`);
}

async function writeReview(results, searches) {
  const total = results.reduce((n, r) => n + r.candidates.length, 0);
  const withAny = results.filter((r) => r.candidates.length);

  const out = ["# Off-board roles for your talent", ""];
  out.push(
    `Generated ${todayISO()} from ${searches} searches. **${total} off-board role${total === 1 ? "" : "s"}** match ${withAny.length} available talent. None are on the board yet — review, promote the good ones, and reach out.`,
    "",
    "_Google Jobs is noisy (aggregator names, rough locations). Sanity-check the company before outreach._",
    "",
  );

  for (const { profile: p, query, candidates } of results) {
    if (!candidates.length) continue;
    out.push(
      `## ${p.codename} — ${p.role}`,
      `${p.location.label} · ${p.industries.join(" + ")} · ${candidates.length} role${candidates.length === 1 ? "" : "s"}`,
      `<sub>query: \`${query}\`</sub>`,
      "",
    );
    for (const c of candidates) {
      const loc = c.location && c.location !== "See posting" ? ` · ${c.location}` : "";
      const posted = c.posted_at ? ` · posted ${c.posted_at}` : "";
      const via = c.via ? ` · via ${c.via}` : "";
      out.push(
        `- **${c.company}** — ${c.title}${loc} · ${CAT_LABEL[c.category] || c.category}${posted}${via}  \n  [apply ↗](${c.apply_url})`,
      );
    }
    out.push("");
  }
  if (!total) out.push("_No off-board roles found this run._", "");
  out.push(`_Auto-generated ${todayISO()} by scripts/talent-source.mjs. Rewrites every run._`);

  await writeFile(MD_PATH, out.join("\n") + "\n", "utf8");
  await writeFile(
    JSON_PATH,
    JSON.stringify(
      {
        generatedAt: todayISO(),
        searches,
        talent: results.map((r) => ({
          id: r.profile.id,
          codename: r.profile.codename,
          role: r.profile.role,
          query: r.query,
          candidates: r.candidates,
        })),
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
