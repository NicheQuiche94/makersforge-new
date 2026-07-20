/**
 * SerpApi Google Jobs pull → REVIEW QUEUE (Andre 2026-07-20).
 *
 * Runs a set of remit-targeted Google Jobs searches, maps + remit-filters the
 * results, dedupes against the live board, groups by company, and writes
 * src/data/serpapi-review.json for a human to vet. Nothing here touches the
 * live jobs.json — Google Jobs is an open search, so new companies must be
 * eyeballed for remit before they're promoted into sources.json.
 *
 *   SERPAPI_KEY=xxx node scripts/serpapi-pull.mjs            # pull + write review
 *   SERPAPI_KEY=xxx node scripts/serpapi-pull.mjs --dry-run  # pull + print only
 *
 * Free SerpApi tier = 100 searches/mo; this uses one per query (~8/run).
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchGoogleJobs, mapResult, slugify } from "./serpapi.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");
const JOBS_PATH = join(DATA_DIR, "jobs.json");
const REVIEW_PATH = join(DATA_DIR, "serpapi-review.json");

const DRY_RUN = process.argv.includes("--dry-run");
const KEY = process.env.SERPAPI_KEY;

// Remit-targeted searches. `sector` is the guess used for grouping; the human
// review confirms whether the company actually fits. Add locations by
// duplicating a row with `location: "United Kingdom"` etc.
const QUERIES = [
  { q: "user acquisition manager mobile games", sector: "games" },
  { q: "growth marketing manager mobile game studio", sector: "games" },
  { q: "marketing artist mobile game", sector: "games" },
  { q: "playable ads creative mobile games", sector: "games" },
  { q: "user acquisition manager mobile app", sector: "apps" },
  { q: "performance marketing manager consumer app", sector: "apps" },
  { q: "ASO manager mobile app", sector: "apps" },
  { q: "paid social creative strategist app", sector: "apps" },
];

function normTitle(t) {
  return slugify(t).replace(/-/g, " ").trim();
}

async function main() {
  if (!KEY) {
    console.error(
      "✗ SERPAPI_KEY not set. Get a key at serpapi.com, then:\n" +
        "  SERPAPI_KEY=xxx node scripts/serpapi-pull.mjs --dry-run",
    );
    process.exit(1);
  }

  // Company slugs already on the board (by name, "vc-" prefix stripped) so we
  // can flag which candidates are NEW companies vs. more roles at vetted ones.
  const jobs = JSON.parse(await readFile(JOBS_PATH, "utf8"));
  const onBoard = new Set(jobs.map((j) => slugify(j.company.name)));

  const seen = new Set();
  const byCompany = new Map();
  let searches = 0;
  let rawTotal = 0;
  let kept = 0;

  for (const { q, sector, location } of QUERIES) {
    let results = [];
    try {
      results = await fetchGoogleJobs(q, { apiKey: KEY, location });
      searches += 1;
    } catch (err) {
      console.warn(`! query "${q}": ${err.message}`);
      continue;
    }
    rawTotal += results.length;

    for (const r of results) {
      const cand = mapResult(r, sector);
      if (!cand) continue;
      const key = `${cand.companySlug}::${normTitle(cand.title)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const entry =
        byCompany.get(cand.companySlug) ||
        {
          name: cand.company,
          slug: cand.companySlug,
          url: cand.company_url || "",
          onBoard: onBoard.has(cand.companySlug),
          sectorGuess: cand.sectorGuess,
          roles: [],
        };
      entry.roles.push({
        title: cand.title,
        category: cand.category,
        location: cand.location,
        remote: cand.remote,
        employment_type: cand.employment_type,
        posted_at: cand.posted_at,
        via: cand.via,
        apply_url: cand.apply_url,
        blurb: cand.blurb,
        description_md: cand.description_md,
      });
      byCompany.set(cand.companySlug, entry);
      kept += 1;
    }
    console.log(`· "${q}": ${results.length} results → ${kept} kept so far`);
  }

  const companies = [...byCompany.values()].sort(
    (a, b) => Number(a.onBoard) - Number(b.onBoard) || b.roles.length - a.roles.length,
  );
  const newCompanies = companies.filter((c) => !c.onBoard);

  const review = {
    generated_at: new Date().toISOString().slice(0, 10),
    searches_used: searches,
    raw_results: rawTotal,
    in_remit_roles: kept,
    new_companies: newCompanies.length,
    companies,
  };

  console.log(
    `\nSummary: ${searches} searches · ${rawTotal} raw · ${kept} in-remit roles · ` +
      `${newCompanies.length} NEW companies to review (${companies.length - newCompanies.length} already on board)`,
  );

  if (DRY_RUN) {
    console.log("\n--dry-run: review file not written. New companies:");
    for (const c of newCompanies)
      console.log(`  · ${c.name} (${c.sectorGuess}) — ${c.roles.length} role(s)`);
    return;
  }

  await writeFile(REVIEW_PATH, JSON.stringify(review, null, 2) + "\n", "utf8");
  console.log(`\n✓ Wrote review queue → src/data/serpapi-review.json`);
  console.log("Review new_companies for remit, then promote the good ones into sources.json.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
