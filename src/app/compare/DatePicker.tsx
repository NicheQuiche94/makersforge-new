"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./datepicker.module.css";

/* A date picker in the MakersForge style (Andre 2026-11-07: the browser's
   own one looked out of place). yyyy-mm-dd in and out; past days are off. */
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => (s ? new Date(`${s}T12:00:00`) : null);
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({ value, onChange, placeholder = "Pick a date", quick = [] }: { value: string; onChange: (v: string) => void; placeholder?: string; quick?: { label: string; value: string }[] }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const picked = parse(value);
  const [view, setView] = useState(() => {
    const d = picked ?? today;
    return new Date(d.getFullYear(), d.getMonth(), 1, 12);
  });
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", off);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const first = (view.getDay() + 6) % 7; // Monday-first grid
  const daysIn = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(first).fill(null), ...Array.from({ length: daysIn }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1, 12))];
  const shift = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1, 12));
  const atStart = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();
  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className={styles.wrap} ref={box}>
      <button type="button" className={`${styles.field} ${value ? "" : styles.empty}`} onClick={() => setOpen(!open)} aria-haspopup="dialog" aria-expanded={open}>
        <span>{picked ? picked.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : placeholder}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.pop} role="dialog" aria-label="Choose a date">
          {quick.length > 0 && (
            <div className={styles.quick}>
              {quick.map((q) => (
                <button key={q.label} type="button" className={value === q.value ? styles.quickOn : ""} onClick={() => pick(q.value)}>
                  {q.label}
                </button>
              ))}
            </div>
          )}
          <div className={styles.head}>
            <button type="button" onClick={() => shift(-1)} disabled={atStart} aria-label="Previous month">‹</button>
            <strong>{view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>
            <button type="button" onClick={() => shift(1)} aria-label="Next month">›</button>
          </div>
          <div className={styles.grid}>
            {DAYS.map((d) => (
              <span key={d} className={styles.dow}>{d}</span>
            ))}
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  disabled={d < today}
                  className={`${styles.day} ${value === iso(d) ? styles.on : ""} ${iso(d) === iso(today) ? styles.today : ""}`}
                  onClick={() => pick(iso(d))}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
