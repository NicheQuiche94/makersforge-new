import Link from "next/link";
import { MF_PER_HIRE } from "@/lib/compare";
import { slotsLeftThisMonth } from "@/lib/plans";
import styles from "./HomeRefresh.module.css";

/* Homepage refresh (Andre 2026-11-25, MOCK): first paint on the new
   positioning (D2C recruitment, no radius, honest trade-offs). DRAFT copy:
   Andre rewrites it in his own voice. */

const ODDS: { name: string; n: number; us?: boolean }[] = [
  { name: "Job ad", n: 152 },
  { name: "Sourced in-house", n: 72 },
  { name: "Agency", n: 22 },
  { name: "Referral", n: 16 },
  { name: "MakersForge", n: MF_PER_HIRE, us: true },
];

/** The odds: candidates you see for each hire, by method. */
export function OddsStrip() {
  return (
    <section className={styles.section}>
      <div className="container">
        <header className={`reveal ${styles.head}`}>
          <h2 className={styles.h2}>
            How many candidates <span className="gr">for one hire?</span>
          </h2>
          <p className={styles.lede}>Risk is how many people you see to make one hire.</p>
        </header>
        <div className={`reveal ${styles.odds}`}>
          {ODDS.map((o) => (
            <div key={o.name} className={`${styles.row} ${o.us ? `${styles.us} heat-glow` : ""}`}>
              <b>{o.name}</b>
              <span className={styles.dots}>
                {Array.from({ length: o.n }, (_, i) => (
                  <i key={i} className={i === 0 ? styles.on : ""} />
                ))}
              </span>
              <strong>{o.n}</strong>
            </div>
          ))}
        </div>
        <p className={styles.source}>
          MakersForge: 232 candidates sent across our seven most recent clients, 26 hired. Everyone else: Lever, Little Grey Book of Recruiting
          Benchmarks.
        </p>
      </div>
    </section>
  );
}

const WAYS = [
  { name: "Referrals", line: "Cheapest and lowest risk. Always ask first.", tone: "linear-gradient(135deg, #22c55e, #15803d)" },
  { name: "Job ads", line: "Cheap to post. Only reaches whoever's nearby.", tone: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
  { name: "D2C", line: "Reach the exact person you want. Costs more, risks less.", tone: "var(--tone-heat)", us: true },
  { name: "Talent communities", line: "Slow to build. Compounds over time.", tone: "linear-gradient(135deg, #8b5cf6, #5b21b6)" },
];

/** The honest bit: we're one of four ways, and not always the right one. */
export function NotAlways() {
  return (
    <section className={`${styles.section} ${styles.deep}`}>
      <div className="container">
        <header className={`reveal ${styles.head}`}>
          <h2 className={styles.h2}>
            We&apos;re not always <span className="gr">the answer.</span>
          </h2>
          <p className={styles.lede}>There are four ways to find talent. Each one trades cost, time or risk.</p>
        </header>
        <div className={`reveal ${styles.ways}`}>
          {WAYS.map((w) => (
            <div key={w.name} className={`${styles.way} ${w.us ? styles.wayUs : ""}`}>
              <span className={styles.tab} style={{ background: w.tone }} />
              <strong>{w.name}</strong>
              <p>{w.line}</p>
            </div>
          ))}
        </div>
        <div className={styles.links}>
          <Link href="/compare" className={styles.primary}>
            <span>Design your hiring route →</span>
          </Link>
          <Link href="/resources" className={styles.secondary}>
            Get the free guide →
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The close: one message, one button. */
export function HomeClose() {
  const { month, left } = slotsLeftThisMonth();
  return (
    <section className={`${styles.section} ${styles.close}`}>
      <div className={`container reveal ${styles.closeInner}`}>
        <h2 className={styles.h2}>
          Don&apos;t leave specific hiring <span className="gr">to chance.</span>
        </h2>
        <p className={styles.lede}>£0 until you hire someone we found.</p>
        <Link href="/start" className={`${styles.primary} heat-glow`}>
          <span>Get started →</span>
        </Link>
        <p className={styles.slots}>
          <strong>
            {left} search {left === 1 ? "slot" : "slots"} left in {month}
          </strong>
        </p>
      </div>
    </section>
  );
}
