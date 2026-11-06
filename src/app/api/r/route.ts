import { createAdminClient } from "@/lib/supabase/admin";
import { toAndre } from "@/lib/chat/telegram";

/**
 * POST { r, path } → 204. Tagged mailshot links (Andre 2026-11-06): each Folk
 * contact's links carry ?r=<ref> (scripts/folk-refs.mjs in mf-radar gives
 * them out). The visit is logged against that contact and Andre gets a
 * Telegram ping, at most once every 30 minutes per contact. Nothing is stored
 * on the visitor's device, so this doesn't wait on the cookie banner.
 */
export const runtime = "nodejs";

const REF = /^[a-z0-9]{8}$/;
const QUIET_MS = 30 * 60 * 1000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ref = String(body.r || "");
  const path = String(body.path || "/").slice(0, 200);
  if (!REF.test(ref)) return new Response(null, { status: 204 });
  try {
    const db = createAdminClient();
    const { data: who } = await db.from("mail_refs").select("name, company, list").eq("ref", ref).maybeSingle();
    if (!who) return new Response(null, { status: 204 });
    const { data: prev } = await db.from("mail_visits").select("at").eq("ref", ref).order("at", { ascending: false });
    await db.from("mail_visits").insert({ ref, path });
    const last = prev?.[0]?.at ? Date.parse(prev[0].at) : 0;
    if (Date.now() - last > QUIET_MS) {
      const n = (prev?.length ?? 0) + 1;
      await toAndre(
        `📬 ${who.name}${who.company ? ` (${who.company})` : ""} just opened makersforge.gg${path} from your email` +
          `${who.list ? `\nList: ${who.list}` : ""}${n > 1 ? `\nVisit ${n}` : ""}`,
      );
    }
  } catch (err) {
    console.error("mail ref", err);
  }
  return new Response(null, { status: 204 });
}
