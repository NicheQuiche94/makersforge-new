import { sendMail, ANDRE } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST { id } (Andre 2026-11-08): "rewrite my ad" from an analysis page.
 * Marks the request, sends Andre the ad (email + Telegram) and confirms to
 * them. Andre then rewrites it by hand.
 */
export const runtime = "nodejs";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const { id, note } = await req.json().catch(() => ({}));
  if (!/^[a-f0-9]{10}$/.test(String(id || ""))) return Response.json({ error: "That analysis wasn't found." }, { status: 404 });
  const db = createAdminClient();
  const { data: row } = await db.from("ad_grades").select("id, email, title, ad_text, score, rewrite_requested_at").eq("id", id).maybeSingle();
  if (!row) return Response.json({ error: "That analysis wasn't found." }, { status: 404 });
  if (row.rewrite_requested_at) return Response.json({ ok: true, already: true });

  const origin = new URL(req.url).origin;
  // Andre's copy is the one that matters: if it can't be sent, say so rather than pretend.
  const toAndreMail = await sendMail({
    to: ANDRE,
    replyTo: row.email,
    subject: `Rewrite request: ${row.title || "job ad"} (${row.score}/100)`,
    html: layout(
      `<p style="margin:0 0 10px"><b>${esc(row.email)}</b> wants their job ad rewritten.</p>
<p style="margin:0 0 10px">Score: ${row.score}/100 · <a href="${origin}/job-ad-grading-tool/r/${row.id}">their analysis</a></p>
${note ? `<p style="margin:0 0 10px"><b>Their note:</b> ${esc(String(note))}</p>` : ""}
<pre style="white-space:pre-wrap;font:13px/1.5 ui-monospace,monospace;background:#f6f6f6;padding:14px;border-radius:8px">${esc(row.ad_text)}</pre>`,
      "Rewrite request",
    ),
  }).catch(() => ({ ok: false as const }));
  if (!toAndreMail.ok) return Response.json({ error: "That didn't go through. Please try again, or reply to your analysis email." }, { status: 502 });
  await db.from("ad_grades").update({ rewrite_requested_at: new Date().toISOString(), rewrite_note: String(note || "").slice(0, 1000) || null }).eq("id", id);
  await sendMail({
    to: row.email,
    subject: "I'll rewrite your job ad",
    html: layout(
      `<p style="margin:0 0 14px">Hi there,</p>
<p style="margin:0 0 14px">Thanks: I've got your ad and I'll rewrite it myself, by hand. You'll have it back within 2 working days. If there's anything I should know first (things you can't say publicly, the salary range, the team), just reply to this email.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
      "Your rewrite is on its way",
    ),
  }).catch(() => {});
  if (process.env.VERCEL_ENV === "production") await toAndre(`✍️ Rewrite requested: ${row.title || "job ad"} (${row.score}/100)\n${row.email}`).catch(() => {});
  return Response.json({ ok: true });
}
