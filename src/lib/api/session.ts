import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

// Tokens live in httpOnly cookies so browser JavaScript can never read them.
const ACCESS_COOKIE = "av_at";
const REFRESH_COOKIE = "av_rt";
const INSTALLATION_COOKIE = "av_iid";
const CHALLENGE_COOKIE = "av_dc";

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/** Shape of the backend's "authenticated" login/refresh payload. */
export type AuthenticatedPayload = {
  result: "authenticated";
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshIdleExpiresAt: string;
  sessionId: string;
};

const secondsUntil = (iso: string | undefined, fallback: number) => {
  const ms = iso ? Date.parse(iso) - Date.now() : NaN;
  return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : fallback;
};

export async function setSession(s: Pick<AuthenticatedPayload, "accessToken" | "refreshToken"> & Partial<AuthenticatedPayload>) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, s.accessToken, { ...base, maxAge: secondsUntil(s.accessTokenExpiresAt, 60 * 15) });
  // Refresh token is only sent to our /api routes, never on page loads.
  jar.set(REFRESH_COOKIE, s.refreshToken, {
    ...base,
    path: "/api",
    maxAge: secondsUntil(s.refreshIdleExpiresAt, 60 * 60 * 24 * 30),
  });
  jar.delete({ name: CHALLENGE_COOKIE, path: "/api" });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete({ name: REFRESH_COOKIE, path: "/api" });
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

/**
 * Stable per-browser id the backend uses to recognise a trusted device
 * (DeviceInfoRequest.InstallationId). Kept for a year.
 */
export async function getInstallationId() {
  const jar = await cookies();
  let id = jar.get(INSTALLATION_COOKIE)?.value;
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    id = randomUUID();
    jar.set(INSTALLATION_COOKIE, id, { ...base, maxAge: 60 * 60 * 24 * 365 });
  }
  return id;
}

/** Holds the device-verification challenge between login and the code screen. */
export async function setDeviceChallenge(challengeId: string) {
  (await cookies()).set(CHALLENGE_COOKIE, challengeId, { ...base, path: "/api", maxAge: 60 * 15 });
}

export async function getDeviceChallenge() {
  const id = (await cookies()).get(CHALLENGE_COOKIE)?.value ?? null;
  return id && /^[0-9a-f-]{36}$/i.test(id) ? id : null;
}

export async function clearDeviceChallenge() {
  (await cookies()).delete({ name: CHALLENGE_COOKIE, path: "/api" });
}

/** Short device label for the backend's device list, e.g. "Chrome on Android". */
export function deviceNameFrom(userAgent: string | null): string {
  const ua = userAgent ?? "";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Web";
  return `${browser} on ${os}`;
}
