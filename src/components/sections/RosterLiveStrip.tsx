import { ROSTER } from "@/data/roster";
import styles from "./RosterLiveStrip.module.css";

export function RosterLiveStrip() {
  const total = ROSTER.length;
  const available = ROSTER.filter((p) => p.available).length;
  const uaCount = ROSTER.filter((p) => p.discipline === "ua").length;
  const artCount = ROSTER.filter((p) => p.discipline === "art").length;

  return (
    <div className="container">
      <div className={styles.strip}>
        <div className={styles.cell}>
          <p className={styles.n}>{total}</p>
          <p className={styles.l}>total operators</p>
        </div>
        <div className={`${styles.cell} ${styles.dark}`}>
          <p className={styles.n}>
            <span className="gr">{available}</span>
          </p>
          <p className={styles.l}>
            <span className={styles.dot} aria-hidden="true" />
            available now
          </p>
        </div>
        <div className={styles.cell}>
          <p className={styles.n}>{uaCount}</p>
          <p className={styles.l}>ua managers</p>
        </div>
        <div className={`${styles.cell} ${styles.dark}`}>
          <p className={styles.n}>{artCount}</p>
          <p className={styles.l}>marketing artists</p>
        </div>
      </div>
    </div>
  );
}
