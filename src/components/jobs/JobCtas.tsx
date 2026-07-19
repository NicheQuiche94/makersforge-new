import Link from "next/link";
import styles from "./JobCtas.module.css";

/**
 * The two funnel CTAs (brief §6). Both sides of the marketplace are a lead:
 * candidates → the MakersForge bench, companies → a hiring conversation.
 *
 * Copy and buttons are fixed per the brief; the same verb carries through
 * the flow. Rendered as server components, no interactivity beyond links.
 */

export function CandidateCTA() {
  return (
    <aside className={`heat-glow ${styles.block}`}>
      <div className={styles.inner}>
        <p className={styles.kickerLight}>For candidates</p>
        <h2 className={styles.headline}>
          Applying for roles like this? The best ones{" "}
          <em className={styles.em}>never get posted.</em>
        </h2>
        <p className={styles.body}>
          Join the MakersForge bench and companies come to you.
        </p>
        <Link href="/apply" className={`btn btn-light ${styles.btn}`}>
          <span>Get represented</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}

export function HiringCTA() {
  return (
    <aside className={`heat-glow ${styles.block}`}>
      <div className={styles.inner}>
        <p className={styles.kickerLight}>For hiring teams</p>
        <h2 className={styles.headline}>
          Hiring for growth? <em className={styles.em}>Hire from our line-up.</em>
        </h2>
        <p className={styles.body}>
          A vetted bench of UA managers and marketing artists, ready when you
          are.
        </p>
        <Link href="/enquire" className={`btn btn-light ${styles.btn}`}>
          <span>Talk to MakersForge</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
