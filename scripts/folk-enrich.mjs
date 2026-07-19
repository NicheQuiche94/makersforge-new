#!/usr/bin/env node
/**
 * Read enriched company data back OUT of Folk and onto the board.
 *
 * Folk is the system of record for relationship + enrichment data. Once a
 * company in "Companies MF" is enriched (better description, confirmed size,
 * funding, a "Funding stage" field), this pulls those fields and writes
 * `src/data/folk-enrichment.json`, keyed by board company slug. `src/lib/jobs.ts`
 * merges that over the board's base data (Folk wins), so it shows on the cards
 * and company pages.
 *
 * This is the closing half of the loop: ingest → Apollo → Folk → (you enrich) →
 * folk-enrich → board.
 *
 *   node --env-file=.env.local scripts/folk-enrich.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "src", "data");

const KEY = process.env.FOLK_API_KEY;
const API = "https://api.folk.app/v1";
const G_COMPANIES = "grp_e6afe55b-bffc-4b2e-8ad0-09e8cd7c4dea"; // Companies MF

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function folk(path) {
  const res = await fetch(API + path, {
    headers: { Authorization: "Bearer " + KEY },
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Folk ${res.status} ${JSON.stringify(d).slice(0, 200)}`);
  return d.data ?? d;
}

async function listAll(resource) {
  let path = `/${resource}?limit=100`;
  const out = [];
  while (path) {
    const data = await folk(path);
    out.push(...(data.items || []));
    const next = data.pagination?.nextLink;
    path = next ? next.replace(API, "") : null;
  }
  return out;
}

/** Format a funding display string from Folk native fields. */
function fundingLabel(c) {
  const raw = c.fundingRaised;
  const date = c.lastFundingDate;
  if (!raw && !date) return null;
  const amt = typeof raw === "string" ? parseFloat(raw.replace(/[^0-9.]/g, "")) : raw;
  const money =
    typeof amt === "number" && !Number.isNaN(amt) && amt > 0
      ? amt >= 1e9
        ? `$${(amt / 1e9).toFixed(1)}B`
        : amt >= 1e6
          ? `$${Math.round(amt / 1e6)}M`
          : `$${Math.round(amt / 1e3)}K`
      : null;
  const when = date
    ? new Date(date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    : null;
  return [money ? `${money} raised` : null, when ? `last round ${when}` : null]
    .filter(Boolean)
    .join(" · ");
}

async function main() {
  if (!KEY) {
    console.error("Set FOLK_API_KEY (node --env-file=.env.local scripts/folk-enrich.mjs)");
    process.exit(1);
  }
  const jobs = JSON.parse(await readFile(join(DATA, "jobs.json"), "utf8"));
  const nameToSlug = new Map();
  for (const j of jobs) nameToSlug.set(norm(j.company.name), j.company.slug);

  const companies = (await listAll("companies")).filter((c) =>
    (c.groups || []).some((g) => g.id === G_COMPANIES),
  );

  const out = {};
  let matched = 0;
  for (const c of companies) {
    const slug = nameToSlug.get(norm(c.name));
    if (!slug) continue; // company in Folk but not on the board
    matched++;

    const cf = c.customFieldValues?.[G_COMPANIES] || {};
    const stage = cf["Funding stage"] || cf["Stage"] || null;
    const funding = fundingLabel(c);

    const enrich = {};
    if (c.employeeRange) enrich.size = c.employeeRange;
    // Only let a SHORT Folk description override the board's blurb — the long
    // multi-paragraph company bios in Folk aren't formatted for the blurb slot.
    if (c.description && c.description.trim().length <= 300)
      enrich.blurb = c.description.trim();
    if (stage) enrich.stage = stage;
    if (funding) enrich.funding = funding;
    if (c.lastFundingDate) enrich.lastRaise = String(c.lastFundingDate).slice(0, 7);

    if (Object.keys(enrich).length) out[slug] = enrich;
  }

  await writeFile(
    join(DATA, "folk-enrichment.json"),
    JSON.stringify(out, null, 2) + "\n",
    "utf8",
  );
  console.log(
    `✓ Read ${companies.length} Companies MF records, matched ${matched} to the board, wrote enrichment for ${Object.keys(out).length}.`,
  );
  console.log("Next: rebuild the board (npm run build) to surface the enriched data.");
}

main().catch((e) => {
  console.error("Read-back failed:", e);
  process.exit(1);
});
