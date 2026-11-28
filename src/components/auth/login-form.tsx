"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { ErrorBanner } from "@/components/ui/feedback";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { apiPost, ApiError } from "@/lib/api/client";
import { setDeviceEmail, setPendingEmail } from "@/lib/pending-email";
import { safeNext } from "@/lib/safe-next";

// 05 · Login, 05b error, 05c loading. "Use biometrics" is hidden until the backend supports passkeys.
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const justReset = params.get("reset") === "1";
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const login = useMutation({
    mutationFn: (values: LoginInput) =>
      apiPost<{ result: "authenticated" | "device_verification_required" }>("/api/auth/login", values),
    onSuccess: (data, values) => {
      if (data.result === "device_verification_required") {
        // Backend emailed a code to confirm this new device.
        setDeviceEmail(values.email);
        router.push(`/verify-device${next !== "/home" ? `?next=${next}` : ""}`);
        return;
      }
      router.replace(next);
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === "invalid_credentials") {
        setError("root.credentials", { message: "Incorrect email or password." });
        return;
      }
      if (err instanceof ApiError && err.code === "email_not_verified") {
        setPendingEmail(getValues("email"));
        router.push("/verify-email");
        return;
      }
      setError("root.server", { message: err instanceof ApiError ? err.message : "Something went wrong. Please try again." });
    },
  });

  const badCredentials = !!errors.root?.credentials;
  const clearBanner = () => {
    if (errors.root) clearErrors("root");
  };

  return (
    <form onSubmit={handleSubmit((v) => login.mutate(v))} noValidate className="mt-6 flex flex-1 flex-col">
      <div className="flex flex-col gap-4">
        {justReset && !errors.root && (
          <p role="status" className="rounded-[14px] bg-mint-50 px-4 py-3 text-[13px] font-semibold text-success">
            Password updated. Log in with your new password.
          </p>
        )}
        {badCredentials && <ErrorBanner title="Incorrect email or password.">Please check your details and try again.</ErrorBanner>}
        {errors.root?.server && <ErrorBanner title={errors.root.server.message ?? "Something went wrong."} />}

        <TextField
          label="Email address"
          type="email"
          inputMode="email"
          placeholder="name@email.com"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          icon={<MailIcon />}
          error={errors.email?.message ?? (badCredentials ? " " : undefined)}
          {...register("email", { onChange: clearBanner })}
        />
        <TextField
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          revealable
          icon={<LockIcon />}
          error={errors.password?.message ?? (badCredentials ? " " : undefined)}
          {...register("password", { onChange: clearBanner })}
        />
        <Link href="/forgot-password" className="self-end text-[13px] font-bold text-success hover:underline">
          Forgot password?
        </Link>
      </div>

      <div className="mt-6">
        <Button type="submit" loading={login.isPending} loadingText="Logging in…">
          Log in
        </Button>
      </div>

      <p className="mt-auto pt-8 text-center text-[13.5px] font-medium text-ink-muted">
        New to AskVest?{" "}
        <Link href="/sign-up" className="font-bold text-navy underline underline-offset-2">
          Create account
        </Link>
      </p>
    </form>
  );
}
