import "server-only";
import type { z } from "zod";
import type { ApiErrorBody } from "./server";
import { randomUUID } from "node:crypto";

type Guarded<T> = { ok: true; data: T } | { ok: false; response: Response };

const json = (status: number, code: string, message: string) => Response.json({ error: { code, message } }, { status });

/**
 * Shared checks for our /api route handlers:
 * - JSON only
 * - same-origin only (blocks other sites posting to us with the user's cookies)
 * - body validated with the same Zod schema the form uses
 */
export async function guardJson<S extends z.ZodType>(request: Request, schema: S): Promise<Guarded<z.infer<S>>> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, response: json(415, "bad_request", "Invalid request.") };
  }
  if (!isSameOrigin(request)) {
    return { ok: false, response: json(403, "forbidden", "Invalid origin.") };
  }
  const body: unknown = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, response: json(400, "validation", "Please check your details and try again.") };
  }
  return { ok: true, data: parsed.data };
}

/** Same-origin check for bodiless POSTs (logout, refresh). */
export function guardSameOrigin(request: Request): Response | null {
  return isSameOrigin(request) ? null : json(403, "forbidden", "Invalid origin.");
}

/**
 * Compares the browser's Origin with the host the browser actually used.
 * (request.url can't be used: behind dev servers and proxies it holds the
 * internal address, e.g. 0.0.0.0, not the one in the address bar.)
 */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // some browsers omit it on same-origin requests; JSON + SameSite cookies still apply
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Idempotency-Key to send to the backend: the browser's key when it is valid
 * (so a retried tap is recognised as the same request), otherwise a fresh one.
 * Backend rule: 8 to 128 chars of [A-Za-z0-9_.:-].
 */
export function idempotencyKeyFrom(request: Request): string {
  const k = request.headers.get("idempotency-key");
  return k && /^[A-Za-z0-9_.:-]{8,128}$/.test(k) ? k : randomUUID();
}

export function errorResponse(error: ApiErrorBody, status: number) {
  const headers = error.retryAfter ? { "Retry-After": String(Math.ceil(error.retryAfter)) } : undefined;
  return Response.json({ error }, { status, headers });
}
