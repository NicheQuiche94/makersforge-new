import { allIssues, db, getSettings } from "@/lib/appening/data";
import { issueEmail, issueTitle, liveEmail, SITE, issuePath } from "@/lib/appening/emails";
import { EDITIONS, EDITION_NAME, niceDate, plan, slots, todayIso } from "@/lib/appening/schedule";
import { sendMail } from "@/lib/onboarding/mail";
import { toAndre } from "@/lib/chat/telegram";

/**
 * Daily at 07:00 UTC (vercel.json). Nothing goes out until Andre sets a
 * launch date. Then, on an edition's slot day:
 *  - the next APPROVED issue goes live (published_on = today), is emailed
 *    to subscribers, and every featured studio gets its "you're in" email;
 *  - if no issue is approved for a slot coming up in 7, 3 or 1 days, Andre
 *    gets a Telegram nudge, so we stay ahead and never chase our tails.
 */
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });

  const s = await getSettings();
  if (!s.launch_on) return Response.json({ ok: true, note: "not launched" });
  const today = todayIso();
  const issues = await allIssues();
  const dates = plan(issues, s);
  const done: string[] = [];

  for (const ed of EDITIONS) {
    const due = issues
      .filter((i) => i.edition === ed && i.status === "approved" && !i.published_on && dates.get(i.id)! <= today)
      .sort((a, b) => a.number - b.number)[0];
    if (due) {
      await db().from("appening_issues").update({ published_on: today }).eq("id", due.id);
      const { data: subs } = await db().from("appening_subscribers").select("email, token, editions").is("unsubscribed_at", null);
      let sent = 0;
      for (const sub of subs ?? []) {
        if (!(sub.editions as string[]).includes(ed)) continue;
        const m = issueEmail(due, sub.token as string);
        if ((await sendMail({ to: sub.email as string, subject: m.subject, html: m.html })).ok) sent++;
      }
      for (const e of [...due.spotlights, ...due.list]) {
        if (!e.email || e.live_mail_at) continue;
        const m = liveEmail(e, due);
        await sendMail({ to: e.email, subject: m.subject, html: m.html });
        await db().from("appening_entries").update({ live_mail_at: new Date().toISOString() }).eq("id", e.id);
      }
      await db().from("appening_issues").update({ emailed_at: new Date().toISOString() }).eq("id", due.id);
      done.push(`${issueTitle(due)} live, ${sent} subscribers`);
      await toAndre(`🚀 ${issueTitle(due)} is live: ${SITE}${issuePath(due)}\nEmailed to ${sent} subscriber${sent === 1 ? "" : "s"}.`).catch(() => {});
      continue;
    }

    // Is the next slot covered?
    const next = slots(ed, s, today, 1)[0];
    const covered = issues.some((i) => i.edition === ed && i.status === "approved" && !i.published_on && dates.get(i.id) === next);
    const daysOut = Math.round((Date.parse(next) - Date.parse(today)) / 86400000);
    if (!covered && [7, 3, 1].includes(daysOut)) {
      await toAndre(`⏰ What's Appening: no ${EDITION_NAME[ed]} issue approved for ${niceDate(next)} (${daysOut} day${daysOut === 1 ? "" : "s"}). ${SITE}/admin/appening`).catch(() => {});
      done.push(`${ed}: nudged (${daysOut}d)`);
    }
  }
  return Response.json({ ok: true, done });
}
