/**
 * Gamigion discovery (headless).
 *
 * gamigion.com is a mobile-gaming-scoped feed over LinkedIn jobs, served from a
 * Cloudflare-protected JSON API (/jobs/api/jobs_api) that only a real browser
 * can reach. This loads it with Playwright, scrolls to pull the full feed,
 * captures the API payloads, keeps the IN-REMIT roles (UA/growth/marketing-art/
 * ASO/creative/ad-mon) and writes the unique mobile-gaming COMPANIES to
 * gamigion-companies.json for the ATS bridge (ats-from-discovery.mjs) to turn
 * into clean board sources.
 *
 * We use it for discovery (who's hiring), never republish its rows — the records
 * carry no apply URL anyway (LinkedIn data).
 *
 * Run: node scripts/gamigion-discover.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { categoryFor } from "./serpapi.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_JSON = join(ROOT, "src", "data", "gamigion-companies.json");
const OUT_MD = join(ROOT, "docs", "gamigion-roles.md");

function recArray(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.jobs || payload?.data || payload?.records || payload?.results || [];
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  });
  const byId = new Map();
  page.on("response", async (res) => {
    if (!res.url().includes("/jobs/api/jobs_api") || !res.ok()) return;
    try {
      for (const r of recArray(await res.json())) {
        const id = r["Job ID"] ?? r.job_id ?? JSON.stringify(r);
        byId.set(String(id), r);
      }
    } catch {
      /* non-JSON */
    }
  });

  await page.goto("https://www.gamigion.com/jobs/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  // Infinite scroll: scroll to the bottom until the record count stops growing.
  let last = -1;
  for (let i = 0; i < 40 && byId.size !== last; i++) {
    last = byId.size;
    await page.mouse.wheel(0, 20000);
    await page.waitForTimeout(1400);
  }
  await browser.close();
  return [...byId.values()];
}

function companyOf(r) {
  return (r["Company Name"] || r.company || "").trim();
}
function titleOf(r) {
  return (r["Title"] || r.title || "").trim();
}
function locationOf(r) {
  return (r["Location"] || r.location || "").trim();
}

async function main() {
  console.log("Loading gamigion.com/jobs via headless browser…");
  const records = await capture();
  console.log(`captured ${records.length} roles`);

  // Skip companies already on the board.
  const sources = JSON.parse(await readFile(join(ROOT, "src", "data", "sources.json"), "utf8"));
  const sourced = new Set(
    (Array.isArray(sources) ? sources : sources.sources || []).map((s) => (s.name || "").toLowerCase().trim()),
  );

  // EVERY mobile-gaming company is a forward lead (Andre 2026-08-02): a studio
  // without a growth role today will post one eventually, and once it's a source
  // the ingester auto-captures it. So capture ALL companies, not just ones with
  // an in-remit role right now — with the in-remit count as a priority signal.
  const companies = new Map();
  for (const r of records) {
    const name = companyOf(r);
    if (!name || sourced.has(name.toLowerCase().trim())) continue;
    const key = name.toLowerCase();
    if (!companies.has(key)) companies.set(key, { name, sector: "games", total: 0, inRemit: [] });
    const c = companies.get(key);
    c.total += 1;
    if (categoryFor(titleOf(r))) c.inRemit.push({ title: titleOf(r), location: locationOf(r) });
  }
  const list = [...companies.values()].sort(
    (a, b) => b.inRemit.length - a.inRemit.length || b.total - a.total || a.name.localeCompare(b.name),
  );
  const withInRemit = list.filter((c) => c.inRemit.length).length;
  console.log(`${list.length} new mobile-gaming companies (${withInRemit} with an in-remit role now), not already sourced`);

  await writeFile(
    OUT_JSON,
    JSON.stringify({ generatedAt: Date.now(), companies: list.map(({ name, sector }) => ({ name, sector })) }, null, 2) + "\n",
    "utf8",
  );

  const md = ["# Gamigion — mobile-gaming companies to ATS-check", ""];
  md.push(
    `${list.length} companies not already on the board, from ${records.length} roles. Every one is a lead: run the slug-probe to auto-add the ones with a supported ATS, manually check the rest. Companies with an in-remit role live now are listed first.`,
    "",
  );
  for (const c of list) {
    const tag = c.inRemit.length ? `${c.inRemit.length} in-remit / ${c.total} roles` : `${c.total} roles`;
    md.push(`- **${c.name}** — ${tag}`);
    for (const r of c.inRemit.slice(0, 3)) md.push(`  - ${r.title}${r.location ? ` · ${r.location}` : ""}`);
  }
  await writeFile(OUT_MD, md.join("\n") + "\n", "utf8");

  console.log(`\n✓ ${OUT_JSON.replace(ROOT, ".")}`);
  console.log(`✓ ${OUT_MD.replace(ROOT, ".")}`);
  console.log(`Next: node scripts/ats-from-discovery.mjs  (now reads gamigion companies too)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
