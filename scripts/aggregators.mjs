/**
 * Aggregator monitor — discovery across games/mobile job aggregators.
 *
 * Aggregators tell us WHO is hiring for growth; we then find the role natively
 * (ATS) to ingest clean (the discover-noisy / ingest-clean split). This pulls
 * the in-remit slice from each aggregator, keeps new mobile-gaming COMPANIES for
 * the ATS pipeline (ats-slugprobe.mjs / ats-from-discovery.mjs), and writes the
 * in-remit roles for monitoring/outreach. Never republishes aggregator rows.
 *
 * Adapters:
 *   - games-jobs-direct : static HTML, /marketing-jobs paginated, company in URL.
 *   - hitmarker         : JS-rendered — TODO headless (like Gamigion).
 *   - gamigion          : headless, see gamigion-discover.mjs.
 *
 * Run: node scripts/aggregators.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { categoryFor } from "./serpapi.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = join(ROOT, "src", "data", "aggregator-companies.json");
const OUT_MD = join(ROOT, "docs", "aggregator-roles.md");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

// Recruitment agencies post on games boards on behalf of clients — not the
// employer, so drop them (like aggregators).
const RECRUITER =
  /\b(recruit(ment|er|ing)?|staffing|headhunt|talent (partners|solutions|acquisition)|search (limited|ltd|partners|associates)|skillsearch|amiqus|aardvark swift|opmjobs|consultanc|resourcing)\b/i;

const deslug = (s) =>
  (s || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bGmbh\b/g, "GmbH")
    .replace(/\bLlc\b/g, "LLC")
    .replace(/\bInc\b/g, "Inc")
    .trim();

async function getText(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) return null;
  return r.text();
}

/* ---- adapter: Games Jobs Direct (static, /marketing-jobs) ---- */
async function gamesJobsDirect() {
  const roles = [];
  const seen = new Set();
  for (let page = 1; page <= 20; page++) {
    const html = await getText(`https://www.gamesjobsdirect.com/marketing-jobs?page=${page}`);
    if (!html) break;
    const links = [...html.matchAll(/href="\/job\/([^/"]+)\/([^/"]+)\/(\d+)"/g)];
    let fresh = 0;
    for (const m of links) {
      const id = m[3];
      if (seen.has(id)) continue;
      seen.add(id);
      fresh++;
      roles.push({
        source: "games-jobs-direct",
        company: deslug(m[1]),
        title: deslug(m[2]),
        url: `https://www.gamesjobsdirect.com/job/${m[1]}/${m[2]}/${id}`,
        sector: "games",
      });
    }
    if (fresh === 0) break; // no new roles → end of pagination
  }
  return roles;
}

const ADAPTERS = [{ name: "games-jobs-direct", run: gamesJobsDirect }];

async function main() {
  const sources = JSON.parse(await readFile(join(ROOT, "src", "data", "sources.json"), "utf8"));
  const sourced = new Set(
    (Array.isArray(sources) ? sources : sources.sources || []).map((s) => (s.name || "").toLowerCase().trim()),
  );

  let all = [];
  for (const a of ADAPTERS) {
    try {
      const r = await a.run();
      console.log(`  ${a.name}: ${r.length} roles`);
      all = all.concat(r);
    } catch (e) {
      console.error(`  ! ${a.name}: ${e.message}`);
    }
  }

  const inRemit = all.filter((r) => categoryFor(r.title));
  const companies = new Map();
  for (const r of inRemit) {
    const key = r.company.toLowerCase().trim();
    if (sourced.has(key)) continue; // already a board source
    if (RECRUITER.test(r.company)) continue; // agency, not the employer
    if (!companies.has(key)) companies.set(key, { name: r.company, sector: r.sector, roles: [] });
    companies.get(key).roles.push(r);
  }
  const list = [...companies.values()].sort((a, b) => b.roles.length - a.roles.length);
  console.log(`\n${all.length} roles pulled, ${inRemit.length} in-remit, ${list.length} new companies (not sourced)`);

  await writeFile(
    OUT_JSON,
    JSON.stringify({ generatedAt: Date.now(), companies: list.map((c) => ({ name: c.name, sector: c.sector })) }, null, 2) + "\n",
    "utf8",
  );

  const md = ["# Aggregator monitor — in-remit roles + new companies", ""];
  md.push(`${inRemit.length} in-remit roles across aggregators; ${list.length} companies not already on the board. Feed companies into ats-slugprobe.mjs to add the ones with a supported ATS.`, "");
  for (const c of list) {
    md.push(`- **${c.name}** — ${c.roles.length} in-remit role${c.roles.length === 1 ? "" : "s"}`);
    for (const r of c.roles.slice(0, 4)) md.push(`  - ${r.title}  \n    [role ↗](${r.url})`);
  }
  await writeFile(OUT_MD, md.join("\n") + "\n", "utf8");

  console.log(`✓ ${OUT_JSON.replace(ROOT, ".")}`);
  console.log(`✓ ${OUT_MD.replace(ROOT, ".")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
