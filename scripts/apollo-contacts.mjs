#!/usr/bin/env node
/**
 * Apollo contact finder for the job board → Folk pipeline.
 *
 * For each company on the board it asks Apollo for the right decision-maker(s)
 * — the people who buy UA / growth / marketing-art talent — and writes them to
 * `src/data/apollo-contacts.json`. A separate step imports those into Folk as
 * Leads (Channel "Job board signal"); enrichment then lives in Folk, not here.
 *
 * Apollo = FIND the contact (name, title, LinkedIn, email). Folk = OWN the
 * relationship. Keep that split.
 *
 *   APOLLO_API_KEY=xxx node scripts/apollo-contacts.mjs            # names/titles only (cheap)
 *   APOLLO_API_KEY=xxx node scripts/apollo-contacts.mjs --reveal   # + email reveal (spends credits)
 *   APOLLO_API_KEY=xxx node scripts/apollo-contacts.mjs --limit 5  # cap companies (testing / credits)
 *
 * NOTE: Apollo's API shape can shift between plan tiers/versions. Do one live
 * test call after the key is in and adjust ENDPOINT/params if needed.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src", "data");
const JOBS_PATH = join(DATA_DIR, "jobs.json");
const OUT_PATH = join(DATA_DIR, "apollo-contacts.json");

const API_KEY = process.env.APOLLO_API_KEY;
const REVEAL = process.argv.includes("--reveal");
const LIMIT = (() => {
  const i = process.argv.indexOf("--limit");
  return i > -1 ? Number(process.argv[i + 1]) : Infinity;
})();
// --only slug1,slug2  → process just these companies (substring match on slug or
// name). Output merges into the existing file, so it's safe for gap re-runs.
const ONLY = (() => {
  const i = process.argv.indexOf("--only");
  return i > -1 ? process.argv[i + 1].split(",").map((s) => s.trim()).filter(Boolean) : [];
})();

const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Real homepages for companies whose board URL is an apply-link (getro sources
// carry a deep link, not a domain). Keyed by a substring of the company slug.
const DOMAIN_OVERRIDES = [
  [/midnite/, "midnite.com"],
  [/pocket-worlds/, "pocketworlds.com"],
  [/eloelo/, "eloelo.in"],
  [/inworld/, "inworld.ai"],
  [/immutable/, "immutable.com"],
  [/stockgro/, "stockgro.club"],
  [/bigger-games/, "biggergames.com"],
];
function overrideDomain(slug) {
  for (const [re, d] of DOMAIN_OVERRIDES) if (re.test(slug)) return d;
  return null;
}

const SEARCH_URL = "https://api.apollo.io/api/v1/mixed_people/api_search";
const MATCH_URL = "https://api.apollo.io/api/v1/people/match";

// Who we want, best first. The finder ranks matches by this order and keeps the
// top CONTACTS_PER_COMPANY. For small studios the founder/CEO owns growth, so
// they're included as a fallback.
const TITLE_PRIORITY = [
  "Head of User Acquisition",
  "VP Growth",
  "Head of Growth",
  "Head of Performance Marketing",
  "Chief Marketing Officer",
  "VP Marketing",
  "Head of Marketing",
  "Head of Creative",
  "Growth Lead",
  "Marketing Director",
  "CEO",
  "Founder",
  "Co-Founder",
];
const SENIORITIES = ["owner", "founder", "c_suite", "vp", "head", "director"];
const CONTACTS_PER_COMPANY = 2; // how many to shortlist per company (preview)
const REVEAL_PER_COMPANY = 1; // how many to enrich (spends ~1 credit each)

// Domains that are ATS/job/aggregator hosts, not a company homepage — skip for
// Apollo (we need the real company domain). Flagged in output for manual fix.
const NON_COMPANY_HOST =
  /(^|\.)(linkedin\.com|greenhouse\.io|lever\.co|ashbyhq\.com|workable\.com|teamtailor\.com|keka\.com|getro\.com|gohire\.io|indeed\.com)$/i;

function domainOf(url = "") {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    return NON_COMPANY_HOST.test(h) ? null : h;
  } catch {
    return null;
  }
}

// Words that shouldn't appear in a person's name — job titles, team handles,
// gamer-tag-ish tokens. Used to flag dodgy Apollo matches (e.g. "Sneaky Pocket",
// "Jennifer Director") so we can promote a real-looking alternative.
const NOT_A_NAME =
  /\b(director|manager|head|lead|officer|marketing|growth|founder|ceo|cto|team|studio|official|admin|the|pocket|sneaky|ninja|gamer|player|guild|clan)\b/i;

/** Heuristic: does this look like a real person's name (2–4 alpha words)? */
function looksLikeRealName(name) {
  if (!name) return false;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 4) return false;
  if (NOT_A_NAME.test(name)) return false;
  return parts.every((p) => /^[\p{L}][\p{L}'’.-]*$/u.test(p));
}

/** Rank index for a title against TITLE_PRIORITY (lower = better; -1 = no match). */
function titleRank(title = "") {
  const t = title.toLowerCase();
  for (let i = 0; i < TITLE_PRIORITY.length; i++) {
    const key = TITLE_PRIORITY[i].toLowerCase();
    // loose contains match so "Senior Head of Growth" etc. still rank
    if (t.includes(key) || key.split(" ").every((w) => t.includes(w))) return i;
  }
  return -1;
}

async function apollo(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Apollo HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function findForCompany(company) {
  // 1. Search — a cheap preview. Names are partly obfuscated and email/LinkedIn
  //    are locked here; only first_name, title, id and has_email come back.
  const data = await apollo(SEARCH_URL, {
    q_organization_domains: company.domain,
    person_titles: TITLE_PRIORITY,
    person_seniorities: SENIORITIES,
    page: 1,
    per_page: 25,
  });
  const people = (data.people || [])
    .map((p) => ({
      apolloId: p.id,
      firstName: p.first_name,
      name: p.first_name, // filled in fully on reveal
      title: p.title,
      hasEmail: p.has_email,
      email: null,
      linkedin: null,
      rank: titleRank(p.title),
    }))
    .filter((p) => p.rank > -1)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, CONTACTS_PER_COMPANY);

  // 2. Reveal — enrich the best match(es) by id to unlock full name, work email
  //    and LinkedIn. Costs ~1 credit each, so only the top REVEAL_PER_COMPANY.
  const reveal = async (p) => {
    if (!p || !p.apolloId) return;
    try {
      const m = await apollo(MATCH_URL, { id: p.apolloId, reveal_personal_emails: false });
      const mp = m.person || {};
      p.name = mp.name || p.firstName;
      p.lastName = mp.last_name || null;
      p.title = mp.title || p.title;
      p.email = mp.email && !/^email_not_unlocked/i.test(mp.email) ? mp.email : null;
      p.linkedin = mp.linkedin_url || null;
    } catch (err) {
      console.warn(`  ! reveal failed for ${p.firstName} @ ${company.name}: ${err.message}`);
    }
  };

  if (REVEAL) {
    for (const p of people.slice(0, REVEAL_PER_COMPANY)) await reveal(p);

    // If the top match's name looks off (title/handle, not a real name), reveal
    // the runner-up and promote it when it looks like a genuine person.
    const top = people[0];
    const badName = top && top.name && !looksLikeRealName(top.name);
    const noEmail = top && !top.email;
    if (top && (badName || noEmail)) {
      top.flag = badName ? "name-looks-odd" : "no-email";
      const alt = people[1];
      if (alt && alt.apolloId) {
        await reveal(alt);
        // Promote the runner-up if it's a real name and fixes the issue.
        if (looksLikeRealName(alt.name) && (badName || (noEmail && alt.email))) {
          people[0] = alt;
          people[1] = top;
        }
      }
    }
  }
  return people;
}

async function main() {
  if (!API_KEY) {
    console.error("Set APOLLO_API_KEY. Aborting (no live calls made).");
    process.exit(1);
  }

  const jobs = JSON.parse(await readFile(JOBS_PATH, "utf8"));
  const byCo = new Map();
  for (const j of jobs) {
    const c = j.company;
    if (!byCo.has(c.slug)) byCo.set(c.slug, { ...c, roles: 0 });
    byCo.get(c.slug).roles += 1;
  }

  const companies = [...byCo.values()]
    .filter(
      (c) =>
        !ONLY.length ||
        ONLY.some((t) => c.slug.includes(t) || norm(c.name).includes(norm(t))),
    )
    .map((c) => ({ ...c, domain: overrideDomain(c.slug) || domainOf(c.url) }))
    .slice(0, LIMIT);

  const out = {};
  const skipped = [];
  for (const c of companies) {
    if (!c.domain) {
      skipped.push(c.name);
      continue;
    }
    // Only spend email-reveal credits on companies with live in-remit roles.
    try {
      const contacts = await findForCompany(c);
      out[c.slug] = { company: c.name, domain: c.domain, roles: c.roles, contacts };
      console.log(
        `· ${c.name} (${c.domain}): ${contacts.length} contact(s)` +
          (contacts[0] ? ` — ${contacts[0].name} (${contacts[0].title})` : ""),
      );
    } catch (err) {
      console.warn(`! ${c.name}: ${err.message}`);
    }
  }

  // Merge into any existing output so targeted (--only) runs don't drop others.
  let existing = {};
  try {
    existing = JSON.parse(await readFile(OUT_PATH, "utf8"));
  } catch {
    /* first run */
  }
  const merged = { ...existing, ...out };
  await writeFile(OUT_PATH, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(
    `\n✓ Wrote ${Object.keys(out).length} companies (${Object.keys(merged).length} total) → ${OUT_PATH}`,
  );
  if (skipped.length)
    console.log(
      `Skipped (no clean company domain, fix url in sources): ${skipped.join(", ")}`,
    );
  console.log(
    "Next: review apollo-contacts.json, then import to Folk as Leads (Channel 'Job board signal').",
  );
}

main().catch((err) => {
  console.error("Apollo run failed:", err);
  process.exit(1);
});
