"use client";

/**
 * Small shared pieces for the self-onboarding prototype (2026-11-02):
 * the slot pips (a visual, not a sentence) and the cal.com booking that
 * opens inline instead of sending people off the site.
 */
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/site";
import { SLOTS_PER_WEEK } from "@/lib/plans";
import styles from "./Bits.module.css";

/** Filled pips = slots still open this week, out of the weekly 2. */
export function Pips({ open, size = "md" }: { open: number; size?: "sm" | "md" }) {
  return (
    <span className={`${styles.pips} ${size === "sm" ? styles.pipsSm : ""}`} role="img" aria-label={open === 0 ? "Full" : `${open} of ${SLOTS_PER_WEEK} slots open`}>
      {Array.from({ length: SLOTS_PER_WEEK }, (_, i) => (
        <span key={i} className={i < open ? styles.pipOpen : styles.pipTaken} />
      ))}
    </span>
  );
}

/** "Book 15 minutes" that opens Andre's cal.com calendar in a lightbox. */
export function CallLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" className={className ?? styles.callLink} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Book a call with Andre" onClick={() => setOpen(false)}>
          <div className={styles.cal} onClick={(e) => e.stopPropagation()}>
            <iframe src={`${BOOKING_URL}?embed=true&layout=month_view&theme=light`} title="Book a call with Andre" />
            <button type="button" className={styles.close} aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
