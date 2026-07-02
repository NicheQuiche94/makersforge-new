import type { ReactNode } from "react";
import styles from "./Principles.module.css";

/**
 * Principles — actual talent-agent commitments (not the old
 * available/vetted/direct 'how it works' points that lived here as
 * Statement.tsx before Andre's reshuffle 2026-07-02).
 *
 * Three columns, containerless. Icon + title + short body per column.
 * Andre liked the lush icon treatment; we kept the pattern and just
 * swapped in claims that read as commitments rather than operational
 * facts.
 */

type Principle = {
  icon: ReactNode;
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    icon: <WalletIcon />,
    title: "Talent doesn't pay for representation.",
    body:
      "The specialist keeps 100% of what they earn. Studios pay us a flat monthly fee; the talent side never sees an invoice from us.",
  },
  {
    icon: <ScalesIcon />,
    title: "We work for both sides.",
    body:
      "A recruiter's job is done when someone gets hired. Ours is done when the specialist wants to come back to the lineup and the studio wants to work with us again.",
  },
  {
    icon: <InfinityIcon />,
    title: "Indefinite representation.",
    body:
      "Once a specialist is on the lineup, they stay on it. We keep the relationship warm between engagements and open the next round when the current one wraps.",
  },
];

export function Principles() {
  return (
    <section className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <p className="kicker">Principles</p>
          <h2 className={styles.h2}>
            <span className="gr">How we hold ourselves.</span>
          </h2>
        </header>

        <div className={styles.grid}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} className={styles.principle}>
              <div className={styles.iconWrap}>{p.icon}</div>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.body}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Icons matching the new claims — wallet / scales / infinity.
   ============================================================ */

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"
        strokeLinejoin="round"
      />
      <path d="M3 10h18" strokeLinecap="round" />
      <circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ScalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4v16" strokeLinecap="round" />
      <path d="M6 7h12" strokeLinecap="round" />
      <path d="M3 14l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14a3 3 0 0 0 6 0" strokeLinecap="round" />
      <path d="M15 14a3 3 0 0 0 6 0" strokeLinecap="round" />
    </svg>
  );
}

function InfinityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M7 12c0-2.2 1.6-4 3.7-4 1.5 0 2.6 1 3.3 2.3 0.7 1.3 1.8 2.3 3.3 2.3 2.1 0 3.7-1.8 3.7-4s-1.6-4-3.7-4c-1.5 0-2.6 1-3.3 2.3-0.7 1.3-1.8 2.3-3.3 2.3C3.6 8 2 9.8 2 12s1.6 4 3.7 4c1.5 0 2.6-1 3.3-2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
