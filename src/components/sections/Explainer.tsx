import styles from "./Explainer.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * Explainer — 'Represented, not searched.'
 *
 * Sits after the three service cards on home. Purpose: name the model
 * directly so studios understand what MakersForge is vs what a
 * recruitment agency is. Kicker + header + prose paragraph + two
 * comparison cards (recruiter vs talent agent) on four dimensions.
 * Andre floated this as a candidate for its own /page + nav item
 * later; started as a home section so the model lands on first visit.
 */

const COMPARISON: { them: string; us: string }[] = [
  {
    them: "Sells search to companies",
    us: "Represents specialists directly",
  },
  {
    them: "Per-hire fee or a cut of the salary",
    us: "Flat monthly fee, paid by the studio",
  },
  {
    them: "Job's done at placement",
    us: "Indefinite representation, both sides",
  },
  {
    them: "You brief them; they go find people",
    us: "You look at the lineup; we set up the call",
  },
];

export function Explainer() {
  return (
    <section className={styles.section}>
      <CornerGlow variant="tlSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">The difference</p>
          <h2 className={styles.h2}>Represented, not searched.</h2>
        </header>

        <div className={styles.body}>
          <p className={styles.p}>
            A recruitment agency runs searches. They don&apos;t know the
            people they&apos;re finding for you; they go and look. A talent
            agent represents specialists directly. Everyone on the lineup
            is someone we already work with. Ask us for an intro and
            you&apos;re talking to them the same week.
          </p>
        </div>

        <div className={styles.compare}>
          <div className={`card-shadow ${styles.compareCard}`}>
            <p className={styles.compareLabel}>Recruitment agency</p>
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
              Talent agent
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
