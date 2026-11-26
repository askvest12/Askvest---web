import "server-only";
import { backendFetch, clientIpFrom, type ApiResult, type BackendInit } from "./server";
import { clearSession, getAccessToken, getInstallationId, getRefreshToken, setSession, type AuthenticatedPayload } from "./session";

/**
 * Calls an authenticated backend endpoint with the access token from our cookie.
 * If the token is missing or expired, refreshes once (rotating the pair) and retries.
 */
export async function authedFetch<T>(request: Request, path: string, init: Omit<BackendInit, "accessToken" | "clientIp">): Promise<ApiResult<T>> {
  const clientIp = clientIpFrom(request);
  let token = await getAccessToken();

  if (token) {
    const first = await backendFetch<T>(path, { ...init, accessToken: token, clientIp });
    if (first.ok || first.status !== 401) return first;
  }

  token = await refresh(clientIp);
  if (!token) return { ok: false, status: 401, error: { code: "unauthenticated", message: "Please log in again." } };
  return backendFetch<T>(path, { ...init, accessToken: token, clientIp });
}

async function refresh(clientIp: string | null): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  const r = await backendFetch<AuthenticatedPayload>("/auth/refresh", {
    body: { refreshToken, installationId: await getInstallationId() },
    clientIp,
  });
  if (!r.ok) {
    if (r.status === 401) await clearSession();
    return null;
  }
  await setSession(r.data);
  return r.data.accessToken;
}
