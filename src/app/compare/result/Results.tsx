"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { compare, money, wks, day, addWeeks, roleLabel, HOURLY, NOTICE_WEEKS, type CompareInput } from "@/lib/compare";
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
  const { rows, best, lowest } = data;
  const role = roleLabel(input.role);
  const cur = input.cur ?? "GBP";
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
            {money(best.real, cur)} all in, hire made by around {day(addWeeks(best.hireBy))}.
            {!best.r.us && " That's not us, and that's fine: it's the better fit here."}
            {best.tooSlow && " Nothing fits your date, so this is the closest."}
          </span>
        </div>

        <div className={styles.table}>
          <div className={`${styles.tr} ${styles.th}`}>
            <span>Route</span>
            <span>Cost, all in</span>
            <span>Hire made by</span>
            <span>Your team&apos;s hours</span>
            <span>First interviews</span>
            <span>Who you reach</span>
          </div>
          {rows.map((x) => (
            <div key={x.r.id} className={`${styles.item} ${x.r.us ? styles.itemUs : ""}`}>
              <button type="button" className={styles.tr} onClick={() => setOpen(open === x.r.id ? null : x.r.id)} aria-expanded={open === x.r.id}>
                <span className={styles.name}>
                  {x.r.name}
                  {x.r.id === best.r.id && <em className={styles.bestTag}>Best fit</em>}
                  {x.tooSlow && <em className={styles.warn}>Too late for your date</em>}
                </span>
                <span data-l="Cost, all in" className={x.real === lowest.real ? styles.win : ""}>{money(x.real, cur)}</span>
                <span data-l="Hire made by" className={x.hireBy === lowest.hireBy ? styles.win : ""}>{day(addWeeks(x.hireBy))}</span>
                <span data-l="Your team's hours" className={x.hours === lowest.hours ? styles.win : ""}>{x.hours}h</span>
                <span data-l="First interviews" className={x.r.interviews === lowest.interviews ? styles.win : ""}>{x.r.interviews}</span>
                <span data-l="Who you reach" className={x.r.reach.passive ? styles.win : styles.lose}>{x.r.reach.label}</span>
              </button>
              {open === x.r.id && (
                <div className={styles.detail}>
                  <p>{x.r.how}.</p>
                  <ul>
                    <li>
                      <b>Fee:</b> {money(x.fee, cur)} ({x.r.feeNote}), plus {money(x.hours * HOURLY, cur)} of your team&apos;s time (est. {money(HOURLY, cur)} an hour).
                    </li>
                    <li>
                      <b>Speed:</b> first shortlist in {x.r.shortlist}, an accepted offer in {wks(x.r.hireWeeks)}, then up to {NOTICE_WEEKS} weeks&apos; notice.
                      {x.r.speedNote && ` (${x.r.speedNote})`}
                    </li>
                    <li>
                      <b>What you get:</b> {x.r.get}.
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
            Tap any route for the detail. Green marks the best on each measure. First interviews: how many you&apos;d typically run to find
            someone worth hiring. Who you reach: whether you only see people actively job hunting, or also the people who aren&apos;t looking.
          </p>
        </div>

        <div className={styles.ctas}>
          <Link href="/start" className={styles.go}>Start a search week →</Link>
        </div>

        {promo && <GiftBox lid={input.lid} special={special} slots={slots} cur={cur} />}

        <details className={styles.how}>
          <summary>How we worked these out</summary>
          <p>
            Cost is the fee plus your team&apos;s hours at an estimated {money(HOURLY, cur)} an hour. &ldquo;Hire made by&rdquo; is when an
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
