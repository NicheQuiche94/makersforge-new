/**
 * Hot leads — outreach-timing signal from how long a role has been open.
 *
 * A fresh post means the company is still working its own network (too early to
 * pitch). A role open for weeks and still unfilled means their search is
 * failing — they're hungry, and that's prime time to reach out (Andre 2026-08-04:
 * "a repost shows they're having no luck… sell them the fillet"). Most ATSs
 * don't expose an actual repost (Lever keeps the original createdAt, LinkedIn
 * reposts are invisible), so DAYS-OPEN is the reliable proxy for the same
 * signal. (True repost detection — a posted_at that jumps forward — is layered
 * on separately via role-history once we track it across ingests.)
 *
 * Ranks live in-remit roles by age and writes docs/hot-leads.md.
 * Run: node scripts/hot-leads.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DAY = 86400000;

function ageDays(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return null;
  return Math.floor((Date.now() - new Date(iso + "T00:00:00Z").getTime()) / DAY);
}

// Evergreen / perpetual reqs — not a real "struggling" signal, exclude from the
// hunger ranking (big studios keep these always-open).
const EVERGREEN =
  /\btalent (pool|community|network)\b|general application|speculative|open application|always hiring|future opportunit|expression of interest/i;

// Outreach-timing verdict on Andre's cadence (day 10 first check-in, day 14
// jump in, day 20 second check-in). Very old = probably evergreen, deprioritise.
function verdict(age) {
  if (age == null) return { tier: 9, label: "no date" };
  if (age >= 90) return { tier: 8, label: `⏳ ${age}d — likely evergreen, deprioritise` };
  if (age >= 60) return { tier: 5, label: `${age}d open — aging, still worth a look` };
  if (age >= 20) return { tier: 1, label: `🔥 ${age}d — SECOND check-in due, they're stuck` };
  if (age >= 14) return { tier: 2, label: `🎯 ${age}d — JUMP IN (crossed 14d)` };
  if (age >= 10) return { tier: 3, label: `${age}d — first check-in window (day 10)` };
  return { tier: 4, label: `${age}d — fresh, too early` };
}

async function main() {
  const raw = JSON.parse(await readFile(join(ROOT, "src", "data", "jobs.json"), "utf8"));
  const jobs = Array.isArray(raw) ? raw : raw.jobs || [];
  const today = new Date().toISOString().slice(0, 10);

  // Live in-remit roles (everything in jobs.json is in-remit; keep non-expired).
  const live = jobs.filter((j) => (j.expires_at || "9999") >= today);

  // Per company, the oldest still-open role drives the hunger ranking.
  const byCompany = new Map();
  for (const j of live) {
    const age = ageDays(j.posted_at);
    const name = j.company?.name || "?";
    const e = byCompany.get(name) || { name, sector: j.company?.sector, roles: [] };
    e.roles.push({ title: j.title, age, category: j.category, slug: j.slug });
    byCompany.set(name, e);
  }
  // A company's hunger = its oldest NON-evergreen role.
  for (const c of byCompany.values()) for (const r of c.roles) r.evergreen = EVERGREEN.test(r.title);
  const ranked = [...byCompany.values()].map((c) => {
    c.actionable = c.roles.filter((r) => !r.evergreen && r.age != null).sort((a, b) => b.age - a.age);
    c.maxAge = c.actionable[0]?.age ?? null;
    return c;
  });
  const window = (lo, hi) => ranked.filter((c) => c.maxAge != null && c.maxAge >= lo && c.maxAge < hi).sort((a, b) => b.maxAge - a.maxAge);
  const jumpIn = window(14, 60);      // the hunger window — reach out
  const firstCheck = window(10, 14);  // day-10 first touch
  const aging = window(60, 90);       // still worth a look
  const rolesList = (c, min) => c.actionable.filter((r) => r.age >= min).slice(0, 3).map((r) => `  - ${r.title} · ${r.age}d`);

  const out = ["# Priority leads — outreach timing", ""];
  out.push(
    `Cadence: **day 10** first check-in · **day 14** jump in · **day 20** second check-in. A role open **14–60d and still unfilled = their search is failing → reach out**. 90d+ / talent-pool treated as evergreen and dropped. ${live.length} live roles, ${ranked.length} companies. Generated ${today}.`,
    "",
    `## 🎯 PRIORITY — ${jumpIn.length} companies, role open 14–60d`,
    "",
  );
  for (const c of jumpIn) out.push(`- **${c.name}** — ${verdict(c.maxAge).label}`, ...rolesList(c, 14));
  out.push("", `## First check-in (day 10–13) — ${firstCheck.length}`, "");
  for (const c of firstCheck) out.push(`- **${c.name}** — ${c.actionable[0]?.title} · ${c.maxAge}d`);
  out.push("", `## Aging 60–90d (worth a look) — ${aging.length}`, "");
  for (const c of aging) out.push(`- **${c.name}** — ${c.actionable[0]?.title} · ${c.maxAge}d`);
  await writeFile(join(ROOT, "docs", "hot-leads.md"), out.join("\n") + "\n", "utf8");

  console.log(`✓ ${jumpIn.length} PRIORITY (14–60d) · ${firstCheck.length} first-check (10–13d) · ${aging.length} aging → docs/hot-leads.md`);
  for (const c of jumpIn.slice(0, 10)) console.log(`  🎯 ${c.name}: ${c.maxAge}d (${c.actionable[0]?.title})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
