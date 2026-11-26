import type { AuthenticatedPayload } from "./session";
export type { ApiResult } from "./server";

export type DeviceChallengePayload = { result: "device_verification_required"; challengeId: string; expiresAt: string };
export type AuthenticatedPayloadLike = AuthenticatedPayload | DeviceChallengePayload;
