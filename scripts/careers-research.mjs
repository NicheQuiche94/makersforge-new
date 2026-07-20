/**
 * Careers-page research from the Play-discovery lead list (Andre 2026-07-20).
 *
 * The top-grossing studios mostly use CUSTOM career sites the ATS probe can't
 * see. So for each lead we run a Google search, find their careers page + any
 * in-remit hiring signal, and bank it in a growing research file
 * (src/data/company-research.json) — a persistent "research memory" of where to
 * find each proven company's growth jobs. Accumulates: already-researched
 * companies are skipped, so successive runs widen coverage within quota.
 *
 *   SERPAPI_KEY=xxx node scripts/careers-research.mjs [--limit=20]
 *
 * Reads src/data/play-discover.json (run play-discover.mjs first). One Google
 * search per company; free tier = 250 searches/mo, so --limit bounds spend.
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchGoogleSearch, categoryFor } from "./serpapi.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");
const LEADS_PATH = join(DATA_DIR, "play-discover.json");
const RESEARCH_PATH = join(DATA_DIR, "company-research.json");

const KEY = process.env.SERPAPI_KEY;
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : 20;

/** From a company's search results, pick the best careers-page URL, whether
 *  it's on the company's own domain, and a real hiring signal. */
function analyse(results, devSlug) {
  // Longest name token (≥4 chars) is the distinctive one for domain matching.
  const strong = devSlug.split("-").filter((t) => t.length >= 4).sort((a, b) => b.length - a.length)[0];
  const ownDomain = (link) => {
    if (!strong) return false;
    try {
      return new URL(link).hostname.replace(/^www\./, "").includes(strong);
    } catch {
      return false;
    }
  };
  const isCareers = (link) => /career|\/job/i.test(link || "");

  const chosen =
    results.find((r) => r.link && ownDomain(r.link) && isCareers(r.link)) ||
    results.find((r) => r.link && ownDomain(r.link)) ||
    results.find((r) => r.link && isCareers(r.link)) ||
    results[0];
  const careers_url = chosen?.link || "";

  return {
    careers_url,
    own_domain: ownDomain(careers_url),
    // Meaningful signal: a result whose TITLE is itself an in-remit role
    // (an actual job posting surfaced), not just the query terms echoing.
    hiring_signal: results.some((r) => categoryFor(r.title || "")),
    top_results: results.slice(0, 3).map((r) => ({ title: r.title, link: r.link })),
  };
}

async function main() {
  if (!KEY) {
    console.error("✗ SERPAPI_KEY not set. Add it to .env.local.");
    process.exit(1);
  }
  if (!existsSync(LEADS_PATH)) {
    console.error(
      "✗ No src/data/play-discover.json. Run:\n  SERPAPI_KEY=xxx node scripts/play-discover.mjs",
    );
    process.exit(1);
  }

  const leads = JSON.parse(await readFile(LEADS_PATH, "utf8"));
  const research = existsSync(RESEARCH_PATH)
    ? JSON.parse(await readFile(RESEARCH_PATH, "utf8"))
    : {};

  // Highest-grossing first, skipping ones already researched.
  const queue = (leads.developers || [])
    .filter((d) => !research[d.slug])
    .slice(0, LIMIT);

  console.log(`${queue.length} companies to research (${Object.keys(research).length} already banked)…\n`);

  let searches = 0;
  for (const d of queue) {
    const q = `${d.developer} careers user acquisition OR growth OR "marketing artist"`;
    let results = [];
    try {
      results = await fetchGoogleSearch(q, { apiKey: KEY });
      searches += 1;
    } catch (err) {
      console.warn(`! ${d.developer}: ${err.message}`);
      continue;
    }
    const a = analyse(results, d.slug);
    research[d.slug] = {
      developer: d.developer,
      sector: d.sector,
      grossing_score: d.score,
      regions: d.regions,
      careers_url: a.careers_url,
      own_domain: a.own_domain,
      hiring_signal: a.hiring_signal,
      top_results: a.top_results,
      searched_at: leads.generated_at,
    };
    console.log(
      `${a.own_domain ? "✓" : "·"} ${d.developer} (${d.sector})${a.hiring_signal ? " [live role]" : ""} → ${a.careers_url || "no page"}`,
    );
  }

  await writeFile(RESEARCH_PATH, JSON.stringify(research, null, 2) + "\n", "utf8");
  const banked = Object.values(research);
  const own = banked.filter((r) => r.own_domain).length;
  const hiring = banked.filter((r) => r.hiring_signal).length;
  console.log(
    `\n✓ ${searches} searches · ${banked.length} banked · ${own} on own domain · ${hiring} with a live in-remit role → src/data/company-research.json`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
