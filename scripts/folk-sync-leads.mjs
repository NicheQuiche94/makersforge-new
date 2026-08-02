/**
 * Folk lead sync — every solid company lead in the CRM with a live hiring flag.
 *
 * Reads ats-resolved.json (companies with a confirmed supported ATS = genuine
 * employers with a careers presence) and pushes each into Folk "Companies MF"
 * with a hiring data point in "Next Steps":
 *   - in-remit role live now  -> "HIRING NOW …"  (needs us now)
 *   - valid ATS, none right now -> "Future lead …" (will hire; nurture)
 * Re-run every couple of days to refresh the flag, so the CRM always shows who
 * to contact and how (Andre 2026-08-02). Adtech companies are excluded (private
 * lane). Existing companies are updated in place (deduped by normalised name),
 * preserving their other fields.
 *
 * DRY RUN by default — pass --commit to actually write to Folk.
 * Run: node --env-file=.env.local scripts/folk-sync-leads.mjs [--commit]
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { folk, listCompanies, createCompanyLead, normName, G_COMPANIES } from "./folk.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMMIT = process.argv.includes("--commit");

function hiringNote(c) {
  return c.inRemit > 0
    ? `⚡ HIRING NOW — ${c.inRemit} in-remit role${c.inRemit === 1 ? "" : "s"}${c.sample ? ` (e.g. ${c.sample})` : ""}. Reach out now.`
    : `Future lead — valid ATS (${c.boardRoles} roles), no in-remit role today. Nurture for when they hire.`;
}

async function main() {
  const key = process.env.FOLK_API_KEY;
  if (!key) { console.error("Missing FOLK_API_KEY. Run: node --env-file=.env.local scripts/folk-sync-leads.mjs --commit"); process.exit(1); }

  const resolved = JSON.parse(await readFile(join(ROOT, "src", "data", "ats-resolved.json"), "utf8"));
  const leads = (resolved.companies || []).filter((c) => !c.adtech); // adtech tracked privately
  console.log(`${leads.length} solid leads (ATS-resolved, non-adtech). ${COMMIT ? "COMMITTING" : "DRY RUN — pass --commit to write"}.\n`);

  const existing = await listCompanies(key);
  const byName = new Map(existing.map((c) => [normName(c.name), c]));

  let created = 0, updated = 0, hiring = 0;
  for (const c of leads) {
    if (c.inRemit > 0) hiring++;
    const note = hiringNote(c);
    const found = byName.get(normName(c.name));
    if (found) {
      updated++;
      console.log(`~ ${c.name}: ${c.inRemit > 0 ? "HIRING" : "future"} (update)`);
      if (COMMIT) {
        const merged = { ...(found.customFieldValues?.[G_COMPANIES] || {}), "Next Steps": note };
        await folk(`/companies/${found.id}`, "PATCH", { customFieldValues: { [G_COMPANIES]: merged } }, key);
      }
    } else {
      created++;
      console.log(`+ ${c.name}: ${c.inRemit > 0 ? "HIRING" : "future"} (create)`);
      if (COMMIT) await createCompanyLead(key, { name: c.name, sector: c.sector, channel: "Job board signal", nextSteps: note });
    }
  }

  console.log(`\n${COMMIT ? "Synced" : "Would sync"}: ${created} new + ${updated} updated · ${hiring} hiring now, ${leads.length - hiring} future.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
