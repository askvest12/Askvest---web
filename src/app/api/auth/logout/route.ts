import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { guardSameOrigin, idempotencyKeyFrom } from "@/lib/api/route-guard";
import { clearSession, getAccessToken } from "@/lib/api/session";

// POST /api/v1/auth/logout (authenticated). Always clears our cookies, even if the backend call fails.
export async function POST(request: Request) {
  const blocked = guardSameOrigin(request);
  if (blocked) return blocked;

  const accessToken = await getAccessToken();
  if (accessToken && !useMocks) {
    await backendFetch<null>("/auth/logout", {
      accessToken,
      idempotencyKey: idempotencyKeyFrom(request),
      clientIp: clientIpFrom(request),
    });
  }
  await clearSession();
  return Response.json({ data: { loggedOut: true } });
}
