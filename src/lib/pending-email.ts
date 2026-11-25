// Holds the email being verified between sign up and the verification screen.
// Kept in sessionStorage (not the URL) so it doesn't leak into history or logs.
import { useSyncExternalStore } from "react";

const KEY = "askvest.pendingEmail";

export function setPendingEmail(email: string) {
  try {
    sessionStorage.setItem(KEY, email);
  } catch {
    /* storage can be unavailable (private mode); the verify screen handles a missing email */
  }
}

function read(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

/** undefined while rendering on the server, then the stored email (or null). */
export function usePendingEmail(): string | null | undefined {
  return useSyncExternalStore(noopSubscribe, read, () => undefined);
}
