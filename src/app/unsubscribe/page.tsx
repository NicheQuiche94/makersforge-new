import type { Metadata } from "next";
import { Unsubscribe } from "./Unsubscribe";
import styles from "./unsubscribe.module.css";

export const metadata: Metadata = {
  title: "Unsubscribe · MakersForge",
  robots: { index: false, follow: false },
};

/**
 * Landing page for the unsubscribe link in our emails (2026-11-25). The
 * unsubscribe itself runs in the browser after the page loads, so link
 * scanners that only fetch the page don't unsubscribe anyone.
 */
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Unsubscribe token={t ?? ""} />
      </div>
    </main>
  );
}
