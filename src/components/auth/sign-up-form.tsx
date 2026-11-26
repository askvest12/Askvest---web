"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { AppleIcon, CheckIcon, GoogleIcon, LockIcon, MailIcon, UserIcon } from "@/components/ui/icons";
import { passwordRules, signUpSchema, type SignUpInput } from "@/lib/validation/auth";
import { apiPost, ApiError } from "@/lib/api/client";
import { setPendingEmail } from "@/lib/pending-email";
import { randomId } from "@/lib/random-id";

export function SignUpForm() {
  const router = useRouter();
  const [socialNote, setSocialNote] = useState(false);
  // One key per attempt so a double tap can't create two accounts.
  const idemKey = useRef<string>("");

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", password: "", acceptTerms: false as unknown as true },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  const signUp = useMutation({
    mutationFn: (values: SignUpInput) => apiPost<{ email: string }>("/api/auth/sign-up", values, idemKey.current),
    onSuccess: ({ email }) => {
      setPendingEmail(email);
      router.push("/verify-email");
    },
    onError: (err) => {
      // A failed attempt may be retried with different details, so it needs a fresh key.
      idemKey.current = "";
      if (err instanceof ApiError && err.code === "validation" && err.fields?.length) {
        // Backend rules (e.g. password length, breached passwords) come back per field.
        for (const f of err.fields) {
          const name = f.field.toLowerCase();
          if (name === "password" || name === "email") setError(name, { message: f.message });
        }
        return;
      }
      setError("root", { message: err instanceof ApiError ? err.message : "Something went wrong. Please try again." });
    },
  });

  const onSubmit = handleSubmit((values) => {
    idemKey.current ||= randomId();
    signUp.mutate(values);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-1 flex-col">
      <div className="flex flex-col gap-4">
        <TextField
          label="Full name"
          placeholder="Enter your full name"
          autoComplete="name"
          icon={<UserIcon />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label="Email address"
          type="email"
          inputMode="email"
          placeholder="name@email.com"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          icon={<MailIcon />}
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <TextField
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            revealable
            icon={<LockIcon />}
            error={errors.password ? (password.length === 0 ? "Create a password" : passwordRules.every((r) => r.test(password)) ? errors.password.message : undefined) : undefined}
            {...register("password")}
          />
          {password.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Password requirements">
              {passwordRules.map((r) => {
                const met = r.test(password);
                return (
                  <li
                    key={r.id}
                    className={clsx(
                      "flex items-center gap-1.5 text-[12.5px] font-medium",
                      met ? "text-success" : errors.password ? "text-danger" : "text-ink-subtle",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex size-4 items-center justify-center rounded-full",
                        met ? "bg-mint text-navy" : "border border-current",
                      )}
                      aria-hidden="true"
                    >
                      {met && <CheckIcon className="size-2.5" />}
                    </span>
                    {r.label}
                    <span className="sr-only">{met ? "(done)" : "(not yet)"}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3 text-[13px] leading-5 font-medium text-ink">
            <input
              type="checkbox"
              className="mt-0.5 size-[18px] shrink-0 rounded accent-mint-600"
              aria-invalid={errors.acceptTerms ? true : undefined}
              {...register("acceptTerms")}
            />
            <span>
              I agree to AskVest&apos;s{" "}
              {/* TODO: turn these into links once the Terms and Privacy pages exist */}
              <span className="font-bold text-navy">Terms of Service</span> and{" "}
              <span className="font-bold text-navy">Privacy Policy</span>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-danger">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center gap-3 text-[12.5px] font-medium text-ink-subtle">
        <span className="h-px flex-1 bg-line" />
        or sign up with
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Social sign-in is in the design but not on the backend yet. */}
        <Button variant="social" icon={<GoogleIcon />} onClick={() => setSocialNote(true)}>
          Continue with Google
        </Button>
        <Button variant="apple" icon={<AppleIcon />} onClick={() => setSocialNote(true)}>
          Continue with Apple
        </Button>
        {socialNote && (
          <p role="status" className="text-center text-[12.5px] font-medium text-ink-muted">
            Google and Apple sign-in are coming soon. Please use your email for now.
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-4 pt-6">
        {errors.root && (
          <p role="alert" className="rounded-xl bg-danger-50 px-4 py-3 text-[13px] font-medium text-danger">
            {errors.root.message}
          </p>
        )}
        <Button type="submit" loading={signUp.isPending} loadingText="Creating account…">
          Create account
        </Button>
        <p className="text-center text-[13.5px] font-medium text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-navy hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
