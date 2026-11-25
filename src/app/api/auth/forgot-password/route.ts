import { emailOnlySchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockForgotPassword } from "@/lib/api/mocks";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson, idempotencyKeyFrom } from "@/lib/api/route-guard";

// POST /api/v1/auth/forgot-password { email }. The backend emails a reset CODE
// (used with /auth/reset-password). TODO: code + new password screen once design confirms.
export async function POST(request: Request) {
  const input = await guardJson(request, emailOnlySchema);
  if (!input.ok) return input.response;

  const result = useMocks
    ? await mockForgotPassword()
    : await backendFetch<null>("/auth/forgot-password", {
        body: { email: input.data.email },
        idempotencyKey: idempotencyKeyFrom(request),
        clientIp: clientIpFrom(request),
      });

  // Only surface rate limiting / outages. Anything else gets the same answer,
  // so nobody can use this form to find out which emails have accounts.
  if (!result.ok && (result.status === 429 || result.status >= 500)) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }
  return Response.json({ data: { sent: true } });
}
