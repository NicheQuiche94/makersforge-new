/**
 * Title / location standardisation guardrail (Andre 2026-07-19: some roles
 * came through looking scraped — a "[UPLIVE Company]" bracket prefix, a UK
 * postcode, pipe separators). Used two ways:
 *   1. Imported by scripts/ingest.mjs so every future pull is cleaned before
 *      it's written.
 *   2. Run directly (`node scripts/standardize.mjs`) to clean the existing
 *      src/data/jobs.json in place.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Clean a job title: strip a leading "[Something]" source/product prefix,
 *  tidy spaces inside parens, collapse whitespace. Keeps legit qualifiers
 *  like "(Contract)" / "(Google Ads)". */
export function cleanTitle(raw) {
  if (!raw) return raw;
  return raw
    .replace(/^\s*\[[^\]]*\]\s*/, "") // "[UPLIVE Company] Foo" -> "Foo"
    .replace(/\(\s+/g, "(") // "( App )" -> "(App )"
    .replace(/\s+\)/g, ")") // "(App )" -> "(App)"
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Clean a location: drop UK/Gibraltar-style postcodes, normalise pipe
 *  separators to commas, dedupe repeated parts ("Gibraltar, Gibraltar"). */
export function cleanLocation(raw) {
  if (!raw) return raw;
  let s = raw.replace(/\s*\|\s*/g, ", ");
  // e.g. "GX11 1AA", "SW1A 1AA", "EC1A 1BB"
  s = s.replace(/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s+\d[A-Z]{2}\b/g, "");
  const parts = s
    .split(",")
    .map((p) => p.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean)
    .filter((p, i, arr) => i === 0 || p.toLowerCase() !== arr[i - 1].toLowerCase());
  return parts.join(", ").replace(/\s{2,}/g, " ").trim();
}

/** Apply both to a job object in place; returns it. */
export function standardizeJob(job) {
  if (job.title) job.title = cleanTitle(job.title);
  if (job.location) job.location = cleanLocation(job.location);
  return job;
}

// --- CLI: clean the existing jobs.json in place -----------------------------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const path = new URL("../src/data/jobs.json", import.meta.url);
  const jobs = JSON.parse(readFileSync(path, "utf8"));
  let titleChanges = 0;
  let locChanges = 0;
  for (const job of jobs) {
    const t0 = job.title;
    const l0 = job.location;
    standardizeJob(job);
    if (job.title !== t0) titleChanges++;
    if (job.location !== l0) locChanges++;
  }
  writeFileSync(path, JSON.stringify(jobs, null, 2) + "\n");
  console.log(
    `standardised ${jobs.length} jobs · ${titleChanges} titles, ${locChanges} locations cleaned`,
  );
}
