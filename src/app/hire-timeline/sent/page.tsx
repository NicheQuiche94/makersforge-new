import type { Metadata } from "next";
import Link from "next/link";
import { fmtDay } from "@/lib/hireTimeline";
import styles from "../../compare/compare.module.css";

export const metadata: Metadata = { title: "On its way · MakersForge", robots: { index: false, follow: false } };

/* After "Email me my timeline" (Andre 2026-11-09): the headline now, the
   timeline and how to close the gap in the email. */
export default async function SentPage({ searchParams }: { searchParams: Promise<{ start?: string; late?: string; dev?: string }> }) {
  const { start, late, dev } = await searchParams;
  const local = dev && /^http:\/\/localhost(:\d+)?\//.test(dev) ? dev : null;
  const weeks = Number(late);
  const date = start && /^\d{4}-\d{2}-\d{2}$/.test(start) ? new Date(start + "T00:00:00") : null;
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        {date && <p className={styles.heroLede}>Your hire is likely to start around {fmtDay(date)}.</p>}
        <h1 className={styles.display}>
          {weeks > 0 ? (
            <>
              That&apos;s <span className={`gr ${styles.accent}`}>{weeks} week{weeks === 1 ? "" : "s"} late</span>.
            </>
          ) : (
            "It's on its way."
          )}
        </h1>
        <p className={styles.heroLede}>
          {weeks > 0 ? "Your full timeline, and how to close the gap, is in your inbox." : "Your full timeline is in your inbox."} Not there? Check spam or{" "}
          <Link href="/hire-timeline">send it again</Link>.
        </p>
        {local && (
          <p className={styles.dev}>
            Local test: the email was saved to <code>.onboarding-outbox</code> instead of being sent. <a href={local}>Open the timeline it links to →</a>
          </p>
        )}
      </div>
    </section>
  );
}
