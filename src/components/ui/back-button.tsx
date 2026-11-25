"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "./icons";

export function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallbackHref))}
      className="flex size-10 items-center justify-center rounded-full border border-line text-navy hover:bg-surface"
    >
      <ArrowLeftIcon />
    </button>
  );
}
