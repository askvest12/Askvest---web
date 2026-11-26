import { onboardingSchema } from "@/lib/validation/auth";
import { useMocks } from "@/lib/api/server";
import { authedFetch } from "@/lib/api/auth-call";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson, idempotencyKeyFrom } from "@/lib/api/route-guard";
import { getAccessToken } from "@/lib/api/session";

/**
 * Saves onboarding answers (screens 08 to 10). All fields optional, so each
 * screen saves as you go ("Saved as you go" on screen 07).
 * - familiarity, goals, preferredCurrency -> PUT /api/v1/account/onboarding
 * - country                              -> PUT /api/v1/compliance/country
 */
export async function POST(request: Request) {
  const input = await guardJson(request, onboardingSchema);
  if (!input.ok) return input.response;
  const { country, ...profile } = input.data;
  const key = idempotencyKeyFrom(request);

  if (useMocks) {
    // Mirror the real API: onboarding needs a logged-in user.
    if (!(await getAccessToken())) return errorResponse({ code: "unauthenticated", message: "Please log in again." }, 401);
    await new Promise((r) => setTimeout(r, 400));
    return Response.json({ data: { saved: true } });
  }

  if (Object.keys(profile).length > 0) {
    const r = await authedFetch<unknown>(request, "/account/onboarding", { method: "PUT", body: profile, idempotencyKey: `${key}:profile` });
    if (!r.ok) return fail(r.error, r.status);
  }
  if (country) {
    const r = await authedFetch<unknown>(request, "/compliance/country", { method: "PUT", body: { country }, idempotencyKey: `${key}:country` });
    if (!r.ok) return fail(r.error, r.status);
  }
  return Response.json({ data: { saved: true } });
}

function fail(error: Parameters<typeof toUiError>[0], status: number) {
  if (status === 401) return errorResponse({ code: "unauthenticated", message: "Please log in again." }, 401);
  const ui = toUiError(error, status);
  return errorResponse(ui.body, ui.status);
}
