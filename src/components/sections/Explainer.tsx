import styles from "./Explainer.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * Explainer — 'Post a job ad, or brief us.'
 *
 * 2026-10-27: back to the service Andre sells and the outreach pitches
 * ("From 500 candidates to 5"). Was 'Lineup first. Search when you need it.'
 * (talent-agent model). Same two-card comparison layout: what a job ad gets
 * you vs what a MakersForge brief gets you.
 */

const COMPARISON: { them: string; us: string }[] = [
  {
    them: "500 applicants, most of them a no",
    us: "5 candidates, every one worth a call",
  },
  {
    them: "The best people never see it",
    us: "We approach the people who aren't looking",
  },
  {
    them: "Weeks of sifting and first calls",
    us: "Hours of your time, not weeks",
  },
  {
    them: "Or an agency at 20–30% of salary",
    us: "One flat fee: £12,000 per hire",
  },
];

export function Explainer() {
  return (
    <section className={styles.section}>
      <CornerGlow variant="tlSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">The difference</p>
          <h2 className={styles.h2}>Post a job ad, or brief us.</h2>
        </header>

        <div className={styles.body}>
          <p className={styles.p}>
            The senior UA managers, artists and engineers you want are busy
            doing great work somewhere else. They&apos;re not trawling job
            boards. We find them, talk to them properly, and only bring you
            the ones who fit, with a written summary on each so you know why
            before the first call.
          </p>
        </div>

        <div className={styles.compare}>
          <div className={`card-shadow ${styles.compareCard}`}>
            <p className={styles.compareLabel}>Posting a job ad</p>
            <ul className={styles.compareList}>
              {COMPARISON.map((row, i) => (
                <li key={i} className={styles.compareItem}>
                  {row.them}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={`card-shadow ${styles.compareCard} ${styles.compareCardUs}`}
          >
            <p className={`${styles.compareLabel} ${styles.compareLabelUs}`}>
              Briefing MakersForge
            </p>
            <ul className={styles.compareList}>
              {COMPARISON.map((row, i) => (
                <li
                  key={i}
                  className={`${styles.compareItem} ${styles.compareItemUs}`}
                >
                  {row.us}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
