import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/**
 * POST multipart { text?, file? } → { role, location, budget, musts }
 * "Fill in from the spec" on /start (Ashley's QA, 2026-11-05: it used to
 * paste the same sample role whatever you gave it). Claude reads the pasted
 * text or the PDF; without ANTHROPIC_API_KEY, or if the call fails, a plain
 * text parser makes a best guess so the button still does something real.
 * Fields it can't find come back empty rather than invented.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const Spec = z.object({
  role: z.string().describe("The job title, as the spec states it"),
  location: z.string().describe("Where the role is based and the work pattern, e.g. 'Remote (UK / EU)', 'Hybrid, London'"),
  budget: z.string().describe("Salary or day rate range as written, e.g. '£70k to £85k'"),
  musts: z.string().describe("The 2 or 3 most important requirements, joined with ' · ', under 120 characters"),
});
type SpecFields = z.infer<typeof Spec>;
const EMPTY: SpecFields = { role: "", location: "", budget: "", musts: "" };

const MAX_TEXT = 40_000;
const MAX_FILE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return Response.json({ error: "Nothing to read." }, { status: 400 });
  const text = String(form.get("text") || "").slice(0, MAX_TEXT);
  const file = form.get("file");
  let pdf: string | null = null;
  let fileText = "";
  if (file instanceof File && file.size) {
    if (file.size > MAX_FILE) return Response.json({ error: "That file is over 10MB." }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") pdf = buf.toString("base64");
    else if (/\.txt$/i.test(file.name)) fileText = buf.toString("utf8").slice(0, MAX_TEXT);
  }
  const source = [text, fileText].filter(Boolean).join("\n\n");
  if (!source.trim() && !pdf)
    return Response.json({ error: "Paste the spec (or a few lines), or attach it as a PDF, and we'll fill these in." }, { status: 400 });

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic();
      const response = await client.messages.parse({
        model: "claude-opus-5-5",
        max_tokens: 2000,
        output_config: { effort: "low", format: zodOutputFormat(Spec) },
        system:
          "You read job specs for a games and apps recruiter and pull out four fields for the booking form. Use the spec's own wording. If a field isn't in the spec, return an empty string for it; never guess a salary or location.",
        messages: [
          {
            role: "user",
            content: [
              ...(pdf ? [{ type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: pdf } }] : []),
              { type: "text" as const, text: source.trim() ? `The job spec:\n\n${source}` : "The job spec is the attached PDF." },
            ],
          },
        ],
      });
      if (response.stop_reason !== "refusal" && response.parsed_output) return Response.json({ ...response.parsed_output, by: "ai" });
    } catch (err) {
      if (err instanceof Anthropic.APIError) console.error("parse-spec", err.status, err.message);
      else console.error("parse-spec", err);
    }
  }
  if (!source.trim()) return Response.json({ ...EMPTY, by: "none", error: "We couldn't read that PDF here. Paste the text instead, or fill the fields in." });
  return Response.json({ ...guess(source), by: "text" });
}

/* Best-effort text parser (no API key, or the call failed). */
function guess(s: string): SpecFields {
  const lines = s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const title =
    s.match(/(?:job title|position|role)\s*[:\-–]\s*([^\n]{3,70})/i)?.[1] ||
    s.match(/(?:looking for|hiring|seeking|recruiting)\s+(?:an?\s+)?(?:(?:passionate|talented|experienced|exceptional|ambitious|driven)\s+)*([A-Z][\w/&+\- ]{2,60}?)(?=\s+(?:who|to|that|with|for|in|at)\b|[.,\n])/)?.[1] ||
    // Short notes ("Senior UA Manager, remote, …"): the title is the first phrase.
    (lines.find((l) => !/^[\w ]{2,25}:/.test(l)) || "").split(/[,;(|–-]/)[0].slice(0, 70);
  const where = (
    s.match(/(?:location|based in)\s*[:\-–]?\s*([^\n.]{3,40})/i)?.[1] ||
    s.match(/\b(fully remote|remote(?:\s*\([^)\n]{1,25}\))?|hybrid(?:\s*\([^)\n]{1,25}\))?|on-?site|office-based)/i)?.[1] ||
    ""
  ).trim();
  // Pay only when it reads as pay (salary/rate/package, or a £/€ figure), not ad spend like "$100k a day".
  const payLine = lines.find((l) => /salary|compensation|package|pay\b|day rate|per annum|\bp\.?a\.?\b|\bbudget\b/i.test(l)) || (/[£€]\s?\d/.test(s) ? s : "");
  const money = payLine.match(/([£$€]\s?\d[\d,.]*\s?k?)\s*(?:-|–|to)\s*([£$€]?\s?\d[\d,.]*\s?k?)/i);
  const budget = money ? `${money[1].replace(/\s/g, "")} to ${money[2].replace(/\s/g, "")}` : payLine.match(/[£$€]\s?\d[\d,.]*\s?k?(?:\s*(?:per|a)\s*(?:day|year|annum))?/i)?.[0] || "";
  const reqStart = lines.findIndex((l) => /requirement|what you.ll (?:need|bring)|you have|about you|must have|qualifications|skills/i.test(l));
  const bullets = (reqStart >= 0 ? lines.slice(reqStart + 1) : lines).filter((l) => /^[-•*·▪]|^\d+[.)]\s/.test(l) || (reqStart >= 0 && l.length < 140));
  const musts = bullets
    .filter((l) => !/salary|location|benefits/i.test(l))
    .slice(0, 3)
    .map((l) => l.replace(/^(?:[-•*·▪]|\d+[.)])\s*/, "").replace(/\.$/, ""))
    .join(" · ")
    .slice(0, 160);
  return { role: title.trim(), location: where.trim().replace(/^\w/, (c) => c.toUpperCase()), budget, musts };
}
