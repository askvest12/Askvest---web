import { signUpSchema } from "@/lib/validation/auth";
import { backendFetch, useMocks } from "@/lib/api/server";
import { mockSignUp } from "@/lib/api/mocks";

// TODO(backend): replace with the real path from the OpenAPI spec.
const SIGN_UP_PATH = "/api/v1/identity/sign-up";

export async function POST(request: Request) {
  // Only accept same-origin JSON posts from our own pages.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: { code: "bad_request", message: "Invalid request." } }, { status: 415 });
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: { code: "forbidden", message: "Invalid origin." } }, { status: 403 });
  }

  const json: unknown = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: { code: "validation", message: "Please check your details and try again." } },
      { status: 400 },
    );
  }
  const { fullName, email, password } = parsed.data;

  const result = useMocks
    ? await mockSignUp(email)
    : await backendFetch<{ email: string }>(SIGN_UP_PATH, {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
        idempotencyKey: request.headers.get("idempotency-key") ?? crypto.randomUUID(),
      });

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  // Never echo the password or backend internals back to the browser.
  return Response.json({ data: { email } }, { status: 201 });
}
