import styles from "./Explainer.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * Explainer — "500 vs 5".
 *
 * 2026-10-27: back to the service Andre sells and the outreach pitches
 * ("From 500 candidates to 5"). Layout v2 makes the headline visual: a muted
 * panel with a giant 500 (what a job ad gets you) beside a heat panel with a
 * giant 5 (what a MakersForge brief gets you). Shorter than the old
 * paragraph + two-card comparison.
 */

const COMPARISON: { them: string; us: string }[] = [
  { them: "Most of them a no", us: "Every one worth a call" },
  { them: "The best people never see it", us: "We approach the people who aren't looking" },
  { them: "Weeks of sifting and first calls", us: "Hours of your time, not weeks" },
  { them: "Or an agency at 20–30% of salary", us: "One flat fee: £12,000 per hire" },
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

        <div className={styles.versus}>
          <div className={`card-shadow ${styles.vsPanel} ${styles.vsThem}`}>
            <div className={styles.vsNumber}>500</div>
            <p className={styles.vsLabel}>applicants from a job ad</p>
            <ul className={styles.vsList}>
              {COMPARISON.map((row) => (
                <li key={row.them} className={styles.vsItemThem}>
                  {row.them}
                </li>
              ))}
            </ul>
          </div>
          <div className={`card-shadow ${styles.vsPanel} ${styles.vsUs}`}>
            <div className={styles.vsNumber}>5</div>
            <p className={styles.vsLabel}>candidates from a MakersForge brief</p>
            <ul className={styles.vsList}>
              {COMPARISON.map((row) => (
                <li key={row.us} className={styles.vsItemUs}>
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
