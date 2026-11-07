/**
 * The Christmas gift box behind /compare (Andre 2026-11-07), server side.
 * The prize is drawn when the comparison is requested and stored with it, so
 * nothing in the browser can change it. The code runs 24 hours from when
 * the box is first opened, works once, and only while Christmas priority
 * slots are left (3, Andre's cap).
 */
import { createHmac, randomInt } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DROPS } from "@/lib/compare";

export const CHRISTMAS_SLOTS = 3;
const VALID_MS = 24 * 60 * 60 * 1000;

/** Draw a prize by the published drop rates. */
export function drawPrize() {
  const n = randomInt(100);
  let acc = 0;
  return DROPS.find((d) => (acc += d.odds) > n) ?? DROPS[0];
}

export function giftCode(lid: string, pct: number) {
  const secret = process.env.GIFT_SECRET || process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY || "mf";
  const tag = createHmac("sha256", secret).update(lid).digest("base64url").replace(/[^A-Za-z0-9]/g, "").slice(0, 5).toUpperCase();
  return `XMAS${pct}-${tag}`;
}

export const dropFor = (pct: number) => DROPS.find((d) => d.pct === pct) ?? DROPS[0];

/** Christmas priority slots left: the cap less codes already used on bookings. */
export async function slotsLeft(db: SupabaseClient) {
  const { count } = await db.from("compare_requests").select("lid", { count: "exact", head: true }).not("gift_used_at", "is", null);
  return Math.max(0, CHRISTMAS_SLOTS - (count ?? 0));
}

export type CodeCheck = { ok: true; pct: number; code: string; expiresAt: string; lid: string } | { ok: false; error: string };

export async function checkCode(db: SupabaseClient, raw: string): Promise<CodeCheck> {
  const code = String(raw || "").trim().toUpperCase();
  if (!/^XMAS(5|10|15)-[A-Z0-9]{5}$/.test(code)) return { ok: false, error: "That code isn't one of ours." };
  const { data: row } = await db.from("compare_requests").select("lid, gift_pct, gift_opened_at, gift_used_at, christmas").eq("gift_code", code).maybeSingle();
  if (!row || !row.christmas || !row.gift_pct) return { ok: false, error: "That code isn't one of ours." };
  if (row.gift_used_at) return { ok: false, error: "That code has already been used." };
  if (!row.gift_opened_at) return { ok: false, error: "Open your gift box first to unlock that code." };
  const expires = Date.parse(row.gift_opened_at) + VALID_MS;
  if (Date.now() > expires) return { ok: false, error: "That code has expired." };
  if ((await slotsLeft(db)) <= 0) return { ok: false, error: "All 3 Christmas priority slots have been taken, sorry." };
  return { ok: true, pct: row.gift_pct, code, expiresAt: new Date(expires).toISOString(), lid: row.lid };
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
