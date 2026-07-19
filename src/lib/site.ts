/** Canonical site origin, used for absolute URLs in metadata, JSON-LD and
 *  the sitemap. Overridable via env for preview deploys; defaults to prod. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://makersforge.gg"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
