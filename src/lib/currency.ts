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

/**
 * Default currency (Andre 2026-11-09, Europe first): euros, unless we can
 * tell the visitor is in the UK (pounds) or the US (dollars). Their own pick
 * on any toggle always wins. GEO_KEY caches the guess from /api/geo.
 */
export const DEFAULT_CURRENCY: Currency = "EUR";
const GEO_KEY = "makersforge-currency-geo";
/** Fired on window whenever the currency changes, so every price on the page follows. */
export const CURRENCY_EVENT = "mf-currency";

export const currencyForCountry = (cc?: string | null): Currency => (cc === "GB" || cc === "UK" ? "GBP" : cc === "US" ? "USD" : "EUR");

function safeGet(k: string) {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
}

export function readStoredCurrency(): Currency {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  const saved = safeGet(STORAGE_KEY);
  if (isCurrency(saved)) return saved;
  const geo = safeGet(GEO_KEY);
  return isCurrency(geo) ? geo : DEFAULT_CURRENCY;
}

/** True once we know the visitor's currency (their pick or the location guess). */
export const currencyKnown = () => typeof window !== "undefined" && (isCurrency(safeGet(STORAGE_KEY)) || isCurrency(safeGet(GEO_KEY)));

export function writeGeoCurrency(c: Currency): void {
  try {
    window.localStorage.setItem(GEO_KEY, c);
  } catch {}
  window.dispatchEvent(new Event(CURRENCY_EVENT));
}

export function writeStoredCurrency(c: Currency): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, c);
  } catch {}
  window.dispatchEvent(new Event(CURRENCY_EVENT));
}

/**
 * Format a GBP amount as the user's selected currency with a "/ period"
 * suffix. Rounds to a clean display unit so figures read as whole
 * numbers no matter which currency is picked:
 *
 *   period === "year" → nearest 1,000
 *   period === "day"  → nearest 10
 *
 * With `maxInGbp` supplied and different from the min, renders as a
 * range using ' to ' (no dashes — Andre's site rule kills all em/en
 * dashes site-wide, and 'to' reads cleaner than the hyphen anyway).
 *
 * formatRate(500, "EUR", "day")                    // "€600 / day"
 * formatRate(60000, "USD", "year")                 // "$76,000 / year"
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
  // Day rates round to 10 so a candidate's own figure survives the
  // conversion (€250 not €300, €160 not €150; 2026-10-29).
  const unit = period === "year" ? 1000 : 10;
  const convert = (n: number) => {
    const rounded = Math.round((n * rate) / unit) * unit;
    return new Intl.NumberFormat("en-GB").format(rounded);
  };

  if (maxInGbp === undefined || maxInGbp === amountInGbp) {
    return `${symbol}${convert(amountInGbp)} / ${period}`;
  }
  return `${symbol}${convert(amountInGbp)} to ${symbol}${convert(maxInGbp)} / ${period}`;
}
