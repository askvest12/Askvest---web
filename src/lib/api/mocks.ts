import "server-only";
import type { ApiResult, AuthenticatedPayloadLike } from "./mock-types";

// Development mocks used until BACKEND_API_URL is set. They return the same
// error codes as the real backend, so the same error mapping is exercised.
//
// Sign up:   down@askvest.test -> backend unavailable. (The real API never says "email taken".)
// Verify:    123456 -> success, anything else -> auth.invalid_code
// Log in:    password "Askvest2026x" -> success
//            unverified@askvest.test -> auth.email_not_verified
//            newdevice@askvest.test  -> device verification required (screen not designed yet)
//            anything else -> auth.invalid_credentials
// Forgot:    always succeeds (the real API never reveals whether an email exists)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fail = (status: number, code: string, message: string) => ({ ok: false as const, status, error: { code, message } });

export const MOCK_PASSWORD = "Askvest2026x";

export async function mockSignUp(email: string): Promise<ApiResult<null>> {
  await wait(700);
  if (email === "down@askvest.test") return fail(503, "unavailable", "The service is temporarily unavailable.");
  return { ok: true, status: 200, data: null };
}

export async function mockVerifyEmail(code: string): Promise<ApiResult<null>> {
  await wait(600);
  if (code !== "123456") return fail(400, "auth.invalid_code", "The request is not valid.");
  return { ok: true, status: 200, data: null };
}

export async function mockResendCode(): Promise<ApiResult<null>> {
  await wait(500);
  return { ok: true, status: 200, data: null };
}

export async function mockLogin(email: string, password: string): Promise<ApiResult<AuthenticatedPayloadLike>> {
  await wait(800);
  if (password !== MOCK_PASSWORD) return fail(401, "auth.invalid_credentials", "Authentication is required.");
  if (email === "unverified@askvest.test") return fail(403, "auth.email_not_verified", "Access is denied.");
  if (email === "newdevice@askvest.test") {
    return { ok: true, status: 200, data: { result: "device_verification_required", challengeId: "00000000-0000-4000-8000-000000000000", expiresAt: new Date(Date.now() + 600_000).toISOString() } };
  }
  const exp = (s: number) => new Date(Date.now() + s * 1000).toISOString();
  return {
    ok: true,
    status: 200,
    data: { result: "authenticated", accessToken: "mock-access", refreshToken: "mock-refresh", accessTokenExpiresAt: exp(900), refreshIdleExpiresAt: exp(2_592_000), sessionId: "mock-session" },
  };
}

export async function mockForgotPassword(): Promise<ApiResult<null>> {
  await wait(600);
  return { ok: true, status: 200, data: null };
}
