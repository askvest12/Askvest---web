/** Only allow redirects to our own pages (blocks open redirects like ?next=//evil.com). */
const ALLOWED = ["/personalise", "/home"];

export function safeNext(raw: string | null | undefined, fallback = "/home"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return fallback;
  const path = raw.split(/[?#]/)[0];
  return ALLOWED.includes(path) ? path : fallback;
}
