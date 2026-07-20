/**
 * Play Store company discovery → REVIEW LIST (Andre 2026-07-20).
 *
 * Company-first sourcing: pull Google Play top-grossing + top-free charts for
 * Games (engine=google_play_games) and the remit's consumer-app categories
 * (engine=google_play + apps_category) across UK/EMEA, extract the DEVELOPERS
 * (proven revenue = real UA/growth budget = likely hiring), then cross-check
 * each against the live board and, for free, against the ATS APIs to see if
 * they have a careers page we can pull.
 *
 * Output: src/data/play-discover.json — a scored list to vet. Approved devs get
 * promoted into sources.json (board) and are prime Folk leads. No auto-publish.
 *
 *   SERPAPI_KEY=xxx node scripts/play-discover.mjs            # pull + write
 *   SERPAPI_KEY=xxx node scripts/play-discover.mjs --dry-run  # pull + print
 *
 * Chart searches spend SerpApi credits (regions×charts×sources); ATS probes are
 * free. Free tier = 250 searches/mo.
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

// EMEA/UK first (Andre 2026-07-20). Trim/extend freely.
const REGIONS = [
  { gl: "gb", name: "UK" },
  { gl: "de", name: "Germany" },
  { gl: "fr", name: "France" },
];
const CHARTS = ["topgrossing", "topselling_free"];
// Games use the dedicated games engine; apps use google_play + a category.
const SOURCES = [
  { engine: "google_play_games", sector: "games", label: "Games" },
  { engine: "google_play", store: "apps", apps_category: "FINANCE", sector: "apps", label: "Finance" },
  { engine: "google_play", store: "apps", apps_category: "HEALTH_AND_FITNESS", sector: "apps", label: "Health" },
  { engine: "google_play", store: "apps", apps_category: "PHOTOGRAPHY", sector: "apps", label: "Photo" },
  { engine: "google_play", store: "apps", apps_category: "EDUCATION", sector: "apps", label: "Education" },
];
const MAX_PROBE = 90; // bound the (free) ATS probing to the strongest devs
const PROBE_CONCURRENCY = 12;

const ATS_SUFFIX =
  /\b(games?|studios?|studio|ltd|limited|inc|gmbh|ab|oy|bv|pte|interactive|mobile|entertainment|technolog(?:y|ies)|labs?|apps?|co)\b/gi;

// Legal suffixes only — strip these before comparing a Play developer to a
// board company so "Strava Inc." matches "Strava" (Andre 2026-07-20).
const LEGAL_SUFFIX = /\b(inc|ltd|limited|llc|gmbh|corp|corporation|pte|ab|oy|bv|sa|co)\b\.?/gi;
function normName(n) {
  return slugify(String(n).replace(LEGAL_SUFFIX, " "));
}

function slugVariants(name) {
  const base = slugify(name);
  const stripped = slugify(name.replace(ATS_SUFFIX, " "));
  return [...new Set([base, stripped].filter(Boolean))];
}

async function probeOne(ats, slug, url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data) return null;
    const count = Array.isArray(data.jobs)
      ? data.jobs.length
      : Array.isArray(data)
        ? data.length
        : (data.total ?? data.jobsCount ?? 0);
    return { ats, slug, count: count || "board found" };
  } catch {
    return null;
  }
}

/** Race every ATS endpoint for every slug variant; return the first hit. Free. */
async function probeAts(name) {
  const jobs = [];
  for (const slug of slugVariants(name)) {
    jobs.push(probeOne("greenhouse", slug, `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`));
    jobs.push(probeOne("lever", slug, `https://api.lever.co/v0/postings/${slug}?mode=json&limit=1`));
    jobs.push(probeOne("ashby", slug, `https://api.ashbyhq.com/posting-api/job-board/${slug}`));
    jobs.push(probeOne("workable", slug, `https://apply.workable.com/api/v1/widget/accounts/${slug}`));
  }
  const results = await Promise.all(jobs);
  return results.find(Boolean) || null;
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

async function main() {
  if (!KEY) {
    console.error("✗ SERPAPI_KEY not set. Add it to .env.local.");
    process.exit(1);
  }

  const jobs = JSON.parse(await readFile(JOBS_PATH, "utf8"));
  const sources = JSON.parse(await readFile(SOURCES_PATH, "utf8"));
  const onBoard = new Set([
    ...jobs.map((j) => normName(j.company.name)),
    ...sources.map((s) => normName(s.name)),
  ]);

  const devs = new Map();
  let searches = 0;
  for (const { gl, name: region } of REGIONS) {
    for (const chart of CHARTS) {
      for (const src of SOURCES) {
        let apps = [];
        try {
          apps = await fetchGooglePlayChart({ ...src, chart, gl, apiKey: KEY });
          searches += 1;
        } catch (err) {
          console.warn(`! ${region}/${chart}/${src.label}: ${err.message}`);
          continue;
        }
        for (const app of apps) {
          const p = normalizePlayApp(app, src.sector);
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
          if (p.downloads && String(p.downloads).length > d.topDownloads.length)
            d.topDownloads = String(p.downloads);
          devs.set(p.developerSlug, d);
        }
        console.log(`· ${region}/${chart}/${src.label}: ${apps.length} apps`);
      }
    }
  }

  const ranked = [...devs.values()]
    .filter((d) => !onBoard.has(normName(d.developer)))
    .map((d) => ({ ...d, score: d.grossingHits * 3 + d.freeHits }))
    .sort((a, b) => b.score - a.score);

  const toProbe = ranked.slice(0, MAX_PROBE);
  console.log(
    `\n${devs.size} developers · ${ranked.length} new · probing top ${toProbe.length} for ATS (parallel)…`,
  );

  const probed = await mapLimit(toProbe, PROBE_CONCURRENCY, async (d) => {
    const ats = await probeAts(d.developer);
    return {
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
    };
  });

  const withAts = probed.filter((r) => r.ats);
  probed.sort(
    (a, b) => Number(Boolean(b.ats)) - Number(Boolean(a.ats)) || b.score - a.score,
  );

  const out = {
    generated_at: new Date().toISOString().slice(0, 10),
    searches_used: searches,
    regions: REGIONS.map((r) => r.name),
    developers_found: devs.size,
    new_developers: ranked.length,
    with_ats: withAts.length,
    developers: probed,
  };

  console.log(
    `\nSummary: ${searches} searches · ${devs.size} devs · ${ranked.length} new · ${withAts.length} ATS-ready`,
  );
  console.log("\nATS-ready developers (pull-ready):");
  for (const r of withAts.slice(0, 40))
    console.log(`  · ${r.developer} — ${r.ats.ats}/${r.ats.slug} (${r.sector}, score ${r.score})`);

  if (DRY_RUN) {
    console.log("\n--dry-run: file not written.");
    return;
  }
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`\n✓ Wrote → src/data/play-discover.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
