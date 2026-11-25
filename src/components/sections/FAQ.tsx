"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Money } from "@/components/atoms/Money";
import styles from "./FAQ.module.css";

type Item = {
  q: string;
  a: ReactNode;
};

// 2026-10-27, from the handbook + Andre: no guarantee; repeat searches free
// (fee is tied to the placement, not the process); 5 WORKING days to shortlist.
/* Homepage questions (Andre 2026-11-25, DRAFT): built on D2C, honest about when
   we're not the answer. The free-profiles offer is gone. */
export const HOME_FAQ: Item[] = [
  {
    q: "What is D2C recruitment?",
    a: (
      <p>
        Direct-to-candidate recruitment. We find the specific people you want, approach them directly and get them interested in your role,
        instead of waiting for them to see an ad.
      </p>
    ),
  },
  {
    q: "When aren't you the right choice?",
    a: (
      <p>
        When a referral can fill the role, or when plenty of people could do it and you have time to run a job ad. The{" "}
        <Link href="/compare">Design your hiring route</Link> tool shows you which route fits your hire.
      </p>
    ),
  },
  {
    q: "How much does it cost?",
    a: (
      <p>
        We charge a flat, fixed fee per permanent hire, based on the seniority of the role. <Link href="/pricing">See pricing</Link>.
      </p>
    ),
  },
  {
    q: "How quickly do we see candidates?",
    a: (
      <>
        <p>
          You&apos;ll receive the first batch of candidates within one working week. We then keep sending new profiles, a couple at a time,
          until you have enough to make a hire. Usually, the first 5 are enough for 3 to 4 good interviews.*
        </p>
        <p className={styles.note}>* 6 in 10 of our hires come from the first 5 candidates we send, and 9 in 10 from the first 9.</p>
      </>
    ),
  },
  {
    q: "Can we run referrals or a job ad at the same time?",
    a: (
      <p>
        Of course. Just because there are four ways to find talent doesn&apos;t mean you have to pick one and stick to it. You can use them
        separately or together, depending on the hire. The <Link href="/compare">Design your hiring route</Link> tool shows you how.
      </p>
    ),
  },
  {
    q: "Which roles do you hire for?",
    a: <p>Engineering, design, art, user acquisition, motion design and creative, product, data and leadership.</p>,
  },
  {
    q: "What if we need to cancel our search week?",
    a: (
      <p>
        Cancel free up to 48 hours before it starts. After that there&apos;s a <Money gbp={1500} unit={100} /> fee, because by then we&apos;ve
        already done the prep to deliver your shortlist on time.
      </p>
    ),
  },
];

const ITEMS: Item[] = [
  {
    q: "Why 5 candidates, not more?",
    a: (
      <p>
        Because you don&apos;t need 50, you need the right one. We do the
        screening and assessment up front, so every one of the 5 is someone
        you&apos;d genuinely consider, each with a written summary of why.
      </p>
    ),
  },
  {
    q: "What if none of the 5 are right?",
    a: (
      <p>
        Tell us why and we go again, sharper for it, at no extra cost.
      </p>
    ),
  },
  {
    q: "Can we see candidates before agreeing terms?",
    a: (
      <p>
        Yes. Send us the role or a job spec and we&apos;ll send 3 anonymised
        profiles, free, with no obligation to interview. If you&apos;d like to
        meet anyone, we agree terms and run the full search: 5 candidates in 5
        working days.
      </p>
    ),
  },
  {
    q: "How much does it cost?",
    a: (
      <p>
        A flat fee per permanent hire, set by the level in the job title: <Money gbp={9000} /> for junior to mid-level roles, <Money gbp={14000} /> for Senior and Lead roles, <Money gbp={20000} /> for Head, Director and above. Never 20–30% of salary. Contractors
        are a flat monthly fee per person, and you pay their rate directly
        with no markup.
      </p>
    ),
  },
  {
    q: "Which roles do you hire for?",
    a: (
      <p>
        The whole team at mobile games and consumer app companies: UA and
        growth, art and creative, game design, Unity and mobile engineering,
        product and data. Permanent or contract.
      </p>
    ),
  },
  {
    q: "How quickly do we see candidates?",
    a: (
      <p>
        You book a search week. We headhunt and call that week, and your
        shortlist of 5 lands the Monday after, so a search week starting
        Monday the 9th means candidates on Monday the 16th. We run 2 searches
        a week, so you can see availability and book weeks ahead. From there
        you run your own interviews; we handle the scheduling and follow-ups
        so it keeps moving.
      </p>
    ),
  },
  // 2026-11-25 (Andre): no cancellation fee.
  {
    q: "What if we need to cancel our search week?",
    a: <p>Cancel or move it free, any time before it starts.</p>,
  },
];

export function FAQ({ compact = false, items = ITEMS }: { compact?: boolean; items?: Item[] } = {}) {
  // First item open by default per brief; the compact homepage version starts closed (2026-11-25).
  const [openIdx, setOpenIdx] = useState<number | null>(compact ? null : 0);

  return (
    <section className={`${styles.section} ${compact ? styles.compact : ""}`}>
      <div className="container">
        <div className={styles.top}>
          <div>
            {!compact && <span className="kicker">FAQ</span>}
            <h3 className={styles.h3}>
              Questions <span className="gr">studios usually ask.</span>
            </h3>
          </div>
          <p className={styles.intro}>
            If yours isn&apos;t here, drop us a line. We don&apos;t mind a long
            email.
          </p>
        </div>

        <div className={`reveal ${styles.list}`}>
          {items.map((item, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className={`${styles.item} ${open ? styles.itemOpen : ""}`}>
                <button
                  type="button"
                  className={styles.q}
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                >
                  {item.q}
                  <span className={styles.plus} aria-hidden="true">
                    +
                  </span>
                </button>
                <div className={styles.a}>{item.a}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
