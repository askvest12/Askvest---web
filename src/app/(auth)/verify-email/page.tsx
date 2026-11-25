import type { Metadata } from "next";
import { ComingNext } from "@/components/ui/coming-next";

export const metadata: Metadata = { title: "Verify your email" };

// TODO: 04 · Email Verification (+ 04b incorrect, 04c expired, 04d success)
export default function VerifyEmailPage() {
  return (
    <ComingNext
      title="Verify your email"
      note="Your account was created (mock). The 6-digit code screen is being built next."
    />
  );
}
