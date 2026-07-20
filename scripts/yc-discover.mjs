/**
 * YC startup discovery → leads (Andre 2026-07-20).
 *
 * Every YC company is a seed-stage startup, so this is a pure feed for the
 * ">=50% startups" goal. Pulls from the free, stable yc-oss/api (JSON, no
 * keys), filters to recent-batch mobile-games / consumer-app startups in remit,
 * dedupes vs the board, and (unless --dry-run) pushes them to Folk as "YC
 * signal" leads. Free — no SerpApi.
 *
 *   node --env-file=.env.local scripts/yc-discover.mjs --dry-run   # list only
 *   node --env-file=.env.local scripts/yc-discover.mjs             # + push to Folk
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { listCompanies, createCompanyLead, normName } from "./folk.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "src", "data");
const OUT = join(DATA, "yc-discover.json");
const DRY = process.argv.includes("--dry-run");

// Candidate yc-oss endpoints; whatever resolves is merged + deduped.
const SOURCES = [
  "https://yc-oss.github.io/api/tags/gaming.json",
  "https://yc-oss.github.io/api/tags/consumer.json",
  "https://yc-oss.github.io/api/industries/consumer.json",
];
const MIN_YEAR = 2023; // "newly funded"
// Drop the dev-tools / infra / B2B / fintech / hardware / AI-agent side of YC
// that still gets a Consumer/Gaming tag (YC 2024-26 is AI-startup-dominated).
const OFF_REMIT =
  /developer tools|dev tools|\bsaas\b|b2b|infrastructure|\bapi\b|security|robotics|hardware|semiconductor|biotech|enterprise|devops|no-?code|open source|supply chain|logistics|manufacturing|data engineering|compliance|\bhr\b|recruit|\bsales\b|fintech|\bbank|lending|mortgage|invest|trading|wearable|marketplace|browser|assistant|\bagent|crypto|web3|healthcare|\blegal|insurance|real estate|productivity|coding|\bcode\b|voice (interface|agent)|note-?tak|video (generation|model|creation|production)|generative video|\bfilm|prediction market|betting|physical therapy|creative platform|creator economy/i;
// Must clearly be a consumer game or a consumer-app vertical that runs UA.
const REMIT =
  /gaming|\bgame|dating|fitness|\blanguage|\bphoto|\bvideo|\bmusic|entertainment|social (app|network|media|platform)|creator|streaming/i;

async function j(u) {
  const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`${u} ${r.status}`);
  return r.json();
}
const yr = (b) => { const m = /(\d{4})/.exec(b || ""); return m ? +m[1] : 0; };

async function main() {
  const bySlug = new Map();
  for (const u of SOURCES) {
    try {
      for (const c of await j(u)) bySlug.set(c.slug, c);
    } catch (e) {
      console.warn(`! ${u}: ${e.message}`);
    }
  }
  const all = [...bySlug.values()];

  const remit = all
    .filter((c) => (c.status || "").toLowerCase() === "active")
    .filter((c) => yr(c.batch) >= MIN_YEAR)
    .filter((c) => {
      const blob = `${(c.tags || []).join(" ")} ${c.industry} ${c.subindustry} ${c.one_liner}`;
      return REMIT.test(blob) && !OFF_REMIT.test(blob);
    })
    .sort((a, b) => yr(b.batch) - yr(a.batch));

  const jobs = JSON.parse(await readFile(join(DATA, "jobs.json"), "utf8"));
  const onBoard = new Set(jobs.map((x) => normName(x.company.name)));
  const fresh = remit.filter((c) => !onBoard.has(normName(c.name)));

  console.log(`YC: ${all.length} pulled · ${remit.length} in-remit startups · ${fresh.length} new\n`);
  for (const c of fresh.slice(0, 45))
    console.log(
      `  ${c.name} [${c.batch}] team ${c.team_size}${c.isHiring ? " [hiring]" : ""} · ${(c.all_locations || "").split(";")[0]} · ${(c.one_liner || "").slice(0, 68)}`,
    );

  const out = {
    generated_at: new Date().toISOString().slice(0, 10),
    pulled: all.length,
    in_remit: remit.length,
    new_companies: fresh.length,
    companies: fresh.map((c) => ({
      name: c.name,
      batch: c.batch,
      team_size: c.team_size,
      website: c.website,
      one_liner: c.one_liner,
      tags: c.tags,
      location: (c.all_locations || "").split(";")[0],
      isHiring: c.isHiring,
      sector: /gaming|game/i.test((c.tags || []).join(" ")) ? "games" : "apps",
    })),
  };
  if (!DRY) await writeFile(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");

  const FOLK = process.env.FOLK_API_KEY;
  if (DRY || process.argv.includes("--no-folk")) {
    console.log("\n(dry-run / --no-folk: nothing written to Folk.)");
    return;
  }
  if (!FOLK) {
    console.log("\n(FOLK_API_KEY not set — skipped Folk push.)");
    return;
  }
  const existing = new Set((await listCompanies(FOLK)).map((c) => normName(c.name)));
  let created = 0, existed = 0;
  for (const c of out.companies) {
    if (existing.has(normName(c.name))) { existed++; continue; }
    const nextSteps = `YC ${c.batch}, team ${c.team_size}${c.isHiring ? ", hiring now" : ""}. ${c.one_liner || ""} Early — watch as they scale UA/growth.`;
    try {
      await createCompanyLead(FOLK, { name: c.name, url: c.website, sector: c.sector, channel: "YC signal", nextSteps });
      existing.add(normName(c.name));
      created++;
      console.log(`  → Folk: ${c.name}`);
    } catch (e) {
      console.warn(`  ! Folk ${c.name}: ${e.message}`);
    }
  }
  console.log(`\nFolk: +${created} YC leads · ${existed} already existed`);
}

main().catch((e) => { console.error(e); process.exit(1); });
