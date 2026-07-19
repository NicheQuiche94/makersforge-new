import { ImageResponse } from "next/og";

/**
 * Default social preview card (1200×630), used for every page that doesn't
 * define its own. Text-based on the Heat gradient so it needs no font files
 * (keeps the build robust) while staying on-brand.
 */
export const alt =
  "MakersForge — the home for growth teams in games and apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "76px 80px",
          background:
            "linear-gradient(135deg, #FF8A3C 0%, #FF5D00 46%, #C72E00 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          MakersForge
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            The home for growth teams in games and apps
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              opacity: 0.92,
              maxWidth: 860,
            }}
          >
            Representation, recruitment and a free job board for UA, growth and
            marketing-art talent.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, opacity: 0.85 }}>
          makersforge.gg
        </div>
      </div>
    ),
    { ...size },
  );
}
