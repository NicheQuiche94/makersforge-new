import { randomBytes } from "node:crypto";
import { sendMail } from "@/lib/onboarding/mail";
import { gradeEmail, gradePdfHtml } from "@/lib/adGradeReport";
import { htmlToPdf } from "@/lib/onboarding/pdf";
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
  const docTitle = readAd(text, title).title || undefined;
  const html = gradeEmail(result, docTitle, { online: link, rewrite: `${link}&rewrite=1` });
  // The full breakdown as a PDF to keep or forward; the email still goes if the PDF can't be made.
  const pdf = await htmlToPdf(gradePdfHtml(result, docTitle)).catch((e) => {
    console.error("ad grade pdf", e);
    return null;
  });
  const fileName = `Job ad analysis - ${(docTitle || "your ad").replace(/[^\w ()-]+/g, "").slice(0, 60)}.pdf`;
  const sent = await sendMail({
    to: email,
    subject: `Your job ad scored ${result.score}/100`,
    html,
    attachments: pdf ? [{ filename: fileName, content: pdf }] : undefined,
  });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });

  if (prod) await toAndre(`📝 Job ad graded: ${result.score}/100 · ${title || "untitled"}\n${email} · ${source}\n${link.split("?")[0]}`).catch(() => {});
  return Response.json({ ok: true, ...(sent.dev ? { devLink: link } : {}) });
}
