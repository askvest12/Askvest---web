import { verifyDeviceSchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockVerifyDevice } from "@/lib/api/mocks";
import type { AuthenticatedPayloadLike } from "@/lib/api/mock-types";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson } from "@/lib/api/route-guard";
import { clearDeviceChallenge, getDeviceChallenge, setSession } from "@/lib/api/session";

// POST /api/v1/auth/verify-device { challengeId, code }. Exempt from Idempotency-Key on the backend.
export async function POST(request: Request) {
  const input = await guardJson(request, verifyDeviceSchema);
  if (!input.ok) return input.response;

  const challengeId = await getDeviceChallenge();
  if (!challengeId) {
    return errorResponse({ code: "challenge_missing", message: "This code has expired. Please log in again to get a new one." }, 410);
  }

  const result = useMocks
    ? await mockVerifyDevice(input.data.code)
    : await backendFetch<AuthenticatedPayloadLike>("/auth/verify-device", {
        body: { challengeId, code: input.data.code },
        clientIp: clientIpFrom(request),
      });

  if (!result.ok) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }
  if (result.data.result !== "authenticated") {
    await clearDeviceChallenge();
    return errorResponse({ code: "challenge_missing", message: "Please log in again." }, 409);
  }

  await setSession(result.data); // also clears the challenge cookie
  return Response.json({ data: { result: "authenticated" } });
}
