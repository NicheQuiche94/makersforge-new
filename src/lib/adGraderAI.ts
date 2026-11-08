/**
 * Claude reads the job ad against Andre's scorecard (2026-11-08). For each
 * point it answers yes / partly / no and quotes or describes what it found;
 * the score is then plain arithmetic in scoreFrom(), so every point is
 * explained and the weights stay ours. The fixes shown are Andre's wording,
 * not Claude's. If the call fails, the caller falls back to the rule reader.
 */
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { CRITERIA, scoreFrom, type Result } from "@/lib/adGrader";

/* What yes / partly / no mean for each point, in Andre's terms. */
const RUBRIC: Record<string, string> = {
  title: "YES: a standard, searchable job title that states the level (e.g. Senior UA Manager). PARTLY: clear title but no level, or unusual wording. NO: missing, or a gimmick title (rockstar, ninja, guru).",
  where: "Many job boards only offer an on-site or remote dropdown (often no hybrid option), so the ad text itself must spell out the real working pattern. YES: says where the role is based AND the exact arrangement in the text: if hybrid, how many days in the office (ideally which days); if remote, which countries or time zones; if on-site, the office location. PARTLY: a location or a remote/hybrid/on-site word without that detail, OR the labels contradict each other (e.g. a header says on-site but the text says hybrid) without the text making the real arrangement clear. NO: nothing on location or working pattern.",
  pay: "YES: a salary or day-rate range with numbers. PARTLY: a single figure, or 'up to X'. NO: no pay, or only 'competitive' / 'DOE'.",
  contract: "YES: says whether it's permanent, fixed-term or freelance/contract, and full- or part-time. PARTLY: only one of those. NO: neither.",
  team: "YES: who they report to AND the team around them (size, roles). PARTLY: only one of those, or vague ('a great team'). NO: nothing about the team. Note: 'build reports to share with stakeholders' is not a reporting line.",
  outcome: "YES: says what this hire must achieve, e.g. what success looks like in the first 6-12 months, or the specific problem they're hired to solve, ideally measurable. PARTLY: some goals or direction, but mostly a list of responsibilities. NO: only duties/responsibilities, nothing on the outcome. Responsibilities are not outcomes.",
  state: "YES: makes clear where the company and the game/app stand now: live, soft launch or in development, plus stage, funding or scale (players, downloads, team size). PARTLY: some context but hard to picture where things are. NO: none.",
  titles: "YES: names the game(s) or app(s) they'd work on, or says openly it's unannounced/under NDA. PARTLY: mentions 'our games' or a genre without naming them. NO: nothing about what they'd work on.",
  musts: "Count the essential requirements. YES: 6 or fewer, each relevant to the job. PARTLY: 7 to 9, or requirements scattered in prose so it's unclear what's essential. NO: 10 or more (a wishlist).",
  nice: "YES: nice-to-haves are in their own short list or clearly marked as optional. PARTLY: some are marked as a plus but mixed into the essentials. NO: everything reads as essential.",
  sane: "YES: the experience asked for fits the level and role. PARTLY: a slight mismatch. NO: clearly inflated (e.g. 8-10+ years for a non-leadership role) or contradictory (lead/manager duties in a junior or mid-level title).",
  process: "YES: says what happens after applying: the stages, who they'll meet, or the timeline. PARTLY: mentions interviews but no steps or timing. NO: nothing.",
  read: "YES: roughly 250-900 words, scannable sections, and a clear way to apply. PARTLY: too thin to judge the role, or so long and dense the key facts get lost. NO: very hard to read.",
};

/* Plain-English keys for the model; mapped back to our ids. */
const KEY: Record<string, string> = {
  title: "job_title_with_level",
  where: "location_and_remote_policy",
  pay: "salary_range_published",
  contract: "contract_type_and_hours",
  team: "reporting_line_and_team",
  outcome: "outcome_the_hire_must_achieve",
  state: "current_state_of_company_and_game",
  titles: "games_or_apps_named",
  musts: "number_of_must_haves",
  nice: "nice_to_haves_kept_separate",
  sane: "no_inflated_or_contradictory_asks",
  process: "hiring_process_stated",
  read: "readable_length_and_how_to_apply",
};

const Answer = z.object({ status: z.enum(["yes", "partly", "no"]), note: z.string().describe("One short sentence: quote the phrase you based this on in curly quotes, or say what's missing. Under 25 words.") });
const Out = z.object({
  title: z.string().describe("The job title as the ad states it"),
  checks: z.object(Object.fromEntries(CRITERIA.map((c) => [KEY[c.id], Answer])) as Record<string, typeof Answer>),
});

export async function gradeWithClaude(text: string, title?: string): Promise<{ result: Result; title: string } | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      output_config: { effort: "low", format: zodOutputFormat(Out) },
      system:
        "You grade job ads for mobile games and consumer-app studios against a fixed scorecard, from the point of view of a strong candidate deciding whether to apply. Judge only what the ad actually says; never assume or invent. Be fair but strict: 'yes' means a candidate would clearly find it. Text in [square brackets] is an unfilled placeholder and counts as missing. Answer every point below, each strictly on its own definition:\n\n" +
        CRITERIA.map((c) => `${KEY[c.id]} (${c.label}): ${RUBRIC[c.id]}`).join("\n"),
      messages: [{ role: "user", content: `${title ? `Job title (given separately): ${title}\n\n` : ""}The job ad:\n\n${text}` }],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) return null;
    const out = response.parsed_output;
    const checks = Object.fromEntries(CRITERIA.map((c) => [c.id, (out.checks as Record<string, { status: "yes" | "partly" | "no"; note: string }>)[KEY[c.id]]]));
    return { result: scoreFrom(checks), title: title || out.title };
  } catch (err) {
    if (err instanceof Anthropic.APIError) console.error("ad grade (claude)", err.status, err.message);
    else console.error("ad grade (claude)", err);
    return null;
  }
}
