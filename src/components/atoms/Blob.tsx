/**
 * Inline gradient blob — typographic punctuation, used ONLY inside type.
 * Sized in em so it scales with the surrounding text.
 *
 * Decorative free-floating spheres in margins are NOT allowed per brief
 * — blobs only live inside type.
 */
export function Blob() {
  return <span className="blob" aria-hidden="true" />;
}
