import "server-only";

/**
 * Server-side client for the AskVest .NET API.
 *
 * The browser never calls the .NET API directly. It calls our Next.js route
 * handlers (/api/...), which call the backend from the server. That keeps
 * tokens out of browser JavaScript (they will live in httpOnly cookies) and
 * avoids CORS between Vercel and Render.
 *
 * While BACKEND_API_URL is not set, routes fall back to mocks in ./mocks.ts.
 */

export const BACKEND_API_URL = process.env.BACKEND_API_URL?.replace(/\/+$/, "") || null;
export const useMocks = BACKEND_API_URL === null;

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: { code: string; message: string } };

const TIMEOUT_MS = 15_000;

/**
 * Calls the backend and unwraps its response envelope.
 * TODO(backend): confirm the envelope shape from the OpenAPI spec once it is on Render.
 * This currently accepts { data } / { error: { code, message } } and plain bodies.
 */
export async function backendFetch<T>(
  path: string,
  init: RequestInit & { idempotencyKey?: string } = {},
): Promise<ApiResult<T>> {
  if (!BACKEND_API_URL) throw new Error("BACKEND_API_URL is not set");

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (init.idempotencyKey) headers.set("Idempotency-Key", init.idempotencyKey);

  let res: Response;
  try {
    res = await fetch(`${BACKEND_API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // Render free instances can take a while to wake up.
    return { ok: false, status: 503, error: { code: "unavailable", message: "We couldn't reach AskVest. Please try again." } };
  }

  const body: unknown = await res.json().catch(() => null);
  const envelope = (body ?? {}) as { data?: T; error?: { code?: string; message?: string } };

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: {
        code: envelope.error?.code ?? `http_${res.status}`,
        message: envelope.error?.message ?? "Something went wrong. Please try again.",
      },
    };
  }
  return { ok: true, status: res.status, data: (envelope.data ?? body) as T };
}
