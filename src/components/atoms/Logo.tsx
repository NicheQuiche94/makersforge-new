"use client";

import { useId } from "react";

type Variant = "full" | "mark";

type LogoProps = {
  /** Height in pixels. Width auto-scales from the SVG aspect ratio. */
  size?: number;
  /** "full" = hex + MF + MAKERSFORGE wordmark (default). "mark" = hex + MF only. */
  variant?: Variant;
  /** Override the wordmark fill. Default = currentColor. */
  wordmarkColor?: string;
  /** Override the MF inner mark fill. Default = white. */
  markColor?: string;
  /** Bypass the Heat gradient on the hex fill for a flat colour. */
  monochrome?: string;
  className?: string;
  title?: string;
};

/**
 * MakersForge logo — inlined from `Full Logo white.svg` (full variant) and
 * `Logo W.svg` (mark variant).
 *
 * Treatment:
 * - Hex: full Heat gradient FILL (no stroke).
 * - MF inner mark: white by default — sits on top of the gradient hex.
 * - MAKERSFORGE wordmark: currentColor — sits outside the hex and inherits
 *   the container's text colour (ink on light surfaces, white on dark).
 *
 * `useId()` gives each instance a unique gradient ID so multiple logos
 * on the same page don't collide.
 *
 * Sizing is by HEIGHT (the wordmark makes width-based sizing awkward).
 * Default 24px.
 */
export function Logo({
  size = 24,
  variant = "full",
  wordmarkColor,
  markColor,
  monochrome,
  className,
  title = "MakersForge",
}: LogoProps) {
  const gradientId = useId();
  const hexFill = monochrome ?? `url(#${gradientId})`;
  const innerMark = markColor ?? "#fff";
  const wordmark = wordmarkColor ?? "currentColor";

  const VB = {
    full: { x: 115, y: 75, w: 600, h: 155 },
    mark: { x: -3, y: -3, w: 203, h: 219 },
  }[variant];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      width={(size * VB.w) / VB.h}
      height={size}
      role="img"
      aria-label={title}
      className={className}
    >
      {!monochrome && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="28%" stopColor="#FF7A2B" />
            <stop offset="55%" stopColor="#FF5D00" />
            <stop offset="78%" stopColor="#FF3C00" />
            <stop offset="100%" stopColor="#C72E00" />
          </linearGradient>
        </defs>
      )}

      {/* 1. Hex — full gradient fill, sits at the bottom of the stack */}
      {variant === "mark" ? (
        <polygon
          fill={hexFill}
          points="193.25 157.74 193.25 55.23 98.38 3.98 3.5 55.23 3.5 157.74 98.38 209 193.25 157.74"
        />
      ) : (
        <polygon
          fill={hexFill}
          points="249.7 186.35 249.7 119.05 187.42 85.41 125.13 119.05 125.13 186.35 187.42 220 249.7 186.35"
        />
      )}

      {/* 2. MF inner mark — white on top of the gradient hex */}
      {variant === "mark" ? (
        <MarkInner fill={innerMark} />
      ) : (
        <MarkInnerFull fill={innerMark} />
      )}

      {/* 3. Wordmark — only in the full variant, outside the hex */}
      {variant === "full" && <Wordmark fill={wordmark} />}
    </svg>
  );
}

/* ============================================================
   Path data — inlined from the source SVGs.
   ============================================================ */

function MarkInner({ fill }: { fill: string }) {
  return (
    <polygon
      fill={fill}
      points="140.93 90.75 140.93 103.83 157.95 103.83 174.97 116.91 140.93 116.91 140.93 129.99 123.91 116.91 123.91 90.75 72.84 90.75 106.89 116.91 89.86 129.99 140.93 129.99 140.93 143.06 55.82 143.06 89.86 116.91 72.84 103.83 55.82 103.83 21.78 77.67 174.97 77.67 174.97 103.83 157.95 90.75 140.93 90.75"
    />
  );
}

function MarkInnerFull({ fill }: { fill: string }) {
  return (
    <polygon
      fill={fill}
      points="215.35 142.37 215.35 150.96 226.53 150.96 237.7 159.54 215.35 159.54 215.35 168.13 204.18 159.54 204.18 142.37 170.66 142.37 193.01 159.54 181.83 168.13 215.35 168.13 215.35 176.71 159.48 176.71 181.83 159.54 170.66 150.96 159.48 150.96 137.14 133.78 237.7 133.78 237.7 150.96 226.53 142.37 215.35 142.37"
    />
  );
}

function Wordmark({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      {/* MAKERS letters */}
      <polygon points="264.14 132.97 264.14 173.18 269.75 173.18 269.75 150.6 284.83 172.58 299.91 150.6 299.91 173.18 305.52 173.18 305.52 132.97 284.83 163.12 264.14 132.97" />
      <polygon points="314.77 173.18 321.1 173.18 335.01 143.45 348.91 173.18 355.24 173.18 335.01 132.22 314.77 173.18" />
      <polygon points="387.2 132.98 369.93 157.22 369.93 132.98 364.33 132.98 364.33 173.18 369.93 173.18 369.93 160.11 385.3 173.18 393.73 173.18 376.85 158.41 394.3 132.98 387.2 132.98" />
      <polygon points="403.86 173.18 425.56 173.18 425.56 167.73 409.46 167.73 409.46 155.8 422.28 155.8 425.08 150.35 409.46 150.35 409.46 138.43 425.56 138.43 425.56 132.98 403.86 132.98 403.86 173.18" />
      <path d="M458.29,158.84c2.22-.56,4.24-1.71,5.99-3.41,2.63-2.56,3.97-5.69,3.97-9.3s-1.33-6.74-3.97-9.3c-2.63-2.56-5.85-3.85-9.57-3.85h-17.11v40.2h5.61v-34.75h11.5c2.18,0,4.06.76,5.6,2.26,1.54,1.5,2.32,3.33,2.32,5.44s-.78,3.95-2.32,5.45c-1.54,1.5-3.43,2.26-5.6,2.26h-4.01v5.92l11.53,13.43h6.93l-12.04-14.04,1.18-.3Z" />
      <path d="M501.44,158.34c-.84-1.51-2.05-2.89-3.61-4.11-1.61-1.25-3.47-2.46-5.53-3.6l-1.68-.9c-1.32-.7-2.5-1.38-3.51-2-1.07-.66-1.88-1.33-2.39-2-.57-.73-.86-1.52-.86-2.35,0-.25.01-.41.04-.55.17-1.54.99-2.77,2.44-3.63,1.36-.8,2.82-1.21,4.36-1.21h.2c.3,0,.63.02.96.06,1.59.18,3.05.73,4.33,1.63.26.2.52.43.78.67l2.82-4.71c-.08-.07-.17-.14-.25-.2-1.87-1.44-4.26-2.32-7.12-2.61-.54-.07-1.06-.1-1.54-.1h-.47c-1.63,0-3.2.26-4.65.77-2.07.7-3.78,1.8-5.1,3.28-1.3,1.46-2.09,3.25-2.33,5.33-.04.33-.06.65-.08.96v.12c0,1.04.18,1.99.53,2.84.45,1.15,1.1,2.17,1.94,3.04.87.9,1.86,1.72,2.95,2.43,1.13.73,2.28,1.41,3.43,2.03l.47.3c.53.28,1.11.6,1.67.93.46.25.92.52,1.38.79,1.15.68,2.22,1.42,3.15,2.18.96.79,1.7,1.57,2.2,2.32.55.82.82,1.68.82,2.57l-.03.49c-.2,1.72-1.14,2.99-2.8,3.79-1.52.73-3.17,1.1-4.92,1.1h-.25c-.44,0-.89-.03-1.36-.09-1.6-.18-3.08-.61-4.4-1.3l-2.88,4.81c1.88.98,4.09,1.6,6.57,1.87.69.09,1.34.13,1.95.13h.53c1.79,0,3.49-.24,5.04-.73,2.26-.7,4.13-1.84,5.56-3.38,1.41-1.53,2.26-3.44,2.52-5.68.05-.36.08-.7.08-1.03v-.24c0-1.48-.32-2.83-.95-4.02Z" />

      {/* FORGE letters */}
      <polygon points="520.31 140.76 534.87 140.76 534.87 133.29 512.84 133.29 512.84 173.11 520.31 173.11 520.31 156.94 533.14 156.94 535.01 149.47 520.31 149.47 520.31 140.76" />
      <path d="M564.83,133.29c-5.47,0-10.21,1.96-14.08,5.83-3.87,3.87-5.83,8.61-5.83,14.08s1.96,10.21,5.83,14.08,8.61,5.83,14.08,5.83,10.21-1.96,14.08-5.83c3.87-3.87,5.83-8.61,5.83-14.08s-1.96-10.21-5.83-14.08c-3.87-3.87-8.6-5.83-14.08-5.83ZM577.27,153.2c0,3.42-1.23,6.38-3.64,8.79-2.42,2.42-5.38,3.64-8.79,3.64s-6.38-1.23-8.79-3.64c-2.42-2.42-3.65-5.38-3.65-8.79s1.23-6.38,3.65-8.79c2.42-2.42,5.38-3.64,8.79-3.64s6.38,1.23,8.79,3.64c2.42,2.42,3.64,5.38,3.64,8.79Z" />
      <path d="M622.33,156.23c2.61-2.61,3.94-5.81,3.94-9.5s-1.33-6.89-3.94-9.5c-2.61-2.61-5.81-3.94-9.5-3.94h-16.67v39.82h7.47v-32.35h9.2c1.66,0,3.04.57,4.22,1.75,1.18,1.18,1.75,2.56,1.75,4.22s-.57,3.04-1.75,4.22c-1.18,1.18-2.56,1.75-4.22,1.75h-4.83v7.47h.27l10.79,12.94h9.39l-11.34-13.6c1.92-.63,3.68-1.73,5.22-3.27Z" />
      <path d="M655.61,156.94h8.39v8.7h-7.59c-3.42,0-6.38-1.23-8.79-3.64-2.42-2.42-3.64-5.38-3.64-8.79s1.23-6.38,3.64-8.79c2.42-2.42,5.38-3.64,8.79-3.64h8.39l3.73-7.47h-12.13c-5.47,0-10.21,1.96-14.08,5.83-3.87,3.87-5.83,8.61-5.83,14.08s1.96,10.21,5.83,14.08,8.61,5.83,14.08,5.83h15.06v-23.64h-12.13l-3.73,7.47Z" />
      <polygon points="690.41 156.94 701.54 156.94 705.27 149.47 690.41 149.47 690.41 140.76 704.97 140.76 704.97 133.29 682.94 133.29 682.94 173.11 704.97 173.11 704.97 165.64 690.41 165.64 690.41 156.94" />
    </g>
  );
}
