import styles from "./HeatBreak.module.css";

/**
 * Short (not full-width) glowing heat line marking a boundary between
 * sections (Andre 2026-07-19, sandbox variant D). Sits in its own thin
 * transparent band between two full-bleed sections.
 */
export function HeatBreak() {
  return (
    <div className={styles.break} aria-hidden="true">
      <span className={styles.line} />
    </div>
  );
}
