/** Canonical site origin, used for absolute URLs in metadata, JSON-LD and
 *  the sitemap. Overridable via env for preview deploys; defaults to prod. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://makersforge.gg"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 15-minute intro call (Cal.com, synced to Andre's Gmail calendar).
 *  Replaced the long /enquire form everywhere on 2026-10-27; /enquire now
 *  redirects here. */
export const BOOKING_URL = "https://cal.com/makersforge/15";

/** Booking link with a note pre-filled, e.g. which profile they asked about. */
export function bookingUrl(notes?: string): string {
  return notes ? `${BOOKING_URL}?notes=${encodeURIComponent(notes)}` : BOOKING_URL;
}
