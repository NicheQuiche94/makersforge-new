/**
 * Brand splash (2026-10-27): the MakersForge hexagon draws itself around
 * in the six discipline colours as one continuous sweep (same as the
 * spectrum rings on the site), then the anvil lands and the overlay fades.
 *
 * Corners: one continuous mitred outline (square corners, matching the
 * mark), coloured as a continuous sweep like the site rings (see below).
 *
 * Pure CSS so it never blocks the page if JS is slow. Shown once per
 * browser session and never with prefers-reduced-motion: the inline script
 * hides it before first paint in those cases (it adds a <style> to <head>,
 * which React leaves alone). pointer-events: none throughout.
 */
import styles from "./Splash.module.css";

// Hexagon corners from Logo W.svg (viewBox 0 0 196.75 212.97), clockwise
// from the top.
const C = [98.38, 106.49]; // centre
const V = [
  [98.38, 3.98], // top
  [193.25, 55.23], // upper right
  [193.25, 157.74], // lower right
  [98.38, 209], // bottom
  [3.5, 157.74], // lower left
  [3.5, 55.23], // upper left
];
// Continuous colour sweep, matching the CSS conic-gradient rings used on
// the site (from 0deg = top, clockwise). SVG has no conic gradient, so the
// outline is drawn SLICES times, each copy clipped to a thin angular wedge
// in its own interpolated colour: reads as one smooth blend everywhere.
const STOPS = ["#ff5d00", "#f5b300", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#ff5d00"];
const SLICES = 120;
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function colourAt(t: number) {
  const x = t * (STOPS.length - 1);
  const i = Math.min(Math.floor(x), STOPS.length - 2);
  const a = hex(STOPS[i]);
  const b = hex(STOPS[i + 1]);
  const k = x - i;
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(",")})`;
}
const R = 200; // well outside the hexagon
const at = (deg: number) => {
  const r = (deg * Math.PI) / 180;
  // Rounded: server (Node) and browser trig differ in the last digits,
  // which would otherwise cause a hydration mismatch.
  return [+(C[0] + R * Math.sin(r)).toFixed(2), +(C[1] - R * Math.cos(r)).toFixed(2)];
};
// Each wedge overlaps the next by a hair so no seams show.
const wedge = (i: number) =>
  [C, at((i * 360) / SLICES - 0.3), at(((i + 1) * 360) / SLICES + 0.3)].map((p) => p.join(",")).join(" ");
const SLICE_COLOURS = Array.from({ length: SLICES }, (_, i) => colourAt((i + 0.5) / SLICES));

// Start mid-way along the last (pink) side so the dash seam sits in the
// middle of a side, never on a corner.
const mid = [(V[5][0] + V[0][0]) / 2, (V[5][1] + V[0][1]) / 2];
const HEX = `M${mid} L${V.map((p) => p.join(",")).join(" L")} Z`;

const SKIP = `try{var s=sessionStorage;if(s.getItem("mfSplash")||matchMedia("(prefers-reduced-motion: reduce)").matches){var t=document.createElement("style");t.textContent="#mf-splash{display:none!important}html:root{--hero-delay:0s}";document.head.appendChild(t)}else{s.setItem("mfSplash","1")}}catch(e){}`;

export function Splash() {
  return (
    <>
      {/* First visit: hero entrance waits for the splash (see HeroPanel). */}
      <style>{":root{--hero-delay:2.3s}"}</style>
      <div id="mf-splash" className={styles.splash} aria-hidden="true">
        <svg className={styles.mark} viewBox="-8 -8 213 229">
          <defs>
            {SLICE_COLOURS.map((_, i) => (
              <clipPath key={i} id={`mf-side-${i}`}>
                <polygon points={wedge(i)} />
              </clipPath>
            ))}
          </defs>
          {SLICE_COLOURS.map((colour, i) => (
            <path
              key={i}
              d={HEX}
              fill="none"
              stroke={colour}
              strokeWidth={9}
              strokeLinejoin="miter"
              strokeLinecap="butt"
              pathLength={6}
              clipPath={`url(#mf-side-${i})`}
              className={styles.hex}
            />
          ))}
          <polygon
            className={styles.anvil}
            points="140.93 90.75 140.93 103.83 157.95 103.83 174.97 116.91 140.93 116.91 140.93 129.99 123.91 116.91 123.91 90.75 72.84 90.75 106.89 116.91 89.86 129.99 140.93 129.99 140.93 143.06 55.82 143.06 89.86 116.91 72.84 103.83 55.82 103.83 21.78 77.67 174.97 77.67 174.97 103.83 157.95 90.75 140.93 90.75"
          />
        </svg>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SKIP }} />
    </>
  );
}
