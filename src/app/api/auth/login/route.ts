import { loginSchema } from "@/lib/validation/auth";
import { backendFetch, useMocks } from "@/lib/api/server";
import { mockLogin } from "@/lib/api/mocks";
import { errorResponse, guardJson } from "@/lib/api/route-guard";
import { setSession } from "@/lib/api/session";

// TODO(backend): real path and token response shape.
const PATH = "/api/v1/identity/login";

export async function POST(request: Request) {
  const input = await guardJson(request, loginSchema);
  if (!input.ok) return input.response;
  const { email, password } = input.data;

  const result = useMocks
    ? await mockLogin(password)
    : await backendFetch<{ accessToken: string; refreshToken: string }>(PATH, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

  if (!result.ok) {
    // Same message for wrong email and wrong password, so attackers can't probe which emails exist.
    if (result.status === 400 || result.status === 401 || result.status === 404) {
      return errorResponse({ code: "invalid_credentials", message: "Incorrect email or password." }, 401);
    }
    return errorResponse(result.error, result.status);
  }

  await setSession(result.data);
  // Tokens stay in httpOnly cookies; nothing sensitive goes back in the body.
  return Response.json({ data: { ok: true } });
}
