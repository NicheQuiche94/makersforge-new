"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./match.module.css";

type Person = {
  id: string;
  codename: string;
  discipline: string;
  role: string;
  background: string;
  industries: string[];
  available: boolean;
  availability: string;
  location: string;
};

const EXAMPLES = [
  "Senior UA Manager · mobile games · Remote (EU) · £65k to £75k",
  "Head of Growth · subscription app · London · £100k",
  "Senior Game Designer, Economy · F2P mobile · £60k",
];

// Which discipline a job ad is about, from its words.
const DISC: [string, RegExp][] = [
  ["ua", /\b(ua|user acquisition|growth|performance market|paid (social|media)|media buy)/i],
  ["aso", /\b(aso|app store optimi[sz]ation)/i],
  ["creative", /\b(artist|art director|creative|animator|motion|video|illustrat)/i],
  ["design", /\b(game designer|designer|level design|economy design|ux|ui)/i],
  ["engineering", /\b(engineer|developer|programmer|unity|unreal|c#|backend|frontend)/i],
  ["product", /\b(product manager|product owner|monetis|monetiz|liveops|head of product)/i],
];
const SENIOR = /\b(head|director|vp|chief|lead|principal|senior|sr)\b/i;

function readSalaryGBP(text: string): number | null {
  const m = text.match(/([£€$])\s?(\d{2,3})(?:[.,]\d+)?\s?k?(?:\s*(?:-|–|to)\s*[£€$]?\s?(\d{2,3})\s?k?)?/i);
  if (!m) return null;
  const lo = Number(m[2]);
  const hi = m[3] ? Number(m[3]) : lo;
  const k = ((lo + hi) / 2) * 1000;
  const rate = m[1] === "€" ? 0.85 : m[1] === "$" ? 0.79 : 1;
  return Math.round((k * rate) / 1000) * 1000;
}

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

export function MatchMock({ people }: { people: Person[] }) {
  const [text, setText] = useState("");
  const [ran, setRan] = useState("");
  const [salary, setSalary] = useState(65000);

  const result = useMemo(() => {
    if (!ran) return null;
    const disc = DISC.find(([, re]) => re.test(ran))?.[0] ?? null;
    const senior = SENIOR.test(ran);
    const apps = /\b(app|subscription|consumer|fintech|health|dating|social)\b/i.test(ran) && !/\bgames?\b/i.test(ran);
    const words = new Set(ran.toLowerCase().match(/[a-z]{3,}/g) || []);
    const matches = people
      .filter((p) => !disc || p.discipline === disc)
      .map((p) => {
        const overlap = (p.role.toLowerCase().match(/[a-z]{3,}/g) || []).filter((w) => words.has(w)).length;
        const sector = apps ? p.industries.includes("apps") : p.industries.includes("games");
        return { p, score: overlap * 2 + (senior === SENIOR.test(p.role) ? 2 : 0) + (sector ? 2 : 0) + (p.available ? 1 : 0) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.p);
    return { disc, matches };
  }, [ran, people]);

  const run = (t: string) => {
    setText(t);
    setRan(t);
    const s = readSalaryGBP(t);
    if (s) setSalary(s);
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.mock}>Mockup for Andre · not live · all wording and numbers are drafts</p>
        <span className="kicker">Hiring right now?</span>
        <h1 className={styles.h1}>
          Paste your job ad. <span className="gr">See who we&apos;d send you.</span>
        </h1>
        <p className={styles.lede}>
          Drop in your job ad or a one-line summary. We&apos;ll show you the vetted people from our directory who fit,
          and what this hire would cost and take the usual way compared with us.
        </p>

        <div className={styles.box}>
          <textarea
            className={styles.input}
            rows={4}
            placeholder="Paste your job ad, its link, or a line like “Senior UA Manager, mobile games, remote EU, £70k”"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className={styles.row}>
            <div className={styles.examples}>
              <span>Try:</span>
              {EXAMPLES.map((e) => (
                <button key={e} type="button" className={styles.chip} onClick={() => run(e)}>
                  {e.split(" · ")[0]}
                </button>
              ))}
            </div>
            <button type="button" className={styles.go} disabled={!text.trim()} onClick={() => run(text)}>
              See who we&apos;d send →
            </button>
          </div>
        </div>

        {result && (
          <>
            <h2 className={styles.h2}>Who we&apos;d send you</h2>
            {result.matches.length ? (
              <div className={styles.people}>
                {result.matches.map((p) => (
                  <Link key={p.id} href={`/line-up/${p.id}/spec`} className={styles.person}>
                    <span className={styles.code}>{p.codename}</span>
                    <span className={styles.role}>{p.role}</span>
                    <span className={styles.bg}>{p.background}</span>
                    <span className={styles.meta}>
                      <span className={p.available ? styles.avail : styles.notice}>{p.availability}</span>
                      <span>{p.location}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.none}>
                No exact match in the public directory yet. We&apos;d search our wider network of 250 specialists for you.
              </p>
            )}
            <p className={styles.small}>
              These are people who&apos;ve opted in to a public profile. A search week goes through our full network,
              not just these.
            </p>

            <h2 className={styles.h2}>Your hiring, three ways</h2>
            <label className={styles.salary}>
              Salary for this role
              <input type="number" step={1000} min={20000} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)} />
            </label>
            <div className={styles.compare}>
              <div className={styles.col}>
                <h3>Post a job ad</h3>
                <p className={styles.big}>200–500 CVs</p>
                <ul>
                  <li>About 10–25 hours of your team screening them</li>
                  <li>First real shortlist in 3–6 weeks</li>
                  <li>Job board costs, plus the hours</li>
                </ul>
              </div>
              <div className={styles.col}>
                <h3>Use an agency</h3>
                <p className={styles.big}>
                  {gbp(salary * 0.2)}–{gbp(salary * 0.25)}
                </p>
                <ul>
                  <li>20–25% of first-year salary</li>
                  <li>CVs in batches, quality varies</li>
                  <li>Fee grows with the salary</li>
                </ul>
              </div>
              <div className={`${styles.col} ${styles.us}`}>
                <h3>MakersForge</h3>
                <p className={styles.big}>{gbp(12000)} flat</p>
                <ul>
                  <li>5 vetted people in about 5 working days</li>
                  <li>Paid only if you hire</li>
                  <li>
                    {salary * 0.2 > 12000 ? `${gbp(salary * 0.2 - 12000)} or more less than a typical agency` : "Same fee whatever the salary"}
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.ctas}>
              <Link href="/start" className={styles.go}>
                Get 3 of these people free →
              </Link>
              <button type="button" className={styles.ghost}>
                Email me this comparison
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
