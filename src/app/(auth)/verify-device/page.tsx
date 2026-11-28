import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyDeviceFlow } from "@/components/auth/verify-device-flow";

export const metadata: Metadata = { title: "Confirm it's you" };

// New-device code after login (not in Figma yet; reuses the code screen layout)
export default function VerifyDevicePage() {
  return (
    <Suspense>
      <VerifyDeviceFlow />
    </Suspense>
  );
}
