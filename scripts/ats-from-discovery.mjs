/**
 * Discovery → ATS bridge.
 *
 * Turns talent-discovered companies (from talent-source / source-pm01) into
 * clean board sources: for each company NOT already sourced, find its ATS +
 * slug and verify it has in-remit roles, so the ingester pulls canonical data
 * (real description, apply URL, transparency panel) — never the noisy Google
 * Jobs data. Google Jobs only tells us WHO to ATS-check.
 *
 * Costs zero SerpApi quota — just fetches careers pages.
 * Run: node scripts/ats-from-discovery.mjs
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { probe, verify, SUPPORTED } from "./ats-detect.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Known domains for companies we've surfaced (skips fragile guessing).
const KNOWN = {
  homa: "homagames.com",
  "g5 entertainment ab": "g5e.com",
  "g5 entertainment": "g5e.com",
  wildlife: "wildlifestudios.com",
  "wildlife studios": "wildlifestudios.com",
  yallaplay: "yallaplay.com",
  "reality games polska sp. z o.o": "realitygames.com",
  "yodo1 games": "yodo1.com",
  yodo1: "yodo1.com",
  "tripledot studios": "tripledotstudios.com",
  scopely: "scopely.com",
  "2k": "2k.com",
  "epic games": "epicgames.com",
};

// pm·01's games targets (source-pm01 writes only markdown, so list them here).
const PM01_COMPANIES = [
  { name: "Yodo1 Games", sector: "games" },
  { name: "Tripledot Studios", sector: "games" },
  { name: "Scopely", sector: "games" },
  { name: "2K", sector: "games" },
  { name: "Epic Games", sector: "games" },
];

const LEGAL = /\b(studios?|games?|entertainment|interactive|inc|ltd|llc|ab|corp|co|sp\.? ?z ?o\.? ?o\.?)\b/gi;

function domainGuesses(name) {
  const k = KNOWN[name.toLowerCase().trim()];
  if (k) return [k];
  const full = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();
  return [...new Set([`${full}.com`, `${base}.com`, `${base}games.com`, `${base}.io`, `${base}.games`, `${base}.co`])].filter((d) => d.length > 5);
}

const ATSES = ["greenhouse", "lever", "ashby", "workable", "teamtailor"];

function slugGuesses(name) {
  const full = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();
  const hyphen = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").trim().replace(/\s+/g, "-");
  return [...new Set([full, base, hyphen, `${base}games`])].filter((s) => s.length > 2);
}

/** Hit the ATS boards directly with guessed slugs — catches JS-rendered careers
 *  pages whose ATS embed never appears in the raw HTML. */
async function probeAtsBySlug(name, sector) {
  for (const slug of slugGuesses(name)) {
    for (const ats of ATSES) {
      const v = await verify(ats, slug);
      if (v && v.total > 0) return { name, sector, ats, slug, verify: v, domain: domainGuesses(name)[0] };
    }
  }
  return null;
}

async function probeCompany({ name, sector }) {
  // 1) careers-page detection (reads the ATS embed from HTML)
  for (const domain of domainGuesses(name)) {
    const r = await probe({ name, domain, sector });
    if (r.ats) return r;
  }
  // 2) direct ATS-API probe by guessed slug (JS-rendered fallback)
  const bySlug = await probeAtsBySlug(name, sector);
  if (bySlug) return bySlug;
  return { name, sector, domain: domainGuesses(name)[0], ats: null };
}

async function main() {
  // Companies already on the board — skip them.
  const sources = JSON.parse(await readFile(join(ROOT, "src", "data", "sources.json"), "utf8"));
  const sourced = new Set(
    (Array.isArray(sources) ? sources : sources.sources || []).map((s) =>
      (s.name || "").toLowerCase().trim(),
    ),
  );

  // Discovered companies: talent-sourcing.json (if present) + pm·01 targets.
  const companies = new Map();
  try {
    const disc = JSON.parse(await readFile(join(ROOT, "src", "data", "talent-sourcing.json"), "utf8"));
    for (const t of disc.talent || [])
      for (const c of t.candidates || [])
        if (c.company) companies.set(c.company.toLowerCase(), { name: c.company, sector: c.sectorGuess || "games" });
  } catch {
    /* no talent-sourcing.json yet */
  }
  try {
    const gami = JSON.parse(await readFile(join(ROOT, "src", "data", "gamigion-companies.json"), "utf8"));
    for (const c of gami.companies || [])
      if (c.name) companies.set(c.name.toLowerCase(), { name: c.name, sector: c.sector || "games" });
  } catch {
    /* no gamigion-companies.json yet */
  }
  for (const c of PM01_COMPANIES) companies.set(c.name.toLowerCase(), c);

  const todo = [...companies.values()].filter((c) => !sourced.has(c.name.toLowerCase().trim()));
  console.log(`Checking ${todo.length} discovered companies (skipping ${companies.size - todo.length} already sourced)...\n`);

  const addable = [];
  for (const c of todo) {
    const r = await probeCompany(c);
    if (!r.ats) {
      console.log(`· ${c.name}: no supported ATS found (guessed ${domainGuesses(c.name)[0]})`);
      continue;
    }
    const v = r.verify;
    const supported = SUPPORTED.has(r.ats);
    const tag = supported ? (v ? `${v.total} roles, ${v.inRemit.length} in-remit` : "verify failed") : "(no fetcher yet)";
    console.log(`✓ ${c.name}: ${r.ats}/${r.slug} — ${tag}`);
    if (supported && v && v.inRemit.length) {
      console.log(`     in-remit: ${v.inRemit.slice(0, 3).join(" | ")}`);
      addable.push({ ats: r.ats, slug: r.slug, name: c.name, url: `https://www.${r.domain}`, sector: c.sector });
    }
  }

  console.log(`\n=== ${addable.length} ready to add to sources.json ===`);
  console.log(JSON.stringify(addable, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
