import styles from "./CornerGlow.module.css";

/**
 * Decorative heat-glow raked to the MakersForge hexagon's ~28deg edge
 * angle, bleeding into a section corner (Andre 2026-07-19). A mix of
 * variants is spread across sections for dynamism.
 *
 * Host section must be position: relative + overflow: hidden, and its
 * content wrapper should sit at z-index 1 so the glow stays behind.
 */
type Variant = "tlSoft" | "trSoft";

export function CornerGlow({ variant }: { variant: Variant }) {
  return <div className={`${styles.glow} ${styles[variant]}`} aria-hidden="true" />;
}
