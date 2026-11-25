import styles from "./RosterHero.module.css";

export function RosterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <h1 className={styles.headline}>
            Talent <span className="gr">directory.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
