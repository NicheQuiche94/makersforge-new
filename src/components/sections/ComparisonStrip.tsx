import { Logo } from "@/components/atoms/Logo";
import styles from "./ComparisonStrip.module.css";

/**
 * Comparison strip — SaaS-style comparison grid.
 *
 * Per Andre's punch list (2026-05-30): the previous treatment was a
 * flat 3-column grid; this version reads like a real SaaS pricing
 * comparison — highlighted MakersForge column with a header chip and
 * card-like surround, per-row check (us) and cross (them) glyphs,
 * sticky-feeling top header with bigger column labels, soft striped
 * row backgrounds for readability.
 */

type Row = { label: string; us: string; them: string };

const ROWS: Row[] = [
  {
    label: "Contract pricing",
    us: "flat monthly fee",
    them: "20–40% markup on day rate",
  },
  {
    label: "Permanent placement",
    us: "flat £10,000",
    them: "20–30% of first-year salary",
  },
  {
    label: "Who pays the operator",
    us: "you do, directly",
    them: "agency. opaque margin",
  },
  {
    label: "Bench you're hiring from",
    us: "vetted senior operators we know",
    them: "job-board candidate pool",
  },
  {
    label: "Speed to shortlist",
    us: "48h",
    them: "2–6 weeks",
  },
  {
    label: "Replacement matching",
    us: "included",
    them: "rare. extra fee if so",
  },
];

export function ComparisonStrip() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top}>
          <span className="kicker">vs. traditional recruitment</span>
          <h3 className={styles.h3}>
            flat fee <span className="gr">vs. the percentage trap.</span>
          </h3>
          <p className={styles.body}>
            Most recruiters take 20–30% of first-year salary, or skim a margin
            off every day rate. We don&apos;t. Here&apos;s how it stacks up.
          </p>
        </div>

        <div className={styles.tableWrap}>
          {/* Highlighted MakersForge column — sits behind the cells in
              the middle column to give the SaaS-comparison feel. */}
          <div className={styles.usColumn} aria-hidden="true" />

          <div className={styles.table}>
            {/* Header row */}
            <div className={`${styles.cell} ${styles.head} ${styles.headLabel}`}>
              <span className={styles.headKicker}>compare</span>
            </div>
            <div className={`${styles.cell} ${styles.head} ${styles.headUs}`}>
              {/* Real logo + wordmark in the highlighted column header
                  (replaces the prior Cal-Sans-gradient text "MakersForge"
                  per Andre 2026-05-30). */}
              <Logo size={42} className={styles.headLogo} />
            </div>
            <div className={`${styles.cell} ${styles.head} ${styles.headThem}`}>
              <span className={styles.headTagThem}>Traditional</span>
            </div>

            {/* Body rows */}
            {ROWS.map((r, i) => (
              <RowFragment key={r.label} idx={i} {...r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RowFragment({
  label,
  us,
  them,
  idx,
}: Row & { idx: number }) {
  const isAlt = idx % 2 === 1;
  return (
    <>
      <div
        className={`${styles.cell} ${styles.rowLabel} ${
          isAlt ? styles.alt : ""
        }`}
      >
        {label}
      </div>
      <div
        className={`${styles.cell} ${styles.us} ${isAlt ? styles.altUs : ""}`}
      >
        <CheckGlyph />
        <span>{us}</span>
      </div>
      <div
        className={`${styles.cell} ${styles.them} ${isAlt ? styles.alt : ""}`}
      >
        <CrossGlyph />
        <span>{them}</span>
      </div>
    </>
  );
}

function CheckGlyph() {
  return (
    <svg
      className={styles.glyph}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="url(#cmpHeat)" />
      <path
        d="M5.5 10.3 8.5 13.3 14.5 7"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="cmpHeat" x1="0" y1="0" x2="20" y2="20">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="60%" stopColor="#FF5D00" />
          <stop offset="100%" stopColor="#C72E00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CrossGlyph() {
  return (
    <svg
      className={styles.glyph}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="rgba(14,15,17,0.08)" />
      <path
        d="M6.5 6.5 13.5 13.5 M13.5 6.5 6.5 13.5"
        stroke="rgba(14,15,17,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
