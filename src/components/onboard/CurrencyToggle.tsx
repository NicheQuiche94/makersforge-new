"use client";

import { useEffect, useState } from "react";
import { CURRENCIES, CURRENCY_SYMBOLS, readStoredCurrency, writeStoredCurrency, type Currency } from "@/lib/currency";
import base from "./PlanCards.module.css";
import styles from "./PricingCards.module.css";

/**
 * The site-wide £ / € / $ choice (Andre 2026-11-09). It's stored in the
 * browser (lib/currency), so pricing, the booking flow, the talent
 * directory and /compare all open in the currency picked last.
 */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [cur, setCur] = useState<Currency>("GBP");
  // The saved choice is only readable in the browser, after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setCur(readStoredCurrency()), []);
  return [
    cur,
    (c) => {
      setCur(c);
      writeStoredCurrency(c);
    },
  ];
}

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
