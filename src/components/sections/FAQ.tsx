"use client";

import { useState, type ReactNode } from "react";
import styles from "./FAQ.module.css";

type Item = {
  q: string;
  a: ReactNode;
};

const ITEMS: Item[] = [
  {
    q: "question one goes here",
    a: <p>Answer to question one. Andre to write.</p>,
  },
  {
    q: "question two goes here",
    a: <p>Answer to question two. Andre to write.</p>,
  },
  {
    q: "question three goes here",
    a: <p>Answer to question three. Andre to write.</p>,
  },
  {
    q: "question four goes here",
    a: <p>Answer to question four. Andre to write.</p>,
  },
  {
    q: "question five goes here",
    a: <p>Answer to question five. Andre to write.</p>,
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
              questions <span className="gr">studios usually ask.</span>
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
