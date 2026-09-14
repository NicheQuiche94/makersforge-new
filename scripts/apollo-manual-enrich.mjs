/**
 * Manual-override enrichment (Andre 2026-08-13). For flagged leads the guarded
 * auto-resolver wouldn't touch (generic names, name variations Apollo indexes
 * differently), we supply the correct domain by hand in src/data/manual-domains.json
 * ({ "Folk company name": "domain.com" }), then this backfills the domain onto
 * the Folk company and enriches it with a decision-maker exactly like the auto
 * path — reveal + create in Folk, linked.
 *
 *   node --env-file=.env.local scripts/apollo-manual-enrich.mjs [--dry-run]
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { folk, listCompanies, listPeople, createPerson, normName } from "./folk.mjs";
import { findForCompany } from "./apollo.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FOLK = process.env.FOLK_API_KEY;
const APOLLO = process.env.APOLLO_API_KEY;
const DRY = process.argv.includes("--dry-run");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  if (!FOLK || !APOLLO) { console.error("Need FOLK_API_KEY + APOLLO_API_KEY."); process.exit(1); }
  const map = JSON.parse(await readFile(join(ROOT, "src", "data", "manual-domains.json"), "utf8"));
  const entries = Object.entries(map);
  console.log(`${entries.length} manual domain override(s). ${DRY ? "DRY RUN (no spend/write)." : "LIVE (reveal ~1 credit each)."}\n`);

  const [cos, people] = await Promise.all([listCompanies(FOLK), listPeople(FOLK)]);
  const byName = new Map(cos.map((c) => [normName(c.name), c]));
  const withContact = new Set(people.flatMap((p) => (p.companies || []).map((co) => co.id)));

  let created = 0, noContact = 0, missing = 0, hasContact = 0, credits = 0;
  for (const [name, domain] of entries) {
    const co = byName.get(normName(name));
    if (!co) { missing++; console.log(`? ${name}: not found in Folk (skip)`); continue; }
    if (withContact.has(co.id)) { hasContact++; console.log(`· ${name}: already has a contact (skip)`); continue; }
    try {
      if (!DRY) await folk(`/companies/${co.id}`, "PATCH", { urls: [`https://${domain}`] }, FOLK);
      const contacts = await findForCompany({ name, domain }, { reveal: !DRY });
      if (!DRY && contacts[0]?.apolloId) credits++;
      const top = contacts[0];
      if (!top || !top.name) { noContact++; console.log(`· ${name} (${domain}): no decision-maker found`); await sleep(150); continue; }
      const label = `${top.name}${top.title ? ` — ${top.title}` : ""}${top.email ? ` <${top.email}>` : " [no email]"}`;
      if (DRY) { console.log(`→ would add ${name} (${domain}): ${label}`); }
      else {
        await createPerson(FOLK, { fullName: top.name, jobTitle: top.title, email: top.email, linkedin: top.linkedin, companyId: co.id });
        created++;
        console.log(`✓ ${name} (${domain}): ${label}`);
      }
      await sleep(180);
    } catch (e) {
      console.warn(`! ${name}: ${String(e.message).slice(0, 100)}`);
      await sleep(150);
    }
  }
  console.log(`\n${DRY ? "[dry-run] " : ""}+${created} contacts · ${noContact} no-contact · ${hasContact} already had one · ${missing} not in Folk · ~${DRY ? 0 : credits} credits.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
