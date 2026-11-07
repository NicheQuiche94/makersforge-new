"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./compare.module.css";

/* ---- DRAFT assumptions and copy (Andre to set every number and line) ---- */
const HOOKS = [
  { h: "Hiring, but not sure which route is most cost-effective?", g: "We'll compare them for your role." },
  { h: "Which way of hiring is most efficient for your team?", g: "Compare every route for your role." },
  { h: "How much team time will this hire really cost you?", g: "See every route side by side." },
];

const ROLES = [
  { id: "ua", label: "UA Manager", salary: 55000 },
  { id: "senior-ua", label: "Senior UA Manager", salary: 70000 },
  { id: "head-growth", label: "Head of UA / Growth", salary: 100000 },
  { id: "game-designer", label: "Game Designer", salary: 50000 },
  { id: "game-artist", label: "Senior Game Artist", salary: 55000 },
  { id: "unity", label: "Senior Unity Engineer", salary: 70000 },
  { id: "product", label: "Product Manager", salary: 75000 },
];

const NOTICE_WEEKS = 4; // typical notice period between an accepted offer and a start date
const HOURLY = 60; // team time, £ an hour

type Route = {
  id: string;
  name: string;
  how: string;
  fee: (salary: number) => number;
  feeNote: string;
  shortlist: string;
  hireWeeks: [number, number];
  get: string;
  interviews: number;
  hours: { label: string; h: number }[];
  tips: string[];
  us?: boolean;
};

const ROUTES: Route[] = [
  {
    id: "mf",
    name: "MakersForge",
    how: "Mobile games and apps specialists, flat fee",
    fee: () => 12000,
    feeNote: "£12,000 flat, paid only if you hire",
    shortlist: "1 week",
    hireWeeks: [3, 5],
    get: "5 vetted people",
    interviews: 4,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Interviews", h: 6 },
      { label: "Coordination", h: 1 },
    ],
    tips: ["Book a search week online, no sales call.", "You get 5 people in about 5 working days, each already interviewed by us.", "If nobody fits, you pay nothing."],
    us: true,
  },
  {
    id: "games20",
    name: "Games-specialist agency",
    how: "A mobile games recruiter at 20%",
    fee: (s) => s * 0.2,
    feeNote: "20% of first-year salary",
    shortlist: "1–2 weeks",
    hireWeeks: [5, 8],
    get: "8–12 CVs",
    interviews: 6,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 2 },
      { label: "Interviews", h: 9 },
      { label: "Coordination", h: 3 },
    ],
    tips: ["Ask how many hires they've made for this exact role in the last year.", "Ask for a replacement guarantee if the hire leaves early.", "Agree up front how many CVs you'll see."],
  },
  {
    id: "tech25",
    name: "General tech agency",
    how: "A broad tech recruiter at 25%",
    fee: (s) => s * 0.25,
    feeNote: "25% of first-year salary",
    shortlist: "2–3 weeks",
    hireWeeks: [6, 10],
    get: "10–20 CVs",
    interviews: 8,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 4 },
      { label: "Interviews", h: 12 },
      { label: "Coordination", h: 4 },
    ],
    tips: ["Check they understand mobile metrics (ROAS, LTV, retention) before you brief them.", "Expect to filter more CVs that aren't from games or apps."],
  },
  {
    id: "ads",
    name: "Job ad, hire yourself",
    how: "Job boards plus an applicant tracking system",
    fee: () => 400 + 350 * 3,
    feeNote: "About £400 on job boards + about £350 a month for tracking software",
    shortlist: "3–6 weeks",
    hireWeeks: [8, 12],
    get: "200–500 applications",
    interviews: 10,
    hours: [
      { label: "Writing and posting the ad", h: 3 },
      { label: "Screening applications", h: 18 },
      { label: "Interviews", h: 15 },
      { label: "Coordination", h: 6 },
    ],
    tips: ["Post on Games Jobs Direct, Hitmarker and LinkedIn Jobs.", "Add 2–3 screening questions to cut the pile down fast.", "Block out screening time every day, or the good applicants go elsewhere."],
  },
];

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const wks = ([a, b]: [number, number]) => (a === b ? `${a} weeks` : `${a}–${b} weeks`);
const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const addWeeks = (w: number) => new Date(Date.now() + w * 7 * 864e5);

export function CompareMock() {
  // Hook A/B variant: ?hook=1|2|3 in the mockup.
  const [hook, setHook] = useState(0);
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("hook"));
    if (n >= 1 && n <= HOOKS.length) setHook(n - 1);
  }, []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [roleId, setRoleId] = useState("senior-ua");
  const role = ROLES.find((r) => r.id === roleId)!;
  const [salary, setSalary] = useState(role.salary);
  const [startBy, setStartBy] = useState("");
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState<"balanced" | "cost" | "speed" | "hours">("balanced");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  const weeksToStart = startBy ? Math.max(0, (Date.parse(startBy) - Date.now()) / (7 * 864e5)) : null;

  const rows = useMemo(() => {
    const base = ROUTES.map((r) => {
      const fee = r.fee(salary);
      const hours = r.hours.reduce((n, x) => n + x.h, 0);
      const real = fee + hours * HOURLY;
      const startWeeks = r.hireWeeks[1] + NOTICE_WEEKS;
      const overBudget = budget ? fee > Number(budget) : false;
      const tooSlow = weeksToStart != null ? startWeeks > weeksToStart : false;
      return { r, fee, hours, real, startWeeks, overBudget, tooSlow };
    });
    const max = (f: (x: (typeof base)[number]) => number) => Math.max(...base.map(f));
    const [mR, mW, mH, mI] = [max((x) => x.real), max((x) => x.startWeeks), max((x) => x.hours), max((x) => x.r.interviews)];
    const score = (x: (typeof base)[number]) =>
      priority === "cost" ? x.real : priority === "speed" ? x.startWeeks : priority === "hours" ? x.hours
        : x.real / mR + x.startWeeks / mW + x.hours / mH + x.r.interviews / mI;
    // Options that fit the budget and start date first, then by what matters most.
    return base.slice().sort((a, b) => Number(a.overBudget || a.tooSlow) - Number(b.overBudget || b.tooSlow) || score(a) - score(b));
  }, [salary, budget, weeksToStart, priority]);

  const best = rows[0];
  const lowest = (f: (x: (typeof rows)[number]) => number) => Math.min(...rows.map(f));
  const [loCost, loStart, loHours, loInt] = [lowest((x) => x.real), lowest((x) => x.startWeeks), lowest((x) => x.hours), lowest((x) => x.r.interviews)];
  const code = useMemo(() => "MF10-" + Math.random().toString(36).slice(2, 6).toUpperCase(), []);
  const offer = best.r.us && !best.overBudget;

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.mock}>
          Mockup for Andre · not live · draft numbers and wording · headline test {hook + 1} of {HOOKS.length} (add ?hook=1, 2 or 3)
        </p>
        <h1 className={styles.h1}>{HOOKS[hook].h}</h1>
        <p className={styles.lede}>{HOOKS[hook].g} Cost, speed, accuracy and team hours, compared honestly, including when we&apos;re not the best option.</p>

        {step === 1 && (
          <div className={styles.panel}>
            <p className={styles.stepLabel}>Step 1 of 2 · Your role</p>
            <div className={styles.inputs}>
              <label>
                Role
                <select value={roleId} onChange={(e) => { setRoleId(e.target.value); setSalary(ROLES.find((r) => r.id === e.target.value)!.salary); }}>
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </label>
              <label>
                Salary (£)
                <input type="number" step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)} />
              </label>
              <label>
                They need to start by
                <input type="date" value={startBy} onChange={(e) => setStartBy(e.target.value)} />
              </label>
              <label>
                Budget for this hire (£) <span>optional</span>
                <input type="number" step={1000} placeholder="e.g. 10000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </label>
              <label>
                What matters most
                <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                  <option value="balanced">A balance of everything</option>
                  <option value="cost">Lowest cost</option>
                  <option value="speed">Starting soonest</option>
                  <option value="hours">Saving my team&apos;s time</option>
                </select>
              </label>
            </div>
            <button type="button" className={styles.go} onClick={() => setStep(2)}>
              Compare my options →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.panel}>
            <p className={styles.stepLabel}>Step 2 of 2 · Where should we send it?</p>
            <p className={styles.note}>
              We&apos;ll show your comparison here and email you a copy to share with your team.
            </p>
            <div className={styles.inputs}>
              <label>
                Work email
                <input type="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                Your name <span>optional</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Company <span>optional</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
            </div>
            <div className={styles.ctas}>
              <button type="button" className={styles.ghost} onClick={() => setStep(1)}>← Back</button>
              <button type="button" className={styles.go} disabled={!/^\S+@\S+\.\S+$/.test(email)} onClick={() => setStep(3)}>
                Show my comparison →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className={styles.summary}>
              <span>{role.label} · {gbp(salary)}{startBy ? ` · start by ${day(new Date(startBy))}` : ""}{budget ? ` · budget ${gbp(Number(budget))}` : ""}</span>
              <button type="button" className={styles.link} onClick={() => setStep(1)}>Change</button>
            </div>

            <div className={`${styles.best} ${best.r.us ? styles.bestUs : ""}`}>
              <span className={styles.bestLabel}>Best fit for you</span>
              <strong>{best.r.name}</strong>
              <span>
                {gbp(best.real)} all in, someone starting around {day(addWeeks(best.startWeeks))}.
                {!best.r.us && " That's not us, and that's fine: it's the better fit here."}
                {(best.overBudget || best.tooSlow) && " Nothing fits every constraint, so this is the closest."}
              </span>
            </div>

            {offer && (
              <div className={styles.offer}>
                <strong>10% off if you book within 24 hours</strong>
                <span>
                  Use code <b>{code}</b> when you book a search week: {gbp(12000 * 0.9)} instead of {gbp(12000)}. Valid until{" "}
                  {new Date(Date.now() + 864e5).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" })}.
                </span>
                <Link href="/start" className={styles.go}>Book a search week →</Link>
              </div>
            )}

            <div className={styles.table}>
              <div className={`${styles.tr} ${styles.th}`}>
                <span>Option</span>
                <span>Cost, all in</span>
                <span>Could start</span>
                <span>Team hours</span>
                <span>Interviews</span>
              </div>
              {rows.map((x, i) => (
                <div key={x.r.id} className={`${styles.item} ${x.r.us ? styles.itemUs : ""}`}>
                  <button type="button" className={styles.tr} onClick={() => setOpen(open === x.r.id ? null : x.r.id)} aria-expanded={open === x.r.id}>
                    <span className={styles.name}>
                      <i>{i + 1}</i>
                      {x.r.name}
                      {x.overBudget && <em className={styles.warn}>Over budget</em>}
                      {x.tooSlow && <em className={styles.warn}>Too late for your start date</em>}
                    </span>
                    <span data-l="Cost" className={x.real === loCost ? styles.win : ""}>{gbp(x.real)}</span>
                    <span data-l="Could start" className={x.startWeeks === loStart ? styles.win : ""}>{day(addWeeks(x.startWeeks))}</span>
                    <span data-l="Team hours" className={x.hours === loHours ? styles.win : ""}>{x.hours}h</span>
                    <span data-l="Interviews" className={x.r.interviews === loInt ? styles.win : ""}>{x.r.interviews}</span>
                  </button>
                  {open === x.r.id && (
                    <div className={styles.detail}>
                      <p>{x.r.how}.</p>
                      <ul>
                        <li><b>Fee:</b> {gbp(x.fee)} ({x.r.feeNote}), plus {gbp(x.hours * HOURLY)} of team time at {gbp(HOURLY)} an hour.</li>
                        <li><b>Speed:</b> first shortlist in {x.r.shortlist}, an accepted offer in {wks(x.r.hireWeeks)}, then about {NOTICE_WEEKS} weeks&apos; notice.</li>
                        <li><b>What you get:</b> {x.r.get}, about {x.r.interviews} interviews to make the hire.</li>
                        <li><b>Team hours:</b> {x.r.hours.map((h) => `${h.label} ${h.h}h`).join(", ")}.</li>
                      </ul>
                      <p className={styles.tipsHead}>{x.r.us ? "What happens next" : "If you go this way"}</p>
                      <ul>{x.r.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                  )}
                </div>
              ))}
              <p className={styles.hint}>Tap any option for the detail. Green marks the best on each measure.</p>
            </div>

            <div className={styles.ctas}>
              <Link href="/start" className={styles.go}>Start a search week →</Link>
              <button type="button" className={styles.ghost} onClick={() => setShowEmail(!showEmail)}>
                {showEmail ? "Hide" : "Preview"} the email they&apos;d get
              </button>
            </div>

            {showEmail && (
              <div className={styles.email}>
                <p className={styles.emailMeta}>To: {email} · Subject: Your hiring comparison: {role.label}</p>
                <p>Hi {name || "there"},</p>
                <p>
                  Here&apos;s your comparison for a {role.label} at {gbp(salary)}{company ? ` at ${company}` : ""}. Based on what
                  matters most to you, the best fit is <b>{best.r.name}</b>: {gbp(best.real)} all in, with someone starting around{" "}
                  {day(addWeeks(best.startWeeks))}.
                </p>
                <ol>{rows.map((x) => <li key={x.r.id}>{x.r.name}: {gbp(x.real)}, could start {day(addWeeks(x.startWeeks))}, {x.hours} team hours</li>)}</ol>
                {offer && <p>If you&apos;d like us to run it, book a search week in the next 24 hours with code <b>{code}</b> for 10% off.</p>}
                <p>Any questions, just reply. It comes straight to me.</p>
                <p>Andre<br />Founder, MakersForge</p>
              </div>
            )}

            <details className={styles.how}>
              <summary>How we worked these out</summary>
              <p>
                Cost is the fee plus your team&apos;s hours at {gbp(HOURLY)} an hour. &ldquo;Could start&rdquo; is the time to an
                accepted offer plus a typical {NOTICE_WEEKS}-week notice period. Interviews is how many it usually takes to make one
                hire. [Andre: replace with your real figures and sources.]
              </p>
            </details>
          </>
        )}
      </div>
    </section>
  );
}
