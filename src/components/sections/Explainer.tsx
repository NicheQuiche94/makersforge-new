import styles from "./Explainer.module.css";

/**
 * Explainer — 'Represented, not searched.'
 *
 * Sits after the StatStrip on home. Purpose: name the model directly
 * so studios understand what MakersForge is vs what a recruitment
 * agency is. Kicker + header + prose paragraph + hairline comparison
 * strip contrasting the two on four dimensions. Andre floated this
 * as a candidate for its own /page + nav item later; started as a
 * home section so the model lands on first visit without navigation.
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
      <div className="container">
        <header className={styles.header}>
          <p className="kicker">The difference</p>
          <h2 className={styles.h2}>
            <span className="gr">Represented, not searched.</span>
          </h2>
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

        <div className={styles.comparison}>
          <div className={styles.comparisonCol}>
            <p className={styles.comparisonLabel}>Recruitment agency</p>
          </div>
          <div className={styles.comparisonCol}>
            <p className={styles.comparisonLabel}>Talent agent</p>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={i} className={styles.comparisonRow}>
              <div className={styles.comparisonCell}>{row.them}</div>
              <div className={`${styles.comparisonCell} ${styles.comparisonUs}`}>
                {row.us}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
