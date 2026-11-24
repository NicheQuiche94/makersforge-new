import { sendMail } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadToken, withLead } from "@/lib/leadToken";

/**
 * POST one email, unlock every resource (Andre 2026-11-24). Saves the lead in
 * guide_leads (guide "resources"), emails a link back to /resources that
 * unlocks it on any device, and pings Andre on the live site.
 * Locally (no RESEND_API_KEY) the email lands in .onboarding-outbox/.
 */
export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });
  const prod = process.env.VERCEL_ENV === "production";

  const utm = b.utm && typeof b.utm === "object" ? b.utm : null;
  // Local dev without the portal Supabase keys: skip the save so the flow can still be tested.
  const hasDb = !!process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL && !!process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY;
  if (hasDb || prod) {
    const { error } = await createAdminClient().from("guide_leads").insert({ email, guide: "resources", magnet: "All resources", utm });
    if (error) {
      console.error("resources unlock save", error);
      return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
    }
  } else console.warn("resources unlock: no portal Supabase keys locally, lead not saved", email);

  // DRAFT copy for Andre.
  const origin = prod ? SITE : new URL(req.url).origin;
  const link = withLead(`${origin}/resources?utm_source=email&utm_medium=resources&utm_campaign=unlock`, email);
  const html = layout(
    `<p style="margin:0 0 14px">Hi there,</p>
<p style="margin:0 0 14px">You've got access to all our free resources, guides and reports. This link opens them on any device:</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="#ff5d00" style="border-radius:999px">
<a href="${link}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">Open resources →</a>
</td></tr></table>
<p style="margin:0 0 14px">Any questions, just reply: it comes straight to me.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
    "Your free resources",
  );
  // Access doesn't wait on the email: unlock even if sending fails.
  await sendMail({ to: email, subject: "Your free resources from MakersForge", html }).catch(() => null);

  if (prod) await toAndre(`📚 Resources unlocked\n${email}`).catch(() => {});
  return Response.json({ ok: true, lead: leadToken(email) });
}
