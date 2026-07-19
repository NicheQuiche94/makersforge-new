import type { Metadata } from "next";
import styles from "./sandbox.module.css";

/**
 * /sandbox — preview surface for design experiments. Not linked, not
 * indexed. Current: heat-glow dynamism experiments (Andre 2026-07-19)
 * before any touch the live page.
 *
 *  #7 Diagonal corner glow — heat rectangle raked to the hexagon's
 *     ~28deg edge angle, bleeding into a section corner.
 *  #8 Heat-glow section breakers — short (not full-width) glowing
 *     lines between sections.
 */

export const metadata: Metadata = {
  title: "Sandbox · MakersForge",
  robots: { index: false, follow: false },
};

/* A little placeholder section content so each effect is judged in
   context, not on a blank box. */
function MockContent() {
  return (
    <div className={`container ${styles.mockInner}`}>
      <p className="kicker">Section</p>
      <h2 className={styles.mockH2}>How we hold ourselves.</h2>
      <div className={styles.mockCards}>
        <div className={`card-shadow ${styles.mockCard}`} />
        <div className={`card-shadow ${styles.mockCard}`} />
        <div className={`card-shadow ${styles.mockCard}`} />
      </div>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className="kicker">Sandbox</p>
        <h1 className={styles.h1}>Heat-glow experiments</h1>
        <p className={styles.hint}>
          Two ways to inject brand dynamism, at the hexagon&apos;s ~28°
          angle. Nothing here is live. Tell me which (if any) to port, and
          at what intensity.
        </p>
      </header>

      {/* ============ #7 — diagonal corner glow ============ */}
      <p className={styles.groupLabel}>#7 · Diagonal corner glow</p>

      <section className={`${styles.demo} ${styles.glowTLsoft}`}>
        <p className={styles.tag}>A · top-left, soft (blurred)</p>
        <MockContent />
      </section>

      <section className={`${styles.demo} ${styles.glowBRmed}`}>
        <p className={styles.tag}>B · bottom-right, medium</p>
        <MockContent />
      </section>

      <section className={`${styles.demo} ${styles.glowTLcrisp}`}>
        <p className={styles.tag}>C · top-left, crisp rectangle (bolder)</p>
        <MockContent />
      </section>

      {/* ============ #8 — section breakers ============ */}
      <p className={styles.groupLabel}>#8 · Heat-glow section breakers</p>

      <div className={styles.breakerDemo}>
        <p className={styles.tag}>D · straight short line + glow</p>
        <div className={styles.breakerStraight} />
      </div>

      <div className={styles.breakerDemo}>
        <p className={styles.tag}>E · angled to the hex (~28°)</p>
        <div className={styles.breakerAngled} />
      </div>

      <div className={styles.breakerDemo}>
        <p className={styles.tag}>F · centre swell (glow node)</p>
        <div className={styles.breakerSwell} />
      </div>
    </div>
  );
}
