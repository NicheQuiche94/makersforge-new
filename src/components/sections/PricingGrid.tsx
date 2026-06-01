import { Button } from "@/components/atoms/Button";
import styles from "./PricingGrid.module.css";

export function PricingGrid() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* PRIMARY — heat-deep panel */}
          <article className={`reveal heat-glow ${styles.primary}`}>
            <div className={styles.pcTop}>
              <span className={`${styles.pcTag} ${styles.pcTagOnDark}`}>
                <span className={styles.dotSm} aria-hidden="true" />
                Contract · the main way we work
              </span>
              <span className={styles.optLabel}>Option 01</span>
            </div>
            <h2 className={styles.primaryH}>
              Hire a contractor, <em className={styles.em}>flat monthly.</em>
            </h2>
            <div className={styles.amount}>
              <span className={styles.currency}>£</span>
              <span className={styles.figure}>1,000</span>
              <span className={styles.period}>
                / specialist / month engaged
              </span>
            </div>
            <p className={styles.lede}>
              You get matched with a senior growth operator from the roster.{" "}
              <strong>You contract and pay the operator directly</strong> for
              their work. You pay MakersForge a flat monthly fee for each month
              they&apos;re engaged. That&apos;s it.
            </p>
            <ul className={styles.points}>
              <li>Flat monthly fee per contractor, billed each month of engagement</li>
              <li>You pay the specialist directly. No markup on their rate</li>
              <li>Fee stops the month engagement ends</li>
              <li>Replacement matching included if the fit isn&apos;t right</li>
              <li>Terms signed up front, nothing hidden</li>
              <li>Scale up or down month-to-month</li>
            </ul>
            <div className={styles.ctaWrap}>
              <Button href="/enquire" variant="light" arrow>
                Talk to us about a hire
              </Button>
            </div>
          </article>

          {/* SECONDARY — paper */}
          <article className={`reveal d1 ${styles.secondary}`}>
            <div className={styles.pcTop}>
              <span className={`${styles.pcTag} ${styles.pcTagOnLight}`}>
                <span className={styles.dotSmLight} aria-hidden="true" />
                Permanent
              </span>
              <span className={`${styles.optLabel} ${styles.optLabelLight}`}>
                Option 02
              </span>
            </div>
            <h2 className={styles.secondaryH}>
              Permanent <span className="gr">placement.</span>
            </h2>
            <div className={styles.amount}>
              <span className={styles.currencyLight}>£</span>
              <span className={`${styles.figure} ${styles.figureLight}`}>
                10,000
              </span>
            </div>
            <p className={styles.ledeLight}>
              Want to bring someone on permanently instead? We headhunt and
              place them for a single flat fee. No percentage of salary, ever.
            </p>
            <ul className={`${styles.points} ${styles.pointsLight}`}>
              <li>Flat £10,000 per placement</li>
              <li>No percentage of salary</li>
              <li>UA, Marketing Art, Product, Design, Engineering</li>
            </ul>
            <div className={styles.ctaWrap}>
              <Button href="/enquire" variant="primary" arrow>
                Enquire about permanent
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
