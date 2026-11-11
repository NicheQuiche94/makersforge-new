import { subscribe } from "@/lib/appening/data";
import { toAndre } from "@/lib/chat/telegram";

/** Sign up to get What's Appening by email. */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 200) return Response.json({ error: "Please enter your email." }, { status: 400 });
  const editions = Array.isArray(b.editions) ? b.editions.filter((e: unknown) => e === "games" || e === "apps") : [];
  const source = String(b.source || "site").slice(0, 60);
  try {
    const { isNew } = await subscribe(email, source, editions.length ? editions : ["games", "apps"]);
    if (isNew && process.env.VERCEL_ENV === "production") await toAndre(`✉️ What's Appening subscriber: ${email} (${source})`).catch(() => {});
  } catch (e) {
    console.error("appening subscribe", e);
    return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
