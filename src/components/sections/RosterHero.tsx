import styles from "./RosterHero.module.css";

export function RosterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={`kicker ${styles.kicker}`}>The roster</span>
            <h1 className={styles.headline}>
              the bench, <em className={styles.em}>on call.</em>
            </h1>
          </div>
          <div className={styles.right}>
            <p className={styles.copy}>
              Filter to what you need: discipline, industry, channels, budget
              managed, and more. Profiles are anonymised; real identities
              reveal after a brief.
            </p>
            <p className={styles.copy}>
              <strong>Email a filtered link to a colleague</strong> — the
              roster deep-links into pre-filtered views.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
