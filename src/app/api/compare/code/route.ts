import { createAdminClient } from "@/lib/supabase/admin";
import { checkCode } from "@/lib/compareGifts";

/** GET ?c=XMAS10-AB12C → is this Christmas code good to use right now? (/start shows the discount) */
export const runtime = "nodejs";

export async function GET(req: Request) {
  const c = new URL(req.url).searchParams.get("c") || "";
  const r = await checkCode(createAdminClient(), c);
  return Response.json(r.ok ? { ok: true, pct: r.pct, code: r.code, expiresAt: r.expiresAt, special: r.special } : r);
}
