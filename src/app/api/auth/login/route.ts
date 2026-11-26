import { loginSchema } from "@/lib/validation/auth";
import { backendFetch, clientIpFrom, useMocks } from "@/lib/api/server";
import { mockLogin } from "@/lib/api/mocks";
import type { AuthenticatedPayloadLike } from "@/lib/api/mock-types";
import { toUiError } from "@/lib/api/errors";
import { errorResponse, guardJson } from "@/lib/api/route-guard";
import { deviceNameFrom, getInstallationId, setDeviceChallenge, setSession } from "@/lib/api/session";

// POST /api/v1/auth/login { email, password, device }. No idempotency key (backend exempts login).
export async function POST(request: Request) {
  const input = await guardJson(request, loginSchema);
  if (!input.ok) return input.response;
  const { email, password } = input.data;

  const device = {
    installationId: await getInstallationId(),
    platform: "web",
    deviceName: deviceNameFrom(request.headers.get("user-agent")),
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
  };

  const result = useMocks
    ? await mockLogin(email, password)
    : await backendFetch<AuthenticatedPayloadLike>("/auth/login", {
        body: { email, password, device },
        clientIp: clientIpFrom(request),
      });

  if (!result.ok) {
    const { body, status } = toUiError(result.error, result.status);
    return errorResponse(body, status);
  }

  if (result.data.result === "device_verification_required") {
    // The backend emailed a code to confirm this new device.
    await setDeviceChallenge(result.data.challengeId);
    return Response.json({ data: { result: "device_verification_required" } });
  }

  await setSession(result.data);
  // Tokens stay in httpOnly cookies; nothing sensitive goes back in the body.
  return Response.json({ data: { result: "authenticated" } });
}
