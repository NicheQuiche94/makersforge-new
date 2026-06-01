import type { ReactNode } from "react";
import styles from "./StatStrip.module.css";

export type StatCell = {
  /** The big value — accepts JSX so callers can drop gradient spans, units etc. */
  n: ReactNode;
  /** Kicker label below the value. */
  label: string;
  /** Renders a small pulsing orange dot before the label. */
  pulse?: boolean;
};

type StatStripProps = {
  cells: StatCell[];
  /**
   * `bare` (default) — no containers, hairlines between cells, hairlines top+bottom.
   *   The magazine treatment. Used for both the home meta strip and the roster live count.
   * `inset` — cells sit inside a wrapping container with internal padding only.
   *   Useful when the strip sits on a non-bg surface and needs visual separation.
   */
  variant?: "bare" | "inset";
  /** Optional className on the outer container. */
  className?: string;
};

export function StatStrip({ cells, variant = "bare", className = "" }: StatStripProps) {
  return (
    <div className={`container ${className}`}>
      <div className={`${styles.row} ${styles[variant]}`}>
        {cells.map((cell, i) => (
          <div key={i} className={styles.cell}>
            <p className={styles.n}>{cell.n}</p>
            <p className={styles.l}>
              {cell.pulse && <span className={styles.dot} aria-hidden="true" />}
              {cell.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
