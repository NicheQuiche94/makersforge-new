"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { compare, gbp, wks, day, addWeeks, roleLabel, HOURLY, NOTICE_WEEKS, wantsChristmasHire, type CompareInput } from "@/lib/compare";
import { setMailRef } from "@/lib/analytics";
import { GiftBox } from "./GiftBox";
import styles from "../compare.module.css";

export function Results({ input, christmas = false, slots = 0 }: { input: CompareInput | null; christmas?: boolean; slots?: number }) {
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
  const { rows, best, lowest } = data;
  const role = roleLabel(input.role);
  const giftOn = christmas && wantsChristmasHire(input);

  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.resultHead}>
        <h1 className={styles.display}>
          Your comparison for a <span className={`gr ${styles.accent}`}>{role}</span>
        </h1>
        <p className={styles.summaryCenter}>
          {input.company ? `${input.company} · ` : ""}
          {gbp(input.salary)}
          {input.start ? ` · hire needed by ${day(new Date(input.start))}` : ""}
          {input.budget ? ` · budget ${gbp(input.budget)}` : ""} ·{" "}
          {{ balanced: "a balance of everything", cost: "lowest cost first", speed: "starting soonest first", hours: "saving team time first" }[input.p]}
        </p>
        </div>

        <div className={`${styles.best} ${styles.bestCenter} ${best.r.us ? styles.bestUs : ""}`}>
          <span className={styles.bestLabel}>Best fit for you</span>
          <strong>{best.r.name}</strong>
          <span>
            {gbp(best.real)} all in, hire made by around {day(addWeeks(best.hireBy))}, starting around {day(addWeeks(best.startWeeks))}.
            {!best.r.us && " That's not us, and that's fine: it's the better fit here."}
            {(best.overBudget || best.tooSlow) && " Nothing fits every constraint, so this is the closest."}
          </span>
        </div>

        <div className={styles.table}>
          <div className={`${styles.tr} ${styles.th}`}>
            <span>Option</span>
            <span>Cost, all in</span>
            <span>Hire made by</span>
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
                  {x.tooSlow && <em className={styles.warn}>Too late for your date</em>}
                </span>
                <span data-l="Cost" className={x.real === lowest.real ? styles.win : ""}>{gbp(x.real)}</span>
                <span data-l="Hire made by" className={x.hireBy === lowest.hireBy ? styles.win : ""}>{day(addWeeks(x.hireBy))}</span>
                <span data-l="Team hours" className={x.hours === lowest.hours ? styles.win : ""}>{x.hours}h</span>
                <span data-l="Interviews" className={x.r.interviews === lowest.interviews ? styles.win : ""}>{x.r.interviews}</span>
              </button>
              {open === x.r.id && (
                <div className={styles.detail}>
                  <p>{x.r.how}.</p>
                  <ul>
                    <li><b>Fee:</b> {gbp(x.fee)} ({x.r.feeNote}), plus {gbp(x.hours * HOURLY)} of team time at {gbp(HOURLY)} an hour.</li>
                    <li><b>Speed:</b> first shortlist in {x.r.shortlist}, an accepted offer in {wks(x.r.hireWeeks)}, then about {NOTICE_WEEKS} weeks&apos; notice before they start (around {day(addWeeks(x.startWeeks))}).</li>
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
        </div>

        {giftOn && <GiftBox lid={input.lid} slots={slots} />}

        <details className={styles.how}>
          <summary>How we worked these out</summary>
          <p>
            Cost is the fee plus your team&apos;s hours at {gbp(HOURLY)} an hour. &ldquo;Hire made by&rdquo; is when an offer is
            usually accepted; they then typically work a {NOTICE_WEEKS}-week notice period before starting. Interviews is how many it usually takes to make one
            hire. 
          </p>
        </details>
      </div>
    </section>
  );
}
