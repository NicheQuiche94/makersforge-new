"use client";

/**
 * The client portal on real data (design approved 2026-11-03).
 * Your hiring: the tracker (once Andre has invited them), the deal, another
 * role, and every role's own search week and progress. Account: signed terms,
 * company details, invoices. Candidates and their comments live in Airtable.
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { fiveDays, gbp, shortDate, shortlistDate } from "@/lib/plans";
import { planLabel, type BookingRow, type RoleRow } from "@/lib/onboarding/records";
import { signOut, termsLink } from "./actions";
import styles from "./account.module.css";

const STAGES = ["Brief confirmed", "Search week", "Shortlist", "Interviewing", "Hired"];
const today = () => new Date().toISOString().slice(0, 10);

function progress(b: BookingRow, r: RoleRow): { stage: number; line: string } {
  if (r.hired_at) return { stage: 5, line: "Hired" };
  if (r.shortlist_sent_at) return { stage: 3, line: "Your 5 candidates are in your tracker" };
  if (!b.brief_confirmed_at) return { stage: 0, line: "Andre's checking your brief, usually within a working day" };
  if (b.retained && !b.retainer_paid_at) return { stage: 1, line: `Retainer invoice due before ${shortDate(r.search_week)} to keep your week` };
  const end = new Date(`${r.search_week}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 4);
  if (r.search_week <= today() && today() <= end.toISOString().slice(0, 10)) return { stage: 1, line: `Search running · shortlist by ${shortlistDate(r.search_week)}` };
  return { stage: 1, line: `Search week ${fiveDays(r.search_week)} · shortlist by ${shortlistDate(r.search_week)}` };
}

export function AccountApp({ email, bookings, slotsLeft, month }: { email: string; bookings: BookingRow[]; slotsLeft: number; month: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"hiring" | "account">("hiring");
  const account = bookings[0]?.account;
  const tracker = account?.tracker_url;
  const latest = bookings[0];

  if (!latest)
    return (
      <div className={styles.page}>
        <section className={`card-shadow ${styles.card} ${styles.empty}`}>
          <h2>Your account</h2>
          <p className={styles.big}>No bookings yet</p>
          <p className={styles.meta}>You&apos;re signed in as {email}. Book your first search and it&apos;ll show up here.</p>
          <Button href="/start" variant="primary" size="sm" arrow>
            Book a search
          </Button>
        </section>
      </div>
    );

  const openPdf = async (id: string) => {
    const url = await termsLink(id);
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/" className={styles.brand}>
          MakersForge
        </Link>
        <span className={styles.company}>{account?.company}</span>
        <button type="button" className={styles.signOut} onClick={async () => (await signOut(), router.refresh())}>
          Sign out
        </button>
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
            <section className={`card-shadow ${styles.card} ${tracker ? styles.tracker : ""}`}>
              <h2>Your candidates</h2>
              <p className={styles.big}>{tracker ? "In your tracker" : "Coming soon"}</p>
              <p className={styles.meta}>
                {tracker
                  ? "Every candidate with their CV and Andre's notes. Comment on anyone right on their record and Andre replies there."
                  : "Your private tracker opens when your first candidates are ready. You'll get an email invite."}
              </p>
              {tracker && (
                <Button href={tracker} variant="primary" size="sm" arrow>
                  Open your tracker
                </Button>
              )}
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Your plan</h2>
              <p className={styles.big}>{planLabel(latest)}</p>
              <p className={styles.meta}>
                {latest.plan === "contract"
                  ? `${latest.fees.map(gbp).join(", ")} a month per contractor while they're engaged.`
                  : latest.retained
                    ? `Retainer ${gbp(latest.retainer)} ${latest.retainer_paid_at ? "paid" : "invoiced"} · credited against your first hires.`
                    : `${latest.fees.map(gbp).join(", ")} per hire · nothing up front.`}
              </p>
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Another role?</h2>
              <p className={styles.big}>
                {slotsLeft} {slotsLeft === 1 ? "slot" : "slots"} left in {month}
              </p>
              <Button href="/start" variant="ghost" size="sm" arrow>
                Book a search
              </Button>
            </section>

            {bookings.flatMap((b) =>
              b.roles.map((r) => {
                const pr = progress(b, r);
                return (
                  <section key={r.id} className={`card-shadow ${styles.card} ${styles.wide}`}>
                    <div className={styles.roleHead}>
                      <h2 className={styles.roleTitle}>{r.title || `Role ${r.position}`}</h2>
                      <span className={styles.pill}>Search week {fiveDays(r.search_week)}</span>
                    </div>
                    <ol className={styles.stages}>
                      {STAGES.map((s, i) => (
                        <li key={s} className={i < pr.stage ? styles.stDone : i === pr.stage ? styles.stNow : ""}>
                          {s}
                        </li>
                      ))}
                    </ol>
                    <p className={styles.meta}>{pr.line}</p>
                  </section>
                );
              }),
            )}
          </div>
        )}

        {tab === "account" && (
          <div className={styles.grid}>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Terms</h2>
              {bookings
                .filter((b) => b.signature)
                .map((b) => (
                  <p key={b.id} className={styles.meta}>
                    {b.ref}: signed by {b.signature!.name}, {new Date(b.signature!.signed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}{" "}
                    {b.terms_pdf_path && (
                      <button type="button" className={styles.linkBtn} onClick={() => openPdf(b.id)}>
                        Download PDF
                      </button>
                    )}
                  </p>
                ))}
            </section>
            <section className={`card-shadow ${styles.card}`}>
              <h2>Company</h2>
              <p className={styles.meta}>
                {account?.legal_name} · {account?.company_number}
                <br />
                Invoices to {account?.accounts_email}
              </p>
              <p className={styles.meta}>Something changed? Email andre@makersforge.gg</p>
            </section>
            <section className={`card-shadow ${styles.card} ${styles.wide}`}>
              <h2>Invoices</h2>
              <ul className={styles.invoices}>
                {bookings.flatMap((b) => [
                  ...(b.retained
                    ? [
                        <li key={`${b.id}-ret`}>
                          <span>
                            {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · Retainer, {planLabel(b).toLowerCase()}
                          </span>
                          <strong>
                            {gbp(b.retainer)} · {b.retainer_paid_at ? "Paid" : "Due"}
                          </strong>
                        </li>,
                      ]
                    : []),
                  ...b.roles
                    .filter((r) => r.hired_at)
                    .map((r) => (
                      <li key={r.id}>
                        <span>
                          {new Date(r.hired_at!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · Hire: {r.title || `Role ${r.position}`}
                        </span>
                        <strong>{r.invoice_amount ? gbp(r.invoice_amount) : "Covered by your retainer"}</strong>
                      </li>
                    )),
                ])}
              </ul>
              <p className={styles.meta}>Hire invoices appear here as each hire starts.</p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
