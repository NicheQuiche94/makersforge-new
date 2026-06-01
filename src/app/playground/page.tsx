import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import { Blob } from "@/components/atoms/Blob";
import { Logo } from "@/components/atoms/Logo";

export const metadata: Metadata = {
  title: "Playground — MakersForge",
  description:
    "v4 component library reference. Tokens, type, button system, blob, status pills.",
  robots: { index: false, follow: false },
};

export default function PlaygroundPage() {
  return (
    <>
      <section style={{ padding: "150px 0 60px" }}>
        <div className="container">
          <p className="kicker">v4 · component playground</p>
          <h1 className="display-section" style={{ marginTop: 20, maxWidth: 1100 }}>
            every token, <span className="gr">in context.</span>
          </h1>
          <p className="body-text-lg" style={{ marginTop: 20, maxWidth: 640 }}>
            Andre&apos;s review surface. Tokens, type, button system, the inline
            blob, status pills, logo treatments. <strong>Not indexed.</strong>
          </p>
        </div>
      </section>

      {/* TOKENS */}
      <Section eyebrow="01 · Tokens" headline={<>warm cream + <span className="gr">heat family.</span></>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
          <Swatch label="--bg (warm cream)" value="#F5F1EA" bg="#F5F1EA" border />
          <Swatch label="--bg-deep" value="#EDE7DC" bg="#EDE7DC" />
          <Swatch label="--bg-card" value="#FAF6EF" bg="#FAF6EF" />
          <Swatch label="--paper" value="#FFFFFF" bg="#FFFFFF" border />
          <Swatch label="--ink" value="#0E0F11" bg="#0E0F11" fg="#fff" />
          <Swatch label="--charcoal" value="#3A3A3F" bg="#3A3A3F" fg="#fff" />
          <Swatch label="--dim" value="#52525B" bg="#52525B" fg="#fff" />
          <Swatch label="--mute" value="#8A8780" bg="#8A8780" fg="#fff" />
          <Swatch label="--heat (120°)" value="linear" bg="var(--heat)" fg="#fff" />
          <Swatch label="--heat-h (90°, for pills)" value="horizontal" bg="var(--heat-h)" fg="#fff" />
          <Swatch label="--heat-deep" value="135° w/ dark tail" bg="var(--heat-deep)" fg="#fff" />
          <Swatch label="--heat-radial" value="radial" bg="var(--heat-radial)" fg="#fff" />
        </div>
      </Section>

      {/* TYPE */}
      <Section eyebrow="02 · Type" headline={<>cal sans + <span className="gr">figtree.</span></>}>
        <div style={{ display: "grid", gap: 48 }}>
          <Sample label="Hero · Cal Sans 400 · clamp(54,9.5vw,164px)">
            <p className="display-hero">
              you brief it. <span className="gr">they build it.</span>
            </p>
          </Sample>
          <Sample label="Page H1 · clamp(50,8vw,128px)">
            <p className="display-page-h">
              the bench, <span className="gr">on call.</span>
            </p>
          </Sample>
          <Sample label="Section · clamp(46,7vw,108px)">
            <p className="display-section">
              hiring shouldn&apos;t <span className="ghost">slow</span> growth <Blob /> <span className="gr">we won&apos;t.</span>
            </p>
          </Sample>
          <Sample label="Mid · clamp(34,5vw,72px)">
            <p className="display-mid">
              brief monday. working <span className="gr">by friday.</span>
            </p>
          </Sample>
          <Sample label="Small · clamp(28,3.6vw,44px)">
            <p className="display-small">tell us <span className="gr">the gap.</span></p>
          </Sample>
          <Sample label="Body LG · Figtree 400 · 17px">
            <p className="body-text-lg">
              A live roster of senior UA managers and marketing artists.{" "}
              <strong>Pay them direct, pay us a flat monthly fee.</strong> No
              percentage games.
            </p>
          </Sample>
          <Sample label="Kicker · 11px · 0.18em uppercase">
            <p className="kicker">how it works</p>
          </Sample>
          <Sample label="Inline blob (typographic punctuation)">
            <p className="display-small">
              hiring shouldn&apos;t <span className="ghost">slow</span> growth <Blob /> <span className="gr">we won&apos;t.</span>
            </p>
          </Sample>
        </div>
      </Section>

      {/* BUTTONS */}
      <Section eyebrow="03 · Buttons" headline={<>primary, light, ghost, <span className="gr">on-dark.</span></>}>
        <Row label="On cream">
          <Button href="#" variant="primary" arrow>see the roster</Button>
          <Button href="#" variant="ghost">how it works</Button>
          <Button href="#" variant="primary" size="sm" arrow>small primary</Button>
        </Row>
        <Row label="On paper">
          <div style={{ background: "var(--paper)", padding: 24, borderRadius: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button href="#" variant="primary" arrow>see the roster</Button>
            <Button href="#" variant="ghost">how it works</Button>
          </div>
        </Row>
        <Row label="On gradient panel (heat-deep)">
          <div style={{ background: "var(--heat-deep)", padding: 24, borderRadius: 16, display: "flex", gap: 12, flexWrap: "wrap", color: "#fff" }}>
            <Button href="#" variant="light" arrow>book a 20-min call</Button>
            <Button href="#" variant="on-dark">how it works</Button>
          </div>
        </Row>
        <Row label="On bright gradient (heat)">
          <div style={{ background: "var(--heat)", padding: 24, borderRadius: 16, display: "flex", gap: 12, flexWrap: "wrap", color: "#fff" }}>
            <Button href="#" variant="light" arrow>book a 20-min call</Button>
          </div>
        </Row>
      </Section>

      {/* STATUS PILLS */}
      <Section eyebrow="04 · Status pills" headline={<>available & <span className="gr">in contract.</span></>}>
        <Row label="On cream / paper">
          <span className="status available"><span className="dot" />available</span>
          <span className="status contract"><span className="dot" />in contract</span>
        </Row>
        <Row label="On gradient panel">
          <div style={{ background: "var(--heat-deep)", padding: 24, borderRadius: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="status" style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}>
              <span className="dot" style={{ background: "#fff" }} />available
            </span>
            <span className="status" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
              <span className="dot" style={{ background: "#fff" }} />in contract
            </span>
          </div>
        </Row>
      </Section>

      {/* LOGO */}
      <Section eyebrow="05 · Logo" headline={<>real wordmark, <span className="gr">heat gradient stroke.</span></>}>
        <div style={{ display: "grid", gap: 28 }}>
          <Sample label="Primary · size 40 (nav scale)">
            <Logo size={40} />
          </Sample>
          <Sample label="Footer scale · size 32">
            <Logo size={32} />
          </Sample>
          <Sample label="Mark only · size 56">
            <Logo variant="mark" size={56} />
          </Sample>
          <Sample label="Hex-filled treatment · size 40 (alt use case)">
            <Logo size={40} hexFilled />
          </Sample>
        </div>
        <div
          style={{
            marginTop: 28,
            padding: "32px 28px",
            background: "var(--heat-deep)",
            borderRadius: 16,
            color: "#fff",
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Logo size={40} />
          <span className="meta-label" style={{ color: "rgba(255,255,255,0.6)" }}>
            on heat-deep panel — wordmark inherits white via currentColor
          </span>
        </div>
      </Section>
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
}: {
  eyebrow: string;
  headline: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={{ padding: "80px 0" }}>
      <div className="container">
        <p className="kicker">{eyebrow}</p>
        <h2 className="display-mid" style={{ marginTop: 14, marginBottom: 44 }}>
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
      <p className="meta-label" style={{ marginBottom: 14 }}>{label}</p>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p className="meta-label" style={{ marginBottom: 12 }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
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
