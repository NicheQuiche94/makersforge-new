import styles from "./Statement.module.css";

/**
 * Statement — second section after the hero.
 *
 * Composition (locked via lab Experiment 04 v7.2):
 *   - Centred headline: "don't let hiring / slow you down."
 *     Heat-text gradient on "hiring", Cal Sans synthetic italic
 *     on "slow you down".
 *   - Three body statements, narrative arc carried by alignment:
 *       1. Setup beats — LEFT  ("you ship at speed. / you find what works.")
 *       2. Tension hit — RIGHT ("then hiring drags you back...")
 *       3. Resolution  — CENTRE ("we keep the bench warm. ...")
 *
 * Layout: shared .column wraps headline + body so both align to the
 * same horizontal axis. Body has its own narrower max-width matched
 * to the headline's "slow you down" rendering so the body's left/
 * right edges align with that italic line specifically.
 *
 * Copy is current placeholder pending a dedicated copywriting pass.
 * Period punctuation only — no em-dashes anywhere (site-wide rule).
 */
export function Statement() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.column}>
          <h2 className={`reveal ${styles.headline}`}>
            don&apos;t let{" "}
            <span className={styles.gradient}>hiring</span>
            <br />
            <span className={styles.italicCal}>slow you down</span>.
          </h2>

          <div className={`heat-glow ${styles.bodyPanel}`}>
            <div className={styles.body}>
              <p className={`reveal d1 ${styles.statement}`}>
                you ship at speed.
                <br />
                you find what works.
              </p>
              <p
                className={`reveal d2 ${styles.statement} ${styles.statementRight}`}
              >
                then hiring drags you back to a quarter long crawl.
              </p>
              <p
                className={`reveal d3 ${styles.statement} ${styles.statementCenter}`}
              >
                we represent the lineup.
                <br />
                brief monday, shortlist friday, contracts the next week.
                <br />
                growth keeps its pace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
