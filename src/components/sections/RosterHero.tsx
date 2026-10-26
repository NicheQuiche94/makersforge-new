import styles from "./RosterHero.module.css";

export function RosterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <span className={`kicker ${styles.kicker}`}>MakersForge Talent Directory</span>
          <h1 className={styles.headline}>
            People we know, <em className={styles.em}>not strangers.</em>
          </h1>
        </div>
      </div>
    </section>
  );
}
