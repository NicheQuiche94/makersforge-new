import { randomBytes } from "node:crypto";
import { sendMail } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";
import { brief, type Answers } from "@/lib/hiringNeeds";

/**
 * POST { answers, email, utm? } (Andre 2026-11-08): works out the hire,
 * saves it in hiring_briefs and emails the brief. Nothing shows on the page:
 * giving an email has to be what gets you the result.
 */
export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const INK = "#0e0f11";
const DIM = "#5b5f69";
const HAIR = "#ece7df";
const esc = (s: string) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });
  const a = b.answers as Answers;
  if (!a || typeof a !== "object" || !Array.isArray(a.skills)) return Response.json({ error: "Something's missing. Please go back a step." }, { status: 400 });

  const out = brief(a);
  const id = randomBytes(5).toString("hex");
  const { error } = await createAdminClient().from("hiring_briefs").insert({ id, email, answers: a, brief: out, utm: b.utm ?? null });
  if (error) {
    console.error("hiring brief save", error);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }

  const prod = process.env.VERCEL_ENV === "production";
  const origin = prod ? SITE : new URL(req.url).origin;
  const link = `${origin}/what-am-i-hiring-for/r/${id}?utm_source=email&utm_medium=hiring-brief`;
  const disclaimer = `<p style="margin:16px 0 0;padding-top:12px;border-top:1px solid ${HAIR};font-size:12.5px;color:${DIM};line-height:1.5">This is where first principles lead, based only on what you told us. You know your studio, your team and your budget better than any tool can, so treat it as a starting point and use your own judgement before you hire.</p>`;

  const body =
    out.kind === "none"
      ? `<p style="margin:0 0 6px;color:${DIM};font-size:14px">Your hiring brief</p>
<p style="margin:0 0 12px;font-size:22px;font-weight:800;line-height:1.25">You might not need to hire</p>
<p style="margin:0 0 14px">${esc(out.reason)}</p>${disclaimer}`
      : `<p style="margin:0 0 6px;color:#e14b00;font-size:14px;font-weight:800">Your next hire</p>
<p style="margin:0 0 12px;font-size:21px;font-weight:800;line-height:1.3;color:${INK}">${esc(out.sentence)}</p>
<p style="margin:0 0 16px;color:${DIM};font-size:14.5px">${esc(out.why)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-top:1px solid ${HAIR}">${(
          [
            ["Role", out.title],
            ["Type", out.type],
            ["Time", out.hours],
            ["For", out.length],
            ["Level", out.level],
            ["Focus", out.focus],
            ...(out.outcome ? [["Hired to", `${out.outcome}${a.by ? `, by ${a.by}` : ""}`]] : []),
          ] as [string, string][]
        )
          .map(([k, v]) => `<tr><td style="padding:9px 0;border-bottom:1px solid ${HAIR};color:${DIM};font-size:14px;width:32%">${k}</td><td style="padding:9px 0;border-bottom:1px solid ${HAIR};font-size:14.5px;font-weight:700">${esc(v)}</td></tr>`)
          .join("")}</table>
<p style="margin:0 0 6px;font-weight:800">The must-haves</p>
<ul style="margin:0 0 16px;padding-left:20px">${out.musts.map((m) => `<li style="margin:0 0 4px">${esc(m)}</li>`).join("")}</ul>
${out.more.length ? `<p style="margin:0 0 16px;font-size:14px;color:${DIM}">You also have gaps in: ${esc(out.more.join(", "))}. Hire for the outcome above first; it's the one the rest depends on.</p>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px"><tr><td style="background:#ff5d00;background-image:linear-gradient(135deg,#ff7a2b,#e14b00);border-radius:16px;padding:20px 22px;color:#fff">
<div style="font-size:19px;font-weight:800">Turn this into a job ad</div>
<div style="font-size:14.5px;line-height:1.55;margin:6px 0 14px;color:#fff">We'll draft it from your brief, with the gaps marked for you to fill, then grade it so it scores well first time.</div>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#ffffff" style="border-radius:999px"><a href="${link}&draft=1" style="display:inline-block;padding:12px 22px;font-weight:800;font-size:15px;color:#c2410c;text-decoration:none;border-radius:999px">Draft my job ad →</a></td></tr></table>
</td></tr></table>
<p style="margin:0 0 14px;font-size:14.5px">Or skip the ad: <a href="${origin}/compare" style="color:#e14b00;font-weight:700">see how every way to hire this role compares</a>.</p>
<p style="margin:0 0 4px">Andre<br><span style="color:${DIM};font-size:14px">Founder, MakersForge</span></p>${disclaimer}`;

  const subject = out.kind === "hire" ? `Your next hire: ${out.title}` : "Your hiring brief";
  const sent = await sendMail({ to: email, subject, html: layout(body, out.kind === "hire" ? out.sentence : "You might not need to hire.") });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });
  if (prod) await toAndre(`🧭 Hiring brief: ${out.kind === "hire" ? out.sentence : "no hire needed"}\n${email}`).catch(() => {});
  return Response.json({ ok: true, ...(sent.dev ? { devLink: link } : {}) });
}
