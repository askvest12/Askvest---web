// Holds an email between screens (sign up -> verify, forgot -> reset).
// Kept in sessionStorage (not the URL) so it doesn't leak into history or logs.
import { useSyncExternalStore } from "react";

const KEYS = { verify: "askvest.pendingEmail", reset: "askvest.resetEmail", device: "askvest.deviceEmail" } as const;
type Purpose = keyof typeof KEYS;

function write(purpose: Purpose, email: string) {
  try {
    sessionStorage.setItem(KEYS[purpose], email);
  } catch {
    /* storage can be unavailable (private mode); the next screen handles a missing email */
  }
}

function read(purpose: Purpose): string | null {
  try {
    return sessionStorage.getItem(KEYS[purpose]);
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

export const setPendingEmail = (email: string) => write("verify", email);
export const setResetEmail = (email: string) => write("reset", email);
export const setDeviceEmail = (email: string) => write("device", email);

/** undefined while rendering on the server, then the stored email (or null). */
export function usePendingEmail(): string | null | undefined {
  return useSyncExternalStore(noopSubscribe, () => read("verify"), () => undefined);
}

export function useResetEmail(): string | null | undefined {
  return useSyncExternalStore(noopSubscribe, () => read("reset"), () => undefined);
}

export function clearResetEmail() {
  try {
    sessionStorage.removeItem(KEYS.reset);
  } catch {
    /* ignore */
  }
}

export function useDeviceEmail(): string | null | undefined {
  return useSyncExternalStore(noopSubscribe, () => read("device"), () => undefined);
}
