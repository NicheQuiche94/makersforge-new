/**
 * Company radar — every company we've touched, deduped, with provenance tags.
 * A single master list so Andre can see what's on the radar and add what isn't.
 * Writes docs/companies-radar.md (gitignored, private working doc).
 *
 * Run: node scripts/radar.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = (f) => join(ROOT, "src", "data", f);

const LEGAL = /\b(studios?|games?|entertainment|interactive|inc|ltd|llc|ab|gmbh|limited|pte|oy|srl|\bbv\b|\bsa\b|corp|co|sp\.? ?z ?o\.? ?o\.?)\b/gi;
const normKey = (name) =>
  (name || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();

const radar = new Map(); // key -> { display, lanes:Set }
function add(name, lane) {
  const clean = (name || "").trim();
  if (!clean) return;
  const k = normKey(clean);
  if (!k) return;
  if (!radar.has(k)) radar.set(k, { display: clean, lanes: new Set() });
  radar.get(k).lanes.add(lane);
}

async function readJson(f) {
  try { return JSON.parse(await readFile(f, "utf8")); } catch { return null; }
}
// Coerce a file's payload to an array of records, trying common wrapper keys.
function asArray(d, ...keys) {
  if (Array.isArray(d)) return d;
  if (!d || typeof d !== "object") return [];
  for (const k of keys) if (Array.isArray(d[k])) return d[k];
  return Object.values(d); // last resort: object keyed by slug
}
async function readMdHeaders(f, lane) {
  try {
    const t = await readFile(join(ROOT, "docs", f), "utf8");
    for (const m of t.matchAll(/^## (.+?)(?: —| ·|$)/gm)) add(m[1].trim(), lane);
  } catch { /* absent */ }
}

async function main() {
  // Board (highest intent) — sources.json is canonical, prefer its display name.
  const sources = await readJson(D("sources.json"));
  for (const s of (Array.isArray(sources) ? sources : sources?.sources) || []) add(s.name, "board");

  const gami = await readJson(D("gamigion-companies.json"));
  for (const c of gami?.companies || []) add(c.name, "gamigion");

  const talent = await readJson(D("talent-sourcing.json"));
  for (const t of talent?.talent || []) for (const c of t.candidates || []) add(c.company, "talent");
  for (const n of ["Yodo1 Games", "Tripledot Studios", "Scopely", "2K", "Epic Games"]) add(n, "talent");

  const research = await readJson(D("company-research.json"));
  for (const v of Object.values(research || {})) add(v?.developer, "research");

  for (const p of asArray(await readJson(D("play-discover.json")), "developers", "companies")) add(p.developer || p.author || p.name, "play-scan");
  for (const c of asArray(await readJson(D("yc-discover.json")), "companies")) add(c.name, "yc");
  for (const c of asArray(await readJson(D("serpapi-review.json")), "companies")) add(c.name, "serpapi");
  for (const c of asArray(await readJson(D("apollo-contacts.json")), "companies")) add(c.company || c.name, "apollo");

  await readMdHeaders("adtech-leads.md", "adtech");
  await readMdHeaders("sales-bank.md", "sales");

  const all = [...radar.values()].sort((a, b) => a.display.toLowerCase().localeCompare(b.display.toLowerCase()));
  const laneCount = {};
  for (const c of all) for (const l of c.lanes) laneCount[l] = (laneCount[l] || 0) + 1;

  const out = ["# Company radar — all companies on our radar", ""];
  out.push(`**${all.length} unique companies** (deduped across every lane). Lanes: ${Object.entries(laneCount).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l} ${n}`).join(" · ")}.`, "");
  out.push("Tags: `board`=on the job board · `gamigion`/`talent`/`research`/`serpapi`/`play-scan`=discovery · `adtech`=private adtech lane · `sales`=Appbroda bank · `yc`/`apollo`=enriched.", "");
  out.push("| Company | Lanes |", "|---|---|");
  for (const c of all) out.push(`| ${c.display} | ${[...c.lanes].join(", ")} |`);
  await writeFile(join(ROOT, "docs", "companies-radar.md"), out.join("\n") + "\n", "utf8");

  console.log(`✓ ${all.length} unique companies → docs/companies-radar.md`);
  console.log(Object.entries(laneCount).sort((a, b) => b[1] - a[1]).map(([l, n]) => `  ${l}: ${n}`).join("\n"));
}

main().catch((e) => { console.error(e); process.exit(1); });
