/**
 * Sends the self-onboarding emails (templates in lib/clientEmails.ts) through
 * Resend. Two safety valves while we build and test:
 *  - ONBOARDING_EMAIL_TO: if set, every email goes to that address instead of
 *    the real recipient (subject prefixed with who it was for).
 *  - no RESEND_API_KEY (local dev): nothing is sent; the email is logged and
 *    written to .onboarding-outbox/ so it can be opened in a browser.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";

const FROM = "Andre at MakersForge <andre@makersforge.gg>";
export const ANDRE = "andre@makersforge.gg";

type Attachment = { filename: string; content: Buffer };

export async function sendMail({ to, subject, html, attachments }: { to: string; subject: string; html: string; attachments?: Attachment[] }) {
  const override = process.env.ONBOARDING_EMAIL_TO;
  const realTo = override || to;
  const realSubject = override ? `[to ${to}] ${subject}` : subject;
  const key = process.env.RESEND_API_KEY;

  if (!key || key.startsWith("re_placeholder")) {
    const dir = path.join(process.cwd(), ".onboarding-outbox");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}-${subject.replace(/[^a-z0-9]+/gi, "-").slice(0, 50)}.html`);
    await fs.writeFile(file, `<!-- to: ${to} -->\n${html}`);
    for (const a of attachments ?? []) await fs.writeFile(path.join(dir, a.filename), a.content);
    console.log(`[onboarding mail, not sent] to=${to} subject="${subject}" → ${file}`);
    return { ok: true, dev: true };
  }

  const { error } = await new Resend(key).emails.send({
    from: FROM,
    to: realTo,
    subject: realSubject,
    html,
    replyTo: ANDRE,
    attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });
  if (error) {
    console.error("onboarding mail failed", error);
    return { ok: false, error };
  }
  return { ok: true };
}
