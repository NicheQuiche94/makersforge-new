import { randomBytes } from "node:crypto";
import { sendMail } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadToken, withLead } from "@/lib/leadToken";
import { tierFor } from "@/lib/tier";
import { TIER_NAME } from "@/lib/plans";
import { COUNTRIES, countryById, fmtDay, timeline, type Method } from "@/lib/hireTimeline";

/**
 * POST the /hire-timeline form (Andre 2026-11-09): saves the request, emails
 * a link to their timeline, and returns the headline for the "on its way"
 * page (the teaser). Same pattern as /api/compare. Locally (no
 * RESEND_API_KEY) the email lands in .onboarding-outbox/ instead.
 */
export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });
  const title = String(b.title || "").trim().slice(0, 120);
  if (!title) return Response.json({ error: "Add the job title." }, { status: 400 });
  const country = COUNTRIES.some((c) => c.id === b.country) ? String(b.country) : "GB";
  const method: Method = b.method === "recruiter" ? "recruiter" : "jobad";
  const needBy = /^\d{4}-\d{2}-\d{2}$/.test(b.needBy || "") ? String(b.needBy) : undefined;
  const name = String(b.name || "").trim().slice(0, 80) || undefined;
  const tier = tierFor(title).tier;
  const lid = randomBytes(5).toString("hex");
  const t = timeline({ title, tier, country, method, needBy });

  const { error } = await createAdminClient()
    .from("timeline_requests")
    .insert({ lid, email, name: name ?? null, title, tier, country, method, need_by: needBy ?? null, weeks_late: t.late });
  if (error) {
    console.error("timeline save", error);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }

  // Live site links to makersforge.gg; previews and local dev link back to themselves.
  const origin = process.env.VERCEL_ENV === "production" ? SITE : new URL(req.url).origin;
  const link = withLead(`${origin}/hire-timeline/r/${lid}?utm_source=email&utm_medium=timeline`, email);
  const late = t.late !== null && t.late > 0 ? `${t.late} week${t.late === 1 ? "" : "s"} late` : null;
  const html = layout(
    `<p style="margin:0 0 14px">Hi ${esc(name?.split(" ")[0] || "there")},</p>
<p style="margin:0 0 14px">Your ${esc(title)} is likely to start around <strong>${fmtDay(t.theirs.start)}</strong>${late ? `: <strong>${late}</strong>` : ""}.</p>
<p style="margin:0 0 14px">Here's the timeline, and how to close the gap.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="#ff5d00" style="border-radius:999px">
<a href="${link}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">See your timeline →</a>
</td></tr></table>
<p style="margin:0 0 14px">Any questions, just reply: it comes straight to me.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
    `Your ${title} hire timeline`,
  );
  const sent = await sendMail({ to: email, subject: `Your hire timeline: ${title}`, html });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });

  if (process.env.VERCEL_ENV === "production") {
    await toAndre(
      `🗓️ Timeline requested: ${title} (${TIER_NAME[tier]}), ${countryById(country).label}, ${method === "jobad" ? "job ad" : "recruiter"}` +
        `${needBy ? `, needed by ${fmtDay(new Date(needBy + "T00:00:00"))}${late ? ` (${late})` : ""}` : ""}\n${name || "No name"} · ${email}`,
    ).catch(() => {});
  }
  return Response.json({
    ok: true,
    lead: leadToken(email),
    start: t.theirs.start.toISOString().slice(0, 10),
    late: t.late,
    ...(sent.dev ? { devLink: link } : {}),
  });
}
