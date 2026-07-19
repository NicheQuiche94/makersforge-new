import {
  differenceInDays,
  format,
  formatDistanceToNowStrict,
  parseISO,
} from "date-fns";

/** Within this window we show a relative label ("Posted 3 days ago"); beyond
 *  it we show the real absolute month ("Posted Mar 2024"). This keeps the
 *  label ACCURATE — we never pretend a months-old role was just posted. */
const RELATIVE_DAYS = 45;

function parse(iso?: string): Date | null {
  if (!iso) return null;
  const d = parseISO(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Posted-date label for cards and job headers.
 *   - recent  → "Posted 3 days ago"
 *   - older   → "Posted Mar 2024"  (honest, not a fake "just now")
 * Uses the real ATS post date; only falls back to `ingested_at` if the post
 * date is missing entirely. Evaluated at build time (board is static).
 */
export function formatPosted(posted: string, ingested?: string): string {
  const d = parse(posted) || parse(ingested);
  if (!d) return "";
  const now = new Date();
  if (d > now) return "Posted just now";
  if (differenceInDays(now, d) <= RELATIVE_DAYS) {
    return `Posted ${formatDistanceToNowStrict(d, { addSuffix: true })}`;
  }
  return `Posted ${format(d, "MMM yyyy")}`;
}

/** Human date like "14 Jul 2026" for detail headers / schema fallbacks. */
export function formatDate(iso: string): string {
  try {
    return parseISO(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
