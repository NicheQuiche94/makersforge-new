"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { RETAINED_OFF, TIER_FEE, TIER_FLOOR, gbp, gbpK, ladder, retainedFee, type PayWhen } from "@/lib/plans";
import { startHref } from "./PlanCards";
import base from "./PlanCards.module.css";
import styles from "./PricingCards.module.css";

/* /pricing (Andre 2026-11-09, MOCKUP): three cards, Generalist, Specialist
   and Batch, that all follow two switches: Permanent / Contractor and On
   success / Retained (retained is permanent-only). SaaS-style "what's
   included" bullets. Contractor tier prices are DRAFT numbers for Andre. */

type Kind = "permanent" | "contract";

const CONTRACT_FEE = { generalist: 1_000, specialist: 1_500 }; // DRAFT: £ per contractor per month
const CONTRACT_BATCH_OFF = 0.1; // DRAFT: 10% off each month for 2–5 contractors

const INCLUDED = [
  "A search week set aside just for your role",
  "Headhunted: people not job hunting, as well as those who are",
  "5 vetted candidates the Monday after, each interviewed by us",
  "We book the interviews and run the process with you",
  "Flat fee, never a percentage of salary",
];

type CardData = {
  id: string;
  name: string;
  who: string;
  price: string;
  per: string;
  note?: string;
  extraTitle?: string;
  points: string[];
  cta: { label: string; plan: string };
  featured?: string;
};

function cards(kind: Kind, pay: PayWhen): CardData[] {
  const ret = kind === "permanent" && pay === "retained";
  const k = (n: number) => (ret ? retainedFee(n) : n);
  const payLine = kind === "contract" ? "Monthly while they're engaged, stop any month" : ret ? `${RETAINED_OFF * 100}% off: a third up front, the rest when your hire starts` : "Nothing up front: pay when your hire starts";

  if (kind === "contract") {
    return [
      {
        id: "generalist",
        name: "Generalist",
        who: "Contractors for most roles: art, design, engineering, product, marketing.",
        price: gbp(CONTRACT_FEE.generalist),
        per: "per contractor, per month",
        points: [...INCLUDED.slice(0, 4), "You pay the contractor directly, no markup on their rate", payLine],
        cta: { label: "Start a brief", plan: "contract" },
      },
      {
        id: "specialist",
        name: "Specialist",
        who: "Senior or revenue-critical contractors: UA, growth, monetisation, live-ops, economy, Head level and up.",
        price: gbp(CONTRACT_FEE.specialist),
        per: "per contractor, per month",
        extraTitle: "Everything in Generalist, plus",
        points: ["A short market map of who's out there, with the shortlist", "Shortlist calibrated with you before outreach starts", "You pay the contractor directly, no markup on their rate", payLine],
        cta: { label: "Start a brief", plan: "contract" },
        featured: "For the hires that move revenue",
      },
      {
        id: "batch",
        name: "Batch",
        who: "2 to 5 contractors at once, any mix of generalist and specialist.",
        price: `${CONTRACT_BATCH_OFF * 100}% off`,
        per: "every contractor, every month",
        note: `${gbp(CONTRACT_FEE.generalist * (1 - CONTRACT_BATCH_OFF))} generalist · ${gbp(CONTRACT_FEE.specialist * (1 - CONTRACT_BATCH_OFF))} specialist, per month`,
        points: ["Each role gets its own search week and 5 candidates", "Mix generalist and specialist roles", "One contract and one point of contact for all of them", "Scale up or down month to month"],
        cta: { label: "Start a batch", plan: "contract" },
      },
    ];
  }

  return [
    {
      id: "generalist",
      name: "Generalist",
      who: "Most hires: art, design, engineering, product, data and marketing, below Head level, up to £70k.",
      price: gbp(k(TIER_FEE.generalist)),
      per: ret ? "per hire, retained" : "per hire",
      points: [...INCLUDED, payLine],
      cta: { label: "Start a brief", plan: "permanent" },
    },
    {
      id: "specialist",
      name: "Specialist",
      who: "The hires that move revenue, and senior hires: UA, growth, monetisation, live-ops and economy at Lead level and up, any Head+ role, or £70k+.",
      price: `from ${gbp(k(TIER_FEE.specialist))}`,
      per: ret ? "per hire, retained" : "per hire",
      extraTitle: "Everything in Generalist, plus",
      points: ["A short market map of who's out there, with the shortlist", "Shortlist calibrated with you before outreach starts", "Salary benchmarking for the role", "Head, VP and C-level: fee confirmed within one working day", payLine],
      cta: { label: "Start a brief", plan: "permanent" },
      featured: "For the hires that move revenue",
    },
    {
      id: "batch",
      name: "Batch",
      who: "2 to 5 permanent roles at once, any mix of generalist and specialist.",
      price: `from ${gbp(k(TIER_FLOOR.generalist))}`,
      per: ret ? "per hire, retained" : "per hire",
      points: ["Each hire £1,000 less than the one before, down to a floor", "Each role gets its own search week and 5 candidates", "Mix generalist and specialist roles", "Pay only for the hires you make", payLine],
      cta: { label: "Start a batch", plan: "batch" },
    },
  ];
}

export function PricingCards({ candidate }: { candidate?: string }) {
  const [kind, setKind] = useState<Kind>("permanent");
  const [pay, setPay] = useState<PayWhen>("success");
  const retainedOk = kind === "permanent";
  const shown = retainedOk ? pay : "success";

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
          ? "Contractors are billed monthly while they're engaged, so there's no retainer."
          : shown === "success"
            ? "Nothing up front. You pay when your hire starts."
            : `A third up front when you sign, the rest as each hire starts, and ${RETAINED_OFF * 100}% off.`}
      </p>

      <div className={`${base.grid} ${base.grid3}`}>
        {cards(kind, shown).map((c) => (
          <article key={c.id} className={`card-shadow ${base.card} ${c.featured ? base.featured : ""}`}>
            {c.featured && <span className={base.badge}>{c.featured}</span>}
            <h3 className={base.name}>{c.name}</h3>
            <p className={base.price}>
              {c.price}
              <span className={base.per}> {c.per}</span>
            </p>
            {c.note && <p className={styles.note}>{c.note}</p>}
            <p className={base.blurb}>{c.who}</p>
            {c.id === "batch" && kind === "permanent" && (
              <div className={styles.ladders}>
                {(["generalist", "specialist"] as const).map((t) => (
                  <div key={t} className={styles.ladderRow}>
                    <span>{t === "generalist" ? "Generalist" : "Specialist"}</span>
                    <b>{ladder(t).map((f) => gbpK(shown === "retained" ? retainedFee(f) : f)).join(" → ")}</b>
                  </div>
                ))}
              </div>
            )}
            {c.extraTitle && <p className={styles.extraTitle}>{c.extraTitle}</p>}
            <ul className={base.points}>
              {c.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className={base.ctaRow}>
              <Button href={startHref(c.cta.plan, candidate, retainedOk ? shown : undefined)} variant={c.featured ? "primary" : "ghost"} arrow className={base.cta}>
                {c.cta.label}
              </Button>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.draft}>Mockup: contractor prices (£1,000 / £1,500 a month, 10% off in a batch) and the specialist extras are drafts.</p>
    </>
  );
}
