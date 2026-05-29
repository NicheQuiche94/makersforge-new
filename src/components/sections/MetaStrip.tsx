import type { ReactNode } from "react";
import styles from "./MetaStrip.module.css";

type Cell = {
  n: ReactNode;
  label: string;
};

const DEFAULT_CELLS: Cell[] = [
  { n: <>50<span className="gr">+</span></>, label: "vetted operators" },
  { n: "32", label: "available now" },
  { n: <>&lt;7<span className="gr">d</span></>, label: "avg deployment" },
  { n: "2", label: "disciplines live" },
];

export function MetaStrip({ cells = DEFAULT_CELLS }: { cells?: Cell[] }) {
  return (
    <section className={`scroll-reveal ${styles.wrap}`}>
      <div className="container">
        <div className={styles.strip}>
          {cells.map((cell, i) => (
            <div key={i} className={styles.cell}>
              <p className={styles.n}>{cell.n}</p>
              <p className="meta-label">{cell.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
