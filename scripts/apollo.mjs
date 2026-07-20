/**
 * Shared Apollo contact-finder (2026-07-20). Used by apollo-contacts.mjs (board
 * companies) and folk-enrich-contacts.mjs (Folk leads). Reads APOLLO_API_KEY
 * from env. Apollo = FIND the decision-maker; Folk = OWN the relationship.
 */
const API_KEY = process.env.APOLLO_API_KEY;
const SEARCH_URL = "https://api.apollo.io/api/v1/mixed_people/api_search";
const MATCH_URL = "https://api.apollo.io/api/v1/people/match";

// Who buys UA / growth / marketing-art talent, best first.
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
const CONTACTS_PER_COMPANY = 2;
const REVEAL_PER_COMPANY = 1;

const NOT_A_NAME =
  /\b(director|manager|head|lead|officer|marketing|growth|founder|ceo|cto|team|studio|official|admin|the|pocket|sneaky|ninja|gamer|player|guild|clan)\b/i;
const NON_COMPANY_HOST =
  /(^|\.)(linkedin\.com|greenhouse\.io|lever\.co|ashbyhq\.com|workable\.com|teamtailor\.com|recruitee\.com|keka\.com|getro\.com|gohire\.io|indeed\.com|ycombinator\.com)$/i;

export function domainOf(url = "") {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    return NON_COMPANY_HOST.test(h) ? null : h;
  } catch {
    return null;
  }
}

export function looksLikeRealName(name) {
  if (!name) return false;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 4) return false;
  if (NOT_A_NAME.test(name)) return false;
  return parts.every((p) => /^[\p{L}][\p{L}'’.-]*$/u.test(p));
}

function titleRank(title = "") {
  const t = title.toLowerCase();
  for (let i = 0; i < TITLE_PRIORITY.length; i++) {
    const key = TITLE_PRIORITY[i].toLowerCase();
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

/** Find the best decision-maker(s) for a company ({ name, domain }). With
 *  { reveal:true } the top match is enriched (full name/email/LinkedIn, ~1
 *  credit); otherwise names/titles only (cheap preview). */
export async function findForCompany(company, { reveal = false } = {}) {
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
      name: p.first_name,
      title: p.title,
      hasEmail: p.has_email,
      email: null,
      linkedin: null,
      rank: titleRank(p.title),
    }))
    .filter((p) => p.rank > -1)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, CONTACTS_PER_COMPANY);

  const revealOne = async (p) => {
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
      console.warn(`  ! reveal failed @ ${company.name}: ${err.message}`);
    }
  };

  if (reveal) {
    for (const p of people.slice(0, REVEAL_PER_COMPANY)) await revealOne(p);
    const top = people[0];
    const badName = top && top.name && !looksLikeRealName(top.name);
    const noEmail = top && !top.email;
    if (top && (badName || noEmail)) {
      top.flag = badName ? "name-looks-odd" : "no-email";
      const alt = people[1];
      if (alt && alt.apolloId) {
        await revealOne(alt);
        if (looksLikeRealName(alt.name) && (badName || (noEmail && alt.email))) {
          people[0] = alt;
          people[1] = top;
        }
      }
    }
  }
  return people;
}
