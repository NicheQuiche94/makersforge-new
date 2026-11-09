"use client";

import { CURRENCIES, CURRENCY_SYMBOLS, type Currency } from "@/lib/currency";
export { useCurrency } from "@/lib/useCurrency";
import base from "./PlanCards.module.css";
import styles from "./PricingCards.module.css";

/** The site-wide £ / € / $ toggle (Andre 2026-11-09). */
export function CurrencyToggle({ cur, setCur, className = "" }: { cur: Currency; setCur: (c: Currency) => void; className?: string }) {
  return (
    <div className={`${base.payToggle} ${styles.curToggle} ${className}`} role="group" aria-label="Currency">
      {CURRENCIES.map((c) => (
        <button key={c} type="button" className={cur === c ? base.payOn : ""} aria-pressed={cur === c} onClick={() => setCur(c)} title={c}>
          {CURRENCY_SYMBOLS[c]}
        </button>
      ))}
    </div>
  );
}
