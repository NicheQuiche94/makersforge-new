import { Button } from "@/components/atoms/Button";
import styles from "./PricingGrid.module.css";

/**
 * Pricing grid — swap per cofounder pass P3:
 *   - Contract (the main offer) now sits on the RIGHT, takes the
 *     larger column, and uses the paper/light surface treatment.
 *     The cofounder's read: the eye lands on the calmer card when
 *     it's bigger, so giving Contract the white + bigger combo
 *     pulls attention toward it without shouting via gradient.
 *   - Permanent now sits on the LEFT in the smaller column with
 *     the heat-glow gradient surface.
 *   - The .primary / .secondary class names in CSS now describe
 *     which TREATMENT the card uses (paper/big vs gradient/small),
 *     not which card is the "primary recommendation". Comment in
 *     the CSS file flags the inversion.
 */
export function PricingGrid() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* PERMANENT — smaller card, gradient surface (left). */}
          <article className={`reveal heat-glow ${styles.cardSmall}`}>
            <div className={styles.pcTop}>
              <span className={`${styles.pcTag} ${styles.pcTagOnDark}`}>
                <span className={styles.dotSm} aria-hidden="true" />
                Permanent
              </span>
              <span className={styles.optLabel}>Option 02</span>
            </div>
            <h2 className={styles.smallH}>
              Permanent <em className={`${styles.em} gr`}>placement.</em>
            </h2>
            <div className={styles.amount}>
              <span className={styles.currency}>£</span>
              <span className={styles.figure}>10,000</span>
            </div>
            <p className={styles.lede}>
              Want to bring someone on permanently instead? We headhunt and
              place them for a single flat fee. No percentage of salary, ever.
            </p>
            <ul className={styles.points}>
              <li>Flat £10,000 per placement</li>
              <li>No percentage of salary</li>
              <li>UA, Marketing Art, Product, Design, Engineering</li>
            </ul>
            <div className={styles.ctaWrap}>
              <Button href="/enquire" variant="light" arrow>
                Enquire about permanent
              </Button>
            </div>
          </article>

          {/* CONTRACT — larger card, paper surface (right). */}
          <article className={`reveal d1 ${styles.cardLarge}`}>
            <div className={styles.pcTop}>
              <span className={`${styles.pcTag} ${styles.pcTagOnLight}`}>
                <span className={styles.dotSmLight} aria-hidden="true" />
                Contract
              </span>
              <span className={`${styles.optLabel} ${styles.optLabelLight}`}>
                Option 01
              </span>
            </div>
            <h2 className={styles.largeH}>
              Hire a contractor,{" "}
              <em className={`${styles.emLight} gr`}>flat monthly.</em>
            </h2>
            <div className={styles.amount}>
              <span className={styles.currencyLight}>£</span>
              <span className={`${styles.figure} ${styles.figureLight}`}>
                1,000
              </span>
              <span className={styles.periodLight}>
                / specialist / month engaged
              </span>
            </div>
            <p className={styles.ledeLight}>
              You get matched with a senior growth operator from the roster.{" "}
              <strong>You contract and pay the operator directly</strong> for
              their work.
            </p>
            <ul className={`${styles.points} ${styles.pointsLight}`}>
              <li>Flat monthly fee per contractor, billed each month of engagement</li>
              <li>You pay the specialist directly. No markup on their rate</li>
              <li>Fee stops the month engagement ends</li>
              <li>Terms signed up front, nothing hidden</li>
              <li>Scale up or down month-to-month</li>
            </ul>
            <div className={styles.ctaWrap}>
              <Button href="/enquire" variant="primary" arrow>
                Talk to us about a hire
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
