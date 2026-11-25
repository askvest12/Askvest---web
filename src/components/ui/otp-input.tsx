"use client";

import { clsx } from "clsx";
import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  status?: "idle" | "error" | "disabled";
  autoFocus?: boolean;
  label?: string;
};

/**
 * 6-box code input. Digits only, auto-advances, Backspace goes back,
 * pasting a full code fills every box, and Android/iOS can autofill it
 * from the email (autocomplete="one-time-code").
 */
export function OtpInput({ value, onChange, length = 6, status = "idle", autoFocus, label = "Verification code" }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  const disabled = status === "disabled";

  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, length));
  };

  const fill = (raw: string, from: number) => {
    const clean = raw.replace(/\D/g, "");
    if (!clean) return;
    const next = digits.slice();
    for (let k = 0; k < clean.length && from + k < length; k++) next[from + k] = clean[k];
    onChange(next.join(""));
    focus(Math.min(from + clean.length, length - 1));
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      e.preventDefault();
      setAt(i - 1, "");
      focus(i - 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(i + 1);
    }
  };

  const onPaste = (i: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    fill(e.clipboardData.getData("text"), i);
  };

  return (
    <div role="group" aria-label={label} className="flex justify-between gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={status === "error" || undefined}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={onKeyDown(i)}
          onPaste={onPaste(i)}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "");
            if (v.length > 1) return fill(v, i); // OS autofill drops the whole code in one box
            setAt(i, v);
            if (v) focus(i + 1);
          }}
          className={clsx(
            "aspect-square w-full max-w-[52px] rounded-[var(--radius-field)] border text-center text-[22px] font-bold text-navy outline-none transition",
            status === "error" && "border-danger bg-danger-50",
            status === "disabled" && "border-line bg-surface text-ink-subtle",
            status === "idle" &&
              (d ? "border-line bg-surface-mint" : "border-line bg-white") +
                " focus:border-mint-600 focus:bg-white focus:ring-4 focus:ring-mint/20",
          )}
        />
      ))}
    </div>
  );
}
