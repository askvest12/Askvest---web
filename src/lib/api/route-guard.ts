import "server-only";
import type { z } from "zod";

type Guarded<T> = { ok: true; data: T } | { ok: false; response: Response };

const json = (status: number, code: string, message: string) =>
  Response.json({ error: { code, message } }, { status });

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

/**
 * Compares the browser's Origin with the host the browser actually used.
 * (request.url can't be used: behind dev servers and proxies it holds the
 * internal address, e.g. 0.0.0.0, not the one in the address bar.)
 */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin GETs and some older browsers omit it; JSON + SameSite cookies still apply
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function errorResponse(error: { code: string; message: string }, status: number) {
  return Response.json({ error }, { status });
}
