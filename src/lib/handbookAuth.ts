/**
 * Shared auth helper for the team handbook gate. Used by the edge proxy
 * (src/proxy.ts) and the login API route. Web Crypto only, so it runs in both
 * the edge and node runtimes.
 *
 * The cookie stores a SHA-256 token of the password (+ salt), never the password
 * itself. Only someone who entered the correct password gets a matching token;
 * it can't be forged without knowing the password. httpOnly + Secure in transit.
 */
export const HANDBOOK_COOKIE = "handbook_ok";
const SALT = "::mf-handbook-v1";

export function handbookPassword(): string {
  return process.env.HANDBOOK_PASSWORD || "welcome-to-the-desk";
}

export async function handbookToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + SALT);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
