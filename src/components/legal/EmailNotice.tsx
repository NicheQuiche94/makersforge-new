import styles from "./EmailNotice.module.css";

/**
 * The collection notice that sits under every email field (Andre 2026-11-25).
 * One wording, used everywhere, so what we tell people matches the privacy
 * policy and what we actually do with their email.
 *
 * - "tool": free resources and tools. We send what they asked for, new tools
 *   and guides, and may follow up about their experience and hiring.
 * - "alerts": alert sign-ups. We send the alerts until they opt out.
 * - "enquiry": briefs, interview requests, job posts. We reply and follow up.
 */
type Props = {
  kind?: "tool" | "alerts" | "enquiry";
  /** What we email them, e.g. "the link", "your score". */
  deliver?: string;
  /** What "your experience with ..." refers to. */
  about?: string;
  /** Replaces the default size/colour styling with the host form's own class. */
  className?: string;
};

export function EmailNotice({ kind = "tool", deliver = "the link", about = "the resources", className }: Props) {
  const policy = (
    <a href="/legal/privacy" target="_blank" rel="noopener">
      Privacy policy
    </a>
  );
  const cls = `${styles.n} ${className ?? styles.base}`;
  if (kind === "enquiry")
    return <p className={cls}>We&apos;ll use your details to reply and follow up about your hiring. {policy}.</p>;
  if (kind === "alerts")
    return <p className={cls}>We&apos;ll email you {deliver}. Opt out any time. {policy}.</p>;
  return (
    <p className={cls}>
      We&apos;ll email you {deliver} and send new tools and guides when they release. We may follow up to ask about
      your experience with {about} and hiring in general. Opt out any time. {policy}.
    </p>
  );
}
