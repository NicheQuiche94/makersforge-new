import type { ReactNode } from "react";
import styles from "./MetaPills.module.css";

type Cell = {
  n: ReactNode;
  label: string;
  accent?: boolean;
};

const DEFAULT_CELLS: Cell[] = [
  { n: <>50<span className="gr">+</span></>, label: "vetted operators" },
  { n: <span className="gr">2</span>, label: "disciplines live", accent: true },
  { n: <>&lt;7<span className="gr">d</span></>, label: "avg deployment" },
  { n: "£0", label: "% of salary taken", accent: true },
];

export function MetaPills({ cells = DEFAULT_CELLS }: { cells?: Cell[] }) {
  return (
    <div className="container">
      <div className={styles.row}>
        {cells.map((cell, i) => (
          <div
            key={i}
            className={`${styles.cell} ${cell.accent ? styles.accent : ""}`}
          >
            <p className={styles.n}>{cell.n}</p>
            <p className={styles.l}>{cell.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
