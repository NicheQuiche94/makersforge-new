"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { TIER_NAME } from "@/lib/plans";
import { inCountry, METHODS, OFFER_DECLINE, SOURCES, fmtDay, fmtShort, timeline, weeksText, type Bar, type TimelineInput } from "@/lib/hireTimeline";
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

type Route = "theirs" | "ours";

/* The result (Andre 2026-11-09, v3): two switches up top (their route or
   MakersForge; typical notice or available now) and one summary that
   changes with them. The timeline sits under it; on the MakersForge route
   it shows both, so the difference is plain. */
export function TimelineResult({ input, slots, mock }: { input: TimelineInput; slots: { left: number; month: string }; mock?: boolean }) {
  const [route, setRoute] = useState<Route>("theirs");
  const [noNotice, setNoNotice] = useState(false);
  const t = timeline(input, noNotice);
  const typical = timeline(input, false);
  const quick = timeline(input, true);
  const method = METHODS.find((m) => m.id === input.method)!;
  const theirName = input.method === "jobad" ? "Job ad" : "Your recruiter";
  const tier = TIER_NAME[input.tier];
  const ours = route === "ours";
  const start = ours ? t.ours.start : t.theirs.start;
  const late = ours ? t.oursLate : t.late;

  // One scale for every switch position, so bars visibly shrink when you flip them.
  const end = new Date(Math.max(typical.theirs.start.getTime(), typical.need?.getTime() ?? 0) + 14 * 864e5);
  const span = end.getTime() - t.today.getTime();
  const at = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - t.today.getTime()) / span) * 100));
  const ticks: Date[] = [];
  for (let m = new Date(t.today.getFullYear(), t.today.getMonth() + 1, 1); m < end; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) ticks.push(m);
  const searchHref = `/start?plan=permanent${input.nextWeek ? `&week=${input.nextWeek}` : ""}`;
  // With notice we'd miss their date; without it we'd make it.
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
        <p className={own.kicker}>
          {input.title} · {tier} level · based in {inCountry(t.country.label)}
          {t.need ? ` · needed by ${fmtDay(t.need)}` : ""}
        </p>

        <div className={own.switches}>
          <div className={`${base.payToggle} ${own.routeToggle}`} role="group" aria-label="How you hire">
            <button type="button" className={!ours ? base.payOn : ""} aria-pressed={!ours} onClick={() => setRoute("theirs")}>
              {theirName}
            </button>
            <button type="button" className={ours ? base.payOn : ""} aria-pressed={ours} onClick={() => setRoute("ours")}>
              MakersForge
            </button>
          </div>
          <div className={base.payToggle} role="group" aria-label="Notice period">
            <button type="button" className={!noNotice ? base.payOn : ""} aria-pressed={!noNotice} onClick={() => setNoNotice(false)}>
              {weeksText(t.typicalNotice)}&apos; notice
            </button>
            <button type="button" className={noNotice ? base.payOn : ""} aria-pressed={noNotice} onClick={() => setNoNotice(true)}>
              Available now
            </button>
          </div>
        </div>

        {/* The summary: the part people read. */}
        <div className={`${own.summary} ${ours ? own.summaryUs : ""}`}>
          <p className={own.summaryKicker}>{ours ? "With MakersForge" : `With ${method.short}`}</p>
          <h1 className={own.summaryDate}>
            Likely start: <span className="gr">{fmtDay(start)}</span>
          </h1>
          {t.need && (
            <p className={`${own.verdict} ${(late ?? 0) > 0 ? own.late : own.ok}`}>
              {(late ?? 0) <= 0 ? "In time: " : "That's "}
              {verdictText(late, t.need)}
              {ours && t.saved > 0 ? `, ${weeksText(t.saved)} sooner than ${method.short}.` : "."}
            </p>
          )}
          {ours && noticeIsTheBlocker && !noNotice && (
            <p className={own.nudge}>
              Only the notice period puts you past your date. We can put people who can start straight away at the front of your shortlist:{" "}
              <button type="button" className={own.nudgeLink} onClick={() => setNoNotice(true)}>
                see it with no notice
              </button>
              .
            </p>
          )}
          {ours && noticeIsTheBlocker && noNotice && <p className={own.nudge}>To make your date, we&apos;ll put people with no notice period at the front of your shortlist.</p>}
          {ours ? (
            <div className={own.summaryCta}>
              <Button href={searchHref} variant="primary" arrow>
                Book a search week
              </Button>
              <span>
                Your 5 the Monday after. We run 2 searches a week{slots.left > 0 ? `; ${slots.left === 1 ? "1 left" : `${slots.left} left`} in ${slots.month}` : ""}.
              </span>
            </div>
          ) : (
            <button type="button" className={own.sooner} onClick={() => setRoute("ours")}>
              Need them sooner? <span>See it with MakersForge</span>
              <i aria-hidden="true">→</i>
            </button>
          )}
        </div>

        <div className={own.chart}>
          <div className={own.axis}>
            {ticks.map((m) => (
              <span key={m.toISOString()} style={{ left: `${at(m)}%` }}>
                {m.toLocaleDateString("en-GB", { month: "short" })}
              </span>
            ))}
          </div>
          {lane(t.theirs.bars, `${theirName}: starts ${fmtShort(t.theirs.start)}`)}
          {ours && lane(t.ours.bars, `MakersForge: starts ${fmtShort(t.ours.start)}`, true)}
          <div className={own.legend}>
            <span>
              <i className={own.them} /> Finding and hiring
            </span>
            {ours && (
              <span>
                <i className={own.us} /> With MakersForge
              </span>
            )}
            {!noNotice && (
              <span>
                <i className={own.notice} /> Notice period
              </span>
            )}
            {t.need && (
              <span>
                <i className={own.needKey} /> Needed by {fmtShort(t.need)}
              </span>
            )}
          </div>
        </div>

        <ul className={own.facts}>
          <li>
            <b>Notice:</b> someone in a job in {inCountry(t.country.label)} usually works about {weeksText(t.typicalNotice)} before they can start, and the strongest people usually are in a job.
          </li>
          <li>
            <b>Offers:</b> about {Math.round(OFFER_DECLINE * 100)}% are turned down. If yours is, you&apos;re back to your shortlist, or back to the start if the ad has closed.
          </li>
        </ul>

        <div className={`${styles.how} ${own.how}`}>
          <strong>How we worked this out.</strong> Stage lengths for a job ad or a recruiter are medians from published hiring data, using the mid-level figure for Team roles; the Executive figure is our estimate from the same trend. Notice periods are common practice for professional roles in each country, not legal minimums, and vary by contract. The MakersForge timeline is from our own searches. Sources:{" "}
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
