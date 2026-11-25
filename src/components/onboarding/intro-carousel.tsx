"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { PageDots } from "@/components/ui/page-dots";
import { AskAiArt, GiftArt, VirtualAccountArt } from "./intro-art";

const slides = [
  {
    id: "ask",
    title: "Investing starts with a question.",
    body: "Learn, explore and invest with AI-powered guidance, one simple conversation at a time.",
    Art: AskAiArt,
  },
  {
    id: "virtual",
    title: "Own a virtual account",
    body: "Get your AskVest virtual account and learn investing without using real funds.",
    Art: VirtualAccountArt,
  },
  {
    id: "gift",
    title: "Gift stocks to your friends",
    body: "Gift a share and let your friends own a piece of the investment.",
    Art: GiftArt,
  },
] as const;

export function IntroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Native scroll-snap does the swiping; we only track which slide is in view.
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive((prev) => (prev === i ? prev : i));
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <main className="flex min-h-dvh flex-1 flex-col">
      <div
        ref={trackRef}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="AskVest introduction"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(Math.min(active + 1, slides.length - 1));
          if (e.key === "ArrowLeft") goTo(Math.max(active - 1, 0));
        }}
      >
        {slides.map(({ id, title, body, Art }, i) => (
          <section
            key={id}
            className="relative flex w-full shrink-0 snap-center flex-col overflow-hidden"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={i !== active}
          >
            <div className="relative flex flex-1 flex-col justify-center">
              <Art />
            </div>
            <div className="relative px-5 pb-6">
              <h1 className="text-[30px] leading-[1.15] font-extrabold tracking-tight text-navy">{title}</h1>
              <p className="mt-3 text-[15px] leading-6 font-medium text-ink-muted">{body}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
        <PageDots count={slides.length} active={active} />
        <div className="flex w-full flex-col gap-3">
          <ButtonLink href="/sign-up">Get Started</ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            I already have an account
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
