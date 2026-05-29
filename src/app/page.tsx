import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function HomePage() {
  return (
    <section style={{ padding: "150px 0 100px" }}>
      <div className="container">
        <p className="kicker">v4 foundations · phase a</p>
        <h1 className="display-section" style={{ marginTop: 20, maxWidth: 900 }}>
          tokens, buttons, chrome <span className="gr">landed.</span>
        </h1>
        <p className="body-text-lg" style={{ marginTop: 20, maxWidth: 620 }}>
          Real homepage gets built next. Until then, this stub keeps the
          build green. The component playground at{" "}
          <Link href="/playground" className="gr" style={{ fontWeight: 600 }}>
            /playground
          </Link>{" "}
          demonstrates the new design language.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
          <Button href="/playground" variant="primary" arrow>
            see the playground
          </Button>
          <Button href="/roster" variant="ghost">
            roster (soon)
          </Button>
        </div>
      </div>
    </section>
  );
}
