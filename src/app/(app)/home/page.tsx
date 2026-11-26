import type { Metadata } from "next";
import { ComingNext } from "@/components/ui/coming-next";

export const metadata: Metadata = { title: "Home" };

// TODO: protect with the session cookie once real auth is wired, and build the home screen.
export default function HomePage() {
  return <ComingNext title="You're logged in" note="Your account is set up. The home screen is coming soon." />;
}
