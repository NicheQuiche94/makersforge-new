"use client";

/**
 * Self-onboarding flow (PROTOTYPE 2026-11-02, Andre's brief). Click-through
 * only: nothing is sent, saved server-side or charged (the draft lives in
 * this browser so a refresh doesn't lose it).
 *
 * Order: search week → brief → you → plan → terms → review → payment (retained).
 *  - The week always comes first: it's held ("Reserved · finish your booking
 *    to keep it") while they go.
 *  - Two ways in: from Plans & pricing the plan arrives pre-picked; from
 *    "Get started" it's chosen at the plan step.
 *  - Terms come after the plan because they depend on it (pay-as-you-go vs a
 *    retained) and collect the invoice details (Andre's accountant invoices
 *    fees on hire; a retainer is invoiced up front too, no card payments yet).
 *  - Review is a final check, not a listed step. Delivery dates are a promise,
 *    never a term. One job per screen.
 */
import { useEffect, useRef, useState, type DragEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { ROSTER } from "@/data/roster";
import { BATCH_MAX, BATCH_SIZES, PLANS, scheduleRoles, SINGLE_FEE, TERMS, batchSteps, batchTotal, fiveDays as fiveDaysOf, gbp, gbpK, planById, retainedPrice, shortDate as shortDateOf, shortlistDate as shortlistDateOf, type PayWhen, type PlanId } from "@/lib/plans";

// Dates show "…" until the live calendar has loaded and a week is picked.
const fiveDays = (w?: string) => (w ? fiveDaysOf(w) : "…");
const shortDate = (w?: string) => (w ? shortDateOf(w) : "…");
const shortlistDate = (w?: string) => (w ? shortlistDateOf(w) : "…");
import { track } from "@/lib/analytics";
import { CallLink } from "./Bits";
import { PayToggle } from "./PlanCards";
import { WeekCalendar } from "./WeekCalendar";
import styles from "./StartFlow.module.css";

type Step = "week" | "brief" | "you" | "plan" | "terms" | "requested" | "review" | "pay" | "done";
// The five listed steps, in the same order in the progress bar and "Your booking".
const LISTED: { step: Step; label: string }[] = [
  { step: "week", label: "Search week" },
  { step: "brief", label: "Brief" },
  { step: "you", label: "You" },
  { step: "plan", label: "Plan" },
  { step: "terms", label: "Terms" },
];
const DRAFT = "mf-start-draft";

// What "Fill in from the spec" would pull out (the real thing reads the JD with AI).
const SAMPLE = {
  role: "Senior UA Manager",
  location: "Remote (UK / EU)",
  budget: "£70k to £85k",
  musts: "Scaled Meta + Google past $100k/day · casual or puzzle · creative testing",
};

const EMPTY_BILLING = { legal: "", number: "", address: "", vat: "", accounts: "", po: "" };

// One brief per role: a batch is briefed role by role ("+ Add another role").
type Brief = { spec: string; file: string | null; f: { role: string; location: string; budget: string; musts: string } };
const EMPTY_BRIEF: Brief = { spec: "", file: null, f: { role: "", location: "", budget: "", musts: "" } };
const briefed = (b: Brief) => !!(b.f.role || b.spec.trim() || b.file);
const roleName = (b: Brief, i: number) => b.f.role || b.file || (b.spec.trim() ? "From your notes" : `Role ${i + 1}`);

export function StartFlow() {
  const params = useSearchParams();
  const person = ROSTER.find((p) => p.id === params.get("candidate"));
  const preset = planById(params.get("plan"))?.id as PlanId | undefined;
  // Live search weeks from the database (slots left after other bookings and blocked weeks).
  const [weeks, setWeeks] = useState<{ start: string; open: number }[] | null>(null);
  const [weeksError, setWeeksError] = useState(false);
  const draftStart = useRef<string | null>(null);

  const [step, setStep] = useState<Step>("week");
  const [start, setStart] = useState("");
  const [briefs, setBriefs] = useState<Brief[]>([EMPTY_BRIEF]);
  const [cur, setCur] = useState(0);
  const { spec, file, f } = briefs[cur] ?? EMPTY_BRIEF;
  const patch = (b: Partial<Brief>) => setBriefs((bs) => bs.map((x, i) => (i === cur ? { ...x, ...b } : x)));
  const setSpec = (v: string) => patch({ spec: v });
  const setFile = (v: string | null) => patch({ file: v });
  const setF = (v: Brief["f"]) => patch({ f: v });
  const [you, setYou] = useState({ name: "", email: "", company: "" });
  const [plan, setPlan] = useState<PlanId | undefined>(preset);
  const [when, setWhen] = useState<PayWhen>(params.get("pay") === "retained" ? "retained" : "success");
  const [roles, setRoles] = useState(2);
  const [bill, setBill] = useState(EMPTY_BILLING);
  const [sign, setSign] = useState({ name: "", title: "", agree: false });
  const [change, setChange] = useState({ open: false, text: "" });
  const [saved, setSaved] = useState(false);
  const loaded = useRef(false);

  // Keep the draft in this browser so a refresh or a "finish later" doesn't lose it.
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT) || "null");
      if (d) {
        if (Array.isArray(d.briefs) && d.briefs.length) setBriefs(d.briefs);
        if (d.you) setYou(d.you);
        if (d.bill) setBill(d.bill);
        if (d.start) draftStart.current = d.start;
      }
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    fetch("/api/onboarding/weeks")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((w: { start: string; open: number }[]) => {
        setWeeks(w);
        const ok = (x?: string | null) => !!x && w.some((y) => y.start === x && y.open > 0);
        const wanted = params.get("week");
        setStart(ok(wanted) ? wanted! : ok(draftStart.current) ? draftStart.current! : (w.find((y) => y.open > 0)?.start ?? ""));
      })
      .catch(() => setWeeksError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Who's signed in already (a returning client skips the email code).
  const [verified, setVerified] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/onboarding/me")
      .then((r) => r.json())
      .then((d) => setVerified(d.email ?? null))
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(DRAFT, JSON.stringify({ start, briefs, you, bill }));
    } catch {}
  }, [start, briefs, you, bill]);

  const p = plan ? planById(plan) : undefined;
  // Retained only applies to permanent roles (one or a batch); the retainer is the one thing paid up front.
  const canRetain = plan === "permanent" || plan === "batch";
  const isRetained = canRetain && when === "retained";
  // How many roles they're paying for, and the fee per hire at that size.
  const n = plan === "batch" ? roles : briefs.length;
  // A batch steps down £1,000 a hire; separate single hires are £12,000 each.
  const fees = plan === "batch" ? batchSteps(roles) : Array(n).fill(SINGLE_FEE);
  const full = plan === "batch" ? batchTotal(roles) : SINGLE_FEE * n;
  const ret = retainedPrice(full);
  // Each role gets its own search slot; the panel, review and confirmation show when each runs.
  const roleNames = Array.from({ length: n }, (_, i) => (briefs[i] && briefed(briefs[i]) ? roleName(briefs[i], i) : `Role ${i + 1}`));
  const sched = start && weeks ? scheduleRoles(start, Math.max(1, n), weeks) : [];
  const ladder = (k = 1) => fees.map((x) => gbpK(x * k)).join(", ");
  const allFilled = n === 1 ? "" : n === 2 ? " if both are filled" : ` if all ${n} are filled`;
  // The running total in "Your booking": price per role, then what it comes to.
  const price = !p
    ? null
    : plan === "contract"
      ? { each: "£1,000 a month per contractor", total: `${gbp(1_000 * n)} a month`, note: n === 1 ? "While they're engaged." : `While ${n === 2 ? "both are" : `all ${n} are`} engaged.` }
      : isRetained
        ? { each: n > 1 ? `${ladder(0.85)} per hire, retained` : `${gbp(ret.total)} per hire, retained`, total: gbp(ret.total), note: `${n > 1 ? `If ${allFilled.replace(" if ", "")}. ` : ""}${gbp(ret.upfront)} when you sign, counted towards your first ${n > 1 ? "hires" : "hire"}.` }
        : { each: plan === "batch" ? `${ladder()} per hire` : `${gbp(SINGLE_FEE)} per hire`, total: gbp(full), note: n === 1 ? "Nothing up front. Invoiced when your hire starts." : `If ${allFilled.replace(" if ", "")}. Nothing up front.` };
  const order: Step[] = ["week", "brief", "you", "plan", "terms", "review", ...(isRetained ? (["pay"] as Step[]) : []), "done"];
  const at = order.indexOf(step === "requested" ? "terms" : step);
  const go = (s: Step) => {
    setSaved(false);
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => go(order[Math.min(at + 1, order.length - 1)]);
  // Funnel: which step a visitor reaches (no personal details, just the step and plan).
  useEffect(() => {
    track("booking_step", { step, plan: plan ?? "none", retained: isRetained, roles: briefs.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  // Several roles briefed: default to a batch of exactly that many (contractors stay contractors).
  useEffect(() => {
    if (briefs.length < 2) return;
    setRoles((r) => Math.max(r, Math.min(BATCH_MAX, briefs.length)));
    if (step === "plan") setPlan((pl) => (pl === "contract" ? pl : "batch"));
  }, [step, briefs.length]);
  const addRole = () => {
    setBriefs((bs) => [...bs, EMPTY_BRIEF]);
    setCur(briefs.length);
  };
  const removeRole = (i: number) => {
    setBriefs((bs) => bs.filter((_, j) => j !== i));
    setCur((c) => Math.max(0, c >= i ? c - 1 : c));
  };
  const back = () => go(order[Math.max(at - 1, 0)]);
  const passed = (s: Step) => at > order.indexOf(s);
  const workEmail = (e: string) => /^[^@\s]+@(?!gmail\.|googlemail\.|outlook\.|hotmail\.|yahoo\.|icloud\.|proton)[^@\s]+\.[^@\s]+$/i.test(e);
  const billingOk = !!(bill.legal && bill.number && bill.address && workEmail(bill.accounts));

  const files = useRef<(File | null)[]>([]);
  const takeFile = (fl: File | null | undefined) => {
    files.current[cur] = fl ?? null;
    setFile(fl?.name ?? null);
  };
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    takeFile(e.dataTransfer.files?.[0]);
  };

  // Email check: a 6-digit code typed in here (no switching tabs).
  const [code, setCode] = useState({ sent: false, value: "", busy: false, error: "" });
  const emailOk = verified && verified === you.email.trim().toLowerCase();
  const sendCode = async () => {
    setCode({ ...code, busy: true, error: "" });
    const r = await fetch("/api/onboarding/code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: you.email.trim(), first: you.name.split(/\s+/)[0] }) });
    const d = await r.json().catch(() => ({}));
    setCode({ sent: r.ok, value: "", busy: false, error: r.ok ? "" : d.error || "Something went wrong. Please try again." });
  };
  const checkCode = async () => {
    setCode({ ...code, busy: true, error: "" });
    const r = await fetch("/api/onboarding/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: you.email.trim(), code: code.value }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      setVerified(you.email.trim().toLowerCase());
      setCode({ sent: true, value: "", busy: false, error: "" });
      next();
    } else setCode({ ...code, busy: false, error: d.error || "That code didn't work." });
  };

  // Save the booking: everything goes to the server, which re-prices it, books the
  // slots (refusing if a week has just filled), records the signature, makes the
  // signed PDF and sends the emails.
  const [sending, setSending] = useState({ busy: false, error: "", ref: "" });
  const submit = async (opts: { changeRequest?: string; then: Step }) => {
    setSending({ busy: true, error: "", ref: "" });
    const body = new FormData();
    body.set(
      "data",
      JSON.stringify({
        start,
        plan,
        retained: isRetained,
        roles,
        briefs: briefs.map((b) => ({ title: b.f.role, location: b.f.location, budget: b.f.budget, musts: b.f.musts, spec: b.spec })),
        you,
        bill,
        sign,
        changeRequest: opts.changeRequest,
      }),
    );
    files.current.forEach((fl, i) => fl && body.set(`spec-${i}`, fl));
    const r = await fetch("/api/onboarding/book", { method: "POST", body });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      setSending({ busy: false, error: d.error || "Something went wrong saving your booking. Please try again.", ref: "" });
      return;
    }
    try {
      localStorage.removeItem(DRAFT);
    } catch {}
    setSending({ busy: false, error: "", ref: d.ref });
    go(opts.then);
  };

  // What they're buying, in one line (plan step, review, booking panel).
  const what = plan === "batch" ? `Batch of ${n} roles` : n > 1 ? `${p?.name} × ${n}` : (p?.name ?? "");
  const deal = !p || !price ? "" : `${what} · ${price.each} · ${price.total}${plan === "contract" ? "" : allFilled}`;

  // The five lines change with the deal (on hire vs retained).
  const feeLine =
    plan === "contract"
      ? "Nothing up front: £1,000 a month per contractor, invoiced while they're engaged"
      : isRetained
        ? `Retainer of ${gbp(ret.upfront)} when you sign (non-refundable), credited against your first hires; then each hire is invoiced at its fee, 15% off`
        : plan === "batch"
          ? "Nothing up front: £12,000 for your first hire, then £1,000 less for each one after, invoiced as each hire starts"
          : "Nothing up front: £12,000, invoiced when your hire starts";
  const termLines: string[] = !p
    ? []
    : [
        "Flat fees. Never a percentage of salary or a markup on day rates",
        feeLine,
        `${TERMS.paymentDays}-day payment terms`,
        `Candidates we introduce remain billable for ${TERMS.billableMonths} months after introduction`,
        `Cancel your search week free up to ${TERMS.cancelHours} hours before it starts`,
      ];

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <ol className={styles.progress} aria-label="Steps">
            {LISTED.map((l) => (
              <li
                key={l.step}
                className={passed(l.step) ? styles.doneStep : step === l.step || (step === "requested" && l.step === "terms") ? styles.current : ""}
              >
                {l.label}
              </li>
            ))}
          </ol>

          <div className={`card-shadow ${styles.card}`}>
            {step === "week" && (
              <>
                <h1 className={styles.h1}>Book your search week</h1>
                <p className={styles.sub}>
                  Your search week is time set aside just for your role: we headhunt and call all week, and your 5 candidates land the Monday after.
                  Then we book the interviews and run the process with you until you hire. We run 2 searches a week, so hiring later? Book ahead.
                </p>
                {preset === "batch" && (
                  <p className={styles.attached}>Booking a batch? Each role gets its own search slot. This is the week your first one starts; the rest follow in the next open slots.</p>
                )}
                {person && (
                  <p className={styles.attached}>
                    Interview request: <strong>{person.codename}</strong> · {person.role}
                  </p>
                )}
                {weeks ? (
                  <WeekCalendar selected={start} onSelect={setStart} weeks={weeks} />
                ) : weeksError ? (
                  <p className={styles.warn}>
                    We couldn&apos;t load the calendar. Please refresh, or <CallLink className={styles.callBtn}>book 15 minutes with Andre</CallLink>.
                  </p>
                ) : (
                  <p className={styles.sub}>Loading this month&apos;s availability…</p>
                )}
                <Nav onNext={next} nextOk={!!start} nextLabel="Reserve this week" />
              </>
            )}

            {step === "brief" && (
              <>
                <h1 className={styles.h1}>{briefs.length > 1 ? "Tell us about the roles" : "Tell us about the role"}</h1>
                {briefs.length > 1 && (
                  <div className={styles.roleTabs}>
                    {briefs.map((b, i) => (
                      <span key={i} className={`${styles.roleTab} ${i === cur ? styles.roleTabOn : ""}`}>
                        <button type="button" onClick={() => setCur(i)}>
                          {briefed(b) ? "✓ " : ""}
                          {roleName(b, i)}
                        </button>
                        <button type="button" className={styles.roleX} aria-label={`Remove ${roleName(b, i)}`} onClick={() => removeRole(i)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <label className={`${styles.drop} ${file ? styles.dropHas : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className={styles.fileInput}
                    onChange={(e) => takeFile(e.target.files?.[0])}
                  />
                  {file ? (
                    <span>
                      <strong>{file}</strong> attached ·{" "}
                      <button type="button" className={styles.link} onClick={(e) => (e.preventDefault(), takeFile(null))}>
                        remove
                      </button>
                    </span>
                  ) : (
                    <span>
                      <strong>Drop your job spec here</strong> (PDF or Word), or click to choose a file
                    </span>
                  )}
                </label>
                <label className={styles.field}>
                  <span>Or paste it, or write a few lines</span>
                  <textarea
                    rows={3}
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    placeholder="The whole spec, or just: Senior UA Manager, remote, scaled Meta past $100k a day…"
                  />
                </label>
                <Button variant="ghost" size="sm" className={styles.fill} onClick={() => setF(SAMPLE)}>
                  ✦ Fill in from the spec
                </Button>
                <div className={styles.row2}>
                  <Field label="Role" value={f.role} onChange={(v) => setF({ ...f, role: v })} />
                  <Field label="Location" value={f.location} onChange={(v) => setF({ ...f, location: v })} placeholder="Remote, hybrid, city" />
                  <Field label="Budget" value={f.budget} onChange={(v) => setF({ ...f, budget: v })} placeholder="Salary or day rate" />
                  <Field
                    label="Must-haves"
                    value={f.musts}
                    onChange={(v) => setF({ ...f, musts: v })}
                    placeholder="The 2 or 3 things that matter most"
                  />
                </div>
                {briefs.length < BATCH_MAX && (
                  <button type="button" className={styles.addRole} onClick={addRole}>
                    + Add another role
                  </button>
                )}
                <Nav onBack={back} onNext={next} onSave={() => setSaved(true)} saved={saved} nextOk={briefs.every(briefed)} />
              </>
            )}

            {step === "you" && (
              <>
                <h1 className={styles.h1}>Who are we working with?</h1>
                <p className={styles.sub}>We&apos;ll email you a 6-digit code to confirm it&apos;s you. No password to remember.</p>
                <div className={styles.row2}>
                  <Field label="Your name" value={you.name} onChange={(v) => setYou({ ...you, name: v })} />
                  <Field label="Company" value={you.company} onChange={(v) => setYou({ ...you, company: v })} />
                </div>
                <Field label="Work email" value={you.email} onChange={(v) => setYou({ ...you, email: v })} placeholder="you@studio.com" />
                {you.email && !workEmail(you.email) && (
                  <p className={styles.warn}>Please use your work email so we know which studio you&apos;re from.</p>
                )}
                {code.sent && !emailOk && (
                  <div className={styles.codeRow}>
                    <Field label={`Code we sent to ${you.email}`} value={code.value} onChange={(v) => setCode({ ...code, value: v.replace(/\D/g, "").slice(0, 6) })} placeholder="123456" />
                    <button type="button" className={styles.link} onClick={sendCode} disabled={code.busy}>
                      Send a new code
                    </button>
                  </div>
                )}
                {code.error && <p className={styles.warn}>{code.error}</p>}
                <Nav
                  onBack={back}
                  onNext={emailOk ? next : code.sent ? checkCode : sendCode}
                  onSave={() => setSaved(true)}
                  saved={saved}
                  nextOk={!!(you.name && you.company && workEmail(you.email)) && !code.busy && (!code.sent || emailOk || code.value.length === 6)}
                  nextLabel={emailOk ? "Continue" : code.sent ? "Confirm code" : "Email me a code"}
                />
              </>
            )}

            {step === "plan" && (
              <>
                <div className={styles.planHead}>
                  <h1 className={styles.h1}>Choose your plan</h1>
                  {briefs.length < 2 && <p className={styles.sub}>Most teams start with one role and see how we work.</p>}
                </div>

                <PayToggle pay={when} setPay={setWhen} />
                <div className={styles.planList}>
                  {PLANS.map((x) => (
                    <PlanOption key={x.id} x={x} pay={when} on={plan === x.id} pick={() => setPlan(x.id)} roles={plan === "batch" ? roles : undefined} />
                  ))}
                </div>

                {plan === "batch" && (
                  <div className={styles.planGroup}>
                    <h2 className={styles.groupH}>How many roles?</h2>
                    <div className={styles.toggle} role="group" aria-label="Roles in the batch">
                      {BATCH_SIZES.map((r) => (
                        <button key={r} type="button" className={roles === r ? styles.toggleOn : ""} disabled={r < briefs.length} onClick={() => setRoles(r)}>
                          {r}
                        </button>
                      ))}
                    </div>
                    {briefs.length < roles && (
                      <p className={styles.attached}>
                        You&apos;ve briefed {briefs.length} of {roles}.{" "}
                        <button
                          type="button"
                          className={styles.link}
                          onClick={() => {
                            setBriefs((bs) => [...bs, ...Array.from({ length: roles - bs.length }, () => EMPTY_BRIEF)]);
                            setCur(briefs.length);
                            go("brief");
                          }}
                        >
                          Add the other {roles - briefs.length === 1 ? "role" : `${roles - briefs.length} roles`}
                        </button>
                      </p>
                    )}
                  </div>
                )}

                <Nav onBack={back} onNext={next} onSave={() => setSaved(true)} saved={saved} nextOk={!!p} />
              </>
            )}

            {step === "terms" && p && (
              <>
                {/* Details first: the terms PDF is generated with them filled in (like the
                    talent spec PDFs), so the download only unlocks once they're entered. */}
                <h1 className={styles.h1}>Your terms</h1>
                <h2 className={styles.h2}>Company details</h2>
                <p className={styles.subSmall}>These go on your terms and invoices.</p>
                <div className={styles.row2}>
                  <Field
                    label="Registered company name"
                    value={bill.legal}
                    onChange={(v) => setBill({ ...bill, legal: v })}
                    placeholder={you.company ? `${you.company} Ltd` : ""}
                  />
                  <Field label="Company number" value={bill.number} onChange={(v) => setBill({ ...bill, number: v })} />
                </div>
                <Field label="Registered address" value={bill.address} onChange={(v) => setBill({ ...bill, address: v })} />
                <div className={styles.row2}>
                  <Field
                    label="Accounts email"
                    value={bill.accounts}
                    onChange={(v) => setBill({ ...bill, accounts: v })}
                    placeholder="accounts@studio.com"
                  />
                  <Field label="VAT number (if registered)" value={bill.vat} onChange={(v) => setBill({ ...bill, vat: v })} />
                </div>
                <Field label="PO number (if you use them)" value={bill.po} onChange={(v) => setBill({ ...bill, po: v })} />

                <h2 className={styles.h2}>In five lines</h2>
                <ul className={styles.deal}>
                  {termLines.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {billingOk ? (
                  <a
                    className={styles.download}
                    href={`/api/onboarding/terms-pdf?${new URLSearchParams({ plan: plan ?? "permanent", retained: isRetained ? "1" : "0", roles: String(plan === "batch" ? roles : briefs.length), client: bill.legal, number: bill.number, address: bill.address })}`}
                  >
                    ↓ Download your terms (PDF), made out to {bill.legal}
                  </a>
                ) : (
                  <p className={styles.downloadOff}>↓ Your full terms (PDF) are ready to download once your company details are in</p>
                )}

                <div className={styles.sigs}>
                  <div>
                    <span className={styles.sigLabel}>Signed for MakersForge</span>
                    <span className={styles.sigName}>Andre Lemaitre</span>
                  </div>
                  <div>
                    <span className={styles.sigLabel}>Signed for {bill.legal || you.company || "your company"}</span>
                    <div className={styles.row2}>
                      <Field label="Type your full name" value={sign.name} onChange={(v) => setSign({ ...sign, name: v })} />
                      <Field label="Job title" value={sign.title} onChange={(v) => setSign({ ...sign, title: v })} />
                    </div>
                    <label className={styles.check}>
                      <input type="checkbox" checked={sign.agree} onChange={(e) => setSign({ ...sign, agree: e.target.checked })} />I agree on behalf
                      of {bill.legal || you.company || "my company"}
                    </label>
                  </div>
                </div>
                {change.open ? (
                  <div className={styles.change}>
                    <textarea
                      rows={3}
                      value={change.text}
                      onChange={(e) => setChange({ ...change, text: e.target.value })}
                      placeholder="What would you like changed?"
                    />
                    <div className={styles.changeBtns}>
                      <Button variant="primary" size="sm" disabled={!change.text.trim() || sending.busy} onClick={() => submit({ changeRequest: change.text.trim(), then: "requested" })}>
                        Save &amp; send request
                      </Button>
                      <button type="button" className={styles.link} onClick={() => setChange({ open: false, text: "" })}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className={styles.link} onClick={() => setChange({ ...change, open: true })}>
                    Need a change to the terms?
                  </button>
                )}
                {!change.open && (
                  <Nav
                    onBack={back}
                    onNext={next}
                    onSave={() => setSaved(true)}
                    saved={saved}
                    nextOk={!!(billingOk && sign.name && sign.title && sign.agree)}
                    nextLabel="Sign"
                  />
                )}
              </>
            )}

            {step === "requested" && (
              <>
                <h1 className={styles.h1}>Request received.</h1>
                <p className={styles.sub}>
                  We&apos;ll come back to you as soon as we can, usually within a working day. Everything you&apos;ve entered is saved, and your week
                  of {shortDate(start)} stays held. When we reply you&apos;ll get a link to pick up right here and sign.
                </p>
                <blockquote className={styles.quote}>{change.text}</blockquote>
                {sending.ref && <p className={styles.subSmall}>Reference {sending.ref}</p>}
                <Button href="/" variant="ghost" arrow>
                  Back to the site
                </Button>
              </>
            )}

            {step === "review" && p && (
              <>
                <h1 className={styles.h1}>Check everything and confirm</h1>
                <dl className={styles.review}>
                  {n > 1 ? (
                    <Row k="Search weeks" v={roleNames.map((r, i) => `${r}: ${fiveDays(sched[i])}`).join(" · ")} />
                  ) : (
                    <Row k="Search week" v={`${fiveDays(start)} · shortlist by ${shortlistDate(start)}`} />
                  )}
                  <Row k={briefs.length > 1 ? "Roles" : "Role"} v={briefs.map(roleName).join(" · ")} />
                  <Row k="Contact" v={`${you.name} · ${you.email}`} />
                  <Row k="Plan" v={deal} />
                  <Row k="Billed to" v={`${bill.legal} · ${bill.number} · ${bill.accounts}`} />
                  <Row k="Terms" v={`Signed by ${sign.name}, ${sign.title}`} />
                </dl>
                {sending.error && <p className={styles.warn}>{sending.error}</p>}
                <Nav
                  onBack={back}
                  onNext={isRetained ? next : () => submit({ then: "done" })}
                  nextOk={!sending.busy}
                  nextLabel={sending.busy ? "Booking…" : isRetained ? "Continue to your invoice" : "Confirm my booking"}
                />
              </>
            )}

            {step === "pay" && p && (
              <>
                {/* Andre 2026-11-02: invoice, not Stripe, for now. B2B clients pay a retainer this size by bank
                    transfer; his accountant already invoices. Card payments can come later. */}
                <h1 className={styles.h1}>Your retainer, {gbp(ret.upfront)}</h1>
                <p className={styles.sub}>
                  We&apos;ll email the invoice to <strong>{bill.accounts}</strong>. Pay it by bank transfer before your search week
                  starts on {shortDate(start)}, and we get moving. It&apos;s credited against your first hires, so after that you only
                  pay the difference.
                </p>
                {sending.error && <p className={styles.warn}>{sending.error}</p>}
                <Nav onBack={back} onNext={() => submit({ then: "done" })} nextOk={!sending.busy} nextLabel={sending.busy ? "Booking…" : "Send me the invoice"} />
              </>
            )}

            {step === "done" && (
              <>
                <h1 className={styles.h1}>You&apos;re booked in for the week of {shortDate(start)}.</h1>
                <ul className={styles.timeline}>
                  <li className={styles.tlDone}>Search week booked</li>
                  <li className={styles.tlDone}>Terms signed · {p?.name}</li>
                  {isRetained && <li className={styles.tlDone}>Retainer invoice sent to {bill.accounts}</li>}
                  <li>Andre confirms your brief (within 1 working day)</li>
                  {isRetained && <li>Retainer paid before {shortDate(start)}</li>}
                  {(n > 1 ? roleNames : [roleNames[0]]).map((r, i) => (
                    <li key={i}>
                      {n > 1 ? `${r}: search ` : "Search week "}
                      {fiveDays(sched[i] ?? start)} · shortlist by {shortlistDate(sched[i] ?? start)}
                    </li>
                  ))}
                </ul>
                <p className={styles.sub}>
                  Your signed terms are on their way to {you.email}. We&apos;ll email you at each step, and it&apos;s all in your portal.
                  {sending.ref && <> Your booking reference is {sending.ref}.</>}
                </p>
                <Button href="/account" variant="primary" arrow>
                  Go to your portal
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Your booking: the held week, big, and the same five steps as the progress bar, ticking off. */}
        {step !== "done" && (
          <aside className={styles.summary} aria-label="Your booking">
            <span className={styles.sumLabel}>Your booking</span>
            <div className={styles.sumWeek}>
              <span>Reserved · finish your booking to keep it</span>
              <strong>{shortDate(start)}</strong>
              <em>Shortlist by {shortlistDate(start)}</em>
            </div>
            <ul className={styles.sumList}>
              <li className={passed("week") ? styles.sumDone : ""}>
                <span>{n > 1 ? "Weeks" : "Week"}</span>
                {n > 1 ? (
                  <span className={styles.sumWeeks}>
                    {roleNames.map((r, i) => (
                      <span key={i}>
                        {r} · {shortDate(sched[i])}
                      </span>
                    ))}
                  </span>
                ) : (
                  fiveDays(start)
                )}
              </li>
              <li className={passed("brief") ? styles.sumDone : ""}>
                <span>Brief</span>
                {briefs.length > 1 ? `${briefs.length} roles` : briefed(briefs[0]) ? roleName(briefs[0], 0) : "·"}
              </li>
              <li className={passed("you") ? styles.sumDone : ""}>
                <span>You</span>
                {you.company || "·"}
              </li>
              <li className={passed("plan") ? styles.sumDone : ""}>
                <span>Plan</span>
                {p ? what + (isRetained ? " · retained" : "") : "·"}
              </li>
              <li className={passed("terms") ? styles.sumDone : ""}>
                <span>Terms</span>
                {passed("terms") ? "Signed" : step === "requested" ? "Change requested" : "·"}
              </li>
            </ul>
            {price && (
              <div className={styles.sumTotal}>
                <span>{price.each}</span>
                <strong>{price.total}</strong>
                <em>{price.note}</em>
              </div>
            )}
            <p className={styles.sumCall}>
              Questions? <CallLink className={styles.callBtn}>Book 15 minutes with Andre</CallLink>
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}

/** One plan in the picker; its price follows the On success / Retained switch. */
function PlanOption({ x, pay, on, pick, roles }: { x: (typeof PLANS)[number]; pay: PayWhen; on: boolean; pick: () => void; roles?: number }) {
  const base = pay === "retained" && x.retained ? x.retained : x;
  const k = pay === "retained" ? 0.85 : 1;
  const steps = x.id === "batch" && roles ? batchSteps(roles) : null;
  const face = steps ? { price: `${gbp(steps[0] * k)} to ${gbp(steps[steps.length - 1] * k)}`, per: `per hire · ${roles} roles` } : base;
  const line = pay === "retained" && !x.retained ? "Paid monthly, so there's no retainer" : x.blurb;
  return (
    <button type="button" className={`${styles.planOpt} ${on ? styles.planOn : ""}`} onClick={pick}>
      <span className={styles.planName}>{x.name}</span>
      <span className={styles.planPrice}>
        {face.price} <small>{face.per}</small>
      </span>
      <span className={styles.planLine}>{line}</span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function Nav({
  onBack,
  onNext,
  onSave,
  saved,
  nextOk,
  nextLabel = "Continue",
}: {
  onBack?: () => void;
  onNext: () => void;
  onSave?: () => void;
  saved?: boolean;
  nextOk: boolean;
  nextLabel?: string;
}) {
  return (
    <div className={styles.nav}>
      {onBack ? (
        <button type="button" className={styles.link} onClick={onBack}>
          ← Back
        </button>
      ) : (
        <span />
      )}
      <div className={styles.navRight}>
        {onSave &&
          (saved ? (
            <span className={styles.savedNote}>Saved · we&apos;ve emailed you a link to finish later</span>
          ) : (
            <button type="button" className={styles.link} onClick={onSave}>
              Save and finish later
            </button>
          ))}
        <Button variant="primary" arrow disabled={!nextOk} onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
