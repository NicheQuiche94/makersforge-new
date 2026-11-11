import type { Metadata } from "next";
import { ApplyForm } from "./ApplyForm";
import styles from "../appening.module.css";

/* DRAFT copy for Andre. */
export const metadata: Metadata = {
  title: "Put your launch forward · What's Appening · MakersForge",
  description: "Launching a mobile game or app? Put it forward for What's Appening, our spotlight on new releases. Free.",
  alternates: { canonical: "/whats-appening/apply" },
};

export default function ApplyPage() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <p className={styles.kicker}>What&apos;s Appening</p>
          <h1 className={styles.display}>
            Launching <span className="gr">soon?</span>
          </h1>
          <p className={styles.lede}>Put your mobile game or app forward for a spotlight. Released in the last month or coming in the next one. Free.</p>
        </header>
        <ApplyForm />
      </div>
    </section>
  );
}
