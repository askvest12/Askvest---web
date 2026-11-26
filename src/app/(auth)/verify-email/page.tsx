import type { Metadata } from "next";
import { VerifyEmailFlow } from "@/components/auth/verify-email-flow";

export const metadata: Metadata = { title: "Verify your email" };

// 04 · Email Verification, with 04b incorrect, 04c expired and 04d success states
export default function VerifyEmailPage() {
  return <VerifyEmailFlow />;
}
