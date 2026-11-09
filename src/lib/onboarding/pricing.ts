/**
 * The deal, worked out on the server from what the client picked. The browser
 * shows the same numbers (plans.ts), but a booking is only ever saved with
 * prices computed here, so nothing a client sends can change what they pay.
 *
 * Three tiers (2026-11-09): each role's tier is the level in its job title
 * (lib/tier), worked out here again on the server, never taken from the
 * browser. No hire is ever below £7,000, whatever discounts apply.
 */
import { BATCH_MAX, FEE_FLOOR, priceList, type PlanId } from "@/lib/plans";
import type { Currency } from "@/lib/currency";
import { tierFor, type Tier } from "@/lib/tier";

export type Deal = {
  plan: PlanId;
  /** Every amount in this deal is in this currency (pricing in plans.priceList). */
  currency: Currency;
  retained: boolean;
  roles: number;
  /** One per role, in order. */
  tiers: Tier[];
  /** £ per hire in the order hires are made (contract: £ per month per contractor, by tier). */
  fees: number[];
  /** £ due on signing, 0 unless retained. */
  retainer: number;
};

/** The tier of each role from its brief's job title. Roles without a brief yet count as Team. */
export const tiersFromBriefs = (briefs: { title?: string }[], roles: number): Tier[] =>
  Array.from({ length: roles }, (_, i) => (briefs[i] ? tierFor(briefs[i].title).tier : "team"));

/** discountPct: a Christmas gift code (lib/compareGifts), taken off the first hire's fee (contract: the first month). */
export function priceDeal(plan: PlanId, retainedAsked: boolean, rolesAsked: number, discountPct = 0, tiersAsked: Tier[] = [], currency: Currency = "GBP"): Deal {
  const L = priceList(currency);
  const retained = retainedAsked && plan !== "contract";
  if (plan === "contract") {
    const tiers = Array.from({ length: Math.max(1, rolesAsked) }, (_, i): Tier => tiersAsked[i] ?? "team");
    const fees = tiers.map((t) => L.contract[t]);
    fees[0] = Math.round(fees[0] * (1 - discountPct / 100));
    return { plan, currency, retained: false, roles: fees.length, tiers, fees, retainer: 0 };
  }
  const batch = plan === "batch";
  const roles = batch ? Math.min(Math.max(rolesAsked, 2), BATCH_MAX) : Math.max(1, rolesAsked);
  const tiers = Array.from({ length: roles }, (_, i) => tiersAsked[i] ?? "team");
  const fees = tiers.map((t, i) => L.fee(t, batch ? i : 0, { batch, retained, discountPct: i === 0 ? discountPct : 0 }));
  const total = fees.reduce((a, b) => a + b, 0);
  return { plan, currency, retained, roles, tiers, fees, retainer: retained ? Math.round(total / 3 / 100) * 100 : 0 };
}

/** What a hire is invoiced at, given the fees before it and the retainer: the retainer pays for the first hires until it runs out. */
export function hireInvoice(deal: Pick<Deal, "fees" | "retainer">, hiresBefore: number) {
  const fee = deal.fees[hiresBefore] ?? deal.fees[deal.fees.length - 1] ?? FEE_FLOOR;
  const used = deal.fees.slice(0, hiresBefore).reduce((a, b) => a + b, 0);
  const credit = Math.max(0, deal.retainer - used);
  return { fee, credit: Math.min(credit, fee), invoice: Math.max(0, fee - credit) };
}
