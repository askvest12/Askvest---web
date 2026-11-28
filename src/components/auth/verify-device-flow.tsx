"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, ButtonLink } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { OtpInput } from "@/components/ui/otp-input";
import { AlertIcon, IconTile, InfoNote } from "@/components/ui/feedback";
import { LockIcon } from "@/components/ui/icons";
import { apiPost, ApiError } from "@/lib/api/client";
import { useDeviceEmail } from "@/lib/pending-email";
import { safeNext } from "@/lib/safe-next";
import { OTP_LENGTH } from "@/lib/validation/auth";

/**
 * New-device check after login. Not in Figma yet, so it reuses the
 * verification-code layout. The backend has no resend endpoint: logging in
 * again issues a fresh code.
 */
export function VerifyDeviceFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const email = useDeviceEmail();
  const [code, setCode] = useState("");
  const [error, setError] = useState<{ message: string; expired?: boolean } | null>(null);
  const autoSubmitted = useRef("");

  const verify = useMutation({
    mutationFn: (c: string) => apiPost<{ result: "authenticated" }>("/api/auth/verify-device", { code: c }),
    onSuccess: () => router.replace(next),
    onError: (err) => {
      if (err instanceof ApiError && err.code === "challenge_missing") return setError({ message: err.message, expired: true });
      if (err instanceof ApiError && err.code === "code_invalid") return setError({ message: "That code isn't right or has expired. Check it and try again." });
      setError({ message: err instanceof ApiError ? err.message : "Something went wrong. Please try again." });
    },
  });

  const onChange = (v: string) => {
    setCode(v);
    if (error && !error.expired) setError(null);
    if (v.length === OTP_LENGTH && autoSubmitted.current !== v && !verify.isPending) {
      autoSubmitted.current = v;
      verify.mutate(v);
    }
  };

  const loginAgain = `/login${next !== "/home" ? `?next=${next}` : ""}`;

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <BackButton fallbackHref="/login" />
      <div className="mt-5">
        <IconTile badge="dot">
          <LockIcon className="size-6" />
        </IconTile>
      </div>
      <h1 className="mt-5 text-[28px] leading-tight font-extrabold tracking-tight text-navy">Confirm it&apos;s you</h1>
      <p className="mt-1.5 text-[14px] leading-[1.45] font-medium text-ink-muted">
        You&apos;re signing in on a new device. We&apos;ve sent a 6-digit code to{" "}
        {email ? <strong className="font-bold text-navy">{email}</strong> : "your email"}. Enter it below to continue.
      </p>

      <div className="mt-8">
        <OtpInput
          value={code}
          onChange={onChange}
          autoFocus
          label="Device verification code"
          status={error?.expired || verify.isPending ? "disabled" : error ? "error" : "idle"}
        />
      </div>

      <div aria-live="polite">
        {error && (
          <p role="alert" className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-danger">
            <AlertIcon className="size-4" /> {error.message}
          </p>
        )}
      </div>

      <InfoNote className="mt-6">
        Didn&apos;t get it? Check spam, or{" "}
        <Link href={loginAgain} className="font-bold text-navy underline underline-offset-2">
          log in again
        </Link>{" "}
        to get a new code. If this wasn&apos;t you, change your password.
      </InfoNote>

      <div className="mt-auto flex flex-col gap-4 pt-8">
        {error?.expired ? (
          <ButtonLink href={loginAgain}>Log in again</ButtonLink>
        ) : (
          <Button
            onClick={() => verify.mutate(code)}
            disabled={code.length !== OTP_LENGTH}
            loading={verify.isPending}
            loadingText="Verifying…"
            className="disabled:bg-line disabled:text-ink-subtle disabled:opacity-100"
          >
            Verify Device
          </Button>
        )}
      </div>
    </main>
  );
}
