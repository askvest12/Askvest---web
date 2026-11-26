"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { ArrowLeftIcon, CheckIcon } from "@/components/ui/icons";
import { PIcon } from "./personalise-icons";
import { apiPost, ApiError } from "@/lib/api/client";
import { randomId } from "@/lib/random-id";
import { countryOptions, experienceOptions, goalOptions } from "@/lib/onboarding-options";
import type { OnboardingInput } from "@/lib/validation/auth";

type Step = 0 | 1 | 2 | 3; // 07 intro, 08 experience, 09 goals, 10 country
const TOTAL = 4; // TODO(design): Figma shows 1/11, 2/4, 3/11, 4/11; using /4 until the counter is fixed

export function PersonaliseFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [familiarity, setFamiliarity] = useState<OnboardingInput["familiarity"]>();
  const [goals, setGoals] = useState<NonNullable<OnboardingInput["goals"]>>([]);
  const [countryId, setCountryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: (body: OnboardingInput) => apiPost<{ saved: true }>("/api/onboarding", body, randomId()),
    onError: (err) => {
      if (err instanceof ApiError && err.code === "unauthenticated") {
        router.push("/login?next=/personalise");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Couldn't save. Please try again.");
    },
  });

  const next = (body?: OnboardingInput) => {
    setError(null);
    if (!body) return setStep((s) => (s + 1) as Step);
    save.mutate(body, {
      onSuccess: () => (step === 3 ? router.replace("/home") : setStep((s) => (s + 1) as Step)),
    });
  };

  const back = () => (step === 0 ? router.back() : setStep((s) => (s - 1) as Step));

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-5 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={back}
          aria-label="Go back"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-navy hover:bg-surface"
        >
          <ArrowLeftIcon />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={step + 1} aria-label="Progress">
          <div className="h-full rounded-full bg-mint transition-all duration-300" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
        </div>
        <span className="w-8 text-right text-[12.5px] font-semibold text-ink-muted">
          {step + 1}/{TOTAL}
        </span>
      </header>

      {step === 0 && <Intro onContinue={() => next()} />}
      {step === 1 && (
        <Experience value={familiarity} onChange={setFamiliarity} onContinue={() => familiarity && next({ familiarity })} saving={save.isPending} error={error} />
      )}
      {step === 2 && <Goals value={goals} onChange={setGoals} onContinue={() => next({ goals })} saving={save.isPending} error={error} />}
      {step === 3 && (
        <Country
          value={countryId}
          onChange={setCountryId}
          onContinue={() => {
            const c = countryOptions.find((o) => o.id === countryId);
            if (c) next({ preferredCurrency: c.currency, ...(c.country ? { country: c.country } : {}) });
          }}
          saving={save.isPending}
          error={error}
        />
      )}
    </main>
  );
}

function Footer({ onContinue, disabled, saving, error }: { onContinue: () => void; disabled?: boolean; saving?: boolean; error?: string | null }) {
  return (
    <div className="mt-auto flex flex-col gap-3 pt-6">
      {error && (
        <p role="alert" className="text-center text-[12.5px] font-medium text-danger">
          {error}
        </p>
      )}
      <Button onClick={onContinue} disabled={disabled} loading={saving} loadingText="Saving…" className="disabled:bg-line disabled:text-ink-subtle disabled:opacity-100">
        Continue
      </Button>
    </div>
  );
}

function Title({ children, sub }: { children: React.ReactNode; sub: string }) {
  return (
    <>
      <h1 className="mt-6 text-[26px] leading-[1.2] font-extrabold tracking-tight text-navy">{children}</h1>
      <p className="mt-2 text-[14px] leading-[1.45] font-medium text-ink-muted">{sub}</p>
    </>
  );
}

/* 07 · Introduction to Personalisation */
function Intro({ onContinue }: { onContinue: () => void }) {
  const chips = [
    { t: "What is an ETF?", c: "top-2 left-0" },
    { t: "Is investing risky?", c: "top-10 right-0" },
    { t: "Where do I start?", c: "bottom-12 left-2" },
    { t: "Costs & fees", c: "bottom-10 right-4", dark: true },
  ];
  return (
    <>
      <div className="relative mx-auto mt-8 flex size-[260px] items-center justify-center" aria-hidden="true">
        <div className="absolute inset-4 rounded-full bg-mint-50" />
        <div className="absolute inset-12 rounded-full bg-mint-100/50" />
        <span className="relative flex size-[84px] items-center justify-center rounded-[22px] bg-navy shadow-[0_14px_30px_rgba(3,25,61,0.3)]">
          <LogoMark className="w-[62%]" />
        </span>
        {chips.map((x) => (
          <span
            key={x.t}
            className={clsx(
              "absolute rounded-full px-3 py-1.5 text-[11.5px] font-semibold shadow-[0_6px_16px_rgba(3,25,61,0.10)]",
              x.dark ? "bg-navy text-white" : "bg-white text-navy",
              x.c,
            )}
          >
            {x.t}
          </span>
        ))}
      </div>
      <h1 className="mt-6 text-[28px] leading-[1.2] font-extrabold tracking-tight text-navy">Let&apos;s make investing make sense for you.</h1>
      <p className="mt-2 text-[14px] leading-[1.45] font-medium text-ink-muted">
        We&apos;ll ask a few quick questions to understand your experience and what you want to achieve.
      </p>
      <span className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-muted">
        <CheckIcon className="size-3.5 text-success" /> About 1 minute · Saved as you go
      </span>
      <Footer onContinue={onContinue} />
    </>
  );
}

type StepProps<T> = { value: T; onChange: (v: T) => void; onContinue: () => void; saving: boolean; error: string | null };

/* 08 · Investment Experience */
function Experience({ value, onChange, onContinue, saving, error }: StepProps<OnboardingInput["familiarity"]>) {
  return (
    <>
      <Title sub="There's no wrong answer. We'll shape AskVest around you.">How familiar are you with investing?</Title>
      <div role="radiogroup" aria-label="Investing experience" className="mt-6 flex flex-col gap-3">
        {experienceOptions.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={clsx(
                "rounded-[var(--radius-card)] border p-4 text-left transition",
                on ? "border-mint-600 bg-mint-50 ring-2 ring-mint/30" : "border-line bg-white hover:bg-surface",
              )}
            >
              <div className="flex items-center gap-3">
                <span className={clsx("flex size-9 items-center justify-center rounded-xl", on ? "bg-navy text-mint" : "bg-surface text-navy")}>
                  <PIcon name={o.icon} />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-navy">{o.title}</p>
                  <p className={clsx("text-[12px] font-medium", on ? "text-success" : "text-ink-subtle")}>{o.subtitle}</p>
                </div>
                <Tick on={on} round />
              </div>
              <ul className="mt-3 flex flex-col gap-1.5 border-t border-line/70 pt-3">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[12.5px] font-medium text-ink-muted">
                    <CheckIcon className="size-3.5 text-success" /> {p}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <Footer onContinue={onContinue} disabled={!value} saving={saving} error={error} />
    </>
  );
}

/* 09 · Investment Goals */
function Goals({ value, onChange, onContinue, saving, error }: StepProps<NonNullable<OnboardingInput["goals"]>>) {
  const toggle = (g: (typeof value)[number]) => onChange(value.includes(g) ? value.filter((x) => x !== g) : [...value, g]);
  return (
    <>
      <Title sub="Choose all that apply. There's no pressure to invest.">What would you like to achieve with AskVest?</Title>
      <div role="group" aria-label="Investment goals" className="mt-6 grid grid-cols-2 gap-3">
        {goalOptions.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => toggle(o.value)}
              className={clsx(
                "relative flex min-h-[112px] flex-col justify-between rounded-[var(--radius-card)] border p-3.5 text-left transition",
                on ? "border-mint-600 bg-mint-50 ring-2 ring-mint/30" : "border-line bg-white hover:bg-surface",
              )}
            >
              <span className="flex items-start justify-between">
                <span className={clsx("flex size-9 items-center justify-center rounded-xl", on ? "bg-navy text-mint" : "bg-surface text-navy")}>
                  <PIcon name={o.icon} />
                </span>
                <Tick on={on} round />
              </span>
              <span className="mt-3 text-[13px] leading-[1.3] font-bold text-navy">{o.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[12.5px] font-semibold text-success" aria-live="polite">
        {value.length > 0 ? `${value.length} selected` : " "}
      </p>
      <Footer onContinue={onContinue} disabled={value.length === 0} saving={saving} error={error} />
    </>
  );
}

/* 10 · Country (10b empty search) */
function Country({ value, onChange, onContinue, saving, error }: StepProps<string | null>) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? countryOptions.filter((o) => `${o.name} ${o.detail} ${o.keywords}`.toLowerCase().includes(t)) : countryOptions;
  }, [q]);

  return (
    <>
      <Title sub="This helps us show investment values in a way that makes sense to you.">Select your country</Title>
      <label className="mt-5 flex h-12 items-center gap-2.5 rounded-[var(--radius-field)] border border-transparent bg-surface px-4 focus-within:border-mint-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-mint/20">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-ink-subtle" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="sr-only">Search currency or country</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search currency or country"
          className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-subtle"
          maxLength={60}
          autoComplete="off"
          enterKeyHint="search"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="flex size-5 items-center justify-center rounded-full bg-line text-[11px] font-bold text-ink-muted">
            ×
          </button>
        )}
      </label>

      {results.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center" role="status">
          <span className="relative flex size-14 items-center justify-center rounded-full bg-mint-50 text-navy" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <p className="mt-4 text-[15px] font-bold text-navy">No country found</p>
          <p className="mt-1 max-w-[260px] text-[12.5px] font-medium text-ink-muted">
            Try another name, code or country. More will appear as they&apos;re supported.
          </p>
          <button type="button" onClick={() => setQ("")} className="mt-4 rounded-[10px] border border-line px-4 py-2 text-[13px] font-bold text-navy hover:bg-surface">
            Clear search
          </button>
        </div>
      ) : (
        <>
          <p className="mt-5 text-[10.5px] font-bold tracking-[0.08em] text-ink-subtle">SUPPORTED</p>
          <div role="radiogroup" aria-label="Country" className="mt-2 flex flex-col gap-2.5">
            {results.map((o) => {
              const on = value === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => onChange(o.id)}
                  className={clsx(
                    "flex items-center gap-3 rounded-[var(--radius-field)] border px-3.5 py-3 text-left transition",
                    on ? "border-mint-600 bg-mint-50 ring-2 ring-mint/30" : "border-line bg-white hover:bg-surface",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.flag} alt="" width={36} height={36} className="size-9 rounded-full" />
                  <span className="flex-1">
                    <span className="block text-[14px] font-bold text-navy">{o.name}</span>
                    <span className="block text-[12px] font-medium text-ink-subtle">{o.detail}</span>
                  </span>
                  <Tick on={on} round />
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[10.5px] font-bold tracking-[0.08em] text-ink-subtle">NOT AVAILABLE IN THE US</p>
        </>
      )}
      <Footer onContinue={onContinue} disabled={!value} saving={saving} error={error} />
    </>
  );
}

function Tick({ on, round }: { on: boolean; round?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "flex size-5 shrink-0 items-center justify-center border-[1.5px]",
        round ? "rounded-full" : "rounded-md",
        on ? "border-navy bg-navy text-white" : "border-line bg-white",
      )}
    >
      {on && <CheckIcon className="size-3" />}
    </span>
  );
}
