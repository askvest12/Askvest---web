import { emailOnlySchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockResendCode } from "@/lib/api/mocks";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson, idempotencyKeyFrom } from "@/lib/api/route-guard";

// POST /api/v1/auth/resend-verification { email }. Backend enforces a 60s cooldown and rate limits.
export async function POST(request: Request) {
  const input = await guardJson(request, emailOnlySchema);
  if (!input.ok) return input.response;

  const result = useMocks
    ? await mockResendCode()
    : await backendFetch<null>("/auth/resend-verification", {
        body: { email: input.data.email },
        idempotencyKey: idempotencyKeyFrom(request),
        clientIp: clientIpFrom(request),
      });

  if (!result.ok) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }
  return Response.json({ data: { sent: true } });
}
