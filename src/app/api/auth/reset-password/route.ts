import { resetPasswordSchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockResetPassword } from "@/lib/api/mocks";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson, idempotencyKeyFrom } from "@/lib/api/route-guard";

// POST /api/v1/auth/reset-password { email, code, password }. Code is the 6 digits emailed by forgot-password.
export async function POST(request: Request) {
  const input = await guardJson(request, resetPasswordSchema);
  if (!input.ok) return input.response;
  const { email, code, password } = input.data;

  const result = useMocks
    ? await mockResetPassword(code)
    : await backendFetch<null>("/auth/reset-password", {
        body: { email, code, password },
        idempotencyKey: idempotencyKeyFrom(request),
        clientIp: clientIpFrom(request),
      });

  if (!result.ok) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }
  return Response.json({ data: { reset: true } });
}
