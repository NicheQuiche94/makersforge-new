"use client";

import { useState, type ReactNode } from "react";
import styles from "./FAQ.module.css";

type Item = {
  q: string;
  a: ReactNode;
};

// 2026-10-27 drafts from the handbook; [ANDRE: …] = needs his policy/number.
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
        Tell us why and we go again, sharper for it. [ANDRE: confirm what you
        offer here, e.g. a second shortlist at no extra cost.]
      </p>
    ),
  },
  {
    q: "How much does it cost?",
    a: (
      <p>
        A flat £12,500 per permanent hire, not 20–30% of salary. Contractors
        are a flat monthly fee per person, and you pay their rate directly
        with no markup. You only pay when someone is hired.
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
    q: "Is there a guarantee if a hire doesn't work out?",
    a: (
      <p>
        [ANDRE: your replacement terms, e.g. a free replacement if someone
        leaves within the first 3 months.]
      </p>
    ),
  },
];

export function FAQ() {
  // First item open by default per brief
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <span className="kicker">FAQ</span>
            <h3 className={styles.h3}>
              Questions <span className="gr">studios usually ask.</span>
            </h3>
          </div>
          <p className={styles.intro}>
            If yours isn&apos;t here, drop us a line. We don&apos;t mind a long
            email.
          </p>
        </div>

        <div className={styles.list}>
          {ITEMS.map((item, i) => {
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
