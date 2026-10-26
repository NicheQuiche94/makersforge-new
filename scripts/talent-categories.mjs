/**
 * Merges the per-candidate classifications (talent/.cache/classify/out-*.json)
 * into candidates.json and writes talent/CATEGORIES.md: counts per discipline
 * and sub-discipline, plus the best 10 per discipline for Andre's consent
 * outreach. Private: everything stays in the gitignored /talent folder.
 *
 *   node scripts/talent-categories.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("talent");
const DIR = path.join(ROOT, ".cache", "classify");
const CANDS = path.join(ROOT, "candidates.json");

const LABEL = {
  ua_growth: "UA & growth",
  creative_marketing: "Marketing art & motion",
  art: "Game art",
  game_design: "Game design",
  ui_ux: "Product UI/UX",
  engineering: "Engineering",
  qa: "QA",
  product_production: "Product & production",
  data_ml: "Data & ML",
  other: "Other",
};
const SUB = (s) => s.replace(/_/g, " ").replace(/\b(ua|aso|ui|ux|ai|ml|qa|gm|sdk|2d|3d)\b/gi, (m) => m.toUpperCase());

const outs = fs.readdirSync(DIR).filter((f) => /^out-\d+\.json$/.test(f));
const cls = Object.fromEntries(outs.flatMap((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"))).map((c) => [c.id, c]));
const cands = JSON.parse(fs.readFileSync(CANDS, "utf8"));
for (const c of cands) if (cls[c.id]) c.classification = cls[c.id];
fs.writeFileSync(CANDS, JSON.stringify(cands, null, 2));

const rows = cands.filter((c) => c.classification);
const avail = { immediate: 3, weeks: 2, months: 1, unknown: 1 };
const rank = (a, b) =>
  b.classification.quality - a.classification.quality ||
  Number(b.classification.mobileFocus) - Number(a.classification.mobileFocus) ||
  (avail[b.classification.availability] || 0) - (avail[a.classification.availability] || 0) ||
  (b.spec ? 1 : 0) - (a.spec ? 1 : 0);

let md = `# Talent Directory categories\n\n${rows.length} interviewed candidates classified from recruiter summaries and call notes (${new Date().toISOString().slice(0, 10)}).\n\n## Counts\n\n| Discipline | Total | Mobile-focused | Quality 4–5 | Sub-disciplines |\n|---|---|---|---|---|\n`;
const byDisc = {};
for (const c of rows) (byDisc[c.classification.discipline] ||= []).push(c);
const order = Object.keys(LABEL).filter((d) => byDisc[d]).sort((a, b) => byDisc[b].length - byDisc[a].length);
for (const d of order) {
  const list = byDisc[d];
  const subs = {};
  for (const c of list) subs[c.classification.subDiscipline] = (subs[c.classification.subDiscipline] || 0) + 1;
  const subStr = Object.entries(subs).sort((a, b) => b[1] - a[1]).map(([s, n]) => `${SUB(s)} ${n}`).join(" · ");
  md += `| ${LABEL[d]} | ${list.length} | ${list.filter((c) => c.classification.mobileFocus).length} | ${list.filter((c) => c.classification.quality >= 4).length} | ${subStr} |\n`;
}

const tally = (key) => {
  const t = {};
  for (const c of rows) for (const v of c.classification[key] || []) t[v] = (t[v] || 0) + 1;
  return Object.entries(t).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(" · ");
};
md += `\n**Game genres:** ${tally("gameGenres")}\n\n**Monetisation:** ${tally("monetisation")}\n\n**Engines:** ${tally("engines")}\n\n`;

md += `## Best 10 per discipline\n\nRanked by quality, then mobile focus, availability, and having a full spec. Contact = where to ask for consent.\n`;
for (const d of order) {
  md += `\n### ${LABEL[d]}\n\n| # | Candidate | Sub-discipline | Q | Headline | Flags | Contact |\n|---|---|---|---|---|---|---|\n`;
  byDisc[d].sort(rank).slice(0, 10).forEach((c, i) => {
    const k = c.classification;
    const contact = c.contact.linkedin ? `[LinkedIn](${c.contact.linkedin})` : c.contact.email ? "email in Folk" : "LinkedIn Recruiter thread";
    md += `| ${i + 1} | ${c.fullName} | ${SUB(k.subDiscipline)} | ${k.quality} | ${k.headline} | ${(k.flags || []).join(", ") || "-"} | ${contact} |\n`;
  });
}
fs.writeFileSync(path.join(ROOT, "CATEGORIES.md"), md);
console.log(`classified ${rows.length}/${cands.filter((c) => ["ready", "spec-gaps", "notes-only", "thin"].includes(c.bucket)).length}`);
console.log(order.map((d) => `${LABEL[d]} ${byDisc[d].length}`).join(" | "));
