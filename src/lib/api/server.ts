import "server-only";

/**
 * Server-side client for the AskVest .NET API (askvest12/AskVest).
 *
 * The browser never calls the .NET API directly. It calls our Next.js route
 * handlers (/api/...), which call the backend from the server. That keeps
 * tokens out of browser JavaScript (they live in httpOnly cookies) and
 * avoids CORS between Vercel and Render.
 *
 * While BACKEND_API_URL is not set, routes fall back to mocks in ./mocks.ts.
 */

export const BACKEND_API_URL = process.env.BACKEND_API_URL?.replace(/\/+$/, "") || null;
export const useMocks = BACKEND_API_URL === null;

/** Base path of every versioned endpoint (Program.cs: app.MapGroup("/api/v1")). */
const API_PREFIX = "/api/v1";

export type ApiErrorBody = {
  code: string;
  message: string;
  /** Per-field problems from the backend's validation (e.g. the password policy). */
  fields?: { field: string; message: string }[];
  /** Seconds to wait before retrying, from the Retry-After header on 429s. */
  retryAfter?: number;
};

export type ApiResult<T> = { ok: true; status: number; data: T } | { ok: false; status: number; error: ApiErrorBody };

/** The backend's response envelope (IdentityResults.cs / ApiResults.cs). */
type Envelope<T> = {
  success: boolean;
  message: string;
  data: T;
  error: { code: string; details?: { field: string; message: string }[] | null } | null;
  correlationId?: string;
};

const TIMEOUT_MS = 20_000; // Render free instances can take a while to wake up

export type BackendInit = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Required by the backend on state-changing endpoints (header `Idempotency-Key`). */
  idempotencyKey?: string;
  accessToken?: string;
  /** The end user's IP, so the backend can attribute rate limits and security events. */
  clientIp?: string | null;
};

export async function backendFetch<T>(path: string, init: BackendInit = {}): Promise<ApiResult<T>> {
  if (!BACKEND_API_URL) throw new Error("BACKEND_API_URL is not set");

  const headers = new Headers({ Accept: "application/json" });
  if (init.body !== undefined) headers.set("Content-Type", "application/json");
  if (init.idempotencyKey) headers.set("Idempotency-Key", init.idempotencyKey);
  if (init.accessToken) headers.set("Authorization", `Bearer ${init.accessToken}`);
  if (init.clientIp) headers.set("X-Forwarded-For", init.clientIp);

  let res: Response;
  try {
    res = await fetch(`${BACKEND_API_URL}${API_PREFIX}${path}`, {
      method: init.method ?? "POST",
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return unavailable();
  }

  const env = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (res.ok && env?.success) return { ok: true, status: res.status, data: env.data };

  const retry = Number(res.headers.get("retry-after"));
  if (!env) return res.status >= 500 ? unavailable() : fail(res.status, `http_${res.status}`, "Something went wrong. Please try again.");

  return {
    ok: false,
    status: res.status,
    error: {
      code: env.error?.code ?? `http_${res.status}`,
      message: env.message || "Something went wrong. Please try again.",
      fields: env.error?.details ?? undefined,
      retryAfter: Number.isFinite(retry) && retry > 0 ? retry : undefined,
    },
  };
}

function fail(status: number, code: string, message: string): ApiResult<never> {
  return { ok: false, status, error: { code, message } };
}

function unavailable(): ApiResult<never> {
  return fail(503, "unavailable", "We couldn't reach AskVest. Please try again.");
}

/** Best-effort end-user IP as seen by our server (Vercel sets x-forwarded-for). */
export function clientIpFrom(request: Request): string | null {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}
