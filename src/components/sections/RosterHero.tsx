import styles from "./RosterHero.module.css";

export function RosterHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <h1 className={styles.headline}>
            Talent <em className={styles.em}>Directory.</em>
          </h1>
        </div>
      </div>
    </section>
  );
}
