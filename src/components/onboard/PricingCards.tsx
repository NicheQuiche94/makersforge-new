"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { BATCH_MAX, CONTRACT_FEE, FEE_FLOOR, RETAINED_OFF, TIER_FEE, TIER_NAME, gbp, hireFee, type PayWhen, type Tier } from "@/lib/plans";
import { BOOKING_URL } from "@/lib/site";
import { startHref } from "./PlanCards";
import base from "./PlanCards.module.css";
import styles from "./PricingCards.module.css";

/* /pricing (Andre 2026-11-09, MOCKUP): three cards, Team, Senior and
   Executive, set by the level in the job title. Two switches: Permanent /
   Contractor and On success / Retained (retained is permanent-only).
   Contractors are a flat £1,000 a month, not tiered. Batch is a sentence
   and a "how many hires?" picker under the cards. No hire below £7,000. */

type Kind = "permanent" | "contract";

const INCLUDED = [
  "A search week set aside just for your role",
  "Headhunted: people not job hunting, as well as those who are",
  "5 vetted candidates the Monday after, each interviewed by us",
  "We book the interviews and run the process with you",
  "Flat fee, never a percentage of salary",
];

const WHO: Record<Tier, string> = {
  team: "Junior, Associate and mid-level roles, or no level in the title.",
  senior: "Senior, Lead, Principal and Staff roles.",
  executive: "Head, Director, VP, C-level and GM roles.",
};

export function PricingCards({ candidate }: { candidate?: string }) {
  const [kind, setKind] = useState<Kind>("permanent");
  const [pay, setPay] = useState<PayWhen>("success");
  const retainedOk = kind === "permanent";
  const shown = retainedOk ? pay : "success";
  const ret = shown === "retained";
  const payLine =
    kind === "contract" ? "Monthly while they're engaged, stop any month" : ret ? `${RETAINED_OFF * 100}% off: a third up front, the rest when your hire starts` : "Nothing up front: pay when your hire starts";

  return (
    <>
      <div className={styles.switches}>
        <div className={base.payToggle} role="group" aria-label="Kind of hire">
          {(["permanent", "contract"] as const).map((x) => (
            <button key={x} type="button" className={kind === x ? base.payOn : ""} aria-pressed={kind === x} onClick={() => setKind(x)}>
              {x === "permanent" ? "Permanent" : "Contractor"}
            </button>
          ))}
        </div>
        <div className={`${base.payToggle} ${!retainedOk ? styles.off : ""}`} role="group" aria-label="When you pay">
          {(["success", "retained"] as const).map((w) => (
            <button key={w} type="button" disabled={!retainedOk} className={shown === w ? base.payOn : ""} aria-pressed={shown === w} onClick={() => setPay(w)}>
              {w === "success" ? "On success" : "Retained"}
              {w === "retained" && <span className={base.save}>Save {RETAINED_OFF * 100}%</span>}
            </button>
          ))}
        </div>
      </div>
      <p className={base.payNote}>
        {kind === "contract"
          ? `One flat ${gbp(CONTRACT_FEE)} a month per contractor, whatever the level. You pay them directly, with no markup on their rate.`
          : ret
            ? `A third up front when you sign, the rest as each hire starts, and ${RETAINED_OFF * 100}% off.`
            : "Nothing up front. You pay when your hire starts."}
      </p>

      <div className={`${base.grid} ${base.grid3}`}>
        {(["team", "senior", "executive"] as const).map((t) => {
          const featured = t === "senior" ? "Most hires that move revenue" : undefined;
          return (
            <article key={t} className={`card-shadow ${base.card} ${featured ? base.featured : ""}`}>
              {featured && <span className={base.badge}>{featured}</span>}
              <h3 className={base.name}>{TIER_NAME[t]}</h3>
              <p className={base.price}>
                {kind === "contract" ? gbp(CONTRACT_FEE) : gbp(hireFee(t, 0, { retained: ret }))}
                <span className={base.per}> {kind === "contract" ? "per contractor, per month" : ret ? "per hire, retained" : "per hire"}</span>
              </p>
              {ret && <p className={styles.note}>was {gbp(TIER_FEE[t])}</p>}
              <p className={base.blurb}>{WHO[t]}</p>
              <ul className={base.points}>
                {(kind === "contract" ? INCLUDED.slice(0, 4) : INCLUDED).map((p) => (
                  <li key={p}>{p}</li>
                ))}
                <li>{payLine}</li>
              </ul>
              <div className={base.ctaRow}>
                <Button href={startHref(kind === "contract" ? "contract" : "permanent", candidate, retainedOk ? shown : undefined)} variant={featured ? "primary" : "ghost"} arrow className={base.cta}>
                  Start a brief
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {kind === "permanent" && <BatchCalc retained={ret} candidate={candidate} />}
      <p className={styles.draft}>Mockup: copy to be approved before this goes live.</p>
    </>
  );
}

const ORD = ["1st", "2nd", "3rd", "4th", "5th"];

/** Batch: the rule in one sentence, a "how many hires?" toggle and the breakdown, in the site's card and table style. */
function BatchCalc({ retained, candidate }: { retained: boolean; candidate?: string }) {
  const [n, setN] = useState(3);
  const row = (t: Tier) => Array.from({ length: n }, (_, i) => hireFee(t, i, { batch: true, retained }));
  const team = row("team");
  const senior = row("senior");
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  return (
    <>
      <section className={`card-shadow ${styles.batch}`} aria-labelledby="batch">
        <div className={styles.batchText}>
          <h3 id="batch" className={base.name}>
            Hiring several?
          </h3>
          <p className={styles.rule}>
            Give us 2 to {BATCH_MAX} Team or Senior roles at once. Your first hire is full price, and each one after is £1,000 less than the one before, never below {gbp(FEE_FLOOR)}.
          </p>
          <p className={styles.howLabel}>How many hires?</p>
          <div className={`${base.payToggle} ${styles.howMany}`} role="group" aria-label="How many hires">
            {[2, 3, 4, 5].map((x) => (
              <button key={x} type="button" className={n === x ? base.payOn : ""} aria-pressed={n === x} onClick={() => setN(x)}>
                {x}
              </button>
            ))}
          </div>
          <div className={base.ctaRow}>
            <Button href={startHref("batch", candidate, retained ? "retained" : "success")} variant="ghost" arrow className={base.cta}>
              Start a batch
            </Button>
          </div>
        </div>
        <table className={styles.batchTable}>
          <thead>
            <tr>
              <th>{n} hires{retained ? ", retained" : ""}</th>
              <th>All Team</th>
              <th>All Senior</th>
            </tr>
          </thead>
          <tbody>
            {team.map((f, i) => (
              <tr key={i}>
                <td>{ORD[i]} hire</td>
                <td>{gbp(f)}</td>
                <td>{gbp(senior[i])}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>In all</td>
              <td>{gbp(sum(team))}</td>
              <td>{gbp(sum(senior))}</td>
            </tr>
          </tfoot>
          <caption>A mix steps down the same way, in the order you hire. Executive roles are always {gbp(hireFee("executive", 0, { retained }))}.</caption>
        </table>
      </section>
      <div className={`heat-glow ${styles.team}`}>
        <p>
          <b>Hiring a complete team?</b> Talk to us about a custom package, with payment over time available.
        </p>
        <Button href={BOOKING_URL} external variant="light" arrow>
          Book a call
        </Button>
      </div>
    </>
  );
}
