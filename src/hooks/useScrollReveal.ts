"use client";

import { useEffect } from "react";

/**
 * Adds the `.in-view` class to every element matching `selector`
 * when it enters the viewport (15% threshold).
 *
 * Honours prefers-reduced-motion: when reduced, every target is marked
 * in-view immediately and the observer is skipped.
 */
export function useScrollReveal(selector: string = ".scroll-reveal") {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector]);
}
