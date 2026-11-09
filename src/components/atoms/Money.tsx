"use client";

import { priceList } from "@/lib/plans";
import { useCurrency } from "@/lib/useCurrency";

/**
 * A fixed pound figure in copy ("from £9,000"), shown in the visitor's
 * currency and rounded the same way as the price list: nearest 1,000 by
 * default, or 100 for small fees.
 */
export function Money({ gbp, unit = 1000 }: { gbp: number; unit?: number }) {
  const [cur] = useCurrency();
  const L = priceList(cur);
  return <>{L.fmt(L.convert(gbp, unit))}</>;
}
