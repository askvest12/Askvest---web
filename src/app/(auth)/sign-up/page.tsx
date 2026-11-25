import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = { title: "Create your account" };

// 03 · Sign Up (version with Google / Apple), with 03b validation states
export default function SignUpPage() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <BackButton fallbackHref="/welcome" />
      <h1 className="mt-5 text-[30px] leading-tight font-extrabold tracking-tight text-navy">Create your account</h1>
      <p className="mt-1.5 text-[15px] font-medium text-ink-muted">Start learning and investing in minutes.</p>
      <SignUpForm />
    </main>
  );
}
