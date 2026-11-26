import { randomBytes } from "node:crypto";
import { sendMail } from "@/lib/onboarding/mail";
import { leadLayout as layout } from "@/lib/clientEmails";
import { toAndre } from "@/lib/chat/telegram";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadToken, withLead } from "@/lib/leadToken";
import { drawPrize, giftCode } from "@/lib/compareGifts";
import { compare, encodeInput, gbp, day, roleLabel, HOOKS, type CompareInput, type Priority } from "@/lib/compare";
import { activePromo, isSpecial, dropsFor } from "@/lib/promos";
import { RATES, isCurrency, type Currency } from "@/lib/currency";

/**
 * POST the /compare form (Andre 2026-11-07): saves the request (and draws its
 * Christmas prize if the hire is needed before 24 Dec), emails them a short
 * link to their comparison, and pings Andre on the live site. Locally (no
 * RESEND_API_KEY) the email lands in .onboarding-outbox/ instead.
 */
export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const P: Priority[] = ["balanced", "cost", "speed", "hours"];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your work email." }, { status: 400 });
  // Any job title; old links may still send a dropdown id, which roleLabel reads.
  const roleIn = String(b.role || "").trim().slice(0, 120);
  if (!roleIn) return Response.json({ error: "Add the job title." }, { status: 400 });

  const cur: Currency = isCurrency(b.cur) ? b.cur : "GBP";
  const input: CompareInput = {
    role: roleIn,
    salary: Math.round(Math.max(10000, Math.min((Number(b.salary) || 0) / RATES[cur], 500000))),
    cur,
    start: /^\d{4}-\d{2}-\d{2}$/.test(b.start || "") ? b.start : undefined,
    budget: Number(b.budget) > 0 ? Math.round(Number(b.budget)) : undefined,
    p: P.includes(b.p) ? b.p : "balanced",
    name: String(b.name || "").trim().slice(0, 80) || undefined,
    hook: Math.min(Math.max(Number(b.hook) || 0, 0), HOOKS.length - 1),
    lid: randomBytes(5).toString("hex"),
    level: ["junior", "mid", "senior", "lead"].includes(b.level) ? b.level : undefined,
    history: ["easy", "hard", "first"].includes(b.history) ? b.history : undefined,
    runner: ["ta", "manager", "founder"].includes(b.runner) ? b.runner : undefined,
    stakes: ["critical", "important", "nice"].includes(b.stakes) ? b.stakes : undefined,
    asked: typeof b.asked === "boolean" ? b.asked : undefined,
    process: [1, 2, 3.5, 5.5, 8].includes(Number(b.process)) ? Number(b.process) : undefined,
  };
  const { best, plan } = compare(input);
  // While an offer runs, everyone gets a box; hires needed by the special date get the special one.
  const promo = activePromo();
  const special = isSpecial(promo, input.start);
  const prize = promo ? drawPrize(dropsFor(promo, special)) : null;

  // Local dev without the portal Supabase keys: skip the save and link to the self-contained result page.
  const hasDb = !!process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL && !!process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY;
  const prod = process.env.VERCEL_ENV === "production";
  const { error } = !hasDb && !prod ? { error: null } : await createAdminClient()
    .from("compare_requests")
    .insert({
      lid: input.lid,
      email,
      name: input.name ?? null,
      role: input.role,
      salary: input.salary,
      currency: cur,
      need_by: input.start ?? null,
      budget: input.budget ?? null,
      priority: input.p,
      hook: input.hook,
      best: best.r.id,
      answers: { level: input.level ?? null, history: input.history ?? null, runner: input.runner ?? null, stakes: input.stakes ?? null, asked: input.asked ?? null, process: input.process ?? null },
      christmas: special,
      gift_pct: prize?.pct ?? null,
      gift_code: promo && prize ? giftCode(promo, input.lid, prize.pct) : null,
    });
  if (error) {
    console.error("compare save", error);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }

  // Live site links to makersforge.gg; previews and local dev link back to themselves.
  const origin = process.env.VERCEL_ENV === "production" ? SITE : new URL(req.url).origin;
  const utmQ = `utm_source=email&utm_medium=compare&utm_campaign=${HOOKS[input.hook].accent.replace(/ /g, "-")}`;
  const link = withLead(!hasDb && !prod ? `${origin}/compare/result?d=${encodeInput(input)}&${utmQ}` : `${origin}/compare/r/${input.lid}?${utmQ}`, email);
  const role = roleLabel(input.role);
  const html = layout(
    `<p style="margin:0 0 14px">Hi ${esc(input.name?.split(" ")[0] || "there")},</p>
<p style="margin:0 0 14px">Here's your hiring plan for the ${esc(role)} role: what to do, in what order, and when the hire lands.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 20px"><tr><td bgcolor="#ff5d00" style="border-radius:999px">
<a href="${link}" style="display:inline-block;padding:13px 24px;font-weight:700;font-size:15px;color:#fff;text-decoration:none;border-radius:999px">See your hiring plan →</a>
</td></tr></table>
${promo ? `<p style="margin:0 0 14px">${special ? `You need this hire made soon, so there's a priority pack waiting at the bottom: priority on our next search week, plus a ${promo.item} with better odds.` : `There's a ${promo.item} waiting for you at the bottom too.`} ${promo.emoji}</p>` : ""}
<p style="margin:0 0 14px">Hope it's helpful. Any questions, just reply: it comes straight to me.</p>
<p style="margin:0 0 14px">Andre<br><span style="color:#5b5f69;font-size:14px">Founder, MakersForge</span></p>`,
    `Your ${role} hiring plan`,
  );
  const sent = await sendMail({ to: email, subject: `Your hiring plan: ${role}`, html });
  if (!sent.ok) return Response.json({ error: "We couldn't send that. Please try again." }, { status: 502 });

  if (process.env.VERCEL_ENV === "production") {
    await toAndre(
      `📊 Hiring plan requested: ${role}, ${gbp(input.salary)}${cur !== "GBP" ? ` (entered in ${cur})` : ""}${input.start ? `, hire needed by ${day(new Date(input.start))}` : ""}${prize ? ` ${promo!.emoji} ${prize.pct}%${special ? " (priority)" : ""}` : ""}\n` +
        `${input.name || "No name"} · ${email}\n` +
        `Suggested: ${plan.steps.map((s) => s.title).join(" → ")} · headline "${HOOKS[input.hook].accent}"`,
    ).catch(() => {});
  }
  return Response.json({ ok: true, gift: !!prize, special, lead: leadToken(email), ...(sent.dev ? { devLink: link } : {}) });
}
