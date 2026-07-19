#!/usr/bin/env node
/**
 * Bulk-import job-board companies + their Apollo contacts into Folk as leads.
 *
 * - Companies → "Companies MF" group, Status "Lead", Channel "Job board signal",
 *   Next Steps = live in-remit roles, plus size/industry enrichment from the board.
 * - Top contact → "Contacts MF" group, linked to the company, Status "Lead".
 *
 * Deduped against existing Folk records by normalised name, so re-running only
 * adds what's missing. Reads contacts from apollo-contacts.json + enrichment
 * from jobs.json.
 *
 *   node --env-file=.env.local scripts/folk-import.mjs            # full run
 *   node --env-file=.env.local scripts/folk-import.mjs --limit 2  # first N companies
 *   node --env-file=.env.local scripts/folk-import.mjs --dry-run  # print, write nothing
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "src", "data");

const KEY = process.env.FOLK_API_KEY;
const DRY = process.argv.includes("--dry-run");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i > -1 ? Number(process.argv[i + 1]) : Infinity;
})();

const API = "https://api.folk.app/v1";
const G_COMPANIES = "grp_e6afe55b-bffc-4b2e-8ad0-09e8cd7c4dea"; // Companies MF
const G_CONTACTS = "grp_797b287b-c997-4b6f-8179-bf84960b0c1d"; // Contacts MF

// Board size buckets → Folk's employeeRange enum.
const SIZE_TO_RANGE = {
  "1-10": "1-10",
  "11-50": "11-50",
  "15-50": "11-50",
  "50-200": "51-200",
  "51-200": "51-200",
  "200-500": "201-500",
  "201-500": "201-500",
  "500+": "501-1000",
  "1000+": "1001-5000",
};

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function folk(path, method = "GET", body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Folk ${res.status} ${JSON.stringify(d).slice(0, 220)}`);
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

async function main() {
  if (!KEY) {
    console.error("Set FOLK_API_KEY, e.g. node --env-file=.env.local scripts/folk-import.mjs");
    process.exit(1);
  }
  const apollo = JSON.parse(await readFile(join(DATA, "apollo-contacts.json"), "utf8"));
  const jobs = JSON.parse(await readFile(join(DATA, "jobs.json"), "utf8"));

  // Enrichment per company slug (sector, size, blurb, live role titles).
  const enr = new Map();
  for (const j of jobs) {
    const c = j.company;
    if (!enr.has(c.slug)) enr.set(c.slug, { ...c, titles: [] });
    enr.get(c.slug).titles.push(j.title);
  }

  // Existing Folk state for dedupe.
  const existingCo = new Map();
  for (const c of await listAll("companies")) existingCo.set(norm(c.name), c.id);
  const existingPe = new Set();
  for (const p of await listAll("people")) existingPe.add(norm(p.fullName));

  let coCreated = 0, coExisting = 0, peCreated = 0, peSkipped = 0;
  const entries = Object.entries(apollo).slice(0, LIMIT);

  for (const [slug, v] of entries) {
    const e = enr.get(slug) || {};
    const name = v.company;

    // --- Company ---
    let coId = existingCo.get(norm(name));
    if (coId) {
      coExisting++;
    } else if (DRY) {
      console.log("would CREATE company:", name);
      coCreated++;
    } else {
      const co = await folk("/companies", "POST", {
        name,
        urls: v.domain ? ["https://" + v.domain] : [],
        description: e.blurb || "",
        ...(SIZE_TO_RANGE[e.size] ? { employeeRange: SIZE_TO_RANGE[e.size] } : {}),
        industry: e.sector === "apps" ? "Consumer apps" : "Mobile games",
        groups: [{ id: G_COMPANIES }],
        customFieldValues: {
          [G_COMPANIES]: {
            Status: "Lead",
            Channel: "Job board signal",
            "Next Steps": `${e.titles?.length || 0} live in-remit role(s) on the board: ${(e.titles || []).slice(0, 6).join(", ")}.`,
          },
        },
      });
      coId = co.id;
      existingCo.set(norm(name), coId);
      coCreated++;
    }

    // --- Top contact ---
    const c = (v.contacts || [])[0];
    let contactNote = " (no contact)";
    if (c && c.name) {
      if (existingPe.has(norm(c.name))) {
        peSkipped++;
        contactNote = ` · ${c.name} (already in Folk)`;
      } else if (DRY) {
        console.log(`  would CREATE contact: ${c.name} — ${c.title}${c.email ? " <" + c.email + ">" : " (no email)"}`);
        peCreated++;
        contactNote = ` + ${c.name}`;
      } else if (coId) {
        await folk("/people", "POST", {
          fullName: c.name,
          jobTitle: c.title,
          emails: c.email ? [c.email] : [],
          urls: c.linkedin ? [c.linkedin] : [],
          companies: [{ id: coId }],
          groups: [{ id: G_CONTACTS }],
          customFieldValues: { [G_CONTACTS]: { Status: "Lead" } },
        });
        existingPe.add(norm(c.name));
        peCreated++;
        contactNote = ` + ${c.name} (${c.title})${c.email ? "" : " [no email]"}`;
      }
    }
    console.log(`· ${name}${coExisting && existingCo.get(norm(name)) === coId ? "" : ""}${contactNote}`);
  }

  console.log(
    `\n${DRY ? "[dry-run] " : ""}Companies: +${coCreated} ${DRY ? "would create" : "created"}, ${coExisting} already existed | Contacts: +${peCreated} ${DRY ? "would create" : "created"}, ${peSkipped} skipped (dup)`,
  );
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
