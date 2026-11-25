import Link from "next/link";
import { MF_PER_HIRE } from "@/lib/compare";
import { DOWNLOADS } from "@/lib/resources";
import styles from "./HomeRefresh.module.css";

/* Homepage refresh (Andre 2026-11-25, MOCK): first paint on the new
   positioning (D2C recruitment, no radius, honest trade-offs). DRAFT copy:
   Andre rewrites it in his own voice. */

const ODDS: { name: string; n: number; us?: boolean }[] = [
  { name: "Job ad", n: 152 },
  { name: "Sourced in-house", n: 72 },
  { name: "Agency", n: 22 },
  { name: "Referral", n: 16 },
  { name: "MakersForge", n: MF_PER_HIRE, us: true },
];

/** The odds: candidates you see for each hire, by method. Backs up the claim above it. */
export function OddsStrip() {
  return (
    <section className={styles.section}>
      <div className="container">
        <header className={`reveal ${styles.head}`}>
          <h2 className={styles.h2}>
            How many candidates <span className="gr">for one hire?</span>
          </h2>
          <p className={styles.lede}>Risk is how many people you see to make one hire.</p>
        </header>
        <div className={`reveal ${styles.odds}`}>
          {ODDS.map((o) => (
            <div key={o.name} className={`${styles.row} ${o.us ? `${styles.us} heat-glow` : ""}`}>
              <b>{o.name}</b>
              <span className={styles.dots}>
                {Array.from({ length: o.n }, (_, i) => (
                  <i key={i} className={i === 0 ? styles.on : ""} />
                ))}
              </span>
              <strong>{o.n}</strong>
            </div>
          ))}
        </div>
        <p className={styles.source}>
          MakersForge: 232 candidates sent across our seven most recent clients, 26 hired. Everyone else: Lever, Little Grey Book of Recruiting
          Benchmarks.
        </p>
      </div>
    </section>
  );
}

/* Cost and risk per method, 1 to 5, from the guide's scores. */
const WAYS = [
  { name: "Referrals", line: "Ask first", cost: 1, risk: 1, tone: "linear-gradient(135deg, #22c55e, #15803d)" },
  { name: "Job ads", line: "Only reaches whoever's nearby", cost: 2, risk: 5, tone: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
  { name: "Talent communities", line: "Slow to build, then compounds", cost: 3, risk: 2, tone: "linear-gradient(135deg, #8b5cf6, #5b21b6)" },
  { name: "D2C", line: "The exact person you want", cost: 5, risk: 1, tone: "var(--heat-deep)", us: true },
];

/** The honest bit, as one picture: four ways to hire, each trading cost against risk. */
export function NotAlways() {
  const x = (v: number) => `${14 + ((v - 1) / 4) * 72}%`;
  const y = (v: number) => `${20 + ((v - 1) / 4) * 64}%`;
  return (
    <section className={`${styles.section} ${styles.deep}`}>
      <div className="container">
        <header className={`reveal ${styles.head}`}>
          <h2 className={styles.h2}>
            We&apos;re not always <span className="gr">the answer.</span>
          </h2>
          <p className={styles.lede}>Four ways to find talent. Each one trades cost against risk.</p>
        </header>
        <div className={`reveal ${styles.matrix}`}>
          <span className={styles.axY}>Higher risk ↑</span>
          <span className={styles.axX}>Higher cost →</span>
          {WAYS.map((w) => (
            <div key={w.name} className={`${styles.pt} ${w.us ? styles.ptUs : ""}`} style={{ left: x(w.cost), bottom: y(w.risk) }}>
              <span className={`${styles.pill} ${w.us ? "heat-glow" : ""}`} style={w.us ? undefined : { background: w.tone }}>
                <span>{w.name}</span>
              </span>
              <em>{w.line}</em>
            </div>
          ))}
        </div>
        <p className={styles.after}>Low cost or low risk. Pick one, and start with referrals.</p>
        <div className={styles.links}>
          <Link href="/compare" className={styles.primary}>
            <span>Design your hiring route →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The guide, front and centre: the proof that we know our stuff. */
export function GuideFeature() {
  const g = DOWNLOADS[0];
  return (
    <section className={`${styles.section} ${styles.deep}`}>
      <div className="container">
        <div className={`reveal ${styles.guide}`}>
          <Link href="/resources" className={styles.cover} aria-label={`Get ${g.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.cover} alt="" width={794} height={1123} />
          </Link>
          <div className={styles.guideBody}>
            <p className={styles.guideKicker}>Free guide</p>
            <h2 className={styles.h2}>{g.title}</h2>
            <ul className={styles.inside}>
              {g.inside.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link href="/resources" className={styles.primary}>
              <span>Get the free guide →</span>
            </Link>
            <p className={styles.tools}>
              More free tools: <Link href="/compare">Design your hiring route</Link> · <Link href="/job-ad-grading-tool">Job ad grading tool</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The close: one message, one button. */
export function HomeClose() {
  return (
    <section className={`${styles.section} ${styles.close}`}>
      <div className={`container reveal ${styles.closeInner}`}>
        <h2 className={styles.h2}>
          Don&apos;t leave specific hiring <span className="gr">to chance.</span>
        </h2>
        <p className={styles.lede}>£0 until you hire someone we found.</p>
        <Link href="/start" className={`${styles.primary} heat-glow`}>
          <span>Get started →</span>
        </Link>
      </div>
    </section>
  );
}
