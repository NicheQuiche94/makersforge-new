import { sendMail } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadToken, withLead } from "@/lib/leadToken";
import { GUIDES, isLive } from "@/lib/guides";

/**
 * POST a guide's lead magnet request (Andre 2026-11-08): saves the lead in
 * guide_leads, emails them the takeaway, pings Andre on the live site.
 * Locally (no RESEND_API_KEY) the email lands in .onboarding-outbox/.
 */
export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });
  const g = GUIDES.find((x) => x.slug === b.slug && x.magnet);
  const prod = process.env.VERCEL_ENV === "production";
  if (!g || !g.magnet || (prod && !isLive(g))) return Response.json({ error: "That guide isn't available." }, { status: 404 });

  const utm = b.utm && typeof b.utm === "object" ? b.utm : null;
  const { error } = await createAdminClient().from("guide_leads").insert({ email, guide: g.slug, magnet: g.magnet.name, utm });
  if (error) {
    console.error("guide lead save", error);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }

  const origin = prod ? SITE : new URL(req.url).origin;
  const file = `${origin}${g.magnet.file}`;
  const article = withLead(`${origin}/guides/${g.slug}?utm_source=email&utm_medium=guide&utm_campaign=${g.slug}`, email);
  const html = layout(
    `<p style="margin:0 0 14px">Hi there,</p>
<p style="margin:0 0 14px">Here's ${esc(g.magnet.name)}, as promised.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="#ff5d00" style="border-radius:999px">
<a href="${file}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">Download it →</a>
</td></tr></table>
<p style="margin:0 0 14px">It goes with my Hiring Playbook article, <a href="${article}" style="color:#e14b00;font-weight:700">${esc(g.q)}</a>, if you want the thinking behind it.</p>
<p style="margin:0 0 14px">Any questions, just reply: it comes straight to me.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
    g.magnet.name,
  );
  const sent = await sendMail({ to: email, subject: g.magnet.name, html });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });

  if (prod) await toAndre(`📘 Guide download: ${g.magnet.name}\n${email} · from "${g.q}"`).catch(() => {});
  return Response.json({ ok: true, lead: leadToken(email) });
}
