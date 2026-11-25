"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { priceList } from "@/lib/plans";
import { RATES } from "@/lib/currency";
import { compare, money, wks, day, addWeeks, roleLabel, levelOf, LEVELS, NOTICE_WEEKS, type CompareInput, type Lane } from "@/lib/compare";
import { activePromo } from "@/lib/promos";
import { setMailRef } from "@/lib/analytics";
import { GiftBox } from "./GiftBox";
import styles from "../compare.module.css";

/* The comparison page the email links to. Shown in a fixed order (us, then
   the job ad most people use, then the agencies); the best fit for what they
   said matters most is flagged, and it isn't always us. */
export function Results({ input, special = false, slots = 0 }: { input: CompareInput | null; special?: boolean; slots?: number }) {
  const [open, setOpen] = useState<string | null>(null);
  // With cookies accepted, PostHog files this visit (and its recording) under the request.
  useEffect(() => {
    if (input?.lid) setMailRef(`cmp-${input.lid}`);
  }, [input?.lid]);
  const data = useMemo(() => (input ? compare(input) : null), [input]);

  if (!input || !data) {
    return (
      <section className={styles.wrap}>
        <div className="container">
          <h1 className={styles.h1}>This comparison link has expired</h1>
          <p className={styles.lede}>
            <Link href="/compare">Run a new comparison →</Link>
          </p>
        </div>
      </section>
    );
  }
  const { rows, best, lowest, plan, whyNot } = data;
  const cur = input.cur ?? "GBP";
  // Our fee as the pricing page shows it (rounded list price in their currency); others converted.
  const L = priceList(cur);
  const feeIn = (x: { fee: number; r: { us?: boolean } }) => (x.r.us ? L.convert(x.fee, 1000) : cur === "GBP" ? Math.round(x.fee) : Math.round((x.fee * RATES[cur]) / 10) * 10);
  const role = roleLabel(input.role);
  const promo = activePromo();

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.resultHead}>
          <h1 className={styles.display}>
            Your comparison for a <span className={`gr ${styles.accent}`}>{role}</span>
          </h1>
          <p className={styles.summaryCenter}>
            {money(input.salary, cur)}
            {input.start ? ` · hire needed by ${day(new Date(input.start))}` : ""} ·{" "}
            {LEVELS.find((l) => l.id === levelOf(input))?.label} level
          </p>
        </div>

        {/* The plan (Andre 2026-11-25): dated, tactical, honest. Every line is something they can go and do. */}
        <div className={styles.plan}>
          <p className={styles.planHead}>Your plan</p>
          <p className={styles.planOutcome}>
            Hire made by about <strong>{day(new Date(plan.hire))}</strong>
            {plan.deadline != null &&
              (plan.onTime
                ? `, ${Math.max(0, Math.round((plan.deadline - plan.hire) / 864e5))} days before your date.`
                : `, ${Math.round((plan.hire - plan.deadline) / 864e5)} days after your date. Nothing gets there sooner, so this is the closest.`)}
            {plan.deadline == null && "."}
          </p>
          <Timeline lanes={plan.lanes} deadline={plan.deadline} hire={plan.hire} />
          <ol>
            {plan.steps.map((st) => (
              <li key={st.id} className={st.id === best.r.id ? styles.planMain : ""}>
                <span className={styles.planWhen}>{st.when}</span>
                <strong>{st.title}</strong>
                <ul>
                  {st.tips.map((t) => (
                    <li key={t}>{/[.?!"]$/.test(t) ? t : `${t}.`}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {plan.mfFree && (
            <div className={styles.free}>
              <b>{L.fmt(0)}</b>
              <p>
                <strong>Running a search with us costs nothing until you hire.</strong> You only pay if the person you hire is someone we found. {plan.steps.some((st) => st.id === "ads") ? " If a referral or your ad gets there first, you pay nothing." : " If a referral gets there first, you pay nothing."}
              </p>
            </div>
          )}
          {!best.r.us && !plan.steps.some((st) => st.id === "mf") && <p className={styles.planNote}>That&apos;s not us, and that&apos;s fine: it&apos;s the better plan here.</p>}
        </div>

        {whyNot.length > 0 && (
          <div className={styles.whyNot}>
            <p className={styles.planHead}>Why not the others</p>
            <div className={styles.whyGrid}>
              {whyNot.map(({ x, reason }) => (
                <div key={x.r.id}>
                  <span className={styles.whyName}>{x.r.name}</span>
                  <span className={styles.whyFee}>{L.fmt(feeIn(x))}</span>
                  <p>{reason}.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The gift sits right under the verdict, open (Ashley's QA: it was easy to miss). */}
        {promo && <GiftBox lid={input.lid} special={special} slots={slots} cur={cur} fee={rows.find((x) => x.r.us)?.fee} role={role} />}

        <details className={styles.fullCompare}>
          <summary>See the full comparison</summary>
        <div className={styles.table}>
          <div className={`${styles.tr} ${styles.th}`}>
            <span>Route</span>
            <span>Fee</span>
            <span>Hire made by</span>
            <span>Your team&apos;s hours</span>
            <span>Interviews per hire</span>
            <span>Candidates per hire</span>
            <span>Finds people not looking</span>
          </div>
          {rows.map((x) => (
            <div key={x.r.id} className={`${styles.item} ${x.r.us ? styles.itemUs : ""}`}>
              <button type="button" className={styles.tr} onClick={() => setOpen(open === x.r.id ? null : x.r.id)} aria-expanded={open === x.r.id}>
                <span className={styles.name}>
                  {x.r.name}
                  {x.r.id === best.r.id && <em className={styles.bestTag}>Best fit</em>}
                  {x.tooSlow && !x.r.noRank && <em className={styles.warn}>Too late for your date</em>}
                  {x.r.noRank && <em className={styles.warn}>{x.r.noRank}</em>}
                </span>
                <span data-l="Fee" className={x.fee === lowest.fee ? styles.win : ""}>{L.fmt(feeIn(x))}</span>
                <span data-l="Hire made by" className={x.hireBy === lowest.hireBy ? styles.win : ""}>{day(addWeeks(x.hireBy))}</span>
                <span data-l="Your team's hours" className={x.hours === lowest.hours ? styles.win : ""}>{x.hours}h</span>
                <span data-l="Interviews per hire" className={x.r.interviews === lowest.interviews ? styles.win : ""}>{x.r.interviews}</span>
                <span data-l="Candidates per hire" className={x.r.perHire === lowest.perHire ? styles.win : ""}>1 in {x.r.perHire}</span>
                <span data-l="Finds people not looking" className={x.r.reach.passive ? styles.win : styles.lose}>{x.r.reach.passive ? "Yes" : "No"}</span>
              </button>
              {open === x.r.id && (
                <div className={styles.detail}>
                  <p>{x.r.how}.</p>
                  <ul>
                    <li>
                      <b>What you do:</b> {x.r.youDo}.
                    </li>
                    <li>
                      <b>Fee:</b> {L.fmt(feeIn(x))} ({x.r.feeNote}).
                    </li>
                    <li>
                      <b>Speed:</b> first shortlist in {x.r.shortlist}, an accepted offer in {wks(x.r.hireWeeks)}, then up to {NOTICE_WEEKS} weeks&apos; notice.
                      {x.r.speedNote && ` (${x.r.speedNote})`}
                    </li>
                    <li>
                      <b>What you get:</b> {x.r.get}.
                    </li>
                    {x.r.interviewsNote && (
                      <li>
                        <b>Interviews per hire:</b> {x.r.interviewsNote}.
                      </li>
                    )}
                    <li>
                      <b>Candidates per hire:</b> {x.r.perHireNote}.
                    </li>
                    <li>
                      <b>Who you reach:</b> {x.r.reach.detail}.
                    </li>
                    <li>
                      <b>Your team&apos;s hours:</b> {x.r.hours.map((h) => `${h.label} ${h.label === "Interviews" ? "~" : ""}${h.h}h`).join(", ")}.
                    </li>
                  </ul>
                  <p className={styles.tipsHead}>{x.r.us ? "What happens next" : "If you go this way"}</p>
                  <ul>{x.r.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              )}
            </div>
          ))}
          <p className={styles.hint}>
            Tap any route to see what you&apos;d do yourself. Green marks the best on each measure. Interviews per hire: how many first
            interviews it typically takes to make one hire. Candidates per hire: how many candidates you see, on average, for each one
            hired.
          </p>
        </div>
        </details>

        {plan.steps.some((s) => s.id === "mf") && (
          <div className={styles.ctas}>
            <Link href="/start" className={styles.go}>Start a search week →</Link>
          </div>
        )}
        <p className={styles.guideLink}>
          Want the thinking behind this? <Link href="/resources">Get the free guide: The 4 ways to find talent →</Link>
        </p>

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
            across about 1,000 employers (2016), the largest published breakdown by source. Ours is from our own record with one
            client since January 2025. Screening assumes about 5 minutes a CV, cover letter included. The hours and weeks for
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
              {l.free && <i>Free until you hire</i>}
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
