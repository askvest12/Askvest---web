import { emailOnlySchema } from "@/lib/validation/auth";
import { backendFetch, useMocks } from "@/lib/api/server";
import { mockForgotPassword } from "@/lib/api/mocks";
import { guardJson } from "@/lib/api/route-guard";

// TODO(backend): real path. The backend must rate limit this (it sends emails).
const PATH = "/api/v1/identity/password/forgot";

export async function POST(request: Request) {
  const input = await guardJson(request, emailOnlySchema);
  if (!input.ok) return input.response;

  if (useMocks) {
    await mockForgotPassword();
  } else {
    await backendFetch<unknown>(PATH, { method: "POST", body: JSON.stringify({ email: input.data.email }) });
  }
  // Always the same answer, whether or not the account exists (matches 06b copy: "If an account exists...").
  return Response.json({ data: { sent: true } });
}
