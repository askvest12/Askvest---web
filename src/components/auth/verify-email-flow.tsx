"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, ButtonLink } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { OtpInput } from "@/components/ui/otp-input";
import { AlertIcon, ClockIcon, IconTile, InfoNote } from "@/components/ui/feedback";
import { CheckIcon, MailIcon } from "@/components/ui/icons";
import { apiPost, ApiError } from "@/lib/api/client";
import { usePendingEmail } from "@/lib/pending-email";
import { randomId } from "@/lib/random-id";
import { OTP_LENGTH } from "@/lib/validation/auth";
import { useCountdown } from "@/lib/use-countdown";

const RESEND_SECONDS = 60;
type Status = "entering" | "incorrect" | "expired" | "verified";

export function VerifyEmailFlow() {
  const email = usePendingEmail();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("entering");
  const [formError, setFormError] = useState<string | null>(null);
  const timer = useCountdown(RESEND_SECONDS);
  const autoSubmitted = useRef("");

  const verify = useMutation({
    mutationFn: (c: string) => apiPost<{ verified: true }>("/api/auth/verify-email", { email, code: c }, randomId()),
    onSuccess: () => setStatus("verified"),
    onError: (err) => {
      if (err instanceof ApiError && err.code === "code_expired") return setStatus("expired");
      if (err instanceof ApiError && err.code === "code_invalid") return setStatus("incorrect");
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    },
  });

  const resend = useMutation({
    mutationFn: () => apiPost<{ sent: true }>("/api/auth/resend-code", { email }, randomId()),
    onSuccess: () => {
      setCode("");
      autoSubmitted.current = "";
      setStatus("entering");
      setFormError(null);
      timer.restart();
    },
    onError: (err) => setFormError(err instanceof ApiError ? err.message : "Couldn't send a new code. Please try again."),
  });

  const onCodeChange = (v: string) => {
    setCode(v);
    setFormError(null);
    if (status === "incorrect") setStatus("entering");
    // Submit automatically once all 6 digits are in (once per code, so a wrong code isn't resent in a loop).
    if (v.length === OTP_LENGTH && autoSubmitted.current !== v && !verify.isPending) {
      autoSubmitted.current = v;
      verify.mutate(v);
    }
  };

  if (email === undefined) return <main className="flex-1" />;
  if (email === null) return <MissingEmail />;
  if (status === "verified") return <Verified />;

  const expired = status === "expired";

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <BackButton fallbackHref="/sign-up" />
      <div className="mt-5">
        <IconTile badge="dot">
          <MailIcon className="size-6" />
        </IconTile>
      </div>
      <h1 className="mt-5 text-[28px] leading-tight font-extrabold tracking-tight text-navy">
        {expired ? "Code expired" : "Verify your email"}
      </h1>
      <p className="mt-1.5 text-[14px] leading-[1.45] font-medium text-ink-muted">
        {expired ? (
          "For your security, verification codes only work for a short time. Request a new one to continue."
        ) : (
          <>
            We&apos;ve sent a 6-digit verification code to <strong className="font-bold text-navy">{email}</strong>. Enter it below
            to continue.
          </>
        )}
      </p>

      <div className="mt-8">
        <OtpInput
          value={code}
          onChange={onCodeChange}
          autoFocus
          status={expired || verify.isPending ? "disabled" : status === "incorrect" ? "error" : "idle"}
        />
      </div>

      <div aria-live="polite">
        {status === "incorrect" && (
          <p role="alert" className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-danger">
            <AlertIcon className="size-4" /> That code isn&apos;t right. Check it and try again.
          </p>
        )}
        {formError && (
          <p role="alert" className="mt-3 text-[12.5px] font-medium text-danger">
            {formError}
          </p>
        )}
      </div>

      {expired ? (
        <InfoNote className="mt-5" icon={<ClockIcon className="text-navy" />}>
          <p className="font-bold text-navy">This code is no longer valid.</p>
          <p>Tap &ldquo;Send a new code&rdquo; to get a fresh one.</p>
        </InfoNote>
      ) : (
        <>
          <p className="mt-5 text-center text-[13px] font-medium text-ink-muted">
            Didn&apos;t get the code?{" "}
            {timer.done ? (
              <button
                type="button"
                onClick={() => resend.mutate()}
                disabled={resend.isPending}
                className="font-bold text-success hover:underline disabled:opacity-60"
              >
                {resend.isPending ? "Sending…" : "Resend code"}
              </button>
            ) : (
              <span className="font-bold text-success">Resend in {timer.label}</span>
            )}
          </p>
          {status === "entering" && (
            <InfoNote className="mt-5">Can&apos;t find it? Check your spam or promotions folder.</InfoNote>
          )}
        </>
      )}

      <div className="mt-auto flex flex-col gap-4 pt-8">
        {expired ? (
          <>
            <Button onClick={() => resend.mutate()} loading={resend.isPending} loadingText="Sending…">
              Send a new code
            </Button>
            <ButtonLink href="/sign-up" variant="secondary">
              Change email
            </ButtonLink>
          </>
        ) : (
          <>
            <Button
              onClick={() => verify.mutate(code)}
              disabled={code.length !== OTP_LENGTH}
              loading={verify.isPending}
              loadingText="Verifying…"
              className="disabled:bg-line disabled:text-ink-subtle disabled:opacity-100"
            >
              Verify Email
            </Button>
            <p className="text-center text-[13.5px] font-medium text-ink-muted">
              Wrong address?{" "}
              <Link href="/sign-up" className="font-bold text-navy underline underline-offset-2">
                Change email
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

function Verified() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pb-[max(20px,env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative flex size-[200px] items-center justify-center rounded-full border border-mint/40" aria-hidden="true">
          <span className="absolute top-6 left-3 size-2 rounded-full bg-mint" />
          <span className="absolute right-2 bottom-12 size-2.5 rounded-full bg-line" />
          <div className="flex size-[140px] items-center justify-center rounded-full bg-mint-50">
            <div className="flex size-[72px] items-center justify-center rounded-full bg-gradient-to-b from-mint-100 to-mint text-navy shadow-[0_10px_24px_rgba(93,233,209,0.45)]">
              <CheckIcon className="size-8" />
            </div>
          </div>
        </div>
        <h1 className="mt-8 text-[28px] font-extrabold tracking-tight text-navy" tabIndex={-1} autoFocus>
          Email verified
        </h1>
        <p className="mt-2 max-w-[280px] text-[14px] leading-[1.45] font-medium text-ink-muted">
          Your account is ready. Next, a few quick questions so AskVest can fit you.
        </p>
      </div>
      {/* Verifying doesn't log the user in (no tokens), and onboarding needs a session. */}
      <ButtonLink href="/login?next=/personalise">Continue</ButtonLink>
    </main>
  );
}

function MissingEmail() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-6">
      <BackButton fallbackHref="/welcome" />
      <h1 className="mt-5 text-[28px] font-extrabold text-navy">Verify your email</h1>
      <p className="mt-2 text-[14px] font-medium text-ink-muted">
        We couldn&apos;t find which email to verify. Please sign up again, or log in if you already have an account.
      </p>
      <div className="mt-auto flex flex-col gap-3">
        <ButtonLink href="/sign-up">Create account</ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          Log in
        </ButtonLink>
      </div>
    </main>
  );
}
