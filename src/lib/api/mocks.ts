import "server-only";
import type { ApiResult } from "./server";

// Development mocks used until the backend is deployed on Render.
// Test emails:
//   taken@askvest.test  -> "email already in use" error
//   down@askvest.test   -> backend unavailable error

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockSignUp(email: string): Promise<ApiResult<{ email: string }>> {
  await wait(700);
  if (email === "taken@askvest.test") {
    return { ok: false, status: 409, error: { code: "email_taken", message: "An account with this email already exists." } };
  }
  if (email === "down@askvest.test") {
    return { ok: false, status: 503, error: { code: "unavailable", message: "We couldn't reach AskVest. Please try again." } };
  }
  return { ok: true, status: 201, data: { email } };
}
