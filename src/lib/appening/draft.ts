/**
 * Claude drafts the short take for each spotlight (Andre 2026-11-10: as
 * automated as possible without compromising quality). Drafts only: every
 * take is read and approved by Andre in the admin before an issue can be
 * approved. Facts come only from the store listing and the studio's own
 * pitch, never invented.
 */
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { Entry } from "./data";

const Out = z.object({
  take: z.string().describe("The take: 2 short sentences, under 40 words in total."),
  checks: z.string().describe("Anything in the take Andre should double-check against the listing, or 'none'."),
});

const SYSTEM = `You write the short take for one new mobile game or app in "What's Appening", MakersForge's spotlight on new mobile releases, read by people who build mobile games and apps.

Rules:
- 2 short sentences, under 40 words in total. Plain British English.
- Sentence 1: what it is, concretely (genre, the core idea, who it's for).
- Sentence 2: the one thing that makes it worth a look for someone in the industry (a fresh mechanic, a smart monetisation or onboarding choice, a niche it serves well, the team behind it).
- Use only facts from the store listing and what the studio told us. Never invent numbers, awards, team history or features.
- No hype words (revolutionary, game-changing, stunning, addictive, must-play), no exclamation marks, no emoji, no em dashes, no questions.
- Don't start with the app's name. Don't repeat the studio's one-liner; add to it.`;

export async function draftTake(e: Pick<Entry, "name" | "publisher" | "genre" | "edition" | "store_text" | "pitch" | "release_date" | "tagline" | "highlights" | "model" | "team" | "markets" | "proof">) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const client = new Anthropic();
    const r = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 1500,
      output_config: { effort: "low", format: zodOutputFormat(Out) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            `${e.edition === "games" ? "Game" : "App"}: ${e.name}`,
            e.publisher && `Studio: ${e.publisher}`,
            e.genre && `Genre: ${e.genre}`,
            e.release_date && `Release date: ${e.release_date}`,
            e.tagline && `The studio's one-liner: ${e.tagline}`,
            e.highlights?.length && `What the studio says makes it special:\n- ${e.highlights.join("\n- ")}`,
            e.model && `Business model: ${e.model}`,
            e.team && `Team: ${e.team}`,
            e.markets && `Where it's live: ${e.markets}`,
            e.proof && `Proof point from the studio: ${e.proof}`,
            e.pitch && `The studio's note: ${e.pitch}`,
            `Store listing:\n${(e.store_text || "(none)").slice(0, 3000)}`,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });
    if (r.stop_reason === "refusal" || !r.parsed_output) return null;
    const { take, checks } = r.parsed_output;
    return { take: take.trim(), checks: /^none\.?$/i.test(checks.trim()) ? null : checks.trim() };
  } catch (err) {
    console.error("appening draft", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
    return null;
  }
}
