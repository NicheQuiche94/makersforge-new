"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/** Mount once near the top of the layout to activate scroll-reveal targets. */
export function ScrollRevealRoot() {
  useScrollReveal();
  return null;
}
