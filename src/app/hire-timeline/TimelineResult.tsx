import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { TIER_NAME } from "@/lib/plans";
import { inCountry, METHODS, OFFER_DECLINE, SOURCES, fmtDay, fmtShort, timeline, weeksBetween, weeksText, type Bar, type TimelineInput } from "@/lib/hireTimeline";
import styles from "../compare/compare.module.css";
import own from "./timeline.module.css";

/* The result: their route against their date, then the same hire with a
   search week. Honest about what we can't change (notice, interviews). */
export function TimelineResult({ input, slots, mock }: { input: TimelineInput; slots: { left: number; month: string }; mock?: boolean }) {
  const t = timeline(input);
  const method = METHODS.find((m) => m.id === input.method)!;
  const end = new Date(Math.max(t.theirs.start.getTime(), t.need?.getTime() ?? 0, t.ours.start.getTime()) + 14 * 864e5);
  const span = end.getTime() - t.today.getTime();
  const at = (d: Date) => Math.max(0, Math.min(100, ((d.getTime() - t.today.getTime()) / span) * 100));
  const ticks: Date[] = [];
  for (let m = new Date(t.today.getFullYear(), t.today.getMonth() + 1, 1); m < end; m = new Date(m.getFullYear(), m.getMonth() + 1, 1)) ticks.push(m);
  const tier = TIER_NAME[input.tier];
  const searchHref = `/start?plan=permanent${input.nextWeek ? `&week=${input.nextWeek}` : ""}`;

  const lane = (bars: Bar[], label: string, us = false) => (
    <div className={own.lane}>
      <p className={own.laneLabel}>{label}</p>
      <div className={own.track}>
        {bars.map((b) => (
          <div
            key={b.label}
            className={`${own.bar} ${b.kind === "notice" ? own.notice : b.kind === "wait" ? own.wait : us ? own.us : own.them}`}
            style={{ left: `${at(b.from)}%`, width: `${at(b.to) - at(b.from)}%` }}
            title={`${b.label}: ${fmtShort(b.from)} to ${fmtShort(b.to)}`}
          >
            <span>{b.short}</span>
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
          {t.need && t.late !== null && (
            <p className={`${own.verdict} ${t.late > 0 ? own.late : own.ok}`}>
              {t.late > 0
                ? `That's ${weeksText(t.late)} after the ${fmtDay(t.need)} you need them.`
                : t.late === 0
                  ? `Right on your ${fmtDay(t.need)} deadline, with no room for a declined offer.`
                  : `${weeksText(-t.late)} before your ${fmtDay(t.need)} deadline, if nothing slips.`}
            </p>
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
          {lane(t.theirs.bars, `Hiring with ${method.short}: starts ${fmtShort(t.theirs.start)}`)}
          {lane(t.ours.bars, `With a search week: starts ${fmtShort(t.ours.start)}`, true)}
          <div className={own.legend}>
            <span>
              <i className={own.them} /> Finding and hiring
            </span>
            <span>
              <i className={own.notice} /> Notice period
            </span>
            {t.need && (
              <span>
                <i className={own.needKey} /> You need them by {fmtShort(t.need)}
              </span>
            )}
          </div>
        </div>

        <div className={own.points}>
          <div className={own.point}>
            <h3>Notice: {weeksText(t.notice)}</h3>
            <p>
              {tier === "Executive" ? "An" : "A"} {tier.toLowerCase()}-level hire in {inCountry(t.country.label)} usually works about {weeksText(t.notice)} of notice before they can start. Nobody can shorten that, so the search has to start earlier.
              {t.startBy && t.need && (t.startBy > t.today ? ` To have someone in by ${fmtDay(t.need)}, the search needs to start by around ${fmtDay(t.startBy)}.` : ` For ${fmtDay(t.need)}, the search would have needed to start around ${fmtDay(t.startBy)}. Starting now, the earliest realistic start is around ${fmtDay(t.ours.start)}.`)}
            </p>
          </div>
          <div className={own.point}>
            <h3>The slow part is finding them</h3>
            <p>
              With {method.short}, getting to a shortlist worth interviewing usually takes about {weeksText(weeksBetween(t.theirs.bars[0].from, t.theirs.bars[0].to))}. Interviews and the offer take the same time whichever way you hire.
            </p>
          </div>
          <div className={own.point}>
            <h3>About 1 in 5 offers is turned down</h3>
            <p>
              Around {Math.round((1 - OFFER_DECLINE) * 100)}% of offers are accepted. If yours isn&apos;t, you&apos;re back to your shortlist, or back to the start if the ad has closed.
            </p>
          </div>
        </div>

        <div className={`heat-glow ${own.cta}`}>
          <div>
            <h2>{t.saved > 0 ? `Need them sooner? With a search week they'd start around ${fmtDay(t.ours.start)}, ${weeksText(t.saved)} earlier.` : "Need them sooner? Start the search this month."}</h2>
            <p>
              We headhunt and call all week, and your 5 screened candidates land the Monday after. We run 2 searches a week{slots.left > 0 ? `, and there ${slots.left === 1 ? "is 1" : `are ${slots.left}`} left in ${slots.month}` : ""}.
            </p>
          </div>
          <Button href={searchHref} variant="light" arrow>
            Book a search week
          </Button>
        </div>

        <div className={`${styles.how} ${own.how}`}>
          <strong>How we worked this out.</strong> Stage lengths are medians from published hiring data, using the mid-level figure for Team roles; the Executive figure is our estimate from the same trend. Notice periods are common practice for professional roles in each country, not legal minimums, and vary by contract. The search-week timeline uses the same interview and offer time as yours; only the search is shorter. Sources:{" "}
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
