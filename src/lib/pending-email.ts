// Holds the email being verified between sign up and the verification screen.
// Kept in sessionStorage (not the URL) so it doesn't leak into history or logs.
const KEY = "askvest.pendingEmail";

export function setPendingEmail(email: string) {
  try {
    sessionStorage.setItem(KEY, email);
  } catch {
    /* storage can be unavailable (private mode); the verify screen handles a missing email */
  }
}

export function getPendingEmail(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
