/**
 * The deal, worked out on the server from what the client picked. The browser
 * shows the same numbers (plans.ts), but a booking is only ever saved with
 * prices computed here, so nothing a client sends can change what they pay.
 */
import { BATCH_MAX, BATCH_STEPS, SINGLE_FEE, batchSteps, retainedFee, retainedPrice, type PlanId } from "@/lib/plans";

export type Deal = {
  plan: PlanId;
  retained: boolean;
  roles: number;
  /** £ per hire in the order hires are made (contract: £ per month per contractor). */
  fees: number[];
  /** £ due on signing, 0 unless retained. */
  retainer: number;
};

/** discountPct: a Christmas gift code (lib/compareGifts), taken off the first hire's fee (contract: the first month). */
export function priceDeal(plan: PlanId, retainedAsked: boolean, rolesAsked: number, discountPct = 0): Deal {
  const retained = retainedAsked && plan !== "contract";
  const off = (f: number) => Math.round(f * (1 - discountPct / 100));
  if (plan === "contract") {
    const fees = Array(Math.max(1, rolesAsked)).fill(1_000);
    fees[0] = off(fees[0]);
    return { plan, retained: false, roles: fees.length, fees, retainer: 0 };
  }
  const roles = plan === "batch" ? Math.min(Math.max(rolesAsked, 2), BATCH_MAX) : Math.max(1, rolesAsked);
  const full = plan === "batch" ? batchSteps(roles) : Array(roles).fill(SINGLE_FEE);
  full[0] = off(full[0]);
  const total = full.reduce((a, b) => a + b, 0);
  return {
    plan,
    retained,
    roles,
    fees: full.map((f) => Math.round(retained ? retainedFee(f) : f)),
    retainer: retained ? retainedPrice(total).upfront : 0,
  };
}

/** What a hire is invoiced at, given the fees before it and the retainer: the retainer pays for the first hires until it runs out. */
export function hireInvoice(deal: Pick<Deal, "fees" | "retainer">, hiresBefore: number) {
  const fee = deal.fees[hiresBefore] ?? deal.fees[deal.fees.length - 1] ?? BATCH_STEPS[BATCH_STEPS.length - 1];
  const used = deal.fees.slice(0, hiresBefore).reduce((a, b) => a + b, 0);
  const credit = Math.max(0, deal.retainer - used);
  return { fee, credit: Math.min(credit, fee), invoice: Math.max(0, fee - credit) };
}
