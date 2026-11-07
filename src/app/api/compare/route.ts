import { randomBytes } from "node:crypto";
import { sendMail } from "@/lib/onboarding/mail";
import { layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { compare, encodeInput, gbp, day, addWeeks, roleLabel, wantsChristmasHire, ROLES, HOOKS, type CompareInput, type Priority } from "@/lib/compare";

/**
 * POST the /compare form → emails them a link to their comparison (MOCKUP,
 * Andre 2026-11-07). Locally (no RESEND_API_KEY) the email lands in
 * .onboarding-outbox/ instead of being sent, and Andre isn't pinged.
 * Not yet: storing the request, adding them to Folk.
 */
export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const P: Priority[] = ["balanced", "cost", "speed", "hours"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });
  if (!ROLES.some((r) => r.id === b.role)) return Response.json({ error: "Pick a role." }, { status: 400 });

  const input: CompareInput = {
    role: b.role,
    salary: Math.max(10000, Math.min(Number(b.salary) || 0, 500000)),
    start: /^\d{4}-\d{2}-\d{2}$/.test(b.start || "") ? b.start : undefined,
    budget: Number(b.budget) > 0 ? Number(b.budget) : undefined,
    p: P.includes(b.p) ? b.p : "balanced",
    name: String(b.name || "").trim().slice(0, 80) || undefined,
    company: String(b.company || "").trim().slice(0, 80) || undefined,
    hook: Math.min(Math.max(Number(b.hook) || 0, 0), HOOKS.length - 1),
    lid: randomBytes(5).toString("hex"),
  };
  const origin = process.env.RESEND_API_KEY ? SITE : new URL(req.url).origin;
  const link = `${origin}/compare/result?d=${encodeInput(input)}&utm_source=email&utm_medium=compare&utm_campaign=${HOOKS[input.hook]?.accent ?? "hook"}`;
  const role = roleLabel(input.role);
  const { best } = compare(input);

  // DRAFT copy for Andre.
  const html = layout(
    `<p style="margin:0 0 14px">Hi ${esc(input.name?.split(" ")[0] || "there")},</p>
<p style="margin:0 0 14px">Here's your comparison for the ${esc(role)} role${input.company ? ` at ${esc(input.company)}` : ""}: every way to hire it, side by side on cost, speed, interviews and your team's hours.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="#ff5d00" style="border-radius:999px">
<a href="${link}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">See your comparison →</a>
</td></tr></table>
${wantsChristmasHire(input) ? `<p style="margin:0 0 14px">You need this hire made before Christmas, so there's a Christmas pack waiting at the bottom: priority on our next search week, plus a gift. 🎁</p>` : ""}
<p style="margin:0 0 14px">Hope it's helpful. Any questions, just reply: it comes straight to me.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
    `Your ${role} hiring comparison`,
  );
  const sent = await sendMail({ to: email, subject: `Your hiring comparison: ${role}`, html });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });

  if (process.env.RESEND_API_KEY) {
    await toAndre(
      `📊 Comparison requested: ${role}, ${gbp(input.salary)}${input.start ? `, hire needed by ${day(new Date(input.start))}` : ""}${wantsChristmasHire(input) ? " 🎄" : ""}\n` +
        `${input.name || "No name"}${input.company ? ` (${input.company})` : ""} · ${email}\n` +
        `Best fit for them: ${best.r.name} · headline "${HOOKS[input.hook]?.accent ?? "?"}"`,
    ).catch(() => {});
  }
  return Response.json({ ok: true, ...(sent.dev ? { devLink: link } : {}), startHint: day(addWeeks(best.startWeeks)) });
}
