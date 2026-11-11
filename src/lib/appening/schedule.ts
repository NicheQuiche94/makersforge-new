/**
 * What's Appening schedule (Andre 2026-11-10).
 * - "alternate": one issue a week on Mondays, games and apps taking turns.
 * - "weekly": both editions every week, apps on Monday and games on Friday
 *   (switch to this when demand allows; DRAFT choice of days, Andre to confirm).
 * Dates aren't stored on issues until they go out. Each approved issue takes
 * the next free slot for its edition, in number order, so changing the
 * cadence or the launch date re-plans everything still to come.
 */
import type { Edition } from "./store";

export type Settings = { launch_on: string | null; cadence: "alternate" | "weekly"; first_edition: Edition };
export type IssueLite = { id: string; edition: Edition; number: number; status: "draft" | "approved"; published_on: string | null };

export const EDITIONS: Edition[] = ["games", "apps"];
export const EDITION_NAME: Record<Edition, string> = { games: "Games", apps: "Apps" };
const WEEKLY_DAY: Record<Edition, number> = { apps: 1, games: 5 }; // Mon, Fri

const DAY = 86400000;
export const iso = (d: Date) => d.toISOString().slice(0, 10);
const utc = (s: string) => new Date(`${s}T00:00:00Z`);
const mondayOf = (d: Date) => new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY);
export const todayIso = () => iso(new Date());

/** The next Monday from today (today if it is Monday): the launch date we plan with until Andre sets one. */
export const provisionalLaunch = () => {
  const t = utc(todayIso());
  return iso(new Date(mondayOf(t).getTime() + ((t.getUTCDay() + 6) % 7 === 0 ? 0 : 7 * DAY)));
};

function isSlot(d: Date, edition: Edition, s: Settings, launch: string) {
  if (s.cadence === "weekly") return d.getUTCDay() === WEEKLY_DAY[edition];
  if (d.getUTCDay() !== 1) return false;
  const weeks = Math.round((mondayOf(d).getTime() - mondayOf(utc(launch)).getTime()) / (7 * DAY));
  return weeks % 2 === (edition === s.first_edition ? 0 : 1);
}

/** Slot dates for an edition on or after `from`. */
export function slots(edition: Edition, s: Settings, from: string, count: number): string[] {
  const launch = s.launch_on || provisionalLaunch();
  let d = utc(from > launch ? from : launch);
  const out: string[] = [];
  for (let i = 0; out.length < count && i < 800; i++, d = new Date(d.getTime() + DAY)) if (isSlot(d, edition, s, launch)) out.push(iso(d));
  return out;
}

/**
 * Planned date for every issue not yet out: approved issues first, in
 * number order, then drafts after them. Published issues keep their date.
 */
export function plan(issues: IssueLite[], s: Settings): Map<string, string> {
  const out = new Map<string, string>();
  const today = todayIso();
  for (const ed of EDITIONS) {
    const mine = issues.filter((i) => i.edition === ed);
    for (const i of mine) if (i.published_on) out.set(i.id, i.published_on);
    const last = mine.map((i) => i.published_on).filter(Boolean).sort().pop();
    const from = last && iso(new Date(utc(last).getTime() + DAY)) > today ? iso(new Date(utc(last).getTime() + DAY)) : today;
    const todo = mine.filter((i) => !i.published_on).sort((a, b) => (a.status === b.status ? a.number - b.number : a.status === "approved" ? -1 : 1));
    const dates = slots(ed, s, from, todo.length);
    todo.forEach((i, n) => out.set(i.id, dates[n]));
  }
  return out;
}

/** How far ahead the approved issues reach: the last planned date of an approved, unpublished issue. */
export function coveredUntil(issues: IssueLite[], s: Settings, edition: Edition): string | null {
  const p = plan(issues, s);
  return issues.filter((i) => i.edition === edition && i.status === "approved" && !i.published_on).map((i) => p.get(i.id)!).sort().pop() ?? null;
}

export const niceDate = (d: string | null | undefined, withDay = true) =>
  d ? utc(d).toLocaleDateString("en-GB", { ...(withDay ? { weekday: "short" } : {}), day: "numeric", month: "short", timeZone: "UTC" }) : "";
