import type { Metadata } from "next";
import Link from "next/link";
import { activePromo } from "@/lib/promos";
import styles from "../compare.module.css";

export const metadata: Metadata = {
  title: "On its way · MakersForge",
  robots: { index: false, follow: false },
};

/* MOCKUP (Andre 2026-11-07): after "Send me my comparison". A little
   tension: the gift is inside the email, not here. Draft wording. */
export default async function SentPage({ searchParams }: { searchParams: Promise<{ gift?: string; dev?: string }> }) {
  const { gift, dev } = await searchParams;
  const promo = activePromo();
  const local = dev && /^http:\/\/localhost(:\d+)?\//.test(dev) ? dev : null;
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.display}>It&apos;s on its way.</h1>
        <p className={styles.heroLede}>
          Your comparison should land in your inbox in a minute. If it doesn&apos;t, check your spam folder or{" "}
          <Link href="/compare">send it again</Link>.
        </p>
        {(gift === "1" || gift === "2") && promo && (
          <div className={styles.psCard}>
            <span className={styles.psGift} aria-hidden="true">{promo.emoji}</span>
            <p>
              <b>P.S.</b> {gift === "2" ? "You need this hire made soon, so there's a priority pack waiting for you inside." : "There's a little something waiting for you inside."}
            </p>
          </div>
        )}
        {local && (
          <p className={styles.dev}>
            Local test: the email was saved to <code>.onboarding-outbox</code> instead of being sent.{" "}
            <a href={local}>Open the comparison it links to →</a>
          </p>
        )}
      </div>
    </section>
  );
}
