"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { TextField } from "@/components/ui/text-field";
import { IconTile } from "@/components/ui/feedback";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { emailOnlySchema, type EmailOnlyInput } from "@/lib/validation/auth";
import { apiPost, ApiError } from "@/lib/api/client";
import { randomId } from "@/lib/random-id";
import { setResetEmail } from "@/lib/pending-email";

// 06 · Forgot Password. The backend emails a 6-digit code, entered on /reset-password.
export function ForgotPasswordFlow() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailOnlyInput>({ resolver: zodResolver(emailOnlySchema), defaultValues: { email: "" } });

  const send = useMutation({
    mutationFn: (v: EmailOnlyInput) => apiPost<{ sent: true }>("/api/auth/forgot-password", v, randomId()),
    onSuccess: (_d, v) => {
      setResetEmail(v.email);
      router.push("/reset-password");
    },
    onError: (err) => setError("root", { message: err instanceof ApiError ? err.message : "Something went wrong. Please try again." }),
  });

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <BackButton fallbackHref="/login" />
      <div className="mt-5">
        <IconTile>
          <LockIcon className="size-6" />
        </IconTile>
      </div>
      <h1 className="mt-5 text-[28px] leading-tight font-extrabold tracking-tight text-navy">Forgot password?</h1>
      <p className="mt-1.5 text-[14px] leading-[1.45] font-medium text-ink-muted">
        Enter the email linked to your account and we&apos;ll send you a code to reset your password.
      </p>
      <form onSubmit={handleSubmit((v) => send.mutate(v))} noValidate className="mt-7 flex flex-1 flex-col">
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
        {errors.root && (
          <p role="alert" className="mt-3 text-[12.5px] font-medium text-danger">
            {errors.root.message}
          </p>
        )}
        <div className="mt-auto flex flex-col gap-4 pt-8">
          <Button type="submit" loading={send.isPending} loadingText="Sending…">
            Send code
          </Button>
          <Link href="/login" className="text-center text-[13.5px] font-bold text-navy hover:underline">
            Return to Login
          </Link>
        </div>
      </form>
    </main>
  );
}
