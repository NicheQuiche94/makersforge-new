import { Fragment, type ReactNode } from "react";
import styles from "./JobDescription.module.css";

/**
 * Tiny, safe renderer for our `description_md` subset, paragraphs,
 * **bold**, and `- ` bullet lists. Deliberately not a full markdown engine:
 * the summaries are written by us in a fixed shape (2–4 sentences + a short
 * requirements list, brief §3), and rendering React text nodes (never
 * dangerouslySetInnerHTML) keeps curated content injection-safe.
 */
export function JobDescription({ md }: { md: string }) {
  const lines = md.split("\n");
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className={styles.list}>
        {bullets.map((b, i) => (
          <li key={i}>{inline(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
      continue;
    }
    flushBullets();
    if (line.length === 0) continue;
    blocks.push(
      <p key={`p-${blocks.length}`} className={styles.para}>
        {inline(line)}
      </p>,
    );
  }
  flushBullets();

  return <div className={styles.body}>{blocks}</div>;
}

/** Render **bold** spans; everything else is plain text. */
function inline(text: string): ReactNode {
  const parts = text.split("**");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
