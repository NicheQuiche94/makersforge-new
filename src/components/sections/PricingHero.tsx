import styles from "./PricingHero.module.css";

/**
 * Pricing hero — simplified per Andre's punch list (2026-05-30):
 *   - Headline reduced to two colour treatments (ink + gradient) from
 *     the prior three (ink + ghost + gradient). Ghost retired from
 *     the design language.
 *   - Right-side copy block dropped entirely. The same ground is
 *     covered by the comparison table further down the page; the
 *     right copy was getting lost and felt redundant.
 *   - Layout collapses to a single left-anchored column so the
 *     headline can sit at its full width on the page.
 */
export function PricingHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <span className={`kicker ${styles.kicker}`}>Pricing</span>
          <h1 className={styles.headline}>
            One flat fee.
            <br />
            <span className="gr">No percentage games.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
