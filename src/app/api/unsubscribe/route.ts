import { createAdminClient } from "@/lib/supabase/admin";
import { toAndre } from "@/lib/chat/telegram";
import { verifyUnsub } from "@/lib/unsubscribe";

/**
 * POST /api/unsubscribe?t=<token>          unsubscribe (also the RFC 8058 one-click
 *                                           target Gmail/Outlook call directly)
 * POST /api/unsubscribe?t=<token>&undo=1   changed their mind: take them off the list
 * POST /api/unsubscribe {"email": "..."}   the form on /unsubscribe (footer link): no undo
 * Saves to email_suppressions and tells Andre on Telegram.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t");
  let email = verifyUnsub(token);
  let source = url.searchParams.has("page") ? "link" : "one-click";
  if (!token) {
    const b = await req.json().catch(() => ({}));
    const typed = String(b?.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(typed) || typed.length > 200) return Response.json({ error: "Please enter your email." }, { status: 400 });
    email = typed;
    source = "form";
  }
  if (!email) return Response.json({ error: "That link isn't valid." }, { status: 400 });
  const undo = !!token && url.searchParams.get("undo") === "1";
  const prod = process.env.VERCEL_ENV === "production";
  const hasDb = !!process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL && !!process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY;

  if (hasDb || prod) {
    const db = createAdminClient().from("email_suppressions");
    const { error } = undo
      ? await db.delete().eq("email", email)
      : await db.upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });
    if (error) {
      console.error("unsubscribe save", error);
      return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
    }
  } else console.warn(`unsubscribe: no portal Supabase keys locally, not saved (${undo ? "undo" : "unsub"})`, email);

  if (prod)
    await toAndre(undo ? `✅ Resubscribed\n${email}` : `🚫 Unsubscribed\n${email}\nDon't contact them again (mark do-not-contact in Folk).`).catch(() => {});
  return Response.json({ ok: true });
}
