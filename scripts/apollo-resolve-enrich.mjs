/**
 * Resolve a domain for name-only Folk leads, then enrich with a decision-maker
 * (Andre 2026-08-13). The Gamigion import carried company names but no websites,
 * so Apollo (which searches people by domain) couldn't reach them. This:
 *
 *   1. Apollo org-search by name (FREE) → candidate organisations.
 *   2. GUARDED match: accept only when the org name matches exactly (after
 *      stripping legal/industry suffixes) AND the industry is games/tech. Any
 *      generic-name mis-hit (e.g. "Bramble" → "Bramble Energy") is FLAGGED for a
 *      manual look, never written. Protects CRM quality.
 *   3. Backfill the resolved domain onto the Folk company (urls).
 *   4. People-search + reveal the top decision-maker (~1 credit) and create them
 *      in Folk, linked.
 *
 *   node --env-file=.env.local scripts/apollo-resolve-enrich.mjs --limit=30 --channel="Gamigion discovery"
 *   node --env-file=.env.local scripts/apollo-resolve-enrich.mjs --limit=30 --dry-run   # resolve only, no spend/write
 *
 * Dry-run resolves domains + previews contacts (no reveal, no Folk writes, 0 credits).
 */

import { folk, listCompanies, listPeople, createPerson, G_COMPANIES } from "./folk.mjs";
import { findForCompany, domainOf } from "./apollo.mjs";

const FOLK = process.env.FOLK_API_KEY;
const APOLLO = process.env.APOLLO_API_KEY;
const arg = (n, d) => { const a = process.argv.find((x) => x.startsWith(`--${n}=`)); return a ? a.split("=").slice(1).join("=") : d; };
const LIMIT = Number(arg("limit", 30));
const CHANNEL = arg("channel", "");
// Hard ceiling on reveals (= Apollo credits) per run. The loop stops once hit,
// so automated/daily runs can never overspend; remaining leads wait for next run.
const MAX_REVEALS = Number(arg("max-reveals", Infinity));
const DRY = process.argv.includes("--dry-run");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const LEGAL = /\b(studios?|games?|entertainment|interactive|inc|ltd|llc|ab|gmbh|limited|pte|oy|srl|\bbv\b|\bsa\b|corp|co|sp\.? ?z ?o\.? ?o\.?)\b/gi;
const normKey = (s) => (s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "").replace(LEGAL, "").replace(/\s+/g, "").trim();

// Industry allow-list: games + adjacent tech/media. If Apollo reports an industry
// OUTSIDE this set (energy, pets, finance…) we reject the match as a wrong company.
const INDUSTRY_OK = /(game|gaming|software|internet|information technology|entertainment|media|mobile|apps?|computer|technolog|animation|publishing|e-?learning|marketing|advertis)/i;
const industryOk = (ind) => !ind || INDUSTRY_OK.test(ind);

async function apolloPost(url, body) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", "X-Api-Key": APOLLO }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Apollo HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`);
  return res.json();
}

/** Guarded name → domain. Returns { domain, orgName, industry } or a { flag, suggestion }. */
async function resolveDomain(name) {
  const d = await apolloPost("https://api.apollo.io/api/v1/mixed_companies/search", { q_organization_name: name, page: 1, per_page: 5 });
  const orgs = (d.organizations || d.accounts || []).map((o) => ({ name: o.name, domain: o.primary_domain || domainOf(o.website_url), industry: o.industry }));
  const want = normKey(name);
  // Guard: the TOP-ranked org that has a domain must be an exact name match
  // (post-suffix-strip) and an acceptable industry. Requiring it to be Apollo's
  // top hit — not just any of the 5 — protects generic names (a games "Bramble"
  // won't silently resolve to "Bramble Energy"/"Bramble Pets" further down).
  const top = orgs.find((o) => o.domain);
  if (top && normKey(top.name) === want && industryOk(top.industry)) {
    return { domain: top.domain, orgName: top.name, industry: top.industry };
  }
  return { flag: orgs.length ? "no-confident-match" : "no-org-found", suggestion: top ? `${top.name} (${top.domain}, ${top.industry || "?"})` : null };
}

async function main() {
  if (!FOLK || !APOLLO) { console.error("Need FOLK_API_KEY + APOLLO_API_KEY (run with --env-file=.env.local)."); process.exit(1); }

  const [cos, people] = await Promise.all([listCompanies(FOLK), listPeople(FOLK)]);
  const withContact = new Set(people.flatMap((p) => (p.companies || []).map((co) => co.id)));
  let queue = cos.filter((c) => !withContact.has(c.id) && !domainOf((c.urls || [])[0]));
  if (CHANNEL) queue = queue.filter((c) => (c.customFieldValues?.[G_COMPANIES]?.Channel || "") === CHANNEL);
  queue = queue.slice(0, LIMIT);

  console.log(`${queue.length} domainless lead(s)${CHANNEL ? ` in "${CHANNEL}"` : ""} to process. ${DRY ? "DRY RUN (resolve only, 0 credits)." : "LIVE (reveals spend ~1 credit each)."}\n`);

  let resolved = 0, created = 0, noContact = 0, flagged = 0, credits = 0;
  const flags = [];
  for (const c of queue) {
    if (credits >= MAX_REVEALS) { console.log(`\nReached max-reveals cap (${MAX_REVEALS}); stopping. Remaining leads will run next time.`); break; }
    try {
      const r = await resolveDomain(c.name);
      if (r.flag) {
        flagged++;
        flags.push(`  ⚑ ${c.name}: ${r.flag}${r.suggestion ? ` — maybe ${r.suggestion}` : ""}`);
        await sleep(120);
        continue;
      }
      resolved++;
      console.log(`→ ${c.name}: ${r.domain}  [${r.industry || "?"}]`);
      if (!DRY) {
        await folk(`/companies/${c.id}`, "PATCH", { urls: [`https://${r.domain}`] }, FOLK);
      }
      const contacts = await findForCompany({ name: c.name, domain: r.domain }, { reveal: !DRY });
      if (!DRY && contacts[0]?.apolloId) credits++;
      const top = contacts[0];
      if (!top || !top.name) { noContact++; console.log(`    · no decision-maker found`); await sleep(150); continue; }
      const label = `${top.name}${top.title ? ` — ${top.title}` : ""}${top.email ? ` <${top.email}>` : " [no email]"}`;
      if (DRY) { console.log(`    · would add ${label}`); }
      else {
        await createPerson(FOLK, { fullName: top.name, jobTitle: top.title, email: top.email, linkedin: top.linkedin, companyId: c.id });
        created++;
        console.log(`    ✓ ${label}`);
      }
      await sleep(180);
    } catch (e) {
      console.warn(`! ${c.name}: ${String(e.message).slice(0, 100)}`);
      await sleep(150);
    }
  }

  console.log(`\n${DRY ? "[dry-run] " : ""}Resolved ${resolved} domain(s) · ${created} contact(s) created · ${noContact} no-contact · ${flagged} flagged (no confident match).`);
  console.log(`Est. Apollo credits spent: ~${DRY ? 0 : credits}.`);
  if (flags.length) { console.log(`\nFlagged for manual review (${flags.length}):`); console.log(flags.join("\n")); }
}

main().catch((e) => { console.error(e); process.exit(1); });
