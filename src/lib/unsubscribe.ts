/**
 * One-click unsubscribe (Andre 2026-11-25). Every email to someone who used a
 * free resource or tool carries a signed link, plus the List-Unsubscribe
 * headers so Gmail and Outlook show their own "Unsubscribe" button.
 * Unsubscribes land in email_suppressions (the do-not-contact list).
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.makersforge.gg";
const secret = () => process.env.LEAD_SECRET || process.env.GIFT_SECRET || process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY || "mf";
const norm = (email: string) => email.trim().toLowerCase();
const sig = (email: string) => createHmac("sha256", secret()).update(`unsub:${norm(email)}`).digest("base64url").slice(0, 24);

export { UNSUB_PLACEHOLDER } from "./unsubPlaceholder";

export const unsubToken = (email: string) => `${Buffer.from(norm(email)).toString("base64url")}.${sig(email)}`;

export const unsubUrl = (email: string) => `${SITE}/unsubscribe?t=${unsubToken(email)}`;

/** The email the token was signed for, or null if it's been tampered with. */
export function verifyUnsub(token: string | null | undefined): string | null {
  if (!token) return null;
  const [b64, s] = token.split(".");
  if (!b64 || !s) return null;
  let email: string;
  try {
    email = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const want = Buffer.from(sig(email));
  const got = Buffer.from(s);
  return want.length === got.length && timingSafeEqual(want, got) ? norm(email) : null;
}
