import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquireFormWrapper } from "./EnquireFormWrapper";
import styles from "./enquire.module.css";

export const metadata: Metadata = {
  title: "Brief us · MakersForge",
  description:
    "Tell us about the hire. We'll come back with names from the lineup the same week.",
};

/**
 * /enquire — studio enquiry route. Two flows lead here:
 *   1. "request info" CTA on a lineup row (with ?profile=codename)
 *   2. "book a 20-min call" CTAs across the site
 * Both end up in the same form. When a profile codename is passed in,
 * the form pre-flags the request as being about that specialist.
 */
export default function EnquirePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <span className="kicker">brief us</span>
            <h1 className={styles.h1}>
              Tell us about <span className="gr">the hire.</span>
            </h1>
            <p className={styles.sub}>
              The more you tell us upfront, the faster we can put names back.
              Required bits are the requester and the role shape. Everything
              else is optional and only there to tighten the match.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <Suspense fallback={<div style={{ padding: 40 }} />}>
            <EnquireFormWrapper />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
