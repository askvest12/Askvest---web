import "server-only";
import type { ApiErrorBody } from "./server";

/**
 * Turns backend errors into the codes and copy our screens use.
 * Backend codes: docs/design/01-api-standards.md in askvest12/AskVest.
 */
export function toUiError(error: ApiErrorBody, status: number): { body: ApiErrorBody; status: number } {
  switch (error.code) {
    case "auth.invalid_credentials":
      return { status: 401, body: { code: "invalid_credentials", message: "Incorrect email or password." } };
    case "auth.invalid_code":
      // Backend uses one code for wrong, expired, used and too-many-attempts.
      return { status: 400, body: { code: "code_invalid", message: "That code isn't right. Check it and try again." } };
    case "auth.email_not_verified":
      return { status: 403, body: { code: "email_not_verified", message: "Please verify your email first." } };
    case "auth.account_disabled":
      return { status: 403, body: { code: "account_disabled", message: "This account is disabled. Contact support." } };
    case "validation.failed":
      return {
        status: 400,
        body: {
          code: "validation",
          message: error.fields?.[0]?.message ?? "Please check your details and try again.",
          fields: error.fields,
        },
      };
  }

  if (status === 429) {
    const wait = error.retryAfter ? ` in ${formatWait(error.retryAfter)}` : " in a moment";
    return { status, body: { code: "rate_limited", message: `Too many attempts. Please try again${wait}.`, retryAfter: error.retryAfter } };
  }
  if (status >= 500 || error.code === "unavailable") {
    return { status: 503, body: { code: "unavailable", message: "We couldn't reach AskVest. Please try again." } };
  }
  // Don't pass unknown backend messages straight to users.
  return { status, body: { code: error.code, message: "Something went wrong. Please try again." } };
}

function formatWait(seconds: number) {
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
  const m = Math.ceil(seconds / 60);
  return m === 1 ? "1 minute" : `${m} minutes`;
}
