"use client";

import { usePathname } from "next/navigation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Splash } from "./Splash";

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
  // Brand splash rides along here so it needs no layout change. This
  // component persists across client navigations, so the CSS animation
  // only ever plays on a full page load (and once per session, see Splash).
  return <Splash />;
}
