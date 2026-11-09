"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { COMPARE, PLANS, RETAINED_OFF, TIER_NAME, gbpK, ladder, retainedFee, type PayWhen, type Plan } from "@/lib/plans";
import styles from "./PlanCards.module.css";

/** Where a plan's button goes: the flow (week first), with the plan and how they pay pre-picked. */
export function startHref(plan?: string, candidate?: string, pay?: PayWhen) {
  const q = new URLSearchParams();
  if (plan) q.set("plan", plan);
  if (pay === "retained") q.set("pay", pay);
  if (candidate) q.set("candidate", candidate);
  const s = q.toString();
  return s ? `/start?${s}` : "/start";
}

/** Every plan side by side, collapsed by default (normal SaaS pricing pattern). */
export function Compare({ open = false, big = false }: { open?: boolean; big?: boolean }) {
  if (open) return <div className={styles.tableWrap}>{compareTable()}</div>;
  return (
    <details className={`${styles.compare} ${big ? styles.compareBig : ""}`}>
      <summary>
        Compare all plans
        {big && (
          <span className={styles.compareArrow} aria-hidden="true">
            ↓
          </span>
        )}
      </summary>
      <div className={styles.tableWrap}>{compareTable()}</div>
    </details>
  );
}

function compareTable() {
  return (
    <>
        <table className={styles.table}>
          <thead>
            <tr>
              <th />
              {PLANS.map((p) => (
                <th key={p.id}>{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((r) => (
              <tr key={r.row}>
                <th scope="row">{r.row}</th>
                {PLANS.map((p) => (
                  <td key={p.id}>{r.cells[p.id]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </>
  );
}

function Card({ plan, pay, candidate }: { plan: Plan; pay: PayWhen; candidate?: string }) {
  const face = pay === "retained" && plan.retained ? plan.retained : plan;
  return (
    <article className={`card-shadow ${styles.card} ${plan.badge ? styles.featured : ""}`}>
      {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
      <h3 className={styles.name}>{plan.name}</h3>
      <p className={styles.price}>
        {face.price}
        <span className={styles.per}> {face.per}</span>
      </p>
      {pay === "retained" && !plan.retained && <p className={styles.annual}>Paid monthly, so there&apos;s no retainer</p>}
      <p className={styles.blurb}>{plan.blurb}</p>
      {plan.id === "batch" && <BatchSteps pay={pay} />}
      <ul className={styles.points}>
        {face.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div className={styles.ctaRow}>
        <Button href={startHref(plan.id, candidate, plan.retained ? pay : undefined)} variant={plan.badge ? "primary" : "ghost"} arrow className={styles.cta}>
          {plan.cta}
        </Button>
      </div>
    </article>
  );
}

/** The batch ladder, one row per tier: what each hire costs, 1st to 5th. */
function BatchSteps({ pay }: { pay: PayWhen }) {
  const k = (fee: number) => gbpK(pay === "retained" ? retainedFee(fee) : fee);
  return (
    <div className={styles.ladders}>
      {(["team", "senior"] as const).map((t) => (
        <div key={t} className={styles.ladderRow}>
          <span className={styles.ladderName}>{TIER_NAME[t]}</span>
          <span className={styles.ladderFees}>{ladder(t).map(k).join(" → ")}</span>
        </div>
      ))}
    </div>
  );
}

/** The On success / Retained switch, shared by /pricing and the flow's plan step. */
export function PayToggle({ pay, setPay }: { pay: PayWhen; setPay: (p: PayWhen) => void }) {
  return (
    <>
      <div className={styles.payToggle} role="group" aria-label="When you pay">
        {(["success", "retained"] as const).map((w) => (
          <button key={w} type="button" className={pay === w ? styles.payOn : ""} aria-pressed={pay === w} onClick={() => setPay(w)}>
            {w === "success" ? "On success" : "Retained"}
            {w === "retained" && <span className={styles.save}>Save {RETAINED_OFF * 100}%</span>}
          </button>
        ))}
      </div>
      <p className={styles.payNote}>
        {pay === "success"
          ? "Nothing up front. You pay when your hire starts."
          : `A third up front when you sign, the rest as each hire starts, and ${RETAINED_OFF * 100}% off.`}
      </p>
    </>
  );
}

/** /pricing: the Success / Retained switch, then the three ways to hire. */
export function PlanGrid({ candidate }: { candidate?: string }) {
  const [pay, setPay] = useState<PayWhen>("success");
  return (
    <>
      <PayToggle pay={pay} setPay={setPay} />
      <div className={`${styles.grid} ${styles.grid3}`}>
        {PLANS.map((p) => (
          <Card key={p.id} plan={p} pay={pay} candidate={candidate} />
        ))}
      </div>
    </>
  );
}
