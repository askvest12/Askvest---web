import Image from "next/image";
import { LogoBadge, LogoMark } from "@/components/ui/logo";
import { CheckIcon, CoinsIcon, GiftIcon, TrendIcon } from "@/components/ui/icons";

/** Mint glow in the top-right corner, shared by the three slides. */
function MintGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-10 -right-24 h-[420px] w-[360px] rotate-[24deg] bg-gradient-to-b from-mint/60 via-mint/20 to-transparent blur-2xl"
    />
  );
}

/** Slide 1: AI chat preview. Content is illustrative, as labelled in the design. */
export function AskAiArt() {
  return (
    <div className="relative h-full min-h-[400px] px-5 pt-14">
      <MintGlow />
      <div className="relative ml-auto w-fit max-w-[225px] rounded-2xl bg-navy px-4 py-2.5 text-[13.5px] font-medium text-white">
        Explain Apple stock to me like I&apos;m new
      </div>

      <div className="relative mt-4 mr-5 rounded-[20px] bg-white p-4 shadow-[0_12px_32px_rgba(3,25,61,0.10)]">
        <div className="flex items-center gap-2.5">
          <LogoBadge className="size-8" />
          <div>
            <p className="text-[14px] font-bold text-navy">AskVest AI</p>
            <p className="text-[11px] font-medium text-ink-subtle">Answering in plain English</p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-5 font-medium text-ink">
          Apple designs and sells iPhones, Macs and services. Here&apos;s what to look at first:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["The business", "Risks", "Costs"].map((t) => (
            <span key={t} className="rounded-full bg-surface-mint px-3 py-1.5 text-[12px] font-semibold text-navy">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 border-t border-line pt-3">
          <svg viewBox="0 0 160 30" className="h-7 flex-1" fill="none" aria-hidden="true">
            <path
              d="M2 20c8 0 10-8 18-6s8 10 16 8 6-14 14-14 8 14 16 12 8-10 16-8 8 10 16 6 8-12 16-14 8 6 16 2 10-8 16-8"
              stroke="#64D8CB"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[11px] font-medium text-ink-subtle">Illustrative only</span>
        </div>
      </div>

      <div className="relative mt-4 flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12.5px] font-semibold text-navy shadow-[0_6px_18px_rgba(3,25,61,0.08)]">
        <span className="size-3.5 rounded-full border-[3px] border-mint" aria-hidden="true" />
        Practice with virtual credits
      </div>
      <div className="relative mt-3 mr-5 ml-auto flex w-fit items-center gap-2 rounded-full bg-navy px-3.5 py-2 text-[12.5px] font-semibold text-white">
        <TrendIcon className="text-mint" />
        Stocks &amp; ETFs
      </div>
    </div>
  );
}

/** Slide 2: virtual account card. Sample details are placeholders from the design. */
export function VirtualAccountArt() {
  return (
    <div className="relative flex h-full min-h-[400px] flex-col items-center justify-center px-5 pt-10">
      <MintGlow />
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-[20px] bg-navy p-5 text-white shadow-[0_20px_40px_rgba(3,25,61,0.25)]">
        <LogoMark className="pointer-events-none absolute -right-8 -bottom-10 w-[170px] opacity-10" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[16px] font-bold">
            <LogoBadge className="size-7 bg-white/10" /> Askvest
          </span>
          <span className="rounded-full bg-mint px-3 py-1 text-[11px] font-bold text-navy">Virtual account</span>
        </div>
        <p className="mt-5 text-[10.5px] font-semibold tracking-[0.08em] text-white/60">ACCOUNT NUMBER</p>
        <p className="mt-1 text-[24px] font-bold tracking-[0.06em] text-mint">0123 4567 89</p>
        <p className="mt-2 text-[10.5px] font-medium text-white/60">Account name</p>
        <p className="text-[14px] font-semibold">Tobi Adeyemi</p>
      </div>
      <div className="relative -mt-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(3,25,61,0.10)]">
        <span className="flex size-10 items-center justify-center rounded-xl bg-mint text-navy">
          <CoinsIcon />
        </span>
        <div>
          <p className="text-[12px] font-medium text-ink-muted">Practice balance</p>
          <p className="text-[22px] font-extrabold text-navy">$10,000.00</p>
        </div>
      </div>
    </div>
  );
}

/** Slide 3: gifting preview over a photo. */
export function GiftArt() {
  return (
    <div className="relative h-full min-h-[400px]">
      <Image
        src="/onboarding/friends.webp"
        alt="Four friends smiling at a phone together"
        fill
        priority={false}
        sizes="(max-width: 430px) 100vw, 430px"
        className="object-cover object-top"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />

      <div className="absolute bottom-10 left-5 w-[252px] rounded-[18px] bg-white p-4 shadow-[0_16px_36px_rgba(3,25,61,0.16)]">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-surface-mint text-navy">
            <GiftIcon />
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-[0.08em] text-mint-600">GIFT A SHARE</p>
            <p className="text-[13.5px] font-bold text-navy">Apple · 1 share</p>
          </div>
        </div>
        <div className="my-3 h-px bg-line" />
        <p className="text-[12px] font-medium text-ink-subtle">To</p>
        <div className="mt-1.5 flex items-center gap-3">
          <span className="flex size-[34px] items-center justify-center rounded-full bg-surface text-[14px] font-bold text-navy">T</span>
          <div className="flex-1">
            <p className="text-[13.5px] font-bold text-navy">Tobi Adeyemi</p>
            <p className="text-[11px] font-medium text-ink-subtle">@tobi</p>
          </div>
          <span className="rounded-[10px] bg-navy px-3.5 py-1.5 text-[12px] font-bold text-white">Send</span>
        </div>
      </div>

      <div className="absolute right-5 bottom-0 flex w-[170px] items-center gap-2.5 rounded-2xl bg-white p-2.5 shadow-[0_12px_28px_rgba(3,25,61,0.14)]">
        <span className="flex size-[31px] items-center justify-center rounded-lg bg-mint text-navy">
          <CheckIcon />
        </span>
        <div>
          <p className="text-[12px] font-bold text-navy">Gift delivered</p>
          <p className="text-[10px] font-medium text-ink-muted">Tobi now owns a share</p>
        </div>
      </div>
    </div>
  );
}
