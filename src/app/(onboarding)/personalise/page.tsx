import type { Metadata } from "next";
import { PersonaliseFlow } from "@/components/onboarding/personalise-flow";

export const metadata: Metadata = { title: "Personalise" };

// 07 Intro, 08 Experience, 09 Goals, 10 Country (10b empty search). Needs a logged-in user.
export default function PersonalisePage() {
  return <PersonaliseFlow />;
}
