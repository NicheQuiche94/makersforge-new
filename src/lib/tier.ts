/**
 * Team, Senior or Executive (Andre 2026-11-09). The tier is the level in the
 * job title, nothing else: it's the one thing every client agrees on, and it
 * isn't years of experience.
 *
 *   Executive: Head, Director, VP, C-level, GM
 *   Senior:    Senior, Lead, Principal, Staff
 *   Team:      Junior, Associate, Mid-level, or no level given
 *
 * One function, so every price on the site follows it.
 */
export type Tier = "team" | "senior" | "executive";
export type TierResult = { tier: Tier; reason: string };

const EXECUTIVE = /\b(head|director|vp|svp|evp|vice president|chief|c-level|ceo|cto|cmo|cpo|coo|cfo|cgo|cro|gm|general manager|managing director)\b/i;
const SENIOR = /\b(senior|sr\.?|lead|principal|staff)\b/i;

export function tierFor(title = ""): TierResult {
  const t = title.trim();
  if (!t) return { tier: "team", reason: "Add the job title to see its tier" };
  if (EXECUTIVE.test(t)) return { tier: "executive", reason: "Head, Director, VP, C-level or GM role" };
  if (SENIOR.test(t)) return { tier: "senior", reason: "Senior, Lead, Principal or Staff role" };
  return { tier: "team", reason: "Junior to mid-level role" };
}
