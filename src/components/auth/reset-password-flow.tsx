"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button, ButtonLink } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { OtpInput } from "@/components/ui/otp-input";
import { TextField } from "@/components/ui/text-field";
import { AlertIcon, IconTile, InfoNote } from "@/components/ui/feedback";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { PasswordChecklist } from "./password-checklist";
import { apiPost, ApiError } from "@/lib/api/client";
import { randomId } from "@/lib/random-id";
import { clearResetEmail, useResetEmail } from "@/lib/pending-email";
import { useCountdown } from "@/lib/use-countdown";
import { OTP_LENGTH, passwordRules, resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";

const RESEND_SECONDS = 60;

/**
 * Enter verification code -> Set New Password.
 * The backend checks the code only when the new password is submitted, so a
 * wrong or expired code sends the user back to the code step.
 */
export function ResetPasswordFlow() {
  const email = useResetEmail();
  const [step, setStep] = useState<"code" | "password">("code");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  if (email === undefined) return <main className="flex-1" />;
  if (email === null) return <MissingEmail />;

  return step === "code" ? (
    <CodeStep
      email={email}
      code={code}
      error={codeError}
      onChange={(c) => {
        setCode(c);
        setCodeError(null);
      }}
      onContinue={() => setStep("password")}
    />
  ) : (
    <PasswordStep
      email={email}
      code={code}
      onBack={() => setStep("code")}
      onBadCode={(msg) => {
        setCode("");
        setCodeError(msg);
        setStep("code");
      }}
    />
  );
}

function CodeStep({
  email,
  code,
  error,
  onChange,
  onContinue,
}: {
  email: string;
  code: string;
  error: string | null;
  onChange: (c: string) => void;
  onContinue: () => void;
}) {
  const timer = useCountdown(RESEND_SECONDS);
  const [resendNote, setResendNote] = useState<string | null>(null);
  const resend = useMutation({
    mutationFn: () => apiPost<{ sent: true }>("/api/auth/forgot-password", { email }, randomId()),
    onSuccess: () => {
      onChange("");
      setResendNote("We've sent a new code.");
      timer.restart();
    },
    onError: (err) => setResendNote(err instanceof ApiError ? err.message : "Couldn't send a new code. Please try again."),
  });

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <BackButton fallbackHref="/forgot-password" />
      <div className="mt-5">
        <IconTile badge="dot">
          <MailIcon className="size-6" />
        </IconTile>
      </div>
      <h1 className="mt-5 text-[28px] leading-tight font-extrabold tracking-tight text-navy">Enter verification code</h1>
      <p className="mt-1.5 text-[14px] leading-[1.45] font-medium text-ink-muted">
        If an account exists for <strong className="font-bold text-navy">{email}</strong>, we&apos;ve sent a 6-digit code. Enter it
        below to continue.
      </p>

      <div className="mt-8">
        <OtpInput value={code} onChange={onChange} autoFocus status={error ? "error" : "idle"} label="Password reset code" />
      </div>

      <div aria-live="polite">
        {error && (
          <p role="alert" className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-danger">
            <AlertIcon className="size-4" /> {error}
          </p>
        )}
        {resendNote && !error && <p className="mt-3 text-[12.5px] font-medium text-success">{resendNote}</p>}
      </div>

      <p className="mt-5 text-center text-[13px] font-medium text-ink-muted">
        Didn&apos;t get the code?{" "}
        {timer.done ? (
          <button type="button" onClick={() => resend.mutate()} disabled={resend.isPending} className="font-bold text-success hover:underline disabled:opacity-60">
            {resend.isPending ? "Sending…" : "Resend code"}
          </button>
        ) : (
          <span className="font-bold text-success">Resend in {timer.label}</span>
        )}
      </p>
      <InfoNote className="mt-5">Can&apos;t find it? Check your spam or promotions folder.</InfoNote>

      <div className="mt-auto flex flex-col gap-4 pt-8">
        <Button onClick={onContinue} disabled={code.length !== OTP_LENGTH} className="disabled:bg-line disabled:text-ink-subtle disabled:opacity-100">
          Verify Code
        </Button>
        <p className="text-center text-[13.5px] font-medium text-ink-muted">
          Wrong address?{" "}
          <Link href="/forgot-password" className="font-bold text-navy underline underline-offset-2">
            Change email
          </Link>
        </p>
      </div>
    </main>
  );
}

function PasswordStep({ email, code, onBack, onBadCode }: { email: string; code: string; onBack: () => void; onBadCode: (msg: string) => void }) {
  const router = useRouter();
  const idemKey = useRef("");
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { email, code, password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" }) ?? "";

  const reset = useMutation({
    mutationFn: (v: ResetPasswordInput) => apiPost<{ reset: true }>("/api/auth/reset-password", v, idemKey.current),
    onSuccess: () => {
      clearResetEmail();
      router.replace("/login?reset=1");
    },
    onError: (err) => {
      idemKey.current = "";
      if (err instanceof ApiError && err.code === "code_invalid") {
        onBadCode("That code isn't right or has expired. Check it, or request a new one.");
        return;
      }
      if (err instanceof ApiError && err.code === "validation" && err.fields?.length) {
        for (const f of err.fields) if (f.field.toLowerCase() === "password") setError("password", { message: f.message });
        if (!err.fields.some((f) => f.field.toLowerCase() === "password")) setError("root", { message: err.message });
        return;
      }
      setError("root", { message: err instanceof ApiError ? err.message : "Something went wrong. Please try again." });
    },
  });

  const rulesMet = passwordRules.every((r) => r.test(password));

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex size-10 items-center justify-center rounded-full border border-line text-navy hover:bg-surface"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </button>
      <div className="mt-5">
        <IconTile>
          <LockIcon className="size-6" />
        </IconTile>
      </div>
      <h1 className="mt-5 text-[28px] leading-tight font-extrabold tracking-tight text-navy">Set New Password</h1>
      <p className="mt-1.5 text-[14px] leading-[1.45] font-medium text-ink-muted">Enter your new password below.</p>

      <form
        onSubmit={handleSubmit((v) => {
          idemKey.current ||= randomId();
          reset.mutate(v);
        })}
        noValidate
        className="mt-7 flex flex-1 flex-col"
      >
        {/* Hidden username helps password managers save the new password against the right account */}
        <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
        <div className="flex flex-col gap-4">
          <div>
            <TextField
              label="New Password"
              placeholder="Create a new password"
              autoComplete="new-password"
              revealable
              icon={<LockIcon />}
              error={errors.password ? (password.length === 0 ? "Create a password" : rulesMet ? errors.password.message : undefined) : undefined}
              {...register("password")}
            />
            <PasswordChecklist password={password} showErrors={!!errors.password} />
          </div>
          <TextField
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            revealable
            icon={<LockIcon />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-8">
          {errors.root && (
            <p role="alert" className="rounded-xl bg-danger-50 px-4 py-3 text-[13px] font-medium text-danger">
              {errors.root.message}
            </p>
          )}
          <Button type="submit" loading={reset.isPending} loadingText="Resetting…">
            Reset Password
          </Button>
          <Link href="/login" className="text-center text-[13.5px] font-bold text-navy hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </main>
  );
}

function MissingEmail() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-6">
      <BackButton fallbackHref="/login" />
      <h1 className="mt-5 text-[28px] font-extrabold text-navy">Reset your password</h1>
      <p className="mt-2 text-[14px] font-medium text-ink-muted">Start by entering your email so we can send you a reset code.</p>
      <div className="mt-auto">
        <ButtonLink href="/forgot-password">Enter email</ButtonLink>
      </div>
    </main>
  );
}
