import { verifyEmailSchema } from "@/lib/validation/auth";
import { backendFetch, useMocks } from "@/lib/api/server";
import { mockVerifyEmail } from "@/lib/api/mocks";
import { errorResponse, guardJson } from "@/lib/api/route-guard";

// TODO(backend): real path, and the error codes for "wrong code" vs "expired code".
const PATH = "/api/v1/identity/email/verify";

export async function POST(request: Request) {
  const input = await guardJson(request, verifyEmailSchema);
  if (!input.ok) return input.response;
  const { email, code } = input.data;

  const result = useMocks
    ? await mockVerifyEmail(code)
    : await backendFetch<unknown>(PATH, { method: "POST", body: JSON.stringify({ email, code }) });

  if (!result.ok) return errorResponse(result.error, result.status);
  return Response.json({ data: { verified: true } });
}
