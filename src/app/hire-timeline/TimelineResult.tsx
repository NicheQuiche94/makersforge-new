"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { TIER_NAME } from "@/lib/plans";
import { inCountry, METHODS, OFFER_DECLINE, SOURCES, fmtDay, fmtShort, timeline, weeksBetween, weeksText, type Bar, type TimelineInput } from "@/lib/hireTimeline";
import base from "@/components/onboard/PlanCards.module.css";
import styles from "../compare/compare.module.css";
import own from "./timeline.module.css";

const verdictText = (late: number | null, need: Date | null) =>
  need && late !== null
    ? late > 0
      ? `${weeksText(late)} after the ${fmtDay(need)} you need them`
      : late === 0
        ? `right on your ${fmtDay(need)} deadline`
        : `${weeksText(-late)} before your ${fmtDay(need)} deadline`
    : "";

/* The result (Andre 2026-11-09): their route against their date, a notice
   toggle that redraws everything, then "Need them sooner?" to reveal the
   same hire with a search week. Honest about what we can't change. */
export function TimelineResult({ input, slots, mock }: { input: TimelineInput; slots: { left: number; month: string }; mock?: boolean }) {
  const [noNotice, setNoNotice] = useState(false);
  const [shown, setShown] = useState(false);
  const t = timeline(input, noNotice);
  const typical = timeline(input, false);
  const quick = timeline(input, true);
  const method = METHODS.find((m) => m.id === input.method)!;
  const tier = TIER_NAME[input.tier];

  // Chart scale is fixed across both toggle states, so the bars visibly shrink.
  const end = new Date(Math.max(typical.theirs.start.getTime(), typical.need?.getTime() ?? 0) + 14 * 864e5);
  const span = end.getTime() - t.today.getTime();
  const at = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - t.today.getTime()) / span) * 100));
  const ticks: Date[] = [];
  for (let m = new Date(t.today.getFullYear(), t.today.getMonth() + 1, 1); m < end; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) ticks.push(m);
  const searchHref = `/start?plan=permanent${input.nextWeek ? `&week=${input.nextWeek}` : ""}`;
  // The case Andre described: with notice we'd miss their date, without it we'd make it.
  const noticeIsTheBlocker = !!t.need && (typical.oursLate ?? 0) > 0 && (quick.oursLate ?? 1) <= 0;

  const lane = (bars: Bar[], label: string, us = false) => (
    <div className={`${own.lane} ${us ? own.laneUs : ""}`}>
      <p className={own.laneLabel}>{label}</p>
      <div className={own.track}>
        {bars.map((b) => (
          <div
            key={b.label}
            className={`${own.bar} ${b.kind === "notice" ? own.notice : b.kind === "wait" ? own.wait : us ? own.us : own.them}`}
            style={{ left: `${at(b.from)}%`, width: `${at(b.to) - at(b.from)}%` }}
            title={`${b.label}: ${fmtShort(b.from)} to ${fmtShort(b.to)}`}
          >
            {at(b.to) - at(b.from) >= (b.short.length > 8 ? 9 : 6) && <span>{b.short}</span>}
          </div>
        ))}
        {t.need && <div className={own.needLine} style={{ left: `${at(t.need)}%` }} />}
      </div>
    </div>
  );

  return (
    <section className={styles.wrap}>
      <div className="container">
        {mock && <span className={styles.mock}>Mockup: the live version arrives by email</span>}
        <div className={styles.resultHead}>
          <p className={own.kicker}>
            {input.title} · {tier} level · based in {inCountry(t.country.label)} · hiring with {method.short}
          </p>
          <h1 className={styles.display}>
            Likely start: <span className={`gr ${styles.accent}`}>{fmtDay(t.theirs.start)}</span>
          </h1>
          {t.need && <p className={`${own.verdict} ${(t.late ?? 0) > 0 ? own.late : own.ok}`}>That&apos;s {verdictText(t.late, t.need)}.</p>}
        </div>

        <div className={`${base.payToggle} ${own.noticeToggle}`} role="group" aria-label="Notice period">
          <button type="button" className={!noNotice ? base.payOn : ""} aria-pressed={!noNotice} onClick={() => setNoNotice(false)}>
            Typical notice ({weeksText(t.typicalNotice)})
          </button>
          <button type="button" className={noNotice ? base.payOn : ""} aria-pressed={noNotice} onClick={() => setNoNotice(true)}>
            Available now (no notice)
          </button>
        </div>
        <p className={own.toggleNote}>
          {noNotice
            ? "Someone between jobs, or free to start straight away."
            : `Someone in a job works about ${weeksText(t.typicalNotice)} of notice in ${inCountry(t.country.label)}. The strongest people usually are in a job.`}
        </p>

        <div className={own.chart}>
          <div className={own.axis}>
            {ticks.map((m) => (
              <span key={m.toISOString()} style={{ left: `${at(m)}%` }}>
                {m.toLocaleDateString("en-GB", { month: "short" })}
              </span>
            ))}
          </div>
          {lane(t.theirs.bars, `Hiring with ${method.short}: starts ${fmtShort(t.theirs.start)}`)}
          {shown && lane(t.ours.bars, `With a search week: starts ${fmtShort(t.ours.start)}`, true)}
          <div className={own.legend}>
            <span>
              <i className={own.them} /> Finding and hiring
            </span>
            {!noNotice && (
              <span>
                <i className={own.notice} /> Notice period
              </span>
            )}
            {t.need && (
              <span>
                <i className={own.needKey} /> You need them by {fmtShort(t.need)}
              </span>
            )}
          </div>
        </div>

        {/* The reveal: one big question and an arrow, not an ad-style banner. */}
        <div className={own.reveal}>
          <button type="button" className={own.revealBtn} aria-expanded={shown} onClick={() => setShown((s) => !s)}>
            <span className={own.revealQ}>Need them sooner?</span>
            <span className={own.revealArrow} aria-hidden="true">
              ↓
            </span>
          </button>
          {shown && (
            <div className={own.answer}>
              <p className={own.answerKicker}>The same hire with a search week</p>
              <p className={own.answerDate}>
                Starts around <span className="gr">{fmtDay(t.ours.start)}</span>
              </p>
              {t.need && (
                <p className={`${own.verdict} ${(t.oursLate ?? 0) > 0 ? own.late : own.ok}`}>
                  {(t.oursLate ?? 0) <= 0 ? "In time: " : "That's "}
                  {verdictText(t.oursLate, t.need)}
                  {t.saved > 0 ? `, ${weeksText(t.saved)} sooner than ${method.short}.` : "."}
                </p>
              )}
              {noticeIsTheBlocker && !noNotice && (
                <p className={own.nudge}>
                  It&apos;s the notice period that puts you past your date. We can put people who can start straight away at the front of your shortlist:{" "}
                  <button type="button" className={own.nudgeLink} onClick={() => setNoNotice(true)}>
                    see it with no notice
                  </button>
                  .
                </p>
              )}
              {noticeIsTheBlocker && noNotice && <p className={own.nudge}>To make your date, we&apos;ll put people with no notice period at the front of your shortlist.</p>}
              <ol className={own.steps}>
                {t.ours.bars
                  .filter((b) => b.kind === "stage")
                  .map((b) => (
                    <li key={b.label}>
                      <b>{b.label}</b> {fmtShort(b.from)} to {fmtShort(b.to)}. {b.note}
                    </li>
                  ))}
              </ol>
              <div className={own.answerCta}>
                <Button href={searchHref} variant="primary" arrow>
                  Book a search week
                </Button>
                <span>
                  We run 2 searches a week{slots.left > 0 ? `. ${slots.left === 1 ? "1 left" : `${slots.left} left`} in ${slots.month}` : ""}.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={own.points}>
          <div className={own.point}>
            <h3>Notice: {weeksText(t.typicalNotice)}</h3>
            <p>
              {tier === "Executive" ? "An" : "A"} {tier.toLowerCase()}-level hire in {inCountry(t.country.label)} who&apos;s in a job usually works about {weeksText(t.typicalNotice)} of notice. Nobody can shorten it, so either the search starts earlier or you hire someone available now.
            </p>
          </div>
          <div className={own.point}>
            <h3>The slow part is finding them</h3>
            <p>
              With {method.short}, getting to a shortlist worth interviewing usually takes about {weeksText(weeksBetween(t.theirs.bars[0].from, t.theirs.bars[0].to))}. The strongest people are usually in a job and don&apos;t see the ad.
            </p>
          </div>
          <div className={own.point}>
            <h3>About 1 in 5 offers is turned down</h3>
            <p>
              Around {Math.round((1 - OFFER_DECLINE) * 100)}% of offers are accepted. If yours isn&apos;t, you&apos;re back to your shortlist, or back to the start if the ad has closed.
            </p>
          </div>
        </div>

        <div className={`${styles.how} ${own.how}`}>
          <strong>How we worked this out.</strong> Stage lengths for a job ad or a recruiter are medians from published hiring data, using the mid-level figure for Team roles; the Executive figure is our estimate from the same trend. Notice periods are common practice for professional roles in each country, not legal minimums, and vary by contract. The search-week timeline is from our own searches. Sources:{" "}
          {Object.values(SOURCES).map((s, i) => (
            <span key={s.url}>
              {i > 0 && "; "}
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.name}
              </a>
            </span>
          ))}
          . <Link href="/compare">Compare the cost of every route →</Link>
        </div>
      </div>
    </section>
  );
}
