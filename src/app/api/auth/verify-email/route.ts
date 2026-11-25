import { verifyEmailSchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockVerifyEmail } from "@/lib/api/mocks";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson, idempotencyKeyFrom } from "@/lib/api/route-guard";

// POST /api/v1/auth/verify-email { email, code }. Returns no tokens; the user logs in afterwards.
export async function POST(request: Request) {
  const input = await guardJson(request, verifyEmailSchema);
  if (!input.ok) return input.response;
  const { email, code } = input.data;

  const result = useMocks
    ? await mockVerifyEmail(code)
    : await backendFetch<null>("/auth/verify-email", {
        body: { email, code },
        idempotencyKey: idempotencyKeyFrom(request),
        clientIp: clientIpFrom(request),
      });

  if (!result.ok) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }
  return Response.json({ data: { verified: true } });
}
