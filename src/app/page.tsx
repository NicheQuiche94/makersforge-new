import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function HomePage() {
  return (
    <section style={{ padding: "180px 0 120px" }}>
      <div className="container">
        <p className="kicker kicker-mute">Phase 1 · Foundations</p>
        <h1
          className="display-section"
          style={{ marginTop: 24, maxWidth: 900 }}
        >
          design language <span className="gr">landed.</span>
        </h1>
        <p
          className="body-text-lg"
          style={{ marginTop: 24, maxWidth: 640 }}
        >
          The real homepage gets built in Phase 2. Until then, this is a
          placeholder. The component playground at{" "}
          <Link
            href="/playground"
            style={{
              color: "var(--orange)",
              borderBottom: "1px solid var(--orange)",
            }}
          >
            /playground
          </Link>{" "}
          demonstrates every token, button, and section pattern in the new
          locked language.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
          <Button href="/playground" variant="fill" arrow>
            see the playground
          </Button>
          <Button href="/roster" variant="outline">
            (roster, soon)
          </Button>
        </div>
      </div>
    </section>
  );
}
