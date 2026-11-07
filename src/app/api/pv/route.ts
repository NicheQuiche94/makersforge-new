import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Our own cookie-free page counter (Andre 2026-11-06), for every visitor,
 * not only those who accept cookies (PostHog). Nothing is stored on the
 * device and no IP or user agent is kept: the visitor key is a hash of them
 * with a salt that changes daily, so one person's pages join up for a day.
 *
 *   POST { stage: "view", path, source?, medium?, campaign?, content?, referrer?, ref? } → { id }
 *   POST { stage: "end", id, ms, engaged }                                              → 204
 */
export const runtime = "nodejs";

const BOT = /bot|crawl|spider|slurp|headless|preview|scanner|monitor|lighthouse|facebookexternalhit|embedly|python|curl|wget/i;
const clip = (v: unknown, n = 120) => (typeof v === "string" && v ? v.slice(0, n) : null);
const none = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return none();
  // sendBeacon posts text/plain, so read the body as text.
  const body = await req.text().then((t) => JSON.parse(t)).catch(() => ({}));
  try {
    const db = createAdminClient();
    if (body.stage === "end") {
      const id = Number(body.id);
      const ms = Math.max(0, Math.min(Number(body.ms) || 0, 6 * 60 * 60 * 1000));
      if (Number.isFinite(id)) await db.from("page_views").update({ duration_ms: Math.round(ms), engaged: !!body.engaged }).eq("id", id);
      return none();
    }
    const path = clip(body.path, 200);
    if (!path) return none();
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const day = new Date().toISOString().slice(0, 10);
    const salt = process.env.PV_SALT || process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY || "mf";
    const visitor = createHash("sha256").update(`${day}|${ip}|${ua}|${salt}`).digest("hex").slice(0, 24);
    const city = req.headers.get("x-vercel-ip-city");
    const device = /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";
    const { data } = await db
      .from("page_views")
      .insert({
        visitor,
        path,
        source: clip(body.source),
        medium: clip(body.medium),
        campaign: clip(body.campaign),
        content: clip(body.content),
        referrer_host: clip(body.referrer),
        ref: clip(body.ref, 12),
        variant: clip(body.variant, 40),
        country: req.headers.get("x-vercel-ip-country"),
        city: city ? decodeURIComponent(city) : null,
        device,
      })
      .select("id")
      .single();
    return Response.json({ id: data?.id ?? null });
  } catch (err) {
    console.error("pv", err);
    return none();
  }
}
