import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { SKILLS, guessSkills } from "@/lib/hiringNeeds";

/**
 * POST { problem, outcome } → { skills, summary, by } (Andre 2026-11-08).
 * "What am I hiring for?" asks the problem in their own words; Claude reads
 * it and suggests which skills fixing it takes, with a one-line restatement
 * so they can check we understood. Without ANTHROPIC_API_KEY, or if the
 * call fails, a keyword match makes a best guess.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const IDS = SKILLS.map((s) => s.id) as [string, ...string[]];
const Out = z.object({
  summary: z.string().describe("One sentence restating their problem and the outcome they want, in plain words, starting 'You need to'"),
  skills: z.array(z.enum(IDS)).describe("The 1 to 4 skills that solving this most directly takes, most important first"),
});

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const problem = String(b.problem || "").slice(0, 2000);
  const outcome = String(b.outcome || "").slice(0, 1000);
  if (problem.trim().length < 5) return Response.json({ error: "Tell us a bit about the problem first." }, { status: 400 });

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic();
      const response = await client.messages.parse({
        model: "claude-opus-5-5",
        max_tokens: 1000,
        output_config: { effort: "low", format: zodOutputFormat(Out) },
        system:
          "You help mobile games and app studios work out what to hire, from first principles: a hire exists to achieve an outcome the current team can't. From the problem and outcome they describe, pick the skills that solving it most directly takes. Prefer fewer, more central skills. Skills: " +
          SKILLS.map((s) => `${s.id} = ${s.label}`).join("; "),
        messages: [{ role: "user", content: `The problem, in their words:\n${problem}\n\nWhat fixed would look like:\n${outcome || "(not given)"}` }],
      });
      if (response.stop_reason !== "refusal" && response.parsed_output) return Response.json({ ...response.parsed_output, by: "ai" });
    } catch (err) {
      if (err instanceof Anthropic.APIError) console.error("hiring-needs", err.status, err.message);
      else console.error("hiring-needs", err);
    }
  }
  return Response.json({ skills: guessSkills(`${problem} ${outcome}`), summary: "", by: "keywords" });
}
