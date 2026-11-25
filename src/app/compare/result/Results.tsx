"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { priceList } from "@/lib/plans";
import { RATES } from "@/lib/currency";
import { BOOKING_URL } from "@/lib/site";
import { compare, PROCESS, money, day, addWeeks, roleLabel, levelOf, LEVELS, NOTICE_WEEKS, type CompareInput, type Kind, type Lane } from "@/lib/compare";
import { activePromo } from "@/lib/promos";
import { setMailRef } from "@/lib/analytics";
import { GiftBox } from "./GiftBox";
import styles from "../compare.module.css";

/* The comparison page the email links to. Shown in a fixed order (us, then
   the job ad most people use, then the agencies); the best fit for what they
   said matters most is flagged, and it isn't always us. */
export function Results({ input, special = false, slots = 0 }: { input: CompareInput | null; special?: boolean; slots?: number }) {
  const [kind, setKind] = useState<Kind>("recommended");
  // With cookies accepted, PostHog files this visit (and its recording) under the request.
  useEffect(() => {
    if (input?.lid) setMailRef(`cmp-${input.lid}`);
  }, [input?.lid]);
  const data = useMemo(() => (input ? compare(input) : null), [input]);

  if (!input || !data) {
    return (
      <section className={styles.wrap}>
        <div className="container">
          <h1 className={styles.h1}>This link has expired</h1>
          <p className={styles.lede}>
            <Link href="/compare">Design a new hiring route →</Link>
          </p>
        </div>
      </section>
    );
  }
  const { rows, best, routes } = data;
  const cur = input.cur ?? "GBP";
  // Our fee as the pricing page shows it (rounded list price in their currency); others converted.
  const L = priceList(cur);
  const feeIn = (x: { fee: number; r: { us?: boolean } }) => (x.r.us ? L.convert(x.fee, 1000) : cur === "GBP" ? Math.round(x.fee) : Math.round((x.fee * RATES[cur]) / 10) * 10);
  const role = roleLabel(input.role);
  const promo = activePromo();
  const plan = (routes.find((k) => k.id === kind) ?? routes[0]).plan;
  const late = plan.deadline != null ? Math.max(1, Math.ceil((plan.hire - plan.deadline) / 864e5) - 1) : 0;
  const spare = plan.deadline != null ? Math.max(0, Math.floor((plan.deadline - plan.hire) / 864e5)) : 0;
  const adFee = rows.find((x) => x.r.id === "ads");
  const mfRow = rows.find((x) => x.r.us);
  /** What a route costs, as a range: nothing if an earlier step works, everything if every step is needed. */
  const cost = (p: typeof plan) => {
    const ad = p.usesAd && adFee ? feeIn(adFee) : 0;
    const lo = p.adUpfront ? ad : 0;
    const hi = ad + (p.usesMf && mfRow ? feeIn(mfRow) : 0);
    return lo === hi ? L.fmt(hi) : `${L.fmt(lo)} to ${L.fmt(hi)}`;
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.resultHead}>
          <h1 className={styles.display}>
            Your hiring route for a <span className={`gr ${styles.accent}`}>{role}</span>
          </h1>
          <p className={styles.summaryCenter}>
            {money(input.salary, cur)}
            {input.start ? ` · hire needed by ${day(new Date(input.start))}` : ""} ·{" "}
            {LEVELS.find((l) => l.id === levelOf(input))?.label}
          </p>
        </div>

        {/* The route (Andre 2026-11-25): the answer in one glance, then the detail on demand. */}
        {/* The routes to flick between (Andre 2026-11-25): each one redraws the plan beside it. */}
        <div className={styles.designer}>
          <div className={styles.pills} role="tablist" aria-label="Hiring routes">
            {routes.map((k) => (
              <button key={k.id} type="button" role="tab" aria-selected={k.id === kind} className={`${styles.pill} ${k.id === kind ? `${styles.pillOn} heat-glow` : ""}`} onClick={() => setKind(k.id)}>
                {k.label}
              </button>
            ))}
          </div>
        <div className={styles.plan}>
          <div className={styles.routeTop}>
            <div className={styles.chips}>
              {plan.steps.filter((st) => st.chip).map((st, i) => (
                <span key={st.id} className={styles.chipWrap}>
                  {i > 0 && <i>{st.link === "parallel" ? "+" : "→ if no luck →"}</i>}
                  <span className={`${styles.chip} ${styles["chip_" + st.id]}`}>{st.chip}</span>
                </span>
              ))}
            </div>
            <p className={`${styles.dateCheck} ${plan.onTime ? styles.dateOk : styles.dateLate}`}>
              Hire by <strong>{day(new Date(plan.hire))}</strong>
              {plan.deadline != null &&
                (plan.onTime
                  ? " ✓ on time"
                  : ` · ${late} days late`)}
            </p>
          </div>
          <Timeline lanes={plan.lanes} deadline={plan.deadline} hire={plan.hire} />
          <div className={styles.stages}>
            {plan.steps.map((st, i) => (
              <div key={kind + st.id}>
              {i > 0 && st.link && <p className={styles.stageLink}>{st.link === "parallel" ? "At the same time" : st.link === "fallback" ? "If no luck" : "Then"}</p>}
              <details className={styles.stage}>
                <summary>
                  <span className={styles.stageNum}>{i + 1}</span>
                  <strong>{st.title}</strong>
                  <span className={styles.stageWhen}>{st.when}</span>
                  <span className={styles.stageChev} aria-hidden="true">▾</span>
                </summary>
                <p className={styles.stageLine}>{st.line}.</p>
                <ul>
                  {st.tips.map((t) => (
                    <li key={t}>{/[.?!"]$/.test(t) ? t : `${t}.`}</li>
                  ))}
                </ul>
              </details>
              </div>
            ))}
          </div>
        </div>

        {/* Live check (Andre 2026-11-25): context for the route on screen, and what to do about any bottleneck. */}
        <aside className={styles.diag}>
          <p className={styles.diagHead}>Live check</p>
          <div className={styles.diagItem}>
            <span>Status</span>
            <strong className={plan.onTime ? styles.dateOk : styles.dateLate}>
              {plan.deadline == null ? `Hire by ${day(new Date(plan.hire))}` : plan.onTime ? `On time, ${spare} days spare` : `${late} days late`}
            </strong>
          </div>
          {plan.deadline != null && !plan.onTime && (
            <div className={`${styles.diagItem} ${styles.diagAlert}`}>
              <span>Current bottleneck</span>
              {plan.squeeze != null ? (
                <>
                  <strong>Your interview process</strong>
                  <p>
                    At {PROCESS.find((p) => p.w === plan.process)?.label.toLowerCase() ?? `${plan.process} weeks`}, the hire lands after your date. Run it in about{" "}
                    {plan.squeeze === 1 ? "a week" : `${plan.squeeze} weeks`} to hire on time.
                  </p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener">Book a free interview process health check →</a>
                </>
              ) : (
                <>
                  <strong>Time</strong>
                  <p>{kind === "quickest" ? "Even the quickest route lands after your date. Start today, and tighten your interview process." : "This route needs more time than you have. Try Quickest."}</p>
                </>
              )}
            </div>
          )}
          <div className={styles.diagItem}>
            <span>You trade</span>
            <p>{plan.trade}.</p>
          </div>
          <div className={styles.diagItem}>
            <span>Cost</span>
            <strong>{cost(plan)}</strong>
            {plan.mfFree && <p>A search with us is £0 until you hire someone we found.</p>}
          </div>
        </aside>
        </div>

        <div className={styles.narrow}>

        {/* Every route side by side, like a pricing table (Andre 2026-11-25): one column per route, our pick lit. */}
        <details className={styles.fullCompare}>
          <summary>See the full comparison ▾</summary>
          <div className={styles.cmpScroll}>
            <table className={styles.cmp}>
              <thead>
                <tr>
                  <th />
                  {rows.map((x) => (
                    <th key={x.r.id} className={x.r.id === best.r.id ? `${styles.cmpPick} heat-glow` : ""}>
                      <span className={styles.cmpName}>{x.r.name}</span>
                      <span className={styles.cmpFee}>{L.fmt(feeIn(x))}</span>
                      <span className={styles.cmpFeeNote}>{x.r.feeNote}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Hire made by</th>
                  {rows.map((x) => (
                    <td key={x.r.id} className={`${x.r.id === best.r.id ? styles.cmpPickCell : ""} ${x.tooSlow ? styles.late : styles.ok}`}>{day(addWeeks(x.hireBy))}</td>
                  ))}
                </tr>
                <tr>
                  <th>Your team&apos;s hours</th>
                  {rows.map((x) => (
                    <td key={x.r.id} className={x.r.id === best.r.id ? styles.cmpPickCell : ""}>{x.hours}h</td>
                  ))}
                </tr>
                <tr>
                  <th>Interviews per hire</th>
                  {rows.map((x) => (
                    <td key={x.r.id} className={x.r.id === best.r.id ? styles.cmpPickCell : ""}>{x.r.interviews}</td>
                  ))}
                </tr>
                <tr>
                  <th>Candidates per hire</th>
                  {rows.map((x) => (
                    <td key={x.r.id} className={x.r.id === best.r.id ? styles.cmpPickCell : ""}>1 in {x.r.perHire}</td>
                  ))}
                </tr>
                <tr>
                  <th>Finds people not looking</th>
                  {rows.map((x) => (
                    <td key={x.r.id} className={`${x.r.id === best.r.id ? styles.cmpPickCell : ""} ${x.r.reach.passive ? styles.ok : styles.late}`}>{x.r.reach.passive ? "✓" : "✕"}</td>
                  ))}
                </tr>
                <tr className={styles.cmpWhat}>
                  <th>What you do</th>
                  {rows.map((x) => (
                    <td key={x.r.id} className={x.r.id === best.r.id ? styles.cmpPickCell : ""}>{x.r.youDo}.</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className={styles.hint}>
            Each route on its own, starting today. Green makes your date, red doesn&apos;t. Candidates per hire: how many candidates you see,
            on average, for each one hired.
          </p>
        </details>

        {plan.steps.some((st) => st.id === "mf") && (
          <div className={styles.bigCta}>
            <Link href="/start" className="heat-glow"><span>Start a search week →</span></Link>
            <span>£0 until you hire someone we found</span>
          </div>
        )}

        {/* Two things to take away, side by side (Andre 2026-11-25): the gift and the guide. */}
        <div className={styles.takeaways}>
        {promo && <GiftBox lid={input.lid} special={special} slots={slots} cur={cur} fee={rows.find((x) => x.r.us)?.fee} role={role} />}
        <Link href="/resources" className={styles.guideCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/resources/covers/four-ways.png" alt="" width={794} height={1123} />
          <span>
            <small>The thinking behind this</small>
            <strong>The 4 ways to find talent</strong>
            <em>Get the free guide →</em>
          </span>
        </Link>
        </div>

        <details className={styles.how}>
          <summary>How we worked these out</summary>
          <p>
            The fee is what you pay; your team&apos;s hours are shown separately, as time rather than money. &ldquo;Hire made by&rdquo; is when an
            offer is usually accepted; people then typically work up to {NOTICE_WEEKS} weeks&apos; notice before starting.
          </p>
          <p>
            Our figures come from our own searches over the past two and a half years: what clients have actually seen, not a
            target. The agency and job ad figures are typical across the market, from published hiring reports and what agencies
            quote themselves. Some agencies beat them and some fall short, so before you sign with one, ask for their numbers on
            roles like yours.
          </p>
          <p>
            Candidates per hire for agencies, job ads, sourcing and referrals come from Lever&apos;s study of 4 million candidates
            across about 1,000 employers (2016), the largest published breakdown by source. Ours is our own record across seven
            clients: 232 candidates sent, 26 hired. Screening assumes about 5 minutes a CV, cover letter included. The hours and weeks for
            sourcing it yourself and for referrals are our estimates.
          </p>
          <p>
            The order is honest first. If a referral can fill it, it should. A job ad comes before us for junior and mid-level
            roles that have been easy to fill, and for hires that are nice to have. We come first for senior roles, roles that
            have been hard to fill, mission-critical hires with no recruiter in-house, or when your date doesn&apos;t leave time
            for an ad.
          </p>
        </details>
        </div>
      </div>
    </section>
  );
}

/* The plan as a timeline: one row per route, week ticks, their date and Christmas marked. */
function Timeline({ lanes, deadline, hire }: { lanes: Lane[]; deadline: number | null; hire: number }) {
  const from = Math.min(...lanes.map((l) => l.from));
  const to = Math.max(hire, deadline ?? 0, ...lanes.map((l) => l.to)) + 3 * 864e5;
  const pct = (t: number) => `${(((t - from) / (to - from)) * 100).toFixed(2)}%`;
  const ticks: number[] = [];
  for (let t = from; t <= to; t += 7 * 864e5) ticks.push(t);
  const y = new Date(from).getFullYear();
  const xmas = [y, y + 1].map((yr) => [Date.UTC(yr, 11, 24), Date.UTC(yr + 1, 0, 2)]).find(([a, b]) => a < to && b > from);
  return (
    <div className={styles.tl}>
      <div className={styles.tlLabels}>
        {lanes.map((l) => (
          <span key={l.id}>{l.label}</span>
        ))}
      </div>
      <div className={styles.tlTrack}>
        {xmas && <span className={styles.tlXmas} style={{ left: pct(Math.max(xmas[0], from)), width: `calc(${pct(Math.min(xmas[1], to))} - ${pct(Math.max(xmas[0], from))})` }} title="Christmas break" />}
        {deadline != null && <span className={styles.tlDeadline} style={{ left: pct(deadline) }}><em>Your date</em></span>}
        {lanes.map((l) => (
          <div key={l.id} className={styles.tlRow}>
            <span className={`${styles.tlBar} ${styles["tl_" + l.id]}`} style={{ left: pct(l.from), width: `calc(${pct(l.to)} - ${pct(l.from)})` }}>
              {l.free && <i>£0</i>}
            </span>
          </div>
        ))}
        <div className={styles.tlTicks}>
          {ticks.map((t) => (
            <span key={t} style={{ left: pct(t) }}>{day(new Date(t))}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

