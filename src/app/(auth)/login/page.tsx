import type { Metadata } from "next";
import { ComingNext } from "@/components/ui/coming-next";

export const metadata: Metadata = { title: "Log in" };

// TODO: 05 · Login (+ 05b error, 05c loading). Biometrics button hidden per backend.
export default function LoginPage() {
  return <ComingNext title="Welcome back" note="The login screen is the next one being built." />;
}
