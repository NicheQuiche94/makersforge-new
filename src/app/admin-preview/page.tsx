"use client";

/**
 * Andre's admin (PROTOTYPE 2026-11-02). Fake data, nothing saved. Three
 * screens: Needs you (one card per thing waiting on him, one button each),
 * Bookings (everything, with the full record), and Capacity (his 2 searches
 * a week). Airtable stays the ATS. Andre builds the client's base once they've
 * paid (retained) or signed (on success), but only invites them when the first
 * candidates are in, so nobody lands in an empty tracker: sending the first
 * shortlist is where he pastes the link, and that one email does both.
 */
import { useState } from "react";
import { BATCH_STEPS, RETAINED_OFF, scheduleRoles, SINGLE_FEE, SLOTS_PER_WEEK, WEEKS, fiveDays, gbp, retainedPrice, shortDate, shortlistDate } from "@/lib/plans";
import styles from "./admin.module.css";

type Plan = "permanent" | "contract" | "batch";
type Role = { title: string; brief: string; hired?: boolean };
type Booking = {
  id: string;
  company: string;
  legal: string;
  number: string;
  contact: string;
  email: string;
  accounts: string;
  plan: Plan;
  retained: boolean;
  week: string;
  roles: Role[];
  signed: string; // signature record
  briefOk: boolean;
  retainerPaid: boolean;
  tracker: string;
  shortlistSent: boolean;
  booked: string;
};

const SEED: Booking[] = [
  {
    id: "b1",
    company: "Northwind Games",
    legal: "Northwind Games Ltd",
    number: "12345678",
    contact: "Sam Patel",
    email: "sam@northwind.com",
    accounts: "accounts@northwind.com",
    plan: "batch",
    retained: true,
    week: "2026-11-09",
    roles: [
      { title: "Senior UA Manager", brief: "Remote (UK/EU) · £70–85k · scaled Meta + Google past $100k/day" },
      { title: "Creative Strategist", brief: "London hybrid · £55–65k · UGC + playable ads" },
      { title: "Product Manager, LiveOps", brief: "Remote · £75–90k · F2P economy, events" },
    ],
    signed: "Sam Patel, Head of Growth · 2 Nov 2026, 10:42 · 81.2.69.160",
    briefOk: false,
    retainerPaid: false,
    tracker: "",
    shortlistSent: false,
    booked: "Today, 10:42",
  },
  {
    id: "b2",
    company: "Pixel Harbor",
    legal: "Pixel Harbor Studios Ltd",
    number: "09876543",
    contact: "Jo Lindqvist",
    email: "jo@pixelharbor.io",
    accounts: "finance@pixelharbor.io",
    plan: "permanent",
    retained: false,
    week: "2026-11-30",
    roles: [{ title: "Lead Unity Engineer", brief: "Remote EU · €80–95k · mobile performance, live game" }],
    signed: "Jo Lindqvist, CTO · 30 Oct 2026, 16:05 · 194.9.11.20",
    briefOk: true,
    retainerPaid: false,
    tracker: "https://airtable.com/appPixelHarbor",
    shortlistSent: false,
    booked: "30 Oct",
  },
  {
    id: "b3",
    company: "Tidewave Apps",
    legal: "Tidewave Apps Ltd",
    number: "11223344",
    contact: "Priya Shah",
    email: "priya@tidewave.app",
    accounts: "priya@tidewave.app",
    plan: "contract",
    retained: false,
    week: "2026-11-02",
    roles: [{ title: "UA Contractor (TikTok)", brief: "Remote · £450/day · 3 months" }],
    signed: "Priya Shah, Founder · 26 Oct 2026, 09:12 · 86.4.150.3",
    briefOk: true,
    retainerPaid: false,
    tracker: "https://airtable.com/appTidewave",
    shortlistSent: true,
    booked: "26 Oct",
  },
];

const PLAN_NAME: Record<Plan, string> = { permanent: "Permanent hire", contract: "Contractor", batch: "Batch" };

/** What the booking is worth and how the next hire is invoiced (retainer credited first). */
function money(b: Booking) {
  const n = b.roles.length;
  const fees = b.plan === "batch" ? BATCH_STEPS.slice(0, n) : Array(n).fill(SINGLE_FEE);
  const k = b.retained ? 1 - RETAINED_OFF : 1;
  const full = fees.reduce((a, x) => a + x, 0);
  const ret = b.retained ? retainedPrice(full) : null;
  const hires = b.roles.filter((r) => r.hired).length;
  const usedBefore = fees.slice(0, hires).reduce((a, x) => a + x * k, 0);
  const nextFee = fees[hires] !== undefined ? fees[hires] * k : 0;
  const credit = ret ? Math.max(0, ret.upfront - usedBefore) : 0;
  return { ret, full: full * k, nextFee, nextInvoice: Math.max(0, nextFee - credit), credit };
}

function stage(b: Booking) {
  if (!b.briefOk) return "New booking";
  if (b.retained && !b.retainerPaid) return "Waiting on retainer";
  if (b.roles.every((r) => r.hired)) return "Complete";
  if (b.roles.some((r) => r.hired)) return "Hiring";
  return b.shortlistSent ? "Interviewing" : "Searching";
}

export default function AdminPreview() {
  const [tab, setTab] = useState<"needs" | "bookings" | "capacity">("needs");
  const [data, setData] = useState(SEED);
  const [open, setOpen] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string[]>(["2026-12-21", "2026-12-28"]);
  const [toast, setToast] = useState("");

  const upd = (id: string, ch: Partial<Booking>, msg: string) => {
    setData((d) => d.map((b) => (b.id === id ? { ...b, ...ch } : b)));
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };
  const hire = (b: Booking, i: number) => {
    const m = money(b);
    upd(b.id, { roles: b.roles.map((r, j) => (j === i ? { ...r, hired: true } : r)) }, m.nextInvoice ? `Invoice details for ${gbp(m.nextInvoice)} emailed to you` : "Hire covered by the retainer: no invoice needed");
  };

  // One card per thing waiting on Andre, oldest first. One button each.
  const needs = data.flatMap((b) => {
    const out: { b: Booking; what: string; detail: string; cta: string; act: () => void; input?: boolean }[] = [];
    if (!b.briefOk)
      out.push({ b, what: "Confirm the brief", detail: `${b.roles.length > 1 ? `${b.roles.length} roles, first search week` : b.roles[0].title + " · search week"} ${fiveDays(b.week)}`, cta: "Review and confirm", act: () => setOpen(b.id) });
    else if (b.retained && !b.retainerPaid)
      out.push({ b, what: "Retainer not paid yet", detail: `${gbp(money(b).ret!.upfront)} for ${b.accounts} · due before ${shortDate(b.week)}`, cta: "Mark as paid", act: () => upd(b.id, { retainerPaid: true }, "Retainer marked paid") });
    else if (!b.shortlistSent)
      out.push({
        b,
        what: "Shortlist due",
        detail: `5 candidates by ${shortlistDate(b.week)}${b.tracker ? "" : " · build their tracker, add the candidates, then send"}`,
        cta: "Send shortlist",
        act: () => (b.tracker ? upd(b.id, { shortlistSent: true }, "Shortlist sent · client emailed") : setOpen(b.id)),
      });
    return out;
  });

  const ob = data.find((b) => b.id === open);

  return (
    <div className={styles.page}>
      <p className={styles.proto}>Prototype · fake data, nothing is saved</p>
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
                    <span className={styles.company}>{n.b.company}</span>
                    <strong>{n.what}</strong>
                    <p>{n.detail}</p>
                  </div>
                  <button type="button" className={styles.cta} onClick={n.act}>
                    {n.cta} →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Nothing waiting on you.</p>
          ))}

        {tab === "bookings" && (
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
              {data.map((b) => (
                <tr key={b.id} onClick={() => setOpen(b.id)}>
                  <td>
                    <strong>{b.company}</strong>
                    <span>Booked {b.booked}</span>
                  </td>
                  <td>
                    {PLAN_NAME[b.plan]}
                    {b.roles.length > 1 ? ` · ${b.roles.length} roles` : ""}
                    {b.retained ? " · retained" : ""}
                  </td>
                  <td>{fiveDays(b.week)}</td>
                  <td>{b.plan === "contract" ? `${gbp(1000 * b.roles.length)}/mo` : gbp(money(b).full)}</td>
                  <td>
                    <span className={styles.pill}>{stage(b)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "capacity" && (
          <>
            <p className={styles.lede}>{SLOTS_PER_WEEK} searches a week. Block a week to take it off the calendar clients see.</p>
            <ul className={styles.weeks}>
              {WEEKS.map((w) => {
                // Each role holds its own slot (a batch spreads across weeks).
                const taken = data.flatMap((b) => scheduleRoles(b.week, b.roles.length).filter((x) => x === w.start).map(() => b));
                const off = blocked.includes(w.start);
                return (
                  <li key={w.start} className={`card-shadow ${off ? styles.off : ""}`}>
                    <strong>{fiveDays(w.start)}</strong>
                    <div className={styles.slots}>
                      {Array.from({ length: SLOTS_PER_WEEK }, (_, i) => (
                        <span key={i} className={taken[i] ? styles.slotTaken : styles.slotOpen}>
                          {off ? "Blocked" : (taken[i]?.company ?? "Open")}
                        </span>
                      ))}
                    </div>
                    <button type="button" className={styles.link} onClick={() => setBlocked((bl) => (off ? bl.filter((x) => x !== w.start) : [...bl, w.start]))}>
                      {off ? "Unblock" : "Block week"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      {/* The full record: everything the client entered, the signature, the money, and the next action. */}
      {ob && (
        <div className={styles.scrim} onClick={() => setOpen(null)}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.close} aria-label="Close" onClick={() => setOpen(null)}>
              ×
            </button>
            <span className={styles.company}>{stage(ob)}</span>
            <h2>{ob.company}</h2>
            <p className={styles.sub}>
              {ob.contact} · {ob.email}
            </p>

            <h3>Roles</h3>
            <ul className={styles.roles}>
              {ob.roles.map((r, i) => (
                <li key={r.title}>
                  <div>
                    <strong>{r.title}</strong>
                    <span>{r.brief}</span>
                  </div>
                  {ob.shortlistSent && ob.plan !== "contract" &&
                    (r.hired ? (
                      <em>Hired</em>
                    ) : (
                      <button type="button" className={styles.link} onClick={() => hire(ob, i)}>
                        Mark hired
                      </button>
                    ))}
                </li>
              ))}
            </ul>

            <h3>Deal</h3>
            <dl className={styles.dl}>
              <dt>Plan</dt>
              <dd>
                {PLAN_NAME[ob.plan]}
                {ob.retained ? ` · retained, ${RETAINED_OFF * 100}% off` : " · on success"}
              </dd>
              <dt>Search week</dt>
              <dd>
                {fiveDays(ob.week)} · shortlist {shortlistDate(ob.week)}
              </dd>
              {ob.retained && (
                <>
                  <dt>Retainer</dt>
                  <dd>
                    {gbp(money(ob).ret!.upfront)} · {ob.retainerPaid ? "paid" : "invoiced, not paid"}
                    {ob.retainerPaid && money(ob).credit > 0 ? ` · ${gbp(money(ob).credit)} credit left` : ""}
                  </dd>
                </>
              )}
              {ob.plan !== "contract" && money(ob).nextFee > 0 && (
                <>
                  <dt>Next hire</dt>
                  <dd>
                    {gbp(money(ob).nextFee)} fee · invoice {gbp(money(ob).nextInvoice)}
                  </dd>
                </>
              )}
            </dl>

            <h3>Company</h3>
            <dl className={styles.dl}>
              <dt>Registered</dt>
              <dd>
                {ob.legal} · {ob.number}
              </dd>
              <dt>Invoices to</dt>
              <dd>{ob.accounts}</dd>
              <dt>Terms signed</dt>
              <dd>
                {ob.signed} · <a href="#">PDF</a>
              </dd>
            </dl>

            <h3>Next</h3>
            {!ob.briefOk ? (
              <button type="button" className={styles.cta} onClick={() => upd(ob.id, { briefOk: true }, "Brief confirmed · client emailed")}>
                Confirm brief →
              </button>
            ) : ob.retained && !ob.retainerPaid ? (
              <button type="button" className={styles.cta} onClick={() => upd(ob.id, { retainerPaid: true }, "Retainer marked paid")}>
                Mark retainer paid →
              </button>
            ) : !ob.tracker ? (
              <>
                <p className={styles.sub}>Build their base and add the first candidates. Invite them in Airtable, then paste the link: this sends their shortlist and how the tracker works.</p>
                <form
                  className={styles.trackerForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = new FormData(e.currentTarget).get("t") as string;
                    if (v) upd(ob.id, { tracker: v, shortlistSent: true }, "Shortlist sent with their tracker invite");
                  }}
                >
                  <input name="t" placeholder="Paste their Airtable link" />
                  <button type="submit" className={styles.cta}>
                    Send shortlist →
                  </button>
                </form>
              </>
            ) : (
              <p className={styles.sub}>
                Tracker:{" "}
                <a href={ob.tracker} target="_blank" rel="noreferrer">
                  open in Airtable
                </a>
              </p>
            )}
          </aside>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
