/**
 * Headless ATS detector — the JS-render unlock.
 *
 * Raw-fetch ATS detection (ats-from-discovery.mjs) misses studios that render
 * their careers page with JavaScript (Yodo1, Wildlife, …). This renders the
 * page with Playwright and watches the network: whatever the careers page loads
 * its jobs from — greenhouse / lever / ashby / workable / teamtailor / recruitee
 * (and Workday / SmartRecruiters, reported but not yet ingestable) — shows up as
 * a request, and we pull the slug straight out of the URL. Then verify() checks
 * it has in-remit roles, and we emit ready sources.json entries.
 *
 * Reads the same discovered companies as the bridge (talent-sourcing.json +
 * gamigion-companies.json + pm·01), skips already-sourced ones.
 * Run: node scripts/headless-ats.mjs
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { verify, SUPPORTED } from "./ats-detect.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const KNOWN = {
  homa: "homagames.com", "g5 entertainment ab": "g5e.com", wildlife: "wildlifestudios.com",
  "wildlife studios": "wildlifestudios.com", yallaplay: "yallaplay.com",
  "reality games polska sp. z o.o": "realitygames.com", "yodo1 games": "yodo1.com", yodo1: "yodo1.com",
  "tripledot studios": "tripledotstudios.com", scopely: "scopely.com", "2k": "2k.com",
  "epic games": "epicgames.com", "million victories": "millionvictories.com", ankama: "ankama.com",
};
const PM01 = [
  { name: "Yodo1 Games", sector: "games" }, { name: "Tripledot Studios", sector: "games" },
  { name: "Scopely", sector: "games" }, { name: "2K", sector: "games" }, { name: "Epic Games", sector: "games" },
];
const LEGAL = /\b(studios?|games?|entertainment|interactive|inc|ltd|llc|ab|corp|co|sp\.? ?z ?o\.? ?o\.?)\b/gi;
const PATHS = ["/careers", "/jobs"];

function domainGuesses(name) {
  const k = KNOWN[name.toLowerCase().trim()];
  if (k) return [k];
  const full = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = name.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();
  return [...new Set([`${full}.com`, `${base}.com`, `${base}games.com`])].filter((d) => d.length > 5);
}

// ATS pulled from a network request URL the careers page makes.
const ATS_URL = [
  ["greenhouse", /boards-api\.greenhouse\.io\/v1\/boards\/([a-z0-9_-]+)/i, true],
  ["greenhouse", /(?:boards|job-boards)\.greenhouse\.io\/(?:embed\/job_board\?for=)?([a-z0-9]+)/i, true],
  ["lever", /(?:api|jobs)\.lever\.co\/(?:v0\/postings\/)?([a-z0-9-]+)/i, true],
  ["ashby", /(?:api|jobs)\.ashbyhq\.com\/(?:posting-api\/job-board\/)?([a-z0-9-]+)/i, true],
  ["workable", /apply\.workable\.com\/(?:api\/v\d+\/(?:widget\/)?accounts\/)?([a-z0-9-]+)/i, true],
  ["workable", /([a-z0-9-]+)\.workable\.com/i, true],
  ["teamtailor", /([a-z0-9-]+)\.teamtailor\.com/i, true],
  ["recruitee", /([a-z0-9-]+)\.recruitee\.com/i, true],
  ["workday", /([a-z0-9-]+)\.(?:wd\d+\.)?myworkdayjobs\.com/i, false],
  ["smartrecruiters", /api\.smartrecruiters\.com\/v\d+\/companies\/([a-z0-9._-]+)/i, false],
  ["personio", /([a-z0-9-]+)\.jobs\.personio\.[a-z]+/i, false],
];
function matchAts(url) {
  for (const [ats, re, supported] of ATS_URL) {
    const m = re.exec(url);
    if (m && m[1] && !["www", "api", "jobs", "apply", "boards"].includes(m[1].toLowerCase()))
      return { ats, slug: m[1], supported };
  }
  return null;
}

async function detectCompany(browser, c) {
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  });
  const hits = new Map();
  page.on("request", (req) => {
    const h = matchAts(req.url());
    if (h) hits.set(`${h.ats}:${h.slug}`, h);
  });
  try {
    for (const domain of domainGuesses(c.name)) {
      for (const p of PATHS) {
        let ok = false;
        try {
          const resp = await page.goto(`https://www.${domain}${p}`, { waitUntil: "domcontentloaded", timeout: 12000 });
          ok = resp && resp.status() < 400;
        } catch {
          ok = false;
        }
        if (!ok) continue; // dead domain/path — skip fast
        await page.waitForTimeout(3500); // let the careers app fire its ATS calls
        const supported = [...hits.values()].find((h) => h.supported);
        if (supported) return { ...c, domain, ...supported };
        if (hits.size) return { ...c, domain, ...[...hits.values()][0] }; // unsupported ATS found
        break; // this careers page loaded but uses no detectable ATS — next domain
      }
    }
  } finally {
    await page.close();
  }
  const any = [...hits.values()][0];
  return any ? { ...c, ...any } : { ...c, ats: null };
}

async function main() {
  const sources = JSON.parse(await readFile(join(ROOT, "src", "data", "sources.json"), "utf8"));
  const sourced = new Set((Array.isArray(sources) ? sources : sources.sources || []).map((s) => (s.name || "").toLowerCase().trim()));

  const companies = new Map();
  for (const [file, pick] of [
    ["talent-sourcing.json", (d) => (d.talent || []).flatMap((t) => (t.candidates || []).map((c) => ({ name: c.company, sector: c.sectorGuess || "games" })))],
    ["gamigion-companies.json", (d) => d.companies || []],
  ]) {
    try {
      const d = JSON.parse(await readFile(join(ROOT, "src", "data", file), "utf8"));
      for (const c of pick(d)) if (c.name) companies.set(c.name.toLowerCase(), { name: c.name, sector: c.sector || "games" });
    } catch { /* not present */ }
  }
  for (const c of PM01) companies.set(c.name.toLowerCase(), c);

  const todo = [...companies.values()].filter((c) => !sourced.has(c.name.toLowerCase().trim()));
  console.log(`Rendering careers pages for ${todo.length} companies (headless)…\n`);

  const browser = await chromium.launch({ headless: true });
  const addable = [];
  for (const c of todo) {
    const r = await detectCompany(browser, c);
    if (!r.ats) { console.log(`· ${c.name}: no ATS network call detected`); continue; }
    const sup = SUPPORTED.has(r.ats);
    const v = sup ? await verify(r.ats, r.slug) : null;
    const tag = sup ? (v ? `${v.total} roles, ${v.inRemit.length} in-remit` : "verify failed") : "(no fetcher yet)";
    console.log(`✓ ${c.name}: ${r.ats}/${r.slug} — ${tag}`);
    if (sup && v && v.inRemit.length) {
      console.log(`     in-remit: ${v.inRemit.slice(0, 3).join(" | ")}`);
      addable.push({ ats: r.ats, slug: r.slug, name: c.name, url: `https://www.${r.domain}`, sector: c.sector });
    }
  }
  await browser.close();

  console.log(`\n=== ${addable.length} ready to add to sources.json ===`);
  console.log(JSON.stringify(addable, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
