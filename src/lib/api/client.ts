// Browser-side helper for calling our own /api route handlers.

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

/**
 * POST to one of our /api routes. Pass an idempotencyKey for actions the backend
 * must not repeat (sign up, verify, resend, reset); reuse it when retrying the same attempt.
 */
export async function apiPost<T>(path: `/api/${string}`, body: unknown, idempotencyKey?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const res = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    credentials: "same-origin",
  }).catch(() => {
    throw new ApiError(0, "network", "You seem to be offline. Check your connection and try again.");
  });

  const json = (await res.json().catch(() => ({}))) as {
    data?: T;
    error?: { code: string; message: string; fields?: { field: string; message: string }[] };
  };
  if (!res.ok) {
    throw new ApiError(
      res.status,
      json.error?.code ?? "unknown",
      json.error?.message ?? "Something went wrong. Please try again.",
      json.error?.fields,
    );
  }
  return json.data as T;
}
