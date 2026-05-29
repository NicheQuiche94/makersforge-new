import styles from "./PricingHero.module.css";

export function PricingHero() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={`kicker ${styles.kicker}`}>Pricing</span>
            <h1 className={styles.headline}>
              one flat fee. <span className="ghost">no</span>{" "}
              <span className="gr">percentage games.</span>
            </h1>
          </div>
          <div className={styles.right}>
            <p className={styles.copy}>
              Two ways to work with us. Both priced as a single flat fee that
              doesn&apos;t scale with what you pay your hire.
            </p>
            <p className={styles.copy}>
              <strong>You pay them, we charge you.</strong> No markup on rates,
              no percentage of salary, no surprises at the end of the contract.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
