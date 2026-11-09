import { createAdminClient } from "@/lib/supabase/admin";
import { activePromo, dropFor } from "@/lib/promos";

/**
 * POST { lid } → the Christmas gift for this comparison. The first call opens
 * the box (starts the 24 hours); later calls return the same prize. No box
 * once all Christmas priority slots are taken.
 */
export const runtime = "nodejs";

const DEMO = "0000000000";
const demo = () => {
  const promo = activePromo();
  if (!promo || process.env.VERCEL_ENV === "production") return null;
  const d = dropFor(promo, true, 10);
  const openedAt = new Date().toISOString();
  return { opened: true, pct: d.pct, rarity: d.rarity, color: d.color, code: "XMAS-DEMO-10", openedAt, expiresAt: new Date(Date.now() + 864e5).toISOString(), used: false };
};

export async function POST(req: Request) {
  const { lid } = await req.json().catch(() => ({}));
  if (lid === DEMO && demo()) return Response.json(demo());
  if (!/^[a-f0-9]{10}$/.test(String(lid || ""))) return Response.json({ error: "Not found." }, { status: 404 });
  const db = createAdminClient();
  const { data: row } = await db.from("compare_requests").select("christmas, gift_pct, gift_code, gift_opened_at, gift_used_at").eq("lid", lid).maybeSingle();
  const promo = activePromo();
  if (!row || !row.gift_pct || !promo) return Response.json({ error: "Not found." }, { status: 404 });
  let openedAt = row.gift_opened_at as string | null;
  if (!openedAt) {
    openedAt = new Date().toISOString();
    await db.from("compare_requests").update({ gift_opened_at: openedAt }).eq("lid", lid).is("gift_opened_at", null);
  }
  const d = dropFor(promo, !!row.christmas, row.gift_pct);
  return Response.json({
    pct: d.pct,
    rarity: d.rarity,
    color: d.color,
    code: row.gift_code,
    openedAt,
    expiresAt: new Date(Date.parse(openedAt) + 864e5).toISOString(),
    used: !!row.gift_used_at,
  });
}

/** GET ?lid= → has this box been opened? (the prize only once it has) */
export async function GET(req: Request) {
  const lid = new URL(req.url).searchParams.get("lid") || "";
  if (!/^[a-f0-9]{10}$/.test(lid)) return Response.json({ error: "Not found." }, { status: 404 });
  const { data: row } = await createAdminClient().from("compare_requests").select("christmas, gift_pct, gift_code, gift_opened_at, gift_used_at").eq("lid", lid).maybeSingle();
  const promo = activePromo();
  if (!row || !row.gift_pct || !promo) return Response.json({ error: "Not found." }, { status: 404 });
  if (!row.gift_opened_at) return Response.json({ opened: false });
  const d = dropFor(promo, !!row.christmas, row.gift_pct);
  return Response.json({
    opened: true,
    pct: d.pct,
    rarity: d.rarity,
    color: d.color,
    code: row.gift_code,
    openedAt: row.gift_opened_at,
    expiresAt: new Date(Date.parse(row.gift_opened_at) + 864e5).toISOString(),
    used: !!row.gift_used_at,
  });
}
