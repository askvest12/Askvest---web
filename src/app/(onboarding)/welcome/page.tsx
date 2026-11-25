import type { Metadata } from "next";
import { IntroCarousel } from "@/components/onboarding/intro-carousel";

export const metadata: Metadata = { title: "Welcome" };

// 02 · Welcome / Introduction + Onboarding 2 and 3
export default function WelcomePage() {
  return <IntroCarousel />;
}
