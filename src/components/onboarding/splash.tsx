"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogoMark } from "@/components/ui/logo";

const SPLASH_MS = 1600;

export function Splash() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/welcome");
    const t = setTimeout(() => router.replace("/welcome"), SPLASH_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center overflow-hidden bg-navy text-white">
      {/* Decorative "A" shape behind the logo (Figma: Vector 3087) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/onboarding/splash-bg.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[11%] left-[-14%] w-[137%] max-w-none select-none"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-3">
        <LogoMark className="w-[132px]" />
        <h1 className="text-[34px] font-extrabold tracking-tight">Askvest</h1>
      </div>

      <div className="relative mb-[max(56px,env(safe-area-inset-bottom))] flex flex-col items-center gap-3" role="status">
        <div className="h-2 w-[62px] overflow-hidden rounded-full bg-white/20">
          <span className="block h-full w-2/3 rounded-full bg-mint motion-safe:animate-[loader-slide_1.2s_ease-in-out_infinite]" />
        </div>
        <p className="text-[12.5px] font-medium text-white/70">Preparing your experience</p>
      </div>
    </main>
  );
}
