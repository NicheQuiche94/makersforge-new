/**
 * Play Store company discovery → REVIEW LIST (Andre 2026-07-20).
 *
 * Company-first sourcing: pull Google Play top-grossing + top-free charts for
 * Games and the remit's consumer-app categories across UK/EMEA, extract the
 * DEVELOPERS (proven revenue = real UA/growth budget = likely hiring), then
 * cross-check each against the live board and, for free, against the ATS APIs
 * to see if they have a careers page we can pull.
 *
 * Output: src/data/play-discover.json — a scored list for you to vet. Approved
 * developers get promoted into sources.json (board) and are prime Folk leads.
 * Nothing auto-publishes.
 *
 *   SERPAPI_KEY=xxx node scripts/play-discover.mjs            # pull + write
 *   SERPAPI_KEY=xxx node scripts/play-discover.mjs --dry-run  # pull + print
 *
 * Chart searches use SerpApi credits (regions×charts×categories). ATS probes
 * are free (direct ATS API calls). Free tier = 250 searches/mo.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchGooglePlayChart, normalizePlayApp, slugify } from "./serpapi.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");
const JOBS_PATH = join(DATA_DIR, "jobs.json");
const SOURCES_PATH = join(DATA_DIR, "sources.json");
const OUT_PATH = join(DATA_DIR, "play-discover.json");

const DRY_RUN = process.argv.includes("--dry-run");
const KEY = process.env.SERPAPI_KEY;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

// EMEA/UK first to test (Andre 2026-07-20). Trim/extend freely.
const REGIONS = [
  { gl: "gb", name: "UK" },
  { gl: "de", name: "Germany" },
  { gl: "fr", name: "France" },
];
const CHARTS = ["topgrossing", "topselling_free"];
// Games + the consumer-app categories that match our proven remit.
const CATEGORIES = [
  { id: "GAME", sector: "games" },
  { id: "FINANCE", sector: "apps" },
  { id: "HEALTH_AND_FITNESS", sector: "apps" },
  { id: "PHOTOGRAPHY", sector: "apps" },
  { id: "EDUCATION", sector: "apps" },
];
// Bound the free ATS probing to the strongest candidates.
const MAX_PROBE = 80;

const ATS_SUFFIX = /\b(games?|studios?|studio|ltd|limited|inc|gmbh|ab|oy|bv|interactive|mobile|entertainment|technolog(?:y|ies)|labs?|apps?)\b/gi;

function slugVariants(name) {
  const base = slugify(name);
  const stripped = slugify(name.replace(ATS_SUFFIX, " "));
  return [...new Set([base, stripped].filter(Boolean))];
}

/** Probe the public ATS APIs for a careers board under a guessed slug. Free. */
async function probeAts(name) {
  for (const slug of slugVariants(name)) {
    const probes = [
      ["greenhouse", `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`],
      ["lever", `https://api.lever.co/v0/postings/${slug}?mode=json&limit=1`],
      ["ashby", `https://api.ashbyhq.com/posting-api/job-board/${slug}`],
      ["workable", `https://apply.workable.com/api/v1/widget/accounts/${slug}`],
    ];
    for (const [ats, url] of probes) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": UA },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) continue;
        const data = await res.json().catch(() => null);
        if (!data) continue;
        const count = Array.isArray(data.jobs)
          ? data.jobs.length
          : Array.isArray(data)
            ? data.length
            : (data.total ?? data.jobsCount ?? 0);
        return { ats, slug, count: count || "board found" };
      } catch {
        /* timeout / not found → try next */
      }
    }
  }
  return null;
}

async function main() {
  if (!KEY) {
    console.error(
      "✗ SERPAPI_KEY not set. Add it to .env.local, then:\n" +
        "  SERPAPI_KEY=xxx node scripts/play-discover.mjs --dry-run",
    );
    process.exit(1);
  }

  const jobs = JSON.parse(await readFile(JOBS_PATH, "utf8"));
  const sources = JSON.parse(await readFile(SOURCES_PATH, "utf8"));
  const onBoard = new Set([
    ...jobs.map((j) => slugify(j.company.name)),
    ...sources.map((s) => slugify(s.name)),
  ]);

  // Aggregate developers across every chart page.
  const devs = new Map();
  let searches = 0;
  for (const { gl, name: region } of REGIONS) {
    for (const chart of CHARTS) {
      for (const { id: category, sector } of CATEGORIES) {
        let apps = [];
        try {
          apps = await fetchGooglePlayChart({ chart, category, gl, apiKey: KEY });
          searches += 1;
        } catch (err) {
          console.warn(`! ${region}/${chart}/${category}: ${err.message}`);
          continue;
        }
        for (const app of apps) {
          const p = normalizePlayApp(app, sector);
          if (!p) continue;
          const d =
            devs.get(p.developerSlug) ||
            {
              developer: p.developer,
              slug: p.developerSlug,
              sector: p.sector,
              apps: new Set(),
              regions: new Set(),
              grossingHits: 0,
              freeHits: 0,
              topDownloads: "",
            };
          d.apps.add(p.app);
          d.regions.add(region);
          if (chart === "topgrossing") d.grossingHits += 1;
          else d.freeHits += 1;
          if (p.downloads && p.downloads.length > d.topDownloads.length)
            d.topDownloads = p.downloads;
          devs.set(p.developerSlug, d);
        }
        console.log(`· ${region}/${chart}/${category}: ${apps.length} apps`);
      }
    }
  }

  // Score, drop on-board, keep the strongest, probe ATS.
  const ranked = [...devs.values()]
    .filter((d) => !onBoard.has(d.slug))
    .map((d) => ({ ...d, score: d.grossingHits * 3 + d.freeHits }))
    .sort((a, b) => b.score - a.score);

  const toProbe = ranked.slice(0, MAX_PROBE);
  console.log(
    `\n${devs.size} developers found · ${ranked.length} new (not on board) · probing top ${toProbe.length} for ATS…`,
  );

  const results = [];
  for (const d of toProbe) {
    const ats = await probeAts(d.developer);
    results.push({
      developer: d.developer,
      slug: d.slug,
      sector: d.sector,
      score: d.score,
      grossing: d.grossingHits,
      free: d.freeHits,
      regions: [...d.regions],
      topDownloads: d.topDownloads,
      apps: [...d.apps].slice(0, 4),
      ats: ats || null,
    });
  }

  const withAts = results.filter((r) => r.ats);
  // ATS-found first (easiest to action), then by score.
  results.sort(
    (a, b) => Number(Boolean(b.ats)) - Number(Boolean(a.ats)) || b.score - a.score,
  );

  const out = {
    generated_at: new Date().toISOString().slice(0, 10),
    searches_used: searches,
    regions: REGIONS.map((r) => r.name),
    developers_found: devs.size,
    new_developers: ranked.length,
    with_ats: withAts.length,
    developers: results,
  };

  console.log(
    `\nSummary: ${searches} searches · ${devs.size} devs · ${ranked.length} new · ${withAts.length} have a detectable ATS (pull-ready)`,
  );
  if (DRY_RUN) {
    console.log("\n--dry-run: file not written. ATS-ready developers:");
    for (const r of withAts.slice(0, 30))
      console.log(`  · ${r.developer} — ${r.ats.ats}/${r.ats.slug} (${r.sector}, score ${r.score})`);
    return;
  }
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`\n✓ Wrote → src/data/play-discover.json`);
  console.log("Review, then I promote the good ones into sources.json + Folk.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
