/**
 * Generalist or specialist (Andre 2026-11-08, DRAFT parameters for the
 * mockup: "we will need specific parameters that we never change").
 *
 * A hire is SPECIALIST if any one of these is true, otherwise GENERALIST:
 *   1. Salary: full-time base of £70,000+ (€80,000+, $90,000+).
 *   2. Seniority: Head, Director, VP or C-level, in any discipline.
 *   3. Revenue-critical family at Lead level or above: user acquisition /
 *      paid growth, monetisation (ads or IAP), live-ops or CRM / retention,
 *      economy design.
 *
 * Decided from the brief (role title + budget), shown to the client with the
 * reason; never picked by the client. One function, so the final parameters
 * drop in here and every price on the site follows.
 */
export type Tier = "generalist" | "specialist";
export type TierResult = { tier: Tier; reason: string; salaryGBP: number | null };

export const SALARY_LINE = { GBP: 70_000, EUR: 80_000, USD: 90_000 } as const;
const SENIOR = /\b(head|director|vp|vice president|chief|cmo|cgo|cto|cpo|coo|ceo|c-level)\b/i;
const LEAD_UP = /\b(lead|principal|staff|head|director|vp|vice president|chief)\b/i;
const FAMILY: { re: RegExp; label: string }[] = [
  { re: /\b(user acquisition|ua|paid (growth|acquisition|social|media)|performance marketing|growth)\b/i, label: "user acquisition / growth" },
  { re: /\b(monetis|monetiz|ad ops|ads? revenue|iap|in-app purchases?|pricing)\w*/i, label: "monetisation" },
  { re: /\b(live ?ops|crm|retention|lifecycle)\b/i, label: "live-ops / retention" },
  { re: /\b(economy|economist)\b/i, label: "economy design" },
];

/** "£70k–£85k", "80,000 EUR", "$120k", "85000" → the top of the range in £ (null if no figure, or a day rate). */
export function salaryGBP(budget = ""): number | null {
  const t = budget.replace(/,/g, "");
  if (/\b(day|daily|per day|p\/d|hour|hourly)\b/i.test(t)) return null;
  const nums = [...t.matchAll(/(\d+(?:\.\d+)?)\s*(k|K)?/g)].map((m) => Number(m[1]) * (m[2] ? 1000 : 1)).filter((n) => n >= 10_000 && n <= 2_000_000);
  if (!nums.length) return null;
  const top = Math.max(...nums);
  const cur = /€|eur/i.test(t) ? "EUR" : /\$|usd/i.test(t) ? "USD" : "GBP";
  // Compare against the line in the brief's own currency, expressed in £ so callers get one number.
  return Math.round((top / SALARY_LINE[cur]) * SALARY_LINE.GBP);
}

export function tierFor(title = "", budget = ""): TierResult {
  const s = salaryGBP(budget);
  if (s !== null && s >= SALARY_LINE.GBP) return { tier: "specialist", reason: "Salary of £70,000 or more", salaryGBP: s };
  if (SENIOR.test(title)) return { tier: "specialist", reason: "Head, Director, VP or C-level role", salaryGBP: s };
  const fam = FAMILY.find((f) => f.re.test(title));
  if (fam && LEAD_UP.test(title)) return { tier: "specialist", reason: `Lead-level ${fam.label} role`, salaryGBP: s };
  return { tier: "generalist", reason: title.trim() ? "Below specialist level and salary" : "Add the role to see its tier", salaryGBP: s };
}
