import type { Metadata } from "next";
import { ComingNext } from "@/components/ui/coming-next";

export const metadata: Metadata = { title: "Personalise" };

// TODO: 07 to 10b personalisation (waiting on backend endpoints)
export default function PersonalisePage() {
  return <ComingNext title="Let's make investing make sense for you." note="The personalisation questions are being built next." />;
}
