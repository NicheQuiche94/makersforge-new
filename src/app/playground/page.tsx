import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";

export const metadata: Metadata = {
  title: "Playground — MakersForge",
  description:
    "Internal component library reference. Every token, type role, button variant, and pattern in working context.",
  robots: { index: false, follow: false },
};

const PREVIEW_PROFILES = [
  {
    m: "ua·101",
    name: "senior ua manager",
    role: "ex-supercell",
    av: true,
    loc: "uk",
    rate: "£600–750",
    ctx: "£1m+/mo",
    ctxLabel: "budget",
  },
  {
    m: "art·204",
    name: "perf. creative lead",
    role: "ex-calm",
    av: true,
    loc: "eu remote",
    rate: "£500–650",
    ctx: "video · ugc",
    ctxLabel: "formats",
  },
  {
    m: "ua·114",
    name: "head of ua",
    role: "ex-rovio",
    av: false,
    loc: "helsinki",
    rate: "£700–850",
    ctx: "£1m+/mo",
    ctxLabel: "budget",
  },
];

export default function PlaygroundPage() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding: "180px 0 80px" }}>
        <div className="container">
          <p className="kicker kicker-mute">Phase 1 · Component playground</p>
          <h1
            className="display-section"
            style={{ marginTop: 24, maxWidth: 1100 }}
          >
            every token, <span className="gr">in context.</span>
          </h1>
          <p
            className="body-text-lg"
            style={{ marginTop: 24, maxWidth: 640 }}
          >
            This page is for Andre&apos;s review only. It shows the locked
            design language — tokens, type, buttons, patterns — as real
            elements on light. <strong>Not indexed.</strong>
          </p>
        </div>
      </section>

      {/* TOKENS */}
      <Section eyebrow="01 · Tokens" headline={<>palette, <span className="gr">hairlines, gradient.</span></>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          <Swatch label="--bg" value="#FFFFFF" bg="#FFFFFF" border />
          <Swatch label="--surface" value="#F5F5F4" bg="#F5F5F4" />
          <Swatch label="--surface-2" value="#EFEEEC" bg="#EFEEEC" />
          <Swatch label="--ink" value="#0E0F11" bg="#0E0F11" fg="#fff" />
          <Swatch label="--dim" value="#52525B" bg="#52525B" fg="#fff" />
          <Swatch label="--mute" value="#9494A0" bg="#9494A0" fg="#fff" />
          <Swatch label="--orange" value="#FF5D00" bg="#FF5D00" fg="#fff" />
          <Swatch label="--heat" value="120° gradient" bg="var(--heat)" fg="#fff" />
        </div>

        <div style={{ marginTop: 28 }}>
          <p className="meta-label" style={{ marginBottom: 12 }}>Hairlines</p>
          <div style={{ height: 1, background: "var(--hair)", marginBottom: 8 }} />
          <p className="body-text" style={{ fontSize: 13, color: "var(--mute)" }}>
            --hair · rgba(14,15,17,0.10) — used for dividers, borders
          </p>
          <div style={{ height: 1, background: "var(--hair-strong)", marginTop: 18, marginBottom: 8 }} />
          <p className="body-text" style={{ fontSize: 13, color: "var(--mute)" }}>
            --hair-strong · rgba(14,15,17,0.18) — used for outline borders, focus
          </p>
        </div>
      </Section>

      {/* TYPE */}
      <Section eyebrow="02 · Type" headline={<>cal sans + <span className="gr">figtree.</span></>}>
        <div style={{ display: "grid", gap: 48 }}>
          <Sample label="Hero H1 · Cal Sans 400 · clamp(60,14.5vw,250px) · lh 0.8 · -0.04em">
            <p className="display-hero">
              you brief it. <span className="gr">they build it.</span>
            </p>
          </Sample>
          <Sample label="Section H2 · Cal Sans 400 · clamp(40,6.5vw,90px) · lh 0.88 · -0.035em">
            <p className="display-section">
              brief monday. working <span className="gr">by friday.</span>
            </p>
          </Sample>
          <Sample label="Display MD · Cal Sans 400 · clamp(24,2.6vw,32px) · lh 1.02 · -0.025em">
            <p className="display-md">tell us <span className="gr">the gap.</span></p>
          </Sample>
          <Sample label="Body LG · Figtree 400 · 18px · lh 1.55">
            <p className="body-text-lg">
              A live roster of senior UA managers and marketing artists.{" "}
              <strong>Pay them direct, pay us a flat monthly fee.</strong> No
              percentage games.
            </p>
          </Sample>
          <Sample label="Body · Figtree 400 · 16px · lh 1.6">
            <p className="body-text">
              From a vetted roster of senior operators we actually know — not a
              job-board dragnet. You see a shortlist of real people, with real
              availability, fast.
            </p>
          </Sample>
          <Sample label="Kicker · Figtree 600 · 12px · 0.2em tracking">
            <p className="kicker">how it works</p>
          </Sample>
          <Sample label="Meta label · Figtree 600 · 11px · 0.14em tracking · --mute">
            <p className="meta-label">vetted operators</p>
          </Sample>
        </div>
      </Section>

      {/* BUTTONS */}
      <Section eyebrow="03 · Buttons" headline={<>fill, outline, <span className="gr">band.</span></>}>
        <Row label="On bg">
          <Button href="#" variant="fill" arrow>see the roster</Button>
          <Button href="#" variant="outline">how it works</Button>
          <Button href="#" variant="fill" size="sm" arrow>small fill</Button>
          <Button href="#" variant="outline" size="sm">small outline</Button>
        </Row>
        <Row label="On surface (cool grey)" surface>
          <Button href="#" variant="fill" arrow>see the roster</Button>
          <Button href="#" variant="outline">how it works</Button>
        </Row>
        <Row label="On gradient band (white pill)" gradient>
          <Button href="#" variant="band" arrow>book a 20-min call</Button>
        </Row>
      </Section>

      {/* META STRIP */}
      <Section eyebrow="04 · Meta strip" headline={<>flush ruled cells, <span className="gr">cal sans numerals.</span></>}>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid var(--hair)",
            borderBottom: "1px solid var(--hair)",
            flexWrap: "wrap",
          }}
        >
          <MetaCell n={<>50<span className="gr">+</span></>} label="vetted operators" />
          <MetaCell n="32" label="available now" />
          <MetaCell n={<>&lt;7<span className="gr">d</span></>} label="avg deployment" />
          <MetaCell n="2" label="disciplines live" />
        </div>
      </Section>

      {/* HOW-IT-WORKS RULED ROWS */}
      <Section eyebrow="05 · How-it-works pattern" headline={<>ruled rows, <span className="gr">not cards.</span></>}>
        <HowRow num="01" title={<>tell us <span className="gr">the gap</span></>}>
          UA lead for a launch, performance creative for a refresh, a fractional head of growth. Tell us the shape of the need and the timeline. We push back where it helps.
        </HowRow>
        <HowRow num="02" title={<>we <span className="gr">match</span></>}>
          From a vetted roster of senior operators we actually know — not a job-board dragnet. You see a shortlist of real people, with real availability, fast.
        </HowRow>
        <HowRow num="03" title={<>they <span className="gr">get to work</span></>} last>
          You contract and pay them directly. You pay us a flat monthly fee for each month they&apos;re engaged. Scale up, scale down, stop any time.
        </HowRow>
      </Section>

      {/* PREVIEW GRID — hairlines, no boxes */}
      <Section
        eyebrow="06 · Roster preview pattern"
        headline={<>hairline-gridded, <span className="gr">reads as one object.</span></>}
        surface
      >
        <div className="preview-grid">
          {PREVIEW_PROFILES.map((p) => (
            <div key={p.m} className="preview-card">
              <div className="preview-top-row">
                <span className="pc-mono">{p.m}</span>
                <span className={`status ${p.av ? "available" : "contract"}`}>
                  <span className="dot" />
                  {p.av ? "available" : "in contract"}
                </span>
              </div>
              <h3 className="display-md" style={{ marginBottom: 4 }}>
                {p.name}
              </h3>
              <p className="meta-label" style={{ marginBottom: 22, textTransform: "lowercase", letterSpacing: 0 }}>
                {p.role}
              </p>
              <div className="pc-meta">
                <div className="pc-meta-row"><span className="k">location</span><span className="v">{p.loc}</span></div>
                <div className="pc-meta-row"><span className="k">day rate</span><span className="v">{p.rate}</span></div>
                <div className="pc-meta-row"><span className="k">{p.ctxLabel}</span><span className="v">{p.ctx}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* GRADIENT BAND — the one colour moment */}
      <Section eyebrow="07 · Gradient band" headline={<>the <span className="gr">one</span> colour moment.</>}>
        <div className="band">
          <h2 className="display-section" style={{ color: "#fff", marginBottom: 24, maxWidth: 720 }}>
            the next hire is <span style={{ opacity: 0.78 }}>the easy bit.</span>
          </h2>
          <p style={{ color: "#fff", opacity: 0.92, fontSize: 19, lineHeight: 1.5, maxWidth: 520, marginBottom: 32 }}>
            Twenty minutes on a call. Tell us the role, the bar, the timeline. We&apos;ll have names for you the same week.
          </p>
          <Button href="#" variant="band" arrow>book a 20-min call</Button>
        </div>
      </Section>

      {/* LOGO */}
      <Section eyebrow="08 · Logo" headline={<>real wordmark, <span className="gr">two treatments.</span></>}>
        <div style={{ display: "grid", gap: 28 }}>
          <Sample label="Primary · gradient stroke + ink MF (size 40 = nav scale)">
            <Logo size={40} />
          </Sample>
          <Sample label="Primary · size 64 (large sample)">
            <Logo size={64} />
          </Sample>
          <Sample label="Mark only · stroke · size 56">
            <Logo variant="mark" size={56} />
          </Sample>
          <Sample label="Alt treatment · hexFilled (gradient fill + white MF)">
            <Logo size={40} hexFilled />
          </Sample>
          <Sample label="Alt treatment · mark only · size 56">
            <Logo variant="mark" size={56} hexFilled />
          </Sample>
          <Sample label="Monochrome ink override (gradient bypassed)">
            <Logo size={40} monochrome="var(--ink)" />
          </Sample>
        </div>

        <div
          style={{
            marginTop: 32,
            padding: "40px 32px",
            background: "var(--ink)",
            borderRadius: 16,
            display: "flex",
            gap: 24,
            alignItems: "center",
            color: "#fff",
            flexWrap: "wrap",
          }}
        >
          <Logo size={40} />
          <span className="meta-label" style={{ color: "rgba(255,255,255,0.6)" }}>
            primary on dark — wordmark inherits white via currentColor
          </span>
        </div>
      </Section>

      <style>{`
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--hair);
          border: 1px solid var(--hair);
          border-radius: 20px;
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .preview-grid { grid-template-columns: 1fr; }
        }
        .preview-card {
          background: var(--bg);
          padding: 28px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .preview-card:hover { background: var(--surface-2); }
        .preview-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 26px;
        }
        .pc-mono {
          font-family: var(--font-figtree), "Figtree", system-ui, sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mute);
        }
        .pc-meta {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pc-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }
        .pc-meta-row .k {
          color: var(--mute);
          text-transform: lowercase;
        }
        .pc-meta-row .v {
          font-weight: 600;
          text-transform: lowercase;
        }

        .band {
          background: var(--heat);
          border-radius: 32px;
          padding: 90px 70px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .band::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: 0.5;
          border-radius: 32px;
          pointer-events: none;
        }
        .band > * {
          position: relative;
          z-index: 1;
        }
        @media (max-width: 700px) {
          .band { padding: 56px 30px; border-radius: 24px; }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   Local helpers
   ============================================================ */

function Section({
  eyebrow,
  headline,
  children,
  surface = false,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  children: React.ReactNode;
  surface?: boolean;
}) {
  return (
    <section style={{ padding: "100px 0", background: surface ? "var(--surface)" : undefined }}>
      <div className="container">
        <p className="kicker kicker-mute">{eyebrow}</p>
        <h2 className="display-section" style={{ marginTop: 18, marginBottom: 48 }}>
          {headline}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Sample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="meta-label" style={{ marginBottom: 16 }}>{label}</p>
      {children}
    </div>
  );
}

function Row({
  label,
  children,
  surface = false,
  gradient = false,
}: {
  label: string;
  children: React.ReactNode;
  surface?: boolean;
  gradient?: boolean;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p className="meta-label" style={{ marginBottom: 14 }}>{label}</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          padding: surface || gradient ? "24px" : 0,
          background: gradient ? "var(--heat)" : surface ? "var(--surface)" : undefined,
          borderRadius: surface || gradient ? 16 : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Swatch({
  label,
  value,
  bg,
  fg = "var(--ink)",
  border = false,
}: {
  label: string;
  value: string;
  bg: string;
  fg?: string;
  border?: boolean;
}) {
  return (
    <div
      style={{
        background: bg,
        color: fg,
        padding: 22,
        borderRadius: 14,
        border: border ? "1px solid var(--hair)" : undefined,
        minHeight: 96,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 12, opacity: 0.78 }}>{value}</p>
    </div>
  );
}

function MetaCell({ n, label }: { n: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        padding: "30px 24px",
        borderRight: "1px solid var(--hair)",
      }}
    >
      <p
        style={{
          fontFamily: '"Cal Sans"',
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          margin: "0 0 6px",
        }}
      >
        {n}
      </p>
      <p className="meta-label">{label}</p>
    </div>
  );
}

function HowRow({
  num,
  title,
  children,
  last = false,
}: {
  num: string;
  title: React.ReactNode;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1.1fr 2fr",
        gap: 50,
        padding: "44px 0",
        borderTop: "1px solid var(--hair)",
        borderBottom: last ? "1px solid var(--hair)" : undefined,
        alignItems: "baseline",
      }}
    >
      <span style={{ fontFamily: '"Cal Sans"', fontWeight: 400, fontSize: 22, color: "var(--mute)" }}>
        {num}
      </span>
      <span style={{ fontFamily: '"Cal Sans"', fontWeight: 400, fontSize: 30, letterSpacing: "-0.02em", textTransform: "lowercase" }}>
        {title}
      </span>
      <span style={{ fontSize: 16, lineHeight: 1.6, color: "var(--dim)" }}>
        {children}
      </span>
    </div>
  );
}
