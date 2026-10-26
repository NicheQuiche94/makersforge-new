import { BOOKING_URL } from "@/lib/site";
import Link from "next/link";
import styles from "./DualClose.module.css";

/**
 * Homepage close (Andre 2026-07-19) — replaces the single wishy-washy
 * CTA band that "wasn't for any specific person" with two audience-
 * specific doors, using the filled-card treatment from the /jobs alert
 * pair: talent on dark ink, companies on the heat-glow. Each card is a
 * clickable link to that audience's conversion page.
 */
const DOORS = [
  {
    kicker: "For talent",
    headline: "Get represented",
    body: "Indefinite representation for the best growth, product, design, engineering and art talent in games and apps. Companies come to us; you keep your full rate.",
    href: "/apply",
    cta: "Join the line-up",
    tone: "dark" as const,
  },
  {
    kicker: "For companies",
    headline: "Build your team",
    body: "Vetted growth, product, design, engineering and art talent for your game or app, introduced direct from the lineup or found through a targeted search, on a flat fee.",
    href: BOOKING_URL,
    cta: "Book a briefing",
    tone: "heat" as const,
  },
];

export function DualClose() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className={`${styles.card} ${
                d.tone === "heat" ? `heat-glow ${styles.heat}` : styles.dark
              }`}
            >
              <div className={styles.inner}>
                <p className={styles.kicker}>{d.kicker}</p>
                <h2 className={styles.headline}>{d.headline}</h2>
                <p className={styles.body}>{d.body}</p>
                <span className={styles.cta}>
                  {d.cta} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
