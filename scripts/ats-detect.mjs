/**
 * ATS detector (Andre 2026-07-20) — the custom-career-site unlock.
 *
 * Most "custom" studio career sites are a known ATS under the hood. For each
 * company this fetches its careers page, detects the ATS, extracts the slug,
 * and (for the ATSs the ingester supports) verifies the live in-remit role
 * count. Prints ready-to-paste sources.json entries for the hits.
 *
 *   node scripts/ats-detect.mjs
 *
 * Supported by the ingester now: greenhouse, lever, ashby, workable, teamtailor.
 * Others (comeet, recruitee, smartrecruiters, personio, join) are reported so
 * we know which fetchers to add next.
 */

import { pathToFileURL } from "node:url";
import { categoryFor } from "./serpapi.mjs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

// { name, domain, sector }. Domains are best guesses — a miss just reports "no
// careers page found", correct it and re-run.
const CANDIDATES = [
  { name: "Kwalee", domain: "kwalee.com", sector: "games" },
  { name: "MoonActive", domain: "moonactive.com", sector: "games" },
  { name: "Popcore", domain: "popcore.com", sector: "games" },
  { name: "YSO Corp", domain: "ysocorp.com", sector: "games" },
  { name: "8sec", domain: "8sec.games", sector: "games" },
  { name: "Peak", domain: "peak.com", sector: "games" },
  { name: "Rollic", domain: "rollicgames.com", sector: "games" },
  { name: "Spyke Games", domain: "spykegames.com", sector: "games" },
  { name: "Tactile Games", domain: "tactilegames.com", sector: "games" },
  { name: "SYBO", domain: "sybo.com", sector: "games" },
  { name: "Miniclip", domain: "miniclip.com", sector: "games" },
  { name: "TapNation", domain: "tap-nation.io", sector: "games" },
  { name: "Socialpoint", domain: "socialpoint.es", sector: "games" },
  { name: "Quiet", domain: "quiet.app", sector: "apps" },
  { name: "Kuuasema", domain: "kuuasema.com", sector: "games" },
  { name: "Huuuge Games", domain: "huuugegames.com", sector: "games" },
  { name: "Metacore", domain: "metacore.com", sector: "games" },
  { name: "Redhill Games", domain: "redhillgames.com", sector: "games" },
  { name: "Traplight", domain: "traplightgames.com", sector: "games" },
  { name: "Nitro Games", domain: "nitrogames.com", sector: "games" },
  { name: "Fingersoft", domain: "fingersoft.com", sector: "games" },
  { name: "Seriously", domain: "seriously.com", sector: "games" },
  { name: "Futureplay", domain: "futureplay.co", sector: "games" },
  { name: "Reworks", domain: "reworks.co", sector: "games" },
  { name: "Savage Game Studios", domain: "savagegamestudios.com", sector: "games" },
];

const PATHS = ["/careers", "/careers/", "/jobs", "/jobs/", "/career", "/join-us", "/about/careers", "/company/careers", "/"];

const ATS_PATTERNS = {
  greenhouse: /(?:boards|job-boards)\.greenhouse\.io\/(?:embed\/job_board\?for=)?([a-z0-9]+)|greenhouse\.io\/embed\/job_board\?for=([a-z0-9]+)/i,
  lever: /jobs\.lever\.co\/([a-z0-9-]+)|api\.lever\.co\/v0\/postings\/([a-z0-9-]+)/i,
  ashby: /jobs\.ashbyhq\.com\/([a-z0-9-]+)/i,
  workable: /([a-z0-9-]+)\.workable\.com|apply\.workable\.com\/([a-z0-9-]+)/i,
  teamtailor: /([a-z0-9-]+)\.teamtailor\.com/i,
  recruitee: /([a-z0-9-]+)\.recruitee\.com/i,
  smartrecruiters: /careers\.smartrecruiters\.com\/([A-Za-z0-9._-]+)|smartrecruiters\.com\/([A-Za-z0-9._-]+)/i,
  personio: /([a-z0-9-]+)\.jobs\.personio\.(?:com|de)/i,
  comeet: /comeet\.co\/jobs\/([^\/"']+)/i,
  join: /join\.com\/companies\/([a-z0-9-]+)/i,
};
const SUPPORTED = new Set(["greenhouse", "lever", "ashby", "workable", "teamtailor"]);

async function getText(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(11000) });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}
async function getJson(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(9000) });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

function detect(html) {
  for (const [ats, re] of Object.entries(ATS_PATTERNS)) {
    const m = re.exec(html);
    if (m) return { ats, slug: m.slice(1).find(Boolean) };
  }
  return null;
}

async function verify(ats, slug) {
  const map = {
    greenhouse: [`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`, (d) => (d.jobs || []).map((x) => x.title)],
    lever: [`https://api.lever.co/v0/postings/${slug}?mode=json`, (d) => (Array.isArray(d) ? d.map((x) => x.text) : [])],
    ashby: [`https://api.ashbyhq.com/posting-api/job-board/${slug}`, (d) => (d.jobs || []).map((x) => x.title)],
    workable: [`https://apply.workable.com/api/v1/widget/accounts/${slug}`, (d) => (d.jobs || []).map((x) => x.title)],
    teamtailor: [`https://${slug}.teamtailor.com/jobs.json`, (d) => (d.data || d.jobs || []).map((x) => x.title || x.attributes?.title)],
  };
  if (!map[ats]) return null;
  const [url, ex] = map[ats];
  const d = await getJson(url);
  if (!d) return null;
  const titles = (ex(d) || []).filter(Boolean);
  return { total: titles.length, inRemit: titles.filter((t) => categoryFor(t)) };
}

async function probe(c) {
  for (const p of PATHS) {
    const html = await getText(`https://www.${c.domain}${p}`);
    if (!html) continue;
    const hit = detect(html);
    if (hit && hit.slug) {
      const v = SUPPORTED.has(hit.ats) ? await verify(hit.ats, hit.slug) : null;
      return { ...c, ...hit, path: p, verify: v };
    }
  }
  return { ...c, ats: null };
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
  }));
  return out;
}

/** Probe a list of {name, domain, sector} candidates, log findings, and return
 *  the ones ready to add to sources.json (supported ATS, verified in-remit). */
export async function runDetection(candidates) {
  const results = await mapLimit(candidates, 6, probe);
  console.log("\n=== ATS detection ===");
  const addable = [];
  for (const r of results) {
    if (!r.ats) { console.log(`· ${r.name} (${r.domain}): no ATS found on careers page`); continue; }
    const v = r.verify;
    const tag = SUPPORTED.has(r.ats) ? (v ? `${v.total} roles, ${v.inRemit.length} in-remit` : "verify failed") : "(fetcher not built yet)";
    console.log(`✓ ${r.name}: ${r.ats}/${r.slug} — ${tag}`);
    if (SUPPORTED.has(r.ats) && v && v.inRemit.length) {
      console.log(`     in-remit: ${v.inRemit.slice(0, 3).join(" | ")}`);
      addable.push({ ats: r.ats, slug: r.slug, name: r.name, url: `https://www.${r.domain}`, sector: r.sector });
    }
  }
  console.log(`\n=== ${addable.length} ready to add to sources.json (supported ATS, in-remit roles) ===`);
  console.log(JSON.stringify(addable, null, 2));
  const unsupported = results.filter((r) => r.ats && !SUPPORTED.has(r.ats));
  if (unsupported.length)
    console.log(`\nDetected but no fetcher yet: ${unsupported.map((r) => `${r.name}=${r.ats}`).join(", ")}`);
  return { results, addable };
}

export { probe, detect, verify, SUPPORTED };

// Run the built-in EU-studio candidate list only when invoked directly.
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  await runDetection(CANDIDATES);
}
