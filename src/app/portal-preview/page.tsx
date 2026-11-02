"use client";

/**
 * Client portal preview (PROTOTYPE 2026-11-02, Andre's brief). Fake data,
 * nothing saved, shown as of Tue 17 Nov for a retained batch of 3. Two
 * screens: Your hiring (tracker, deal, each role's own search week and
 * progress) and Account (terms, company details, invoices). Airtable stays the
 * ATS: candidates and the comments on each candidate live in the client's
 * tracker, so the portal links to it rather than copying it. The tracker card
 * only offers the link once Andre has invited them (first candidates in).
 */
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { BATCH_STEPS, RETAINED_OFF, fiveDays, gbp, retainedFee, retainedPrice, shortlistDate, slotsLeftThisMonth } from "@/lib/plans";
import styles from "./preview.module.css";

const ROLES = [
  { title: "Senior UA Manager", week: "2026-11-09", stage: 3, status: "2 interviews booked this week" },
  { title: "Creative Strategist", week: "2026-11-09", stage: 2, status: "5 candidates in your tracker" },
  { title: "Product Manager, LiveOps", week: "2026-11-16", stage: 1, status: "Search running · day 2 of 5" },
];
const STAGES = ["Brief confirmed", "Search week", "Shortlist", "Interviewing", "Hired"];
const NOTES = [
  { when: "Today", text: "Search started: Product Manager, LiveOps" },
  { when: "Yesterday", text: "5 candidates for Creative Strategist are in your tracker" },
  { when: "Yesterday", text: "Interviews booked for Senior UA Manager" },
];
const FEES = BATCH_STEPS.slice(0, ROLES.length).map(retainedFee);
const RETAINER = retainedPrice(BATCH_STEPS.slice(0, ROLES.length).reduce((a, b) => a + b, 0)).upfront;
const ORD = ["1st", "2nd", "3rd", "4th", "5th"];

export default function PortalPreview() {
  const [tab, setTab] = useState<"hiring" | "account">("hiring");
  const [bell, setBell] = useState(false);
  const [seen, setSeen] = useState(false);
  const { month, left } = slotsLeftThisMonth();

  return (
    <div className={styles.page}>
      <p className={styles.proto}>Prototype · fake data, shown as of Tue 17 Nov</p>
      <header className={styles.top}>
        <Link href="/" className={styles.brand}>
          MakersForge
        </Link>
        <span className={styles.company}>Northwind Games</span>
        <div className={styles.bellWrap}>
          <button
            type="button"
            className={styles.bell}
            aria-label="Notifications"
            onClick={() => {
              setBell(!bell);
              setSeen(true);
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" />
            </svg>
            {!seen && <span className={styles.badge}>{NOTES.length}</span>}
          </button>
          {bell && (
            <ul className={styles.notes}>
              {NOTES.map((n) => (
                <li key={n.text}>
                  <span>{n.when}</span>
                  {n.text}
                </li>
              ))}
              <li className={styles.notesFoot}>You also get each of these by email.</li>
            </ul>
          )}
        </div>
      </header>

      <nav className={styles.tabs}>
        {(
          [
            ["hiring", "Your hiring"],
            ["account", "Account"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} type="button" className={tab === k ? styles.tabOn : ""} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {tab === "hiring" && (
          <div className={styles.grid}>
            <section className={`card-shadow ${styles.card} ${styles.tracker}`}>
              <h2>Your candidates</h2>
              <p className={styles.big}>In your tracker</p>
              <p className={styles.meta}>Every candidate with their CV and Andre&apos;s notes. Comment on anyone right on their record and Andre replies there.</p>
              <Button href="https://airtable.com" variant="primary" size="sm" arrow>
                Open your tracker
              </Button>
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Your plan</h2>
              <p className={styles.big}>Batch of {ROLES.length} · retained</p>
              <p className={styles.meta}>
                Retainer {gbp(RETAINER)} paid · credited against your first {RETAINER > FEES[0] ? "hires" : "hire"}, so you only pay the difference.
              </p>
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Another role?</h2>
              <p className={styles.big}>
                {left} {left === 1 ? "slot" : "slots"} left in {month}
              </p>
              <Button href="/start" variant="ghost" size="sm" arrow>
                Book a search
              </Button>
            </section>

            {ROLES.map((r) => (
              <section key={r.title} className={`card-shadow ${styles.card} ${styles.wide}`}>
                <div className={styles.roleHead}>
                  <h2 className={styles.roleTitle}>{r.title}</h2>
                  <span className={styles.pill}>Search week {fiveDays(r.week)}</span>
                </div>
                <ol className={styles.stages}>
                  {STAGES.map((s, i) => (
                    <li key={s} className={i < r.stage ? styles.stDone : i === r.stage ? styles.stNow : ""}>
                      {s}
                    </li>
                  ))}
                </ol>
                <p className={styles.meta}>
                  {r.status}
                  {r.stage < 2 ? ` · shortlist by ${shortlistDate(r.week)}` : ""}
                </p>
              </section>
            ))}
          </div>
        )}

        {tab === "account" && (
          <div className={styles.grid}>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Terms</h2>
              <p className={styles.meta}>Signed by Sam Patel, Head of Growth, 2 Nov 2026</p>
              <Button variant="ghost" size="sm">
                Download PDF
              </Button>
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Your fees</h2>
              <ul className={styles.invoices}>
                {FEES.map((f, i) => (
                  <li key={i}>
                    <span>{ORD[i]} hire</span>
                    <strong>{gbp(f)}</strong>
                  </li>
                ))}
              </ul>
              <p className={styles.meta}>Retained, {RETAINED_OFF * 100}% off. Your retainer is credited against your first hires.</p>
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Company</h2>
              <p className={styles.meta}>
                Northwind Games Ltd · 12345678
                <br />
                Invoices to accounts@northwind.com
              </p>
              <p className={styles.meta}>Something changed? Email andre@makersforge.gg</p>
            </section>
            <section className={`card-shadow ${styles.card} ${styles.wide}`}>
              <h2>Invoices</h2>
              <ul className={styles.invoices}>
                <li>
                  <span>2 Nov 2026 · Retainer, batch of {ROLES.length}</span>
                  <strong>{gbp(RETAINER)} · Paid</strong>
                </li>
              </ul>
              <p className={styles.meta}>Hire invoices appear here as each hire starts.</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

