/**
 * Folk RADAR sync — get every qualified company we track into the CRM so sales
 * can work the full pipeline, not just ATS-resolved leads (Andre 2026-08-05).
 *
 * Universe = every radar lane EXCEPT the raw Google-Play developer scrape
 * (play-scan), which is noise. That leaves the board, Gamigion-discovered games
 * studios, careers research, SerpApi, Apollo, YC and talent-signal companies.
 *
 * Each company is pushed to "Companies MF" with:
 *   - Channel  = its primary source lane (so sales can filter by provenance)
 *   - Next Steps = a HIRING NOW flag (live in-remit role on the board) or a
 *     "radar lead, nurture" note listing every lane it came from.
 *
 * Deduped against Folk by BOTH normalisations (strip-non-alphanumeric AND the
 * aggressive legal-suffix strip) so we never create a near-duplicate of a
 * company already in the CRM. Existing companies that are hiring now get their
 * flag refreshed; other existing records are left untouched.
 *
 * DRY RUN by default — pass --commit to actually write. Throttled ~150ms/write.
 * Run: node --env-file=.env.local scripts/folk-sync-radar.mjs [--commit]
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { folk, listCompanies, createCompanyLead, normName, G_COMPANIES } from "./folk.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = (f) => join(ROOT, "src", "data", f);
const COMMIT = process.argv.includes("--commit");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Aggressive key: strips accents + legal/industry suffixes so "Huuuge Games"
// and "Huuuge" collapse to one. Used alongside normName for dedupe.
const LEGAL = /\b(studios?|games?|entertainment|interactive|inc|ltd|llc|ab|gmbh|limited|pte|oy|srl|\bbv\b|\bsa\b|corp|co|sp\.? ?z ?o\.? ?o\.?)\b/gi;
const normKey = (s) =>
  (s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();

const readJson = async (f) => { try { return JSON.parse(await readFile(D(f), "utf8")); } catch { return null; } };
const asArray = (d, ...keys) => {
  if (Array.isArray(d)) return d;
  if (!d || typeof d !== "object") return [];
  for (const k of keys) if (Array.isArray(d[k])) return d[k];
  return Object.values(d);
};

// Lane -> CRM Channel label + intent rank (lower = higher intent, wins as primary).
const LANE = {
  board: { channel: "Job board", rank: 0 },
  research: { channel: "Careers research", rank: 1 },
  serpapi: { channel: "SerpApi discovery", rank: 2 },
  apollo: { channel: "Apollo", rank: 3 },
  yc: { channel: "YC discovery", rank: 4 },
  gamigion: { channel: "Gamigion discovery", rank: 5 },
  talent: { channel: "Talent signal", rank: 6 },
};

async function buildUniverse() {
  const uni = new Map(); // key -> { display, lanes:Set, url, sector }
  const add = (name, lane, { url, sector } = {}) => {
    const clean = (name || "").trim();
    const k = normKey(clean);
    if (!k) return;
    if (!uni.has(k)) uni.set(k, { display: clean, lanes: new Set(), url: null, sector: null });
    const rec = uni.get(k);
    rec.lanes.add(lane);
    if (!rec.url && url) rec.url = url;
    if (!rec.sector && sector) rec.sector = sector;
  };

  const sources = await readJson("sources.json");
  for (const s of (Array.isArray(sources) ? sources : sources?.sources) || [])
    add(s.name, "board", { url: s.url, sector: s.sector });

  for (const c of (await readJson("gamigion-companies.json"))?.companies || [])
    add(c.name, "gamigion", { url: c.url || c.website || c.careers, sector: c.sector || "games" });

  for (const v of Object.values((await readJson("company-research.json")) || {}))
    add(v?.developer, "research", { url: v?.website });

  for (const c of asArray(await readJson("yc-discover.json"), "companies")) add(c.name, "yc", { url: c.url });
  for (const c of asArray(await readJson("serpapi-review.json"), "companies")) add(c.name, "serpapi");
  for (const c of asArray(await readJson("apollo-contacts.json"), "companies")) add(c.company || c.name, "apollo");
  const talent = await readJson("talent-sourcing.json");
  for (const t of talent?.talent || []) for (const c of t.candidates || []) add(c.company, "talent", { url: c.companyUrl });

  return uni;
}

// jobs.json -> normKey -> { count, sample title } for companies hiring right now.
async function buildHiring() {
  const jobs = await readJson("jobs.json");
  const arr = Array.isArray(jobs) ? jobs : jobs?.jobs || [];
  const map = new Map();
  for (const j of arr) {
    const name = j.company?.name || j.company || "";
    const k = normKey(name);
    if (!k) continue;
    const cur = map.get(k) || { count: 0, sample: j.title };
    cur.count += 1;
    map.set(k, cur);
  }
  return map;
}

function primaryLane(lanes) {
  return [...lanes].sort((a, b) => (LANE[a]?.rank ?? 9) - (LANE[b]?.rank ?? 9))[0];
}
function noteFor(rec, hit) {
  const laneList = [...rec.lanes].join(", ");
  if (hit) {
    return `⚡ HIRING NOW — ${hit.count} live role${hit.count === 1 ? "" : "s"}${hit.sample ? ` (e.g. ${hit.sample})` : ""}. Reach out now. [${laneList}]`;
  }
  return `Radar lead — mobile games/apps studio, new-business target. Will hire growth eventually; nurture and pitch. [${laneList}]`;
}
const industryFor = (rec) => (rec.sector === "apps" ? "Consumer apps" : "Mobile games");

async function main() {
  const key = process.env.FOLK_API_KEY;
  if (!key) { console.error("Missing FOLK_API_KEY. Run with: node --env-file=.env.local scripts/folk-sync-radar.mjs [--commit]"); process.exit(1); }

  const uni = await buildUniverse();
  const hiring = await buildHiring();
  console.log(`Qualified universe: ${uni.size} companies (play-scan excluded). ${hiring.size} hiring now on the board.`);
  console.log(COMMIT ? "COMMITTING to Folk.\n" : "DRY RUN — pass --commit to write.\n");

  const folkCos = await listCompanies(key);
  const byNormName = new Map(), byNormKey = new Map();
  for (const c of folkCos) {
    byNormName.set(normName(c.name), c);
    byNormKey.set(normKey(c.name), c);
  }
  const present = (name) => byNormName.get(normName(name)) || byNormKey.get(normKey(name));

  let created = 0, refreshed = 0, skipped = 0, failed = 0, createdHiring = 0;
  const laneCreated = {};

  for (const [k, rec] of uni) {
    const hit = hiring.get(k);
    const existing = present(rec.display);
    const lane = primaryLane(rec.lanes);
    try {
      if (existing) {
        // Only touch existing records if they're hiring now (refresh the flag).
        if (hit) {
          if (COMMIT) await folk(`/companies/${existing.id}`, "PATCH", { customFieldValues: { [G_COMPANIES]: { "Next Steps": noteFor(rec, hit) } } }, key);
          refreshed++;
          if (COMMIT) await sleep(150);
        } else {
          skipped++;
        }
      } else {
        if (COMMIT) await createCompanyLead(key, {
          name: rec.display, url: rec.url, sector: rec.sector,
          channel: LANE[lane]?.channel || "Radar", nextSteps: noteFor(rec, hit), industry: industryFor(rec),
        });
        created++;
        laneCreated[lane] = (laneCreated[lane] || 0) + 1;
        if (hit) createdHiring++;
        if (created % 25 === 0) console.log(`  …${created} created so far`);
        if (COMMIT) await sleep(150);
      }
    } catch (e) {
      failed++;
      console.log(`✗ ${rec.display}: ${String(e.message).slice(0, 90)}`);
    }
  }

  console.log(`\n${COMMIT ? "DONE" : "WOULD"}: create ${created} new (${createdHiring} hiring now) · refresh ${refreshed} existing hiring · skip ${skipped} already-present${failed ? ` · ${failed} failed` : ""}.`);
  console.log("New by lane:", Object.entries(laneCreated).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${LANE[l]?.channel || l} ${n}`).join(" · ") || "—");
  console.log(`Folk before: ${folkCos.length} → after (est): ${folkCos.length + created}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
