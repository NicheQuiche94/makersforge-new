"use client";

import { useEffect } from "react";

/**
 * Observes elements matching `selector` and adds `.in` (and the legacy
 * `.in-view`) once they enter the viewport at 15% threshold.
 *
 * Default selector covers both:
 *   - `.reveal` (v4 brief, fade-up + 28px translate + 0.9s)
 *   - `.scroll-reveal` (legacy from earlier briefs)
 *
 * Honours prefers-reduced-motion: marks every target visible immediately
 * and skips the observer entirely.
 */
export function useScrollReveal(
  selector: string = ".reveal, .scroll-reveal",
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      targets.forEach((el) => {
        el.classList.add("in");
        el.classList.add("in-view");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);
}
