import { createAdminClient } from "@/lib/supabase/admin";
import { toAndre } from "@/lib/chat/telegram";
import { verifyUnsub } from "@/lib/unsubscribe";

/**
 * POST /api/unsubscribe?t=<token>          unsubscribe (also the RFC 8058 one-click
 *                                           target Gmail/Outlook call directly)
 * POST /api/unsubscribe?t=<token>&undo=1   changed their mind: take them off the list
 * Saves to email_suppressions and tells Andre on Telegram.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const email = verifyUnsub(url.searchParams.get("t"));
  if (!email) return Response.json({ error: "That link isn't valid." }, { status: 400 });
  const undo = url.searchParams.get("undo") === "1";
  const prod = process.env.VERCEL_ENV === "production";
  const hasDb = !!process.env.NEXT_PUBLIC_PORTAL_SUPABASE_URL && !!process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY;

  if (hasDb || prod) {
    const db = createAdminClient().from("email_suppressions");
    const { error } = undo
      ? await db.delete().eq("email", email)
      : await db.upsert({ email, source: url.searchParams.has("page") ? "link" : "one-click" }, { onConflict: "email", ignoreDuplicates: true });
    if (error) {
      console.error("unsubscribe save", error);
      return Response.json({ error: "That didn't go through. Please try again." }, { status: 500 });
    }
  } else console.warn(`unsubscribe: no portal Supabase keys locally, not saved (${undo ? "undo" : "unsub"})`, email);

  if (prod)
    await toAndre(undo ? `✅ Resubscribed\n${email}` : `🚫 Unsubscribed\n${email}\nDon't contact them again (mark do-not-contact in Folk).`).catch(() => {});
  return Response.json({ ok: true });
}
