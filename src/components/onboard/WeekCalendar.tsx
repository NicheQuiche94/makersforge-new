"use client";

/**
 * Search-week calendar (PROTOTYPE 2026-11-02). A normal month date picker
 * (Andre: don't reinvent calendar UI): pick any day and its Monday–Friday
 * search week is selected. Open slots show as dots under each Monday, with a
 * key. Full weeks are greyed out. Interactive in the /start flow; view-only
 * on /pricing and the homepage (Andre: the plan is chosen first, the week is
 * picked inside the flow, so there is one way in).
 */
import { useMemo, useState } from "react";
import { SLOTS_PER_WEEK, WEEKS } from "@/lib/plans";
import styles from "./WeekCalendar.module.css";

const iso = (d: Date) => d.toISOString().slice(0, 10);
const atNoon = (s: string) => new Date(`${s}T12:00:00Z`);
const mondayOf = (d: Date) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return iso(x);
};
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekCalendar({
  selected,
  onSelect,
  readOnly = false,
  weeks = WEEKS,
}: {
  selected?: string;
  onSelect?: (week: string) => void;
  readOnly?: boolean;
  /** Live availability from the database; the mock WEEKS only as a fallback. */
  weeks?: { start: string; open: number }[];
}) {
  const months = useMemo(() => [...new Set(weeks.flatMap((w) => [w.start.slice(0, 7), iso(new Date(atNoon(w.start).getTime() + 4 * 864e5)).slice(0, 7)]))], [weeks]);
  const [mi, setMi] = useState(() => Math.max(0, months.indexOf((selected ?? weeks[0]?.start ?? "").slice(0, 7))));
  const month = months[mi];
  const first = atNoon(`${month}-01`);
  const gridStart = atNoon(mondayOf(first));
  const days = Array.from({ length: 42 }, (_, i) => new Date(gridStart.getTime() + i * 864e5));
  const rows = Array.from({ length: 6 }, (_, r) => days.slice(r * 7, r * 7 + 7)).filter((row) => row.some((d) => iso(d).slice(0, 7) === month));

  const pick = (week: string) => onSelect?.(week);

  return (
    <div className={`${styles.cal} ${readOnly ? styles.readOnly : ""}`}>
      <div className={styles.head}>
        <button type="button" className={styles.navBtn} disabled={mi === 0} onClick={() => setMi(mi - 1)} aria-label="Previous month">
          ‹
        </button>
        <strong>{first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>
        <button type="button" className={styles.navBtn} disabled={mi === months.length - 1} onClick={() => setMi(mi + 1)} aria-label="Next month">
          ›
        </button>
      </div>
      <div className={styles.grid}>
        {DOW.map((d) => (
          <span key={d} className={`${styles.dow} ${d === "Sat" || d === "Sun" ? styles.weekend : ""}`}>
            {d}
          </span>
        ))}
        {rows.flat().map((d) => {
          const day = iso(d);
          const weekStart = mondayOf(d);
          const week = weeks.find((w) => w.start === weekStart);
          const weekday = d.getUTCDay() !== 0 && d.getUTCDay() !== 6;
          const inMonth = day.slice(0, 7) === month;
          const open = !!week && week.open > 0;
          const isSel = selected === weekStart && weekday;
          const isMonday = d.getUTCDay() === 1;
          const cls = [
            styles.day,
            !inMonth && styles.outside,
            !weekday && styles.weekend,
            week && week.open === 0 && styles.full,
            !week && styles.unavailable,
            isSel && styles.sel,
            isSel && isMonday && styles.selStart,
            isSel && d.getUTCDay() === 5 && styles.selEnd,
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button key={day} type="button" className={cls} disabled={readOnly || !open || !weekday} onClick={() => pick(weekStart)}>
              <span>{d.getUTCDate()}</span>
              {isMonday && week && (
                <span className={styles.dots} aria-label={week.open === 0 ? "Full" : `${week.open} of ${SLOTS_PER_WEEK} slots open`}>
                  {Array.from({ length: SLOTS_PER_WEEK }, (_, i) => (
                    <i key={i} className={i < week.open ? styles.dotOpen : styles.dotTaken} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className={styles.key}>
        <span>
          <i className={styles.dotOpen} /> Open slot
        </span>
        <span>
          <i className={styles.dotTaken} /> Taken
        </span>
        <span>
          <i className={styles.keyFull} /> Fully booked
        </span>
        <span className={styles.keyNote}>Searches start on Mondays</span>
      </div>
    </div>
  );
}
