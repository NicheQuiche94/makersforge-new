import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Default social preview card (1200×630), used for every page that doesn't
 * define its own. Rebuilt 2026-10-27 to match the live hero: Cal Sans, the
 * white MakersForge logo, "500 candidates to 5." and the job-ad line
 * (the old card was plain sans-serif text with the retired headline).
 */
export const alt =
  "MakersForge: 500 candidates to 5. Recruitment for mobile games and apps.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The brand SVGs ship black-on-orange-hex; recolour to white for the card. */
async function whiteSvg(file: string) {
  const svg = await readFile(join(process.cwd(), "public/images", file), "utf8");
  const white = svg.replace(/fill:\s*#000;?/g, "fill: #fff;").replace(/stroke:\s*#f0532d;?/g, "stroke: #fff;");
  return `data:image/svg+xml;base64,${Buffer.from(white).toString("base64")}`;
}

export default async function OpengraphImage() {
  const [calSans, logo, mark] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/@fontsource/cal-sans/files/cal-sans-latin-400-normal.woff")),
    whiteSvg("Full Logo white.svg"),
    whiteSvg("Logo W.svg"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px 60px",
          position: "relative",
          background:
            "radial-gradient(ellipse 70% 90% at 85% 100%, rgba(255,190,90,0.55), transparent 70%), linear-gradient(135deg, #FF8A00 0%, #FF4A00 55%, #E03A00 100%)",
          color: "#ffffff",
          fontFamily: "Cal Sans",
        }}
      >
        {/* Ghost hex, bottom-right, like the site hero */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mark}
          width={330}
          height={357}
          style={{ position: "absolute", right: -40, bottom: -50, opacity: 0.14 }}
          alt=""
        />

        {/* Logo: the SVG's artwork sits inside padding, so crop with a frame */}
        <div style={{ display: "flex", width: 345, height: 78, overflow: "hidden", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            width={424}
            height={175}
            style={{ position: "absolute", left: -62, top: -44 }}
            alt=""
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, lineHeight: 1, letterSpacing: -5 }}>500 candidates to 5.</div>
          <div style={{ display: "flex", fontSize: 40, marginTop: 30, letterSpacing: -0.8, opacity: 0.96 }}>
            A job ad gets you 500 CVs to sift through.
          </div>
          <div style={{ display: "flex", fontSize: 30, marginTop: 10, letterSpacing: -0.3, opacity: 0.86, maxWidth: 900 }}>
            We hand you a shortlist of 5, in 5 working days.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, letterSpacing: -0.2, opacity: 0.85 }}>
          makersforge.gg · Recruitment for mobile games &amp; apps
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cal Sans", data: calSans, weight: 400, style: "normal" }] },
  );
}

