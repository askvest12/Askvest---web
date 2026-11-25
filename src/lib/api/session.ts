import "server-only";
import { cookies } from "next/headers";

// Tokens live in httpOnly cookies so browser JavaScript can never read them.
// TODO(backend): match lifetimes to the real access/refresh token expiry.
const ACCESS_COOKIE = "av_at";
const REFRESH_COOKIE = "av_rt";

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function setSession(tokens: { accessToken: string; refreshToken: string }) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, tokens.accessToken, { ...base, maxAge: 60 * 15 });
  // Refresh token is only ever sent to our auth routes.
  jar.set(REFRESH_COOKIE, tokens.refreshToken, { ...base, path: "/api/auth", maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete({ name: REFRESH_COOKIE, path: "/api/auth" });
}
