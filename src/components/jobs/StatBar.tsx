import type { JobStats } from "@/lib/jobs";
import styles from "./StatBar.module.css";

/**
 * Headline stats for the board. Social proof + freshness signal to pull
 * candidates into the funnel: how much is live, how fresh it is, how many
 * companies, and how much is remote.
 */
export function StatBar({ stats }: { stats: JobStats }) {
  const items: { n: number; label: string }[] = [
    { n: stats.total, label: "Live roles" },
    { n: stats.last30, label: "Added in the last 30 days" },
    { n: stats.companies, label: "Companies hiring" },
    { n: stats.remote, label: "Remote roles" },
  ];

  return (
    <dl className={styles.bar}>
      {items.map((it) => (
        <div key={it.label} className={styles.stat}>
          <dt className={styles.num}>{it.n.toLocaleString("en-GB")}</dt>
          <dd className={styles.label}>{it.label}</dd>
        </div>
      ))}
    </dl>
  );
}
