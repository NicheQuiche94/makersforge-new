import type { Metadata } from "next";
import { ApplyForm } from "@/components/forms/ApplyForm";
import styles from "./apply.module.css";

export const metadata: Metadata = {
  title: "Apply to the lineup · MakersForge",
  description:
    "UA managers and creatives for mobile apps and games. We back good operators, regardless of years on the CV. Apply to join the MakersForge lineup.",
};

export default function ApplyPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.inner}>
            <div className={styles.left}>
              <span className="kicker">Apply</span>
              <h1 className={styles.headline}>
                Join the <span className="gr">lineup.</span>
              </h1>
            </div>
            <div className={styles.right}>
              <p className={styles.copy}>
                UA managers and creatives for mobile apps and games.{" "}
                <strong>Tell us who you are</strong>, what you&apos;ve
                shipped, and the kinds of teams you thrive in.
              </p>
              <p className={styles.copy}>
                We back good operators regardless of years on the CV. Andre
                reads every application. If we&apos;re a good fit, expect a
                20-min call within the week. Once that lands well, you&apos;re
                on the lineup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <ApplyForm />
        </div>
      </section>
    </>
  );
}
