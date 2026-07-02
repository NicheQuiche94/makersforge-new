/**
 * Currency utilities for the lineup.
 *
 * Profiles store all monetary values in GBP (rateMin, salaryAnnual).
 * Display converts to whichever currency the user has selected on the
 * lineup toolbar. The choice persists in localStorage so it carries
 * across navigations (lineup ↔ spec page) and revisits.
 *
 * Three currencies cover roughly the studios we work with; anyone
 * outside this set can mental-math their own conversion.
 *
 * Exchange rates are constants for now — accurate to within a couple
 * of percent against mid-2026 mid-market rates. Bump them periodically
 * if the gap drifts; live API quotes would add network failure modes
 * for marginal accuracy gain.
 */

export type Currency = "GBP" | "EUR" | "USD";

export const CURRENCIES: Currency[] = ["GBP", "EUR", "USD"];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  EUR: "€",
  USD: "$",
};

/* 1 GBP = X target. Update when mid-market drifts. */
export const RATES: Record<Currency, number> = {
  GBP: 1,
  EUR: 1.18,
  USD: 1.27,
};

const STORAGE_KEY = "makersforge-currency";

export function isCurrency(v: unknown): v is Currency {
  return v === "GBP" || v === "EUR" || v === "USD";
}

export function readStoredCurrency(): Currency {
  if (typeof window === "undefined") return "GBP";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isCurrency(saved) ? saved : "GBP";
}

export function writeStoredCurrency(c: Currency): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, c);
}

/**
 * Format a GBP amount as the user's selected currency with a "/ period"
 * suffix. Rounds to whole units; thousands separators via Intl.
 *
 * With `maxInGbp` supplied and different from the min, renders as a
 * range using ' to ' (no dashes — Andre's site rule kills all em/en
 * dashes site-wide, and 'to' reads cleaner than the hyphen anyway).
 *
 * formatRate(500, "EUR", "day")                    // "€590 / day"
 * formatRate(60000, "USD", "year")                 // "$76,200 / year"
 * formatRate(80000, "GBP", "year", 120000)         // "£80,000 to £120,000 / year"
 */
export function formatRate(
  amountInGbp: number,
  currency: Currency,
  period: "day" | "year",
  maxInGbp?: number,
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const rate = RATES[currency];
  const convert = (n: number) =>
    new Intl.NumberFormat("en-GB").format(Math.round(n * rate));

  if (maxInGbp === undefined || maxInGbp === amountInGbp) {
    return `${symbol}${convert(amountInGbp)} / ${period}`;
  }
  return `${symbol}${convert(amountInGbp)} to ${symbol}${convert(maxInGbp)} / ${period}`;
}
