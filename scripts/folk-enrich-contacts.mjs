/**
 * Enrich Folk company leads with a decision-maker contact (Andre 2026-07-20).
 *
 * The Play/YC discovery pushed companies into Folk as leads but WITHOUT a
 * person. This finds the Head of Growth / CMO / UA lead per company via Apollo
 * and creates them in Folk, linked — turning raw leads into people you can
 * actually reach out to.
 *
 *   node --env-file=.env.local scripts/folk-enrich-contacts.mjs --limit=3   # test
 *   node --env-file=.env.local scripts/folk-enrich-contacts.mjs             # full run
 *   node --env-file=.env.local scripts/folk-enrich-contacts.mjs --channel="YC signal"
 *
 * Reveals email (~1 Apollo credit/company). Skips leads that already have a
 * contact and leads with no clean company domain.
 */

import { listCompanies, listPeople, createPerson, normName, G_COMPANIES } from "./folk.mjs";
import { findForCompany, domainOf } from "./apollo.mjs";

const FOLK = process.env.FOLK_API_KEY;
const APOLLO = process.env.APOLLO_API_KEY;
const arg = (name, def) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=").slice(1).join("=") : def;
};
const LIMIT = Number(arg("limit", Infinity));
const CHANNELS = arg("channel", "Play Store signal,YC signal").split(",").map((s) => s.trim());
const DRY = process.argv.includes("--dry-run");

async function main() {
  if (!FOLK || !APOLLO) {
    console.error("Need FOLK_API_KEY + APOLLO_API_KEY (run with --env-file=.env.local).");
    process.exit(1);
  }

  const companies = await listCompanies(FOLK);
  const leads = companies.filter((c) => {
    const ch = c.customFieldValues?.[G_COMPANIES]?.Channel;
    return ch && CHANNELS.includes(ch);
  });

  // Which leads already have a linked contact — skip those.
  const people = await listPeople(FOLK);
  const withContact = new Set(
    people.flatMap((p) => (p.companies || []).map((co) => co.id)),
  );

  const queue = leads
    .filter((c) => !withContact.has(c.id))
    .map((c) => ({ id: c.id, name: c.name, domain: domainOf((c.urls || [])[0]) }))
    .filter((c) => c.domain)
    .slice(0, LIMIT);

  const noDomain = leads.filter((c) => !withContact.has(c.id) && !domainOf((c.urls || [])[0]));
  console.log(
    `${leads.length} lead(s) in [${CHANNELS.join(", ")}] · ${withContact.size} companies already have a contact · ${queue.length} to enrich${noDomain.length ? ` · ${noDomain.length} skipped (no clean domain)` : ""}\n`,
  );

  let created = 0, none = 0, flagged = 0;
  for (const c of queue) {
    try {
      const contacts = await findForCompany({ name: c.name, domain: c.domain }, { reveal: !DRY });
      const top = contacts[0];
      if (!top || !top.name) {
        none++;
        console.log(`· ${c.name} (${c.domain}): no contact found`);
        continue;
      }
      const label = `${top.name}${top.title ? ` — ${top.title}` : ""}${top.email ? ` <${top.email}>` : " [no email]"}${top.flag ? ` (${top.flag})` : ""}`;
      if (top.flag) flagged++;
      if (DRY) {
        console.log(`· would add ${c.name}: ${label}`);
        continue;
      }
      await createPerson(FOLK, {
        fullName: top.name,
        jobTitle: top.title,
        email: top.email,
        linkedin: top.linkedin,
        companyId: c.id,
      });
      created++;
      console.log(`✓ ${c.name}: ${label}`);
    } catch (e) {
      console.warn(`! ${c.name}: ${e.message}`);
    }
  }

  console.log(
    `\n${DRY ? "[dry-run] " : ""}+${created} contacts created · ${none} no-contact · ${flagged} flagged for a manual look`,
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
