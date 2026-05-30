"use client";

import { useId } from "react";

type ArrowDoodleProps = {
  /** Pixel width of the SVG. Height auto-scales. */
  size?: number;
  /** Bright gradient (for dark surfaces) or standard heat-text (for light). */
  bright?: boolean;
  /** Mirror horizontally — flips the curve direction. */
  flip?: boolean;
  className?: string;
};

/**
 * Hand-drawn-looking arrow doodle. Used as a typographic marker pointing
 * at emphasised words in poster-style headlines (per the visual
 * references Andre shared for the Statement section).
 *
 * The path is a single hand-drawn curve + arrowhead, stroked with the
 * Heat gradient.
 */
export function ArrowDoodle({
  size = 80,
  bright = false,
  flip = false,
  className,
}: ArrowDoodleProps) {
  const gradientId = useId();
  const stops = bright
    ? [
        { offset: "0%", color: "#FFE0B0" },
        { offset: "50%", color: "#FFB347" },
        { offset: "100%", color: "#FF8A3C" },
      ]
    : [
        { offset: "0%", color: "#FFB347" },
        { offset: "50%", color: "#FF5D00" },
        { offset: "100%", color: "#FF3C00" },
      ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      width={size}
      height={(size * 120) / 100}
      aria-hidden="true"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {stops.map((s) => (
            <stop
              key={s.offset}
              offset={s.offset}
              stopColor={s.color}
            />
          ))}
        </linearGradient>
      </defs>
      {/* Main curve — starts top-left, sweeps down-right */}
      <path
        d="M 18 12 C 30 35, 32 60, 55 82 C 65 90, 72 95, 80 100"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead — two short strokes forming a chevron at the tip */}
      <path
        d="M 80 100 L 68 96 M 80 100 L 76 88"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
