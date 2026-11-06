import { createAdminClient } from "@/lib/supabase/admin";
import { toAndre } from "@/lib/chat/telegram";

/**
 * Tagged mailshot links (Andre 2026-11-06): each Folk contact's links carry
 * ?r=<ref> (scripts/folk-refs.mjs in mf-radar gives them out).
 *
 *   POST { r, path, stage: "land" }            → { id }  every hit is logged
 *   POST { r, id, stage: "engaged" }           → 204     a person, not a scanner
 *
 * Email security scanners open links and leave within a second or two, so
 * Andre's Telegram ping waits for "engaged": the page stayed open ~8 seconds,
 * or they scrolled, clicked or typed. At most one ping per contact every 30
 * minutes. Nothing is stored on the visitor's device.
 */
export const runtime = "nodejs";

const REF = /^[a-z0-9]{6}$/;
const QUIET_MS = 30 * 60 * 1000;
const none = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ref = String(body.r || "");
  if (!REF.test(ref)) return none();
  try {
    const db = createAdminClient();
    const { data: who } = await db.from("mail_refs").select("name, company, list").eq("ref", ref).maybeSingle();
    if (!who) return none();

    if (body.stage !== "engaged") {
      const path = String(body.path || "/").slice(0, 200);
      const { data } = await db.from("mail_visits").insert({ ref, path }).select("id").single();
      return Response.json({ id: data?.id ?? null });
    }

    const id = Number(body.id);
    if (!Number.isFinite(id)) return none();
    const { data: visit } = await db.from("mail_visits").update({ engaged: true }).eq("id", id).eq("ref", ref).select("path").maybeSingle();
    if (!visit) return none();
    const { data: prev } = await db.from("mail_visits").select("at").eq("ref", ref).eq("engaged", true).neq("id", id).order("at", { ascending: false });
    const last = prev?.[0]?.at ? Date.parse(prev[0].at) : 0;
    if (Date.now() - last > QUIET_MS) {
      const n = (prev?.length ?? 0) + 1;
      await toAndre(
        `📬 ${who.name}${who.company ? ` (${who.company})` : ""} is on makersforge.gg${visit.path} from your email` +
          `${who.list ? `\nList: ${who.list}` : ""}${n > 1 ? `\nVisit ${n}` : ""}`,
      );
    }
  } catch (err) {
    console.error("mail ref", err);
  }
  return none();
}
