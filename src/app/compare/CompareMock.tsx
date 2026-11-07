"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./compare.module.css";

/* ---- DRAFT assumptions (Andre to set every number) ---- */
const ROLES = [
  { id: "ua", label: "UA Manager", salary: 55000 },
  { id: "senior-ua", label: "Senior UA Manager", salary: 70000 },
  { id: "head-growth", label: "Head of UA / Growth", salary: 100000 },
  { id: "game-designer", label: "Game Designer", salary: 50000 },
  { id: "game-artist", label: "Senior Game Artist", salary: 55000 },
  { id: "unity", label: "Senior Unity Engineer", salary: 70000 },
  { id: "product", label: "Product Manager", salary: 75000 },
];

type Route = {
  id: string;
  name: string;
  how: string;
  fee: (salary: number, months: number) => number;
  feeNote: string;
  shortlistWeeks: [number, number];
  hireWeeks: [number, number];
  candidates: string; // what lands on your desk
  interviews: number; // interviews to make one hire (accuracy)
  hours: { label: string; h: number }[];
  us?: boolean;
};

const ROUTES: Route[] = [
  {
    id: "mf",
    name: "MakersForge",
    how: "Mobile games and apps specialists, fixed fee",
    fee: () => 12000,
    feeNote: "£12,000 flat, only if you hire",
    shortlistWeeks: [1, 1],
    hireWeeks: [3, 5],
    candidates: "5 vetted people",
    interviews: 4,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Interviews", h: 6 },
      { label: "Coordination", h: 1 },
    ],
    us: true,
  },
  {
    id: "games20",
    name: "Games-specialist agency",
    how: "Mobile games recruiter at 20%",
    fee: (s) => s * 0.2,
    feeNote: "20% of first-year salary",
    shortlistWeeks: [1, 2],
    hireWeeks: [5, 8],
    candidates: "8–12 CVs",
    interviews: 6,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 2 },
      { label: "Interviews", h: 9 },
      { label: "Coordination", h: 3 },
    ],
  },
  {
    id: "tech25",
    name: "General tech agency",
    how: "Broad tech recruiter at 25%",
    fee: (s) => s * 0.25,
    feeNote: "25% of first-year salary",
    shortlistWeeks: [2, 3],
    hireWeeks: [6, 10],
    candidates: "10–20 CVs",
    interviews: 8,
    hours: [
      { label: "Brief", h: 1 },
      { label: "Reviewing CVs", h: 4 },
      { label: "Interviews", h: 12 },
      { label: "Coordination", h: 4 },
    ],
  },
  {
    id: "ads",
    name: "Job ad, hire yourself",
    how: "Job boards and an applicant tracking system",
    fee: (_s, months) => 400 + 350 * months,
    feeNote: "Job boards about £400 + applicant tracking about £350 a month",
    shortlistWeeks: [3, 6],
    hireWeeks: [8, 12],
    candidates: "200–500 applications",
    interviews: 10,
    hours: [
      { label: "Writing and posting the ad", h: 3 },
      { label: "Screening applications", h: 18 },
      { label: "Interviews", h: 15 },
      { label: "Coordination", h: 6 },
    ],
  },
];

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const weeks = ([a, b]: [number, number]) => (a === b ? `${a} week${a === 1 ? "" : "s"}` : `${a}–${b} weeks`);

export function CompareMock() {
  const [roleId, setRoleId] = useState("senior-ua");
  const role = ROLES.find((r) => r.id === roleId)!;
  const [salary, setSalary] = useState(role.salary);
  const [budget, setBudget] = useState<string>("");
  const [needIn, setNeedIn] = useState<string>("");
  const [hourly, setHourly] = useState(60);
  const [priority, setPriority] = useState<"balanced" | "cost" | "speed" | "hours">("balanced");

  const rows = useMemo(() => {
    return ROUTES.map((r) => {
      const months = Math.ceil(r.hireWeeks[1] / 4);
      const fee = r.fee(salary, months);
      const hours = r.hours.reduce((n, x) => n + x.h, 0);
      const real = fee + hours * hourly;
      const overBudget = budget ? fee > Number(budget) : false;
      const tooSlow = needIn ? r.hireWeeks[1] > Number(needIn) : false;
      return { r, fee, hours, real, overBudget, tooSlow };
    });
  }, [salary, budget, needIn, hourly]);

  const min = (f: (x: (typeof rows)[number]) => number) => Math.min(...rows.map(f));
  const cheapestFee = min((x) => x.fee);
  const cheapestReal = min((x) => x.real);
  const fastest = min((x) => x.r.hireWeeks[1]);
  const fewestHours = min((x) => x.hours);
  const mostAccurate = min((x) => x.r.interviews);
  const ok = rows.filter((x) => !x.overBudget && !x.tooSlow);
  const maxReal = Math.max(...rows.map((x) => x.real));
  const maxWeeks = Math.max(...rows.map((x) => x.r.hireWeeks[1]));
  const maxHours = Math.max(...rows.map((x) => x.hours));
  const maxInterviews = Math.max(...rows.map((x) => x.r.interviews));
  // Lower is better on every measure; "balanced" weighs cost, speed, team hours and interviews equally.
  const score = (x: (typeof rows)[number]) =>
    priority === "cost" ? x.real : priority === "speed" ? x.r.hireWeeks[1] : priority === "hours" ? x.hours
      : x.real / maxReal + x.r.hireWeeks[1] / maxWeeks + x.hours / maxHours + x.r.interviews / maxInterviews;
  const best = (ok.length ? ok : rows).slice().sort((a, b) => score(a) - score(b))[0];

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.mock}>Mockup for Andre · not live · every number is a draft assumption</p>
        <span className="kicker">Hiring for a role?</span>
        <h1 className={styles.h1}>
          Every way to hire it, <span className="gr">compared honestly.</span>
        </h1>
        <p className={styles.lede}>
          Pick the role. See what each route really costs, how long it takes, how many interviews it needs and how many of
          your team&apos;s hours it eats. Sometimes we&apos;re not the best option, and we&apos;ll say so.
        </p>

        <div className={styles.inputs}>
          <label>
            Role
            <select
              value={roleId}
              onChange={(e) => {
                setRoleId(e.target.value);
                setSalary(ROLES.find((r) => r.id === e.target.value)!.salary);
              }}
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Salary (£)
            <input type="number" step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)} />
          </label>
          <label>
            Budget for this hire (£) <span>optional</span>
            <input type="number" step={1000} placeholder="e.g. 10000" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </label>
          <label>
            Need them within <span>optional</span>
            <select value={needIn} onChange={(e) => setNeedIn(e.target.value)}>
              <option value="">No deadline</option>
              <option value="4">4 weeks</option>
              <option value="6">6 weeks</option>
              <option value="8">8 weeks</option>
              <option value="12">12 weeks</option>
            </select>
          </label>
          <label>
            What matters most
            <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
              <option value="balanced">A balance of everything</option>
              <option value="cost">Lowest cost</option>
              <option value="speed">Hiring fast</option>
              <option value="hours">Saving my team&apos;s time</option>
            </select>
          </label>
          <label>
            Your team&apos;s time (£ an hour)
            <input type="number" step={5} value={hourly} onChange={(e) => setHourly(Number(e.target.value) || 0)} />
          </label>
        </div>

        <div className={`${styles.best} ${best.r.us ? styles.bestUs : ""}`}>
          <span className={styles.bestLabel}>Best option for you</span>
          <strong>{best.r.name}</strong>
          <span>
            {gbp(best.real)} all in (fee plus your team&apos;s time), hired in about {weeks(best.r.hireWeeks)}.
            {!best.r.us && " That's not us, and that's fine: it's the better fit for what matters to you here."}
            {!ok.length && " Nothing fits every constraint, so this is the closest."}
          </span>
        </div>

        <div className={styles.grid}>
          {rows.map(({ r, fee, hours, real, overBudget, tooSlow }) => (
            <div key={r.id} className={`${styles.card} ${r.us ? styles.us : ""} ${best.r.id === r.id ? styles.picked : ""}`}>
              <div className={styles.head}>
                <h3>{r.name}</h3>
                <p>{r.how}</p>
                <div className={styles.badges}>
                  {fee === cheapestFee && <span>Lowest fee</span>}
                  {real === cheapestReal && <span>Lowest real cost</span>}
                  {r.hireWeeks[1] === fastest && <span>Fastest</span>}
                  {hours === fewestHours && <span>Fewest team hours</span>}
                  {r.interviews === mostAccurate && <span>Fewest interviews</span>}
                  {overBudget && <span className={styles.warn}>Over budget</span>}
                  {tooSlow && <span className={styles.warn}>Too slow for your deadline</span>}
                </div>
              </div>

              <div className={styles.metric}>
                <span className={styles.k}>Cost</span>
                <span className={styles.v}>{gbp(real)}</span>
                <span className={styles.bar}><i style={{ width: `${(real / maxReal) * 100}%` }} /></span>
                <span className={styles.sub}>
                  {gbp(fee)} fee ({r.feeNote}) + {gbp(hours * hourly)} of team time
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.k}>Speed</span>
                <span className={styles.v}>{weeks(r.hireWeeks)} to hire</span>
                <span className={styles.bar}><i style={{ width: `${(r.hireWeeks[1] / maxWeeks) * 100}%` }} /></span>
                <span className={styles.sub}>First shortlist in {weeks(r.shortlistWeeks)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.k}>Accuracy</span>
                <span className={styles.v}>About {r.interviews} interviews per hire</span>
                <span className={styles.sub}>You receive {r.candidates}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.k}>Team hours</span>
                <span className={styles.v}>{hours} hours</span>
                <span className={styles.bar}><i style={{ width: `${(hours / maxHours) * 100}%` }} /></span>
                <span className={styles.sub}>{r.hours.map((x) => `${x.label} ${x.h}h`).join(" · ")}</span>
              </div>
            </div>
          ))}
        </div>

        <details className={styles.how}>
          <summary>How we worked these out</summary>
          <p>
            Fees are the typical rate for each route. Team time is the hours your people spend briefing, reviewing, interviewing
            and coordinating, priced at the hourly rate above. Speed is from the brief to an accepted offer. Accuracy is how many
            interviews it usually takes to make one hire. [Andre: replace with your real figures and sources.]
          </p>
        </details>

        <div className={styles.ctas}>
          <Link href="/start" className={styles.go}>
            Start a search week →
          </Link>
          <button type="button" className={styles.ghost}>
            Email me this comparison
          </button>
        </div>
      </div>
    </section>
  );
}
