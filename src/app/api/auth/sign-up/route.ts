import { signUpSchema } from "@/lib/validation/auth";
import { backendFetch, useMocks } from "@/lib/api/server";
import { mockSignUp } from "@/lib/api/mocks";
import { errorResponse, guardJson } from "@/lib/api/route-guard";

// TODO(backend): replace with the real path from the OpenAPI spec.
const PATH = "/api/v1/identity/sign-up";

export async function POST(request: Request) {
  const input = await guardJson(request, signUpSchema);
  if (!input.ok) return input.response;
  const { fullName, email, password } = input.data;

  const result = useMocks
    ? await mockSignUp(email)
    : await backendFetch<unknown>(PATH, {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
        idempotencyKey: request.headers.get("idempotency-key") ?? crypto.randomUUID(),
      });

  if (!result.ok) return errorResponse(result.error, result.status);
  // Never echo the password or backend internals back to the browser.
  return Response.json({ data: { email } }, { status: 201 });
}
