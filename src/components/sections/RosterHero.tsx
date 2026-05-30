import styles from "./RosterHero.module.css";

export function RosterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <span className={`kicker ${styles.kicker}`}>The lineup</span>
          <h1 className={styles.headline}>
            the lineup, <em className={styles.em}>on call.</em>
          </h1>
        </div>
      </div>
    </section>
  );
}
