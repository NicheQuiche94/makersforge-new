"use client";

/**
 * Andre's admin on real data (design approved 2026-11-03).
 * Needs you (one card per thing waiting on him, one button each), Bookings
 * (everything, with the full record) and Capacity (2 searches a week, block
 * weeks). Every button calls a server action that checks he's an admin.
 */
import { useState, useTransition } from "react";
import { fiveDays, gbp, shortDate, shortlistDate } from "@/lib/plans";
import type { BookingRow } from "@/lib/onboarding/records";
import { confirmBrief, fileLink, markHired, markRetainerPaid, sendShortlist, setWeekBlocked } from "./actions";
import styles from "./admin.module.css";

type Week = { week_start: string; slots: number; blocked: boolean; open: number };
const PLAN = { permanent: "Permanent hire", contract: "Contractor", batch: "Batch" } as const;

function stage(b: BookingRow) {
  if (!b.signature) return "Change requested";
  if (!b.brief_confirmed_at) return "New booking";
  if (b.retained && !b.retainer_paid_at) return "Waiting on retainer";
  if (b.roles.every((r) => r.hired_at)) return "Complete";
  if (b.roles.some((r) => r.hired_at)) return "Hiring";
  return b.roles.some((r) => r.shortlist_sent_at) ? "Interviewing" : "Searching";
}

export function AdminApp({ bookings, weeks }: { bookings: BookingRow[]; weeks: Week[] }) {
  const [tab, setTab] = useState<"needs" | "bookings" | "capacity">("needs");
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<string>) =>
    start(async () => {
      try {
        setToast(await fn());
      } catch (e) {
        setToast(e instanceof Error ? e.message : "Something went wrong");
      }
      setTimeout(() => setToast(""), 3000);
    });

  // One card per thing waiting on Andre, one button each.
  const needs = bookings.flatMap((b) => {
    if (!b.signature) return [{ b, what: "Terms change requested", detail: b.change_request || "", cta: "Open", act: () => setOpen(b.id) }];
    if (!b.brief_confirmed_at)
      return [{ b, what: "Confirm the brief", detail: `${b.roles.length > 1 ? `${b.roles.length} roles, first search week` : `${b.roles[0]?.title || "1 role"} · search week`} ${fiveDays(b.roles[0]?.search_week)}`, cta: "Review and confirm", act: () => setOpen(b.id) }];
    if (b.retained && !b.retainer_paid_at)
      return [{ b, what: "Retainer not paid yet", detail: `${gbp(b.retainer)} for ${b.account.accounts_email} · due before ${shortDate(b.roles[0]?.search_week)}`, cta: "Mark as paid", act: () => run(() => markRetainerPaid(b.id)) }];
    const due = b.roles.find((r) => !r.shortlist_sent_at);
    if (due)
      return [{ b, what: "Shortlist due", detail: `${due.title || `Role ${due.position}`}: 5 candidates by ${shortlistDate(due.search_week)}${b.account.tracker_url ? "" : " · build their tracker, add the candidates, then send"}`, cta: "Send shortlist", act: () => (b.account.tracker_url ? run(() => sendShortlist(b.id, due.id)) : setOpen(b.id)) }];
    return [];
  });

  const ob = bookings.find((b) => b.id === open);
  const taken = (wk: string) => bookings.flatMap((b) => b.roles.filter((r) => r.search_week === wk).map(() => b.account.company));
  const download = (path: string) => run(async () => {
    const url = await fileLink(path);
    if (url) window.open(url, "_blank", "noopener");
    return url ? "Opening…" : "File not found";
  });

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <span className={styles.brand}>MakersForge</span>
        <span className={styles.who}>Admin</span>
      </header>
      <nav className={styles.tabs}>
        {(
          [
            ["needs", `Needs you${needs.length ? ` · ${needs.length}` : ""}`],
            ["bookings", "Bookings"],
            ["capacity", "Capacity"],
          ] as const
        ).map(([k, label]) => (
          <button key={k} type="button" className={tab === k ? styles.tabOn : ""} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      <main className={styles.main}>
        {tab === "needs" &&
          (needs.length ? (
            <ul className={styles.needs}>
              {needs.map((n) => (
                <li key={n.b.id + n.what} className="card-shadow">
                  <div>
                    <span className={styles.company}>{n.b.account.company}</span>
                    <strong>{n.what}</strong>
                    <p>{n.detail}</p>
                  </div>
                  <button type="button" className={styles.cta} disabled={pending} onClick={n.act}>
                    {n.cta} →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Nothing waiting on you.</p>
          ))}

        {tab === "bookings" &&
          (bookings.length ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Search week</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} onClick={() => setOpen(b.id)}>
                    <td>
                      <strong>{b.account.company}</strong>
                      <span>
                        {b.ref} · booked {new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </td>
                    <td>
                      {PLAN[b.plan]}
                      {b.roles.length > 1 ? ` · ${b.roles.length} roles` : ""}
                      {b.retained ? " · retained" : ""}
                    </td>
                    <td>{fiveDays(b.roles[0]?.search_week)}</td>
                    <td>{b.plan === "contract" ? `${gbp(1000 * b.roles.length)}/mo` : gbp(b.fees.reduce((a, x) => a + x, 0))}</td>
                    <td>
                      <span className={styles.pill}>{stage(b)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.empty}>No bookings yet.</p>
          ))}

        {tab === "capacity" && (
          <>
            <p className={styles.lede}>2 searches a week. Block a week to take it off the calendar clients see.</p>
            <ul className={styles.weeks}>
              {weeks.map((w) => {
                const who = taken(w.week_start);
                return (
                  <li key={w.week_start} className={`card-shadow ${w.blocked ? styles.off : ""}`}>
                    <strong>{fiveDays(w.week_start)}</strong>
                    <div className={styles.slots}>
                      {Array.from({ length: w.slots }, (_, i) => (
                        <span key={i} className={who[i] ? styles.slotTaken : styles.slotOpen}>
                          {w.blocked ? "Blocked" : (who[i] ?? "Open")}
                        </span>
                      ))}
                    </div>
                    <button type="button" className={styles.link} disabled={pending} onClick={() => run(() => setWeekBlocked(w.week_start, !w.blocked))}>
                      {w.blocked ? "Unblock" : "Block week"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      {/* The full record: what the client entered, the signature, the money, and the next action. */}
      {ob && (
        <div className={styles.scrim} onClick={() => setOpen(null)}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.close} aria-label="Close" onClick={() => setOpen(null)}>
              ×
            </button>
            <span className={styles.company}>
              {stage(ob)} · {ob.ref}
            </span>
            <h2>{ob.account.company}</h2>
            <p className={styles.sub}>
              {ob.user.name} · {ob.user.email}
            </p>

            {ob.change_request && (
              <>
                <h3>Change requested</h3>
                <p className={styles.sub}>{ob.change_request}</p>
              </>
            )}

            <h3>Roles</h3>
            <ul className={styles.roles}>
              {ob.roles.map((r) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.title || `Role ${r.position}`}</strong>
                    <span>
                      {[r.location, r.budget, r.musts].filter(Boolean).join(" · ") || "No details"} · search {fiveDays(r.search_week)}
                    </span>
                    {r.spec_text && <span className={styles.spec}>{r.spec_text.slice(0, 400)}</span>}
                    {r.spec_file_path && (
                      <button type="button" className={styles.link} onClick={() => download(r.spec_file_path!)}>
                        Download spec
                      </button>
                    )}
                  </div>
                  {r.hired_at ? (
                    <em>Hired{r.invoice_amount !== null ? ` · ${gbp(r.invoice_amount)}` : ""}</em>
                  ) : r.shortlist_sent_at ? (
                    <button type="button" className={styles.link} disabled={pending} onClick={() => run(() => markHired(ob.id, r.id))}>
                      Mark hired
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>

            <h3>Deal</h3>
            <dl className={styles.dl}>
              <dt>Plan</dt>
              <dd>
                {PLAN[ob.plan]}
                {ob.retained ? " · retained, 15% off" : " · on success"}
              </dd>
              <dt>Fees</dt>
              <dd>{ob.plan === "contract" ? "£1,000 a month per contractor" : ob.fees.map(gbp).join(", ")}</dd>
              {ob.retained && (
                <>
                  <dt>Retainer</dt>
                  <dd>
                    {gbp(ob.retainer)} · {ob.retainer_paid_at ? "paid" : "not paid yet"}
                  </dd>
                </>
              )}
            </dl>

            <h3>Company</h3>
            <dl className={styles.dl}>
              <dt>Registered</dt>
              <dd>
                {ob.account.legal_name} · {ob.account.company_number}
              </dd>
              <dt>Address</dt>
              <dd>{ob.account.address}</dd>
              <dt>Invoices to</dt>
              <dd>
                {ob.account.accounts_email}
                {ob.account.vat_number ? ` · VAT ${ob.account.vat_number}` : ""}
                {ob.account.po_number ? ` · PO ${ob.account.po_number}` : ""}
              </dd>
              {ob.signature && (
                <>
                  <dt>Terms signed</dt>
                  <dd>
                    {ob.signature.name}, {ob.signature.title} ·{" "}
                    {new Date(ob.signature.signed_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · IP {ob.signature.ip}
                    {ob.terms_pdf_path && (
                      <>
                        {" · "}
                        <button type="button" className={styles.link} onClick={() => download(ob.terms_pdf_path!)}>
                          PDF
                        </button>
                      </>
                    )}
                  </dd>
                </>
              )}
            </dl>

            <h3>Next</h3>
            {!ob.signature ? (
              <p className={styles.sub}>Reply to {ob.user.email} about their change. They sign once it&apos;s agreed.</p>
            ) : !ob.brief_confirmed_at ? (
              <button type="button" className={styles.cta} disabled={pending} onClick={() => run(() => confirmBrief(ob.id))}>
                Confirm brief →
              </button>
            ) : ob.retained && !ob.retainer_paid_at ? (
              <button type="button" className={styles.cta} disabled={pending} onClick={() => run(() => markRetainerPaid(ob.id))}>
                Mark retainer paid →
              </button>
            ) : ob.roles.some((r) => !r.shortlist_sent_at) ? (
              (() => {
                const due = ob.roles.find((r) => !r.shortlist_sent_at)!;
                return ob.account.tracker_url ? (
                  <button type="button" className={styles.cta} disabled={pending} onClick={() => run(() => sendShortlist(ob.id, due.id))}>
                    Send shortlist: {due.title || `Role ${due.position}`} →
                  </button>
                ) : (
                  <>
                    <p className={styles.sub}>Build their base and add the first candidates. Invite them in Airtable, then paste the link: this sends their shortlist and how the tracker works.</p>
                    <form
                      className={styles.trackerForm}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const v = String(new FormData(e.currentTarget).get("t") || "");
                        run(() => sendShortlist(ob.id, due.id, v));
                      }}
                    >
                      <input name="t" placeholder="Paste their Airtable link" />
                      <button type="submit" className={styles.cta} disabled={pending}>
                        Send shortlist →
                      </button>
                    </form>
                  </>
                );
              })()
            ) : (
              <p className={styles.sub}>
                All shortlists sent.{" "}
                {ob.account.tracker_url && (
                  <a href={ob.account.tracker_url} target="_blank" rel="noreferrer">
                    Open their tracker
                  </a>
                )}
              </p>
            )}
          </aside>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
