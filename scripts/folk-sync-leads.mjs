/**
 * Folk lead sync — every solid company lead in the CRM with a live hiring flag.
 *
 * Reads ats-resolved.json (companies with a confirmed supported ATS = genuine
 * employers with a careers presence) and pushes each into Folk "Companies MF"
 * with a hiring data point in "Next Steps":
 *   - in-remit role live now  -> "HIRING NOW …"  (needs us now)
 *   - valid ATS, none right now -> "Future lead …" (will hire; nurture)
 * Re-run every couple of days to refresh the flag, so the CRM always shows who
 * to contact and how (Andre 2026-08-02). Adtech companies are KEPT and tagged
 * (Industry "Adtech / martech" + an [Adtech] note prefix) for CRM categorisation.
 * Deduped by normalised name; existing MF-companies updated in place. Records
 * already in Folk under a different group 422 and are skipped (logged).
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

// Adtech / martech / measurement companies — tagged, not excluded. Broader than
// the probe's flag so tools missed there (AppTweak, Sensor Tower, Braze…) still
// get categorised in the CRM.
const ADTECH =
  /justdice|revenuecat|adjoe|moloco|almedia|tatari|rtb ?house|taboola|inmobi|appsflyer|appodeal|airship|adjust|singular|kochava|liftoff|vungle|ironsource|unity ads|digital ?turbine|mistplay|exmox|applovin|smadex|remerge|jampp|aarki|bidease|zoomd|mobvista|mintegral|chartboost|fyber|outbrain|criteo|bigabid|kayzen|tapjoy|smaato|pubmatic|magnite|sharethrough|\bverve\b|apptweak|sensor ?tower|splitmetrics|tenjin|\bbranch\b|ogury|affle|adikteev|revx|phiture|appsamurai|incrmntal|clarisights|justtrack|audiomob|fastspring|braze|ogads|start\.?io|adjust/i;
const isAdtech = (c) => c.adtech || ADTECH.test(c.name);

function hiringNote(c) {
  const base = c.inRemit > 0
    ? `⚡ HIRING NOW — ${c.inRemit} in-remit role${c.inRemit === 1 ? "" : "s"}${c.sample ? ` (e.g. ${c.sample})` : ""}. Reach out now.`
    : `Future lead — valid ATS (${c.boardRoles} roles), no in-remit role today. Nurture for when they hire.`;
  return isAdtech(c) ? `[Adtech] ${base}` : base; // note-level tag for filtering
}
function industryOf(c) {
  return isAdtech(c) ? "Adtech / martech" : c.sector === "apps" ? "Consumer apps" : "Mobile games";
}

async function main() {
  const key = process.env.FOLK_API_KEY;
  if (!key) { console.error("Missing FOLK_API_KEY. Run: node --env-file=.env.local scripts/folk-sync-leads.mjs --commit"); process.exit(1); }

  const resolved = JSON.parse(await readFile(join(ROOT, "src", "data", "ats-resolved.json"), "utf8"));
  const leads = resolved.companies || []; // all solid leads; adtech kept + tagged
  const adtechN = leads.filter((c) => isAdtech(c)).length;
  console.log(`${leads.length} solid leads (ATS-resolved; ${adtechN} adtech, tagged). ${COMMIT ? "COMMITTING" : "DRY RUN — pass --commit to write"}.\n`);

  const existing = await listCompanies(key);
  const byName = new Map(existing.map((c) => [normName(c.name), c]));

  let created = 0, updated = 0, hiring = 0, failed = 0;
  for (const c of leads) {
    if (c.inRemit > 0) hiring++;
    const note = hiringNote(c);
    const found = byName.get(normName(c.name));
    const tag = isAdtech(c) ? " [adtech]" : "";
    try {
      if (found) {
        // PATCH only the field we set (Folk merges customFieldValues on PATCH).
        const body = { customFieldValues: { [G_COMPANIES]: { "Next Steps": note } } };
        if (isAdtech(c)) body.industry = industryOf(c);
        if (COMMIT) await folk(`/companies/${found.id}`, "PATCH", body, key);
        updated++;
        console.log(`~ ${c.name}${tag}: ${c.inRemit > 0 ? "HIRING" : "future"} (update)`);
      } else {
        if (COMMIT) await createCompanyLead(key, { name: c.name, sector: c.sector, channel: "Job board signal", nextSteps: note, industry: industryOf(c) });
        created++;
        console.log(`+ ${c.name}${tag}: ${c.inRemit > 0 ? "HIRING" : "future"} (create)`);
      }
    } catch (e) {
      failed++;
      console.log(`✗ ${c.name}${tag}: ${e.message.slice(0, 90)}`);
    }
  }

  console.log(`\n${COMMIT ? "Synced" : "Would sync"}: ${created} new + ${updated} updated${failed ? `, ${failed} failed` : ""} · ${hiring} hiring now, ${leads.length - hiring} future.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
