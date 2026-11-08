import { randomBytes } from "node:crypto";
import { sendMail } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";
import { grade, readAd } from "@/lib/adGrader";
import { readUpload, MAX_TEXT } from "@/lib/readDoc";

/**
 * POST multipart { email, text? | file?, title?, utm? } (Andre 2026-11-08):
 * reads the ad (pasted or a PDF), scores it, saves it in ad_grades and emails
 * them a link to their analysis. The score never shows on the page itself:
 * the email is the only way to see it, so we know who used the tool.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return Response.json({ error: "Nothing to read." }, { status: 400 });
  const email = String(form.get("email") || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });

  let text = String(form.get("text") || "").slice(0, MAX_TEXT);
  let source = "paste";
  const file = form.get("file");
  if (file instanceof File && file.size) {
    const r = await readUpload(file);
    if ("error" in r) return Response.json({ error: r.error }, { status: 400 });
    text = r.text;
    source = "pdf";
  }
  if (text.split(/\s+/).filter(Boolean).length < 40) return Response.json({ error: "Paste the whole ad, or drop in the PDF." }, { status: 400 });

  const title = String(form.get("title") || "").trim().slice(0, 120) || undefined;
  const result = grade(text, title);
  const id = randomBytes(5).toString("hex");
  let utm: unknown = null;
  try {
    utm = JSON.parse(String(form.get("utm") || "null"));
  } catch {}

  const { error } = await createAdminClient()
    .from("ad_grades")
    .insert({ id, email, title: readAd(text, title).title || null, ad_text: text, score: result.score, result, source, utm });
  if (error) {
    console.error("ad grade save", error);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }

  const prod = process.env.VERCEL_ENV === "production";
  const origin = prod ? SITE : new URL(req.url).origin;
  const link = `${origin}/job-ad-grading-tool/r/${id}?utm_source=email&utm_medium=ad-grade`;
  const html = layout(
    `<p style="margin:0 0 14px">Hi there,</p>
<p style="margin:0 0 6px">Your job ad scored</p>
<p style="margin:0 0 6px;font-size:44px;font-weight:800;line-height:1">${result.score}<span style="font-size:18px;color:#5b5f69">/100</span></p>
<p style="margin:0 0 18px;font-weight:700">${esc(result.band.label)}</p>
<p style="margin:0 0 8px;font-weight:700">The fixes that would make the biggest difference:</p>
<ol style="margin:0 0 18px;padding-left:20px">${result.fixes.map((f) => `<li style="margin:0 0 6px"><b>${esc(f.label)}</b> (+${f.lost})<br><span style="color:#5b5f69">${esc(f.fix)}</span></li>`).join("")}</ol>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="#ff5d00" style="border-radius:999px">
<a href="${link}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">See the full analysis →</a>
</td></tr></table>
<p style="margin:0 0 14px">If you'd rather not do the edits yourself, I'll rewrite it for you by hand and get it to 90+. There's a button for that on your analysis, or just reply to this email.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
    `Your job ad scored ${result.score}/100`,
  );
  const sent = await sendMail({ to: email, subject: `Your job ad scored ${result.score}/100`, html });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });

  if (prod) await toAndre(`📝 Job ad graded: ${result.score}/100 · ${title || "untitled"}\n${email} · ${source}\n${link.split("?")[0]}`).catch(() => {});
  return Response.json({ ok: true, ...(sent.dev ? { devLink: link } : {}) });
}
