import { signUpSchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockSignUp } from "@/lib/api/mocks";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson, idempotencyKeyFrom } from "@/lib/api/route-guard";

// POST /api/v1/auth/sign-up { email, password }
// The backend answers the same way whether or not the email already exists.
// TODO(backend): send fullName once the API accepts it (Lucky is aligning API and UI).
export async function POST(request: Request) {
  const input = await guardJson(request, signUpSchema);
  if (!input.ok) return input.response;
  const { email, password } = input.data;

  const result = useMocks
    ? await mockSignUp(email)
    : await backendFetch<null>("/auth/sign-up", {
        body: { email, password },
        idempotencyKey: idempotencyKeyFrom(request),
        clientIp: clientIpFrom(request),
      });

  if (!result.ok) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }
  // Never echo the password or backend internals back to the browser.
  return Response.json({ data: { email } }, { status: 201 });
}
