import Link from "next/link";
import type { Metadata } from "next";
import { BOOKING_URL } from "@/lib/site";
import { ROSTER } from "@/data/roster";
import { Compare } from "@/components/onboard/PlanCards";
import { PricingCards } from "@/components/onboard/PricingCards";
import { slotsLeftThisMonth } from "@/lib/plans";
import styles from "./plans.module.css";

export const metadata: Metadata = {
  title: "Plans & pricing · MakersForge",
  description:
    "A flat fee per hire by level: £9,000 Team, £14,000 Senior, £20,000 Executive. £1,000 a month per contractor, and less per hire when you give us several roles. No lock-in.",
};

/* PROTOTYPE 2026-11-02: Plans & pricing is the main self-onboarding page
   (Andre's brief). Every card goes straight into the /start flow; a talent
   profile's "Request interview" lands here with ?candidate= so the brief
   opens with that person attached. */
export default async function PricingPage({ searchParams }: { searchParams: Promise<{ candidate?: string }> }) {
  const { candidate } = await searchParams;
  const person = ROSTER.find((p) => p.id === candidate);
  const { month, left } = slotsLeftThisMonth();
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <span className="kicker">Plans &amp; pricing</span>
          <h1 className={styles.h1}>
            Pick how you hire. <span className="gr">Start today.</span>
          </h1>
          <p className={styles.lede}>
            Flat fees, no percentage of salary, no lock-in. Pick how you hire, book your search week and sign
            online. No calls needed, though you can always book one.
          </p>
          <p className={styles.slots}>
            <span className={styles.slotDot} aria-hidden="true" />
            <strong>
              {left} search {left === 1 ? "slot" : "slots"} left in {month}
            </strong>
            · we run 2 searches a week
          </p>
          {person && (
            <p className={styles.attached}>
              Requesting an interview with <strong>{person.codename}</strong> ({person.role}). Pick how you&apos;d like
              to hire and we&apos;ll attach them to your brief.
            </p>
          )}
        </div>
      </section>
      <section className={styles.body} id="plans">
        <div className="container">
          <PricingCards candidate={person?.id} />
          <div className={styles.week}>
            <h2>What&apos;s a search week?</h2>
            <p>
              It&apos;s time we set aside just for your role. We headhunt and call candidates all week, and your 5
              land the Monday after. From there we book the interviews and run the process with you until you hire.
            </p>
          </div>
          <div className={styles.compareAll}>
            <h2>Compare all plans</h2>
            <p>Everything side by side, including payment terms and cancellations.</p>
            <Compare open />
          </div>
          <div className={styles.close}>
            <Link href="/compare" className={`${styles.door} ${styles.doorDark}`}>
              <h2>Not sure we&apos;re the right fit?</h2>
              <p>Compare every way to hire for your role: games and tech agencies, running a job ad yourself, and us, on cost and who you reach.</p>
              <span className={styles.doorCta}>
                Compare hiring routes <span aria-hidden="true">→</span>
              </span>
            </Link>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={`card-shadow ${styles.door} ${styles.doorLight}`}>
              <h2>Prefer to talk first?</h2>
              <p>Book 15 minutes with Andre. Bring the role and we&apos;ll tell you straight whether we&apos;re the right route for it.</p>
              <span className={styles.doorCta}>
                Book a 15-minute call <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
