import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardSameOrigin } from "@/lib/api/route-guard";
import { clearSession, getInstallationId, getRefreshToken, setSession, type AuthenticatedPayload } from "@/lib/api/session";

// POST /api/v1/auth/refresh { refreshToken, installationId }. Rotates the pair.
export async function POST(request: Request) {
  const blocked = guardSameOrigin(request);
  if (blocked) return blocked;

  const refreshToken = await getRefreshToken();
  if (!refreshToken) return errorResponse({ code: "unauthenticated", message: "Please log in again." }, 401);
  if (useMocks) return Response.json({ data: { result: "authenticated" } });

  const result = await backendFetch<AuthenticatedPayload>("/auth/refresh", {
    body: { refreshToken, installationId: await getInstallationId() },
    clientIp: clientIpFrom(request),
  });

  if (!result.ok) {
    // 409 refresh_conflict = another tab already rotated it; keep the session and let the caller retry.
    if (result.error.code === "auth.refresh_conflict") return errorResponse({ code: "refresh_conflict", message: "Please try again." }, 409);
    if (result.status === 401) {
      await clearSession();
      return errorResponse({ code: "unauthenticated", message: "Please log in again." }, 401);
    }
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }

  await setSession(result.data);
  return Response.json({ data: { result: "authenticated" } });
}
