import { lookupStore, OFF_REMIT } from "@/lib/appening/store";
import { upsertEntry, db, type Entry } from "@/lib/appening/data";
import { appliedEmail } from "@/lib/appening/emails";
import { sendMail } from "@/lib/onboarding/mail";
import { toAndre } from "@/lib/chat/telegram";

/**
 * A studio puts its launch forward for What's Appening. We look the app up
 * from its store link, save it to the queue, email a confirmation and ping
 * Andre on Telegram (a "yes, we're hiring" is flagged: that's a warm lead).
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your email." }, { status: 400 });
  const app = await lookupStore(String(b.url || ""));
  if (!app) return Response.json({ error: "We couldn't find that on the App Store or Google Play. Check the link." }, { status: 400 });
  if (OFF_REMIT.test(`${app.name} ${app.genre}`)) return Response.json({ error: "We don't feature gambling or casino titles, sorry." }, { status: 400 });

  const release = /^\d{4}-\d{2}-\d{2}$/.test(b.releaseDate || "") ? String(b.releaseDate) : undefined;
  const txt = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max) || null;
  const link = (v: unknown) => {
    const s = txt(v, 300);
    return s && /^https:\/\/\S+$/.test(s) ? s : null;
  };
  const pitch = txt(b.pitch, 280);
  const name = txt(b.name, 80);
  const hiring = b.hiring === true ? true : b.hiring === false ? false : null;
  const edition = b.edition === "games" || b.edition === "apps" ? b.edition : app.edition;
  const MODELS = ["Free to play", "Premium", "Subscription", "Free"];
  const sell = {
    tagline: txt(b.tagline, 90),
    highlights: (Array.isArray(b.highlights) ? b.highlights : []).map((h: unknown) => txt(h, 120)).filter(Boolean).slice(0, 3) as string[],
    trailer_url: link(b.trailerUrl),
    other_store_url: link(b.otherStoreUrl),
    model: MODELS.includes(b.model) ? String(b.model) : null,
    markets: txt(b.markets, 80),
    team: txt(b.team, 80),
    proof: txt(b.proof, 120),
    studio_about: txt(b.studioAbout, 200),
    studio_linkedin: link(b.studioLinkedin),
    builders: (Array.isArray(b.builders) ? b.builders : [])
      .map((x: { name?: unknown; role?: unknown; linkedin?: unknown }) => ({ name: txt(x?.name, 60), role: txt(x?.role, 60), linkedin: link(x?.linkedin) }))
      .filter((x: { name: string | null }) => x.name)
      .slice(0, 4),
    ...(link(b.website) ? { website: link(b.website) } : {}),
  };

  let id: string;
  try {
    ({ id } = await upsertEntry({ ...app, edition }, { origin: "applied", email, contact_name: name, pitch, hiring, ...sell, ...(release ? { release_date: release } : {}) }));
  } catch (e) {
    console.error("appening apply", e);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }

  const { data: entry } = await db().from("appening_entries").select("*").eq("id", id).single();
  const m = appliedEmail(entry as Entry);
  await sendMail({ to: email, subject: m.subject, html: m.html });

  if (process.env.VERCEL_ENV === "production") {
    await toAndre(
      `📣 What's Appening application: ${app.name} (${edition}${app.genre ? `, ${app.genre}` : ""})\n${app.publisher || ""} · ${name || "no name"} · ${email}` +
        `${hiring ? "\n🔥 Says they're growing the team after launch" : ""}${pitch ? `\n“${pitch}”` : ""}\n${app.storeUrl}`,
    ).catch(() => {});
  }
  return Response.json({ ok: true, name: app.name });
}
