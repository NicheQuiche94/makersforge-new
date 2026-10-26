/**
 * Talent Directory source builder (2026-10-26).
 *
 * Reads Andre's Airtable export (talent/source/OpenCandidates.csv), dedupes,
 * pulls the facts out of each Recruiter Summary, matches everyone against Folk
 * for an email / LinkedIn, and sorts them into readiness buckets so we know
 * who can go live the moment consent lands and who needs more info first.
 *
 * Everything it writes lives in /talent, which is GITIGNORED (the repo is
 * public and this is candidate PII). Only consented, anonymised profiles ever
 * reach src/data/roster.ts.
 *
 *   node --env-file=.env.local scripts/talent-build.mjs           # with Folk match
 *   node scripts/talent-build.mjs --no-folk                        # offline
 *
 * Re-running is safe: consent + publish fields already in candidates.json are
 * carried over by id.
 */
import fs from "node:fs";
import path from "node:path";
import { listPeople } from "./folk.mjs";

const ROOT = path.resolve("talent");
const SRC = path.join(ROOT, "source", "OpenCandidates.csv");
const OUT = path.join(ROOT, "candidates.json");
const STATUS = path.join(ROOT, "STATUS.md");
const FOLK_CACHE = path.join(ROOT, ".cache", "folk-people.json");

// ---------- CSV ----------
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.some((v) => v.trim())).map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || "").trim()])));
}

// ---------- helpers ----------
const norm = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const slugify = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Value of a "Label: value" line in a summary block. */
function line(text, ...labels) {
  for (const l of labels) {
    const m = text.match(new RegExp("^\\s*" + l + "\\s*:\\s*(.+)$", "im"));
    if (m && m[1].trim()) return m[1].trim();
  }
  return "";
}

function section(text, label) {
  const m = text.match(new RegExp("^\\s*" + label + "\\s*:?\\s*$([\\s\\S]*?)(?=^\\s*(Experience|Motivations|Recruiter notes|Recruiter Notes|Extra note)[^\\n]*:|$(?![\\s\\S]))", "im"));
  return m ? m[1].trim() : "";
}

const bullets = (block) =>
  block.split(/\n/).map((s) => s.replace(/^\s*[-•]\s*/, "").trim()).filter((s) => s.length > 3);

function linksIn(...texts) {
  const all = texts.join("\n").match(/https?:\/\/[^\s)<>"',]+/g) || [];
  const clean = [...new Set(all.map((u) => u.replace(/[.;]+$/, "")))].filter((u) => !/airtableusercontent/.test(u));
  return {
    linkedin: clean.find((u) => /linkedin\.com\/in\//i.test(u)) || "",
    portfolio: clean.filter((u) => !/linkedin\.com/i.test(u)),
  };
}

const NOT_REAL = /^(test555|andre)$/i;
// Directory remit = mobile games & apps product teams. Ad-tech sales, finance,
// legal etc. were interviewed for other briefs and don't belong on the page.
const OFF_REMIT = /\b(SSP|DSP|ad ?tech|adexchange|publisher (development|partnerships)|supply partnerships|demand side|account manager|business development|BD\b|accountant|accounting|finance|legal|counsel|IP and|licensing deals)/i;
const ON_REMIT = /\b(unity|game design|designer|artist|art lead|art director|UA\b|user acquisition|growth|engineer|developer|QA|producer|product|motion|creative|marketing art|data|analytics|liveops)/i;

const COLUMN_DISC = { Design: "design", Art: "art", "Technical Art": "art", Animation: "creative", Engineering: "engineering",
  "Game Development": "engineering", QA: "qa", "Product/Production": "product", Data: "data", "Live Operations": "product" };

// Same person entered under two spellings: { normalisedName: "Canonical Name" }.
// Lives in /talent (private) so no candidate names sit in public code.
const ALIAS_FILE = path.join(ROOT, "aliases.json");
const ALIASES = fs.existsSync(ALIAS_FILE) ? JSON.parse(fs.readFileSync(ALIAS_FILE, "utf8")) : {};

function guessDiscipline(text) {
  const t = text.toLowerCase();
  if (/\b(ua manager|user acquisition|growth (manager|lead|marketing)|head of ua|performance marketing|head of growth)\b/.test(t)) return "ua";
  if (/\b(marketing artist|motion design|video (artist|editor|designer)|creative (lead|producer|strategist)|ua creative)/.test(t)) return "creative";
  if (/\b(qa |quality assurance|qa lead|tester)/.test(t)) return "qa";
  if (/\b(game designer|level designer|systems designer|ui\/ux designer|ux designer|ui designer|game ui)/.test(t)) return "design";
  if (/\b(artist|art lead|art director|illustrator|2d|3d generalist)/.test(t)) return "art";
  if (/\b(unity developer|engineer|developer|programmer|backend|frontend|devops)/.test(t)) return "engineering";
  if (/\b(analytics engineer|data scientist|machine learning|ml engineer|data analyst)/.test(t)) return "data";
  if (/\b(producer|product manager|head of product|product lead|general manager|production)/.test(t)) return "product";
  return "";
}

// ---------- build ----------
async function main() {
  if (!fs.existsSync(SRC)) { console.error("Missing " + SRC); process.exit(1); }
  const rows = parseCsv(fs.readFileSync(SRC, "utf8"));
  const prev = fs.existsSync(OUT) ? Object.fromEntries(JSON.parse(fs.readFileSync(OUT, "utf8")).map((c) => [c.id, c])) : {};

  // Folk people → index by normalised full name.
  let people = [];
  if (!process.argv.includes("--no-folk")) {
    if (fs.existsSync(FOLK_CACHE) && !process.argv.includes("--refresh")) people = JSON.parse(fs.readFileSync(FOLK_CACHE, "utf8"));
    else if (process.env.FOLK_API_KEY) {
      people = await listPeople(process.env.FOLK_API_KEY);
      fs.mkdirSync(path.dirname(FOLK_CACHE), { recursive: true });
      fs.writeFileSync(FOLK_CACHE, JSON.stringify(people));
    } else console.warn("No FOLK_API_KEY — skipping Folk match.");
  }
  const folkByName = new Map();
  for (const p of people) {
    const n = norm(p.fullName || [p.firstName, p.lastName].filter(Boolean).join(" "));
    if (n) (folkByName.get(n) || folkByName.set(n, []).get(n)).push(p);
  }

  const recs = [];
  for (const r of rows) {
    const summary = r["Recruiter Summary"] || "";
    let notes = r["Raw Notes"] || "";
    // Some rows have the formatted spec pasted into Raw Notes and call notes in Summary.
    let spec = summary;
    if (!/Experience\s*:/i.test(summary) && /Experience\s*:/i.test(notes)) { spec = notes; notes = summary; }
    const hasSpec = /(Name|Reference)\s*:/i.test(spec) && (/Experience\s*:/i.test(spec) || (spec.match(/^\s*-\s+/gm) || []).length >= 3);
    if (!hasSpec && !notes) notes = summary; // call notes typed into the summary column

    const colName = r["Name"].replace(/\s*\(.*?\)\s*/g, " ").trim();
    if (!colName || NOT_REAL.test(colName)) continue;
    const specName = line(spec, "Name").replace(/\s*\(.*?\)\s*/g, " ").trim();
    const fullName = specName && specName.split(/\s+/).length >= 2 ? specName : colName;
    const reference = line(spec, "Reference").replace(/[\[\]]/g, "");

    const location = line(spec, "Location") || [r["City"], r["Country"]].filter(Boolean).join(", ");
    const salary = line(spec, "Salary") || (r["Desired Salary/mo"] ? `${r["Currency"]} ${r["Desired Salary/mo"]}/mo desired (form)` : "");
    const notice = line(spec, "Notice Period/Start date", "Notice Period");
    const title = line(spec, "Current/Most Recent Title", "Current Title", "Title", "Most Recent Title");
    const skills = line(spec, "Skills/tech", "Skills/Tech", "kills/tech", "Skills");
    const links = linksIn(r["Links"], notes, spec);

    const allText = [title, spec, notes, r["Discipline"], r["Sub-Discipline/Skills"]].join("\n");
    const offRemit = r["Sector"] === "AdTech" || /^(Finance|Sales|Business Development)$/.test(r["Discipline"]) ||
      (OFF_REMIT.test(title + " " + notes.slice(0, 600)) && !ON_REMIT.test(title));
    const noContact = /no response yet|no repsone yet/i.test(notes) && notes.length < 160;
    const formOnly = r["Source"] === "Talent Network" && !hasSpec && notes.length < 400;

    const missing = [];
    if (fullName.split(/\s+/).length < 2) missing.push("surname");
    if (!location || /^(uk|remote)$/i.test(location)) missing.push(location ? "city (only 'UK')" : "location");
    if (!salary) missing.push("salary / rate");
    if (!notice) missing.push("notice / start date");
    if (!links.linkedin) missing.push("LinkedIn");

    const canonical = ALIASES[norm(fullName)] || fullName;
    // A lone first name isn't unique ("Lukasz" is two different people), so
    // suffix the date; full names merge across duplicate rows.
    const id = canonical.split(/\s+/).length >= 2 ? slugify(canonical) : slugify(canonical + " " + r["Date Joined"].split(" ")[0]);
    if (/^x+$/i.test(fullName.split(/\s+/)[0])) missing.unshift("real first name");
    const folkHits = folkByName.get(norm(fullName)) || [];
    const emails = [...new Set(folkHits.flatMap((p) => (p.emails || []).map((e) => (typeof e === "string" ? e : e.value || e.email)).filter(Boolean)))];
    const folkLinkedin = folkHits.flatMap((p) => (p.urls || []).map((u) => (typeof u === "string" ? u : u.value))).find((u) => /linkedin/i.test(u || "")) || "";

    let bucket;
    if (offRemit) bucket = "off-remit";
    else if (noContact) bucket = "never-spoke";
    else if (formOnly) bucket = "applied-not-interviewed";
    else if (hasSpec) bucket = missing.filter((m) => m !== "LinkedIn").length ? "spec-gaps" : "ready";
    else if (notes.length >= 400) bucket = "notes-only";
    else bucket = "thin";

    const p = prev[id] || {};
    recs.push({
      id,
      fullName,
      reference,
      dateJoined: r["Date Joined"],
      source: r["Source"],
      bucket,
      discipline: p.discipline || COLUMN_DISC[r["Discipline"]] || guessDiscipline(allText),
      title,
      location,
      salary,
      notice,
      skills,
      missing,
      contact: {
        email: emails[0] || "",
        otherEmails: emails.slice(1),
        linkedin: links.linkedin || folkLinkedin,
        portfolio: links.portfolio,
        inFolk: folkHits.length > 0,
      },
      experience: bullets(section(spec, "Experience")),
      motivations: bullets(section(spec, "Motivations")),
      recruiterNotes: bullets(section(spec, "Recruiter [Nn]otes")),
      spec: hasSpec ? spec : "",
      rawNotes: notes,
      hasCv: !!r["Attachments"],
      applications: r["Applications"],
      // Carried over between runs — the live-state of the pipeline.
      consent: p.consent || { status: "not-asked", date: null, channel: null, note: "" },
      published: p.published || null,
      extra: p.extra || {},
    });
  }

  // Dedupe: same person entered twice → keep the richer record.
  const byId = new Map();
  const score = (c) => (c.spec ? 10000 : 0) + c.rawNotes.length;
  for (const c of recs) {
    const have = byId.get(c.id);
    if (!have) byId.set(c.id, c);
    else {
      const [keep, drop] = score(c) > score(have) ? [c, have] : [have, c];
      keep.duplicateOf = (keep.duplicateOf || []).concat(drop.dateJoined);
      if (!keep.contact.linkedin) keep.contact.linkedin = drop.contact.linkedin;
      byId.set(c.id, keep);
    }
  }
  const out = [...byId.values()].sort((a, b) => a.fullName.localeCompare(b.fullName));
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  fs.writeFileSync(STATUS, statusMd(out, people.length));

  const tally = out.reduce((t, c) => ((t[c.bucket] = (t[c.bucket] || 0) + 1), t), {});
  console.log(`${rows.length} rows → ${out.length} candidates`, tally);
  console.log("with email:", out.filter((c) => c.contact.email).length, "| LinkedIn only:", out.filter((c) => !c.contact.email && c.contact.linkedin).length);
}

function statusMd(list, folkCount) {
  const B = {
    ready: "Ready: full spec, just needs consent",
    "spec-gaps": "Full spec, but a fact is missing",
    "notes-only": "Call notes only: I draft the spec, you fill gaps",
    thin: "Thin notes: need a proper write-up",
    "applied-not-interviewed": "Applied via form, never interviewed (not eligible)",
    "never-spoke": "Contacted, never spoke (not eligible)",
    "off-remit": "Off-remit: ad-tech / finance / legal (not for the directory)",
  };
  const contact = (c) => (c.contact.email ? `email ✓` : c.contact.linkedin ? "LinkedIn only" : "**no contact**");
  let md = `# Talent Directory status\n\nGenerated ${new Date().toISOString().slice(0, 10)} from OpenCandidates.csv (${list.length} people after dedupe; matched against ${folkCount} Folk people).\n\n`;
  for (const [k, label] of Object.entries(B)) {
    const rows = list.filter((c) => c.bucket === k);
    if (!rows.length) continue;
    md += `## ${label} (${rows.length})\n\n| Candidate | Role | Missing | Contact | Consent |\n|---|---|---|---|---|\n`;
    for (const c of rows) md += `| ${c.fullName} | ${(c.title || c.discipline || "").slice(0, 60)} | ${c.missing.join(", ") || "-"} | ${contact(c)} | ${c.consent.status} |\n`;
    md += "\n";
  }
  return md;
}

main().catch((e) => { console.error(e); process.exit(1); });
