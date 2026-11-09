/**
 * The /compare gift box, server side (Andre 2026-11-07). The skin, odds and
 * dates come from lib/promos (Christmas now; Easter, Halloween, Hump Day
 * ready). The prize is drawn when the comparison is requested and stored
 * with it, so nothing in the browser can change it. A code runs 24 hours
 * from when the box is first opened, works once, and only while the offer
 * is on. The special tier (hire needed by the special date) also brings
 * priority search, capped (Andre: 3 slots).
 *
 * In the table, `christmas` marks the special tier for whichever offer.
 */
import { createHmac, randomInt } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { activePromo, type Drop, type Promo } from "@/lib/promos";

const VALID_MS = 24 * 60 * 60 * 1000;

/** Draw a prize by the published drop rates. */
export function drawPrize(drops: Drop[]) {
  const n = randomInt(100);
  let acc = 0;
  return drops.find((d) => (acc += d.odds) > n) ?? drops[0];
}

export function giftCode(promo: Promo, lid: string, pct: number) {
  const secret = process.env.GIFT_SECRET || process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY || "mf";
  const tag = createHmac("sha256", secret).update(lid).digest("base64url").replace(/[^A-Za-z0-9]/g, "").slice(0, 5).toUpperCase();
  return `${promo.codePrefix}${pct}-${tag}`;
}

/** Special-tier (priority) slots left: the cap less special codes already used on bookings. */
export async function slotsLeft(db: SupabaseClient, promo = activePromo()) {
  if (!promo) return 0;
  const { count } = await db
    .from("compare_requests")
    .select("lid", { count: "exact", head: true })
    .eq("christmas", true)
    .like("gift_code", `${promo.codePrefix}%`)
    .not("gift_used_at", "is", null);
  return Math.max(0, promo.special.cap - (count ?? 0));
}

export type CodeCheck = { ok: true; pct: number; code: string; expiresAt: string; lid: string; special: boolean } | { ok: false; error: string };

/** The demo code a local preview's gift box gives out (never valid on the live site). */
export const demoCode = (prefix: string) => `${prefix}10-DEMO1`;

export async function checkCode(db: SupabaseClient, raw: string): Promise<CodeCheck> {
  const code = String(raw || "").trim().toUpperCase();
  const promo = activePromo();
  if (promo && process.env.VERCEL_ENV !== "production" && code === demoCode(promo.codePrefix)) {
    return { ok: true, pct: 10, code, expiresAt: new Date(Date.now() + VALID_MS).toISOString(), lid: "0000000000", special: true };
  }
  if (!/^[A-Z]{2,6}(5|10|15)-[A-Z0-9]{5}$/.test(code)) return { ok: false, error: "That code isn't one of ours." };
  if (!promo || !code.startsWith(promo.codePrefix)) return { ok: false, error: "That offer has finished." };
  const { data: row } = await db.from("compare_requests").select("lid, gift_pct, gift_opened_at, gift_used_at, christmas").eq("gift_code", code).maybeSingle();
  if (!row || !row.gift_pct) return { ok: false, error: "That code isn't one of ours." };
  if (row.gift_used_at) return { ok: false, error: "That code has already been used." };
  if (!row.gift_opened_at) return { ok: false, error: `Open your ${promo.item} first to unlock that code.` };
  const expires = Date.parse(row.gift_opened_at) + VALID_MS;
  if (Date.now() > expires) return { ok: false, error: "That code has expired." };
  // Priority only while slots are left; the discount stands either way.
  const special = !!row.christmas && (await slotsLeft(db, promo)) > 0;
  return { ok: true, pct: row.gift_pct, code, expiresAt: new Date(expires).toISOString(), lid: row.lid, special };
}

/** Mark a code used by a booking. False if someone used it a moment earlier. */
export async function claimCode(db: SupabaseClient, code: string, bookingId: string) {
  const { data } = await db
    .from("compare_requests")
    .update({ gift_used_at: new Date().toISOString(), booking_id: bookingId })
    .eq("gift_code", code)
    .is("gift_used_at", null)
    .select("lid");
  return !!data?.length;
}
