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
const OUT_ADTECH = join(ROOT, "docs", "adtech-leads.md");
const ATSES = ["greenhouse", "lever", "ashby", "workable", "teamtailor", "recruitee", "smartrecruiters", "personio"];

// Adtech / marketing-platform companies (ad networks, MMPs, monetisation, DSP/
// SSP). Kept OFF the board and in their own private file — Andre works a
// separate recurring-revenue model with adtech, scaled quietly on the side
// (2026-08-02). Their pure UA roles can still be a small non-advertised
// crossover on the board (same discipline, adjacent vertical).
const ADTECH =
  /justdice|revenuecat|\badjoe\b|moloco|almedia|tatari|rtb ?house|taboola|inmobi|appsflyer|appodeal|airship|adjust|singular|kochava|liftoff|vungle|ironsource|unity ads|digital ?turbine|mistplay|exmox|applovin|smadex|remerge|persona\.?ly|jampp|aarki|bidease|zoomd|mobvista|mintegral|chartboost|fyber|outbrain|criteo|bigabid|kayzen|tapjoy|smaato|pubmatic|magnite|sharethrough|verve/i;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function verifyRetry(ats, slug) {
  let v = await verify(ats, slug).catch(() => null);
  if (v === null) { await sleep(400); v = await verify(ats, slug).catch(() => null); } // transient
  return v;
}
async function probe(company) {
  for (const slug of slugGuesses(company.name)) {
    for (const ats of ATSES) {
      const v = await verifyRetry(ats, slug);
      if (v && v.total > 0)
        return {
          ...company, ats, slug, total: v.total,
          inRemit: v.inRemit.length, inRemitTitles: v.inRemit, sample: v.inRemit[0],
          adtech: ADTECH.test(company.name),
        };
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
    ["aggregator-companies.json", (d) => d.companies || []],
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

  const results = (await mapLimit(companies, 10, probe)).filter(Boolean);
  const studios = results.filter((r) => !r.adtech);
  const adtech = results.filter((r) => r.adtech).sort(bySize);
  const hasRemit = studios.filter((r) => r.inRemit > 0).sort(bySize); // smaller-first, giants last
  const forward = studios.filter((r) => r.inRemit === 0).sort(bySize);

  console.log(`✓ ${results.length} resolve to a supported ATS — ${studios.length} studios/apps, ${adtech.length} adtech (separate file)`);
  console.log(`   board candidates with in-remit roles, smaller first, giants (⌾) last:\n`);
  for (const r of hasRemit)
    console.log(`  ${isGiant(r.name) ? "⌾" : " "} ${r.name} [${r.total} roles]: ${r.ats}/${r.slug} — ${r.inRemit} in-remit (e.g. ${r.sample})`);

  const entry = (r) => ({ ats: r.ats, slug: r.slug, name: r.name, sector: r.sector, boardRoles: r.total, giant: isGiant(r.name) || undefined });
  const md = ["# ATS slug-probe — board candidates (studios/apps, smaller first)", ""];
  md.push(`${companies.length} companies probed. ${results.length} have a supported ATS (${adtech.length} adtech split into adtech-leads.md). Sorted smallest board first; giants flagged.`, "");
  md.push(`## Add now — ${hasRemit.length} with in-remit roles live`, "```json", JSON.stringify(hasRemit.map(entry), null, 2), "```", "");
  md.push(`## Forward coverage — ${forward.length} valid ATS, no in-remit role today`, "```json", JSON.stringify(forward.map(entry), null, 2), "```", "");
  const misses = companies.filter((c) => !results.some((r) => r.name === c.name));
  md.push(`## Manual check — ${misses.length} no ATS found by slug (reverse-engineer / check site)`, "", ...misses.map((c) => `- ${c.name}`));
  await writeFile(OUT_MD, md.join("\n") + "\n", "utf8");

  // Private adtech file (Andre's silent side model). Includes the UA-flavoured
  // roles that could be a small crossover on the board.
  const UA_CROSSOVER = /user acquisition|\bua\b|performance marketing|paid (media|social|acquisition)|media buy|growth marketing/i;
  const amd = ["# Adtech leads — private (silent side model)", ""];
  amd.push(`${adtech.length} adtech / marketing-platform companies with a supported ATS, from mobile-gaming discovery. Kept OFF the public board. Smaller first.`, "");
  for (const r of adtech) {
    amd.push(`## ${r.name} — \`${r.ats}/${r.slug}\` · ${r.total} board roles`);
    const titles = r.inRemitTitles || [];
    const ua = titles.filter((t) => UA_CROSSOVER.test(t));
    if (ua.length) amd.push(`_UA crossover (same discipline, could go on board):_`, ...ua.map((t) => `- ${t}`));
    const other = titles.filter((t) => !UA_CROSSOVER.test(t));
    if (other.length) amd.push(`_Other in-remit:_`, ...other.map((t) => `- ${t}`));
    if (!titles.length) amd.push(`_No in-remit role live now._`);
    amd.push("");
  }
  await writeFile(OUT_ADTECH, amd.join("\n") + "\n", "utf8");

  console.log(`\n✓ studios/apps board candidates → docs/ats-slugprobe.md`);
  console.log(`✓ adtech leads (private) → docs/adtech-leads.md`);
}

main().catch((e) => { console.error(e); process.exit(1); });
