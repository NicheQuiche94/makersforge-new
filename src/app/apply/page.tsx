import type { Metadata } from "next";
import { ApplyForm } from "@/components/forms/ApplyForm";
import styles from "./apply.module.css";

export const metadata: Metadata = {
  title: "Apply to the lineup · MakersForge",
  description:
    "Senior UA managers and marketing artists for mobile apps and games. Apply to join the MakersForge lineup.",
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
                join the <span className="gr">lineup.</span>
              </h1>
            </div>
            <div className={styles.right}>
              <p className={styles.copy}>
                Senior UA managers and marketing artists for mobile apps and
                games. <strong>Tell us who you are</strong>, what you&apos;ve
                shipped, and the kinds of teams you thrive in.
              </p>
              <p className={styles.copy}>
                Andre reads every application. If we&apos;re a good fit,
                expect a 20-min call within the week — once that lands well,
                you go onto the lineup.
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
