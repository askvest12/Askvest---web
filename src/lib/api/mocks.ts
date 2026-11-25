import "server-only";
import type { ApiResult } from "./server";

// Development mocks used until the backend is deployed on Render.
//
// Sign up:   taken@askvest.test -> email already exists, down@askvest.test -> backend unavailable
// Verify:    123456 -> success, 000000 -> code expired, anything else -> incorrect code
// Log in:    any email + password "Password1" -> success, anything else -> incorrect
// Forgot:    always "sent" (the real API must not reveal whether an email exists)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fail = (status: number, code: string, message: string) => ({ ok: false as const, status, error: { code, message } });

export const MOCK_PASSWORD = "Password1";

export async function mockSignUp(email: string): Promise<ApiResult<{ email: string }>> {
  await wait(700);
  if (email === "taken@askvest.test") return fail(409, "email_taken", "An account with this email already exists.");
  if (email === "down@askvest.test") return fail(503, "unavailable", "We couldn't reach AskVest. Please try again.");
  return { ok: true, status: 201, data: { email } };
}

export async function mockVerifyEmail(code: string): Promise<ApiResult<{ verified: true }>> {
  await wait(600);
  if (code === "000000") return fail(410, "code_expired", "This code is no longer valid.");
  if (code !== "123456") return fail(400, "code_invalid", "That code isn't right. Check it and try again.");
  return { ok: true, status: 200, data: { verified: true } };
}

export async function mockResendCode(): Promise<ApiResult<{ sent: true }>> {
  await wait(500);
  return { ok: true, status: 200, data: { sent: true } };
}

export async function mockLogin(password: string): Promise<ApiResult<{ accessToken: string; refreshToken: string }>> {
  await wait(800);
  if (password !== MOCK_PASSWORD) return fail(401, "invalid_credentials", "Incorrect email or password.");
  return { ok: true, status: 200, data: { accessToken: "mock-access", refreshToken: "mock-refresh" } };
}

export async function mockForgotPassword(): Promise<ApiResult<{ sent: true }>> {
  await wait(600);
  return { ok: true, status: 200, data: { sent: true } };
}
