import { emailOnlySchema } from "@/lib/validation/auth";
import { backendFetch, useMocks } from "@/lib/api/server";
import { mockResendCode } from "@/lib/api/mocks";
import { errorResponse, guardJson } from "@/lib/api/route-guard";

// TODO(backend): real path. The backend must rate limit this (it sends emails).
const PATH = "/api/v1/identity/email/resend";

export async function POST(request: Request) {
  const input = await guardJson(request, emailOnlySchema);
  if (!input.ok) return input.response;

  const result = useMocks
    ? await mockResendCode()
    : await backendFetch<unknown>(PATH, { method: "POST", body: JSON.stringify({ email: input.data.email }) });

  if (!result.ok) return errorResponse(result.error, result.status);
  return Response.json({ data: { sent: true } });
}
