"use client";

import { usePathname } from "next/navigation";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * Mount once near the top of the layout to activate scroll-reveal
 * targets. We pass `pathname` as the retrigger key so the observer
 * rebuilds on every client-side navigation. Without that, the
 * observer fires once on initial mount and never sees the elements
 * rendered by subsequent Next.js page transitions — which makes
 * `.reveal` elements stick at opacity 0 forever after navigation.
 */
export function ScrollRevealRoot() {
  const pathname = usePathname();
  useScrollReveal(undefined, pathname);
  return null;
}
