"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { priceList } from "@/lib/plans";
import { RATES } from "@/lib/currency";
import { compare, money, wks, day, addWeeks, roleLabel, NOTICE_WEEKS, type CompareInput } from "@/lib/compare";
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
  const { rows, best, next, lowest } = data;
  const cur = input.cur ?? "GBP";
  // Our fee as the pricing page shows it (rounded list price in their currency); others converted.
  const L = priceList(cur);
  const feeIn = (x: { fee: number; r: { us?: boolean } }) => (x.r.us ? L.convert(x.fee, 1000) : cur === "GBP" ? Math.round(x.fee) : Math.round((x.fee * RATES[cur]) / 10) * 10);
  // The trade in one line, against the next-best option (Andre 2026-11-09: show what the extra fee buys).
  const trade = (() => {
    if (!next) return "";
    const parts: string[] = [];
    const feeDiff = feeIn(best) - feeIn(next);
    const weeks = next.hireBy - best.hireBy;
    const interviews = next.r.interviews - best.r.interviews;
    const hours = next.hours - best.hours;
    if (weeks > 0) parts.push(`${weeks} week${weeks === 1 ? "" : "s"} sooner`);
    if (interviews > 0) parts.push(`${interviews} fewer interview${interviews === 1 ? "" : "s"}`);
    if (hours > 0) parts.push(`${hours} fewer hours of your team's time`);
    if (!parts.length) return "";
    const them = ({ ads: "a job ad", games20: "a games-specialist agency", tech25: "a general tech agency", mf: "MakersForge" } as Record<string, string>)[next.r.id] ?? next.r.name;
    const lead = feeDiff > 0 ? `${L.fmt(feeDiff)} more than ${them}` : feeDiff < 0 ? `${L.fmt(-feeDiff)} less than ${them}` : `The same fee as ${them}`;
    return `${lead}: ${parts.join(", ").replace(/, ([^,]*)$/, " and $1")}.`;
  })();
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
            {{ balanced: "a balance of everything", cost: "lowest cost first", speed: "hiring fast first", hours: "saving team time first" }[input.p]}
          </p>
        </div>

        <div className={`${styles.best} ${styles.bestCenter} ${best.r.us ? styles.bestUs : ""}`}>
          <p className={styles.bestLine}>
            Best fit for you: <strong>{best.r.name}</strong>
          </p>
          <span>
            {L.fmt(feeIn(best))} fee, hire made by around {day(addWeeks(best.hireBy))}.
            {!best.r.us && " That's not us, and that's fine: it's the better fit here."}
            {best.tooSlow && " Nothing fits your date, so this is the closest."}
          </span>
          {trade && <span className={styles.trade}>{trade}</span>}
        </div>

        {/* The gift sits right under the verdict, open (Ashley's QA: it was easy to miss). */}
        {promo && <GiftBox lid={input.lid} special={special} slots={slots} cur={cur} fee={rows.find((x) => x.r.us)?.fee} role={role} />}

        <div className={styles.table}>
          <div className={`${styles.tr} ${styles.th}`}>
            <span>Route</span>
            <span>Fee</span>
            <span>Hire made by</span>
            <span>Your team&apos;s hours</span>
            <span>Interviews per hire</span>
            <span>Finds people not looking</span>
          </div>
          {rows.map((x) => (
            <div key={x.r.id} className={`${styles.item} ${x.r.us ? styles.itemUs : ""}`}>
              <button type="button" className={styles.tr} onClick={() => setOpen(open === x.r.id ? null : x.r.id)} aria-expanded={open === x.r.id}>
                <span className={styles.name}>
                  {x.r.name}
                  {x.r.id === best.r.id && <em className={styles.bestTag}>Best fit</em>}
                  {x.tooSlow && <em className={styles.warn}>Too late for your date</em>}
                </span>
                <span data-l="Fee" className={x.fee === lowest.fee ? styles.win : ""}>{L.fmt(feeIn(x))}</span>
                <span data-l="Hire made by" className={x.hireBy === lowest.hireBy ? styles.win : ""}>{day(addWeeks(x.hireBy))}</span>
                <span data-l="Your team's hours" className={x.hours === lowest.hours ? styles.win : ""}>{x.hours}h</span>
                <span data-l="Interviews per hire" className={x.r.interviews === lowest.interviews ? styles.win : ""}>{x.r.interviews}</span>
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
            interviews it typically takes to make one hire.
          </p>
        </div>

        <div className={styles.ctas}>
          <Link href="/start" className={styles.go}>Start a search week →</Link>
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
        </details>
      </div>
    </section>
  );
}
