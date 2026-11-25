import Link from "next/link";
import { liveSlots } from "@/lib/onboarding/db";
import styles from "./GetStarted.module.css";

/**
 * Homepage self-onboarding CTA (PROTOTYPE 2026-11-02). Andre: less is more,
 * one message and one button, styled like the nav's "Get started". Sits
 * after "Try us first", before the FAQ.
 */
export async function GetStarted() {
  const slots = await liveSlots();
  return (
    <section className={styles.section} id="get-started">
      <div className={`container reveal ${styles.inner}`}>
        <h2 className={styles.h2}>Did you know you can just get started?</h2>
        <p className={styles.lede}>No sales call, no agency back-and-forth. Book your search week, send the brief, get your shortlist.</p>
        <Link href="/start" className={styles.cta}>
          Get started <span aria-hidden="true">→</span>
        </Link>
        {slots && (
          <p className={styles.slots}>
            <strong>
              {slots.left} search {slots.left === 1 ? "slot" : "slots"} left in {slots.month}
            </strong>{" "}
            · we run 2 searches a week
          </p>
        )}
      </div>
    </section>
  );
}
