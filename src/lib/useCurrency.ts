"use client";

import { useEffect, useState } from "react";
import { CURRENCY_EVENT, DEFAULT_CURRENCY, currencyForCountry, currencyKnown, readStoredCurrency, writeGeoCurrency, writeStoredCurrency, type Currency } from "@/lib/currency";

let asked = false;
/** Once per browser: guess the currency from the visitor's country. */
function guessOnce() {
  if (asked || currencyKnown()) return;
  asked = true;
  fetch("/api/geo")
    .then((r) => r.json())
    .then((d: { country?: string | null }) => writeGeoCurrency(currencyForCountry(d.country)))
    .catch(() => undefined);
}

/**
 * The site-wide £ / € / $ choice. Every price that uses this follows the
 * toggle on any page, and the choice is remembered (lib/currency).
 */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [cur, setCur] = useState<Currency>(DEFAULT_CURRENCY);
  useEffect(() => {
    const sync = () => setCur(readStoredCurrency());
    sync();
    guessOnce();
    window.addEventListener(CURRENCY_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CURRENCY_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return [cur, writeStoredCurrency];
}
