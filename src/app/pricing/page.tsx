import Link from "next/link";
import type { Metadata } from "next";
import { BOOKING_URL } from "@/lib/site";
import { ROSTER } from "@/data/roster";
import { PricingCards } from "@/components/onboard/PricingCards";
import { liveSlots } from "@/lib/onboarding/db";
import styles from "./plans.module.css";

export const metadata: Metadata = {
  title: "Plans & pricing · MakersForge",
  description:
    "A flat fee per hire by level: £9,000 Team, £14,000 Senior, £20,000 Executive. contractors from £800 a month, and less per hire when you give us several roles. No lock-in.",
};

/* PROTOTYPE 2026-11-02: Plans & pricing is the main self-onboarding page
   (Andre's brief). Every card goes straight into the /start flow; a talent
   profile's "Request interview" lands here with ?candidate= so the brief
   opens with that person attached. */
export default async function PricingPage({ searchParams }: { searchParams: Promise<{ candidate?: string }> }) {
  const { candidate } = await searchParams;
  const person = ROSTER.find((p) => p.id === candidate);
  const slots = await liveSlots();
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.h1}>
            Pick how you hire. <span className="gr">Start today.</span>
          </h1>
          <p className={styles.lede}>
            Flat fees, no percentage of salary, no lock-in. Pick how you hire, book your search week and sign
            online. No calls needed, though you can always book one.
          </p>
          {slots && (
            <p className={styles.slots}>
              <span className={styles.slotDot} aria-hidden="true" />
              <strong>
                {slots.left} search {slots.left === 1 ? "slot" : "slots"} left in {slots.month}
              </strong>
              · we run 2 searches a week
            </p>
          )}
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
          {/* MOCK 2026-11-25 (DRAFT copy for Andre): one light card in the homepage
              style, replacing the dark "Not sure" box and its separate white twin. */}
          <div className={styles.unsure}>
            <div className={styles.unsureHalf}>
              <h2>
                Not sure we&apos;re the <span className="gr">right fit?</span>
              </h2>
              <p>Design your hiring route lays out every way to hire for your role, in order and dated, so you can see where we fit and where we don&apos;t.</p>
              <Link href="/compare" className={styles.unsurePrimary}>
                <span>Design your hiring route →</span>
              </Link>
            </div>
            <div className={styles.unsureHalf}>
              <h2>Prefer to talk first?</h2>
              <p>Book 15 minutes with Andre. Bring the role and we&apos;ll tell you straight whether we&apos;re the right route for it.</p>
              <a href={BOOKING_URL} target="_blank" rel="noreferrer" className={styles.unsureSecondary}>
                Book a 15-minute call →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
