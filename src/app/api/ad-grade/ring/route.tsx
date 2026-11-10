import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * GET ?s=36&t=bad (Ashley's QA 2026-11-10): the part-filled score ring as a PNG,
 * so the email can show it like the PDF does. Email clients can't draw a
 * conic ring in CSS, and Gmail won't show SVG, hence a rendered image.
 */
export const runtime = "nodejs";

const TONE: Record<string, string> = { great: "#16a34a", good: "#65a30d", warn: "#f59e0b", bad: "#ef4444" };
const SIZE = 240; // drawn at 2x, shown at 120px

function ringSvg(score: number, color: string) {
  const r = 100, cx = 120, cy = 120, w = 20;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const track = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eeeae4" stroke-width="${w}"/>`;
  let arc = "";
  if (pct >= 1) arc = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
  else if (pct > 0) {
    const a = pct * 2 * Math.PI - Math.PI / 2;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    arc = `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${track}${arc}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const score = Math.round(Number(u.searchParams.get("s")) || 0);
  const color = TONE[u.searchParams.get("t") || ""] || TONE.bad;
  const calSans = await readFile(join(process.cwd(), "node_modules/@fontsource/cal-sans/files/cal-sans-latin-400-normal.woff"));
  return new ImageResponse(
    (
      <div style={{ width: SIZE, height: SIZE, display: "flex", position: "relative", alignItems: "center", justifyContent: "center", background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ringSvg(score, color)} width={SIZE} height={SIZE} style={{ position: "absolute", top: 0, left: 0 }} alt="" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontFamily: "Cal Sans", fontSize: 78, lineHeight: 1, color: "#0e0f11" }}>{score}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#5b5f69", marginTop: 6 }}>/ 100</div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE, fonts: [{ name: "Cal Sans", data: calSans, weight: 400, style: "normal" }], headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
