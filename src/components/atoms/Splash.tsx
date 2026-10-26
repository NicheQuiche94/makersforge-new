/**
 * Brand splash (2026-10-27): the MakersForge hexagon draws itself around,
 * each side in a discipline colour from the Talent Directory tiles, then
 * the anvil lands and the overlay fades away.
 *
 * Corners: one continuous mitred outline, drawn six times, each copy
 * clipped to a wedge from the centre through its two corners. So colour
 * changes are straight cuts through the corners, matching the mark
 * (Andre: no rounded line ends).
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
// Side i runs V[i] -> V[i+1].
const COLOURS = ["#ff5d00", "#f5b300", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

const out = (p: number[]) => [C[0] + (p[0] - C[0]) * 1.5, C[1] + (p[1] - C[1]) * 1.5];
const wedge = (i: number) => [C, out(V[i]), out(V[(i + 1) % 6])].map((p) => p.join(",")).join(" ");

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
            {COLOURS.map((_, i) => (
              <clipPath key={i} id={`mf-side-${i}`}>
                <polygon points={wedge(i)} />
              </clipPath>
            ))}
          </defs>
          {COLOURS.map((colour, i) => (
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
