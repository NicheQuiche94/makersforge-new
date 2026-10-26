import styles from "./RosterHero.module.css";

export function RosterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <span className={`kicker ${styles.kicker}`}>MakersForge</span>
          <h1 className={styles.headline}>
            Talent <em className={styles.em}>Directory.</em>
          </h1>
        </div>
      </div>
    </section>
  );
}
