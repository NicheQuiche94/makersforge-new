/**
 * Bulk ATS slug-probe — the fast, effective source-finder.
 *
 * Hits the ATS boards directly with guessed slugs for every discovered company
 * (gamigion-companies.json + talent-sourcing.json + pm·01), in parallel. This
 * beat headless careers-page rendering in practice (it found Epic/2K's
 * Greenhouse boards when rendering didn't) because it skips the careers page
 * entirely. A company with a valid board becomes a source EVEN IF it has no
 * in-remit role today — every mobile-gaming studio is a forward lead, and once
 * it's a source the ingester auto-captures its growth roles whenever they post
 * (Andre 2026-08-02).
 *
 * Emits: sources.json entries (has in-remit now, or forward-coverage), plus a
 * manual-check list of the misses to reverse-engineer by hand.
 * Run: node scripts/ats-slugprobe.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { verify } from "./ats-detect.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_MD = join(ROOT, "docs", "ats-slugprobe.md");
const ATSES = ["greenhouse", "lever", "ashby", "workable", "teamtailor"];

// Smaller studios are the better MakersForge leads (they lack in-house UA teams
// and actually need outside talent). Rank smallest ATS board first, and push
// known giants / big adtech platforms to the bottom (Andre 2026-08-02).
const GIANTS =
  /\b(zynga|miniclip|king|supercell|electronic arts|\bea\b|playtika|scopely|jagex|nexon|netmarble|ubisoft|activision|blizzard|tencent|garena|nintendo|sega|bandai|gameloft|\bglu\b|rovio|playrix|voodoo|moon ?active|dream games|peak|applovin|unity|ironsource|digital turbine|inmobi|appsflyer|adjust|appodeal|airship|amber|keywords studios|aristocrat|light ?& ?wonder|product madness|huuuge|wildlife|tripledot)\b/i;
const isGiant = (n) => GIANTS.test(n);
const bySize = (a, b) => (isGiant(a.name) ? 1 : 0) - (isGiant(b.name) ? 1 : 0) || a.total - b.total;
const LEGAL = /\b(studios?|games?|entertainment|interactive|inc|ltd|llc|ab|corp|co|sp\.? ?z ?o\.? ?o\.?)\b/gi;

function slugGuesses(name) {
  const full = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();
  const hyphen = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").trim().replace(/\s+/g, "-");
  return [...new Set([full, base, hyphen, `${base}games`, full.replace(/games$/, "")])].filter((s) => s.length > 2);
}

async function probe(company) {
  for (const slug of slugGuesses(company.name)) {
    for (const ats of ATSES) {
      const v = await verify(ats, slug).catch(() => null);
      if (v && v.total > 0) return { ...company, ats, slug, total: v.total, inRemit: v.inRemit.length, sample: v.inRemit[0] };
    }
  }
  return null;
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
    }),
  );
  return out;
}

async function loadCompanies() {
  const sources = JSON.parse(await readFile(join(ROOT, "src", "data", "sources.json"), "utf8"));
  const sourced = new Set((Array.isArray(sources) ? sources : sources.sources || []).map((s) => (s.name || "").toLowerCase().trim()));
  const map = new Map();
  const add = (name, sector) => {
    if (!name) return;
    const k = name.toLowerCase().trim();
    if (!sourced.has(k) && !map.has(k)) map.set(k, { name, sector: sector || "games" });
  };
  for (const [file, pick] of [
    ["gamigion-companies.json", (d) => d.companies || []],
    ["talent-sourcing.json", (d) => (d.talent || []).flatMap((t) => (t.candidates || []).map((c) => ({ name: c.company, sector: c.sectorGuess })))],
  ]) {
    try {
      const d = JSON.parse(await readFile(join(ROOT, "src", "data", file), "utf8"));
      for (const c of pick(d)) add(c.name, c.sector);
    } catch { /* absent */ }
  }
  return [...map.values()];
}

async function main() {
  const companies = await loadCompanies();
  console.log(`Slug-probing ${companies.length} companies across ${ATSES.length} ATSes (parallel)…\n`);

  const results = (await mapLimit(companies, 12, probe)).filter(Boolean);
  // Smaller-first, giants last.
  const hasRemit = results.filter((r) => r.inRemit > 0).sort(bySize);
  const forward = results.filter((r) => r.inRemit === 0).sort(bySize);

  console.log(`✓ ${results.length} companies resolve to a supported ATS (${hasRemit.length} with in-remit roles now)`);
  console.log(`   smaller studios first, giants (⌾) last:\n`);
  for (const r of hasRemit)
    console.log(`  ${isGiant(r.name) ? "⌾" : " "} ${r.name} [${r.total} roles]: ${r.ats}/${r.slug} — ${r.inRemit} in-remit (e.g. ${r.sample})`);

  const entry = (r) => ({ ats: r.ats, slug: r.slug, name: r.name, sector: r.sector, boardRoles: r.total, giant: isGiant(r.name) || undefined });
  const md = ["# ATS slug-probe results (smaller studios first)", ""];
  md.push(`${companies.length} companies probed. **${results.length}** resolve to a supported ATS. Sorted smallest ATS board first; giants flagged \`"giant": true\`.`, "");
  md.push(`## Add now — ${hasRemit.length} with in-remit roles live`, "```json", JSON.stringify(hasRemit.map(entry), null, 2), "```", "");
  md.push(`## Forward coverage — ${forward.length} valid ATS, no in-remit role today`, "```json", JSON.stringify(forward.map(entry), null, 2), "```", "");
  const misses = companies.filter((c) => !results.some((r) => r.name === c.name));
  md.push(`## Manual check — ${misses.length} no ATS found by slug (reverse-engineer / check site)`, "", ...misses.map((c) => `- ${c.name}`));
  await writeFile(OUT_MD, md.join("\n") + "\n", "utf8");

  console.log(`\n✓ ${results.length} ATS hits, ${companies.length - results.length} for manual check`);
  console.log(`✓ Full breakdown + paste-ready sources entries → docs/ats-slugprobe.md`);
}

main().catch((e) => { console.error(e); process.exit(1); });
