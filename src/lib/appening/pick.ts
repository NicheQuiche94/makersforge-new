/**
 * Suggests who goes in an issue, so building one is a review, not a hunt.
 * Andre always has the final say in the admin.
 * Order: studios that applied first (they asked), then "growing the team"
 * (warm leads), then established studios from the radar, then freshest.
 */
import type { Entry } from "./data";

const DAY = 86400000;

/** Released in the 5 weeks before the issue, or due in the 4 weeks after. Unknown dates pass. */
export function inWindow(e: Pick<Entry, "release_date">, issueDate: string) {
  if (!e.release_date) return true;
  const d = Date.parse(e.release_date) - Date.parse(issueDate);
  return d >= -35 * DAY && d <= 28 * DAY;
}

export function score(e: Entry) {
  let s = 0;
  if (e.origin === "applied") s += 100;
  if (e.hiring) s += 40;
  if (e.signal && /studio/i.test(e.signal)) s += 25;
  if (e.pitch) s += 10;
  if (e.release_date) s += Math.max(0, 20 - Math.abs(Date.now() - Date.parse(e.release_date)) / (2 * DAY));
  return s;
}

export function suggest(queue: Entry[], issueDate: string, spots = 3, list = 8) {
  const ranked = queue.filter((e) => e.status === "new" && inWindow(e, issueDate)).sort((a, b) => score(b) - score(a));
  return { spotlights: ranked.slice(0, spots), list: ranked.slice(spots, spots + list) };
}
