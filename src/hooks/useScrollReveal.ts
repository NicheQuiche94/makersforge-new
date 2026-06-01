"use client";

import { useEffect } from "react";

/**
 * Observes elements matching `selector` and adds `.in` (and the legacy
 * `.in-view`) once they enter the viewport.
 *
 * Default selector covers both:
 *   - `.reveal` (v4 brief, fade-up + 28px translate + 0.9s)
 *   - `.scroll-reveal` (legacy from earlier briefs)
 *
 * `retriggerKey` lets callers force the effect to re-run when the
 * underlying DOM changes (e.g. on client-side navigation in Next.js
 * App Router — pass the current pathname). Without this, the observer
 * mounted once in the layout never sees the elements rendered by a
 * page transition, and those elements stay stuck at opacity 0.
 *
 * Honours prefers-reduced-motion: marks every target visible
 * immediately and skips the observer entirely.
 */
export function useScrollReveal(
  selector: string = ".reveal, .scroll-reveal",
  retriggerKey?: unknown,
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

    // Any element already in viewport at mount-time (top-of-page sections,
    // most legal-page content, etc.) gets revealed immediately. Without
    // this short-circuit, IntersectionObserver still fires asynchronously
    // for already-intersecting elements, but a missed first frame or a
    // page transition that lands mid-document can leave them stuck.
    const reveal = (el: Element) => {
      el.classList.add("in");
      el.classList.add("in-view");
    };

    const inViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return (
        rect.top < vh && rect.bottom > 0 && rect.left < vw && rect.right > 0
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px" },
    );

    targets.forEach((el) => {
      if (el.classList.contains("in")) return;
      if (inViewport(el)) {
        reveal(el);
        return;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selector, retriggerKey]);
}
